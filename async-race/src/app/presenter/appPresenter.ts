import AppModel from '../model/appModel';
import {
  Car, EngineResponse, Pagination, Sort, SortOrder, Winner,
} from '../types';
import AppView from '../view/appView';

class AppPresenter {
  private model: AppModel;

  private view: AppView;

  constructor(model: AppModel, view: AppView) {
    this.model = model;
    this.view = view;
  }

  init() {
    this.initGarageSubscribers();
    this.initCarsSubscribers();
    this.initWinnersSubscribers();

    this.initGarageEvents();
    this.initWinnersEvents();

    this.model.setGaragePage(1);
    this.model.setWinnersPage(1);
    this.openGarage();
  }

  initGarageSubscribers() {
    this.model.subscribe('loadGaragePage', (data: Car[]) => {
      this.view.renderCars(data);
    });

    this.model.subscribe('updateGaragePagination', (pagination: Pagination) => {
      this.view.pagePrevBtn.disabled = pagination.prev;
      this.view.pageNextBtn.disabled = pagination.next;
    });

    this.model.subscribe('updateCarsCount', (count: number) => {
      this.view.updateCount(count);
      this.view.raceBtn.disabled = count < 1;
    });

    this.model.subscribe('updateGaragePage', (page: number) => {
      this.view.updateGaragePage(page);
    });
  }

  initCarsSubscribers() {
    this.model.subscribe('createCar', (data: Car) => {
      this.view.renderCar(data);
    });

    this.model.subscribe('updateCar', (data: Car) => {
      this.view.updateCar(data);
    });

    this.model.subscribe('removeCar', (id: number) => {
      this.view.removeCar(id);
      this.model.deleteWinner(id);
    });
    this.model.subscribe('startEngine', (data: {id: number, engine: EngineResponse}) => {
      this.view.startCar(data.id, data.engine);
    });
    this.model.subscribe('stopCarAnimation', (id: number) => {
      this.view.stopCar(id);
    });
    this.model.subscribe('stopEngine', (data: {id: number, data: { velocity: number; distance: number; }}) => {
      this.view.resetCar(data.id);
    });

    this.model.subscribe('raceStart', () => {
      this.view.raceBtn.disabled = true;
      this.view.resetBtn.disabled = true;
    });

    this.model.subscribe('raceEnd', (data: {id: number, data: { velocity: number; distance: number; }, time: number}) => {
      this.model.getCarById(data.id).then((car: Car) => {
        this.view.showWin(car.name, data.time);
        this.model.addWinner(car.id, data.time);
        this.view.resetBtn.disabled = false;
      });
    });
  }

  initWinnersSubscribers() {
    this.model.subscribe('loadWinnersPage', (data:{ winners: Array<Winner & Car>, page: number}) => {
      this.view.renderWinners(data);
    });

    this.model.subscribe('updateWinnersPagination', (pagination: Pagination) => {
      const prevBtn: HTMLButtonElement = this.view.winnersPaginations.querySelector('.page-prev-btn') as HTMLButtonElement;
      const nextBtn: HTMLButtonElement = this.view.winnersPaginations.querySelector('.page-next-btn') as HTMLButtonElement;

      prevBtn.disabled = pagination.prev;
      nextBtn.disabled = pagination.next;
    });

    this.model.subscribe('removeWinner', () => {
      this.model.setWinnersPage(this.model.state.winnersPage);
    });

    this.model.subscribe('updateWinnersCount', (count: number) => {
      this.view.updateWinnersCount(count);
    });

    this.model.subscribe('updateWinnersPage', (page: number) => {
      this.view.updateWinnersPage(page);
    });

    this.model.subscribe('updateWinners', () => {
      this.model.state.winnersPage = 0;
      this.model.setWinnersPage(this.model.state.winnersPage || 1);
    });
  }

