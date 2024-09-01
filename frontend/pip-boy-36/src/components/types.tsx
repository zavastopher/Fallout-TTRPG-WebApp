export type Item = {
  itemid: number;
  name: string;
  description: string;
  quantity: number;
};

export type Quest = {
  questid: number;
  name: string;
  description: string;
  status: string;
};

export type User = {
  id: number;
  name: string;
  isadmin: Boolean;
  hp: number;
  maxhp: number;
};

export type ItemOption = {
  value: Item;
  label: string;
};

export type UserOption = {
  value: User;
  label: string;
};

export type Inputs = {
  item: Item | undefined;
  name: string | null;
  quantity: number | null;
  description: string | null;
  players: UserOption[] | null;
};
