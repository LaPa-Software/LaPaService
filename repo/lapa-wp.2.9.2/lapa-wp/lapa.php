<?php
/*
Plugin Name: LaPa WP
Plugin URI: http://lapacore.projects.ponomarevlad.ru
Description: Система "умного" кэширования
Version: 2.9.1
Author: Владислав Пономарев
Author URI: http://lapacore.projects.ponomarevlad.ru
*/
//config
define('HOST',"localhost");
define('USER',"root");
define('PASSWORD',"");
define('DB',"my_bd");

define('DIR_SQL','sql/');
define('FOR_WRITE',10);
//config
function get_dump($db,$tables) {

    if(is_array($tables)) {
        $fp = fopen(DIR_SQL.time()."_dump.sql","w");

        $text = "-- SQL Dump
-- my_ version: 1.234
--
-- База дынных: `".DB."`
--
-- ---------------------------------------------------
-- ---------------------------------------------------
";
        fwrite($fp,$text);

        foreach($tables as $item) {

            $text = "
-- 
-- Структура таблицы - ".$item."
--
";
            fwrite($fp,$text);


            $text = "";
            $text .= "DROP TABLE IF EXISTS `".$item."`;";

            $sql = "SHOW CREATE TABLE ".$item;
            $result = mysqli_query($db, $sql);
            if(!$result) {
                exit(mysqli_error($db));
            }
            $row = mysqli_fetch_row($result);

            $text .= "\n".$row[1].";";
            fwrite($fp,$text);

            $text = "";
            $text .=
                "
--			
-- Dump BD - tables :".$item."
--
			";

            $text .= "\nINSERT INTO `".$item."` VALUES";
            fwrite($fp,$text);

            $sql2 = "SELECT * FROM ".$item."`";
            $result2 = mysqli_query($db,$sql2);
            if(!$result2) {
                exit(mysqli_error($db));
            }
            $text = "";

            for($i = 0; $i < mysqli_num_rows($result2); $i++) {
                $row = mysqli_fetch_row($result2);

                if($i == 0) $text .= "(";
                else  $text .= ",(";

                foreach($row as $v) {
                    $text .= "\"".mysqli_real_escape_string($db,$v)."\",";
                }
                $text = rtrim($text,",");
                $text .= ")";

                if($i > FOR_WRITE) {
                    fwrite($fp,$text);
                    $text = "";
                }

            }
            $text .= ";\n";
            fwrite($fp,$text);


        }
        fclose($fp);
    }

}

?>