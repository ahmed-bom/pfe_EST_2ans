from fastapi import WebSocket
from typing import Dict
import random
import math



class Player:
    def __init__(self,socket:WebSocket):

        # self.name = name
        self.type = "NULL"

        self.socket = socket

        self.x = random.randint(0,6)
        self.y = random.randint(0,6)
        self.angle = 3.14/2
        
        self.rotation_speed = 3.14/4
        self.mov_speed = 0.5

class Game:
    def __init__(self):

        self.players: Dict[str, Player] = {}
        self.players_number_limit = 2
        
        self.end_game = False
        
        self.map = [[1,1,1,1,1,1,1],
                    [1,0,0,0,0,0,1],
                    [1,0,0,0,0,0,1],
                    [1,0,0,0,0,0,1],
                    [1,0,0,0,0,0,1],
                    [1,1,1,1,1,1,1]]
        
        

        
    async def new_player(self,name:str,socket:WebSocket):
        
        self.players_number_limit -= 1

        p = Player(socket)
        self.players[name] = p

        print(name,"connected successfully")
        await self.players_broadcast_message(name,"connected successfully")
        
        if self.players_number_limit == 0:
            await self.give_types_to_players()
            await self.start_round()
            
   
    async def give_types_to_players(self):

        rand = random.randint(0,len(self.players)-1) 
        ps_keys = list(self.players.keys())
        # random player will be hunter
        hunter_name = ps_keys[rand]
        self.players[hunter_name].type = "hunter"
        await self.player_privet_message(hunter_name,"you are the hunter")
        # adar players will be prey
        for p_name in self.players.keys():
            if p_name == hunter_name:
                continue
            self.players[p_name].type = "prey"
            await self.player_privet_message(p_name,"you are a prey")

    async def start_round(self):
            print("start round")
            
            response = {
                "map": self.map,
                "players_info": self.Players_to_json(),
            }
            await self.players_broadcast_message("server",response,"start_round")
            # start new round

            
    
    async def get_players_position(self):
        
        ps = self.players_position()
        await self.players_broadcast_message("server",ps,"players_position")

        

    def Players_to_json(self):

        players = []
        for p_name in self.players.keys():
            player = self.player_to_json(p_name)
            players.append(player)

        return players

    def  players_position(self):

        players = []
        for p_name in self.players.keys():
            player = self.player_position(p_name)
            players.append(player)

        return players

    def player_to_json(self,player_name : str):
        
        player = self.players[player_name]

        p = {
            "name": player_name,
            "type": player.type,
            "x": player.x,
            "y": player.y,
            "angle": player.angle,
            "rotation_speed": player.rotation_speed,
            "mov_speed": player.mov_speed,
        }

        return p
    
    def player_position(self,player_name:str):

        player = self.players[player_name]

        p = {
            "x": player.x,
            "y": player.y,
            "angle": player.angle
            }
        
        return p

    def player_move(self,player_name:str):

        player = self.players[player_name]
        angle = player.angle

        player.x += math.sin(angle)*player.mov_speed
        player.y += math.cos(angle)*player.mov_speed

    def player_rotation(self,player_name:str,rotation_type:str):

        player = self.players[player_name]

        if rotation_type == "rotation to right":
            player.angle -= player.rotation_speed
        elif rotation_type == "rotation to left":
            player.angle += player.rotation_speed

    async def player_disconnect(self,player_name:str,message:str="disconnected"):

        await self.players_broadcast_message(player_name,message)
        await  self.players[player_name].socket.close()
        self.players.pop(player_name)
        
    async def player_privet_message(self,target_name:str,content,type: str="message"):
        response = {
            "type": type,
            "from": 'server',
            "content" : content,
        }
        # TODO: check if player if it works
        await self.players[target_name].socket.send_json(response)

    async def players_broadcast_message(self,from_name:str,content,type: str="message"):
    
        response = {
            "type": type,
            "from": from_name,
            "content" : content,
        }
        for  p in self.players.values():
            await p.socket.send_json(response)

        
    


