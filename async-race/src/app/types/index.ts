export type State = {
  carsCount: number;
  garagePage: number;
  winnersCount: number;
  winnersPage: number;
  selectedCar: number;
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
