# TOC

- [Rest API](#rest-api)
- [Data Formats](#data-formats)
- [Database](#database)
- [Testing](#testing)

## Rest API

| Function name                             | Relative Url                    | Description | Input (Request)                                                   | Output (Response)                                                                                                                   |
| ----------------------------------------- | ------------------------------- | ----------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| PlayerLogin(string name)                  | GET /login/{name}               | For players | String name of player                                             | Success/Failure                                                                                                                     |
| GetSelf()                                 | GET /players                    | For DM      | N/A                                                               | [Players object](#self-response)                                                                                                    |
| GetPlayers()                              | GET /players                    | For DM      | N/A                                                               | [Array of players objects](#player-get-response)                                                                                    |
| UpdateHP(int playerid)                    | PUT /players/hp/{playerid}      |             | [New hp of player](#player-hp-update-request)                     | [Updated player information w/ new hp](#player-hp-update-response)                                                                  |
| GetInventoryByPlayer(int playerid)        | GET /players/item/{playerid}    |             | N/A                                                               | [Array of items in player inventory](#player-inventory-get-response)                                                                |
| AddItemToPlayer(int playerid)             | POST /players/item/{playerid}   |             | [Item id to add and quantity](#player-inventory-addition-request) | [The updated version of the player's entire inventory](#player-inventory-addition-response)                                         |
| UpdateItemQuantityForPlayer(int playerid) | PUT /players/item/{playerid}    |             | [Item id to add and quantity](#player-inventory-update-request)   | [The new updated record of the item in the inventory](#player-inventory-update-response), can change to entire inventory if need be |
| RemoveItemfromPlayer(int playerid)        | DELETE /players/item/{playerid} |             | [Item id to remove](#player-inventory-delete-request)             | [The updated version of the player's entire inventory](#player-inventory-delete-response)                                           |

| Function name | Relative Url  | Description | Input (Request)                                         | Output (Response)                               |
| ------------- | ------------- | ----------- | ------------------------------------------------------- | ----------------------------------------------- |
| GetAllItems() | GET /items    |             | N/A                                                     | [Array of items](#item-get-response)            |
| AddItem()     | POST /items   |             | [List of strings of item names](#item-addition-request) | [Array of items](#item-addition-response)       |
| UpdateItem()  | PUT /items    |             | [The item name](#item-update-request)                   | [Updated record of item](#item-update-response) |
| DeleteItem () | DELETE /items |             | N/A                                                     | [Array of items](#item-delete-response)         |

| Function name                                         | Relative Url  | Description | Input (Request) | Output (Response) |
| ----------------------------------------------------- | ------------- | ----------- | --------------- | ----------------- |
| GetAllQuests()                                        | GET /quests   |             | N/A             | Array of quests   |
| CreateQuest(Quest quest)                              | POST /quests  |             |                 |                   |
| ToggleQuestVisibility(int questId)                    | PATCH /quests |             |                 |                   |
| UpdateQuestStatus(int questId, enum completionStatus) | PUT /quests   |             |                 |                   |

| Function name            | Relative Url | Description | Input (Request)                 | Output (Response) |
| ------------------------ | ------------ | ----------- | ------------------------------- | ----------------- |
| GetLimbsByPlayer(int id) | GET /limbs   |             | Player id, -1 if player request | Array of limbs    |
| UpdateLimb(int id)       | PATCH /limbs |             | limb id, player token           | N/A               |

## Data Formats

#### Person Format

<code>{
id: 1,
name: Camille,
Limbs: [{...}],
Inventory: [{...}]
}
</code>

#### Quest Status Enum

<code> {
Incomplete,
Success,
Failure
}
</code>

Used in database creation

#### Self Response

```
{
  id: 1,
  name: admin,
  hp: 100,
  isadmin: 1
}
```

#### Player Get Response

[(Back to Top)](#rest-api)

```
[
  {
        "hp": 100,
        "name": "person1",
        "personid": 1
    },
    {
        "hp": 90,
        "name": "person2",
        "personid": 2
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
  "name": "person1",
  "personid": 1
}
```

#### Item Get Response

```
[
  {
    "itemid": 1,
    "name": "One"
  },
]
```

#### Item Addition Request

[(Back to Top)](#rest-api)

```
{
  "items": [
    "Two",
    "Three"
  ]
}
```

#### Item Addition Response

[(Back to Top)](#rest-api)

```
[
    {
        "itemid": 1,
        "name": "One"
    },
    {
        "itemid": 2,
        "name": "Two"
    },
    {
        "itemid": 3,
        "name": "Three"
    }
]
```

#### Item Update Request

[(Back to Top)](#rest-api)

```
{
  "newname": "New Name"
}
```

#### Item Update Response

[(Back to Top)](#rest-api)

```
{
    "itemid": 1,
    "name": "New Name"
}
```

#### Item Delete Response

```
[
    {
        "itemid": 1,
        "name": "One"
    },
    {
        "itemid": 3,
        "name": "Three"
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
        "quantity": 2
    },
    {
        "itemid": 3,
        "name": "Item 3",
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
        "quantity": 1
    },
    {
        "itemid": 2,
        "name": "Item 2",
        "quantity": 2
    },
    {
        "itemid": 3,
        "name": "Item 3",
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
        "quantity": 2
    },
    {
        "itemid": 3,
        "name": "Item 3",
        "quantity": 3
    }
]
```

#### Quest Addition Request

[(Back to Top)](#rest-api)

```
{
  "quests": [
    {
      "name" : "quest one",
      "description" : "description"
    },
    {
      "name" : "quest two",
      "description" : "description"
    }
  ]
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

#### Limbs Update Request

[(Back to Top)](#rest-api)

```
{
  "limbtype": 1,
  "status": 0
}
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

## Database

[(Back to Top)](#toc)

Person

- id (int, primary key)
- Name (varchar 40)
- HP (int)
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
