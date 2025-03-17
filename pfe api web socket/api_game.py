from typing import Dict
from game import *


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