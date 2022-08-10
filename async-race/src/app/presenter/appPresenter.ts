import AppModel from '../model/appModel';
import { Car, Winner } from '../types';
import AppView from '../view/appView';

class AppPresenter {
  private model: AppModel;

  private view: AppView;

  constructor(model: AppModel, view: AppView) {
    this.model = model;
    this.view = view;
  }

  init() {
    this.model.subscribe('garage', (data: Car[]) => {
      this.view.renderGarage(data);
      if (this.model.state.garagePage === 1) {
        this.view.pagePrevBtn.disabled = true;
      } else {
        this.view.pagePrevBtn.disabled = false;
      }
      if (this.model.state.garagePage === Math.ceil(this.model.state.carsCount / 7)) {
        this.view.pageNextBtn.disabled = true;
      } else {
        this.view.pageNextBtn.disabled = false;
      }
    });
    this.model.subscribe('winners', (data:{ winners: Array<Winner & Car>, page: number}) => {
      this.view.renderWinners(data);
      const prevBtn: HTMLButtonElement = this.view.winnersPaginations.querySelector('.page-prev-btn') as HTMLButtonElement;
      const nextBtn: HTMLButtonElement = this.view.winnersPaginations.querySelector('.page-next-btn') as HTMLButtonElement;
      if (this.model.state.winnersPage === 1) {
        prevBtn.disabled = true;
      } else {
        prevBtn.disabled = false;
      }
      if (this.model.state.winnersPage === Math.ceil(this.model.state.winnersCount / 10)) {
        nextBtn.disabled = true;
      } else {
        nextBtn.disabled = false;
      }
    });

    this.model.subscribe('updatePagination', () => {
      if (this.model.state.garagePage === 1) {
        this.view.pagePrevBtn.disabled = true;
      } else {
        this.view.pagePrevBtn.disabled = false;
      }
      if (this.model.state.garagePage === Math.ceil(this.model.state.carsCount / 7)) {
        this.view.pageNextBtn.disabled = true;
      } else {
        this.view.pageNextBtn.disabled = false;
      }
    });

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

    this.model.subscribe('removeWinner', () => {
      this.model.setWinnersPage(this.model.state.winnersPage);
    });

    this.model.subscribe('updateCarsCount', (count: number) => {
      this.view.updateCount(count);
      this.view.raceBtn.disabled = count < 1;
    });

    this.model.subscribe('updateWinnersCount', (count: number) => {
      this.view.updateWinnersCount(count);
    });

    this.model.subscribe('updateGaragePage', (page: number) => {
      this.view.updateGaragePage(page);
    });

    this.model.subscribe('updateWinnersPage', (page: number) => {
      this.view.updateWinnersPage(page);
    });

    this.model.subscribe('startEngine', (data: {id: number, data: { velocity: number; distance: number; }}) => {
      this.view.startCar(data.id, data.data);
      const carsItemEl: HTMLElement | null = this.view.cars.querySelector(`[data-id="${data.id}"]`);
      if (carsItemEl) {
        const startBtn: HTMLButtonElement = carsItemEl.querySelector('.car__start') as HTMLButtonElement;
        const stopBtn: HTMLButtonElement = carsItemEl.querySelector('.car__stop') as HTMLButtonElement;
        startBtn.disabled = true;
        stopBtn.disabled = false;
      }
    });
    this.model.subscribe('stopCarAnimation', (id: number) => {
      this.view.stopCar(id);
    });
    this.model.subscribe('stopEngine', (data: {id: number, data: { velocity: number; distance: number; }}) => {
      this.view.resetCar(data.id);
      const carsItemEl: HTMLElement | null = this.view.cars.querySelector(`[data-id="${data.id}"]`);
      if (carsItemEl) {
        const startBtn: HTMLButtonElement = carsItemEl.querySelector('.car__start') as HTMLButtonElement;
        const stopBtn: HTMLButtonElement = carsItemEl.querySelector('.car__stop') as HTMLButtonElement;
        startBtn.disabled = false;
        stopBtn.disabled = true;
      }
    });
    this.model.subscribe('updateWinners', () => {
      this.model.state.winnersPage = 0;
      this.model.setWinnersPage(this.model.state.winnersPage || 1);
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
      this.view.editCarColorInput.value = '';
      this.view.editCarNameInput.value = '';
      this.view.editCarColorInput.disabled = true;
      this.view.editCarNameInput.disabled = true;
      this.view.updateCarBtn.disabled = true;
    });

    this.view.generateBtn.addEventListener('click', () => {
      this.model.generateCars();
    });

    this.view.cars.addEventListener('click', (e) => {
      const target: HTMLElement = e.target as HTMLElement;
      const carId = AppView.getCarId(target);

      if (target.classList.contains('car__remove')) {
        if (carId) this.model.deleteCar(carId);
      }
      if (target.classList.contains('car__select')) {
        if (carId) {
          this.model.state.selectedCar = carId;
          this.view.selectForUpdate(carId);
          this.view.editCarColorInput.disabled = false;
          this.view.editCarNameInput.disabled = false;
          this.view.updateCarBtn.disabled = false;
        }
      }
      if (target.classList.contains('car__start')) {
        if (carId) this.model.startEngine(carId).catch(() => new Error('error: engine was broken down'));
      }
      if (target.classList.contains('car__stop')) {
        if (carId) this.model.stopEngine(carId);
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
      const order: 'ASC' | 'DESC' = this.model.state.sortOrder === 'ASC' ? 'DESC' : 'ASC';

      this.view.winnersTable.querySelectorAll('.order-symbol').forEach((el) => el.firstChild?.remove());
      if (th && th.classList.contains('th-wins')) {
        this.model.state.sort = 'wins';
        this.model.state.sortOrder = order;
        const symbol = th.querySelector('.order-symbol');
        if (symbol) symbol.innerHTML = order === 'ASC' ? '↓' : '↑';
        this.model.setWinnersPage(this.model.state.winnersPage, 'wins', order);
      }
      if (th && th.classList.contains('th-best-time')) {
        this.model.state.sort = 'time';
        this.model.state.sortOrder = order;
        const symbol = th.querySelector('.order-symbol');
        if (symbol) symbol.innerHTML = order === 'ASC' ? '↓' : '↑';
        this.model.setWinnersPage(this.model.state.winnersPage, 'time', order);
      }
    });

    this.model.setGaragePage(1);
    this.model.setWinnersPage(1);
    this.openGarage();
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
