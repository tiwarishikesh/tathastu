<?php
function getmember($conn, $payload){
    $user = $payload->jwt_vars;
    $personal_data = mysqli_getarray(mysqli_query($conn, "SELECT * FROM member WHERE id = '$user->id'"))[0];
    $business_data = mysqli_getarray(mysqli_query($conn, "SELECT * FROM `member_profession` WHERE member_id = '$user->id'"))[0];
    $contact_data  =  mysqli_getarray(mysqli_query($conn, "SELECT * FROM `member_contact` WHERE member_id = '$user->id'"));
    $groups = mysqli_getarray(mysqli_query($conn, "SELECT *, member_group_participants.status as `member_group_status` FROM (SELECT * FROM member_group_participants WHERE member_group_participants.member_id = '$user->id') AS member_group_participants JOIN member_groups ON member_groups.id = member_group_participants.group_id"));
    $mygroups = mysqli_getarray(mysqli_query($conn, "SELECT * FROM `member_group_admin` WHERE `member_id`='$user->id'"));
    $mychapters = mysqli_getarray(mysqli_query($conn, "SELECT * FROM `rmb_chapter_heads` WHERE `member_id` = '$user->id'"));
    
    unset($personal_data->password);

    return array("status"=>"success","data"=>array("personal"=> $personal_data, "professional"=> $business_data, "contact"=> $contact_data, "groups"=> $groups, "mygroups"=> $mygroups, "mychapter"=> $mychapters));
}

function getMyPhotos($conn, $payload){
    $user = $payload->jwt_vars;
    $myphotos = mysqli_getarray(mysqli_query($conn, "SELECT * FROM `member_photos` WHERE member_id = '$user->id'"));
    return array("status"=>"success","photos"=>$myphotos);
}

function updatePhotoData($conn, $payload){
    $user = $payload->jwt_vars;
    mysqli_query($conn, "UPDATE `member_photos` SET `photo_title`='$payload->photo_title', `photo_description`='$payload->photo_description' WHERE `id`='$payload->id' AND `member_id`='$user->id'");
    return array("status"=>"success");
}

function updatePhotoUrl($conn, $payload){
    $user = $payload->jwt_vars;
    $photo_url = mysqli_getarray(mysqli_query($conn, "SELECT * FROM `member_photos` WHERE `id` = '$payload->new'"))[0]->photo_name;
    mysqli_query($conn, "DELETE FROM `member_photos` WHERE `id`='$payload->new'");
    mysqli_query($conn, "UPDATE `member_photos` SET `photo_name`='$photo_url' WHERE `id` = '$payload->old'");
    return array("status"=>"success");
}

function deleteMemberPhoto($conn, $payload){
    $user = $payload->jwt_vars;
    mysqli_query($conn, "DELETE FROM `member_photos` WHERE `id`='$payload->id'");
    return array("status"=>"success");
}

