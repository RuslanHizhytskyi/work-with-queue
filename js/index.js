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
  constructor(indicatorSelector, indicatorActiveClass, queueIndicatorSelector, buttonSelector, CONSTS) {
    // получаем необходимые параметры
    this.button = document.querySelector(buttonSelector); // кнопка запуска/остановки генератора
    this.queueIndicator = document.querySelector(queueIndicatorSelector),
    this.newObject = null, // переменная для создания объектов
    this.toggle = false, // флаг активност
    this.indicator = document.querySelector(indicatorSelector), // индикатор генератора
    this.timerId = null,
    this.timeOut = null,
    this.indicatorActiveClass = indicatorActiveClass, // класс активности индикатора
    this.minTimeout = CONSTS.MIN_TIMEOUT,
    this.maxTimeout = CONSTS.MAX_TIMEOUT,
    this.minNum = CONSTS.MIN_NUM, 
    this.maxNum = CONSTS.MAX_NUM;
  }

  startGenerator() {
    this.timeOut = randomInteger(this.minTimeout, this.maxTimeout) * 1000; // устанавливаем timeout
    if (this.toggle) { // если метод уже работает
      this.newObject = new GenerateObject(this.minNum, this.maxNum); // создаём новый объект
      main.mainQueue.push(this.newObject); // записываем объект в очередь
      this.queueIndicator.classList.add(this.indicatorActiveClass); // включаем индикатор очереди
      this.timerId = setTimeout(() => this.startGenerator(this), this.timeOut);
    } else { // запуск метода
      this.indicator.classList.add(this.indicatorActiveClass);
      this.toggle = !this.toggle;
      this.timerId = setTimeout(() => this.startGenerator(this), this.timeOut);
    }
  }
  // становка генератора
  stopGenerator() {
    this.toggle = !this.toggle;
    clearTimeout(this.timerId);
    this.indicator.classList.remove(this.indicatorActiveClass);
  }
}

// класс получателя
class CreateGetter {
  constructor(indicatorSelector, indicatorActiveClass, queueIndicatorSelector, buttonSelector, CONSTS) {
    // получаем необходимые параметры
    this.button = document.querySelector(buttonSelector); // кнопка запуска/остановки получателя
    this.queueIndicator = document.querySelector(queueIndicatorSelector),
    this.newObject = null, // переменная для получения объектов
    this.toggle = false, // флаг активност
    this.indicator = document.querySelector(indicatorSelector), // индикатор получателя
    this.defaulTimeOut = CONSTS.DEFAULT_TIMEOUT,
    this.timerId = null,
    this.timeOut = this.defaulTimeOut,
    this.indicatorActiveClass = indicatorActiveClass, // класс активности индикатора
    this.limitOne = CONSTS.LIMIT_1, // первая граница
    this.limitTwo = CONSTS.LIMIT_2; // вторая граница
  }
  

  startGetter() {
    if (this.toggle) { // если метод уже работает
      if (main.mainQueue.length > 0) { // усли очередь не пуста
        this.timeOut = this.defaulTimeOut;
        this.newObject = main.mainQueue.shift();
        if (main.mainQueue.length <= 0) { // проверяем не стала ли очередь пуста
          this.queueIndicator.classList.remove(this.indicatorActiveClass);
        }
        if (this.newObject.data < this.limitOne) { // условие для первого счётчика
          main.counter[0].count++;
          main.counter[0].counterNode.textContent = main.counter[0].count;
        } else if (this.newObject.data >= this.limitTwo) { // условие для третьего счётчика
          main.counter[2].count++;
          main.counter[2].counterNode.textContent = main.counter[2].count;
        } else { // всё что не попало в первый и третий счётчик попадает во второй
          main.counter[1].count++;
          main.counter[1].counterNode.textContent = main.counter[1].count;
        }
      } else { // если очередь пуста
        this.queueIndicator.classList.remove(this.indicatorActiveClass);
        this.timeOut++; // увеличиваем timeout если очередь пуста
      }
      this.timerId = setTimeout(() => this.startGetter(this), this.timeOut * 1000);
    } else { // запуск метода
      this.indicator.classList.add(this.indicatorActiveClass);
      this.toggle = !this.toggle;
      this.timerId = setTimeout(() => this.startGetter(this), this.timeOut * 1000);
    }
  }

  // остановка получателя
  stopGetter() {
    this.toggle = !this.toggle; // переключаем флаг активности
    clearTimeout(this.timerId); // сбрасываем timeout
    this.indicator.classList.remove(this.indicatorActiveClass); // переключаем класс активности
  }
}

// создаем генератор
const generator = new CreateGenerator(
  '.indicator--1', 
  'indicator--active',
  '.indicator--3',
  '.button--1',
  CONSTS
);

// создаем получатель
const getter = new CreateGetter(
  '.indicator--2', 
  'indicator--active',
  '.indicator--3',
  '.button--2',
  CONSTS
);


// обрабатываем событи клика на кнопки
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