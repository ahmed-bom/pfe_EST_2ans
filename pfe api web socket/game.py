from fastapi import WebSocket
from typing import Dict
import random
import math
from maze_generate import *



class Player:
    def __init__(self,socket:WebSocket):

        self.type = "NULL"

        self.socket = socket

        self.x = 1.5
        self.y = 1.5
        self.angle = 0
        
        self.rotation_speed = 3.14/8
        self.mov_speed = 0.1



class Game:
    def __init__(self):

        self.players: Dict[str, Player] = {}

        self.max_number_of_players = 3 
        self.number_of_keys_to_win = 5

        self.end_game = False
        
        
        self.map = [[1,1,1,1,1,1,1],
                    [1,0,0,0,0,0,1],
                    [1,0,0,1,0,0,1],
                    [1,0,0,1,0,0,1],
                    [1,0,0,1,0,0,1],
                    [1,0,0,0,0,0,1],
                    [1,1,1,1,1,1,1]] 
        self.map_dim = len(self.map[0])

    async def player_listener(self,player_name:str,data:str):

        if data == "move":
            self.move_player(player_name)
            await self.get_players_position()

        elif data == "rotation to right" or data == "rotation to left":
            self.player_rotation(player_name,data)
            await self.get_players_position()
        
        elif data == "click":
            await self.player_click(player_name)
            await self.get_players_position()

        elif data == "disconnect":
            print(player_name,"disconnected")
            await self.player_disconnect(player_name,self.players[player_name].socket)
        
        else:
            await self.player_privet_message(player_name,"invalid command")



    async def new_player(self,name:str,socket:WebSocket):

        p = Player(socket)
        self.players[name] = p
        self.max_number_of_players -= 1

        print(name,"connected successfully")
        await self.go_to_lobe(name)
        

    async def go_to_lobe(self,player_name:str):
    
        print(player_name,"entered lobe")
        
        response = {
            "map": self.map,
            "players_info": self.Players_to_json(),
        }

        player_info = self.player_to_json(player_name)

        await self.player_privet_message(player_name,response,"connected_successfully")
        await self.players_broadcast_message(player_name,player_info,"new_connected")
        
        if self.max_number_of_players == 0:
            await self.start()


    async def start(self):

        print("start game")
        # game start settings
        await self.give_types_to_players()
        # generate map
        new_map ,start, end = generate_maze(self.map_dim)
        add_points(new_map,self.number_of_keys_to_win)
        add_ports(new_map)
        self.map = new_map.tolist()
        # set players position
        for p in self.players.values():
            if p.type == "prey":
                p.x = start[1]+0.5
                p.y = start[0]+0.5
            elif p.type == "hunter":
                p.x = end[1]+0.5
                p.y = end[0]+0.5
        
        # send start game
        response = {
            "map": self.map,
            "players_info": self.Players_to_json(),
            "number_of_keys_to_win": self.number_of_keys_to_win
        }

        await self.players_broadcast_message("server",response,"game_start")
    
    
  
   
    async def give_types_to_players(self):

        ps_keys = list(self.players.keys())
        # random player will be hunter
        hunter_name = random.choice(ps_keys)
        # adar players will be prey
        for p_name in self.players.keys():

            if p_name == hunter_name:
                self.players[hunter_name].type = "hunter"
                await self.player_privet_message(hunter_name,"you are the hunter")
                continue

            self.players[p_name].type = "prey"
            await self.player_privet_message(p_name,"you are a prey")





    
    async def get_players_position(self): 
        ps = self.Players_to_json(position=True)
        await self.players_broadcast_message("server",ps,"players_position")

        

    def Players_to_json(self,position:bool=False):

        players = {}
        for p_name in self.players.keys():
            type = self.players[p_name].type
            if type == "spectate" : continue
            player = self.player_to_json(p_name,position)
            
            players[p_name] = player

        return players


    

    def player_to_json(self,player_name: str , position:bool=False):

        player = self.players[player_name]

        p = {
            "x": player.x,
            "y": player.y,
            "angle": player.angle
            }
        if position == False:
            p["type"] = player.type

        return p
    

    def move_player(self,player_name:str):

        player = self.players[player_name]
        x = player.x
        y = player.y
        angle = player.angle

        vx = math.sin(angle)*player.mov_speed
        vy = math.cos(angle)*player.mov_speed 

        nex_x = x + vx
        nex_y = y + vy

        nex_j = int(nex_x + 0.2)
        nex_i = int(nex_y + 0.2)

        map = self.map

        if map[nex_i][nex_j] == 1:
            return

        player.x = nex_x
        player.y = nex_y



    def player_rotation(self,player_name:str,rotation_type:str):
 
        player = self.players[player_name]
        
        if rotation_type == "rotation to right":
            angle = player.angle - player.rotation_speed

        elif rotation_type == "rotation to left":
            angle = player.angle + player.rotation_speed

        player.angle = angle % (2 * math.pi)


    async def player_click(self,player_name):
 
        player = self.players[player_name]
        x = int(player.x)
        y = int(player.y)

        if player.type == "prey":
            if self.map[y][x] == 2:
                self.map[y][x] = 0
                r = {
                    "x":x,
                    "y":y
                }
                await self.players_broadcast_message(player_name,r,"get_key")
        elif player.type == "hunter":
            for prey_name in self.players.keys():

                if player_name == prey_name : 
                    continue
                prey = self.players[prey_name]
                if x == int(prey.x) and y == int(prey.y):
                    self.players[prey_name].type = "spectate"
                    await self.players_broadcast_message(player_name,prey_name,"kill")
                      
                



    
    

   
    async def player_privet_message(self,target_name:str,content,type: str="message"):

        response = {
            "type": type,
            "from": 'server',
            "content" : content,
        }

        await self.players[target_name].socket.send_json(response)


    async def players_broadcast_message(self,from_name:str,content,type: str="message"):
    
        response = {
            "type": type,
            "from": from_name,
            "content" : content,
        }

        for  p_name in self.players.keys():
            if p_name == from_name :
                continue
            p = self.players[p_name]
            await p.socket.send_json(response)


    async def player_disconnect(self,player_name:str,socket:WebSocket):
        print(player_name,"disconnected")
        await socket.close()
        if player_name in self.players:
            self.players.pop(player_name)
        await self.players_broadcast_message("server",f"player {player_name} disconnected","disconnected")   
        
    