function updatemember($conn, $payload){
    $user = $payload->jwt_vars;
    $personal = $payload->personal;
    $professional = $payload->professional;
    if($user->id !== $personal->id){
        my_error(403);
    }

    $temp = $professional->gps;
    $gps = $temp->lat.'-'.$temp->lng;

    $result1 = mysqli_query($conn, "UPDATE `member` SET `fname`='$personal->fname',`lname`='$personal->lname',`club`='$personal->club',`about`='$personal->about',`gender`='$personal->gender',`dateofjoining`='$personal->dateofjoining', `dateofbirth` = '$personal->dateofbirth', `timezone`='$personal->timezone' WHERE `id` = '$user->id'");
    $result2 = '';
    if(mysqli_num_rows(mysqli_query($conn, "SELECT * FROM `member` WHERE `id`='$user->id'"))>0){
        $result2 = mysqli_query($conn, "UPDATE `member_profession` SET `organisation_name`='$professional->organisation_name',`position`='$professional->position',`description`='$professional->description',`organisation_address`='$professional->organisation_address' WHERE `member_id`= '$user->id'");
    }else{
        $result2 = mysqli_query($conn, "INSERT INTO `member_profession`(`organisation_name`, `position`, `description`, `classification`, `member_id`, `organisation_address`,`organisation_gps`) VALUES 
                                        '$professional->organisation_name','$professional->position', '$professional->description','1', '$user->id', '$professional->organisation_address', '$gps' ");
    }
    mysqli_query($conn, "DELETE FROM `member_contact` WHERE `member_id` = '$user->id'");
    foreach ($payload->contact as $contact) {
        mysqli_query($conn, "INSERT INTO `member_contact`(`member_id`, `contact_type`, `details`) VALUES ('$user->id', '$contact->contact_type', '$contact->details')");
    }

    return array("status"=>"success");
}

function reg_upload_profilephoto($conn, $payload){

    header('Content-Type: application/json');
    //ini_set('memory_limit','16M');

    $error					= false;

    $absolutedir			= dirname(__FILE__);
    $dir					= '/';
    $serverdir				= $absolutedir.$dir;

    $tmp					= explode(',',$payload->data);
    $imgdata 				= base64_decode($tmp[1]);
    $explode=explode('.',$payload-> name);
    $end = end($explode);
    $extension				= strtolower($end);
    $filename				= substr($payload->name,0,-(strlen($extension) + 1)).'.'.substr(sha1(time()),0,6).'.'.$extension;

    $handle					= fopen($serverdir.$filename,'w');
    fwrite($handle, $imgdata);
    fclose($handle);

    $response = array(
            "status" 		=> "success",
            "url" 			=> $dir.$filename.'?'.time(), //added the time to force update when editting multiple times
            "filename" 		=> $filename
    );

    return $response;
}

function reg_upload_businessphoto($conn, $payload){

    header('Content-Type: application/json');
    //ini_set('memory_limit','16M');

    $error					= false;

    $absolutedir			= dirname(__FILE__);
    $dir					= '/';
    $serverdir				= $absolutedir.$dir;

    $tmp					= explode(',',$payload->data);
    $imgdata 				= base64_decode($tmp[1]);
    $explode=explode('.',$payload-> name);
    $end = end($explode);
    $extension				= strtolower($end);
    $filename				= substr($payload->name,0,-(strlen($extension) + 1)).'.'.substr(sha1(time()),0,6).'.'.$extension;

    $handle					= fopen($serverdir.$filename,'w');
    fwrite($handle, $imgdata);
    fclose($handle);

    $response = array(
            "status" 		=> "success",
            "url" 			=> $dir.$filename.'?'.time(), //added the time to force update when editting multiple times
            "filename" 		=> $filename
    );

    return $response;
}

function upload_profilephoto($conn, $payload){

    header('Content-Type: application/json');
    //ini_set('memory_limit','16M');

    $error					= false;

    $absolutedir			= dirname(__FILE__);
    $dir					= '/';
    $serverdir				= $absolutedir.$dir;

    $tmp					= explode(',',$payload->data);
    $imgdata 				= base64_decode($tmp[1]);
    $explode=explode('.',$payload-> name);
    $end = end($explode);
    $extension				= strtolower($end);
    $filename				= substr($payload->name,0,-(strlen($extension) + 1)).'.'.substr(sha1(time()),0,6).'.'.$extension;

    $handle					= fopen($serverdir.$filename,'w');
    fwrite($handle, $imgdata);
    fclose($handle);

    $response = array(
            "status" 		=> "success",
            "url" 			=> $dir.$filename.'?'.time(), //added the time to force update when editting multiple times
            "filename" 		=> $filename
    );

    $user = $payload->jwt_vars;
    mysqli_query($conn, "UPDATE `member` SET `photo` = '$filename' WHERE `id`='$user->id'");

    return $response;
}

function upload_businessphoto($conn, $payload){
    header('Content-Type: application/json');
    //ini_set('memory_limit','16M');

    $error					= false;

    $absolutedir			= dirname(__FILE__);
    $dir					= '/';
    $serverdir				= $absolutedir.$dir;

    $tmp					= explode(',',$payload->data);
    $imgdata 				= base64_decode($tmp[1]);
    $explode=explode('.',$payload-> name);
    $end = end($explode);
    $extension				= strtolower($end);
    $filename				= substr($payload->name,0,-(strlen($extension) + 1)).'.'.substr(sha1(time()),0,6).'.'.$extension;

    $handle					= fopen($serverdir.$filename,'w');
    fwrite($handle, $imgdata);
    fclose($handle);

    $response = array(
            "status" 		=> "success",
            "url" 			=> $dir.$filename.'?'.time(), //added the time to force update when editting multiple times
            "filename" 		=> $filename
    );

    $user = $payload->jwt_vars;
    mysqli_query($conn, "UPDATE `member_profession` SET `organisation_photo` = '$filename' WHERE `member_id`='$user->id'");

    return $response;
}

function upload_galleryphoto($conn, $payload){

    header('Content-Type: application/json');
    //ini_set('memory_limit','16M');

    $error					= false;

    $absolutedir			= dirname(__FILE__);
    $dir					= "../../../assets/membergallery/";
    $serverdir				= str_replace("/","\\",$absolutedir.$dir);
    
    $tmp					= explode(',',$payload->data);
    $imgdata 				= base64_decode($tmp[1]);
    $explode=explode('.',$payload-> name);
    $end = end($explode);
    $extension				= strtolower($end);
    $filename				= substr($payload->name,0,-(strlen($extension) + 1)).'.'.substr(sha1(time()),0,6).'.'.$extension;
    $filename               = str_replace(" ","",$filename);
    $handle					= fopen($serverdir.$filename,'w');
    fwrite($handle, $imgdata);
    fclose($handle);

    $response = array(
            "status" 		=> "success",
            "url" 			=> $dir.$filename.'?'.time(), //added the time to force update when editting multiple times
            "filename" 		=> $filename,
            "directory"     => $serverdir
    );

    $user = $payload->jwt_vars;

    mysqli_query($conn, "INSERT INTO `member_photos`(`member_id`, `photo_name`, `photo_title`, `photo_description`) VALUES ('$user->id', '$filename', ' ', ' ')");

    $response['image_id'] = $conn->insert_id;

    return $response;
}

function uploadblogPhoto($conn, $payload){

    header('Content-Type: application/json');
    //ini_set('memory_limit','16M');

    $error					= false;

    $absolutedir			= dirname(__FILE__);
    $dir					= "../../../assets/blogImages/";
    $serverdir				= str_replace("/","\\",$absolutedir.$dir);
    
    $tmp					= explode(',',$payload->data);
    $imgdata 				= base64_decode($tmp[1]);
    $explode=explode('.',$payload-> name);
    $end = end($explode);
    $extension				= strtolower($end);
    $filename				= substr($payload->name,0,-(strlen($extension) + 1)).'.'.substr(sha1(time()),0,6).'.'.$extension;
    $filename               = str_replace(" ","",$filename);
    $handle					= fopen($serverdir.$filename,'w');
    fwrite($handle, $imgdata);
    fclose($handle);

    $response = array(
            "status" 		=> "success",
            "url" 			=> $dir.$filename.'?'.time(), //added the time to force update when editting multiple times
            "filename" 		=> $filename,
            "directory"     => $serverdir
    );

    $user = $payload->jwt_vars;

    return $response;
}

?>