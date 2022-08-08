import { State } from '../types';
import EngineModel from './engine';
import GarageModel from './garage';
import WinnersModel from './winners';

class AppModel {
  public listeners: { [index: string]: Array<Function> };

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
      winnersCount: 0,
      winnersPage: 0,
      selectedCar: 0,
    };
    this.brand = [
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
    this.model = [
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

  setGaragePage(page: number = 1) {
    if (page < 1 || (this.state.garagePage !== 0
      && page > Math.ceil(this.state.carsCount / 7))) return;
    this.state.garagePage = page;
    this.broadcast('updateGaragePage', this.state.garagePage);

    this.garage.getCars(page)
      .then((response) => {
        const count: number = Number(response.headers.get('x-total-count'));
        this.setCarsCount(count);
        return response.json();
      })
      .then((data) => this.broadcast('garage', data));
  }

  createCar(name: string, color: string) {
    this.garage.createCar(name, color).then((response) => response.json())
      .then((data) => {
        this.setCarsCount(this.state.carsCount + 1);
        if (Math.ceil(this.state.carsCount / 7) === this.state.garagePage) {
          this.broadcast('createCar', data);
        }
      });
  }

  updateCar(id: number, name: string, color: string) {
    this.garage.updateCar(id, name, color)
      .then((response) => response.json())
      .then(() => this.broadcast('updateCar', { id, name, color }));
  }

  deleteCar(id: number) {
    this.garage.deleteCar(id).then((response) => response.json())
      .then(() => {
        this.broadcast('removeCar', id);
        if (this.getGaragePages() !== this.state.garagePage) {
          const page = this.state.garagePage * 7;
          this.garage.getCars(page, 1)
            .then((response) => {
              const count: number = Number(response.headers.get('x-total-count'));
              this.setCarsCount(count);
              return response.json();
            })
            .then((data) => this.broadcast('createCar', data[0]));
        }
        this.setCarsCount(this.state.carsCount - 1);
      });
  }

  getGaragePages() {
    const pages: number = Math.ceil(this.state.carsCount / 7);
    if (pages < this.state.garagePage) {
      this.setGaragePage(pages);
    }
    return pages;
  }

  setCarsCount(count: number) {
    this.state.carsCount = count || 0;
    this.broadcast('updateCarsCount', this.state.carsCount);
  }
}

export default AppModel;
