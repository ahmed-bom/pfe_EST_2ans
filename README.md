markdown
# pfe_EST_2ans - Projet de gestion de jeu multijoueur avec FastAPI

Ce projet implémente un serveur de jeu multijoueur en utilisant FastAPI, offrant des fonctionnalités de base pour la création et la gestion de jeux en temps réel.

## Fonctionnalités de base

1.  **Créer un nouveau jeu :**

    * Chemin : `/new_game/{type}`
    * Méthode : `GET`
    * Description : Crée une nouvelle partie et renvoie l'ID du jeu créé.
    * `{type}` : Le type de jeu, `public` ou `private`.

2.  **Liste des jeux publics :**

    * Chemin : `/public_games`
    * Méthode : `GET`
    * Description : Renvoie une liste des IDs de jeux publics et le nombre de joueurs dans chaque jeu.

3.  **Page de jeu :**

    * Chemin : `/{game_type}/{game_id}/{player_name}`
    * Méthode : `GET`
    * Description : Renvoie une page HTML affichant le jeu, avec les fichiers JavaScript et CSS associés.

4.  **Connexion WebSocket :**

    * Chemin : `/ws/{game_type}/{game_id}/{player_name}`
    * Description : Fournit une connexion WebSocket pour la mise à jour en temps réel de l'état du jeu entre les joueurs.

## Structures de données WebSocket (API vers utilisateur)

### Structure générale des messages

json
```
{
  "type": "type",
  "from": "from_name",
  "content": "content"
}
```


* `type` : Type de message.
* `from` : Nom de l'expéditeur.
* `content` : Contenu du message.

### Exemples de structures de données WebSocket

1.  **Message texte (chat) :**

json
```
{
  "type": "message",
  "from": "name",
  "content": "message content"
}
```
    

2.  **Connexion réussie (`enter_lobe`) :**

json
```
{
  "from": "server",
  "type": "enter_lobe",
  "content": {
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
      },
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
```

3.  **Nouveau joueur connecté (`new_connected`) :**

json
```
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
```
    

4.  **Positions des joueurs (`players_position`) :**

json
```
{
  "from": "server",
  "type": "players_position",
  "content": {
    "player598": {
      "type": "NULL",
      "x": 1.5,
      "y": 1.5,
      "angle": 0
    },
    "player139": {
      "type": "NULL",
      "x": 2.0,
      "y": 5.5,
      "angle": 0
    }
  }
}
```

5.  **Démarrage du jeu (`game_start`) :**

json
```
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
      "77": [7, 7],
      "47": [4, 7],
      "12": [1, 2]
    }
  }
}
```

6.  **Joueur tué (`kill`) :**

json
```
{
  "type": "kill",
  "from": "player433",
  "content": "player200"
}
```
    

7.  **Clé obtenue (`get_key`) :**

json
```
{
  "type": "get_key",
  "from": "player454",
  "content": {
    "x": 1,
    "y": 5
  }
}
```

8. **Ban user**

json
```
{
  "type": "ban",
  "from": "server",
  "content": url
}
```

## Utilisation

Vous pouvez utiliser l'API de deux manières :

### Avec Python et pip

1.  **Installation des dépendances :**

    bash
    ```
    pip install -r requirements.txt
    ```
    

2.  **Exécution de l'application :**

    bash
    ```
    python main.py
    ```
    

### Avec uv

1.  **Installation des dépendances :**

    bash
    ```
    uv add requirements.txt
    ```
    

2.  **Exécution de l'application :**

    bash
    ```
    uv run main.py
    ```

