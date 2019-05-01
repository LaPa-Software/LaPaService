<?php
header("Access-Control-Allow-Origin: *");
if(isset($_GET['script_url'])){
    echo file_get_contents($_GET['script_url']);
}
//echo $_GET['script_adaptation'].PHP_EOL;
if(isset($_GET['script_adaptation'])){
    require_once 'script_adapter.php';
    $id=explode('?', $_GET['script_adaptation']);
    $id=$id[0];
    //echo $id.PHP_EOL;
    if(isset($ADAPTER[$id])){
        echo json_encode($ADAPTER[$id]);
    }
}
if (isset($_GET['get_domain'])){
    if(is_dir(__DIR__ . '/domains/'.$_GET['get_domain'])){
        echo file_get_contents(__DIR__ . '/domains/'.$_GET['get_domain'].'/version.json')||'false';
    }else{
        echo 'false';
    }
}