from fastapi import FastAPI, WebSocket
from pydantic import BaseModel
import uvicorn
import random


from typing import Dict
from game import *


from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


#  for CORS
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)







forbidden_names = ["server"]
forbidden_words = ["kill"]

ranked_games: Dict[str, Game] = {}
ranked_games["f0"] = Game()
ranked_id = "f0"

private_games: Dict[str, Game] = {}
private_games["test"] = Game()

public_games: Dict[str, Game] = {}
public_games["test"] = Game()



def get_game_id(n:int = 5):

    l = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
    game_id = ""
    for i in range(n):
        game_id += random.choice(l) 

    return game_id

def get_game(game_type,game_id):

    if game_type == "public":
        if game_id in public_games:
            return public_games[game_id]
        return 404

    elif game_type == "private":
        if game_id in private_games:
            return private_games[game_id]
        return 404
    
    elif game_type == "ranked":
        return 0
    
    return 404

def can_player_enter_the_game(game,player_name):

    # check if player name is valid
    if len(player_name) > 20 or len(player_name) < 5 or player_name in forbidden_names:
        print("player name not valid")
        return 400
    
    # check if game start
    if game.is_start:
        print("game is start")
        return 400
    
    # check if game is foll
    if len(game.players) == game.number_of_players:
        print("game is foll")
        return 400
    
    # check if player is already in game
    if player_name in game.players:
        print("player is already in game")
        return 400 
    
    
    return 200




@app.post("/new_game/{type}")
async def new_game(type:str = "public",number_of_players : int = DEF_NUMBER_OF_PLAYERS ,number_of_keys : int = DEF_NUMBER_OF_KEYS ,map_dim : int = DEF_MAP_DIM ,lobe : list = DEF_LOBE_MAP):

    game_id = get_game_id()
    game =  Game(type,number_of_players,number_of_keys,map_dim,lobe)

    if type == "public":
        public_games[game_id] = game
    else:
        private_games[game_id] = game

    return game_id




@app.websocket("/ws/{game_type}/{game_id}/{player_name}")
async def websocket_endpoint(game_type,game_id:str,player_name:str,websocket: WebSocket):
    
    print(game_type,game_id)
    game = get_game(game_type,game_id)
    print(game)
    # check if game exists
    if game == 404 : 
        print("game : 404")
        return 404
    
    
    if can_player_enter_the_game(game,player_name) == 400:
        print("player can not enter the game : 400")
        return 400
    
    # open connection and create player
    await websocket.accept()
    await game.new_player(player_name,websocket)
    
    try:
        while True:
            
            data = await websocket.receive_text()

            if data[0] == "/":
                data = data[1:] 
                for word in forbidden_words:
                    data = data.replace(word,"******")

                await game.players_broadcast_message(player_name,data)

            else:
                if  game.players[player_name].type != "spectate":
                    await game.player_listener(player_name,data)
              
    except Exception as e:
        print(e)
        await game.player_disconnect(player_name,websocket)
        return 500
    

def get_ranked_game():
    # TODO
    game = ranked_games[ranked_id]
    if game.start:
        game_id = get_game_id()
        ranked_id = game_id
        game = Game()
        ranked_games[game_id] = game
    return game
    
        





if __name__ == "__main__":
    uvicorn.run("main:app", host= "127.0.0.1",port= 8080,reload= True)
    