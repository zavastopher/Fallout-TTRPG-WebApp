from flask import Flask
from flask import request

# This import is importing all of the Flask Configurations defined in config.py
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

### Test route for getting player by name
@app.route('/<name>')
def GetPlayerThing(name):
    res = GetPlayerFromDatabaseByName(name)
    return res

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
@app.route('/players', methods=['GET'])
def GetPlayers():
    res = GetPlayersFromDatabase()

    return res

### Updates the hp of the player with the given player id
@app.route('/players/hp/<int:playerid>', methods=['PUT'])
def UpdateHP(playerid):
    data = request.get_json()
    hp = data["hp"]

    res = UpdatePlayerHPInDatabase(playerid, hp)

    if not res:
        return f"Can't update player {playerid}'s health.", 400

    return res

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

        if not res:
            return  f"Item with id {id} does not exist", 404

        return res
    # Delete an item
    elif request.method == 'DELETE':
        res = DeleteItemFromDatabase(itemid)

        return res

### Route for adding, removing or viewing items in regards to a specific player
@app.route('/players/item/<int:playerid>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def PlayerItemRoute(playerid):
    # Add Item to Player
    if request.method == 'POST':
        data = request.get_json()

        itemid = data["itemid"]
        quanity = data["quantity"]

        try:
            ## Create record in player_items
            res = AddItemToPlayerInDatabase(playerid, itemid, quanity)
        except:
            return f"Can't add item to player {playerid}'s inventory! Maybe item is already in inventory or player doesn't exist.", 400

        return res
    
    # Update Item Quantity for Player
    elif request.method == 'PUT':
        data = request.get_json()

        itemid = data["itemid"]
        quanity = data["quantity"]

        res = UpdateItemForPlayerDatabase(playerid, itemid, quanity)
        
        if not res:
            return f"Cannot add item {itemid} to player {playerid}'s inventory. Is the item in the players inventory?", 400

        return res
    
    # Remove Item from Player
    elif request.method == 'DELETE':
        data = request.get_json()

        itemid = data["itemid"]

        try:
            ## Remove item from player's inventory
            res = RemoveItemFromPlayerInDatabase(playerid, itemid)
        except:
            return f"Item doesn't exist in player {playerid}'s inventory!", 400
        else:
            return res

    # Get Inventory By Player
    else:
        res = GetPlayerInventoryFromDatabase(playerid)

        return res

## -------------------------------------------------------------
## API calls for quest interactions
## -------------------------------------------------------------

## API calls for adding and getting quests
@app.route('/quests', methods=['GET', 'POST'])
def AddGetQuestRoute():
    # Create quest
    if request.method == 'POST':
        data = request.get_json()
        quests = data["quests"]
        questtuples = [tuple(quest.values()) for quest in quests ]

        app.logger.debug(questtuples)

        res = AddQuestToDatabase(questtuples)

        return res

    # Get all quests available 
    else:
        return GetQuestsInDatabase()
    
## API calls for updating and deleting
@app.route('/quests/<int:questid>', methods=['PUT', 'DELETE'])
def UpdateDeleteQuestRoute(questid):
    # Update quest status
    if request.method == 'PUT':
        data = request.get_json()
        quests = data

        res = UpdateQuestInDatabase(questid, quests)

        if not res:
            return f"Error updating quest {questid}. Does it exist?", 400

        return res

    # Delete quest
    else:
        res = DeleteQuestFromDatabase(questid)
        return res

## Assign, Unassign, and View quests assigned to a player
@app.route('/players/quests/<int:playerid>', methods=['GET', 'POST', 'DELETE'])
def PlayerQuestRoute(playerid):
    if request.method == 'POST':
        data = request.get_json()
        questid = data["questid"]

        res = AssignQuestToPlayerInDatabase(playerid, questid)

        return res
    elif request.method == 'DELETE':
        data = request.get_json()
        questid = data["questid"]

        res = UnassignQuestToPlayerInDatabase(playerid, questid)

        return res
    else:
        return GetQuestsByPlayerFromDatabase(playerid)
        

## -------------------------------------------------------------
## Limb Routes
## -------------------------------------------------------------

def ConvertLimbs(all):
    playerlimbs = {}

    for limb in all:
        if limb["person"] not in playerlimbs:
            playerlimbs[limb["person"]] = {}

        playerlimbs[limb["person"]][limb["limbname"]] = {}
        playerlimbs[limb["person"]][limb["limbname"]]["status"] = limb["status"]
        playerlimbs[limb["person"]][limb["limbname"]]["limbtype"] = limb["limbid"]

    return playerlimbs


@app.route('/limbs')
def GetAllLimbs():
    res =  GetAllPlayerLimbDatabaseConnections()

    playerlimbs = ConvertLimbs(res)

    return playerlimbs

@app.route('/players/limbs/<int:playerid>', methods=['GET', 'PUT'])
def GetLimbsByPlayer(playerid):
    # Update limb for a player
    if request.method == 'PUT':
        data = request.get_json()
        limbtype = data["limbtype"]
        status = data["status"]
        res = UpdatePlayerLimbsInDatabase(playerid, limbtype, status)

        if not res:
            return f"Could not update player {playerid}'s limb (id {limbtype}). Does player exist?", 400

        return res

    # Get limbs of a player
    else:
        res =  GetPlayerLimbsFromDatabase(playerid)

        playerlimbs = ConvertLimbs(res)

        return playerlimbs

if __name__ == "__main__":
    app.run(debug=True, host=HOST, port=3001)
