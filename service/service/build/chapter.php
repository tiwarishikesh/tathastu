<?php
function newChapter($conn, $payload){
    $user = $payload->jwt_vars;

    mysqli_query($conn, "INSERT INTO `rmb_chapter`(`chapter_name`, `description`, `address`, `state`, `pincode`, `country`, `ridistrict`, `latitude`, `longitude`, `member_id`, `approved_on`, `approved_by`, `charter_club`, `email`) 
                                            VALUES ('$payload->name', '$payload->description', '$payload->address', '$payload->state', '$payload->pin', '$payload->country', '$payload->ridistrict','$payload->lat', '$payload->lng', '$user->id', '1', '1', '$payload->club','$payload->email')");

    $chapter_id = $conn->insert_id;

    foreach ($payload->heads as $key => $value) {
        $member =  current((array)$value);
        $position =  key((array)$value);
        mysqli_query($conn, "INSERT INTO `rmb_chapter_heads`(`member_id`, `position`, `chapter_id`) VALUES ('$member','$position','$chapter_id')");
    }

    mysqli_query($conn, "INSERT INTO `rmb_chapter_heads`(`member_id`, `position`, `chapter_id`) VALUES ('$user->id','CharterLeader','$chapter_id')");

    return true;
}

function updateChapter($conn, $payload){
    $user = $payload->jwt_vars;

    mysqli_query($conn, "UPDATE `rmb_chapter`SET `ridistrict`='$payload->ridistrict',`chapter_name`='$payload->name', `description`='$payload->description',`address`='$payload->address' , `state`='$payload->state', `pincode`='$payload->pin', `country`='$payload->country', `latitude`='$payload->lat', `longitude`='$payload->lng', `charter_club`='$payload->club', `email`='$payload->email' WHERE `id`='$payload->id'");

    mysqli_query($conn, "DELETE FROM `rmb_chapter_heads` WHERE `chapter_id`='$payload->id'");
    foreach ($payload->heads as $key => $value) {
        $member =  current((array)$value);
        $position =  key((array)$value);
        mysqli_query($conn, "INSERT INTO `rmb_chapter_heads`(`member_id`, `position`, `chapter_id`) VALUES ('$member','$position','$payload->id')");
    }
}

function updateAdminChapter($conn, $payload){
    $user = $payload->jwt_vars;

    mysqli_query($conn, "UPDATE `rmb_chapter`SET `ridistrict`='$payload->ridistrict',`chapter_name`='$payload->name', `description`='$payload->description',`address`='$payload->address' , `state`='$payload->state', `pincode`='$payload->pin', `country`='$payload->country', `latitude`='$payload->lat', `longitude`='$payload->lng', `charter_club`='$payload->club', `email`='$payload->email',`status`='$payload->status' WHERE `id`='$payload->id'");

    mysqli_query($conn, "DELETE FROM `rmb_chapter_heads` WHERE `chapter_id`='$payload->id'");
    foreach ($payload->heads as $key => $value) {
        $member =  current((array)$value);
        $position =  key((array)$value);
        mysqli_query($conn, "INSERT INTO `rmb_chapter_heads`(`member_id`, `position`, `chapter_id`) VALUES ('$member','$position','$payload->id')");
    }
}

function updateAdminChapterPayment($conn, $payload){
    $user = $payload->jwt_vars;
    
    mysqli_query($conn, "UPDATE `rmb_chapter` SET `payment`='1' WHERE `id`='$payload->id'");


    $chapter = mysqli_getarray(mysqli_query($conn, "SELECT * FROM `rmb_chapter` WHERE `id`='$payload->id'"))[0];
    $time = getdate()[0];
    $item_description = "Chapter Dues Paid for the year ".date("Y");
    $item_name = 'Chapter Dues for '.$chapter->chapter_name;
    $notes = "Marked as paid by RMB Admin ".$user->fname." ".$user->lname;
    $address = $chapter->address.', '.$chapter->state.', '.$chapter->pincode.', '.$chapter->country;
    mysqli_query($conn, "INSERT INTO `invoices`(`type`, `member_id`, `item`, `item_description`, `value`, `payment_reference`, `notes`, `address`, `timestamp`, `status`)
    VALUES ('chapter', '$payload->id', '$item_name', '$item_description', '15.00', '$payload->paymentRef', '$notes', '$address', '$time', '1')");
    return true;
}

function updateChapterPayment($conn, $payload){
    $user = $payload->jwt_vars;
    
    mysqli_query($conn, "UPDATE `rmb_chapter` SET `payment`='1' WHERE `id`='$payload->id'");

    $payload->paymentRef = "PayPalRef";

    $chapter = mysqli_getarray(mysqli_query($conn, "SELECT * FROM `rmb_chapter` WHERE `id`='$payload->id'"))[0];
    $time = getdate()[0];
    $item_description = "Chapter Dues Paid for the year ".date("Y");
    $item_name = 'Chapter Dues for '.$chapter->chapter_name;
    $notes = "Marked as paid by ".$user->fname." ".$user->lname;

    $address = $chapter->address.', '.$chapter->state.', '.$chapter->pincode.', '.$chapter->country;
    mysqli_query($conn, "INSERT INTO `invoices`(`type`, `member_id`, `item`, `item_description`, `value`, `payment_reference`, `notes`, `address`, `timestamp`, `status`)
    VALUES ('chapter', '$payload->id', '$item_name', '$item_description', '15.00', '$payload->paymentRef', '$notes', '$address', '$time', '1')");
    return true;
}

function getChapterInvoices($conn, $payload){
    $user = $payload->jwt_vars;

    
    return mysqli_getarray(mysqli_query($conn, "SELECT * FROM `invoices` WHERE `type`='chapter' AND `member_id`='$payload->id'"));
}

function getChapterInvoice($conn, $payload){
    error_reporting(0);
    $user = $payload->jwt_vars;

    $invoice = mysqli_getarray(mysqli_query($conn, "SELECT * FROM `invoices` WHERE `id`='$payload->id'"))[0];
    $invoice->date = gmdate('r', $invoice->timestamp);;

    return template_engine(file_get_contents('html_templates/invoice.html'),$invoice);
}

function payment($conn, $payload){
    $user = $payload->jwt_vars;

    $expiry = 1;

    if($payload->type=="lifetime"){
        $expiry = 2;
    }

    mysqli_query($conn, "UPDATE `member` SET `expiry`='$expiry', `membership_status`='2' WHERE `id`='$user->id'");
    return true;
}
?>