<?php

function addLike($conn, $payload){
    $user = $payload->jwt_vars;

    if((mysqli_num_rows(mysqli_query($conn, "SELECT * FROM `member_post_reactions` WHERE `post_id`='$payload->id' AND `member_id`='$user->id'")))>0){
        mysqli_query($conn, "UPDATE `member_post_reactions` SET `reaction_type`='$payload->reaction' WHERE `post_id`='$payload->id' AND `member_id`='$user->id'");
    }else{
        mysqli_query($conn, "INSERT INTO `member_post_reactions`(`post_id`, `reaction_type`, `member_id`) VALUES ('$payload->id','$payload->reaction','$user->id')");
    }
    return mysqli_getarray(mysqli_query($conn, "SELECT * FROM `member_post_reactions` WHERE `post_id`='$payload->id'"));
}

function removeLike($conn, $payload){
    $user = $payload->jwt_vars;
    mysqli_query($conn, "DELETE FROM `member_post_reactions` WHERE `post_id`='$payload->id' AND `member_id`='$user->id'");
    return mysqli_getarray(mysqli_query($conn, "SELECT * FROM `member_post_reactions` WHERE `post_id`='$payload->id'"));
}

function addComment($conn, $payload){
    $user = $payload->jwt_vars;
    mysqli_query($conn, "INSERT INTO `member_post_comments`(`post_id`, `member_id`, `comment_text`, `status`) VALUES ('$payload->post_id','$user->id','$payload->comment','1')");
    $newComment = $conn->insert_id;
    $comment = mysqli_getarray(mysqli_query($conn, "SELECT * FROM member_post_comments JOIN member ON member.id = member_post_comments.member_id WHERE member_post_comments.post_id = '$payload->post_id' ORDER BY member_post_comments.id DESC"));
    return $comment;
}

function deleteComment($conn, $payload){
    $user = $payload->jwt_vars;
    mysqli_query($conn, "DELETE FROM `member_post_comments` WHERE `id`='$payload->id' AND `member_id`='$user->id'");
    return true;
}

