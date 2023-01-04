<?php
function newSocket($conn, $payload){
    sleep(6);
    return 'socket';
}

function getChat($conn, $payload){
    $user = $payload->jwt_vars;

    $chats = mysqli_getarray(mysqli_query($conn, "SELECT * FROM `member_chats` WHERE `member_one` = '$user->id' OR `member_two`='$user->id'"));

    foreach ($chats as $chat) {
        $chat->messages = mysqli_getarray(mysqli_query($conn, "SELECT * FROM `member_chat_messages` WHERE `chat_id` = '$chat->id' ORDER BY `id` ASC"));
    }

    return $chats;
}

function newChat($conn, $payload){
    $user = $payload->jwt_vars;

    $query = mysqli_getarray(mysqli_query($conn,"SELECT `id` FROM member_chats WHERE (`member_one`='$user->id' AND `member_two`='$payload->id') OR (`member_one`='$payload->id' AND `member_two`='$user->id')"));
    if(empty($query)){
        mysqli_query($conn, "INSERT INTO `member_chats`(`member_one`, `member_two`) VALUES ('$user->id','$payload->id')");
        return $conn->insert_id;
    }else{
        return $query[0]->id;
    }
}

function newChatMessage($conn, $payload){
    $user = $payload->jwt_vars;
    $time = getdate()[0];
    mysqli_query($conn, "INSERT INTO `member_chat_messages`(`chat_id`, `sender`, `time`, `readreciept`, `reaction`, `message`) VALUES ('$payload->chat_id','$user->id','$time',0,null,'$payload->message')");

    return mysqli_query($conn, "SELECT * FROM `member_chat_messages` WHERE `chat_id`='$payload->chat_id'");
}
?>