export type ListItemType = {
  id: number;
  name: string;
  description: string;
};

export interface Item extends ListItemType {
  quantity: number;
}

export interface Quest extends ListItemType {
  status: string;
}

export type User = {
  id: number;
  name: string;
  isadmin: Boolean;
  hp: number;
  maxhp: number;
  limbsHurt: LimbsType | null;
};

export type ItemOption = {
  value: Item;
  label: string;
};

export type QuestOption = {
  value: Quest;
  label: string;
};

export type UserOption = {
  value: User | null;
  label: string;
};

export type QuestStatusOption = {
  value: string;
  label: string;
};

export const QuestStatus: QuestStatusOption[] = [
  { value: "incomplete", label: "Incomplete" },
  { value: "success", label: "Success" },
  { value: "failure", label: "Failure" },
];

export type InventoryInputs = {
  item: Item | undefined;
  name: string | null;
  quantity: number | null;
  description: string | null;
  players: UserOption[] | null;
};

export type QuestInputs = {
  quest: Quest | undefined;
  name: string | null;
  description: string | null;
  players: UserOption[] | null;
  status: string | undefined;
};

export type LimbType = {
  limbtype: number;
  status: number;
};

export type LimbsType = {
  head: LimbType;
  leftarm: LimbType;
  rightarm: LimbType;
  leftleg: LimbType;
  rightleg: LimbType;
  torso: LimbType;
};
