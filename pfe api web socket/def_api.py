import random
from game import *

# settings
DEF_TYPE_GAME = "public"
forbidden_names = ["server"]
forbidden_words = ["kill"]

private_games: Dict[str, Game] = {}
private_games["test"] = Game()

public_games = {}

ranked_games: Dict[str, Game] = {}
ranked_games[0] = Game()
ranked_id = 0

def get_game_id(n:int = 5):
    l = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
    game_id = ""
    for i in range(n):
        game_id += random.choice(l) 

    return game_id


def new_game(type:str = DEF_TYPE_GAME,
             number_of_players : int = DEF_NUMBER_OF_PLAYERS ,
             number_of_keys : int = DEF_NUMBER_OF_KEYS ,
             map_dim : int = DEF_MAP_DIM ,
             lobe : list = DEF_LOBE_MAP):
    
    game_id = get_game_id()
    game = Game(number_of_players,number_of_keys,map_dim,lobe)
    
    if type == "public":
        public_games[game_id] = game
    elif type == "private":
        private_games[game_id] = game
    
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
    
    return 404
    
    

def enter_game(game,player_name):

    # check if player name is valid
    if len(player_name) > 20 or len(player_name) < 5 :
        return 400
    
    # check if game start
    if game.start:
        return 400
    
    # check if player is already in game
    if player_name in game.players:
        return 400 
    



def get_ranked_game():
    game = ranked_games[ranked_id]
    if game.start:
        game_id = get_game_id()
        ranked_id = game_id
        game = Game()
        ranked_games[game_id] = game
    return game
