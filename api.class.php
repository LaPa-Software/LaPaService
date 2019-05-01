<?php
if(!isset($LaPa)){
    die();
}

function auth(){
    global $QUERY;
    global $RESPONSE;
    if(isset($QUERY['login'])&&isset($QUERY['pass'])){
        // TODO: Checking from DB
        if($QUERY['login']=='SYSTEM'&&($QUERY['pass']==md5('qiwiqiwi')||$QUERY['pass']=='qiwiqiwi')){
            $RESPONSE['domains']=domains();
            $account=['id'=>1];
            setcookie('TOKEN','TEST_TOKEN');
            return $account;
        }
        $RESPONSE['message']='Неверные данные для авторизации';
        return false;
    }
    $RESPONSE['message']='Введите логин и пароль';
    return false;
}

function logout(){
    setcookie('TOKEN',null,-1);
    unset($_COOKIE['TOKEN']);
    return true;
}

function domains(){
    global $QUERY;
    // TODO: Checking from DB
    $domains=['lapacore.projects.ponomarevlad.ru'=>['id'=>1,'status'=>'beta-trial','work'=>'normal','version'=>'v.3.0beta1']];
    return $domains;
}

function pay(){
    global $QUERY;
    global $LaPa;
    $listDomains=domains();
    if(isset($listDomains[$QUERY['domain']])){
        return false;
    }
    //$pay=$LaPa['PayButton'];
    $pay=$LaPa['PayLink'];
    if($QUERY['code']!=''){
        if($QUERY['code']=='BETA'){
            $pay=$LaPa['PayButtonD'];
        }else{
            $RESPONSE['message']='Ваш код не был принят';
        }
    }
    return $pay;
}

function getBeta(){
    global $QUERY;
    global $LaPa;
    global $RESPONSE;
    if(isset($QUERY['domain'])){
        $listDomains=domains();
        if(isset($listDomains[$QUERY['domain']])){
            return false;
        }
        $RESPONSE['domain']=$QUERY['domain'];
        return $LaPa['BetaDisclaimer'];
    }
}

function cancelBeta(){
    return true;
}

function listClients(){
    /*$list=[
        'LaPa Software'=>[
            'url'=>'http://lapa.96.lt',
            'img'=>'http://lapacore.projects.ponomarevlad.ru/domains/lapa.96.lt/pic.png'
        ],
        'DAD Lime'=>[
            'url'=>'http://workhardpartyharder.500mb.net',
            'img'=>'http://lapacore.projects.ponomarevlad.ru/domains/workhardpartyharder.500mb.net/pic.png'
        ],
        'ТрейдМаркет'=>[
            'url'=>'http://nmk24.ru',
            'img'=>'http://lapacore.projects.ponomarevlad.ru/domains/nmk24.ru/pic.png'
        ]
    ];*/
    $list=[];
    $domains=dir(__DIR__.'/domains/');
    while (false !== ($entry = $domains->read())) {
        if(@is_file(__DIR__.'/domains/'.$entry.'/version.json')) {
            $list[$entry] = [
                'url' => '//' . $entry
            ];
            if (is_file(__DIR__ . '/domains/' . $entry . '/pic.png')) {
                $list[$entry]['img'] = '//lapacore.projects.ponomarevlad.ru/domains/' . $entry . '/pic.png';
            }
        }
    }
    return $list;
}