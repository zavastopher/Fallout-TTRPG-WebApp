import sqlite3

def dict_factory(cursor, row):
    fields = [column[0] for column in cursor.description]
    return {key: value for key, value in zip(fields, row)}

#Function for retrieving the players from the database. The location
#Should be updated or set to an environment variable should the location
#Of the database file change. 
def GetPlayersFromDatabase():
    # Connection Set Up for interacting with the database
    con = sqlite3.connect("/db/data/vault-36-db.sqlite")
    con.row_factory = dict_factory
    cur = con.cursor()
    
    data = cur.execute("SELECT * FROM person")

    res = data.fetchall()
    
    #Close the connection so it doesn't dangle
    con.close()

    return res

def UpdatePlayerHPInDatabase(id, hp):
    con = sqlite3.connect("/db/data/vault-36-db.sqlite")
    con.row_factory = dict_factory
    cur = con.cursor()

    cur.execute("UPDATE person SET hp=? WHERE personid=?;", (hp, id))
    data = cur.execute("SELECT * FROM person WHERE personid=?;", (id))
    res = data.fetchall()

    con.commit()

    con.close()

    return res

### todo - Deprecate
def CheckItemInPlayerInventoryInDatabase(playerid, itemid):
    con = sqlite3.connect("/db/data/vault-36-db.sqlite")
    cur = con.cursor()

    data = cur.execute("SELECT * FROM person_item WHERE itemowner=? AND owneditem=?;", (playerid, itemid))
    res = data.fetchone()

    con.commit()
    con.close()

    return res


def AddItemToPlayerInDatabase(playerid, itemid, quantity):
    con = sqlite3.connect("/db/data/vault-36-db.sqlite")
    con.row_factory = dict_factory
    cur = con.cursor()

    cur.execute("INSERT INTO person_item (quantity,itemowner,owneditem) VALUES (?,?,?);", (quantity, playerid, itemid))
    data = cur.execute("SELECT item.itemid, item.name, person_item.quantity FROM item INNER JOIN person_item ON item.itemid = person_item.owneditem WHERE person_item.itemowner = ?;", (playerid,))
    res = data.fetchall()

    con.commit()
    con.close()

    return res

def RemoveItemFromPlayerInDatabase(playerid, itemid):
    con = sqlite3.connect("/db/data/vault-36-db.sqlite")
    con.row_factory = dict_factory
    cur = con.cursor()

    cur.execute("DELETE FROM person_item WHERE itemowner=? AND owneditem=?;", (playerid, itemid))
    data = cur.execute("SELECT item.itemid, item.name, person_item.quantity FROM item INNER JOIN person_item ON item.itemid = person_item.owneditem WHERE person_item.itemowner = ?;", (playerid,))
    res = data.fetchall()

    con.commit()
    con.close()

    return res

def GetPlayerInventoryFromDatabase(id):
    con = sqlite3.connect("/db/data/vault-36-db.sqlite")
    con.row_factory = dict_factory
    cur = con.cursor()

    data = cur.execute("SELECT item.itemid, item.name, person_item.quantity FROM item INNER JOIN person_item ON item.itemid = person_item.owneditem WHERE person_item.itemowner = ?;", (id,))
    res = data.fetchall()

    con.close()

    return res

## Item Interactions

def CheckItemExistsInDatabase(id):
    con = sqlite3.connect("/db/data/vault-36-db.sqlite")
    cur = con.cursor()

    data = cur.execute("SELECT * FROM item WHERE itemid=?;", (id,))
    res = data.fetchone()

    con.close()

    return res


def AddItemToDatabase(itemtuples):
    con = sqlite3.connect("/db/data/vault-36-db.sqlite")
    cur = con.cursor()

    cur.executemany("INSERT OR IGNORE INTO item (name) VALUES (?);", itemtuples)
    data = cur.execute("SELECT * FROM item;")
    res = data.fetchall()

    con.commit()
    con.close()

    return res

def UpdateItemInDatabase(id, newname):
    con = sqlite3.connect("/db/data/vault-36-db.sqlite")
    cur = con.cursor()

    cur.execute("UPDATE item SET name=? WHERE itemid=?;", (newname, id))

    data = cur.execute("SELECT * FROM item WHERE itemid=?;", (id,))
    
    res = {
        "success": cur.rowcount >= 1,
        "result": data.fetchone()
    }

    con.commit()
    con.close()

    return res


def GetItemsInDatabase():
    con = sqlite3.connect("/db/data/vault-36-db.sqlite")
    cur = con.cursor()

    data = cur.execute("SELECT * FROM item;")
    res = data.fetchall()

    con.close()

    return res

## Limbs

## Used to select every person and their limbs, as well as their status

def GetAllPlayerLimbDatabaseConnections():
    con = sqlite3.connect("/db/data/vault-36-db.sqlite")
    cur = con.cursor()

    data = cur.execute("SELECT person.name as PersonName, limb.name as LimbName, person_limb.status FROM person INNER JOIN person_limb ON person.personid = person_limb.limbowner INNER JOIN limb ON person_limb.limbtype = limb.limbid;")
    res = data.fetchall()

    con.close()

    return res
