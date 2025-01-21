from fastapi import WebSocket
from typing import Dict
import random
import math



class Player:
    def __init__(self,socket:WebSocket):

        self.type = "NULL"

        self.socket = socket

        self.x = 1
        self.y = 1
        self.angle = 3.14/2
        
        self.rotation_speed = 3.14/8
        self.mov_speed = 0.5



class Game:
    def __init__(self):

        self.players: Dict[str, Player] = {}

        self.max_number_of_players = 2 
        self.max_number_of_keys_to_win = 5

        self.end_game = False
        
        
        self.map = [[1,1,1,1,1,1,1],
                    [1,0,0,0,0,0,1],
                    [1,0,0,0,0,0,1],
                    [1,0,1,0,1,0,1],
                    [1,0,0,0,0,0,1],
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

        elif data == "disconnect":
            print(player_name,"disconnected")
            await self.player_disconnect(player_name)
        
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
        # game start 
        await self.give_types_to_players()

        response = {
            "map": self.map,
            "players_info": self.Players_to_json(),
            "number_of_keys_to_win": self.max_number_of_keys_to_win
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
            player = self.player_to_json(p_name,position)
            players[p_name] = player

        return players


    


    def player_to_json(self,player_name : str , position:bool=False):
        
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

        nex_j = int(nex_x)
        nex_i = int(nex_y)

        map = self.map

        if map[nex_i][nex_j] == 1:
            return
            # while map[nex_i][nex_j] == 1 and vx > 0.01 and vy > 0.01:
            #     vx /= 2
            #     vy /= 2
            #     nex_x -= vx
            #     nex_y -= vy
            #     nex_j = int(nex_x)
            #     nex_i = int(nex_y)

        player.x = nex_x
        player.y = nex_y




    def player_rotation(self,player_name:str,rotation_type:str):

        player = self.players[player_name]

        if rotation_type == "rotation to right":
            player.angle -= player.rotation_speed

        elif rotation_type == "rotation to left":
            player.angle += player.rotation_speed

   
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


    async def player_disconnect(self,player_name:str):
        print(player_name,"disconnected")
        await  self.players[player_name].socket.close()
        self.players.pop(player_name)
        await self.players_broadcast_message(player_name,"player disconnected","disconnected")
        
    