function postGroupPost($conn, $payload){
    $user = $payload->jwt_vars;

    $time = getdate()[0];
    if(mysqli_query($conn, "INSERT INTO `member_posts`(`member_id`, `post_body`, `image`, `status`,`type`,`group_id`, `posted_on`, `approved_on`) VALUES ('$user->id','$payload->post_body','$payload->image','0',1,'$payload->group_id','$time','0')")===TRUE){
        /* return array("id"=>$conn->insert_id, "status"=>"success"); */

        $emailerList = mysqli_getarray(mysqli_query($conn, "SELECT member.id,`fname`,`lname` FROM `member_group_participants` JOIN `member` ON member.id = member_group_participants.member_id WHERE member_group_participants.preferences = 'yes' AND member_group_participants.group_id='$payload->group_id'"));
        foreach ($emailerList as $emailer) {
            $emailer->email = mysqli_getarray(mysqli_query($conn, "SELECT * FROM `member_contact` WHERE `contact_type`='email' AND `member_id`='$emailer->id'"));
        }
        $groupinformation = mysqli_getarray(mysqli_query($conn, "SELECT * FROM `member_groups` WHERE `id`='$payload->group_id'"))[0];

        $emailToSend = mysqli_getarray(mysqli_query($conn, "SELECT * FROM `website_emails` WHERE `id`='5'"))[0];
        $messageVersions = array();
        foreach ($emailerList as $member) {
            foreach ($member->email as $email) {
                if(filter_var($email->details, FILTER_VALIDATE_EMAIL)){
                    $param_array = array(
                        'fname'        => $member->fname,
                        'lname'        => $member->lname,
                        'group'        => $groupinformation->name,
                        'post_text'    => $payload->post_body,
                        'sender_fname' => $user->fname,
                        'sender_lname' => $user->lname
                    );
                    $messageVersions[] = array(
                        'to' => array(
                            array(
                                'email' => $email->details,
                                "name"  => $member->fname .' ' .$member->lname,
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
        
        return array("id"=>$conn->insert_id, "status"=>"success", "emails"=>$emailsSent);
    }else{
        return $conn->error;
    }
}

function deletePost($conn, $payload){
    $user = $payload->jwt_vars;

    mysqli_query($conn, "DELETE FROM `member_posts` WHERE `id`='$payload->id' AND `member_id`='$user->id'");
    return true;
}

function createNewGroup($conn, $payload){
    $user = $payload->jwt_vars;

    $time = getdate()[0];
    $logo = isset($payload->group_logo) ? $payload->group_logo : null;
    mysqli_query($conn, "INSERT INTO `member_groups`(`name`, `description`, `group_logo`, `status`, `started_by`, `approved_by`, `approved_on`)  VALUES ('$payload->name', '$payload->description', '$logo', '1', '$user->id', '1', '$time')");
    
    $group_id = $conn->insert_id;

    mysqli_query($conn, "INSERT INTO `member_group_admin`(`group_id`, `member_id`) VALUES ('$group_id','$user->id')");
}

function joinrequest($conn, $payload){
    $user = $payload->jwt_vars;

    $group = mysqli_getarray(mysqli_query($conn, "SELECT * FROM `member_groups` WHERE `id`='$payload->id'"))[0];

    if($group->membership == "open"){
        mysqli_query($conn, "INSERT INTO `member_group_participants`(`group_id`, `member_id`, `status`, `approved_on`, `approved_by`) VALUES('$payload->id', '$user->id', '2', '1', '12345648')");
    }else if($group->membership == "regulated"){
        mysqli_query($conn, "INSERT INTO `member_group_participants`(`group_id`, `member_id`, `status`, `approved_on`, `approved_by`) VALUES('$payload->id', '$user->id', '1', '1', '12345648')");
    }

    return true;
}

function acceptrequest($conn, $payload){
    $user = $payload->jwt_vars;

    mysqli_query($conn, "UPDATE `member_group_participants` SET `status`='2' WHERE `group_id`='$payload->id' AND `member_id`='$user->id'");
    return true;
}

function accept_member($conn, $payload){
    $user = $payload->jwt_vars;

    mysqli_query($conn, "UPDATE `member_group_participants` SET `status`='2' WHERE `group_id`='$payload->group_id' AND `member_id`='$payload->id'");
    return true;
}

function reject_member($conn, $payload){
    mysqli_query($conn,"DELETE FROM `member_group_participants` WHERE `group_id`='$payload->group_id' AND `member_id`='$payload->id'");
    return true;
}

function ignorerequest($conn, $payload){
    $user = $payload->jwt_vars;

    mysqli_query($conn,"DELETE FROM `member_group_participants` WHERE `group_id`='$payload->id' AND `member_id`='$user->id'");
    return true;
}

function changePreference($conn, $payload){
    $user = $payload->jwt_vars;

    mysqli_query($conn, "UPDATE `member_group_participants` SET `preferences`='$payload->preference' WHERE `group_id`='$payload->groupID' AND `member_id`='$user->id'");
}

function new_group_photo($conn, $payload){
    header('Content-Type: application/json');
    //ini_set('memory_limit','16M');

    $error					= false;

    $absolutedir			= dirname(__FILE__);
    $dir					= "../../../assets/group_logo/";
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

    if(isset($payload->group_id)){
        mysqli_query($conn, "UPDATE `member_groups` SET `group_logo`='$filename' WHERE `id`='$payload->group_id'");
    }

    /* mysqli_query($conn, "INSERT INTO `website_photos`(`type`, `photo`, `title`, `status`, `uploaded_on`, `uploaded_by`) VALUES
                        ('1','$filename','NA','1','12346478','$user->id')"); */

    return $response;
}

function new_group($conn, $payload){
    $user = $payload->jwt_vars;

    $group_logo = $payload->logo == "N.A." ? null : $payload->logo;

    mysqli_query($conn, "INSERT INTO `member_groups`(`name`, `description`, `group_logo`, `privacy`, `membership`, `status`, `started_by`, `approved_by`, `approved_on`) VALUES
                        ('$payload->name','$payload->description','$group_logo','$payload->privacy','$payload->membership','1','$user->id','1','123456790')");

    $group_id = $conn->insert_id;
    mysqli_query($conn, "INSERT INTO `member_group_admin`(`group_id`, `member_id`) VALUES ('$group_id','$user->id')");
    mysqli_query($conn, "INSERT INTO `member_group_participants`(`group_id`, `member_id`, `status`, `approved_on`, `approved_by`) VALUES
                            ('$group_id','$user->id','2','123456803','$user->id')");

    foreach ($payload->admin as $x) {
        mysqli_query($conn, "INSERT INTO `member_group_admin`(`group_id`, `member_id`) VALUES ('$group_id','$x')");
    }

    foreach ($payload->invitations as $invitee) {
        mysqli_query($conn, "INSERT INTO `member_group_participants`(`group_id`, `member_id`, `status`, `approved_on`, `approved_by`) VALUES
                            ('$group_id','$invitee','0','123456803','$user->id')");
    }

    return $group_id;
}

function update_group_logo($conn, $payload){
    $user = $payload->jwt_vars;

    mysqli_query($conn, "UPDATE `member_groups` SET `group_logo`='$payload->filename' WHERE `id`='$payload->group_id'");
    return true;
}

function update_group($conn, $payload){
    $user = $payload->jwt_vars;

    mysqli_query($conn, "UPDATE `member_groups` SET `name`='$payload->name',`description`='$payload->description',`privacy`='$payload->privacy',`membership`='$payload->membership' WHERE `id`='$payload->id'");

    mysqli_query($conn, "DELETE FROM `member_group_admin` WHERE `group_id`='$payload->id'");
    mysqli_query($conn, "INSERT INTO `member_group_admin`(`group_id`, `member_id`) VALUES ('$payload->id','$user->id')");
    foreach ($payload->admin as $x) {
        if(mysqli_num_rows(mysqli_query($conn, "SELECT * FROM `member_group_participants` WHERE `group_id`='$payload->id' AND `member_id`='$x' AND `status`='0'"))>0){
            mysqli_query($conn, "UPDATE `member_group_participants` SET `status`='2' WHERE `group_id`='$payload->id' AND `member_id`='$x'");
        }else{
            mysqli_query($conn, "INSERT INTO `member_group_participants`(`group_id`, `member_id`, `status`, `approved_on`, `approved_by`) VALUES
            ('$payload->id','$x','0','123456803','$user->id')");
        }
        mysqli_query($conn, "INSERT INTO `member_group_admin`(`group_id`, `member_id`) VALUES ('$payload->id','$x')");
    }

    return true;
}
?>