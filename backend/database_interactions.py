import sqlite3


#Function for retrieving the players from the database. The location
#Should be updated or set to an environment variable should the location
#Of the database file change. 
def GetPlayersFromDatabase():
    # Connection Set Up for interacting with the database
    con = sqlite3.connect("/db/data/vault-36-db.sqlite")
    cur = con.cursor()
    
    data = cur.execute("SELECT name FROM person")

    res = data.fetchall()
    
    #Close the connection so it doesn't dangle
    con.close()

    return res
