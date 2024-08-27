from functools import wraps

from datetime import datetime
from datetime import timedelta
from datetime import timezone

from flask import Flask
from flask import request
from flask import jsonify

from flask_jwt_extended import create_access_token
from flask_jwt_extended import current_user
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
from flask_jwt_extended import verify_jwt_in_request
from flask_jwt_extended import get_jwt
from flask_jwt_extended import set_access_cookies
from flask_jwt_extended import unset_jwt_cookies


from flask_cors import CORS, cross_origin

from flask_socketio import SocketIO, send, emit

# This import is importing all of the Flask Configurations defined in config.py
from config import *
from database_interactions import *

app = Flask(__name__)

socketio = SocketIO(app, logger=True, engineio_logger=True, cors_allowed_origins="*")

cors = CORS(app, supports_credentials=True) # This will enable CORS for all routes

app.config['CORS_HEADERS'] = 'Content-Type'

app.config["JWT_SECRET_KEY"] = "im-a-tough-tootin-baby"
app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
app.config["JWT_COOKIE_SECURE"] = False
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
app.config['JWT_COOKIE_CSRF_PROTECT'] = False 


jwt = JWTManager(app)

#socketio = SocketIO(app, cors_allowed_origins="*")

class Player:
    def __init__(self, id, name, hp, maxhp, isadmin) -> None:
        self.id = id
        self.name = name
        self.hp = hp
        self.maxhp = maxhp
        self.isadmin = isadmin


@jwt.user_identity_loader
def user_identity_lookup(player):
    app.logger.debug("identity lookup")
    return player.id


@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    playerDB = GetPlayerFromDatabaseById(identity)
    player = Player(
        playerDB["personid"], playerDB["name"], playerDB["hp"], playerDB["maxhp"], playerDB["admin"]
    )

    app.logger.debug(f"loader: {identity}, {player}")
    return player


# Using an `after_request` callback, we refresh any token that is within 30
# minutes of expiring. Change the timedeltas to match the needs of your application.
@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            set_access_cookies(response, access_token)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original response
        return response


def admin_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            claim = get_jwt()

            if claim["is_admin"]:
                return fn(*args, **kwargs)
            else:
                return "Error: Admin Only", 400

        return decorator

    return wrapper


## -------------------------------------------------------------
## Test Routes
## -------------------------------------------------------------


### Test route to get routes working
@app.route("/")
def hello_geek():
    res = GetPlayersFromDatabase()

    print(res)

    names = []

    for name in res:
        names.append(name["name"])

    return names


### Test route for getting player by name
@app.route("/locked")
@admin_required()
def LockedThing():
    app.logger.debug(f"User: {current_user}")
    return f"Hello admin {current_user.name}!"


## -------------------------------------------------------------
## Routes used for updating players
## -------------------------------------------------------------


### Responsible for logging players in by name and setting a session token
@app.route("/login", methods=["POST"])
@cross_origin()
def login_user():
    playername = request.json.get("playername", None)

    res = GetPlayerFromDatabaseByName(playername)

    if not res:
        return "Player doesn't exist!", 401

    player = Player(res["personid"], res["name"], res["hp"], res["maxhp"], res["admin"])

    role = {"is_admin": res["admin"]}

    token = create_access_token(identity=player, additional_claims=role)

    response = jsonify({"msg": f"Login Success! Hi, {player.name}!"})

    set_access_cookies(response, token)

    return response

@app.route("/logout", methods=["POST"])
def logout_user():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response

@app.route("/self", methods=["GET"])
@jwt_required()
def GetSelf():
    user = current_user

    return {
        "id": user.id,
        "name": user.name,
        "hp": user.hp,
        "maxhp": user.maxhp,
        "isadmin": user.isadmin
    }


### Returns all available players, including their hp
@app.route("/players", methods=["GET"])
@admin_required()
def GetPlayers():
    res = GetPlayersFromDatabase()

    return res


### Updates the hp of the player with the given player id
@app.route("/players/hp/<int:playerid>", methods=["PUT"])
@jwt_required()
def UpdateHP(playerid):
    data = request.get_json()
    hp = data["hp"]

    res = UpdatePlayerHPInDatabase(playerid, hp)

    if not res:
        return f"Can't update player {playerid}'s health.", 400

    return res

### Updates the hp of the player with the given player id
@app.route("/players/maxhp/<int:playerid>", methods=["PUT"])
@jwt_required()
def UpdateMaxHP(playerid):
    data = request.get_json()
    maxhp = data["maxhp"]

    res = UpdatePlayerMaxHPInDatabase(playerid, maxhp)

    if not res:
        return f"Can't update player {playerid}'s max health.", 400

    return res


## -------------------------------------------------------------
## Routes used for item management
## -------------------------------------------------------------


### Route for adding items and getting all items
@app.route("/items", methods=["GET", "POST"])
@jwt_required()
def AddGetItemsRoute():
    # Create new items
    if request.method == "POST":
        try:
            data = request.get_json()
            items = data["items"]
            itemtuples = [tuple(item.values()) for item in items]
            app.logger.debug(itemtuples)
        except:
            return "Missing items", 400

        try:
            app.logger.debug(itemtuples)
            res = AddItemToDatabase(itemtuples)
        except Exception as e:
            return str(e), 400
        else:
            return res
    # Get all Items
    else:
        res = GetItemsInDatabase()

        return res


