"use strict";
if(!LaPa.dashboard){
    LaPa.dashboard={
        'version':{'major':1,'minor':0,'build':1},
        'property':{
            'container':'dashboard_container',
            'beta':true
        },
        'openDomain':function(domain){

        },
        'getLicense':function (data) {
            if(data.status=='licensed')return'Оплачено';
            if(data.status=='trial')return'Пробный период';
            if(data.status=='beta-trial')return'Бета-тест';
            return'Ожидает оплаты';
        },
        'getHealth':function (data) {
            if(data.work=='normal'){
                return 'Активен ('+data.version+')'
            }else{
                return 'Не обнаружен или поврежден';
            }
        },
        'showConsole':function (waitForLoad) {
            if(waitForLoad){
                //LaPa.indicatorState(true);
                //document.getElementById('dashboard_container').innerHTML='<div>Получение данных...</div>';
                document.getElementsByName('dashboard_container')[document.getElementsByName('dashboard_container').length-1].innerHTML='<div>Получение данных...</div>';
                return;
            }
            if(LaPa.dashboard.domains){
                var listDomains='';
                var domains=Object.keys(LaPa.dashboard.domains);
                for(var i in domains){
                    listDomains+='<br><h2><a href="'+domains[i]+'" onclick="LaPa.dashboard.openDomain(this.href);return false;">'+domains[i]+'</a></h2>';
                    listDomains+='ID заказа: '+LaPa.dashboard.domains[domains[i]].id+' ('+LaPa.dashboard.getLicense(LaPa.dashboard.domains[domains[i]])+')';
                    listDomains+='<br>Состояние плагина: '+LaPa.dashboard.getHealth(LaPa.dashboard.domains[domains[i]])+'<br>';
                }
                listDomains=listDomains==''?'Не найдены':listDomains;
            }
            document.getElementsByName('dashboard_container')[document.getElementsByName('dashboard_container').length-1].innerHTML='<div class="row"><div class="9u 12u(mobile)"><h4>Список оплаченных доменов:</h4>'+listDomains+'<br><button onclick="LaPa.dashboard.logOut();">Выход из кабинета</button></div><div class="9u 12u(mobile) sidebar" id="pay"><h4>Зарегистрировать новый сайт:</h4><br><input type="text" id="domain" placeholder="Адрес вашего сайта без http://"><br>'+(LaPa.dashboard.property.beta?'<button onclick="LaPa.dashboard.getBeta();">Продолжить (Beta-тест)</button>':'<button onclick="LaPa.dashboard.sendPay();">Продолжить</button><br><br>* - На следующем этапе будет необходимо нажать на кнопку оплаты')+'</div></div>';
        },
        'showAuth':function(){
            document.getElementsByName('dashboard_container')[document.getElementsByName('dashboard_container').length-1].innerHTML='<div><input type="email" id="login" name="login" placeholder="Адрес E-mail"><br><input type="password" id="pass" name="pass" placeholder="Пароль"><br><button onclick="LaPa.dashboard.auth();">Вход</button></div>';
            if(localStorage['dashboard']){
                var saved=JSON.parse(localStorage['dashboard']);
                document.getElementById('login').value=saved.login;
                document.getElementById('pass').value=saved.pass;
            }
        },
        'getDomains':function(){
            //LaPa.indicatorState(true);
            LaPa.io(LaPa.dashboard.handler,'/api.php',{'q':JSON.stringify({'action':'domains'})},'dashboardDomains');
        },
        'handler':function(response){
            //LaPa.indicatorState(false);
            try{
                response=JSON.parse(response);
            }catch (e){
                alert('Ошибка разбора ответа от сервера');
                return;
            }
            if(response.auth){
                LaPa.dashboard.account=response.auth;
                if(response.domains){
                    LaPa.dashboard.domains=response.domains;
                    LaPa.dashboard.showConsole();
                }else{
                    LaPa.dashboard.showConsole(true);
                    LaPa.dashboard.getDomains();
                }
            }else{
                if(response.uid){
                    if(LaPa.dashboard.account) {
                        if (LaPa.dashboard.account.id == response.uid) {
                            if (response.domains) {
                                LaPa.dashboard.domains = response.domains;
                                LaPa.dashboard.showConsole();
                            }
                            if (response.pay) {
                                response.pay='<a id="autoClick" href="'+response.pay+'" rel="noreferrer">Продолжить</a><br>';
                                //location.replace(response.pay);
                                document.getElementById('pay').innerHTML = response.pay + '<br><button onclick="LaPa.dashboard.showConsole();">Отмена</button>';
                                document.getElementById('autoClick').click();
                            }
                            if (response.getBeta) {
                                if(confirm(response.getBeta)){
                                    LaPa.dashboard.getDomains();
                                }else{
                                    LaPa.dashboard.cancelBeta(response.domain);
                                }
                            }
                            if (response.cancelBeta) {
                                LaPa.dashboard.getDomains();
                            }
                        }
                    }else{
                        LaPa.dashboard.showConsole(true);
                        LaPa.dashboard.account={'id':response.uid};
                        LaPa.dashboard.getDomains();
                    }
                }else{
                    delete LaPa.dashboard.account;
                    delete LaPa.dashboard.domains;
                    LaPa.dashboard.showAuth();
                }
            }
            if(response.message)alert(response.message);
        },
        'auth':function(){
            //LaPa.indicatorState(true);
            var login=document.getElementsByName('login')[document.getElementsByName('login').length-1].value;
            //var login_input=document.getElementsByName('login');
            //for(var i in login_input){
            //    if(login_input[i].value!='')login=document.getElementsByName('login')[i].value;
            //}
            var pass=document.getElementsByName('pass')[document.getElementsByName('pass').length-1].value;
            //var pass_input=document.getElementsByName('pass');
            //for(i in pass_input){
            //    if(pass_input[i].value!='')pass=document.getElementsByName('pass')[i].value;
            //}
            if(login==''||pass==''){alert('Некорректные данные для входа');return;};
            localStorage.setItem('dashboard',JSON.stringify({'login':login,'pass':pass}));
            LaPa.io(LaPa.dashboard.handler,'/api.php',{'q':JSON.stringify({'action':'auth','login':login,'pass':(md5?md5(pass):pass)})},'dashboardAuth');
        },
        'sendPay':function(){
            //LaPa.indicatorState(true);
            LaPa.io(LaPa.dashboard.handler,'/api.php',{'q':JSON.stringify({'action':'pay','domain':document.getElementById('domain').value})},'dashboardPay');
        },
        'getBeta':function(){
            //LaPa.indicatorState(true);
            LaPa.io(LaPa.dashboard.handler,'/api.php',{'q':JSON.stringify({'action':'getBeta','domain':document.getElementById('domain').value})},'dashboardBeta');
        },
        'cancelBeta':function(domain){
            //LaPa.indicatorState(true);
            LaPa.io(LaPa.dashboard.handler,'/api.php',{'q':JSON.stringify({'action':'cancelBeta','domain':domain})},'dashboardCancelBeta');
        },
        'logOut':function () {
            //LaPa.indicatorState(true);
            LaPa.io(LaPa.dashboard.handler,'/api.php',{'q':JSON.stringify({'action':'logout'})},'dashboardPay');
        },
        'init':function () {
            if(LaPa.dashboard.account){
                if(LaPa.dashboard.domains) {
                    LaPa.dashboard.showConsole();
                }else{
                    LaPa.dashboard.showConsole(true);
                    LaPa.dashboard.getDomains();
                }
            }else{
                LaPa.dashboard.showAuth();
                //LaPa.indicatorState(true);
                LaPa.io(LaPa.dashboard.handler,'/api.php',null,'dashboardStatus');
            }
        }
    };
    //createExtension('dashboard','DashBoard',LaPa.dashboard.init,LaPa.dashboard.version);
    LaPa.extension.create('DashBoard',LaPa.dashboard.init);
}else{
    LaPa.dashboard.init();
}