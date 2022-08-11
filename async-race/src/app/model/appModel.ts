import {
  Car, EngineResponse, Listeners, Pagination, Sort, SortOrder, State, Winner,
} from '../types';
import EngineModel from './engine';
import GarageModel from './garage';
import WinnersModel from './winners';

const CAR_BRANDS = [
  'Lexus',
  'Fiat',
  'Audi',
  'Ford',
  'Skoda',
  'BMW',
  'Mazda',
  'Honda',
  'Mercedes',
  'Hyundai',
  'Tesla',
  'Mitsubishi',
  'Toyota',
  'Nissan',
  'Volkswagen',
  'Opel',
  'Porsche',
  'Range Rover',
  'Lamborghini',
];

const CAR_MODEL = [
  'Model 3',
  'Model S',
  'Model X',
  'Model Y',
  'Corona',
  'Sienna',
  'LS',
  'RC',
  'Toro',
  'Cronos',
  'Q8',
  'S8',
  'X7',
  'Z8',
  'Sentia',
  'Xedos 6',
  'Titan',
  'Zafira',
  'Meriva',
  'Tayron',
  'Routan',
  'Phaeton',
];

class AppModel {
  public listeners: Listeners;

  public state: State;

  public garage: GarageModel;

  public engine: EngineModel;

  public winners: WinnersModel;

  brand: string[];

  model: string[];

  constructor() {
    this.listeners = {};
    this.state = {
      carsCount: 0,
      garagePage: 0,
      carsPerPage: 7,
      winnersCount: 0,
      winnersPage: 0,
      winnersPerPage: 10,
      selectedCar: 0,
      sort: 'time',
      sortOrder: 'ASC',
    };
    this.brand = CAR_BRANDS;
    this.model = CAR_MODEL;
    this.garage = new GarageModel();
    this.engine = new EngineModel();
    this.winners = new WinnersModel();
  }

  subscribe(name: string, fn: Function) {
    if (!this.listeners[name]) {
      this.listeners[name] = [];
    }
    this.listeners[name].push(fn);
  }

  unsubscribe(name: string, fn: Function) {
    this.listeners[name] = this.listeners[name].filter((listener) => listener !== fn);
  }

  broadcast(name: string, data: object | number | string) {
    if (this.listeners[name]) this.listeners[name].forEach((listener) => listener(data));
  }

  getCarsByPage(page: number) {
    return this.garage.getCars(page)
      .then((response) => {
        const count: number = Number(response.headers.get('x-total-count'));
        this.setCarsCount(count);
        return response.json();
      });
  }

  setGaragePage(page: number = 1) {
    if (page < 1 || (this.state.garagePage !== 0
      && page > this.getGaragePages())) return;
    this.state.garagePage = page;
    this.broadcast('updateGaragePage', this.state.garagePage);

    this.getCarsByPage(page)
      .then((data) => this.broadcast('loadGaragePage', data))
      .then(() => this.broadcast('updateGaragePagination', this.getGaragePagination()));
  }

  getCarById(id: number): Promise<Car> {
    return this.garage.getCar(id).then((response) => response.json());
  }

  createCar(name: string, color: string) {
    this.garage.createCar(name, color)
      .then((response) => response.json())
      .then((data) => {
        this.setCarsCount(this.state.carsCount + 1);
        if (this.getGaragePages() === this.state.garagePage) {
          this.broadcast('createCar', data);
        } else {
          this.broadcast('updateGaragePagination', this.getGaragePagination());
        }
      });
  }

  getGaragePagination(): Pagination {
    const pagination = { prev: true, next: true };
    if (this.state.garagePage !== 1) {
      pagination.prev = false;
    }
    if (this.state.garagePage < this.getGaragePages()) {
      pagination.next = false;
    }
    return pagination;
  }

  updateCar(id: number, name: string, color: string) {
    this.garage.updateCar(id, name, color)
      .then((response) => response.json())
      .then(() => this.broadcast('updateCar', { id, name, color }));
  }

  deleteCar(id: number) {
    this.garage.deleteCar(id).then((response) => response.json())
      .then(() => {
        const oldLastPage: number = this.getGaragePages();
        this.broadcast('removeCar', id);
        this.setCarsCount(this.state.carsCount - 1);
        const lastPage: number = this.getGaragePages();

        if (oldLastPage > this.state.garagePage) {
          const page = this.state.garagePage * this.state.carsPerPage;
          this.garage.getCars(page, 1)
            .then((response) => {
              const count: number = Number(response.headers.get('x-total-count'));
              this.setCarsCount(count);
              return response.json();
            })
            .then((data) => this.broadcast('createCar', data[0]));
        }
        if (lastPage < this.state.garagePage) {
          this.setGaragePage(lastPage);
        }

        this.broadcast('updateGaragePagination', this.getGaragePagination());
      });
  }

