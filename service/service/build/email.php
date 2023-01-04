<?php
function getAllEmailTemplates($conn, $payload){
    $emails = mysqli_getarray(mysqli_query($conn, "SELECT * FROM `website_emails`"));
    $custom_variables = mysqli_getarray(mysqli_query($conn,"SELECT * FROM `website_email_variables` WHERE `emailType`='custom'"));
    foreach ($emails as $email) {
        if($email->type == "custom"){
            $email->variables = $custom_variables;
        }else{
            /* return "SELECT * FROM `website_email_variables` WHERE `emailID`='$email->id'"; */
            $email->variables = mysqli_getarray(mysqli_query($conn, "SELECT * FROM `website_email_variables` WHERE `emailID`='$email->id'"));
        }
        $email->design = json_decode($email->design)[0];
    }
    return $emails;
}


function addNewEmailTemplate($conn, $payload){
    /* $payload->design = json_encode($payload->design); */
    $filename = getdate()[0].'.txt';
    $myfile = fopen($filename, "w") or die("Unable to open file!");
    /* fwrite($myfile, $payload->design); */
    fclose($myfile);

    if($payload->paid == ''){
        $payload->paid = '0';
    }
    if($payload->approved == ''){
        $payload->approved = '0';
    }
    if($payload->date == ''){
        $payload->date = '0';
    }
    if($payload->constraints == ''){
        $payload->constraints = '[]';
    }

    /* return $payload->design; */

    $payload->design = '['.(($payload->design)).']';

    if($payload->id == "new"){
        mysqli_query($conn, "INSERT INTO `website_emails`(`type`,`name`, `description`,`subject`, `design`,`html`, `approved`, `paid`, `audience_constraints`, `send_on`) VALUES 
                    ('custom','$payload->title','$payload->description','$payload->design','$payload->html','$payload->approved','$payload->paid','$payload->constraints','$payload->date')");
    }else{
        if(mysqli_query($conn, "UPDATE `website_emails` SET `name`='$payload->title',`description`='$payload->description',`subject`='$payload->subject',`design`='$payload->design',`html`='$payload->html',`approved`='$payload->approved', `paid`='$payload->paid',`audience_constraints`='$payload->constraints',`send_on`='$payload->date' WHERE `id`='$payload->id'")===TRUE){
            return true;
        }else{
            return $conn->error;
        }
    }
    return true;
}

function automatedEmailers($conn, $payload){
    /* date_default_timezone_set('Asia/Kolkata'); */
    $timestamp = (strtotime('today midnight')*1000) - 86400000;
    $timestamp1 = $timestamp + 86400000 - 1;

    $emailsToSend = mysqli_getarray(mysqli_query($conn, "SELECT * FROM `website_emails` WHERE `send_on`>'$timestamp' AND `send_on`<'$timestamp1'"));


    foreach ($emailsToSend as $emailToSend) {
        $membersToSend = '';
        if($emailToSend->paid == "all" && $emailToSend->approved=="all"){
            
            $membersToSend = mysqli_getarray(mysqli_query($conn, "SELECT * FROM `member`"));
        }
        if($emailToSend->paid == "all" && $emailToSend->approved=="approved"){
            $membersToSend = mysqli_getarray(mysqli_query($conn, "SELECT * FROM `member` WHERE `membership_status`='1' OR `membership_status`='2'"));
        }
        if($emailToSend->paid == "all" && $emailToSend->approved=="unapproved"){
            $membersToSend = mysqli_getarray(mysqli_query($conn, "SELECT * FROM `member` WHERE `membership_status`='0' OR `membership_status`='3'"));
        }
        if($emailToSend->paid == "paid" && $emailToSend->approved=="approved"){
            $membersToSend = mysqli_getarray(mysqli_query($conn, "SELECT * FROM `member` WHERE `membership_status`='2'"));
        }
        if($emailToSend->paid == "paid" && $emailToSend->approved=="unapproved"){
            $membersToSend = mysqli_getarray(mysqli_query($conn, "SELECT * FROM `member` WHERE `membership_status`='3'"));
        }
        if($emailToSend->paid == "paid" && $emailToSend->approved=="all"){
            $membersToSend = mysqli_getarray(mysqli_query($conn, "SELECT * FROM `member` WHERE `membership_status`='2' OR `membership_status`='3'"));
        }
        if($emailToSend->paid == "unpaid" && $emailToSend->approved=="all"){
            $membersToSend = mysqli_getarray(mysqli_query($conn, "SELECT * FROM `member` WHERE `membership_status`='0' OR `membership_status`='1'"));
        }
        if($emailToSend->paid == "unpaid" && $emailToSend->approved=="unapproved"){
            $membersToSend = mysqli_getarray(mysqli_query($conn, "SELECT * FROM `member` WHERE `membership_status`='0'"));
        }
        if($emailToSend->paid == "unpaid" && $emailToSend->approved=="approved"){
            $membersToSend = mysqli_getarray(mysqli_query($conn, "SELECT * FROM `member` WHERE `membership_status`='1'"));
        }

        foreach ($membersToSend as $member) {
            $member->email = mysqli_getarray(mysqli_query($conn, "SELECT * FROM `member_contact` WHERE `contact_type`='email' AND `member_id`='$member->id'"));
        }
        return prepareAndSendEmail($emailToSend, $membersToSend, $conn);
    }
}

function prepareAndSendEmail($emailToSend, $membersToSend, $conn){
    $messageVersions = array();
    foreach ($membersToSend as $member) {
        foreach ($member->email as $email) {
            if(filter_var($email->details, FILTER_VALIDATE_EMAIL)){
                $param_array = array(
                    'fname' => $member->fname,
                    'lname' => $member->lname
                );
                $messageVersions[] = array(
                    'to' => array(
                        array(
                            'email' => $email->details,
                            "name" => $member->fname .' ' .$member->lname,
                        )
                    ),
                    'params' => $param_array,
                    'subject' => template_engine(str_replace("}","}}",str_replace("{","{{",$emailToSend->subject)),json_decode(json_encode($param_array)))
                );
            }
        }
    }
    /* echo json_encode($messageVersions); */
    $emailsSent = send_email($messageVersions, $emailToSend->html, 'Hey, you have an email from RMB');
    return $emailsSent;
}
?>