### Route for updating items and deleting items
@app.route("/items/<int:itemid>", methods=["PUT", "DELETE"])
@jwt_required()
def UpdateDeleteItemsRoute(itemid):
    # Update the name of an item
    if request.method == "PUT":
        data = request.get_json()
        newname = data["name"]
        newdescription = data["description"]

        res = UpdateItemInDatabase(itemid, newname, newdescription)

        if not res:
            return f"Item with id {id} does not exist", 404

        return res
    # Delete an item
    elif request.method == "DELETE":
        res = DeleteItemFromDatabase(itemid)

        return res


### Route for adding, removing or viewing items in regards to a specific player
### Used by both players and admin
@app.route("/players/item/<int:playerid>", methods=["GET", "POST", "PUT", "DELETE"])
@jwt_required()
def PlayerItemRoute(playerid):
    # Add Item to Player
    if request.method == "POST":
        data = request.get_json()

        itemid = data["itemid"]
        quanity = data["quantity"]
        app.logger.debug(f"{playerid} {itemid} {quanity}")

        try:
            ## Create record in player_items
            res = AddItemToPlayerInDatabase(playerid, itemid, quanity)
        except Exception as e:
            app.logger.debug(e)
            return (
                f"Can't add item to player {playerid}'s inventory! Maybe item is already in inventory or player doesn't exist.",
                400,
            )

        return res

    # Update Item Quantity for Player
    elif request.method == "PUT":
        data = request.get_json()

        itemid = data["itemid"]
        quanity = data["quantity"]

        res = UpdateItemForPlayerDatabase(playerid, itemid, quanity)

        if not res:
            return (
                f"Cannot add item {itemid} to player {playerid}'s inventory. Is the item in the players inventory?",
                400,
            )

        return res

    # Remove Item from Player 
    elif request.method == "DELETE":
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
@app.route("/quests", methods=["GET", "POST"])
@admin_required()
def AddGetQuestRoute():
    # Create quest
    if request.method == "POST":
        data = request.get_json()
        quests = data["quests"]
        questtuples = [tuple(quest.values()) for quest in quests]

        app.logger.debug(questtuples)

        res = AddQuestToDatabase(questtuples)

        return res

    # Get all quests available
    else:
        return GetQuestsInDatabase()


## API calls for updating and deleting
@app.route("/quests/<int:questid>", methods=["PUT", "DELETE"])
@admin_required()
def UpdateDeleteQuestRoute(questid):
    # Update quest status
    if request.method == "PUT":
        data = request.get_json()
        quest = data

        res = UpdateQuestInDatabase(questid, quest)

        if not res:
            return f"Error updating quest {questid}. Does it exist?", 400

        return res

    # Delete quest
    else:
        res = DeleteQuestFromDatabase(questid)
        return res


## Assign, Unassign assigned to a player
@app.route("/players/quests/<int:questid>", methods=["PATCH", "DELETE"])
@admin_required()
def PlayerQuestRoute(questid):
    if request.method == "PATCH":
        data = request.get_json()
        #questid = data["questid"]
        playerids = data["playerids"]

        for playerid in playerids:
            res = AssignQuestToPlayerInDatabase(playerid, questid)

        return res
    elif request.method == "DELETE":
        data = request.get_json()
        #questid = data["questid"]
        playerids = data["playerids"]

        for playerid in playerids:
            res = UnassignQuestToPlayerInDatabase(playerid, questid)

        return res


## Players can get their associated quest
@app.route("/players/quests", methods=["GET"])
@jwt_required()
def GetPlayerQuestRoute():
    playerid = current_user.id
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


@app.route("/limbs")
@admin_required()
def GetAllLimbs():
    res = GetAllPlayerLimbDatabaseConnections()

    playerlimbs = ConvertLimbs(res)

    return playerlimbs


@app.route("/players/limbs/<int:playerid>", methods=["GET", "PUT"])
@jwt_required()
def PlayerLimbsRoute(playerid):
    #if playerid == -1 :
    #    playerid = current_user.id

    # Update limb for a player
    if request.method == "PUT":
        data = request.get_json()
        limbtype = data["limbtype"]
        status = data["status"]
        res = UpdatePlayerLimbsInDatabase(playerid, limbtype, status)

        if not res:
            return (
                f"Could not update player {playerid}'s limb (id {limbtype}). Does player exist?",
                400,
            )

        return res

    # Get limbs of a player
    else:
        res = GetPlayerLimbsFromDatabase(playerid)

        playerlimbs = ConvertLimbs(res)

        return playerlimbs

 
## Socket functions

@socketio.on('message')
def handle_message(message):
    send("Your message was cool")

@socketio.on('json')
def handle_json(json):
    send({"that": "was cool"}, json=True)

@socketio.on('my event')
def handle_custom_event(json):
    send('received json: ' + str(json))
    # send('received json: ')

@socketio.on('connect')
def test_connect(auth):
    emit('my response', {'data': 'Connected'})

@socketio.on('disconnect')
def test_disconnect():
    print('Client disconnected')


if __name__ == "__main__":
    # app.run(debug=True, host=HOST, port=3001)
    socketio.run(app, debug=True, host=HOST, port=3001, allow_unsafe_werkzeug=True)
