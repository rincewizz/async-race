import { Car } from '../types';

class AppView {
  garageBtn: HTMLButtonElement;

  winnersBtn: HTMLButtonElement;

  garage: HTMLElement;

  winners: HTMLElement;

  carsCount: HTMLElement;

  garagePageNumber: HTMLElement;

  cars: HTMLElement;

  createCarBtn: HTMLButtonElement;

  newCarNameInput: HTMLInputElement;

  newCarColorInput: HTMLInputElement;

  updateCarBtn: HTMLButtonElement;

  editCarNameInput: HTMLInputElement;

  editCarColorInput: HTMLInputElement;

  raceBtn: HTMLButtonElement;

  resetBtn: HTMLButtonElement;

  generateBtn: HTMLButtonElement;

  pagePrevBtn: HTMLButtonElement;

  pageNextBtn: HTMLButtonElement;

  winCarMessage: HTMLElement;

  winnersTable: HTMLTableElement;

  winnersTbody: HTMLTableSectionElement;

  winnersPaginations: HTMLElement;

  winnersPageNumber: HTMLElement;

  winnersCount: HTMLElement;

  constructor() {
    this.garageBtn = document.createElement('button');
    this.garageBtn.innerText = 'Garage';
    this.garageBtn.classList.add('garage-btn');

    this.winnersBtn = document.createElement('button');
    this.winnersBtn.innerText = 'Winners';
    this.winnersBtn.classList.add('winners-btn');

    document.body.innerHTML = `<div class="view-btns"></div>
    <div class="garage">

      <div class="create-car">
        <input type="text" class="new-car-name"><input type="color" class="new-car-color"><button class="create-car-btn">Create</button>
      </div>
      <div class="update-car">
        <input type="text" class="edit-car-name"><input type="color" class="edit-car-color"><button class="update-car-btn">Update</button>
      </div>
      <div class="">
        <button class="race">RACE</button>
        <button class="reset">RESET</button>
        <button class="generate">GENERATE</button>
      </div>

      <h2>GARAGE (<span class="cars-count">0</span>)</h2>
      <div class="page">Page #<span class="page-number">0</span></div>
      <div class="cars">
      </div>
      <div class="pagination">
        <button class="page-prev-btn">prev</button>
        <button class="page-next-btn">next</button>
      </div>
      <div class="win-message hide"></div>
    </div>
    <div class="winners hide">
      <h2>Winners (<span class="winners-count">0</span>)</h2>
      <div class="page-winners">Page #<span class="page-winners-number">0</span></div>
      <table class="winners-table">
        <thead>
          <tr>
            <th>Number</th>
            <th>Car</th>
            <th>Name</th>
            <th>Wins</th>
            <th>Best time (seconds)</th>
          </tr>
        </thead>
        <tbody class="winners-tbody"></tbody>
      </table>
      <div class="pagination-winners">
        <button class="page-prev-btn">prev</button>
        <button class="page-next-btn">next</button>
      </div>
    </div>
    `;
    const viewBtns: HTMLElement | null = document.querySelector('.view-btns');
    if (viewBtns) {
      viewBtns.append(this.garageBtn);
      viewBtns.append(this.winnersBtn);
    }

    this.garage = document.querySelector('.garage') as HTMLElement;

    this.winners = document.querySelector('.winners') as HTMLElement;

    this.cars = document.querySelector('.cars') as HTMLElement;

    this.createCarBtn = document.querySelector('.create-car-btn') as HTMLButtonElement;
    this.newCarNameInput = document.querySelector('.new-car-name') as HTMLInputElement;
    this.newCarColorInput = document.querySelector('.new-car-color') as HTMLInputElement;

    this.updateCarBtn = document.querySelector('.update-car-btn') as HTMLButtonElement;
    this.editCarNameInput = document.querySelector('.edit-car-name') as HTMLInputElement;
    this.editCarColorInput = document.querySelector('.edit-car-color') as HTMLInputElement;

    this.raceBtn = document.querySelector('.race') as HTMLButtonElement;
    this.resetBtn = document.querySelector('.reset') as HTMLButtonElement;
    this.generateBtn = document.querySelector('.generate') as HTMLButtonElement;

    this.carsCount = document.querySelector('.cars-count') as HTMLElement;
    this.garagePageNumber = document.querySelector('.page-number') as HTMLElement;

    this.pagePrevBtn = document.querySelector('.page-prev-btn') as HTMLButtonElement;
    this.pageNextBtn = document.querySelector('.page-next-btn') as HTMLButtonElement;

    this.winCarMessage = document.querySelector('.win-message') as HTMLElement;
    this.winnersTable = document.querySelector('.winners-table') as HTMLTableElement;
    this.winnersTbody = document.querySelector('.winners-tbody') as HTMLTableSectionElement;

    this.winnersPaginations = document.querySelector('.pagination-winners') as HTMLElement;

    this.winnersPageNumber = document.querySelector('.page-winners-number') as HTMLElement;
    this.winnersCount = document.querySelector('.winners-count') as HTMLElement;
  }

