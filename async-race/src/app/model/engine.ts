import { HOST } from '../constants';

class EngineModel {
  private host: string;

  constructor() {
    this.host = HOST;
  }

  engine(id: number, status: 'started'|'stopped'|'drive') {
    return fetch(`${this.host}engine?id=${id}&status=${status}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    });
  }
}

export default EngineModel;
