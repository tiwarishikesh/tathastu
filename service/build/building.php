<?php
function initWebsite($conn, $payload){
    $user = $payload->jwt_vars;

    $members = mysqli_getarray(mysqli_query($conn, "SELECT * FROM `user` WHERE `id` != '$user->id'"));
    /* return $members; */

    foreach ($members as $member) {
        $member->contact = mysqli_getarray(mysqli_query($conn, "SELECT * FROM `user_contact` WHERE `user_id`='$member->id'"));
        $member->room    = mysqli_getarray(mysqli_query($conn, "SELECT * FROM `user_room` WHERE `user_id`='$member->id'"))[0];
    }

    $commitees = mysqli_getarray(mysqli_query($conn,"SELECT * FROM `commitee`"));
    
    $commitee_to_member = mysqli_getarray(mysqli_query($conn, "SELECT * FROM `commitee_to_member`"));
    
    $wings = mysqli_getarray(mysqli_query($conn, "SELECT * FROM `wings`"));

    $documents = mysqli_getarray(mysqli_query($conn, "SELECT * FROM `documents`"));

    foreach ($documents as $document) {
        $document->views = mysqli_getarray(mysqli_query($conn, "SELECT user.id as 'id',`fname`,`lname`,`datetime` FROM document_views JOIN user ON user.id = document_views.member_id WHERE document_id='$document->id'"));
        $document->query = "SELECT user.id as `id`, `fname`,`lname`,`datetime` FROM document_views JOIN user ON user.id = document_views.document_id WHERE document_id='$document->id'";
    }


    return array("members"=>$members, "commitee"=>$commitees, "commitee_to_members"=>$commitee_to_member, "wings"=>$wings, "documents"=>$documents);
}

function createWing($conn, $payload){
    $user = $payload->jwt_vars;

    if($user->role == "superadmin"){
        mysqli_query($conn, "INSERT INTO `wings`(`name`, `type`) VALUES ('$payload->name','$payload->type')");
    }else{
        my_error(401);
    }
}

function updateWing($conn, $payload){
    $user = $payload->jwt_vars;

    if($user->role == "superadmin"){
        mysqli_query($conn, "UPDATE `wings` SET `name`='$payload->name', `type`='$payload->type' WHERE `id`='$payload->id'");
    }else{
        my_error(401);
    }
}

function createMember($conn, $payload){
    $user = $payload->jwt_vars;


    if($user->role == "superadmin"){
        if($payload->new_room_number == 'NA'){
            $payload->new_room_number = null;
        }
        if($payload->new_wing == 'NA'){
            $payload->new_wing = null;
        }
        $new_user_id = 0;


        if(mysqli_query($conn, "INSERT INTO `user`(`fname`, `lname`, `marathi_fname`, `marathi_lname`, `preference`, `role`) VALUES ('$payload->fname','$payload->lname','$payload->marathi_fname','$payload->marathi_lname','$payload->preference','member')")===TRUE){
            $new_user_id = $conn->insert_id;
        }else{
            return $conn->error;
        }

        $password = password_hash('Password', PASSWORD_DEFAULT);
        mysqli_query($conn, "INSERT INTO `user_authentication`(`id`, `password`) VALUES ('$new_user_id','$password')");
        

        mysqli_query($conn, "INSERT INTO `user_contact`(`user_id`, `contact_type`, `contact_detail`) VALUES ('$new_user_id', 'phone', '$payload->number')");
        mysqli_query($conn, "INSERT INTO `user_contact`(`user_id`, `contact_type`, `contact_detail`) VALUES ('$new_user_id', 'email', '$payload->email')");

        mysqli_query($conn, "INSERT INTO `user_room`(`user_id`, `current_room_number`, `current_wing`, `new_room_number`, `new_wing`) VALUES ('$new_user_id', '$payload->current_room_number', '$payload->current_wing', '$payload->new_room_number', '$payload->new_wing')");

        return $conn->error."INSERT INTO `user_room`(`user_id`, `current_room_number`, `current_wing`, `new_room_number`, `new_wing`) VALUES ('$new_user_id', '$payload->current_room_number', '$payload->current_wing', '$payload->new_room_number', '$payload->new_wing')";
    }else{
        my_error(401);
    }
}