  renderGarage(cars: Array<Car>) {
    this.cars.innerHTML = '';
    cars.forEach((item) => {
      this.renderCar(item);
    });
  }

  renderCar(car: Car) {
    this.cars.insertAdjacentHTML(
      'beforeend',
      `<div class="cars__item" data-id="${car.id}" data-color="${car.color}" data-name="${car.name}">
        <div class="cars__row">
        <button class="car__select">select</button><button class="car__remove">remove</button><div class="car__title">${car.name}</div>
        </div>
        <div class="cars__row cars__track">
          <button class="car__start">A</button><button class="car__stop">B</button>
          <div class="car__path">
            <div class="car" style="background-color: ${car.color}"></div>
          </div>
        </div>
      </div>`,
    );
  }

  removeCar(id: number) {
    this.cars.querySelector(`[data-id="${id}"]`)?.remove();
  }

  selectForUpdate(id: number) {
    const carEl: HTMLElement | null = this.cars.querySelector(`[data-id="${id}"]`);
    if (carEl) {
      this.editCarColorInput.value = carEl.dataset.color || '';
      this.editCarNameInput.value = carEl.dataset.name || '';
    }
  }

  updateCar(car: Car) {
    const carsItemEl: HTMLElement | null = this.cars.querySelector(`[data-id="${car.id}"]`);
    if (carsItemEl) {
      carsItemEl.dataset.color = car.color;
      carsItemEl.dataset.name = car.name;
      const carEl: HTMLElement | null = carsItemEl.querySelector('.car');
      if (carEl) carEl.style.backgroundColor = car.color;
      const carName: HTMLElement | null = carsItemEl.querySelector('.car__title');
      if (carName) carName.innerText = car.name;
    }
  }

  updateCount(count: number) {
    this.carsCount.innerText = String(count);
  }

  updateGaragePage(page: number) {
    this.garagePageNumber.innerText = String(page);
  }

  startCar(carId: number, { velocity, distance }: { velocity: number, distance: number }) {
    let start: number | null = null;
    const carItemEl = this.cars.querySelector(`[data-id="${carId}"]`) as HTMLElement;
    carItemEl.dataset.engine = 'started';
    const carEl = carItemEl.querySelector('.car') as HTMLElement;
    const pathEl = carItemEl.querySelector('.car__path') as HTMLElement;
    const pathWidth: number = pathEl.offsetWidth - carEl.offsetWidth;

    function anim(timestamp: number) {
      if (carItemEl.dataset.engine === 'stopped') return;
      if (!start) start = timestamp;
      const driveTime = distance / velocity;
      const timePass: number = timestamp - start;

      const progress: number = (pathWidth / driveTime) * timePass;
      if (carEl) carEl.style.transform = `translateX(${progress > pathWidth ? pathWidth : progress}px)`;

      if (progress < pathWidth && carItemEl.dataset.engine !== 'stopped') {
        window.requestAnimationFrame(anim);
      }
    }

    const rafId: number = window.requestAnimationFrame(anim);
    return rafId;
  }

  stopCar(id: number) {
    const carItem: HTMLElement = this.cars.querySelector(`[data-id="${id}"]`) as HTMLElement;
    carItem.dataset.engine = 'stopped';
  }

  resetCar(id: number) {
    const carEl: HTMLElement = this.cars.querySelector(`[data-id="${id}"] .car`) as HTMLElement;
    this.stopCar(id);
    carEl.style.transform = 'translateX(0px)';
  }

  getCarsId(): number[] {
    return Array.prototype.map.call(this.cars.querySelectorAll('.cars__item'), (el) => +el.dataset.id) as number[];
  }

  static getCarId(el: HTMLElement) {
    const carItem: HTMLElement | null = el.closest('.cars__item');
    if (carItem) {
      return Number(carItem.dataset.id);
    }
    return 0;
  }

  static showEl(element: HTMLElement) {
    element.classList.remove('hide');
    element.classList.add('show');
  }

  static hideEl(element: HTMLElement) {
    element.classList.remove('show');
    element.classList.add('hide');
  }
}

export default AppView;
