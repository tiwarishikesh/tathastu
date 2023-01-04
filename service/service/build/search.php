<?php
function search($conn, $payload){
    $members = mysqli_getarray(mysqli_query($conn, "SELECT * FROM member_profession JOIN member ON member.id = member_profession.member_id WHERE member.membership_status = '2'"));
    $blogs = mysqli_getarray(mysqli_query($conn, "SELECT *, blogs.id as id FROM blogs JOIN member on blogs.member_id = member.id WHERE `status`='2'"));
    $events = mysqli_getarray(mysqli_query($conn, "SELECT * from member_events JOIN member ON member.id = member_events.member_id WHERE member_events.status = '1'"));

    return array("members"=>$members, "blogs"=>$blogs, "events"=>$events);
}

function classi($conn, $payload){
    return mysqli_getarray(mysqli_query($conn, "SELECT * FROM `member_profession_classifications`"));
}

function init($conn, $payload){
    $time = getdate()[0]*1000;

    $events = mysqli_getarray(mysqli_query($conn, "SELECT * from member_events JOIN member ON member.id = member_events.member_id WHERE member_events.status = '1' ORDER BY `event_datetime` ASC"));
    $advertisements = mysqli_getarray(mysqli_query($conn, "SELECT * FROM website_advertisements JOIN member ON member.id = website_advertisements.uploaded_by WHERE website_advertisements.status = '1'"));
    $blogs = mysqli_getarray(mysqli_query($conn, "SELECT * FROM blogs JOIN member ON blogs.member_id = member.id WHERE blogs.status = '1'"));
    $board = mysqli_getarray(mysqli_query($conn, "SELECT * FROM website_board JOIN member ON website_board.member_id = member.id"));
    $testimonials = mysqli_getarray(mysqli_query($conn, "SELECT * FROM website_testimonials JOIN member ON member.id = website_testimonials.member_id WHERE website_testimonials.status = '1'"));
    $chapters = mysqli_getarray(mysqli_query($conn,"SELECT * FROM rmb_chapter"));
    $groups = mysqli_getarray(mysqli_query($conn,"SELECT * FROM `member_groups`"));

    foreach ($chapters as $chapter) {
        $chapter->admins = mysqli_getarray(mysqli_query($conn, "SELECT * FROM `rmb_chapter_heads` WHERE `chapter_id` = '$chapter->id'"));
    }
    foreach ($groups as $group) {
        $group->admins = mysqli_getarray(mysqli_query($conn, "SELECT * FROM `rmb_chapter_heads` WHERE `chapter_id` = '$chapter->id'"));
    }


    return array("events"=>$events, "advertisements"=>$advertisements, "blogs"=>$blogs, "board"=>$board, "testimonials"=>$testimonials, "chapters"=>$chapters, "groups"=>$groups);
    /* $ads = mysqli_getarray(mysqli_query($conn, "")) */
}

function network($conn, $payload){
    $user = $payload->jwt_vars;

    $member = mysqli_getarray(mysqli_query($conn, "SELECT *, member.id AS id FROM member JOIN member_profession ON member.id = member_profession.member_id"));
    $connections = mysqli_getarray(mysqli_query($conn, "SELECT * FROM `member_connections` WHERE `requested_by` = '$user->id' OR `requested_to` = '$user->id'"));
    $photos = mysqli_getarray(mysqli_query($conn, "SELECT * FROM `member_photos` WHERE `member_id`='$user->id'"));
    $praise = mysqli_getarray(mysqli_query($conn,"SELECT * FROM member_recommendation JOIN member ON member_recommendation.given_by = member.id WHERE member_recommendation.member_id='$user->id'"));
    $groups = mysqli_getarray(mysqli_query($conn, "SELECT *, member_group_participants.status as `member_group_status` FROM (SELECT * FROM member_group_participants WHERE member_group_participants.member_id = '$user->id') AS member_group_participants JOIN member_groups ON member_groups.id = member_group_participants.group_id"));
    $mygroups = mysqli_getarray(mysqli_query($conn, "SELECT * FROM `member_group_admin` WHERE `member_id`='$user->id'"));

    return array("member"=>$member, "connections"=>$connections, "photos"=>$photos, "praise"=>$praise, "groups"=>$groups, "mygroups"=>$mygroups);
}

function getPosts($conn, $payload){
    $user = $payload->jwt_vars;

    $posts = array();
    if(isset($payload->id)){
        $posts =  mysqli_getarray(mysqli_query($conn, "SELECT *, member_posts.id as 'post_id', member.id as 'member_id' FROM member JOIN member_posts ON member.id = member_posts.member_id WHERE member.id = '$payload->id' ORDER BY member_posts.posted_on DESC"));    
        
    }else{
        $mygroups = mysqli_getarray(mysqli_query($conn, "SELECT `group_id` FROM `member_group_participants` WHERE `member_id` = '$user->id' AND `status`='2'"));
        
        $mygroupids = array();
        foreach ($mygroups as $x) {
            $mygroupids[] = $x->group_id;
        }
        $variableforgroup = implode(',', $mygroupids);
        $variableforgroup =  strlen($variableforgroup)==0 ? "''": $variableforgroup;
        
        $posts =  mysqli_getarray(mysqli_query($conn, "SELECT *, member_posts.id as 'id', member_posts.id as 'post_id', member.id as 'member_id' FROM member JOIN member_posts ON member.id = member_posts.member_id LEFT JOIN (SELECT member_groups.id, member_groups.name, member_groups.description FROM member_groups WHERE `id` IN (".$variableforgroup.") ) AS member_groups ON member_posts.group_id = member_groups.id WHERE  member_posts.group_id IN ('0',".$variableforgroup.",'0') ORDER BY member_posts.posted_on DESC"));
        
    }


    foreach ($posts as $post) {
        $post->likes = mysqli_getarray(mysqli_query($conn, "SELECT * FROM member JOIN member_post_reactions ON member.id = member_post_reactions.member_id WHERE post_id = '$post->id'"));
        $post->comments = mysqli_getarray(mysqli_query($conn, "SELECT * FROM member_post_comments JOIN member ON member.id = member_post_comments.member_id WHERE member_post_comments.post_id = '$post->id'"));
    }

    return $posts;
}

