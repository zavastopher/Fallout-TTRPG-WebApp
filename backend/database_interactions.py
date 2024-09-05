import sqlite3

database = "/db/data/vault-36-db.sqlite"
turnonForeignKeys = "PRAGMA FOREIGN_KEYS = ON;"

def dict_factory(cursor, row):
    fields = [column[0] for column in cursor.description]
    return {key: value for key, value in zip(fields, row)}

def GetPlayerFromDatabaseByName(name):
    con = sqlite3.connect(database)
    con.row_factory = dict_factory
    cur = con.cursor()
    try:
        cur.execute(turnonForeignKeys)

        data = cur.execute("SELECT * FROM person WHERE name=?", (name,))

        res = data.fetchone()
    except Exception as e:
        con.close()
        raise Exception(e)
    #Close the connection so it doesn't dangle
    con.close()

    return res

def GetPlayerFromDatabaseById(id):
    con = sqlite3.connect(database)
    con.row_factory = dict_factory
    cur = con.cursor()
    try:
        cur.execute(turnonForeignKeys)

        data = cur.execute("SELECT * FROM person WHERE personid=?", (id,))

        res = data.fetchone()
    except:
        con.close()
        raise Exception(e)
    #Close the connection so it doesn't dangle
    con.close()

    return res

#Function for retrieving the players from the database. The location
#Should be updated or set to an environment variable should the location
#Of the database file change. 
def GetPlayersFromDatabase():
    # Connection Set Up for interacting with the database
    con = sqlite3.connect(database)
    con.row_factory = dict_factory
    cur = con.cursor()
    try:
        cur.execute(turnonForeignKeys)
        
        data = cur.execute("SELECT * FROM person")

        res = data.fetchall()
    except Exception as e:
        con.close()
        raise Exception(e)
    #Close the connection so it doesn't dangle
    con.close()

    return res

def UpdatePlayerHPInDatabase(id, hp):
    con = sqlite3.connect(database)
    con.row_factory = dict_factory
    cur = con.cursor()
    try:
        cur.execute(turnonForeignKeys)

        data = cur.execute("SELECT * FROM person WHERE personid=?;", (id,))
        personToUpdate = data.fetchone()

        if personToUpdate:
            cur.execute("UPDATE person SET hp=? WHERE personid=?;", (hp, id))
            data = cur.execute("SELECT * FROM person WHERE personid=?;", (id,))
            res = data.fetchone()
            con.commit()
        else:
            res = False
    except Exception as e:
        con.commit()
        con.close()
        raise Exception(e)
    
    con.close()

    return res

def UpdatePlayerMaxHPInDatabase(id, maxhp):
    con = sqlite3.connect(database)
    con.row_factory = dict_factory
    cur = con.cursor()
    try:
        cur.execute(turnonForeignKeys)

        data = cur.execute("SELECT * FROM person WHERE personid=?;", (id,))
        personToUpdate = data.fetchone()

        if personToUpdate:
            cur.execute("UPDATE person SET maxhp=? WHERE personid=?;", (maxhp, id))
            data = cur.execute("SELECT * FROM person WHERE personid=?;", (id,))
            res = data.fetchone()
            con.commit()
        else:
            res = False
    except Exception as e:
        con.commit()
        con.close()
        raise Exception(e)
    
    con.close()

    return res

def AddItemToPlayerInDatabase(playerid, itemid, quantity):
    con = sqlite3.connect(database)
    con.row_factory = dict_factory
    cur = con.cursor()
    cur.execute(turnonForeignKeys)

    try:
        cur.execute("INSERT INTO person_item (quantity,itemowner,owneditem) VALUES (?,?,?);", (quantity, playerid, itemid))
        data = cur.execute("SELECT item.itemid, item.name, item.description, person_item.quantity FROM item INNER JOIN person_item ON item.itemid = person_item.owneditem WHERE person_item.itemowner = ? AND item.itemid = ?;", (playerid, itemid))
    except Exception as e:
        con.commit()
        con.close()
        raise Exception(e)
        
    res = data.fetchall()

    con.commit()
    con.close()

    return res

