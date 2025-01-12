from fastapi import FastAPI, WebSocket, Request
import uvicorn


from typing import Dict
from game import Game

from fastapi.staticfiles import StaticFiles

app = FastAPI()


games: Dict[str, Game] = {}
games["test"] = Game()



@app.websocket("/ws/{game_id}/{player_name}")
async def websocket_endpoint(game_id:str,player_name:str,websocket: WebSocket):
    
    # check if game exists
    if game_id not in games:
        return 404
    game = games[game_id]
    # check if game is full
    if game.players_number_limit == 0:
        return 400
    # check if player is already in game
    if player_name in game.players:
        return 400 
    # open connection and create player
    await websocket.accept()
    await game.new_player(player_name,websocket)
    

    try:
        while True:
            
            data = await websocket.receive_text()
            
            if data == "move":
                
                game.player_move(player_name)
                await game.get_players_position()

            elif data == "rotation to right" or data == "rotation to left":
                game.player_rotation(player_name,data)
                await game.get_players_position()

            elif data == "disconnect":
                await game.player_disconnect(player_name)

            else :
                await game.players_broadcast_message(player_name,data)
            


        
    except Exception as e:
        print(e)
        await game.player_privet_message(player_name,"sorry you have been disconnected because of an server problem")
        await game.player_disconnect(player_name)
        return 500
        





if __name__ == "__main__":
    uvicorn.run("main:app", host= "127.0.0.1",port= 8080,reload= True)