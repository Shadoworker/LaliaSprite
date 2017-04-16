<?php 

  header("Content-Type: application/json");
   
    $title = $_REQUEST['title'];
    $data = $_REQUEST['data'];

    $data = json_decode($data);
    $data = json_encode($data ,  JSON_PRETTY_PRINT);

	$jsonFile = fopen($title.".json", "w");
	 
	fwrite($jsonFile, $data);

    fclose($jsonFile);

  ///////////////////////////////////////////
 ?>