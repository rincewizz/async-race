import EngineModel from './engine';
import GarageModel from './garage';
import WinnersModel from './winners';

class AppModel {
  public garage: GarageModel;

  public engine: EngineModel;

  public winners: WinnersModel;

  constructor() {
    this.garage = new GarageModel();
    this.engine = new EngineModel();
    this.winners = new WinnersModel();
  }
}

export default AppModel;
