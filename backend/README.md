# Overview

This backend directory contains the source code for the server API and the database.

# TOC

- [Server Structure](#server-structure)
- [Rest API](#rest-api)
- [Data Formats](#data-formats)
- [Database](#database)
- [Testing](#testing)

## Server Structure

The Server is a Python Flask application that handles API calls for player data management, quest management, and item management. Attatched to this server is a SQLite database used for storing said information. This database is initialized when this container is spun up, the project as is contains dummy data for testing. For information check the [Database](#database) section.

## Rest API

This rest API provides endpoints for CRUD operations on Player Data. For example there are requests for logging in as a user and requesting data on said user. For Dungeon Masters it also contains endpoints for modifying quest, inventory, and player data.

### Player Endpoints

| Function name             | Relative Url                  | Description                                         | Input (Request)                                       | Output(Response)                                                           | Completed Frontend Integration |
| ------------------------- | ----------------------------- | --------------------------------------------------- | ----------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------ |
| login_user()              | POST /login                   | Login route                                         | [ String name of player ](#login-request)             | Success/Failure                                                            | Yes                            |
| logout_user()             | POST /logout                  | Logout rout                                         | N/A                                                   | Success/Failure                                                            | Yes                            |
| GetSelf()                 | GET /self                     | Route for retrivieng the player data given your JWT | N/A                                                   | [Players object](#self-response)                                           | Yes                            |
| GetPlayers()              | GET /players                  | Used by DM to retrieve all available players        | N/A                                                   | [Array of players objects](#player-get-response)                           | Yes                            |
| UpdateHP(int playerid)    | PUT /players/hp/{playerid}    | Set a players HP to a new value.                    | [New hp of player](#player-hp-update-request)         | [Updated player information w/ new hp](#player-hp-update-response)         | Yes                            |
| UpdateMaxHP(int playerid) | PUT /players/maxhp/{playerid} | Updating a players Max HP                           | [New max hp of player](#player-max-hp-update-request) | [Updated player information w/ new max hp](#player-max-hp-update-response) | No                             |

### Item Endpoints

| Function name                  | Relative Url           | Description                                           | Input (Request)                                         | Output (Response)                               | Completed Frontend Integration |
| ------------------------------ | ---------------------- | ----------------------------------------------------- | ------------------------------------------------------- | ----------------------------------------------- | ------------------------------ |
| AddGetItems()                  | GET /items             | Endpoint for retrieving all items in the database.    | N/A                                                     | [Array of items](#item-get-response)            | Yes                            |
| AddGetItems()                  | POST /items            | Endpoint for adding items to players. Used by the DM. | [List of strings of item names](#item-addition-request) | [Array of items](#item-addition-response)       | Yes                            |
| UpdateDeleteItemsRoute(itemid) | PUT /items/{itemid}    | Endpoint for updating an item record                  | [The item name](#item-update-request)                   | [Updated record of item](#item-update-response) | Yes                            |
| UpdateDeleteItemsRoute(itemid) | DELETE /items/{itemid} | Endpoint for deleting an item from the database       | N/A                                                     | [Array of items](#item-delete-response)         | Yes                            |

### Player Inventory Endpoints

| Function name                 | Relative Url                   | Description                                            | Input (Request)                                                   | Output (Response)                                                                                                                   | Completed Frontend Integration |
| ----------------------------- | ------------------------------ | ------------------------------------------------------ | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| PlayerItemRoute(int playerid) | GET /players/item/{playerid}   | Endpoint for getting a specific players inventory      | N/A                                                               | [Array of items in player inventory](#player-inventory-get-response)                                                                | Yes                            |
| PlayerItemRoute(int playerid) | POST /players/item/{playerid}  | Endpoint for adding at item to a players inventory     | [Item id to add and quantity](#player-inventory-addition-request) | [The updated version of the player's entire inventory](#player-inventory-addition-response)                                         | Yes                            |
| PlayerItemRoute(int playerid) | PUT /players/item/{playerid}   | Endpoint for updating a players item entry             | [Item id to add and quantity](#player-inventory-update-request)   | [The new updated record of the item in the inventory](#player-inventory-update-response), can change to entire inventory if need be | Yes                            |
| PlayerItemRoute(int playerid) | PATCH /players/item/{playerid} | Endpoint for deleting an item from a players inventory | [Item id to remove](#player-inventory-delete-request)             | [The updated version of the player's entire inventory](#player-inventory-delete-response)                                           | Yes                            |

### Player Gun Endpoints

TODO: Update as gun endpoints get created and updated

| Function name            | Relative Url                   | Description                                       | Input (Request)                                                 | Completed Frontend Integration | Output (Response)                      |
| ------------------------ | ------------------------------ | ------------------------------------------------- | --------------------------------------------------------------- | ------------------------------ | -------------------------------------- |
| PlayerGuns(int playerid) | GET /players/guns/{playerid}   | Endpoint to Get the guns owned by a given player. | N/A                                                             | No                             | [Array of Guns](#player-guns-response) |
| PlayerGuns(int playerid) | POST /players/guns/{playerid}  | Endpoint to add a gun to a given player.          | [Gun id to add and quantity](#player-gun-addition-request)      | No                             |                                        |
| PlayerGuns(int playerid) | PUT /players/guns/{playerid}   | Endpoint to update a player gun entry.            | [Gun id to update and new quantity](#player-gun-update-request) | No                             |                                        |
| playerGuns(int playerid) | PATCH /players/guns/{playerid} | Endpoint to delete a player gun entry.            | [Gun id to remove](#player-gun-delete-request)                  | No                             |                                        |

### Player Ammo Endpoints

TODO: define player ammo routes

### Quest Endpoints

| Function name                       | Relative Url             | Description                                               | Input (Request)                                      | Output (Response)                                                      | Completed Frontend Integration |
| ----------------------------------- | ------------------------ | --------------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------ |
| AddGetQuestRoute()                  | GET /quests              | Endpoint for returning all of the quests in the database. | N/A                                                  | [Array of quests](#quest-get-response)                                 | Yes                            |
| AddGetQuestRoute()                  | POST /quests             | Endpoint for adding a quest to the database.              | [A list of new quest items](#quest-addition-request) | [Updated array of all quests](#quest-addition-response)                | Yes                            |
| UpdateDeleteQuestRoute(int questId) | PUT /quests/{questid}    | Endpoint for updating a quest in the database.            | [Quest information to update](#quest-update-request) | [Quest's updated information](#quest-update-response)                  | Yes                            |
| UpdateDeleteQuestRoute(int questId) | DELETE /quests/{questid} | Endpoint for removing a quest in the database.            |                                                      | [Updated list of quests and the deleted quest](#quest-delete-response) | Yes                            |

### Player Quest Endpoints

| Function name                 | Relative Url                    | Description                                     | Input (Request)                                                            | Output (Response)                                                                                                    | Completed Frontend Integration |
| ----------------------------- | ------------------------------- | ----------------------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| PlayerQuestRoute(int questid) | PUT /players/quests/{questid}   | Endpoint for assigning a quest to a player.     | [List of player ids to assign the quest](#player-quest-assign-request)     | [A list of all quests assigned to a player along with the newly added one](#player-quest-assign-response)            | Yes                            |
| PlayerQuestRoute(int questid) | PATCH /players/quests/{questid} | Endpoint for unassigning a quest to a player.   | [List of player ids to unassign the quest](#player-quest-unassign-request) | [A list of all quests assigned to a player. Then the unassigned quests seperately.](#player-quest-unassign-response) | Yes                            |
| GetMyQuest()                  | GET /players/quests             | Enpoint for retrieving users quests.            |                                                                            | [List of quests assigned to the current player](#my-quest-get-response)                                              | Yes                            |
| GetPlayerQuest()              | GET /players/quests{questid}    | Endpoint for getting quests for a given player. |                                                                            | [List of quests assigned to the input player](#player-quest-get-response)                                            | Yes                            |

### Player Limb Endpoints

| Function name                  | Relative Url                  | Description                                                   | Input (Request)                                 | Output (Response)                                                        | Completed Frontend Integration |
| ------------------------------ | ----------------------------- | ------------------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------ |
| GetAllLimbs()                  | GET /limbs                    | Endpoint for getting all the player limb data stored.         | N/A                                             | [Object of all limbs assigned to each available player](#limbs-response) | Yes                            |
| PlayerLimbsRoute(int playerid) | GET /players/limbs/{playerid} | Endpoint for returning all limbs for a given player.          |                                                 | [Array of limbs](#limbs-player-response)                                 | Yes                            |
| PlayerLimbsRoute(int playerid) | PUT /players/limbs/{playerid} | Endpoint for updating the status of a limb of a given player. | [limb id and new status](#limbs-update-request) | [Updated limb record](#limbs-update-response)                            | Yes                            |

## Data Formats

#### Login Request

```
{
  "playername" : "name"
}
```

#### Self Response & Login Response

```
{
  hp: 100,
  id: 1,
  isadmin: 1,
  maxhp: 100,
  name: admin,
}
```

#### Player Get Response

[(Back to Top)](#rest-api)

```
[
  {
        "hp": 100,
        "id": 1,
        "isadmin": 1,
        "maxhp": 100,
        "name": "person1",
    },
    {
        "hp": 90,
        "id": 2,
        "isadmin": 0,
        "maxhp": 100,
        "name": "person2",
    },
    ...
]
```

#### Player HP Update Request

[(Back to Top)](#rest-api)

```
{
  "hp": 70
}
```

#### Player HP Update Response

[(Back to Top)](#rest-api)

```
{
  "hp": 70,
  "maxhp": 100,
  "name": "person1",
  "id": 1
}
```

#### Player Max HP Update Request

[(Back to Top)](#rest-api)

```
{
  "maxhp": 70
}
```

#### Player Max HP Update Response

[(Back to Top)](#rest-api)

```
{
  "hp": 70,
  "maxhp": 100,
  "name": "person1",
  "id": 1
}
```

#### Item Get Response

[(Back to Top)](#rest-api)

```
[
  {
    "itemid": 1,
    "name": "One",
    "description": "One Description"
  },
]
```

#### Item Addition Request

[(Back to Top)](#rest-api)

```
{
  "name": "Two",
  "description": "Two Description",
  "quantity": 1,
  "players": [1, 2, 3]
}
```

#### Item Addition Response

[(Back to Top)](#rest-api)

```
{
    "itemid": 2,
    "name": "Two",
    "description": "Two Description",
}
```

#### Item Update Request

[(Back to Top)](#rest-api)

```
{
  "name": "New Name",
  "description": "New One Description",

}
```

#### Item Update Response

[(Back to Top)](#rest-api)

```
{
    "itemid": 1,
    "name": "New Name",
    "description": "New One Description",
}
```

#### Item Delete Response

[(Back to Top)](#rest-api)

```
[
    {
        "itemid": 1,
        "name": "New Name",
        "description": "New One Description",
    },
    {
        "itemid": 3,
        "name": "Three",
        "description": "Three Description",
    }
]
```

#### Player Inventory Get Response

[(Back to Top)](#rest-api)

```
[
    {
        "itemid": 2,
        "name": "Item 2",
        "description": "Item 2",
        "quantity": 2
    },
    {
        "itemid": 3,
        "name": "Item 3",
        "description": "Item 3",
        "quantity": 3
    }
]
```

#### Player Inventory Addition Request

[(Back to Top)](#rest-api)

```
{
  "itemid": 1,
  "quantity": 1
}
```

#### Player Inventory Addition Response

[(Back to Top)](#rest-api)

```
[

    {
        "itemid": 1,
        "name": "Item 1",
        "description": "Item 1",
        "quantity": 1
    },
    {
        "itemid": 2,
        "name": "Item 2",
        "description": "Item 2",
        "quantity": 2
    },
    {
        "itemid": 3,
        "name": "Item 3",
        "description": "Item 3",
        "quantity": 3
    }
]
```

Returns entire new inventory

#### Player Inventory Update Request

[(Back to Top)](#rest-api)

```
{
  "itemid": 1,
  "quantity": 10
}
```

#### Player Inventory Update Response

[(Back to Top)](#rest-api)

```
{
    "itemid": 1,
    "name": "Item 1",
    "description": "Item 1",
    "quantity": 10
}
```

#### Player Inventory Delete Request

[(Back to Top)](#rest-api)

```
{
  "itemid": 1
}
```

#### Player Inventory Delete Response

[(Back to Top)](#rest-api)

```
{
  "deleted" : {
    "description" : "I am item description one",
    "itemid" : 1,
    "name" : "item one"
  }
}
```

#### Quest Get Response

[(Back to Top)](#rest-api)

```
[
  {
    "description": "One description",
    "name": "quest one",
    "questid": 1,
    "status": "incomplete"
  },
  {
    "description" : "Two description",
    "name" : "quest two",
    "questid" : 2,
    "status" : "incomplete"
  }
]
```

#### Quest Addition Request

[(Back to Top)](#rest-api)

```
{
  "name" : "quest two",
  "description" : "Two description",
  "players": [1, 2, 3]
}
```

#### Quest Addition Response

[(Back to Top)](#rest-api)

```
{
  "description" : "Two description",
  "name" : "quest two,
  "questid" : 4,
  "status" : "incomplete"
}
```

#### Quest Update Request

[(Back to Top)](#rest-api)

```
{
  "name": "new title",
  "description": "new description",
  "status": "success",
}
```

#### Quest Update Response

[(Back to Top)](#rest-api)

```

{
  "description": "new description",
  "name": "new title",
  "questid": 1,
  "status": "success"
}
```

#### Quest Delete Response

[(Back to Top)](#rest-api)

```
{
  "deleted" : {
    "description" : "new description",
    "name" : "new title",
    "questid" : 4,
    "status" : "success"
}
```

#### Player Quest Assign Request

[(Back to Top)](#rest-api)

```
{
  "playerid" : 1
}

```

#### Player Quest Assign Response

[(Back to Top)](#rest-api)

```
{
  "Assignee": "person1",
  "description": "One description",
  "name": "quest one",
  "questid": 1,
  "status": "incomplete"
}
```

#### Player Quest Unassign Request

[(Back to Top)](#rest-api)

```
{
  "playerids" : 2
}
```

#### Player Quest Unassign Response

[(Back to Top)](#rest-api)

```
{
  "deleted" : {
      "Assignee" : 1,
      "questid" : 2
  },
  "items" : []
}
```

#### My Quest Get Response

[(Back to Top)](#rest-api)

```
[
  {
    "description": "I am quest description one",
    "name": "quest one",
    "questid": 1,
    "status": "incomplete"
  },
]
```

#### Player Quest Get Response

[(Back to Top)](#rest-api)

```
[
  {
    "description": "I am quest description one",
    "name": "quest one",
    "questid": 1,
    "status": "incomplete"
  },
]
```

#### Limbs From Database

[(Back to Top)](#rest-api)

```
[
  {
    "limbname": "head",
    "limbtype": 1,
    "person": "player1",
    "status": 0
  },
  {
    "LimbName": "torso",
    "limbtype": 2,
    "PersonName": "player1",
    "status": 1
  },
  {
    "LimbName": "head",
    "limbtype": 1,
    "PersonName": "player2",
    "status": 1
  },
  {
    "LimbName": "torso",
    "limbtype": 2,
    "PersonName": "player2",
    "status": 0
  },
]
```

#### Limbs Response

[(Back to Top)](#rest-api)

```
{
  "player1": {
    "head": {
      "limbtype": 1,
      "status": 0
    },
    "torso: {
      "limbtype": 2,
      "status": 1
    },
    ...
  },
  "player2": {
    "head": {
      "limbtype": 1,
      "status": 1
    },
    "torso: {
      "limbtype": 2,
      "status": 0
    },
    ...
  }
}
```

#### Limbs Player Response

[(Back to Top)](#rest-api)

```
{
  "player1": {
    "head": {
      "limbtype": 1,
      "status": 0
    },
    "torso: {
      "limbtype": 2,
      "status": 1
    },
    ...
  }
}
```

#### Limbs Update Request

[(Back to Top)](#rest-api)

```
{
  "limbtype": 1,
  "status": 1
}
```

#### Limbs Update Response

[(Back to Top)](#rest-api)

```
{
  "limbname": "head",
  "name": "player1",
  "status": 1
}
```

## Database

[(Back to Top)](#toc)

### Person

Table used to contain user player profiles.

| Column                        | Description                                                                                              |
| ----------------------------- | -------------------------------------------------------------------------------------------------------- |
| `personid (int, primary key)` | Used to Identify a player and is generated when a player is inserted into the database. Autoincremented. |
| `Name (text)`                 | Players name                                                                                             |
| `HP (int)`                    | The players current hp value.                                                                            |
| `MaxHP (int)`                 | The players Maximum possible hp.                                                                         |
| `Admin ("boolean")`           | A boolean storing whether or not a player is an admin, if they are an admin they get DM privileges       |

### Limb

Table used to contain a limb.

| Column                      | Description                                                                                    |
| --------------------------- | ---------------------------------------------------------------------------------------------- |
| `limbid (int, primary key)` | Id used to identify this particular limb. Generated when a limb is created and Autoincremented |
| `name (text)`               | The name of the limb, this should be something along the lines of leg, arm, tail, etc.         |

### Quest

Table used to contain quest data.

| Column                       | Description                                                                                    |
| ---------------------------- | ---------------------------------------------------------------------------------------------- |
| `questid (int, primary key)` | Unique quest id used for identifying a quest                                                   |
| `Name (text)`                | The quest name                                                                                 |
| `Description (text)`         | Quest description                                                                              |
| `Status (text)`              | The status of the quest which has to be one of the following`incomplete`, `success`, `failure` |

### Item

Table used to contain items (in the future it will not contain ammo or guns).

| Column                      | Description                                                                        |
| --------------------------- | ---------------------------------------------------------------------------------- |
| `itemid (int, primary key)` | Unique created upon item insertion into the database. Autoincrementing             |
| `name (text)`               | The name of item, for example`Skullcrusher`                                        |
| `description (text)`        | Description text for the item.`The skullcrusher is a warhammer made out of refuse` |

### Ammo

Table used to contain ammo types.

| Column                     | Description                              |
| -------------------------- | ---------------------------------------- |
| `ammoid (int primary key)` | Unique id used for identifying this ammo |
| `name (text)`              | Name for this kind of ammo. Ex:`9mm`     |

- _note: make sure that the name does not contain unique characters like . ' ` \ [_

### Gun

Table used to contain all the gun types present in the system.

| Column                     | Description                                                                                                                                |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `gunid(int primary id)`    | Unique id used for identifying a gun entry. Autoincrements and is autoassigned                                                             |
| `name (text)`              | Name for a gun entry. ex:`Ranger Seqouia`                                                                                                  |
| `basecost (int)`           | The base cost for a gun with no modifications.                                                                                             |
| `ap (int)`                 | The action point cost associated with the gun                                                                                              |
| `damage (text)`            | The damage description for this gun, this is a text field as damage can be denoted using a variety of methods, such as xdx or multipliers. |
| `range (text)`             | The range of a weapon. Again this is a text data type as this value is not necessarily a strict int or float value                         |
| `criticalhit (text)`       | The critical hit rules text for a weapon. Can be dice or multipliers                                                                       |
| `gunammotype (int)`        | The id value of the type of ammo that this gun takes                                                                                       |
| `capacity (int)`           | The amount of ammunition that a gun can contain                                                                                            |
| `specialProperties (text)` | Any special property rules text for a gun.                                                                                                 |
| `loadcost (int)`           | The AP cost for loading the weapon.                                                                                                        |
| `strreq (int)`             | The strength requirement for the use of this weapon.                                                                                       |

### Person Ammo

Table containing ammo owned by a player.

| Column               | Description                                          |
| -------------------- | ---------------------------------------------------- |
| `personammoid (int)` | Unique id for identifying this persons ammo id entry |
| `quantity (int)`     | Ammo count for the player for this ammo type         |
| `ammowowner (int)`   | Id for the player that owns this ammo                |
| `ammotype (int)`     | Id for the ammo type that this entry is for          |

### Person Gun

Table containing an entry for a gun owned by a person.

| Column                    | Description                                                                                    |
| ------------------------- | ---------------------------------------------------------------------------------------------- |
| `playergunid (int)`       | Unique id for identifying this person gun entry                                                |
| `quantity (int)`          | Amount of this gun that this entry represents. Increased if it is a duplicate of the same gun. |
| `playergunplayerid (int)` | Id of the player that owns this gun                                                            |
| `playergungunid (int)`    | Id of the gun type this gun entry is                                                           |

### Person Quest

This table contains quest assignments.

| Column                | Description                                 |
| --------------------- | ------------------------------------------- |
| `questassignee (int)` | Id of the player this quest is assigned to. |
| `asignedquest (int)`  | Id of the quest this entry references       |

### Person_Item

| Column            | Description                          |
| ----------------- | ------------------------------------ |
| `quantity (int)`  | Amount of this item                  |
| `itemowner (int)` | Id of the player that owns this item |
| `owneditem (int)` | Id of the item type                  |

## Testing

Currently testing is being performed manually, test cases **should** be added to test the server for every feature that is added.
[(Back to Top)](#toc)