def UpdateItemForPlayerDatabase(playerid, itemid, quantity):
    con = sqlite3.connect(database)
    con.row_factory = dict_factory
    cur = con.cursor()
    try:
        cur.execute(turnonForeignKeys)

        data = cur.execute("SELECT item.itemid, item.name, person_item.quantity FROM item INNER JOIN person_item ON item.itemid = person_item.owneditem WHERE person_item.itemowner = ? AND person_item.owneditem = ?;", (playerid, itemid))
        inventoryToUpdate = data.fetchone()

        if inventoryToUpdate:
            cur.execute("UPDATE person_item SET quantity = ? WHERE itemowner = ? AND owneditem = ?;", (quantity, playerid, itemid))
            data = cur.execute("SELECT item.itemid, item.name, item.description, person_item.quantity FROM item INNER JOIN person_item ON item.itemid = person_item.owneditem WHERE person_item.itemowner = ? AND person_item.owneditem = ?;", (playerid, itemid))
            res = data.fetchone()
            con.commit()
        else:
            res = False
    except Exception as e:
        con.commit()
        con.close()
        raise Exception(e)
    con.close()

    return res

def RemoveItemFromPlayerInDatabase(playerid, itemid):
    con = sqlite3.connect(database)
    con.row_factory = dict_factory
    cur = con.cursor()
    try:
        cur.execute(turnonForeignKeys)

        data = cur.execute("SELECT item.itemid, item.name, item.description FROM item INNER JOIN person_item ON item.itemid = person_item.owneditem WHERE person_item.itemowner = ? AND itemid=?", (playerid, itemid,))
        deleted = {
            "deleted": data.fetchone()
        }

        cur.execute("DELETE FROM person_item WHERE itemowner=? AND owneditem=?;", (playerid, itemid))
        # data = cur.execute("SELECT item.itemid, item.name, item.description, person_item.quantity FROM item INNER JOIN person_item ON item.itemid = person_item.owneditem WHERE person_item.itemowner = ?;", (playerid,))
        # res = data.fetchall()
    except Exception as e:
        con.commit()
        con.close()
        raise Exception(e)
    con.commit()
    con.close()

    return deleted

def GetPlayerInventoryFromDatabase(id):
    con = sqlite3.connect(database)
    con.row_factory = dict_factory
    cur = con.cursor()

    try:
        cur.execute(turnonForeignKeys)

        data = cur.execute("SELECT item.itemid, item.name, item.description, person_item.quantity FROM item INNER JOIN person_item ON item.itemid = person_item.owneditem WHERE person_item.itemowner = ?;", (id,))
        res = data.fetchall()
    except Exception as e:
        con.close()
        raise Exception(e)
    con.close()

    return res

## Item Interactions

def AddItemToDatabase(name, description):
    con = sqlite3.connect(database)
    con.row_factory = dict_factory
    cur = con.cursor()

    try:
        cur.execute(turnonForeignKeys)

        cur.execute("INSERT OR IGNORE INTO item (name, description) VALUES (?, ?);", (name, description))
        data = cur.execute("SELECT * FROM item where name = ?;", (name,))
        res = data.fetchone()
    except Exception as e:
        con.commit()
        con.close()
        raise Exception(e)
    
    con.commit()
    con.close()

    return res

def UpdateItemInDatabase(id, newname, newdescription):
    con = sqlite3.connect(database)
    con.row_factory = dict_factory
    cur = con.cursor()

    try:
        cur.execute(turnonForeignKeys)

        data = cur.execute("SELECT * FROM item WHERE itemid=?;", (id,))

        itemToUpdate = data.fetchone()

        if itemToUpdate:
            cur.execute("UPDATE item SET name=?, description=? WHERE itemid=?;", (newname, newdescription, id))
            data = cur.execute("SELECT * FROM item WHERE itemid=?;", (id,))
            res = data.fetchone()
            con.commit()
        else:
            res = False
    except Exception as e:
        con.commit()
        con.close()
        raise Exception(e)
    
    con.close()

    return res


