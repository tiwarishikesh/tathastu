<?php
function getMyEvents($conn, $payload){
    $user = $payload->jwt_vars;

    return mysqli_getarray(mysqli_query($conn, "SELECT * FROM `member_events` WHERE `member_id` = '$user->id'"));
}


function updateMyEvent($conn, $payload){
    $user = $payload->jwt_vars;
    $time = getdate()[0];

    $details = json_encode($payload->details);
    if($payload->id == 'NA'){
        if(mysqli_query($conn, "INSERT INTO `member_events`(`event_title`, `event_description`, `event_type`, `event_datetime`,`event_end`, `details`, `member_id`, `status`) VALUES ('$payload->title','$payload->description','$payload->type', '$payload->datetime', '$payload->endtime', '$details', '$user->id', '0' )")===TRUE){
            return "success";
        }else{
            return $conn;
        }
    }else{
        mysqli_query($conn, "UPDATE `member_events` SET `event_title`='$payload->title', `event_description`='$payload->description', `event_type`='$payload->type',`event_datetime`='$payload->datetime',`event_end`='$payload->endtime',`details`='$details' ,`status`='0' WHERE `id`='$payload->id'");
    }

    return null;
}

function deleteMyEvent($conn, $payload){
    $user = $payload->jwt_vars;

    mysqli_query($conn, "DELETE FROM `member_events` WHERE `id`='$payload->id' AND `uploaded_by`='$user->id'");
    return null;
}
?>