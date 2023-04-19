<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Content-type:application/json");
    
    $posted = json_decode(file_get_contents("php://input"));
    print_r($posted);
    
    // var_dump($_POST);

    // if ($posted === true) {

    // } else {
    //     // handle the case where 'zip' is not present in the $_POST array
    //     echo 'Zip not being accessed    ';
    //     return var_dump($_POST);
    // }
      

    
    
?>