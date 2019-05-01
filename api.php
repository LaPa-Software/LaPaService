<?php
header("Access-Control-Allow-Origin: *");
$LaPa=[
    //'PayButton'=>'<iframe frameborder="0" allowtransparency="true" scrolling="no" src="https://money.yandex.ru/embed/small.xml?account=41001227054363&quickpay=small&any-card-payment-type=on&button-text=02&button-size=s&button-color=orange&targets=LaPa+License+for+1+domain&default-sum=1299&successURL=lapa.96.lt%2Fdashboard.html" width="113" height="31"></iframe>',
    'PayLink'=>'https://money.yandex.ru/embed/small.xml?account=41001227054363&quickpay=small&any-card-payment-type=on&button-text=01&button-size=l&button-color=orange&targets=LaPa+License+for+1+domain&default-sum=1299&successURL=lapa.96.lt%2Fdashboard.html',
    'PayButtonD'=>'<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top"><input type="hidden" name="cmd" value="_s-xclick"><input type="hidden" name="hosted_button_id" value="SMYYQ667T6N9G"><table><tr><td><input type="hidden" name="on0" value="Адрес вашего сайта без http://">Адрес вашего сайта без http://</td></tr><tr><td><input type="text" name="os0" maxlength="200"></td></tr></table><input type="image" src="https://www.paypalobjects.com/ru_RU/RU/i/btn/btn_paynowCC_LG.gif" border="0" name="submit" alt="PayPal — более безопасный и легкий способ оплаты через Интернет!"><img alt="" border="0" src="https://www.paypalobjects.com/ru_RU/i/scr/pixel.gif" width="1" height="1"></form>',
    'BetaDisclaimer'=>'Disclaimer...You accept this condition?'
];

function objectToArray($d){
    if (is_object($d)) {
        $d = get_object_vars($d);
    }
    if (is_array($d)) {
        return array_map(__FUNCTION__, $d);
    } else {
        return $d;
    }
}

$RESPONSE=[];
if(isset($_GET['q'])) {
    $QUERY = objectToArray(json_decode($_GET['q']));
    if (isset($QUERY['action'])) {
        require_once 'api.class.php';
        if (is_callable($QUERY['action'])) {
            $RESPONSE[$QUERY['action']] = call_user_func($QUERY['action']);
        }
    }
}

$RESPONSE['uid']=false;

if($_COOKIE['TOKEN']){
    // TODO: Math Tokens
    $RESPONSE['uid']=1;
}
echo json_encode($RESPONSE);