function updateMember($conn, $payload){
    $user = $payload->jwt_vars;


    if($user->role == "superadmin"){
        if($payload->new_room_number == 'NA'){
            $payload->new_room_number = null;
        }
        if($payload->new_wing == 'NA'){
            $payload->new_wing = null;
        }
        $new_user_id = 0;


        mysqli_query($conn, "UPDATE `user` SET `fname`='$payload->fname', `lname`='$payload->lname', `preference`='$payload->preference' WHERE `id`='$payload->id'");


        mysqli_query($conn, "UPDATE  `user_contact` SET `contact_detail` = '$payload->number' WHERE `user_id`='$payload->id' AND `contact_type`='phone'");
        mysqli_query($conn, "UPDATE  `user_contact` SET `contact_detail` = '$payload->email' WHERE `user_id`='$payload->id' AND `contact_type`='email'");
        echo "UPDATE  `user_contact` SET `contact_detail` = '$payload->email' WHERE `user_id`='$payload->id' AND `contact_type`='email'";

        mysqli_query($conn, "UPDATE `user_room` SET `current_room_number`='$payload->current_room_number', `current_wing`='$payload->current_wing', `new_room_number`='$payload->new_room_number', `new_wing`='$payload->new_wing' WHERE `user_id`='$payload->id' ");

        return true;
    }else{
        my_error(401);
    }
}

function upload($conn, $payload){
    
    $file = ($_FILES["pdf"]);
    $absolutedir			= dirname(__FILE__);
    $dir					= "../uploads/";
    $serverdir				= str_replace("/","\\",$absolutedir.$dir);
    $updated_name           = getdate()[0].$_FILES['pdf']['name'];
    $filename               = preg_replace('/\s+/', '', '/../../uploads/' .$updated_name);

    move_uploaded_file($_FILES['pdf']['tmp_name'],getdate()[0].$_FILES['pdf']['name']);

    return $updated_name;
}

function uploaddocone($conn, $payload){
    
    $file = ($_FILES["pdf"]);
    $absolutedir			= dirname(__FILE__);
    $dir					= "../uploads/";
    $serverdir				= str_replace("/","\\",$absolutedir.$dir);
    $updated_name           = getdate()[0].$_FILES['pdf']['name'];
    $filename               = preg_replace('/\s+/', '', '/../../uploads/' .$updated_name);;

    move_uploaded_file($_FILES['pdf']['tmp_name'],dirname(__FILE__).$filename);

    return preg_replace('/\s+/', '',$updated_name);
}

function uploaddotwo($conn, $payload){
    
    $file = ($_FILES["pdf"]);
    $absolutedir			= dirname(__FILE__);
    $dir					= "../uploads/";
    $serverdir				= str_replace("/","\\",$absolutedir.$dir);
    $updated_name           = getdate()[0].$_FILES['pdf']['name'];
    $filename               = preg_replace('/\s+/', '', '/../../uploads/' .$updated_name);;

    move_uploaded_file($_FILES['pdf']['tmp_name'],dirname(__FILE__).$filename);

    return preg_replace('/\s+/', '',$updated_name);

    return $updated_name;
}

function createDocumentOne($conn, $payload){
    $user = $payload->jwt_vars;

    $time = getdate()[0];
    
    mysqli_query($conn, "UPDATE `user` SET `consent_one`='$payload->payload' WHERE `id` = '$payload->id'");
    return true;
}

function createDocumentTwo($conn, $payload){
    $user = $payload->jwt_vars;

    $time = getdate()[0];
    
    mysqli_query($conn, "UPDATE `user` SET `consent_two`='$payload->payload' WHERE `id` = '$payload->id'");
    return true;
}

function createDocument($conn, $payload){
    $user = $payload->jwt_vars;

    $time = getdate()[0];
    
    mysqli_query($conn, "INSERT INTO `documents`(`name`, `description`, `filename`,`datetime`) VALUES ('$payload->name', '$payload->description', '$payload->filename','$time')");
    return true;
}

function readDocument($conn, $payload){
    $user = $payload->jwt_vars;

    $time = getdate()[0];

    if(mysqli_query($conn, "INSERT INTO `document_views`(`member_id`, `document_id`, `datetime`) VALUES ('$user->id','$payload->id','$time')")===TRUE){
        return "INSERT INTO `document_views`(`member_id`, `document_id`, `datetime`) VALUES ('$user->id','$payload->id','$time')";
    }else{
        return $conn->error;
    }
}
?>