  getGaragePages(): number {
    const lastPage: number = Math.ceil(this.state.carsCount / this.state.carsPerPage);
    return lastPage;
  }

  setCarsCount(count: number) {
    this.state.carsCount = count || 0;
    this.broadcast('updateCarsCount', this.state.carsCount);
  }

  generateCars() {
    for (let i = 0; i < 100; i += 1) {
      const brandStr: string = this.brand[Math.floor(Math.random() * (this.brand.length - 0)) + 0];
      const modelStr: string = this.model[Math.floor(Math.random() * (this.model.length - 0)) + 0];
      const carName: string = `${brandStr} ${modelStr}`;
      const r: string = `0${Math.floor(Math.random() * (256)).toString(16)}`.slice(-2);
      const g: string = `0${Math.floor(Math.random() * (256)).toString(16)}`.slice(-2);
      const b: string = `0${Math.floor(Math.random() * (256)).toString(16)}`.slice(-2);
      const color: string = `#${r}${g}${b}`;
      this.createCar(carName, color);
    }
  }

  driveEngine(id: number) {
    return this.engine.engine(id, 'drive')
      .then((response) => response.json())
      .then((data: {success: boolean}) => { this.broadcast('driveEngine', { id, data }); return id; })
      .catch(() => this.broadcast('stopCarAnimation', id));
  }

  startEngine(id: number) {
    return this.engine.engine(id, 'started')
      .then((response) => response.json())
      .then((engine: EngineResponse) => {
        this.broadcast('startEngine', { id, engine });
        return new Promise((res, rej) => {
          this.driveEngine(id).then((val) => {
            if (typeof val === 'number') {
              res({ id: val, engine });
            }
            rej();
          });
        });
      });
  }

  stopEngine(id: number) {
    this.engine.engine(id, 'stopped')
      .then((response) => response.json())
      .then((data) => this.broadcast('stopEngine', { id, data }));
  }

  startRace(ids: number[]) {
    if (!this.state.carsCount) return;
    let time: number = performance.now();
    this.broadcast('raceStart', {});
    const promises = ids.map((id) => this.startEngine(id));
    Promise.any(promises).then((data) => { time = performance.now() - time; this.broadcast('raceEnd', Object.assign(data as object, { time })); });
  }

  setWinnersCount(count: number) {
    this.state.winnersCount = count || 0;
    this.broadcast('updateWinnersCount', this.state.winnersCount);
  }

  getWinnersByPage(
    page: number = 1,
    sort: Sort = this.state.sort,
    order: SortOrder = this.state.sortOrder,
  ) {
    return this.winners.getWinners(page, this.state.winnersPerPage, sort, order)
      .then((response) => {
        const count: number = Number(response.headers.get('x-total-count'));
        this.setWinnersCount(count);
        return response.json();
      })
      .then((data: Winner[]) => Promise.all(
        data.map((el, index) => this.getCarById(el.id)
          .then((val) => Object.assign(el, val, { index }))),
      ));
  }

  getWinnersPagination(): Pagination {
    const pagination = { prev: true, next: true };
    if (this.state.winnersPage !== 1) {
      pagination.prev = false;
    }
    if (this.state.winnersPage < this.getWinnersPages()) {
      pagination.next = false;
    }
    return pagination;
  }

  setWinnersPage(
    page: number = 1,
    sort: Sort = this.state.sort,
    order: SortOrder = this.state.sortOrder,
  ) {
    if (page < 1 || (this.state.winnersPage !== 0
      && page > this.getWinnersPages())) return;
    this.state.winnersPage = page;
    this.broadcast('updateWinnersPage', this.state.winnersPage);

    this.getWinnersByPage(page, sort, order)
      .then((data) => this.broadcast('loadWinnersPage', { winners: data, page }))
      .then(() => this.broadcast('updateWinnersPagination', this.getWinnersPagination()));
  }

  getWinnersPages(): number {
    const lastPage: number = Math.ceil(this.state.winnersCount / this.state.winnersPerPage);
    return lastPage;
  }

  addWinner(id: number, time: number) {
    this.winners.getWinner(id)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('id не найден');
      })
      .then((winner: Winner) => {
        const newTime = winner.time < time ? winner.time : time;
        return this.winners.updateWinner(id, winner.wins + 1, newTime);
      })
      .catch(() => this.winners.createWinner(id, 1, time))
      .then(() => this.broadcast('updateWinners', {}));
  }

  deleteWinner(id: number) {
    this.winners.deleteWinner(id).then((response) => response.json())
      .then(() => this.broadcast('removeWinner', id));
  }
}

export default AppModel;
