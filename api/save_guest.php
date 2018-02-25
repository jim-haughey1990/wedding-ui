<?php
$host_name = '<HOST>';
$database = '<DATABASE>';
$user_name = '<USERNAME>';
$password = '<PASSWORD>';
$q = $_REQUEST['q'];

$connect = mysqli_connect($host_name, $user_name, $password, $database);

if (mysqli_connect_errno()) {
    die('<p>Failed to connect to MySQL: '.mysqli_connect_error().'</p>');
} 

$sql = "SELECT * FROM guests where ((upper(first_name) like ?) or (upper(last_name) like ?))";

$stmt = $connect->prepare($sql);
$stmt->bind_param("ss", $q, $q);
$stmt->execute();
$result = $stmt->get_result();

$returnVAR = array();
//MYSQLI_NUM = Array items will use a numerical index key.
//MYSQLI_ASSOC = Array items will use the column name as an index key.
//MYSQLI_BOTH = [default] Array items will be duplicated, with one having a numerical index key and one having the column name as an index key.
while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
    $returnVAR[] = $row;
}

echo json_encode($returnVAR);
mysqli_close($conn);

?>