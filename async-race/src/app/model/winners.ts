import { HOST } from '../constants';
import { Sort, SortOrder } from '../types';

class WinnersModel {
  private host: string;

  constructor() {
    this.host = HOST;
  }

  getWinners(page: number, limit: number, sort: Sort = 'time', order: SortOrder = 'ASC') {
    return fetch(`${this.host}winners?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}`);
  }

  getWinner(id: number) {
    return fetch(`${this.host}winners/${id}`);
  }

  createWinner(id: number, wins: number, time: number) {
    return fetch(`${this.host}winners`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ id, wins, time }),
    });
  }

  updateWinner(id: number, wins: number, time: number) {
    return fetch(`${this.host}winners/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ wins, time }),
    });
  }

  deleteWinner(id: number) {
    return fetch(`${this.host}winners/${id}`, {
      method: 'DELETE',
    });
  }
}

export default WinnersModel;
