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

  constructor() {
    this.listeners = {};
    this.state = {
      carsCount: 0,
      garagePage: 0,
      winnersCount: 0,
      winnersPage: 0,
      selectedCar: 0,
    };

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
