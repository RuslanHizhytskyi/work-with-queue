// обявляем константы с условия ТЗ
const CONSTS = {
  MIN_TIMEOUT: 1, // в секундах
  MAX_TIMEOUT: 10, // в секундах
  MIN_NUM: 1, // минимальное значение data
  MAX_NUM: 100, // максимальное значение data
  DEFAULT_TIMEOUT: 2, // в секундах
  LIMIT_1: 30, // первая граница счётчика
  LIMIT_2: 70, // вторая граница счётчика
};

// главный объект
const main = {
  mainQueue: [], // очередь
  counter: [ // счётчики и Node узлы для отображения
    {
      count: 0,
      counterNode: document.querySelector('.counter--1 span'),
    },
    {
      count: 0,
      counterNode: document.querySelector('.counter--2 span'),
    },
    {
      count: 0,
      counterNode: document.querySelector('.counter--3 span'),
    },
  ],
  button: document.querySelector('.button--3'), // кнопка сброса счётчика
  // функция сброса счётчика
  resetCounter: function() { 
    this.counter.forEach(elem => { //прохлдимся по масиву счётчика
      elem.count = 0; //сбрасываем значение
      elem.counterNode.textContent = elem.count; // отображаем значение на странице
    });
  }
};

// служебная функция получение рандомных чисел в диапазоне
function randomInteger(min, max) {
  let rand = min + Math.random() * (max + 1 - min); // случайное число от min до (max+1)
  return Math.floor(rand);
}

// класс для создания объектов
class GenerateObject {
  constructor(min, max) {
    this.data = randomInteger(min, max);
  }
}

// класс генератор
class CreateGenerator {
  constructor(indicatorSelector, indicatorActiveClass, queueIndicatorSelector, buttonSelector, queue , CONSTS) {
    this.button = document.querySelector(buttonSelector);
    this.queue = queue,
    this.queueIndicator = document.querySelector(queueIndicatorSelector),
    this.newObject = null,
    this.toggle = false,
    this.indicator = document.querySelector(indicatorSelector),
    this.timerId = null,
    this.timeOut = null,
    this.indicatorActiveClass = indicatorActiveClass,
    this.minTimeout = CONSTS.MIN_TIMEOUT,
    this.maxTimeout = CONSTS.MAX_TIMEOUT,
    this.minNum = CONSTS.MIN_NUM, 
    this.maxNum = CONSTS.MAX_NUM;
  }

  startGenerator() {
    this.timeOut = randomInteger(this.minTimeout, this.maxTimeout) * 1000;
    if (this.toggle) {
      this.newObject = new GenerateObject(this.minNum, this.maxNum);
      this.queue.push(this.newObject);
      this.queueIndicator.classList.add(this.indicatorActiveClass);
      this.timerId = setTimeout(() => this.startGenerator(this), this.timeOut);
    } else {
      this.indicator.classList.add(this.indicatorActiveClass);
      this.toggle = !this.toggle;
      this.timerId = setTimeout(() => this.startGenerator(this), this.timeOut);
    }
  }
  stopGenerator() {
    this.toggle = !this.toggle;
    clearTimeout(this.timerId);
    this.indicator.classList.remove(this.indicatorActiveClass);
  }
}
class CreateGetter {
  constructor(indicatorSelector, indicatorActiveClass, queueIndicatorSelector, buttonSelector, queue, CONSTS) {
    this.button = document.querySelector(buttonSelector);
    this.queue = queue,
    this.queueIndicator = document.querySelector(queueIndicatorSelector),
    this.newObject = null,
    this.toggle = false,
    this.indicator = document.querySelector(indicatorSelector),
    this.defaulTimeOut = CONSTS.DEFAULT_TIMEOUT,
    this.timerId = null,
    this.timeOut = this.defaulTimeOut,
    this.indicatorActiveClass = indicatorActiveClass,
    this.limitOne = CONSTS.LIMIT_1,
    this.limitTwo = CONSTS.LIMIT_2;
  }

  startGetter() {
    if (this.toggle) {
      if (this.queue.length > 0) {
        this.timeOut = this.defaulTimeOut;
        this.newObject = this.queue.shift();
        if (this.newObject.data < this.limitOne) {
          main.counter[0].count++;
          main.counter[0].counterNode.textContent = main.counter[0].count;
        } else if (this.newObject.data >= this.limitTwo) {
          main.counter[2].count++;
          main.counter[2].counterNode.textContent = main.counter[2].count;
        } else {
          main.counter[1].count++;
          main.counter[1].counterNode.textContent = main.counter[1].count;
        }
      } else {
        this.queueIndicator.classList.remove(this.indicatorActiveClass);
        this.timeOut++;
      }
      this.timerId = setTimeout(() => this.startGetter(this), this.timeOut * 1000);
    } else {
      this.indicator.classList.add(this.indicatorActiveClass);
      this.toggle = !this.toggle;
      this.timerId = setTimeout(() => this.startGetter(this), this.timeOut * 1000);
    }
  }

  stopGetter() {
    this.toggle = !this.toggle;
    clearTimeout(this.timerId);
    this.indicator.classList.remove(this.indicatorActiveClass);
  }
}

const generator = new CreateGenerator(
  '.indicator--1', 
  'indicator--active',
  '.indicator--3',
  '.button--1',
  main.mainQueue,  
  CONSTS
);

const getter = new CreateGetter(
  '.indicator--2', 
  'indicator--active',
  '.indicator--3',
  '.button--2',
  main.mainQueue,
  CONSTS
);

generator.button.addEventListener('click', () => {
  if (generator.toggle) {
    generator.stopGenerator();
  } else {
    generator.startGenerator();
  }
});

getter.button.addEventListener('click', () => {
  if (getter.toggle) {
    getter.stopGetter();
  } else {
    getter.startGetter();
  }
});

main.button.addEventListener('click', () => {
  main.resetCounter();
});