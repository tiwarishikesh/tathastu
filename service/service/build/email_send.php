<?php
// Set the timezone
date_default_timezone_set('Asia/Kolkata');

set_time_limit(0);

$member_data = json_decode(file_get_contents('https://www.rotarymeansbusiness.in/php/build/getmemberdata.php'))[0];
$meetings = json_decode(file_get_contents('https://www.rotarymeansbusiness.in/service/getMeetingForInvite'))->payload;


////GROUP THE NOTIFICATION TOKENS
$grouped_tokens = array();
foreach($member_data->tokens as $token)
{ 
    $grouped_tokens[$token->user_id][] = $token->token;
}
$notifications = array();

foreach ($meetings as $meeting) {
    $vars = new stdClass();
    $vars = $meeting;

    unset($vars->name);
    $vars->meeting_zone = $meeting->zone_name;
    $vars->zonal_head  = "";
    $vars->meeting_link = "https://goo.gl/maps/stzz9KREuB9epFRW7";
    $vars->meeting_id = "9756 1272 135";
    $vars->meeting_password = "RMB3142";
    $vars->meeting_date = "23rd August 2022";
    $vars->meeting_time = "07:45";

    $vars->meeting_type = "offline";


    /* $vars->location_name = $meeting->name; */
    $vars->address_line_1 = $meeting->ads_one;
    $vars->address_line_2 = $meeting->ads_two;
    $vars->human_date = date("jS F Y G:i", $meeting->td);
    /* $vars->map_link = "https://goo.gl/maps/LMwnbvwhrdq28iiS9"; */

    $html = $vars->meeting_type=="online" ?  template_engine(file_get_contents('html/rotary_zoom_nm.html'),$vars) :  template_engine(file_get_contents('html/normal_invite.html'),$vars);
    $text = $vars->meeting_type=="online"  ? 
        "Dear RMBian {{name}}, RMB {{meeting_zone}} Zone is holding their fornightly meeting at {{human_date}} .\nLink : {{meeting_link}}\nMeeting ID : {{meeting_id}}\nPassword : {{meeting_password}}":
        "Dear RMBian {{name}}, RMB {{meeting_zone}} Zone is holding their fortnightly venue meeting at {{human_date}}.\n\nVenue: {{location_name}}\nAddress : {{address_line_1}}, {{address_line_2}}\n\nMap : {{map_link}}";
    $text = template_engine($text,$vars);
    

    $messageVersions = array();

    $smsReports = array();


    ///Create final templates and send
    foreach ($member_data->members as $member) {
        if(filter_var($member->email, FILTER_VALIDATE_EMAIL)){
            $messageVersions[] = array(
                'to' => array(
                    array(
                        'email' => $member->email,
                        "name" => $member->name
                    )
                ),
                'params' => array(
                    'name' => $member->name
                ),
                'subject' => 'Hey '.$member->name.', '.$meeting->zone_name.' Zone is holding their fortnightly meeting on '.$vars->human_date
            );
        }
    }
    send_email($messageVersions, $html, 'Rotary Means Business District 3142 - '.$meeting->zone_name.' Zone Meeting');
    foreach ($grouped_tokens as $key => $value) {
        if($key != '0'){
            $GLOBALS['userID'] =  $key;
            $userfiltered = array_filter($member_data->members, function ($o) { return $o->id == $GLOBALS['userID']; });
            foreach ($userfiltered as $k => $user) {
                if(isset($user->id)){
                    send_notifications((object)array(
                        "title"    => "Hello ".$user->name."ðŸ‘‹, ".$vars->meeting_zone." Zone Meeting is coming up",
                        "body"     => "See you on ".$vars->human_date." at ".$vars->location_name,
                        "map_link" => $vars->map_link,
                        "tokens"   => $value
                    ));
                }
            }
        }
    }
}

die('done');


function send_sms($text, $number){
    $ch = curl_init();
        // Set url
        curl_setopt($ch, CURLOPT_URL, "http://sms.admarksolution.com/sendSMS?username=Kanris&message=".urlencode($text)."&sendername=RMBIND&smstype=TRANS&numbers=".$number."&apikey=1c5cc7fa-9f8f-4bc3-86b0-97c396e88371");
        // Return the transfer as a string
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        // Output contains the output string
        $output = json_decode(curl_exec($ch));
        // Close curl resource to free up system resources
        curl_close($ch);
}

function send_email($messageVersions, $template, $subject){
    $data = (object)array(
        'member1' => "hello, I'm 1",
        'sender' => (object)array(
            'email' => "rotarymeansbusiness3142@kanr.is",
            "name" => "Rotary Means Business"
        ),
        'messageVersions' => $messageVersions,
        'subject' => $subject,
        "htmlContent" => $template
    );
    
    $curl = curl_init();
    
    curl_setopt_array($curl, array(
      CURLOPT_URL => 'https://api.sendinblue.com/v3/smtp/email',
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_ENCODING => '',
      CURLOPT_MAXREDIRS => 10,
      CURLOPT_TIMEOUT => 0,
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_CUSTOMREQUEST => 'POST',
      CURLOPT_POSTFIELDS =>json_encode($data),
      CURLOPT_HTTPHEADER => array(
        'Accept: application/json',
        'Content-Type: application/json',
        'api-key: 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'
      ),
    ));
    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
    
    $response = curl_exec($curl);
    $error = curl_error($curl);
    curl_close($curl);
}

function send_notifications($vars){
    $data = '{
        "registration_ids": '.json_encode($vars->tokens).',
        "collapse_key": "type_a",
    
        "data": {
            "notification": {
                "body": "'.$vars->body.'",
                "title": "'.$vars->title.'"
            },
            "body": "'.$vars->body.'",,
            "title": "'.$vars->title.'",
            "icon": "https://www.rotarymeansbusiness.in/images/rmb_120x120.png",
            "click_action": "'.$vars->map_link.'",
        }
    }';

    
    $curl = curl_init();
    
    curl_setopt_array($curl, array(
      CURLOPT_URL => 'https://fcm.googleapis.com/fcm/send',
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_ENCODING => '',
      CURLOPT_MAXREDIRS => 10,
      CURLOPT_TIMEOUT => 0,
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_CUSTOMREQUEST => 'POST',
      CURLOPT_POSTFIELDS =>($data),
      CURLOPT_HTTPHEADER => array(
        'Accept: application/json',
        'Content-Type: application/json',
        'Authorization: key=AAAALQNBbZE:APA91bERSbIIKd5_54AIMHhxfY5g0U-X_bfR9CMAc-5tMWmzu8N-cQtHbggQNp1KNjqmx82uSeTw-ua-qXXkyhShoIS2Es0-Y6V1l4dIlnvWoedQhlAlQ3v_1vth19rcD7honWOKNZUq'
      ),
    ));
    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
    
    $response = curl_exec($curl);
    $error = curl_error($curl);
    curl_close($curl);
}

function template_engine($template,$vars){
    foreach ($vars as $key => $var) {
        $template = str_replace('{{'.$key.'}}',$var,$template);
    }
    return $template;
}

function array_usearch(array $array, callable $comparitor) {
    return array_filter(
        $array,
        function ($element) use ($comparitor) {
            if ($comparitor($element)) {
                return $element;
            }
        }
    );
}
?>