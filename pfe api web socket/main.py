from fastapi import FastAPI, WebSocket , Request
from pydantic import BaseModel
import uvicorn
import random


from api_game import *
from typing import Dict
from game import *


from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates


app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")


templates = Jinja2Templates(directory="templates")


#  for CORS
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)





@app.post("/new_game/{type}")
async def new_game(type:str = "public",number_of_players : int = DEF_NUMBER_OF_PLAYERS ,number_of_keys : int = DEF_NUMBER_OF_KEYS ,map_dim : int = DEF_MAP_DIM ,lobe : list = DEF_LOBE_MAP):

    game_id = get_game_id()
    game =  Game(type,number_of_players,number_of_keys,map_dim,lobe)

    if type == "public":
        public_games[game_id] = game
    else:
        private_games[game_id] = game

    return game_id




@app.get("/{game_type}/{game_id}/{player_name}", response_class=HTMLResponse)
async def read_item(request: Request , game_type :str = 'public', game_id : str = "test",player_name : str = "test"):
    return templates.TemplateResponse(
        request=request ,name="main.html",context={"game_id": game_id,
                                                    "player_name" : player_name,
                                                    "game_type" : game_type 
                                                    }
    )



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
    

    
    
if __name__ == "__main__":
    uvicorn.run("main:app", host= "127.0.0.1",port= 8000,reload= True)
    