def GetItemsInDatabase():
    con = sqlite3.connect(database)
    con.row_factory = dict_factory
    cur = con.cursor()

    try:
        cur.execute(turnonForeignKeys)

        data = cur.execute("SELECT * FROM item;")
        res = data.fetchall()
    except Exception as e:
        con.close()
        raise Exception(e)
    
    con.close()

    return res

def DeleteItemFromDatabase(itemid):
    con = sqlite3.connect(database)
    con.row_factory = dict_factory
    cur = con.cursor()

    try:
        cur.execute(turnonForeignKeys)

        data = cur.execute("SELECT * FROM item WHERE itemid=?", (itemid,))
        deleted = {
            "deleted": data.fetchone()
        }

        cur.execute("DELETE FROM item WHERE itemid=?", (itemid,))

    except Exception as e:
        con.commit()
        con.close()
        raise Exception(e)
    con.commit()
    con.close()

    return deleted

## Quests

def AddQuestToDatabase(name, description):
    con = sqlite3.connect(database)
    con.row_factory = dict_factory
    cur = con.cursor()

    try:
        cur.execute(turnonForeignKeys)

        cur.execute("INSERT OR IGNORE INTO quest (name, description) VALUES (?, ?);", (name, description,))
        data = cur.execute("SELECT * FROM quest where name = ?;", (name,))
        res = data.fetchone()
    except Exception as e:
        con.commit()
        con.close()
        raise Exception(e)
    con.commit()
    con.close()

    return res

def GetQuestsInDatabase():
    con = sqlite3.connect(database)
    con.row_factory = dict_factory
    cur = con.cursor()
    try:
        cur.execute(turnonForeignKeys)

        data = cur.execute("SELECT * FROM quest;")
        res = data.fetchall()
    except Exception as e:
        con.close()
        raise Exception(e)
    con.close()

    return res

def UpdateQuestInDatabase(id, newquest):
    con = sqlite3.connect(database)
    con.row_factory = dict_factory
    cur = con.cursor()
    try:
        cur.execute(turnonForeignKeys)

        data = cur.execute("SELECT * FROM quest WHERE questid=?;", (id,))

        questToUpdate = data.fetchone()

        if questToUpdate:
            cur.execute("UPDATE quest SET name=?, description=?, status=? WHERE questid=?;", (newquest["name"], newquest["description"], newquest["status"], id))
            data = cur.execute("SELECT * FROM quest WHERE questid=?;", (id,))
            res = data.fetchone()
            con.commit()
        else: 
            res = False
    except Exception as e:
        con.commit()
        con.close()
        raise Exception(e)
    con.close()

    return res

def DeleteQuestFromDatabase(questid):
    con = sqlite3.connect(database)
    con.row_factory = dict_factory
    cur = con.cursor()
    try:
        cur.execute(turnonForeignKeys)

        data = cur.execute("SELECT * FROM quest WHERE questid=?", (questid,))
        deleted = {
            "deleted": data.fetchone()
        }

        cur.execute("DELETE FROM quest WHERE questid=?", (questid,))
        #data = cur.execute("SELECT * FROM quest;")
        #res = data.fetchall()

        #res.append(deleted)
    except Exception as e:
        con.commit()
        con.close()
        raise Exception(e)

    con.commit()
    con.close()

    return deleted

def AssignQuestToPlayerInDatabase(playerid, questid):
    con = sqlite3.connect(database)
    con.row_factory = dict_factory
    cur = con.cursor()

    try:
        cur.execute(turnonForeignKeys)

        cur.execute("INSERT OR IGNORE INTO person_quest (questassignee,assignedquest) VALUES (?, ?) ", (playerid, questid))
        data = cur.execute("SELECT person.name AS Assignee, quest.name AS Quest FROM quest INNER JOIN person_quest ON quest.questid = person_quest.assignedquest INNER JOIN person ON person_quest.questassignee = person.personid WHERE person_quest.questassignee=?;", (playerid,))
        res = data.fetchall()
    except Exception as e:
        con.commit()
        con.close()
        raise Exception(e)
    
    con.commit()
    con.close()
    return res

