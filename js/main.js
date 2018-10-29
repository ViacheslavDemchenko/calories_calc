window.addEventListener('DOMContentLoaded', () => { 

	let weight = document.getElementById('weight-field'),//Инпут для ввода веса
		height = document.getElementById('height-field'),//Инпут для ввода роста
		age = document.getElementById('age-field'),//Инпут для ввода возраста
		calcBtn = document.querySelector('.button-calc'),//Кнопка рассчета калорий
		inputs = document.querySelectorAll('.personal-data__field'),//Псевдомассив инпутов
		genderMale = document.getElementById('male-gender'),//Чекбокс выбора мужского пола
		genderFemale = document.getElementById('female-gender'),//Чекбокс выбора женского пола
		physicalActOptions = document.getElementById('physical-activity__options'),//Выбор коэффициента физической активности
		maxDailyResult = document.querySelector('.max-daily__result'),//Элемент для вывода рекомендуемого суточного количества калорий
		slimDailyResult = document.querySelector('.slim-daily__result'),//Элемент для вывода суточного количества калорий для сброса веса
		proteinsResult = document.querySelector('.daily-proteins__result'),//Элемент для вывода суточного количества белков
		fatsResult = document.querySelector('.daily-fats__result'),//Элемент для вывода суточного количества жиров
		carbsResult = document.querySelector('.daily-carbs__result'),//Элемент для вывода суточного количества углеводов
		sanJEorFormula = document.querySelector('.Mifflin-San-JEora__field'),//Выбор формулы Миффлина-Сан Джеора
		benedictFormula = document.querySelector('.Harris-Benedict__field'),//Выбор формулы Харриса-Бенедикта
		mainCalories = 0,//Базовое количество калорий для обмена веществ
		slimCalories = 0,//Количество калорий для похудения
		energyLost = 0,//Количество калорий с учетом специфического динамического действия пищи
		dailyCalories = 0,//Суточная потребность в калориях
		count = 0;//Счетчик правильно заполненных инпутов

//Функция проверки типов данных
//принимает в качестве параметров id и регулярное выражение
	function inputCheck(id, regex) {
		//Первым параметром является выбранный по id элемент
		let element = document.getElementById(id);
			if (element) {
		    	let lastValue = element.value;//Получение значения инпута
		    if (!regex.test(lastValue)) {//Проверка соответтсвия значения инпута регулярному выражению
		      	lastValue = '';//В случае несоответствия инпут очищается
		    } 	
		    setInterval( () => {//Функия проверки срабатывает через заданный интервал
		      let value = element.value;//Присвоение переменной значения инпута
		      if (value != lastValue) {//Сравнение текущего и последнего значения инпута
		        if (regex.test(value)) {//В случае соответсвия значения инпута реугялрному выражению
		          lastValue = value;//Предыдущее значение инпута принимает его текущее значение
		        } else {
		          element.value = lastValue;//В противном случае значение инпута становится равным последнему значению
		        }
		      }
		    }, 10);//Интервал срабатывания функции
		}
	};
//Запуск функции проверки инпутов на тип данных
	inputCheck('weight-field', /^[0-9\.]*[.]?[0-9]*$/);
	inputCheck('height-field', /^[0-9\.]*[.]?[0-9]*$/);
	inputCheck('age-field', /^[0-9\.]*[.]?[0-9]*$/);

//Активация основной функции калькулятора для расчета итоговой величины через кнопку
	calcBtn.addEventListener('click', () => {
		count = 0;
//Переводим value коэффициента физической активности в числовой тип данных
		let options = Number(physicalActOptions.options[physicalActOptions.selectedIndex].value);
//Функция проверки правильности заполнения инпутов и выбора коэффициента физической активности
		function inputsCheck() {
			inputs.forEach( (input, i) => {
				if ( (inputs[i].value != '' && inputs[i].value != 0) && !isNaN(options) ) {
//Счетчик увеличивается на единицу, если инпут не равен пустой строке, нулю и выбран
//коэффициент физической активности
					count += 1;
				} 
			});
		};
		inputsCheck();	

//Функция расчета калорий
		function caloriesCalc() {
//Расчет для мужчин
			if (count >= 3 && genderMale.checked) {
//Расчет базового обмена веществ
				if (sanJEorFormula.checked) {
					mainCalories = Math.ceil( ( (9.99 * weight.value) + (6.25 * height.value) - (4.92 * age.value) + 5 ) );
				} else {
					mainCalories = Math.ceil( 88.362 + (13.397 * weight.value) + (4.799 * height.value) - (5.677 * age.value) );
				}
//С учетом специфического динамического действия пищи (энергетические затраты организма, 
//связанные с потреблением и перевариванием пищи)
				energyLost = Math.ceil(mainCalories * 0.1);
//Суточная потребность в калориях
				dailyCalories = Math.ceil((mainCalories + energyLost) * options);
//За минусом 20% для похудения
				slimCalories = Math.ceil(dailyCalories - (dailyCalories * 0.2) );
//Вывод полученных данных
				maxDailyResult.textContent = dailyCalories;
				slimDailyResult.textContent = slimCalories;
//Расчет для женщин
			} else if (count >= 3 && genderFemale.checked) {
//Расчет базового обмена веществ
					if (benedictFormula.checked) {
						mainCalories = Math.ceil( ( (9.99 * weight.value) + (6.25 * height.value) - (4.92 * age.value) - 161 ) );
					} else {
						mainCalories = Math.ceil( 447.593 + (9.247 * weight.value) + (3.098 * height.value) - (4.330 * age.value) );
					}
//С учетом специфического динамического действия пищи (энергетические затраты организма, 
//связанные с потреблением и перевариванием пищи)
				energyLost = Math.ceil(mainCalories * 0.1);
//Суточная потребность в калориях
				dailyCalories = Math.ceil((mainCalories + energyLost) * options);
//За минусом 20% для похудения
				slimCalories = Math.ceil(dailyCalories - (dailyCalories * 0.2) );
//Вывод полученных данных
				maxDailyResult.textContent = dailyCalories;
				slimDailyResult.textContent = slimCalories;
			} 
//Если хотя бы один инпут не заполнен верно или не указан коэффициент физической активности
//выводится сообщение
			if (count < 3 || isNaN(options)) {
				alert('Данные не введены или не введены полностью');
			}
//Задаем переменные для белков, жиров и углеводов (БЖУ)
			let proteins = 0,
				fats = 0,
				carbohydrates = 0;

//Функция вычисления соотношения БЖУ
			function pfcCalc() {
				proteins = Math.ceil((slimCalories * 0.3) / 4);
				fats = Math.ceil((slimCalories * 0.2) / 9);
				carbohydrates = Math.ceil((slimCalories * 0.5) / 3.75);

//Вывод полученных данных на экран
				proteinsResult.innerHTML = proteins;
				fatsResult.innerHTML = fats;
				carbsResult.innerHTML = carbohydrates;
			};
			pfcCalc();			 	
		};	
		caloriesCalc();
	});
});