function addNewPost($conn, $payload){
    $user = $payload->jwt_vars;

    $time = getdate()[0];
    if(mysqli_query($conn, "INSERT INTO `member_posts`(`member_id`, `post_body`, `image`, `status`, `posted_on`, `approved_on`) VALUES ('$user->id','$payload->post_body','$payload->image','0','$time','0')")===TRUE){
        return array("id"=>$conn->insert_id, "status"=>"success");
    }else{
        return $conn->error;
    }
}

function getAnotherMember($conn, $payload){
    $user = $payload->jwt_vars;
    $id = $payload->id;

    $personal = mysqli_getarray(mysqli_query($conn,"SELECT * FROM `member` WHERE `id`='$id'"))[0];
    $professional = mysqli_getarray(mysqli_query($conn,"SELECT * FROM `member_profession` WHERE `member_id`='$id'"))[0];
    $connections = mysqli_getarray(mysqli_query($conn,"SELECT * FROM `member_connections` WHERE `requested_by` = '$id' OR `requested_to` = '$id'"));
    $photos = mysqli_getarray(mysqli_query($conn,"SELECT * FROM `member_photos` WHERE `member_id`='$id'"));
    $praise = mysqli_getarray(mysqli_query($conn,"SELECT * FROM member_recommendation JOIN member ON member_recommendation.given_by = member.id WHERE member_recommendation.member_id='$id'"));

    return array("personal"=>$personal, "professional"=>$professional, "connections"=>$connections, "photos"=>$photos, "praise"=>$praise);
}

function testsomething($conn, $payload){
    $roles = ['supradmin', 'simple'];

    if(!empty($roles)){
        if(in_array($payload->jwt_vars->role,$roles)){
            return $payload->jwt_vars;
        }else{
            my_error(403);
        }
    }

    return $payload;
}

function newConnection($conn, $payload){
    $user = $payload->jwt_vars;
    $time = getdate()[0];
    mysqli_query($conn, "INSERT INTO `member_connections`(`requested_by`, `requested_to`, `sent_on`, `status`, `approved_on`) VALUES ('$user->id', '$payload->id', '$time', '0', '0')");


    $emailerList = mysqli_getarray(mysqli_query($conn, "SELECT * from `member` WHERE `id`='$payload->id'"));
    foreach ($emailerList as $emailer) {
        $emailer->email = mysqli_getarray(mysqli_query($conn, "SELECT * FROM `member_contact` WHERE `contact_type`='email' AND `member_id`='$emailer->id'"));
    }

    $emailToSend = mysqli_getarray(mysqli_query($conn, "SELECT * FROM `website_emails` WHERE `id`='3'"))[0];
        $messageVersions = array();
        foreach ($emailerList as $member) {
            foreach ($member->email as $email) {
                if(filter_var($email->details, FILTER_VALIDATE_EMAIL)){
                    $param_array = array(
                        'sendee_fname'        => $member->fname,
                        'sendee_lname'        => $member->lname,
                        'sender_fname'        => $user->fname,
                        'sender_lname'        => $user->lname,
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
    return true;
}

function updateConnection($conn, $payload){
    $user = $payload->jwt_vars;
    mysqli_query($conn, "UPDATE `member_connections` SET `status`='$payload->status' WHERE `requested_by`='$payload->id' AND `requested_to`='$user->id'");
    return true;
}

function deleteConnection($conn, $payload){
    $user = $payload->jwt_vars;
    mysqli_query($conn, "DELETE FROM `member_connections` WHERE `requested_by`='$payload->id' AND `requested_to`='$user->id'");
    mysqli_query($conn, "DELETE FROM `member_connections` WHERE `requested_by`='$user->id' AND `requested_to`='$payload->id'");
    return true;
}

function addRecomm($conn, $payload){
    $user = $payload->jwt_vars;
    $time = getdate()[0];
    if(mysqli_num_rows(mysqli_query($conn, "SELECT * FROM `member_recommendation` WHERE `member_id`='$payload->id' AND `given_by`='$user->id'"))>0){
        mysqli_query($conn, "UPDATE `member_recommendation` SET `praise`='$payload->text' WHERE `member_id`='$payload->id' AND `given_by`='$user->id'");
    }else{
        mysqli_query($conn, "INSERT INTO `member_recommendation`(`member_id`, `given_by`, `praise`, `datetime`) VALUES ('$payload->id', '$user->id', '$payload->text', '$time')");
    }
    return true;
}
?>