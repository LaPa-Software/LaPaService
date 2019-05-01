function xhr(callback,url,meta) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.send();
    xhr.onreadystatechange = function() {
        if (this.readyState != 4) return;
        if (this.status != 200) {
            callback(this.statusText,meta);
            return;
        }
        callback(this.responseText,meta);
    }
}

function renderClients(list) {
    colsNum=3;
    currentCol=0;
    buffer='';
    item=Object.keys(list);
    for(i in item){
        if(!list[item[i]].img)continue;
        if(currentCol==0)buffer+='<div class="row no-collapse">';
        buffer+='<div class="4u 12u(mobile)"><a href="'+list[item[i]].url+'" target="_blank" class="image full"><img src="'+list[item[i]].img+'" alt="" title=""/></a></div>';
        if(currentCol==colsNum-1){buffer+='</div>';currentCol=0;}else{currentCol++;}
    }
    if(currentCol!=0)buffer+='</div>';
    document.getElementsByName('listClients')[document.getElementsByName('listClients').length-1].innerHTML=buffer;
}

function getClients(data,meta) {
    if (meta) {
        try {
            data = JSON.parse(data);
        } catch (e) {
            console.log('Error: ' + data);
            document.getElementById('listClients').innerHTML = 'Не удалось получить ответ API';
            return;
        }
        localStorage.setItem('listClients', JSON.stringify(data.listClients));
    } else {
        xhr(getClients, '//LaPaService.projects.ponomarevlad.ru/api.php?q=' + JSON.stringify({'action': 'listClients'}), true)
    }
    if(localStorage.getItem('listClients'))renderClients(JSON.parse(localStorage.getItem('listClients')));
}

function sendFeedback() {

}

function showCountdown(){
    //plugin_info='<img src="images/lapa%20wp%20cache.png" alt="" class="image left"/><br/><button onclick="getPlugin(\'lapa-wp-cache-beta\');">Учавствовать в Beta-тесте</button><br/>Осталось 19 дней';
    //document.getElementsByName('solutions')[document.getElementsByName('solutions').length-1].innerHTML=plugin_info;
    //setInterval(function () {
        //document.getElementsByName('countdown')[document.getElementsByName('countdown').length-1].innerHTML='<script src="http://megatimer.ru/s/671c89f2e26a0f86ac9489273a9a07b6.js"></script>';
    //},1000);
    document.getElementById('timer7a5122e3f84cf016216997375d979425').style['text-align']='left';
}

function init() {
    getClients();
    //showCountdown();
}

LaPa.extension.create('dynamicInterface',init);