  initGarageEvents() {
    this.view.garageBtn.addEventListener('click', () => {
      this.openGarage();
    });

    this.view.winnersBtn.addEventListener('click', () => {
      this.openWinners();
    });

    this.view.createCarBtn.addEventListener('click', () => {
      const name: string = this.view.newCarNameInput.value;
      const color: string = this.view.newCarColorInput.value;
      this.model.createCar(name, color);
      this.view.newCarNameInput.value = '';
      this.view.newCarColorInput.value = '#000000';
    });

    this.view.updateCarBtn.addEventListener('click', () => {
      const name: string = this.view.editCarNameInput.value;
      const color: string = this.view.editCarColorInput.value;
      this.model.updateCar(this.model.state.selectedCar, name, color);
    });

    this.view.generateBtn.addEventListener('click', () => {
      this.model.generateCars();
    });

    this.view.cars.addEventListener('click', (e) => {
      const target: HTMLElement = e.target as HTMLElement;
      const carId = AppView.getCarId(target);
      if (!carId) return;

      if (target.classList.contains('car__remove')) {
        this.model.deleteCar(carId);
      }
      if (target.classList.contains('car__select')) {
        this.model.state.selectedCar = carId;
        this.view.selectForUpdate(carId);
      }
      if (target.classList.contains('car__start')) {
        this.model.startEngine(carId).catch(() => new Error('error: engine was broken down'));
      }
      if (target.classList.contains('car__stop')) {
        this.model.stopEngine(carId);
      }
    });

    this.view.pagePrevBtn.addEventListener('click', () => {
      this.model.setGaragePage(this.model.state.garagePage - 1);
    });

    this.view.pageNextBtn.addEventListener('click', () => {
      this.model.setGaragePage(this.model.state.garagePage + 1);
    });

    this.view.raceBtn.addEventListener('click', () => {
      const ids: number[] = this.view.getCarsId();
      this.model.startRace(ids);
    });

    this.view.resetBtn.addEventListener('click', () => {
      this.view.hideWin();
      const ids: number[] = this.view.getCarsId();
      ids.forEach((id) => this.model.stopEngine(id));
      this.view.raceBtn.disabled = false;
    });
  }

  initWinnersEvents() {
    this.view.winnersPaginations.addEventListener('click', (e) => {
      const target: HTMLElement = e.target as HTMLElement;
      if (target.classList.contains('page-prev-btn')) {
        this.model.setWinnersPage(this.model.state.winnersPage - 1);
      }
      if (target.classList.contains('page-next-btn')) {
        this.model.setWinnersPage(this.model.state.winnersPage + 1);
      }
    });

    this.view.winnersTable.addEventListener('click', (e) => {
      const target: HTMLElement = e.target as HTMLElement;
      const th = target.closest('th');
      if (!th) return;

      const order: SortOrder = this.model.state.sortOrder === 'ASC' ? 'DESC' : 'ASC';

      let newSort: Sort | null = null;
      if (th.classList.contains('th-wins')) newSort = 'wins';
      if (th.classList.contains('th-best-time')) newSort = 'time';

      if (newSort) {
        this.view.winnersTable.querySelectorAll('.order-symbol').forEach((el) => el.firstChild?.remove());
        this.model.state.sort = newSort;
        this.model.state.sortOrder = order;
        const symbol = th.querySelector('.order-symbol');
        if (symbol) symbol.innerHTML = order === 'ASC' ? '↓' : '↑';
        this.model.setWinnersPage(this.model.state.winnersPage, newSort, order);
      }
    });
  }

  openGarage() {
    AppView.showEl(this.view.garage);
    AppView.hideEl(this.view.winners);
    this.view.garageBtn.disabled = true;
    this.view.winnersBtn.disabled = false;
  }

  openWinners() {
    AppView.showEl(this.view.winners);
    AppView.hideEl(this.view.garage);
    this.view.garageBtn.disabled = false;
    this.view.winnersBtn.disabled = true;
  }
}

export default AppPresenter;
