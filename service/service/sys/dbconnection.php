<?php
function getConnection(){
    $dbname = "vastug2h_santosh";
    $user="vastug2h_santoshp";
    $pass="Z(Bgg8bm=Tnn";

    $server = $_ENV['dbConnection']['server'];
    
    $user = "root";$pass = "";$dbname = "santosh_patil";
    
    $conn = new mysqli($server, $user, $pass, $dbname);
    if($conn->connect_error){
        die("Connection failed:" . $conn->connect_error);      
    }else{
        return $conn;
    }
}
?>