<?php 

  header("Content-Type: application/json");
   
    $title = $_REQUEST['title'];
    $data = $_REQUEST['data'];
    $img = $_REQUEST['img'];
 

    $data = json_decode($data);
    $data = json_encode($data ,  JSON_PRETTY_PRINT);

	$jsonFile = fopen('json/'.$title.".json", "w");
	 
	fwrite($jsonFile, $data);

    fclose($jsonFile);

	$img = str_replace('data:image/png;base64,', '', $img);
	$img = str_replace(' ', '+', $img);
	   
    file_put_contents('sprites/'.$title.'.png',base64_decode($img));

    $result[0] = 'json/'.$title.".json";
    $result[1] = 'sprites/'.$title.".png";

    echo json_encode($result);
    

  ///////////////////////////////////////////
 ?>