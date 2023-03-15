export type Listeners = {
  [index: string]: Array<Function>;
};

export type Sort = 'id' | 'wins' | 'time';
export type SortOrder = 'ASC' | 'DESC';

export type State = {
  carsCount: number;
  garagePage: number;
  carsPerPage: number;
  winnersCount: number;
  winnersPage: number;
  winnersPerPage: number;
  selectedCar: number;
  sort: Sort;
  sortOrder: SortOrder;
}
export type Car = {
  name: string;
  color: string;
  id: number;
};

export type EngineResponse = {
  velocity: number;
  distance: number;
}

export type Winner = {
  wins: number;
  time: number;
  id: number;
};

export type Pagination = {
  prev: boolean;
  next: boolean;
};
