from flask import Flask
from flask_jwt import JWT, jwt_required, current_identity
from werkzeug.security import safe_str_cmp

# This import is importing all of the Flask Configurations deffined in config.py
from config import *

app = Flask(__name__)


## Routes used for updating players

@app.route('/')
def hello_geek():
    return '<h1>Hello from Vault 36<h1>'

@app.route('/login/<name>', methods=['GET', 'POST'])
def login_user(username):
    return {
            "username" : "Placeholder-sama"
    }

@app.route('/players')
def players_get():
    return {
            "player1" : "Placeholder-sama",
            "player2" : "Placeholder-chan",
            "player3" : "Placeholder-kun"
    }

@app.route('players/hp/<playerid>/<hp>')
def GetAllPlayers(player, hp):
    return {
            "player" : player,
            "health" : hp
    }

## Routes used for item management

@app.route('/players/item/<playerid>/<itemid>')
def AddItemToPlayer(playerid, itemid):
    return {
            "playerid"  : playerid,
            "itemid"    : itemid
    }

@app.route('/players/item/<playerid>/<itemid>')
def RemoveItemFromplayer(playerid, itemid):
    return {
            "playerid"  : playerid,
            "itemid"    : itemid
    }

@app.route('/items')
def GetAllItems():
    return {
            "1" : "Rifle",
            "2" : "Cram",
            "3" : "Caps",
            "4" : "Machete",
    }

@app.route('/items/<playerid>')
def GetInventoryByPlayer(playerid):
    return {
            "playerid"  : playerid,
            "01"        : "gun",
            "02"        : "ammo",
            "03"        : "food"
    }

## API calls for quest interactions
@app.route('/quests')
def GetAllQuests():
    return {
            "Quest 1"    : "Quest 1 is a quest that does things",
            "Quest 2"    : "Quest 2 is a quest",
            "Quest 3"    : "Quest 3 is a quest"
    }

@app.route('/quests/<playerid>')
def GetQuestsByPlayer(playerid):
    return {
            "playerid"  : playerid,
            "Quest 1"   : "A quest where things happen"
    }

@app.route('/quest/create')
def CreateQuest_post(quest):
    return quest

@app.route('/quest/assign/')
def AssignQuest_put(quest):
    return quest

@app.route('/quest/update')
def UpdateQuestStatus_put(quest):
    return quest

if __name__ == "__main__":
    app.run(debug=True, host=HOST, port=3001)
