const MIN_SEC = 1,
      MAX_SEC = 10,
      MIN_NUM = 1,
      MAX_NUM = 100,
      LIMIT_1 = 30,
      LIMIT_2 = 70;

const mainQueue = [], // очередь объектов
      buttonGenerator = document.querySelector('.button--1'), // кнопка запуска и остановки генератора
      buttonGeter = document.querySelector('.button--2'), // кнопка запуска и остановки получателя
      resetCounter = document.querySelector('.button--3'), // кнопка очистки счётчиков
      counters = document.querySelectorAll('.counter span'), // коллекция счётчиков
      indicatos = document.querySelectorAll('.indicator'); // коллекция индикаторов
let timerIdGenerator,
    timerIdGeter,
    toggleGenerator = false, // индикатор работы генератора
    toggleGeter = false; // индикатор работы получателя



// служебная функция
function randomInteger(min, max) {
  let rand = min + Math.random() * (max + 1 - min); // случайное число от min до (max+1)
  return Math.floor(rand);
}


// класс для объектов
class GenerateObject {
  constructor(min, max) {
    this.data = randomInteger(min, max);
  }
}

// функция генератор
function generator() {
  const newObject = new GenerateObject(MIN_NUM, MAX_NUM);
  const newTimeout = randomInteger(MIN_SEC, MAX_SEC) * 100;
  mainQueue.push(newObject);
  indicatos[2].classList.add('indicator--active');
  timerIdGenerator = setTimeout(generator, newTimeout);
}

buttonGenerator.addEventListener('click', () => {
  if (toggleGenerator) {
    toggleGenerator = !toggleGenerator;
    clearTimeout(timerIdGenerator);
    indicatos[0].classList.remove('indicator--active');
  } else {
    toggleGenerator = !toggleGenerator;
    generator();
    indicatos[0].classList.add('indicator--active');
  }
});

// функция получадель
function getter() {
  if (mainQueue.length > 0) {
    const newObject = mainQueue.shift();
    if (newObject.data < LIMIT_1) {
      counters[0].textContent = +counters[0].textContent + 1;
    } else if (newObject.data >= LIMIT_2) {
      counters[2].textContent = +counters[2].textContent + 1;
    } else {
      counters[1].textContent = +counters[1].textContent + 1;
    }
    timerIdGeter = setTimeout(getter, 200);
  } else {
    indicatos[2].classList.remove('indicator--active');
    timerIdGeter = setTimeout(getter, 200);
  }
}

buttonGeter.addEventListener('click', () => {
  if (toggleGeter) {
    indicatos[1].classList.remove('indicator--active');
    clearTimeout(timerIdGeter);
    toggleGeter = !toggleGeter;
  } else {
    indicatos[1].classList.add('indicator--active');
    getter();
    toggleGeter = !toggleGeter;
  }
});


resetCounter.addEventListener('click', () => {
  counters.forEach(counter => counter.textContent = 0);
});