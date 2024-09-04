# TOC

- [Rest API](#rest-api)
- [Data Formats](#data-formats)
- [Database](#database)
- [Testing](#testing)

## Rest API

### Player Endpoints

| Function name             | Relative Url                  | Description | Input (Request)                                       | Output(Response)                                                           | Completed Frontend Integration        |
| ------------------------- | ----------------------------- | ----------- | ----------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------- |
| login_user(string name)   | POST /login                   | For players | [ String name of player ](#login-request)             | Success/Failure                                                            | Yes                                   |
| logout_user()             | POST /logout                  |             | N/A                                                   | Success/Failure                                                            | Yes                                   |
| GetSelf()                 | GET /self                     |             | N/A                                                   | [Players object](#self-response)                                           | Yes                                   |
| GetPlayers()              | GET /players                  | For DM      | N/A                                                   | [Array of players objects](#player-get-response)                           | No (Should this include any admin...) |
| UpdateHP(int playerid)    | PUT /players/hp/{playerid}    |             | [New hp of player](#player-hp-update-request)         | [Updated player information w/ new hp](#player-hp-update-response)         | No                                    |
| UpdateMaxHP(int playerid) | PUT /players/maxhp/{playerid} |             | [New max hp of player](#player-max-hp-update-request) | [Updated player information w/ new max hp](#player-max-hp-update-response) | No                                    |

### Inventory Stock Endpoints

| Function name | Relative Url           | Description | Input (Request)                                         | Output (Response)                               | Completed Frontend Integration |
| ------------- | ---------------------- | ----------- | ------------------------------------------------------- | ----------------------------------------------- | ------------------------------ |
| GetAllItems() | GET /items             |             | N/A                                                     | [Array of items](#item-get-response)            | No                             |
| AddItem()     | POST /items            |             | [List of strings of item names](#item-addition-request) | [Array of items](#item-addition-response)       | No                             |
| UpdateItem()  | PUT /items/{itemid}    |             | [The item name](#item-update-request)                   | [Updated record of item](#item-update-response) | No                             |
| DeleteItem () | DELETE /items/{itemid} |             | N/A                                                     | [Array of items](#item-delete-response)         | No                             |

### Player Inventory Endpoints

| Function name                             | Relative Url                   | Description | Input (Request)                                                   | Output (Response)                                                                                                                   | Completed Frontend Integration |
| ----------------------------------------- | ------------------------------ | ----------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| GetInventoryByPlayer(int playerid)        | GET /players/item/{playerid}   |             | N/A                                                               | [Array of items in player inventory](#player-inventory-get-response)                                                                | No                             |
| AddItemToPlayer(int playerid)             | POST /players/item/{playerid}  |             | [Item id to add and quantity](#player-inventory-addition-request) | [The updated version of the player's entire inventory](#player-inventory-addition-response)                                         | No                             |
| UpdateItemQuantityForPlayer(int playerid) | PUT /players/item/{playerid}   |             | [Item id to add and quantity](#player-inventory-update-request)   | [The new updated record of the item in the inventory](#player-inventory-update-response), can change to entire inventory if need be | No                             |
| RemoveItemfromPlayer(int playerid)        | PATCH /players/item/{playerid} |             | [Item id to remove](#player-inventory-delete-request)             | [The updated version of the player's entire inventory](#player-inventory-delete-response)                                           | No                             |

### Quest Endpoints

| Function name                  | Relative Url             | Description | Input (Request)                                      | Output (Response)                                                      | Completed Frontend Integration |
| ------------------------------ | ------------------------ | ----------- | ---------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------ |
| GetAllQuests()                 | GET /quests              |             | N/A                                                  | [Array of quests](#quest-get-response)                                 | No                             |
| CreateQuest()                  | POST /quests             |             | [A list of new quest items](#quest-addition-request) | [Updated array of all quests](#quest-addition-response)                | No                             |
| UpdateQuestStatus(int questId) | PUT /quests/{questid}    |             | [Quest information to update](#quest-update-request) | [Quest's updated information](#quest-update-response)                  | No                             |
| RemoveQuest(int questId)       | DELETE /quests/{questid} |             |                                                      | [Updated list of quests and the deleted quest](#quest-delete-response) | No                             |

### Player Quest Endpoints

| Function name                       | Relative Url                     | Description | Input (Request)                                                            | Output (Response)                                                                                                    | Completed Frontend Integration |
| ----------------------------------- | -------------------------------- | ----------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| AssignQuestToPlayers(int questid)   | PATCH /players/quests/{questid}  |             | [List of player ids to assign the quest](#player-quest-assign-request)     | [A list of all quests assigned to a player along with the newly added one](#player-quest-assign-response)            | No                             |
| UnassignQuestToPlayers(int questid) | DELETE /players/quests/{questid} |             | [List of player ids to unassign the quest](#player-quest-unassign-request) | [A list of all quests assigned to a player. Then the unassigned quests seperately.](#player-quest-unassign-response) | No                             |
| GetMyQuest()                        | GET /players/quests              |             |                                                                            | [List of quests assigned to the current player](#my-quest-get-response)                                              | No                             |
| GetPlayerQuest()                    | GET /players/quests{questid}     |             |                                                                            | [List of quests assigned to the input player](#player-quest-get-response)                                            | No                             |

### Player Limb Endpoints

| Function name                  | Relative Url                  | Description | Input (Request)                                 | Output (Response)                                                        | Completed Frontend Integration |
| ------------------------------ | ----------------------------- | ----------- | ----------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------ |
| GetAllLimbs()                  | GET /limbs                    |             | N/A                                             | [Object of all limbs assigned to each available player](#limbs-response) | No                             |
| GetLimbsByPlayer(int playerid) | GET /players/limbs/{playerid} |             |                                                 | [Array of limbs](#limbs-player-response)                                 | No                             |
| UpdateLimb(int playerid)       | PUT /players/limbs/{playerid} |             | [limb id and new status](#limbs-update-request) | [Updated limb record](#limbs-update-response)                            | No                             |

## Data Formats

#### Login Request

```
{
  "playername" : "name"
}
```

#### Self Response

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

#### Quest Get Response

[(Back to Top)](#rest-api)

```
[
  {
    "questid": 1,
    "name": "quest one",
    "description": "One description",
    "status": "incomplete"
  }
]
```

#### Quest Addition Request

[(Back to Top)](#rest-api)

```
{
  "quests": [
    {
      "name" : "quest two",
      "description" : "Two description"
    },
    {
      "name" : "quest three",
      "description" : "Three description"
    }
  ]
}
```

#### Quest Addition Response

[(Back to Top)](#rest-api)

```
[
  {
    "questid": 1,
    "name": "quest one",
    "description": "One description",
    "status": "incomplete"
  },
  {
    "questid": 2,
    "name": "quest two",
    "description": "Two description",
    "status": "incomplete"
  },
  {
    "questid": 3,
    "name": "quest three",
    "description": "Three description",
    "status": "incomplete"
  },
]
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
  "questid": 1,
  "name": "new title",
  "description": "new description",
  "status": "success"
}
```

#### Quest Delete Response

[(Back to Top)](#rest-api)

```
[
  {
    "questid": 1,
    "name": "quest one",
    "description": "One description",
    "status": "incomplete"
  },
  {
    "questid": 3,
    "name": "quest three",
    "description": "Three description",
    "status": "incomplete"
  },
]
{
  "deleted": {
    "questid": 2,
    "name": "quest two",
    "description": "Two description",
    "status": "incomplete"
  },
}

```

#### Player Quest Assign Request

[(Back to Top)](#rest-api)

```
{
  "playersids" : [1, 2, 3]
}

```

#### Player Quest Assign Response

[(Back to Top)](#rest-api)

```
[
  {
    "assignee": "person1",
    "quest": "quest one"
  },
  {
    "assignee": "person2",
    "quest": "quest one"
  },
  {
    "assignee": "person3",
    "quest": "quest one"
  },
]
```

#### Player Quest Unassign Request

[(Back to Top)](#rest-api)

```
{
  "playerids" : [2]
}
```

#### Player Quest Unassign Response

[(Back to Top)](#rest-api)

```
[
  {
    "assignee": "person1",
    "quest": "quest one"
  },
  {
    "assignee": "person3",
    "quest": "quest one"
  },
]
```

#### My Quest Get Response

[(Back to Top)](#rest-api)

[
{
"description": "I am quest description one",
"name": "quest one",
"questid": 1,
"status": "incomplete"
},
]

#### Player Quest Get Response

[(Back to Top)](#rest-api)

[
{
"description": "I am quest description one",
"name": "quest one",
"questid": 1,
"status": "incomplete"
},
]

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
  "name": "player1",
  "limbname": "head",
  "status": 1
}
```

## Database

[(Back to Top)](#toc)

Person

- id (int, primary key)
- Name (varchar 40)
- HP (int)
- MaxHP (int)
- Limbs (Limb: Many to Many)
- Quests (Quest: Many to Many) (Deprecated)
- Inventory (Item: Many to Many)

Limb

- id (int, primary key)
- Name (varchar 10)
- status (bool)
- Person (Person: Many to One)

Quest

- id (int, primary key)
- Name (varchar 50)
- Description (varchar 200)
- Public ("boolean")
- Person (Many to Many) (Deprecated)

Item

- id (int, primary key)
- Person (Person: Many to Many)
- Name (varchar 50)
- Quantity (int)

Person_Quest

- id (int primary key)
- person_id (int)
- quest_id (int)

Person_Item

- id (int primary key)
- person_id (int)
- item_id (int)

## Testing

[(Back to Top)](#toc)
