<?php
header("Access-Control-Allow-Origin: *");
if(isset($_GET['url'])&&isset($_GET['ver'])) {
    echo $_GET['url'];
    if (!is_dir(__DIR__ . '/domains/' . $_GET['url'])) {
        mkdir(__DIR__ . '/domains/' . $_GET['url']);
    }
    if (!is_file(__DIR__ . '/domains/' . $_GET['url'] . '/version.json')) {
        $version = fopen(__DIR__ . '/domains/' . $_GET['url'] . '/version.json', "w");
        fwrite($version, $_GET['ver']);
        fclose($version);
    } else {
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
        $rewrite = false;
        $old_version = file_get_contents(__DIR__ . '/domains/' . $_GET['url'] . '/version.json');
        $old_version = objectToArray(json_decode($old_version));
        $new_version = objectToArray(json_decode($_GET['ver']));
        if ($new_version['major'] > $old_version['major']) {
            $rewrite = true;
        } else {
            if ($new_version['minor'] > $old_version['minor']) {
                $rewrite = true;
            } else {
                if ($new_version['build'] > $old_version['build']) {
                    $rewrite = true;
                }
            }
        }
        if ($rewrite) {
            $version = fopen(__DIR__ . '/domains/' . $_GET['url'] . '/version.json', "w");
            fwrite($version, $_GET['ver']);
            fclose($version);
        }
    }
    //echo __DIR__ . '/domains/' . $_GET['url'] . '/version.json';
}