def GetQuestsByPlayerFromDatabase(playerid):
    con = sqlite3.connect(database)
    con.row_factory = dict_factory
    cur = con.cursor()
    try:
        cur.execute(turnonForeignKeys)

        data = cur.execute("SELECT quest.* FROM quest INNER JOIN person_quest ON quest.questid = person_quest.assignedquest WHERE questassignee=?;", (playerid,))
        res = data.fetchall()
    except Exception as e:
        con.close()
        raise Exception(e)
    con.close()

    return res

def UnassignQuestToPlayerInDatabase(playerid, questid):
    con = sqlite3.connect(database)
    con.row_factory = dict_factory
    cur = con.cursor()
    try:
        cur.execute(turnonForeignKeys)

        data = cur.execute("SELECT * FROM person_quest WHERE assignedquest=? AND questassignee=?;", (questid,playerid))
        deleted = {
            "deleted": data.fetchone()
        }

        cur.execute("DELETE FROM person_quest WHERE assignedquest=? AND questassignee=?;", (questid, playerid))
        data = cur.execute("SELECT person.name AS Assignee, quest.name AS Quest, quest.questid FROM quest INNER JOIN person_quest ON quest.questid = person_quest.assignedquest INNER JOIN person ON person_quest.questassignee = person.personid WHERE person_quest.questassignee=?;", (playerid,))
        res = data.fetchall()

        res.append(deleted)
    except Exception as e:
        con.commit()
        con.close()
        raise Exception(e)
    con.commit()
    con.close()
    return res

## Limbs

## Used to select every person and their limbs, as well as their status

def GetAllPlayerLimbDatabaseConnections():
    con = sqlite3.connect(database)
    con.row_factory = dict_factory
    cur = con.cursor()
    try:
        cur.execute(turnonForeignKeys)

        data = cur.execute("SELECT person.name as person, limb.name as limbname, limb.limbid, person_limb.status FROM person INNER JOIN person_limb ON person.personid = person_limb.limbowner INNER JOIN limb ON person_limb.limbtype = limb.limbid;")
        res = data.fetchall()
    except:
        con.close()
        raise Exception(e)
    con.close()

    return res

def GetPlayerLimbsFromDatabase(playerid):
    con = sqlite3.connect(database)
    con.row_factory = dict_factory
    cur = con.cursor()
    try:
        cur.execute(turnonForeignKeys)

        data = cur.execute("SELECT person.name as person, limb.name as limbname, limb.limbid, person_limb.status FROM person INNER JOIN person_limb ON person.personid = person_limb.limbowner INNER JOIN limb ON person_limb.limbtype = limb.limbid WHERE person_limb.limbowner=?;", (playerid,))
        res = data.fetchall()
    except Exception as e:
        con.close()
        raise Exception(e)
    con.close()

    return res

def UpdatePlayerLimbsInDatabase(playerid, limbtype, status):
    con = sqlite3.connect(database)
    con.row_factory = dict_factory
    cur = con.cursor()
    try:
        cur.execute(turnonForeignKeys)

        data = cur.execute("SELECT person.name, limb.name AS limbname, person_limb.status FROM person INNER JOIN person_limb ON person.personid = person_limb.limbowner INNER JOIN limb ON person_limb.limbtype = limb.limbid WHERE person_limb.limbowner=? AND person_limb.limbtype=?;", (playerid, limbtype))
        
        playerLimbToUpdate = data.fetchone()

        if playerLimbToUpdate:
            cur.execute("UPDATE person_limb SET status=? WHERE limbowner=? AND limbtype=?;", (status, playerid, limbtype))
            data = cur.execute("SELECT person.name, limb.name AS limbname, person_limb.status FROM person INNER JOIN person_limb ON person.personid = person_limb.limbowner INNER JOIN limb ON person_limb.limbtype = limb.limbid WHERE person_limb.limbowner=? AND person_limb.limbtype=?;", (playerid, limbtype))
            res = data.fetchone()
            con.commit()
        else: 
            res = False
    except Exception as e:
        con.commit()
        con.close()
        raise Exception(e)
    
    con.close()

    return res

## Ammo Types

# ammo
#   ammoid -> PRIMARY KEY AUTOINCREMENT 
#   name

