DATA= {
    'num': 7,
    'line': '--->'
};
if(window.localStorage)if(localStorage['table'])DATA.table=JSON.parse(localStorage['table']);
function prePair() {
    build = '<h2>1. Укажите значения из таблицы:</h2><div>';
    for (i = 0; i < DATA.num; i++) {
        build += '<label for="time_' + i + '">' + (i + 1) + ' работа (k=' + (i + 1) + ')</label> <input type="number" id="time_' + i + '" placeholder="Продолжительность" value="' + (DATA.table ? DATA.table[i].time : '') + '"> ';
        build += '<input type="text" id="depend_' + i + '" placeholder="Зависит от (1,2,4 или -)" value="' + (DATA.table ? DATA.table[i].depend : '') + '"><br>'
    }
    build += '</div><br><button onclick="solution();"><h3>2. Расчитать</h3></button><div id="output"></div>';
    document.body.innerHTML = build;
}
function saveData() {
    DATA.table = [];
    for (i = 0; i < DATA.num; i++) {
        if(document.getElementById('time_' + i).value=='') {
            alert('Неверно указано время в ' + (parseInt(i) + 1) + ' работе');
            document.getElementById('time_' + i).focus();
            return false;
        }
        DATA.table[i] = {
            'time': document.getElementById('time_' + i).value,
            'depend': document.getElementById('depend_' + i).value
        };
    }
    if (window.localStorage)localStorage['table'] = JSON.stringify(DATA.table);
    return true;
}
function genGraph() {
    outGraph = 'Постройте график по точкам (1), (2), (3), ... , (' + DATA.num + ')<br>соединяя их линиями ' + DATA.line + ', как указанно ниже:<p>';
    for (i in DATA.table) {
        if (!DATA.table[i].depends)DATA.table[i].depends = true;
        if (DATA.table[i].depend == '' || DATA.table[i].depend == '-')continue;
        dependents = DATA.table[i].depend.split(',');
        for (d in dependents) {
            num = parseInt(dependents[d]) - 1;
            if (!DATA.table[num]) {
                alert('Зависимости в ' + (parseInt(i) + 1) + ' работе ссылаються на не существующий номер ' + dependents[d]);
                document.getElementById('depend_' + i).focus();
                return 'Ошибка!';
            }
            if (!DATA.table[num].depends || DATA.table[num].depends == true)DATA.table[num].depends = {};
            //if (DATA.table[num].depends != true)
            DATA.table[num].depends[i] = DATA.table[i];
            outGraph += '(' + (parseInt(i) + 1) + ') ' + DATA.line + ' (' + dependents[d] + ')<br>';
        }
    }
    outGraph += '</p>';
    return outGraph;
}
function calc(work,id) {
    if (DATA.calcLog[id])return;
    DATA.calcLog[id] = work;
    DATA.totalTime += parseInt(work.time);
    DATA.outCalc += 'Работа ' + (parseInt(id) + 1) + ' выполненна за ' + work.time + ' (прошло ' + DATA.totalTime + ')<br>';
    if (!work.depends)return;
    if (work.depends != true) {
        for (i in work.depends) {
            if (!DATA.calcLog[i]) {
                cancel=false;
                for(j in DATA.table){
                    if(DATA.table[j].depends!=true){
                        if(DATA.table[j].depends[i]){
                            if(!DATA.calcLog[j]){
                                cancel=true;
                                break;
                            }
                        }
                    }
                }
                if(cancel==false) calc(work.depends[i], i);
            }
        }
    }
}
function calcTime() {
    DATA.calcLog = [];
    DATA.outCalc = '';
    DATA.totalTime = 0;
    for (i in DATA.table) {
        calc(DATA.table[i], i);
    }
    DATA.outCalc += '<b>Всего: ' + DATA.totalTime + '</b>';
    return DATA.outCalc;
}
function primeList() {
    outList = '<p>';
    for (i in DATA.table) {
        if (!DATA.table[i].depends)return 'Ошибка!';
        if (DATA.table[i].depends != true) {
            outList += 'Работа ' + (parseInt(i) + 1) + ' (ветвей: ' + (Object.keys(DATA.table[i].depends).length) + ')<br>';
        }
    }
    return outList + '</p>';
}
function solution() {
    if(!saveData())return;
    output = '<h2>3. Решение:</h2>';
    output += '<h3>1) График:</h3>' + genGraph();
    output += '<h3>2) Время реализации:</h3>' + calcTime();
    output += '<h3>3) Критические работы:</h3>' + primeList();
    document.getElementById('output').innerHTML = output;
}
window.addEventListener('load',prePair);
