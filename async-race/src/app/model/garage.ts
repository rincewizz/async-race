import { HOST } from '../constants';

class GarageModel {
  private host: string;

  constructor() {
    this.host = HOST;
  }

  getCars(page: number, limit: number = 7) {
    return fetch(`${this.host}garage?_page=${page}&_limit=${limit}`);
  }

  getCar(id: number): Promise<Response> {
    return fetch(`${this.host}garage/${id}`);
  }

  createCar(name: string, color: string) {
    return fetch(`${this.host}garage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ name, color }),
    });
  }

  deleteCar(id: number) {
    return fetch(`${this.host}garage/${id}`, {
      method: 'DELETE',
    });
  }

  updateCar(id: number, name: string, color: string) {
    return fetch(`${this.host}garage/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ name, color }),
    });
  }
}

export default GarageModel;