def CreateAmmoTypeInDatabase(ammoname):
    con = sqlite3.connect(database)
    con.row_factory = dict_factory
    cur = con.cursor()
    try:
        cur.execute(turnonForeignKeys)

        data = cur.execute("INSERT INTO ammo (name) VALUES (\'?\');", tuple(ammoname))
        res = data.fetchone()
        con.commit()
        con.close()
    except Exception as e:
        con.commit()
        con.close()
        raise Exception(e)
    
    return res

def GetAmmoTypeInDatabase(ammoid):
    con = sqlite3.connect(database)
    con.row_factory = dict_factory
    cur = con.cursor()

    try:
        cur.execute("PRAGMMA foreign_keys = ON;")

        data = cur.execute("SELECT * FROM ammo WHERE ammo.ammoid = ?", tuple(ammoid))
        res = data.fetchone()
        con.commit()
        con.close()
    except Exception as e:
        con.commit()
        con.close()
        raise Exception(e)
    
    return res

# adding this function just in case but any permanent changes to the ammo table
# should be made to create_script.db and should be made to the corresponding ammo 
# type insert function. THIS WILL UPDATE THE AMMOTYPE FOR EVERYONE
def UpdateAmmoNameInDatabase(ammoid, name):
    con = sqlite3.connect(database)
    con.row_factory = dict_factory
    cur = con.cursor()

    try:
        cur.execute(turnonForeignKeys)

        data = cur.execute("UPDATE ammo SET name = ? WHERE ammoid = ?;", (name, ammoid))
        res = data.fetchone()
        con.commit()
        con.close()
    except Exception as e:
        con.commit()
        con.close()
        raise Exception(e)
    
    return res

# this function will DELETE the item FOR EVERYONE not just a single player
# this will also only affect the transient database and new instances of the
# backend will still contain the item. To permanently remove an item from the 
# database do so in the 'create_script.db' file. 
# THIS WILL DELETE THE AMMOTYPE FOR EVERYONE
def DeleteItemFromDatabase(ammoid):
    con = sqlite3.connect(database)
    con.row_factory = dict_factory
    cur = con.cursor()

    try:
        cur.execute(turnonForeignKeys)
        
        data = cur.execute("DELETE FROM ammo WHERE ammo.ammoid = ?", tuple(ammoid))
        res = data.fetchone()
        con.commit()
        con.close()
    except Exception as e:
        con.commit()
        con.close()
        raise Exception(e)
    
    return res

## Gun Types
# all of these functions manage the database containing the base information
# for the types of guns available to the player. Any permanent changes meant
# to update the database FOREVER should also be made to the 'create_script.db'
# file.

# gun
#   gunid -> INTEGER PRIMARY KEY AUTOINCREMENT
#   name
#   basecost
#   ap
#   damage
#   range
#   criticalhit
#   gunammotype -> FOREIGN KEY references ammo
#   capacity
#   specialProperties
#   loadcost
#   strreq

def CreateGunInDatabase(name, basecost, ap, damage, gunrange, criticalhit, gunammotype, capacity, specialProperties, loadcost, strreq):
    con = sqlite3.connect(database)
    con.row_factaory = dict_factory
    cur = con.cursor()

    try:
        cur.execute(turnonForeignKeys)

        data = cur.execute("INSERT INTO gun (name,basecost,ap,damage,range,criticalhit,gunammotype,capacity,specialProperties,loadcost,strreq) Values (\'?\',?,?,\'?\',\'?\',\'?\',?,?,\'?\',?)",(name, basecost, ap,damage,gunrange,criticalhit,gunammotype,capacity,specialProperties,loadcost,strreq))
        res = data.fetchone()
        con.commit()
        con.close()
    except Exception as e:
        con.commit()
        con.close()
        raise Exception(e)

    return res

def GetGunInDatabase(gunid):
    con = sqlite3.connect(database)
    con.row_factory = dict_factory
    cur = con.cursor()

    try:
        cur.execute(turnonForeignKeys)

        data = cur.execute("SELECT * FROM gun WHERE gun.gunid = ?", tuple(gunid))
        res = data.fetchone()
        con.commit()
        con.close()
    except Exception as e:
        con.commit()
        con.close()
        raise Exception(e)
    
    return res

