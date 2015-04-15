/*
* Не стал использовать тут angular, хотелось сделать на native js.
* конечно с angular быстрее по времени бы получилось и смотрибельнее код, но так было интреснее =)
* */

var links, contentEl, menu, max = 100,element ;
var config = {
    'add': '+',
    'mul': '*',
    'div': '/',
    'min': '-'
};
links = {
    setting: "<h4>Выберите пункты на тестирование</h4><br>" +
    "<input type='text' value='' id='user' placeholder='Имя' >" +
    "<label><input type='checkbox' value='add'> Сложение</label>" +
    "<label><input type='checkbox'  value='min'> Вычитание</label>" +
    "<label><input type='checkbox'  value='div'> Деление</label>" +
    "<label><input type='checkbox'  value='mul'> Умножение</label>" +
    "<button type='button' class='btn btn-primary' onclick='startTest()'>Начать тест</button>",
    testing: "<h4>Тест проходит <span id='user' class='text-info'></span></h4>" +
    "<div class='text-info'>Правилных ответов <span id='right_answers'>0</span> из <span id='all_answers'>0</span></div>" +
    "<br><div id='test'><span id='task' style='width: 50px'></span> = <input  type='text' id='answer' maxlength='3' onkeyup='checkAnswer(this)'> <span id='check_answer' class=''></span>" +
    "<br><button type='button' class='btn btn-primary' onclick='element.getAnswer()'>Ответить</button>       " +
    "<button type='button' class='btn btn-primary' onclick='user.updateAnswer()'>Следуюший</button></div> "
};
//Переменные часто будут использоваться
contentEl = document.getElementById('view');
menu = document.querySelector('#menu');
element = currentTest();
//Обьект Ученика где мы будем хранить его текушие данные
var user = {
    setUser: function (name) {
        this.userName = name;
    },
    getUser: function () {
        return this.userName;
    },
    answersRight: 0,
    answersAll: 0,
    saveAnswer: [],
    updateAnswer: function () {
        var currentAnswer = {
            'user': user.getUser(),
            'test': element.getElement(),
            'answer': element.getElement().answer == parseInt(document.getElementById('answer').value)
        };
        this.saveAnswer.push(currentAnswer);
        this.answersAll++;
        if (currentAnswer.answer)
            this.answersRight++;
        document.getElementById('right_answers').innerHTML = this.answersRight;
        document.getElementById('all_answers').innerHTML = this.answersAll;
        document.getElementById('check_answer').innerHTML =  '';
        document.getElementById('answer').disabled =  false;
        if (this.answersAll == 12) {
            document.getElementById('test').innerHTML = 'Вы прошли тест, ваша оценка <b>' + this.answersRight + '</b>';
            this.saveAnswer.push({'assessment': this.answersRight });
            console.log(this.saveAnswer);
            return;
        }
        createTest();
    },
    sendAnswers: function () {
        //ф-я для отправки на сервер
    }
};
//Ф-ия для создания теста
function currentTest() {
    var number1, number2, action, answer;

    return {
        getAnswer : function(){
            temp = document.getElementById('check_answer');
            if (element.getElement().answer==parseInt(document.getElementById('answer').value)) {
                temp.className = 'text-success';
                result = 'Верно';
            }
            else{
                temp.className = 'text-warning';
                result = 'Не верно';
            }

            temp.innerHTML = result+',ответ :' + eval(number1 + action + number2);
            document.getElementById('answer').disabled = true;
        },
        setElement: function (el1, el2, act, answ) {
            number1 = el1;
            number2 = el2;
            action = act;
            answer = answ;
            document.getElementById('task').innerHTML = number1 + ' ' + config[element.setting[element.settingLine]] + ' ' + number2;
            this.updateLine();
        },
        getElement: function () {
            return {
                element1: number1,
                element2: number2,
                action: action,
                answer: eval(number1 + action + number2)
            }
        },
        settingLine: 0,
        updateLine: function () {
            if (element.setting.length - 2 < this.settingLine) this.settingLine = 0; else this.settingLine++;
        },
        setting: [],
        deleteSetting: function () {
            this.setting = [];
            user.answersRight = 0;
            user.answersAll = 0;
        },
        updateSetting: function (action) {
            this.setting.push(action);
        }
    }
}
//Следить за изменения hash в браузерной строке
var updateState = function () {
    if(location.hash.slice(1)=='sql'){
        document.getElementById('sql').style.display = '';
    }

    var content = links[location.hash.slice(1)];
    contentEl.innerHTML = content || "Страница не найдена";
    updateMenu(location.hash); //Если запускать c ie7 нужно коментировать строчку =(
    if (location.hash == '#testing' && user.getUser() != undefined) {
        document.getElementById('user').innerHTML = user.userName;
        createTest();
    } else
        location.hash = 'setting';
};
// для активных кнопок в меню
var updateMenu = function (state) {
    [].slice.call(menu.querySelectorAll('a'))
        .forEach(function (e) {
            var classList = e.parentNode.classList;
            state == e.getAttribute('href') ?
                classList.add('active')
                : classList.remove('active');
        })
};
//Генератор для теста
var createTest = function () {
    document.getElementById('answer').value = '';
    var getElement = function (number) {
        switch (element.setting[element.settingLine]) {
            case 'add':
                return Math.floor(Math.random() * (max - number));
                break;
            case 'min':
                return Math.floor(Math.random() * (number));
                break;
            case 'mul':
                return Math.floor(Math.random() * ((number != 0 ? (max / number) : max)));
                break;
            case 'div':
                arrayForDiv = [];
                for (var i = 0; i <= number; i++) {
                    if (number % i == 0)
                        arrayForDiv.push(i);
                }
                return arrayForDiv[Math.floor(Math.random() * arrayForDiv.length)];
                break;
        }
    };
    element1 = Math.floor(Math.random() * max);
    element.setElement(element1, getElement(element1), config[element.setting[element.settingLine]]);
};

//Старт теста, установка начальных значений
function startTest() {
    username = document.getElementById('user');
    if (username.value == '') {
        username.focus();
        return;
    }
    user.setUser(username.value);
    element.deleteSetting();
    checkbox = document.getElementsByTagName('input');
    for (var i = 0; i < checkbox.length; i++)
        if (checkbox[i].checked)
            element.updateSetting(checkbox[i].getAttribute('value'));
    if (element.setting.length == 0) return;
    location.hash = '#testing';
}
//Смотрим input ответа на наличие чисел
function checkAnswer(e) {
    e.value = (isNaN(parseInt(e.value)) ? '' : parseInt(e.value));
}

/*Пришлось так сделать hashchange из-за ie8, в ie9 работает addEventListener */
//window.addEventListener('hashchange', updatestate);
if (("onhashchange" in window))
    window.onhashchange = function () {
        updateState();
    };
else {
    var prevHash = window.location.hash;
    window.setInterval(function () {
        if (window.location.hash != prevHash) {
            updateState();
        }
    }, 100);
}
if (window.addEventListener)
    window.addEventListener("load", updateState);
else
    window.attachEvent("onload", updateState);