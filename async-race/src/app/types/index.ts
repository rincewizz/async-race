export type State = {
  carsCount: number;
  garagePage: number;
  winnersCount: number;
  winnersPage: number;
  selectedCar: number;
  sort: 'id' | 'time' | 'wins';
  sortOrder: 'ASC' | 'DESC';
}
export type Car = {
  name: string;
  color: string;
  id: number;
};
export type Winner = {
  wins: number;
  time: number;
  id: number;
};
