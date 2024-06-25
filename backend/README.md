## Rest API

| Function name                             | Relative Url                    | Description | Input (Request)                               | Output (Response)                                                  |
| ----------------------------------------- | ------------------------------- | ----------- | --------------------------------------------- | ------------------------------------------------------------------ |
| PlayerLogin(string name)                  | GET /login/{name}               | For players | String name of player                         | Player in json format                                              |
| GetPlayers()                              | GET /players                    | For DM      | N/A                                           | [Array of players objects](#player-response)                       |
| UpdateHP(int playerid)                    | PUT /players/hp/{playerid}      |             | [New hp of player](#player-hp-update-request) | [Updated player information w/ new hp](#player-hp-update-response) |
| GetInventoryByPlayer(int playerid)        | GET /players/item/{playerid}    |             | N/A                                           | Array of items                                                     |
| AddItemToPlayer(int playerid)             | POST /players/item/{playerid}   |             | Item id to add and Player id                  | Success/Failure                                                    |
| UpdateItemQuantityForPlayer(int playerid) | PUT /players/item/{playerid}    |             | Item id to add and Player id                  | Success/Failure                                                    |
| RemoveItemfromPlayer(int playerid)        | DELETE /players/item/{playerid} |             | Item id to remove and Player id               | Success/Failure                                                    |

| Function name | Relative Url  | Description | Input | Output                 |
| ------------- | ------------- | ----------- | ----- | ---------------------- |
| GetAllItems() | GET /items    |             | N/A   | Array of items         |
| AddItem()     | POST /items   |             | N/A   | Array of items         |
| UpdateItem()  | PUT /items    |             | N/A   | Updated record of item |
| DeleteItem () | DELETE /items |             | N/A   | Array of items         |

| Function name                                         | Relative Url  | Description | Input | Output          |
| ----------------------------------------------------- | ------------- | ----------- | ----- | --------------- |
| GetAllQuests()                                        | GET /quests   |             | N/A   | Array of quests |
| CreateQuest(Quest quest)                              | POST /quests  |             |       |                 |
| ToggleQuestVisibility(int questId)                    | PATCH /quests |             |       |                 |
| UpdateQuestStatus(int questId, enum completionStatus) | PUT /quests   |             |       |                 |

| Function name            | Relative Url | Description | Input                           | Output         |
| ------------------------ | ------------ | ----------- | ------------------------------- | -------------- |
| GetLimbsByPlayer(int id) | GET /limbs   |             | Player id, -1 if player request | Array of limbs |
| UpdateLimb(int id)       | PATCH /limbs |             | limb id, player token           | N/A            |

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

#### Player Response

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

```
{
  "hp": 70
}
```

#### Player HP Update Response

```
{
    "person": {
        "hp": 70,
        "name": "person1",
        "personid": 1
    }
}
```

```
{
    "person": null
}
```

#### Item Addition Request

```
{
  "items": [
    "One",
    "Two",
    "Three"
  ]
}
```

#### Item Addition Response

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

```
{
  "newname": "New Name"
}
```

#### Player Inventory Addition Request

```
{
  "itemid": 1,
  "quantity": 1
}
```

#### Player Inventory Addition Response

```
[
    {
        "itemid": 1,
        "name": "One one one",
        "quantity": 3
    }
]
```

#### Player Inventory Update Request

```
{
  "itemid": 1,
  "quantity": 1
}
```

#### Player Inventory Delete Request

```
{
  "itemid": 1
}
```

#### Player Inventory Get Response

```
{

}
```

#### Quest Addition Request

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

```
{
  "name": "new title",
  "description": "new description",
  "status": "success",
}
```

#### Limbs Update Request

```
{
  "limbtype": 1,
  "status": 0
}
```

#### Limbs From Database

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

Person

- id (int, primary key)
- Name (varchar 40)
- HP (int)
- Limbs (Limb: One to Many)
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
