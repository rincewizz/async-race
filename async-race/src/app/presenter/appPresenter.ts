import AppModel from '../model/appModel';
import { Car } from '../types';
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
    });

    this.model.subscribe('createCar', (data: Car) => {
      this.view.renderCar(data);
    });

    this.model.subscribe('updateCar', (data: Car) => {
      this.view.updateCar(data);
    });

    this.model.subscribe('removeCar', (id: number) => {
      this.view.removeCar(id);
    });

    this.model.subscribe('updateCarsCount', (count: number) => {
      this.view.updateCount(count);
    });

    this.model.subscribe('updateGaragePage', (page: number) => {
      this.view.updateGaragePage(page);
    });

    this.view.garageBtn.addEventListener('click', () => {
      this.openGarage();
    });

    this.view.createCarBtn.addEventListener('click', () => {
      const name: string = this.view.newCarNameInput.value;
      const color: string = this.view.newCarColorInput.value;
      this.model.createCar(name, color);
    });

    this.view.updateCarBtn.addEventListener('click', () => {
      const name: string = this.view.editCarNameInput.value;
      const color: string = this.view.editCarColorInput.value;
      this.model.updateCar(this.model.state.selectedCar, name, color);
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
        }
      }
    });

    this.view.pagePrevBtn.addEventListener('click', () => {
      this.model.setGaragePage(this.model.state.garagePage - 1);
    });

    this.view.pageNextBtn.addEventListener('click', () => {
      this.model.setGaragePage(this.model.state.garagePage + 1);
    });

    this.model.setGaragePage(1);
  }

  openGarage() {
    AppView.showEl(this.view.garage);
    AppView.hideEl(this.view.winners);
  }

  openWinners() {
    AppView.showEl(this.view.winners);
    AppView.hideEl(this.view.garage);
  }
}

export default AppPresenter;
