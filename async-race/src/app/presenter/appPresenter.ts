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

    this.model.subscribe('updateCarsCount', (count: number) => {
      this.view.updateCount(count);
    });

    this.model.subscribe('updateGaragePage', (page: number) => {
      this.view.updateGaragePage(page);
    });

    this.view.garageBtn.addEventListener('click', () => {
      this.openGarage();
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
