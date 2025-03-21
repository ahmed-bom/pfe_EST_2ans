# pfe_EST_2ans
# Projet de gestion de jeu multijoueur utilisant "FastAPI"

## Fonctions de base

1. *Créer un nouveau jeu :*

     * Chemin : /new_game/{type}
         * {type} : Le type de jeu, peut être public ou privé.
     * Méthode : GET
     * Description : Ce chemin crée une nouvelle partie est renvoie le id du jeu créé.
    
     
2. *Jeux publics :*

     * Chemin : /public_games
     * Méthode : GET
     * Description : renvoie une liste de tous les id de jeux publics et le nombre de joueurs dans chaque jeu.

3. *Voir la page du jeu :*

     * Chemin : /{game_type}/{game_id}/{player_name}
     * Méthode : GET
     * Description : Ce chemin renvoie une page HTML affichant le jeu, ainsi que ses fichiers JavaScript et CSS associés.

4. *Connexion WebSocket :*

     * Chemin : /ws/{type_de_jeu}/{id_de_jeu}/{nom_du_joueur}
     * Description : Ce chemin fournit une connexion WebSocket pour mettre à jour instantanément l'état du jeu entre les joueurs.
     
        

## Structures de données WebSocket ( API => user )

*Structures général :*

    json
    {
      "type": "type",
      "from": "from_name",
      "content": "content"
    }
    
 * type : Type de message.
 * from : Nom de l'expéditeur.
 * content : Le contenu du message.
 
 Voici des exemples de structures de données échangées via WebSocket:
 
 
  1. *Message texte :*
     * Il est envoyé pour échanger des messages entre les joueurs dans le chat


    json
    {
      "type": "message",
      "from": "name",
      "content": "message content"
    }
    
    
    

2. *Connexion réussie :*
    * Envoyé lorsque le joueur se connecte avec succès et contient des informations sur:
        la carte "map"
        des informations sur les joueur "players_info"
        des informations sur les clés "keys"

    json
    {
      "from": "server",
      "type": "enter_lobe",
      "content": {
      // lobi map
        "map": [
          [1, 1, 1, 1, 1, 1, 1],
          [1, 0, 0, 0, 0, 0, 1],
          [1, 0, 0, 0, 0, 0, 1],
          [1, 0, 0, 1, 0, 0, 1],
          [1, 0, 0, 0, 0, 0, 1],
          [1, 0, 0, 0, 0, 0, 1],
          [1, 1, 1, 1, 1, 1, 1]
        ],
        "players_info": {
          "player247": {
            "type": "NULL",
            "x": 1.5,
            "y": 1.5,
            "angle": 0
          }
          "player47": {
            "type": "NULL",
            "x": 1.5,
            "y": 1.5,
            "angle": 0
          }
        },
        "keys": {}
      }
    }
    

 

3. *Connexion du nouveau joueur :*
    * Il est envoyé lorsqu'un nouveau joueur se connecte et contient les informations du nouveau joueur.

    json
    {
      "from": "player428",
      "type": "new_connected",
      "content": {
        "type": "NULL",
        "x": 1.5,
        "y": 1.5,
        "angle": 0
      }
    }
    

 

4. *Postes des joueurs :*
    * Il est envoyé pour mettre à jour les emplacements des joueurs.

    json
    {
      "from": "server",
      "type": "players_position",
      "content": {
        "player598": {
          "type": "NULL",
          "x": 1.5,
          "y": 1.5,
          "angle": 0
        }
        "player139": {
          "type": "NULL",
          "x": 2.0,
          "y": 5.5,
          "angle": 0
        }
      }
    }
    

   
5. *Démarrer le jeu :*
     * Envoyé au démarrage du jeu, contient des informations sur la carte, des informations sur le joueur et des clés.

    json
    {
      "from": "server",
      "type": "game_start",
      "content": {
        "map": [
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
          [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
          [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
          [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
          [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
          [1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
          [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
          [1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
          [1, 2, 0, 0, 1, 2, 0, 0, 0, 0, 1],
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ],
        "players_info": {
          "player247": {
            "type": "prey",
            "x": 5.5,
            "y": 9.5,
            "angle": 0
          },
          "player428": {
            "type": "hunter",
            "x": 1.5,
            "y": 9.5,
            "angle": 0
          }
        },
        "keys": {
          "77": [7, 7]
          "47": [4, 7]
          "12": [1, 2]
        }
      }
    }
    

 


6. *tué Joueur :*
    * Envoyé lorsqu'un autre joueur est tué.
        from  = le tueur
        content = la victime


    json
    {
      "type": "kill",
      "from": "player433",
      "content": "player200"
    }
    

 7. *Obtenez une clé :*
    * Envoyé lorsqu'un joueur obtient une clé.
        (x,y) représente les coordonnées de clé


    json
    {
      "type": "get_key",
      "from": "player454",
      "content": {
        "x": 1,
        "y": 5
      }
    }
    



## Comment utiliser

# vous pouvez utiliser l'API de deux maniéres :
    soit on utilison Python et pip
    ou on utilison UV
    
# PYTHON
1. *L'installation des requirements:*

 frapper
 pip install -r requirements.txt


2. *Exécutez l'application :*

 frapper
 python main.py
 
# UV
1. *L'installation des requirements:*

 frapper
 uv add requirements.txt


2. *Exécutez l'application :*

 frapper
 uv run main.py
 
 
 
 
 
 




    

  

