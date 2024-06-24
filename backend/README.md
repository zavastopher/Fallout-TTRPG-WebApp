## Rest API

| Function name                      | Relative Url                    | Description | Input                           | Output                |
| ---------------------------------- | ------------------------------- | ----------- | ------------------------------- | --------------------- |
| PlayerLogin(string name)           | GET /login/{name}               | For players | String name of player           | Player in json format |
| GetAllPlayers()                    | GET /players                    | For DM      | N/A                             | Array of players      |
| UpdateHP(int playerid)             | PUT /players/hp/{playerid}      |             | New hp of player                | Success/Failure       |
| GetInventoryByPlayer(int playerid) | GET /players/item/{playerid}    |             | Int id of player                | Array of items        |
| AddItemToPlayer(int playerid)      | POST /players/item/{playerid}   |             | Item id to add and Player id    | Success/Failure       |
| RemoveItemfromPlayer(int playerid) | DELETE /players/item/{playerid} |             | Item id to remove and Player id | Success/Failure       |

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

#### Person

<code>{
id: 1,
name: Camille,
Limbs: [{...}],
Inventory: [{...}]
}
</code>

#### Quest Status enum

<code> {
InProgress,
Success,
Failure
}
</code>

#### Player HP Update

```
{
  "hp": 1
}
```

#### Item Addition Request

```
{
  items: [
    "One",
    "Two",
    "Three"
  ]
}
```

#### Item Update Request

```
{
  "newname": "New Name"
}
```

TBA

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
