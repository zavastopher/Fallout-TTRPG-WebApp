from flask import Flask
from flask import request
# from flask_jwt import JWT, jwt_required, current_identity
# from werkzeug.security import safe_str_cmp

# This import is importing all of the Flask Configurations deffined in config.py
from config import *
from database_interactions import *

app = Flask(__name__)

## -------------------------------------------------------------
## Test Routes
## -------------------------------------------------------------

### Test route to get routes working
@app.route('/')
def hello_geek():
    res = GetPlayersFromDatabase()

    print(res)

    names = []

    for name in res: 
        names.append(name[0])


    return names

## -------------------------------------------------------------
## Routes used for updating players
## -------------------------------------------------------------

### Responsible for logging players in by name and setting a session token
@app.route('/login/<name>', methods=['GET', 'POST'])
def login_user(name):
    return {
            "username" : name
    }

### Returns all available players, including their hp
@app.route('/players')
def GetPlayers():
    res = GetPlayersFromDatabase()

    return res

### Updates the hp of the player with the given player id
@app.route('/players/hp/<playerid>')
def UpdateHP(playerid):
    data = request.get_json()
    hp = data["hp"]

    res = UpdatePlayerHPInDatabase(playerid, hp)

    return {
            "playerid" : playerid,
            "result" : res
    }

## -------------------------------------------------------------
## Routes used for item management
## -------------------------------------------------------------

### Route for adding items and getting all items
@app.route('/items', methods=['GET', 'POST'])
def AddGetItemsRoute():
    # Create new items
    if request.method == 'POST':
        try:
            data = request.get_json()
            items = data["items"]
            itemtuples = [(name,) for name in items ]
            app.logger.debug(f"item {itemtuples}")
        except:
            return "Missing items", 400

        try:
            res = AddItemToDatabase(itemtuples)
        except:
            return "Already Exists", 400
        else:
            return res
    # Get all Items
    else:
        res = GetItemsInDatabase()

        return res
    
### Route for updating items and deleting items
@app.route('/items/<int:itemid>', methods=['PUT', 'DELETE'])
def UpdateDeleteItemsRoute(itemid):
    # Update the name of an item
    if request.method == 'PUT':
        data = request.get_json()
        newname = data["newname"]

        res = UpdateItemInDatabase(itemid, newname) 

        # app.logger.debug(str(numUpdated))

        return res
    # Delete an item
    elif request.method == 'DELETE':
        res = GetItemsInDatabase()
        app.logger.debug("test log")

        return res

### Route for adding, removing or viewing items in regards to a specific player
@app.route('/players/item/<int:playerid>', methods=['GET', 'POST', 'DELETE'])
def PlayerItemRoute(playerid):
    # Add Item to Player
    if request.method == 'POST':
        data = request.get_json()

        itemid = data["itemid"]
        quanity = data["quantity"]

        ## Check player exists
        ## Check item exists
        itemExists = CheckItemInPlayerInventoryInDatabase(playerid, itemid)

        if itemExists:
            return f"Item already exists in player {playerid}'s inventory!"
        else:
            ## Create record in player_items
            res = AddItemToPlayerInDatabase(playerid, itemid, quanity)

        return {
            "result": res
        }
    
    # Delete Item from Player
    elif request.method == 'DELETE':
        data = request.get_json()

        itemid = data["itemid"]

        itemExists = CheckItemInPlayerInventoryInDatabase(playerid, itemid)

        if itemExists:
           ## Remove item from player's inventory
           res = AddItemToPlayerInDatabase(playerid, itemid, quanity)
        else:
            return f"Item doesn't exist in player {playerid}'s inventory!"

    # Get Player Inventory
    else:
        res = GetPlayerInventoryFromDatabase(playerid)

        return res



    



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
