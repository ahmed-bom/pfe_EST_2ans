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
        self.mov_speed = 0.2





# ===========================================================
# ===================== DEF PARAMETER OF GAME ===============
# ===========================================================

DEF_NUMBER_OF_PLAYERS = 3

DEF_NUMBER_OF_KEYS = 3

# DEF_MAP_DIM == 2k + 1
DEF_MAP_DIM = 7

DEF_LOBE_MAP = [[1,1,1,1,1,1,1],
                [1,0,0,0,0,0,1],
                [1,0,0,1,0,0,1],
                [1,0,0,1,0,0,1],
                [1,0,0,1,0,0,1],
                [1,0,0,0,0,0,1],
                [1,1,1,1,1,1,1]] 



class Game:
    def __init__( self,number_of_players : int = DEF_NUMBER_OF_PLAYERS ,
                  number_of_keys : int = DEF_NUMBER_OF_KEYS ,
                  map_dim : int = DEF_MAP_DIM ,
                  lobe : list = DEF_LOBE_MAP):

        self.players: Dict[str, Player] = {}
        self.number_of_players = number_of_players

        self.keys = {}
        self.number_of_keys = number_of_keys

        self.ports = {}
        # number_of_ports == 2

        self.lobe = lobe
        self.map = lobe
        self.map_dim = map_dim


# ===========================================================
# ===================== JSON ================================
# ===========================================================



    def message_to_json(self,From:str,Content,Type: str="message"):
        response = {
            "from": From,
            "type": Type,
            "content" :Content,
        }
        return response
    
    def game_info(self):

        response = {
            "map": self.map,
            "players_info": self.Players_to_json(),
            "keys": self.keys
        }

        return response
    

    def Players_to_json(self):

        players = {}
        for p_name in self.players.keys():

            player = self.player_to_json(p_name)
            if player == 1: continue
            players[p_name] = player

        return players



    def player_to_json(self,player_name: str):

        player = self.players[player_name]
        if player.type == "spectate":
            return 1
        p = {
            "type": player.type,
            "x": player.x,
            "y": player.y,
            "angle": player.angle
            }

        return p   
    

# ===========================================================
# ======================= message ===========================
# ===========================================================


    async def player_privet_message(self,target_name:str,content,type: str="message"):

        response = self.message_to_json("server",content,type)
        await self.players[target_name].socket.send_json(response)



    async def players_broadcast_message(self,From:str,content,type: str="message"):

        response = self.message_to_json(From,content,type)
        for  p_name in self.players.keys():
            if p_name == From :
                continue
            p = self.players[p_name]
            await p.socket.send_json(response)

# ===========================================================
# =================== connected to game =====================
# ===========================================================

    async def new_player(self,name:str,socket:WebSocket):

        p = Player(socket)
        self.players[name] = p

        print(name,"connected successfully")
        await self.go_to_lobe(name)

        

    async def go_to_lobe(self,player_name:str = "server"):
        print("enter_lobe")
        response = self.game_info()
        # if server send players to lobe
        if player_name == "server": 
            await self.players_broadcast_message(player_name,response,"enter_lobe")
            return 0
        # if player enter lobe
        player_info = self.player_to_json(player_name)
        
        await self.player_privet_message(player_name,response,"enter_lobe")
        await self.players_broadcast_message(player_name,player_info,"new_connected")
        
        # TODO: start game in beater way
        if self.number_of_players == len(self.players):
            await self.start()

 
# ===========================================================
# =================== start of game =========================
# ===========================================================


    async def start(self):

        print("start game")
        # game start settings
        await self.give_types_to_players()
        # generate map
        new_map ,start, end = generate_maze(self.map_dim)
        self.ports = {
            "p1": start,
            "p2": end
        }
        add_ports(new_map)
        self.map = new_map.tolist()
        # generate keys
        self.keys = add_points(new_map,self.number_of_keys)
        # set players position in start point

        for p in self.players.values():
            if p.type == "prey":
                p.x = start[1]+0.5
                p.y = start[0]+0.5
            else:
                p.x = end[1]+0.5
                p.y = end[0]+0.5
        
        # send start game
        response = self.game_info()
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

        ps = self.Players_to_json()
        await self.players_broadcast_message("server",ps,"players_position")

        
# ===========================================================
# =================== medal of game =========================
# ===========================================================

    async def player_listener(self,player_name:str,data:str):
        if data == "move":
            await self.move_player(player_name)
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



    async def move_player(self,player_name:str):

        player = self.players[player_name]
        x = player.x
        y = player.y
        angle = player.angle
        speed = player.mov_speed

        vx = math.sin(angle)
        vy = math.cos(angle)

        nex_x = x + vx * speed
        nex_y = y + vy * speed 

        nex_j = int(nex_x)
        nex_i = int(nex_y)

        if self.map[nex_i][nex_j] == 1:
            return
        

        player.x = nex_x
        player.y = nex_y

 
        await self.check_prey_win(player_name)



    def player_rotation(self,player_name:str,rotation_type:str):
 
        player = self.players[player_name]
        
        if rotation_type == "rotation to right":
            angle = player.angle + player.rotation_speed

        elif rotation_type == "rotation to left":
            angle = player.angle - player.rotation_speed

        player.angle = angle % (2 * math.pi)




    async def player_click(self,player_name):
 
        player = self.players[player_name]
        x = int(player.x)
        y = int(player.y)

        if player.type == "prey":
            key = str(y)+str(x)
            await self.prey_collect_key(key,player_name)
            
        elif player.type == "hunter":
            await self.hunter_kill(player_name,x,y)
                        


    async def player_disconnect(self,player_name:str,socket:WebSocket):
        print(player_name,"disconnected")
        self.players.pop(player_name)
        await self.players_broadcast_message(player_name,player_name,"disconnected")  



    async def hunter_kill(self,player_name,x,y):
       
        for prey_name in self.players.keys():
            if player_name == prey_name : 
                continue
            prey = self.players[prey_name]
            if x == int(prey.x) and y == int(prey.y):
                prey.type = "spectate"
                await self.players_broadcast_message(player_name,prey_name,"kill")
                await self.check_hunter_win()  


    async def prey_collect_key(self,key,player_name):
        
        if key in self.keys:
            self.keys.pop(key)
            r = key
            await self.players_broadcast_message(player_name,r,"get_key")



# ===========================================================
# =================== end of game ===========================
# ===========================================================
                                                               
    async def check_hunter_win(self):
        for p_name in self.players.keys():
            if self.players[p_name].type == "prey":
                return
        await self.game_over()
    

    async def check_prey_win(self,player_name):

        player = self.players[player_name]
        if player.type != "prey": return 
         
        if len(self.keys) == 0: 
            x = int(player.x)
            y = int(player.y)
            for port in self.ports.values():
                if x == port[1] and y == port[0]:
                    player.type = "spectate"
                    await self.players_broadcast_message("server",player_name,"win")
                    await self.check_hunter_win()
        return              
        
    
    async def game_over(self):
        
        self.map = self.lobe
        self.keys = {}
        for p_name in self.players.keys():
            player = self.players[p_name]
            player.type = "NULL"
            player.x = 1.5
            player.y = 1.5
            player.angle = 0
        print("game over") 
        await self.players_broadcast_message('server',"game over")
        await self.go_to_lobe("server")

                
    


