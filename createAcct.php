<?php
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
// header("Access-Control-Allow-Headers: Content-Type");
// header("Content-type:application/json");

$posted = json_decode(file_get_contents("php://input"), true);

$username = $posted['emailValue'];
$password = $posted['passwordValue'];
echo $username . ', ' . $password;
print_r($posted);

// $sanitized_data = mysqli_real_escape_string($conn, htmlspecialchars($username, $password));

?>