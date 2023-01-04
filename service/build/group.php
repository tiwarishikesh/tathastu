<?php
function getGroup($conn, $payload){
    $user = $payload->jwt_vars;

    /* return "SELECT * FROM `member_groups` WHERE `id`='$payload->id'"; */
    $group = mysqli_getarray(mysqli_query($conn, "SELECT * FROM `member_groups` WHERE `id`='$payload->id'"))[0];
    
    $group->members = mysqli_getarray(mysqli_query($conn, "SELECT *, member_group_participants.status as 'group_member_status' FROM member JOIN member_group_participants ON member.id = member_group_participants.member_id WHERE member_group_participants.group_id = '$payload->id'"));
    $group->admins = mysqli_getarray(mysqli_query($conn, "SELECT * FROM member JOIN member_group_admin ON member.id = member_group_admin.member_id WHERE member_group_admin.group_id = '$payload->id'"));
    /* return "SELECT *, member_posts.id as 'post_id', member.id as 'member_id' FROM member JOIN member_posts ON member.id = member_posts.member_id WHERE memberposts.group_id = '$payload->id' ORDER BY member_posts.posted_on DESC"; */
    $group->posts =  mysqli_getarray(mysqli_query($conn, "SELECT *, member_posts.id as 'post_id', member.id as 'member_id' FROM member JOIN member_posts ON member.id = member_posts.member_id WHERE member_posts.group_id = '$payload->id' ORDER BY member_posts.posted_on DESC"));    

    foreach ($group->posts as $post) {
        $post->likes = mysqli_getarray(mysqli_query($conn, "SELECT * FROM member JOIN member_post_reactions ON member.id = member_post_reactions.member_id WHERE post_id = '$post->id'"));
        $post->comments = mysqli_getarray(mysqli_query($conn, "SELECT * FROM member_post_comments JOIN member ON member.id = member_post_comments.member_id WHERE member_post_comments.post_id = '$post->id'"));
    }

    return $group;
}
?>