# UPDATES FOR ALL PLAYERS
# all fields need to be passed in even if they are not being updated for security
def UpdateGunInDatabase(gunid,name, basecost, ap, damage, gunrange, criticalhit, gunammotype, capacity, specialProperties, loadcost, strreq):
    con = sqlite3.connect(database)
    con.row_factory = dict_factory
    cur = con.cursor()

    try:
        cur.execute(turnonForeignKeys)
        data = cur.execute("UPDATE gun SET name = ?,basecost = ?,ap = ?,damage = ?,range = ?,criticalhit = ?,gunammotype = ?,capacity = ?,specialProperties = ?,loadcost = ?,strreq = ? WHERE gunid = ?",(name, basecost, ap, damage, gunrange, criticalhit, gunammotype, capacity, specialProperties, loadcost, strreq,gunid))
        res = data.fetchone()
        con.commit()
        con.close()
    except Exception as e:
        con.commit()
        con.close()
        raise Exception(e)
    
    return res

def DeleteGunInDatabase(gunid):
    con = sqlite3.connect(database)
    con.row_factory = dict_factory
    cur = con.cursor()

    try:
        cur.execute(turnonForeignKeys)
        data = cur.execute("DELETE FROM gun WHERE gun.gunid = ?", tuple(gunid))
        res = data.fetchone()
        con.commit()
        con.close()
    except Exception as e:
        con.commit()
        con.close()
        raise Exception(e)
    
    return res

## PlayerAmmo
# These interactions are for modifying a players ammo count 

# person_ammo
#   personammoid -> INTEGER PRIMARY KEY AUTOINCREMENT
#   quantity
#   ammoowner -> FOREIGN KEY REFERENCES personid
#   ammotype -> FOREIGN KEY REFERENCES ammoid

def CreatePlayerAmmoInDatabase(quantity, ammoid, playerid):
    con = sqlite3.connect(database)
    con.row_factory = dict_factory
    cur = con.cursor()

    try:
        cur.execute(turnonForeignKeys)
        data = cur.execute("INSERT INTO person_ammo (quantity, ammoowner, ammotype) VALUES (?, ?);", (quantity,ammoid,playerid))
        res = data.fetchone()
        con.commit()
        con.close()
    except Exception as e:
        con.commit()
        con.close()
        raise Exception(e)
    
    return res

def GetPlayerAmmoQuantityInDatabase(playerid, ammoid):
    con = sqlite3.connect(database)
    con.row_factory = dict_factory
    cur = con.cursor()

    try:
        cur.execute(turnonForeignKeys)
        data = cur.execute("SELECT person_ammo.quantity FROM person_ammo WHERE person_ammo.ammoowner = ? AND person_ammo.ammotype = ?;",(playerid, ammoid))
        res = data.fetchone()
        con.commit()
        con.close()
    except Exception as e:
        con.commit()
        con.close()
        raise Exception(e)

    return res

def GetPlayerAmmoTypesInDatabase(playerid):
    con = sqlite3.connect(database)
    con.row_factory = dict_factory
    cur = con.cursor()

    try:
        cur.execute(turnonForeignKeys)
        data = cur.execute("SELECT * FROM person_ammo WHERE person_ammo.ammoowner = ?", tuple(playerid))
        res = data.fetchone()
        con.commit()
        con.close()
    except Exception as e:
        con.commit()
        con.close()
        raise Exception(e)
    
    return res

def GetPlayerAmmoPlayersInDatabase(ammoid):
    con = sqlite3.connect(database)
    con.row_factory = dict_factory
    cur = con.cursor()

    try:
        cur.execute(turnonForeignKeys)
        data = cur.execute("SELECT * FROM person_ammo WHERE person_ammo.ammotype = ?", tuple(ammoid))
        res = data.fetchone()
        con.commit()
        con.close()
    except Exception as e:
        con.commit()
        con.close()
        raise Exception(e)
    
    return res

