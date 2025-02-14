from fastapi import FastAPI, WebSocket
from pydantic import BaseModel
import uvicorn
import random


from typing import Dict
from game import Game


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


#  for data validation 
# class type_ban(BaseModel):
#     name = 'name'
#     word = 'word'
# class baned(BaseModel):
#     token: str
#     type: type_ban
#     content: str
#     reason: str
    
    




# TODO data base
# @app.post("/baned")
# async def new_game(baned:baned):

#     if baned.token != "azertyuiop":
#         return 404
    
    
#     if baned.type == "word":
#         forbidden_names.append(baned.content)
    
#     elif baned.type == "name":
#         forbidden_names.append(baned.content)

#     return 200





forbidden_names = ["server"]
forbidden_words = ["kill"]

private_games: Dict[str, Game] = {}
private_games["test"] = Game()

public_games = {}

@app.get("/new_game/{public}")
async def new_game(public:str = "false"):

    l = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
    game_id = ""

    for i in range(5):
        game_id += random.choice(l) 

    if public == "true":
        public_games[game_id] = Game()
    else:
        private_games[game_id] = Game()

    return game_id




@app.websocket("/ws/{game_id}/{player_name}")
async def websocket_endpoint(game_id:str,player_name:str,websocket: WebSocket):
    
    # check if game exists

    if game_id in public_games:
        game = public_games[game_id]
        game_type = "public"
    elif game_id in private_games:
        game = private_games[game_id]
        game_type = "private"
    else:
        return 404

    # check if game is full
    if game.number_of_players == len(game.players):
        return 400
    
    # check if player is already in game
    if player_name in game.players:
        return 400 

    # check if player name is valid
    if len(player_name) > 20 or len(player_name) < 5 or player_name in forbidden_names:
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
    
        





if __name__ == "__main__":
    uvicorn.run("main:app", host= "127.0.0.1",port= 8080,reload= True)
    