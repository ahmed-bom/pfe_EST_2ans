from fastapi import FastAPI, WebSocket , Request
from fastapi.responses import RedirectResponse
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





@app.get("/new_game/{type}")
async def new_game(type:str = "public"):

    game_id = get_game_id()
    game =  Game()

    if type == "public":
        public_games[game_id] = game
    else:
        private_games[game_id] = game

    return game_id




@app.get("/public_game")
async def new_game():
    games = {}
    for id in public_games :
        games[id] = len( public_games[id].players)
    return games




@app.get("/{game_type}/{game_id}/{player_name}", response_class=HTMLResponse)
async def read_item(request: Request , game_type :str = 'public', game_id : str = "test",player_name : str = "test"):
    return templates.TemplateResponse(
        request=request ,name="main.html",context={"game_id": game_id,
                                                    "player_name" : player_name,
                                                    "game_type" : game_type 
                                                    }
    )


@app.get('/test_ban/{player_name}')
async def test_ban(player_name:str):
    print(player_name)
    return {"test" : "ok"}



@app.websocket("/ws/{game_type}/{game_id}/{player_name}")
async def websocket_endpoint(game_type,game_id:str,player_name:str,websocket: WebSocket):
    

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
    ban_api_url = "http://127.0.0.1:8080/ban/" + player_name
    forbidden_words_count = 0
    
    try:
        while True:
            
            data = await websocket.receive_text()

            if data[0] == "/":
                data = data[1:] 
                for word in forbidden_words:
                    if word in data:
                        forbidden_words_count += 1
                        if forbidden_words_count == 4 :
                            await game.player_privet_message(player_name,ban_api_url,"ban")    

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
    
