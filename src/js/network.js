let network = {
    search: async function () {
        this.readSearch().then(async ()=>{
            let filteredMembers = await this.filterForSearch.members();
            let filteredEvents = await this.filterForSearch.events();
            let filteredBlogs = await this.filterForSearch.blogs();

            console.log(filteredBlogs, filteredEvents, filteredMembers);
            $("search .search-single-member").remove();
            $("search .search-single-blog").remove();
            $("search .search-single-event").remove();

            template_engine('.search-single-member', filteredMembers, "#search_members");
            template_engine('.search-single-blog', filteredBlogs, "#search_blogs");
            template_engine('.search-single-event', filteredEvents, "#search_events");
        })
    },
    filterForSearch:{
        members: async function (){
            let blank_array = [];
            let searchTerm = $("#search_input").val().toLowerCase();
            network.searchStorage.members.forEach((member)=>{
                if(member.fname.toLowerCase().includes(searchTerm) || member.lname.toLowerCase().includes(searchTerm) || member.organisation_name.toLowerCase().includes(searchTerm) || member.description.toLowerCase().includes(searchTerm) || member.about.toLowerCase().includes(searchTerm) || member.organisation_name.toLowerCase().includes(searchTerm) || member.organisation_name.toLowerCase().includes(searchTerm)){
                    blank_array.push(member);
                }
            })
            return blank_array;
        },
        blogs: async function (){
            let blank_array = [];
            let searchTerm = $("#search_input").val();
            network.searchStorage.blogs.forEach((member)=>{
                if(member.fname.toLowerCase().includes(searchTerm) || member.lname.toLowerCase().includes(searchTerm) || member.title.toLowerCase().includes(searchTerm) || member.blog_text.toLowerCase().includes(searchTerm) || member.excerpt.toLowerCase().includes(searchTerm)){
                    blank_array.push(member);
                }
            })
            return blank_array;
        },
        events: async function (){
            let blank_array = [];
            let searchTerm = $("#search_input").val();
            network.searchStorage.events.forEach((member)=>{
                if(member.fname.toLowerCase().includes(searchTerm) || member.lname.toLowerCase().includes(searchTerm) || member.event_title.toLowerCase().includes(searchTerm) || member.event_description.toLowerCase().includes(searchTerm)){
                    blank_array.push(member);
                }
            })
            return blank_array;
        }
    },
    readSearch: function () {
        return new Promise((resolve, reject)=>{
            if(!this.searchStorage){
                xhttp.get("search").then((response)=>{
                    network.searchStorage = response;
                    resolve();
                })
            }else{
                resolve();
            }
        })
    },
    load: async function() {
        return new Promise((resolve, reject)=>{
            xhttp.get('network').then((response)=>{
                this.data = response;
                this.data.friends = [];
                this.data.connections.forEach((connect)=>{
                    let id = auth.memberData.personal.id;
                    if(connect.requested_by == id){
                        let friend = this.data.member.filter(x => x.id == connect.requested_to)[0]
                        this.data.friends.push({
                            id    : friend.id,
                            fname : friend.fname,
                            lname : friend.lname,
                            photo : friend.photo,
                            organisation: friend.organisation_name,
                            position: friend.position,
                            status: connect.status,
                            verboseStatus: connect.status == "1" ? 'alreadyFriends' : "requestSent"
                        })
                    }else if(connect.requested_to == id){
                        let friend = this.data.member.filter(x => x.id == connect.requested_by)[0]
                        this.data.friends.push({
                            id    : friend.id,
                            fname : friend.fname,
                            lname : friend.lname,
                            photo : friend.photo,
                            organisation: friend.organisation_name,
                            position: friend.position,
                            status: connect.status,
                            verboseStatus: connect.status == "1" ? 'alreadyFriends' : connect.status == "0" ? "newConnection": "ignoredRequest"
                        })
                    }
                });
                resolve();
            })
        })
    },
    read: function () {
        return new Promise((resolve, reject)=>{
            if(this.data){
                resolve(this.data);
            }else{
                this.load().then(()=>{
                    resolve(this.data);
                })
            }
        })
    },
    populate: function () {
        $('.left-menu-single-item').removeClass('active');
        if(path.parts[1] == "timeline" || !path.parts[1]){
            $(`.left-menu-single-item[linked-to="timeline"]`).addClass('active');
        }else if(path.parts[1] == "groups"){
            $(`.left-menu-single-item[linked-to="groups"]`).addClass('active');
        }else if(path.parts[1] == "friends"){
            $(`.left-menu-single-item[linked-to="friends"]`).addClass('active');
        }else if(path.parts[1] == "praise"){
            $(`.left-menu-single-item[linked-to="praise"]`).addClass('active');
        }
        $(`.right-menu-single-item:not([linked-to="network"])`).slideUp();
        $(`.right-menu-single-item[linked-to="network"]`).slideDown();
        if(path.parts[1] == "groups"){
            network.groups.show();
            return false;
        }
        $(".network-header .col-sm-6").html('');
        this.read().then(()=>{
            $(".feed-home-friends .container").empty();
            $("#network-friends .container:eq(1)").empty();
            $("#network-friends .container:eq(2)").empty();
            $("#network-friends .container:eq(3)").empty();
            $("#youHaveSentAnInvite").hide();
            $("#youAreFriends").hide();
            $("#connectwith").hide();
            $("#hasSendYouAnInvite").hide();
            $("#network-gallery .container").empty();
            $("#network-recommendation .recommendations-wrapper").empty();
            $(".friend-recommendation-wrapper").empty();
            let currentView = "home";
            if(path.parts[1] && path.parts[1] == 'my-feed'){
                route(`network/${auth.memberData.personal.id}`);
                return false;
            }
            if(!path.parts[1]){
                $(".new-post-block").show();
                $(".feed-home-friends .button").attr(`onclick`,`route('network/friends')`);
                $(".feed-home-photos .button").attr(`onclick`,`route('network/gallery')`);
                $(".feed-friend-recommendations").hide();
                $(".feed-home-events").show();

                $(".network-header .col-sm-6").html(`
                    <a href="Javascript:void(0)" onclick="route('network/profile');return false"><span><i class="fa-regular fa-id-badge"></i></span>Profile</a>
                    <a href="Javascript:void(0)" onclick="route('network/friends');return false"><span><i class="fa-regular fa-handshake"></i></span>Friends</a>
                    <a href="Javascript:void(0)" onclick="route('network/recommendations');return false"><span><i class="fa-solid fa-hand-holding-heart"></i></span>Praise</a>
                    <a href="Javascript:void(0)" onclick="route('network/gallery');return false"><span><i class="fa-regular fa-images"></i></span>Gallery</a>
                `);
                $('.network-header img').attr('onclick',`route('network/${auth.memberData.personal.id}')`);
            }
            if(['friends','gallery','profile','recommendations'].includes(path.parts[1])){
                $(".network-header .col-sm-6").html(`
                    <a href="Javascript:void(0)" onclick="route('network/profile');return false"><span><i class="fa-regular fa-id-badge"></i></span>Profile</a>
                    <a href="Javascript:void(0)" onclick="route('network/friends');return false"><span><i class="fa-regular fa-handshake"></i></span>Friends</a>
                    <a href="Javascript:void(0)" onclick="route('network/recommendations');return false"><span><i class="fa-solid fa-hand-holding-heart"></i></span>Praise</a>
                    <a href="Javascript:void(0)" onclick="route('network/gallery');return false"><span><i class="fa-regular fa-images"></i></span>Gallery</a>
                `);
                $('.network-header img').attr('onclick',`route('network/${auth.memberData.personal.id}')`);
            }
            if(Number(path.parts[1]) == path.parts[1]){
                if(Number(path.parts[1])  == '0'){
                    route('network');
                    return false;
                }
                if(path.parts[2]){
                    currentView = path.parts[2];
                }
                if(path.parts[1] == auth.memberData.personal.id){
                    $(".new-post-block").show();
                    $(".feed-home-friends .button").attr(`onclick`,`route('network/friends')`);
                    $(".feed-home-photos .button").attr(`onclick`,`route('network/gallery')`);
                    $(".feed-friend-recommendations").show();
                    $(".feed-home-events").hide();
                    $(".statuswithProfile").hide();
                    $(".feed-friend-recommendations .button").hide();
                    $(".network-header .col-sm-6").html(`
                        <a href="Javascript:void(0)" onclick="route('network/profile');return false"><span><i class="fa-regular fa-id-badge"></i></span>Profile</a>
                        <a href="Javascript:void(0)" onclick="route('network/friends');return false"><span><i class="fa-regular fa-handshake"></i></span>Friends</a>
                        <a href="Javascript:void(0)" onclick="route('network/recommendations');return false"><span><i class="fa-solid fa-hand-holding-heart"></i></span>Praise</a>
                        <a href="Javascript:void(0)" onclick="route('network/gallery');return false"><span><i class="fa-regular fa-images"></i></span>Gallery</a>
                    `);
                    $('.network-header img').attr('onclick',`route('network/${auth.memberData.personal.id}')`);
                }else{
                    $(".new-post-block").hide();
                    $(".feed-home-friends .button").attr(`onclick`,`route('network/${path.parts[1]}/friends')`);
                    $(".feed-home-photos .button").attr(`onclick`,`route('network/${path.parts[1]}/gallery')`);
                    $(".feed-friend-recommendations").show();
                    $(".feed-home-events").hide();
                    $(".statuswithProfile").show();
                    $(".feed-friend-recommendations .button").show();
                    $(".network-header .col-sm-6").html(`
                        <a href="Javascript:void(0)" onclick="route('network/${path.parts[1]}/profile');return false"><span><i class="fa-regular fa-id-badge"></i></span>Profile</a>
                        <a href="Javascript:void(0)" onclick="route('network/${path.parts[1]}/friends');return false"><span><i class="fa-regular fa-handshake"></i></span>Friends</a>
                        <a href="Javascript:void(0)" onclick="route('network/${path.parts[1]}/recommendations');return false"><span><i class="fa-solid fa-hand-holding-heart"></i></span>Praise</a>
                        <a href="Javascript:void(0)" onclick="route('network/${path.parts[1]}/gallery');return false"><span><i class="fa-regular fa-images"></i></span>Gallery</a>
                    `);
                    $('.network-header img').attr('onclick',`route('network/${path.parts[1]}')`);
                }
                $("#writearecommendation").show();
                let member = this.data.member.filter(x => x.id == path.parts[1])[0];
                xhttp.get('anotherMember', {id: member.id}).then((response)=>{
                    
                    /* Actions related to connecting and messaging other members */
                    $("#connectwith .button:eq(0)").attr('onclick',`network.friendRequest.send('${member.id}')`);
                    $("#connectwith .button:eq(1)").attr('onclick',`chat.init('${member.id}')`);
                    $("#youHaveSentAnInvite .button:eq(0)").attr('onclick',`chat.init('${member.id}')`);
                    $("#youHaveSentAnInvite .button:eq(1)").attr('onclick',`network.friendRequest.cancel('${member.id}','2')`);
                    $("#youAreFriends .button:eq(0)").attr('onclick',`chat.init('${member.id}')`);
                    $("#youAreFriends .button:eq(1)").attr('onclick',`network.friendRequest.cancel('${member.id}','2')`);
                    $("#hasSendYouAnInvite .button:eq(0)").attr('onclick',`network.friendRequest.update('${member.id}','1')`);
                    $("#hasSendYouAnInvite .button:eq(1)").attr('onclick',`chat.init('${member.id}','1')`);
                    $("#hasSendYouAnInvite .button:eq(2)").attr('onclick',`network.friendRequest.update('${member.id}','2')`);

                    response.friends = [];
                    response.connections.forEach((connect)=>{
                        let id = member.id;
                        if(connect.requested_by == id){
                            let friend = network.data.member.filter(x => x.id == connect.requested_to)[0]
                            response.friends.push({
                                id    : friend.id,
                                fname : friend.fname,
                                lname : friend.lname,
                                photo : friend.photo,
                                organisation: friend.organisation_name,
                                position: friend.position,
                                status: connect.status,
                                verboseStatus: connect.status == "1" ? 'alreadyFriends' : connect.status == "0" ? "newConnection": "ignoredRequest"
                                
                            })
                        }else if(connect.requested_to == id){
                            let friend = network.data.member.filter(x => x.id == connect.requested_by)[0]
                            response.friends.push({
                                id    : friend.id,
                                fname : friend.fname,
                                lname : friend.lname,
                                photo : friend.photo,
                                organisation: friend.organisation_name,
                                position: friend.position,
                                status: connect.status,
                                verboseStatus: connect.status == "1" ? 'alreadyFriends' : "requestSent"
                            })
                        }
                    });
                    template_engine(`.home-friends-thumbnail`,response.friends.slice(0,8), "#feed-home-friends");
                    template_engine('.home-photos-thumbnail',response.photos.slice(0,8),".feed-home-photos .container");  
                    template_engine('.single-recommendation-container', response.praise.map((x) => {return {... x, ... {excerpt: x.praise.length > 150 ? x.praise.slice(0, 150)+' . . .': x.praise}}}), ".friend-recommendation-wrapper");
                    $(".feed-home-about h3").text(member.fname + ' ' + member.lname);
                    $(".feed-home-about p:eq(0)").html(member.about);
                    $(".feed-home-about p:eq(1)").html(response.personal.club);
                    $(".feed-home-about p:eq(2)").html(response.professional.position + ', ' + response.professional.organisation_name);
                    $(".feed-home-about p:eq(3)").html(response.professional.description);
                    if(member.photo){
                        $(".network_photo").attr('src',`/service/build/${member.photo}`);
                    }else{
                        $(".network_photo").attr('src','https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541');
                    }
                    $("#youHaveSentAnInvite tag").text(member.fname + ' ' + member.lname);
                    $("#youAreFriends tag").text(member.fname + ' ' + member.lname);
                    $("#connectwith tag").text(member.fname + ' ' + member.lname);
                    $("#hasSendYouAnInvite tag").text(member.fname + ' ' + member.lname);
                    $(".currentFriend").text(member.fname + ' ' + member.lname);
                    if(response.friends.map(x => x.id).includes(auth.memberData.personal.id)){
                        if(response.friends.filter(x => x.id == auth.memberData.personal.id)[0].status == '1'){
                            $("#youAreFriends").show();
                        }else if(response.friends.filter(x => x.id == auth.memberData.personal.id)[0].verboseStatus == "newConnection"){
                            $("#hasSendYouAnInvite").show();
                        }else{
                            $("#youHaveSentAnInvite").show();
                        }
                    }else{
                        $("#connectwith").show();
                    }
                    template_engine('.singleOtherFriendWrapper', response.friends.filter(x => x.verboseStatus == "newConnection")).then((response)=>{$("#network-friends .container:eq(1)").append(response)})
                    template_engine('.singleOtherFriendWrapper',response.friends.filter(x => x.verboseStatus == "alreadyFriends" || x.verboseStatus == "requestSent")).then((response)=>{$("#network-friends .container:eq(2)").append(response)})
                    template_engine('.singleOtherFriendWrapper', response.friends.filter(x => x.verboseStatus == "ignoredRequest")).then((response)=>{$("#network-friends .container:eq(3)").append(response)})
                    this.getFeed(member.id);
                    template_engine(".singlemyGalleryPhotoWrapper", response.photos, "#network-gallery .container");
                    template_engine(".singleRecommendation", response.praise, "#network-recommendation .recommendations-wrapper");
                    network.currentFriend = response;
                })         
            }else{
                $("#writearecommendation").hide();
                $(".new-post-block").show();
                $(".feed-home-about h3").text(auth.memberData.personal.fname + ' ' + auth.memberData.personal.lname);
                $(".feed-home-about p:eq(0)").html(auth.memberData.personal.about);
                $(".feed-home-about p:eq(1)").html(auth.memberData.personal.club);
                $(".feed-home-about p:eq(2)").html(auth.memberData.professional.position + ', ' + auth.memberData.professional.organisation_name);
                $(".feed-home-about p:eq(3)").html(auth.memberData.professional.description);
                $(".network_photo").attr('src',`${auth.memberData.personal.photo ? `/service/build/${auth.memberData.personal.photo}`: `https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541`}`);
                template_engine(`.home-friends-thumbnail`,this.data.friends.slice(0,8), "#feed-home-friends");
                template_engine('.home-photos-thumbnail',this.data.photos.slice(0,8),".feed-home-photos .container");
                template_engine('.singleMyFriendWrapper', this.data.friends.filter(x => x.verboseStatus == "newConnection")).then((response)=>{$("#network-friends .container:eq(1)").append(response)})
                template_engine('.singleMyFriendWrapper',network.data.friends.filter(x => x.verboseStatus == "alreadyFriends" || x.verboseStatus == "requestSent")).then((response)=>{$("#network-friends .container:eq(2)").append(response)})
                template_engine('.singleMyFriendWrapper', this.data.friends.filter(x => x.verboseStatus == "ignoredRequest")).then((response)=>{$("#network-friends .container:eq(3)").append(response)});
                template_engine(".singlemyGalleryPhotoWrapper", this.data.photos, "#network-gallery .container");
                template_engine(".singleRecommendation", this.data.praise, "#network-recommendation .recommendations-wrapper");
                this.getFeed();
                network.currentFriend = null;
                if(path.parts[1]){
                    currentView = path.parts[1];
                }
                $(".currentFriend").text('');
                /* $(".network-header a:eq(1)").attr('onclick',`route('account/network/praise`);
                $(".network-header a:eq(2)").attr('onclick',`route('account/network/friends`);
                $(".network-header a:eq(3)").attr('onclick',`route('account/network/gallery`); */
            }
            $("#network-home").hide();
            $("#network-friends").hide();
            $("#network-gallery").hide();
            $("#network-recommendation").hide();
            $("#network-groups").hide();
            if(currentView == "home"){
                $("#network-home").show();
            }else if(currentView == "friends"){
                $("#network-friends").show();
            }else if(currentView == "gallery"){
                $("#network-gallery").show();
            }else if(currentView == "profile"){
                $("#network-profile").show();
            }else{
                $("#network-recommendation").show();
            }
            console.log(currentView);
        })
    },
    savePost: function () {
        let error = false;

        let payload= {
            post_body: $("#newPostBody").val() || (error = true, showsnackbar('Please add Post Body')),
            image    : $("#newPostBody").attr('image') || 'NA'
        }

        if(error){
            return false;
        }

        xhttp.post('post', payload).then((response)=>{
            if(response.status == "success"){
                showsnackbar('Post added successfully');
                $("#newPostBody").val('');
                /* template_engine(".old-post-block-post",
                {...payload, 
                    ...{post_id:response.id,
                        member_id: auth.memberData.personal.id,
                        fname: auth.memberData.personal.fname,lname: auth.memberData.personal.lname,
                        photo: auth.memberData.personal.photo,
                        club: auth.memberData.personal.club,
                        date: "Just Now"
                    }
                }, 
                '.old-post-archive', {position:"pre"}); */
                network.load().then(()=>{
                    network.populate();
                });
                $(".postWithPhoto").hide();
            }else{
                showsnackbar('Something went wrong. Please try again');
                console.log(response);
            }
        })
    },
    getFeed: function (id) {
        xhttp.get('posts', {id: id}).then((response)=>{
            $(".old-post-archive").empty();
            let myposts = 0;
            post.archive = response;
            response.forEach((post)=>{
                post.date = (new Date(Number(post.posted_on*1000))).toString().slice(4,21);
                if(post.member_id == auth.memberData.personal.id){
                    myposts++;
                }
            });
            if(Number(path.parts[1])==path.parts[1]){
                $(".network-header p:eq(0)").html(`${network.currentFriend.connections.length}<span>FRIEND${network.currentFriend.connections.length != 1 ? 'S': ''}</span>`);
                $(".network-header p:eq(1)").html(`${post.archive.length}<span>POST${post.archive.length != 1 ? 'S': ''}</span>`);
            }else{
                $(".network-header p:eq(0)").html(`${this.data.connections.length}<span>FRIEND${this.data.connections.length != 1 ? 'S': ''}</span>`);
                $(".network-header p:eq(1)").html(`${myposts}<span>POST${myposts.length != 1 ? 'S': ''}</span>`);
            }
            post.Feeds(response);
            /* template_engine(".old-post-block-post", response, ".old-post-archive").then(()=>{
                template_engine(".old-post-block-advertisement",
                {       
                    post_id:0,
                    member_id: 1,
                    fname: '<i class="fa-solid fa-rectangle-ad"></i>',
                    lname:'',
                    post_body:`<img src="/src/images/167636361_447013189686322_6957198482510841544_n.jpg" style="width:100%>`,
                    photo: 'https://rmb6970.org/wp-content/uploads/2018/09/cropped-RMB-Logo-5.jpg',
                    club: '',
                    date: "Just Now"
                    
                }, 
                '.old-post-archive', {position:"pre"});
            });
            post.checkLikes(); */
        })
    },
    withPhoto: function () {
        $(".postWithPhoto").show();
        $(".postWithPhoto").html(`
            <div class="dropzone dropzone_square smalltools" id="withPostPhotoCrop"
                data-width="1080"
                data-height="720"
                data-url="/service/myAdPhoto"
                style="width: 100%;aspect-ratio:1.5;display:block;margin:auto;">
                    <input type="file" accept=".png, .jpg, .jpeg" name="thumb" />
            </div>`
        );

        $('#withPostPhotoCrop').html5imageupload({
            onAfterProcessImage: function(x) {
                $("#newPostBody").attr('image', ImageUploadedResponse.filename);
            },
            onAfterCancel: function() {
                $('#filename').val('');
                $("#newPostBody").attr('image', null);
            }
        });  
        $(".new-post-block .button:eq(0) p").text('Cancel Photo');
        $(".new-post-block .button:eq(0)").attr('onclick','network.cancelPhoto()');
    },
    cancelPhoto: function () {
        $(".postWithPhoto").hide();
        $(".postWithPhoto").html('');
        $(".new-post-block .button:eq(0) p").html('<i class="fa-solid fa-panorama"></i> Photo');
        $(".new-post-block .button:eq(0)").attr('onclick','network.withPhoto()');
    },
    withPhotoinGroup: function () {
        $(".GroupPostWithPhoto").show();
        $(".GroupPostWithPhoto").html(`
            <div class="dropzone dropzone_square smalltools" id="withPostPhotoCropGroup"
                data-width="1080"
                data-height="720"
                data-url="/service/myAdPhoto"
                style="width: 100%;aspect-ratio:1.5;display:block;margin:auto;">
                    <input type="file" accept=".png, .jpg, .jpeg" name="thumb" />
            </div>`
        );

        $('#withPostPhotoCropGroup').html5imageupload({
            onAfterProcessImage: function(x) {
                $("#newPostBodywithGroup").attr('image', ImageUploadedResponse.filename);
            },
            onAfterCancel: function() {
                $('#filename').val('');
                $("#newPostBodywithGroup").attr('image', null);
            }
        });  
        $(".GroupPostWithPhoto1 .button:eq(0) p").text('Cancel Photo');
        $(".GroupPostWithPhoto1 .button:eq(0)").attr('onclick','network.cancelPhoto()');
    },
    cancelPhotoinGroup: function () {
        $(".GroupPostWithPhoto").hide();
        $(".GroupPostWithPhoto").html('');
        $(".GroupPostWithPhoto1 .button:eq(0) p").text('Add Photo');
        $(".GroupPostWithPhoto1 .button:eq(0)").attr('onclick','network.withPhoto()');
    },
    savePostGroup: function () {
        let error = false;

        let payload= {
            post_body: $("#newPostBodyGroup").val() || (error = true, showsnackbar('Please add Post Body')),
            image    : $("#newPostBodywithGroup").attr('image') || 'NA',
            group_id : path.parts[2]
        }

        if(error){
            return false;
        }

        xhttp.post('groupPost', payload).then((response)=>{
            if(response.status == "success"){
                showsnackbar('Post added successfully');
                $("#newPostBody").val('');
                network.load().then(()=>{
                    network.populate();
                });
                $(".postWithPhoto").hide();
            }else{
                showsnackbar('Something went wrong. Please try again');
                console.log(response);
            }
        })
    },
    friendRequest: {
        send: function (id) {
            xhttp.post('connection',{id: id}).then((response)=>{
                network.load().then(()=>{
                    network.populate();
                    xhttp.post('chat',{id: id}).then((response)=>{
                        xhttp.post('chatMessage',{
                            chat_id: response,
                            message: `Hello, I would like to connect with you`
                        })
                    });
                })
            })
        },
        update: function (id, status) {
            if(status == '2'){
                this.cancel(id);
            }else{
                xhttp.put('connection',{id: id, status: status}).then((response)=>{
                    network.load().then(()=>{
                        network.populate();
                    })
                })
            }
        },
        cancel: function (id, status) {
            xhttp.delete('connection',{id: id, status: status}).then((response)=>{
                network.load().then(()=>{
                    network.populate();
                })
            })
        }
    },
    groups: {
        toggleContactPreference: function () {
            xhttp.put('groupPreference',{
                preference: $("#toggle_group_contact_preference").is(":checked") ? 'yes' : 'no',
                groupID: network.groups.currentGroup.id
            }).then(()=>{
                showsnackbar('Preference updated');
            })
        },
        leave: function (id) {
            xhttp.delete('groupjoin',{id: id}).then(()=>{
                network.load().then(()=>{
                    network.populate();
                })
            })
        },
        remove: function (id) {
            xhttp.delete('groupjoinreject',{id: id, group_id: path.parts[2]}).then(()=>{
                network.load().then(()=>{
                    network.populate();
                })
            })
        },
        accept: function (id) {
            xhttp.put('groupjoin',{id: id}).then(()=>{
                network.load().then(()=>{
                    network.populate();
                })
            })
        },
        acceptmember: function (id) {
            xhttp.put('groupjoinaccept',{id: id, group_id: path.parts[2]}).then(()=>{
                network.load().then(()=>{
                    network.populate();
                })
            })
        },
        join: function (id) {
            xhttp.post('groupjoin',{id: id}).then(()=>{
                network.load().then(()=>{
                    network.populate();
                })
            })
        },
        create: function(){
            let error = false;
            let payload = {
                name: $("#newGroupName").val() || (error = true, showsnackbar('Please Provide a Group Name')),
                description: $("#newGroupDescription").val() || (error = true, showsnackbar('Please Provide a Group Description')),
                privacy: $(`[name="newgroupprivacy"]:checked`).val(),
                membership: $(`[name="newGroupMembershipPolicy"]`).val(),
                admin: $("#adminsNewGroup").val(),
                invitations: $("#sendinvitationsNewGroup").val(),
                logo: $("#new_group_photo").attr('data-img') || 'N.A.'
            }
            if(error) {
                return false;
            }

            xhttp.post('group', payload).then((response)=>{
                if(response){
                    route('network/groups/'+response);
                }
            })
        },
        update: function () {
            let error = false;
            let payload = {
                id: path.parts[2],
                name: $("#updateGroupName").val() || (error = true, showsnackbar('Please Provide a Group Name')),
                description: $("#updateGroupDescription").val() || (error = true, showsnackbar('Please Provide a Group Description')),
                privacy: $(`[name="updategroupprivacy"]:checked`).val(),
                membership: $(`[name="updateGroupMembershipPolicy"]:checked`).val(),
                admin: $("#adminsUpdateGroup").val()
            }
            if(error) {
                return false;
            }

            xhttp.put('group', payload).then((response)=>{
                if(response){
                    showsnackbar('Group Information updated');
                    network.load().then(()=>{
                        network.populate();
                    })
                }
            })
        },
        edit: function (group) {
            $("#adminsNewGroup").empty();
            $("#sendinvitationsNewGroup").empty();
            $(".edit-group").attr('photo', null);
            $("#edit_group_photo").attr('data-img',null);

            $("#updateGroupName").val(group.name);
            $("#updateGroupDescription").val(group.description);

            $(`[value="${group.privacy}"`).prop('checked',true);
            $(`[value="${group.membership}"`).prop('checked',true);

            let selectData = network.data.member.filter(x => x.id != auth.memberData.personal.id).map((x) => {
                return {
                    id: x.id,
                    dropdownTemplate: `<div class="select-members-option container w-full p-0">
                                <div class="col-xs-3">
                                    <img src="${x.photo ? `/service/build/${x.photo}`: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541'}">
                                </div>
                                <div class="col-xs-9">
                                    <h5>${x.fname} ${x.lname}</h5>
                                    <h6>${x.club}</h6>
                                </div>
                            </div>`,
                    text: `${x.fname} ${x.lname}`
                }
            })
            $("#adminsUpdateGroup").select2({
                data: selectData,
                templateResult: function (d) { return $(d.dropdownTemplate)},
                templateSelection: function (d) { return $(d.dropdownTemplate)}
            });
            setTimeout(() => {
                $("#adminsUpdateGroup").val(group.admins.filter(x => x.id != auth.memberData.personal.id).map(x => x.id)).trigger('change');
            }, 500);
            $('.network-header .col-sm-6').empty();
            $('.network-header .col-sm-3 p').empty();
            $(".edit-group .col-sm-4").html(`<div class="dropzone_profile dropzone dropzone_square smalltools" data-image="${group.group_logo ? `/assets/group_logo/${group.group_logo}`:null}" id="edit_group_photo" data-width="1080" data-height="1080" data-url="/service/new_group_photo?group_id=${path.parts[2]}" style="max-width:100%;width: 100%;aspect-ratio:1"><input type="file" accept=".png, .jpg, .jpeg" name="thumb" /></div>`);
            $('#edit_group_photo').html5imageupload({
                onAfterProcessImage: function(x) {
                    $("#edit_group_photo").attr('data-img',ImageUploadedResponse.filename);
                    $(".edit-group").attr('photo', ImageUploadedResponse.filename);
                    xhttp.put('group_logo',{filename: ImageUploadedResponse.filename, group_id: path.parts[2]});
                },
                onAfterCancel: function() {
                    $('#filename').val('');
                }
            });
            $(".network-view").hide();
            $(".edit-group").show();
        },
        new: function(){
            $("#adminsNewGroup").empty();
            $("#sendinvitationsNewGroup").empty();
            $(".add-edit-group").attr('photo', null);
            $("#new_group_photo").attr('data-img',null);
            /* network.data.member.forEach((member)=>{
                $("#adminsNewGroup").append(`<option value="${member.id}">${member.fname} ${member.lname}</option>`);
                $("#sendinvitationsNewGroup").append(`<option value="${member.id}">${member.fname} ${member.lname}</option>`);
            }); */

            let selectData = network.data.member.filter(x => x.id != auth.memberData.personal.id).map((x) => {
                return {
                    id: x.id,
                    dropdownTemplate: `<div class="select-members-option container w-full p-0">
                                <div class="col-xs-3">
                                    <img src="${x.photo ? `/service/build/${x.photo}`: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541'}">
                                </div>
                                <div class="col-xs-9">
                                    <h5>${x.fname} ${x.lname}</h5>
                                    <h6>${x.club}</h6>
                                </div>
                            </div>`,
                    text: `${x.fname} ${x.lname}`
                }
            })
            $("#adminsNewGroup").select2({
                data: selectData,
                templateResult: function (d) { return $(d.dropdownTemplate); }/* ,
                templateSelection: function (d) { return $(d.textSelection); }, */
            });
            $("#sendinvitationsNewGroup").select2({
                data: selectData,
                templateResult: function (d) { return $(d.dropdownTemplate); }/* ,
                templateSelection: function (d) { return $(d.textSelection); }, */
            });
            $('.network-header .col-sm-6').empty();
            $('.network-header .col-sm-3 p').empty();
            $(".add-edit-group .col-sm-4").html(`<div class="dropzone_profile dropzone dropzone_square smalltools" id="new_group_photo"  data-width="1080" data-height="1080" data-url="/service/new_group_photo" style="max-width:100%;width: 100%;aspect-ratio:1"><input type="file" accept=".png, .jpg, .jpeg" name="thumb" /></div>`);
            $('#new_group_photo').html5imageupload({
                onAfterProcessImage: function(x) {
                    $("#new_group_photo").attr('data-img',ImageUploadedResponse.filename);
                    $(".add-edit-group").attr('photo', ImageUploadedResponse.filename);
                    /* member.image.newImageUploaded(); */
                },
                onAfterCancel: function() {
                    $('#filename').val('');
                }
            });
            $(".network-view").hide();
            $(".add-edit-group").show();
        },
        show: function () {
            $('.network-profile').hide();
            $(".network-groups").show();
            $(".feed-home-about h3").text(auth.memberData.personal.fname + ' ' + auth.memberData.personal.lname);
            $(".feed-home-about p:eq(0)").html(auth.memberData.personal.about);
            $(".feed-home-about p:eq(1)").html(auth.memberData.personal.club);
            $(".feed-home-about p:eq(2)").html(auth.memberData.professional.position + ', ' + auth.memberData.professional.organisation_name);
            $(".feed-home-about p:eq(3)").html(auth.memberData.professional.description);

            $('.network-header .col-sm-3 p').html('');
            $(".network-header .col-sm-6").html(`
                <a href="Javascript:void(0)" style="float:right" onclick="route('network/groups/new');return false"><span><i class="fa-solid fa-plus"></i></span>Create Group</a>
            `);

            if(auth.memberData.personal.photo){
                $(".network_photo").attr('src',`/service/build/${auth.memberData.personal.photo}`);
            }else{
                $(".network_photo").attr('src','https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541');
            }

            if(path.parts[2] && Number(path.parts[2]) == path.parts[2]){
                
                network.groups.showsingleGroup();
                return false;
            }else if (path.parts[2] == "new"){
                network.groups.new();
                return false;
            }
            /* auth.memberData.groups */ 
            let tempGroup = network.data.groups.map((x) => {return {... x , ... {group_logo : x.group_logo ? `/assets/group_logo/${x.group_logo}`:'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541'}}});
            
            $(".single-group-list-view-container .my-groups-list-single-container").remove();
            template_engine('.my-groups-list-single-container', tempGroup, '.single-group-list-view-container').then(()=>{
                network.data.mygroups.forEach((x)=>{
                    $(`.my-groups-list-single-container[group-id="${x.group_id}"]`).addClass('isAdminForGroup');
                })
            });

            $(".network-view").hide();
            $(".network-list").show();
        },
        showsingleGroup: function () {
            xhttp.get('group',{id: path.parts[2]}).then((response)=>{
                network.groups.currentGroup = response;
                if(path.parts[3] == "edit"){
                    network.groups.edit(response);
                }else{
                    network.groups.populateSingleGroup();
                }
            })
        },
        populateSingleGroup: function () {
            $(".single-group-view").removeClass('isAdminForGroup');
            $(".network-view").hide();
            $(".single-group-view").show();
            $(".single-group-view .feed-home-about h3").text(network.groups.currentGroup.name);
            $(".single-group-view .feed-home-about p:eq(0)").text(network.groups.currentGroup.description);
            $("#mygrouppreference").remove();
            if(auth.memberData.groups.filter(x => x.id == network.groups.currentGroup.id)[0]){
            $('.single-group-view .feed-home-about').append(`<div id="mygrouppreference" class="container w-full" style="margin-top:20px;">
                            <div style="width:60px;margin-left:5px;float: left;">
                                <div class="toggle-wrapper toggle-wrapper">
                                    <input id="toggle_group_contact_preference" onchange="network.groups.toggleContactPreference()" type="checkbox" ${auth.memberData.groups.filter(x => x.id == network.groups.currentGroup.id)[0]?.preferences == 'yes'?'checked':null}>
                                    <label class="toggle" for="toggle_group_contact_preference">
                                        <span class="toggle--handler" onclick="network.groups.toggleContactPreference()"></span>
                                    </label>
                                </div>
                            </div>
                            <p style="display: inline-block;font-size: 18px;margin-bottom:0;cursor: pointer" onclick="$(this).parent().find('.toggle--handler').click()">Get Email Updates</p>
                        </div>`);
            }
            
            $(".network-header p:eq(0)").html(`${network.groups.currentGroup.members.length}<span>MEMBER${network.groups.currentGroup.members.length != 1 ? 'S': ''}</span>`);
            $(".network-header p:eq(1)").html(`${network.groups.currentGroup.posts.length}<span>POST${network.groups.currentGroup.posts.length != 1 ? 'S': ''}</span>`);
            $(".network_photo").attr('src',`${network.groups.currentGroup.group_logo? `/assets/group_logo/${network.groups.currentGroup.group_logo}`: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541'}`);
            
            if(network.groups.currentGroup.privacy == "private" ){
                if(network.data.groups.filter(x => (x.id==path.parts[2] && x.member_group_status=="2")).length){
                    post.Feeds(network.groups.currentGroup.posts);
                }else{
                    $("account .old-post-block-post").remove();
                    $('.network-group-posts').html('<h4>This group is private</h4>');
                    $('.network-timeline-posts').html('<h4>This group is private</h4>');
                }
            }else{
                post.Feeds(network.groups.currentGroup.posts);
            }
            $(".single-group-view").attr('member_group_status', '');
            let ismemberstatus = false;
            network.groups.currentGroup.members.forEach((member)=>{
                if(member.member_id == auth.memberData.personal.id){
                    $(".single-group-view").attr('member_group_status', member.group_member_status);
                    ismemberstatus = true;
                }
            })
            if(!ismemberstatus){
                $(".single-group-view").attr('member_group_status', '3');
            }
            
            $(".network-header .col-sm-6").html(`
                <a href="Javascript:void(0)" onclick="route('network/groups/${network.groups.currentGroup.id}');return false"><span><i class="fa-solid fa-house-signal"></i></span>Group Home</a>
                <a href="Javascript:void(0)" onclick="route('network/groups/${network.groups.currentGroup.id}/members');return false"><span><i class="fa-solid fa-people-group"></i></span>Members</a>
                <a href="Javascript:void(0)" onclick="route('network/groups/new');return false"><span><i class="fa-solid fa-plus"></i></span>Create Group</a>
            `);
            network.groups.currentGroup.admins.forEach((member)=>{
                if(member.member_id == auth.memberData.personal.id){
                    $(".single-group-view").addClass('isAdminForGroup');
                    $(".network-header .col-sm-6").html(`
                        <a href="Javascript:void(0)" onclick="route('network/groups/${network.groups.currentGroup.id}');return false"><span><i class="fa-solid fa-house-signal"></i></span>Group Home</a>
                        <a href="Javascript:void(0)" onclick="route('network/groups/${network.groups.currentGroup.id}/members');return false"><span><i class="fa-solid fa-people-group"></i></span>Members</a>
                        <a href="Javascript:void(0)" onclick="route('network/groups/${network.groups.currentGroup.id}/edit');return false"><span><i class="fa-solid fa-pen-to-square"></i></span>Edit Group</a>
                        <a href="Javascript:void(0)" onclick="route('network/groups/new');return false"><span><i class="fa-solid fa-plus"></i></span>Create Group</a>
                    `);
                }
            })
            if(path.parts[3] == "members"){
                $(".single-group-view .col-sm-6:eq(0)").hide();
                $(".single-group-view .col-sm-6:eq(1)").show();
                network.groups.populateMembers();
            }else{
                $(".single-group-view .col-sm-6:eq(0)").show();
                $(".single-group-view .col-sm-6:eq(1)").hide();
            }
        },
        populateMembers: function () {
            let x = 0;
            $(".single-group-view .singleMyMemberWrapper").remove();
            network.groups.currentGroup.members.filter(x => x.group_member_status == "0").forEach((x)=>{
                //invited
                template_engine('.singleMyMemberWrapper',x,).then((response)=>{
                    $(".single-group-view .col-sm-6:eq(1)").append(response);
                });
            })
            network.groups.currentGroup.members.filter(x => x.group_member_status == "1").forEach((x)=>{
                //AskedToJoin
                template_engine('.singleMyMemberWrapper',x,).then((response)=>{
                    $(".single-group-view .col-sm-6:eq(1)").append(response);
                });
            })
            network.groups.currentGroup.members.filter(x => x.group_member_status == "2").forEach((x)=>{
                //Already Member
                template_engine('.singleMyMemberWrapper',x,).then((response)=>{
                    $(".single-group-view .col-sm-6:eq(1)").append(response);
                });
            })
        },
        showLikes: function (id) {
            let thispost = network.groups.currentGroup.posts.filter(x => x.id == id)[0];
            $(`.singleFeedPost[post-id="${id}"] .single-post-comments-section`).empty();
            $(`.singleFeedPost[post-id="${id}"] .single-post-comments-section`).html(`
                <div class="likes-container">
                    <h5>${thispost.likes.length} Likes</h5>
                </div>
            `)
            template_engine(".single-like-from-member", thispost.likes, `.singleFeedPost[post-id="${id}"] .single-post-comments-section .likes-container`);
        },
        openComments: function(id){
            let thispost = network.groups.currentGroup.posts.filter(x => x.id == id)[0];
            $(`.singleFeedPost[post-id="${id}"] .single-post-comments-section`).empty();
            template_engine('.single-post-comments-section-template', {photo: auth.memberData.personal.photo}, `.singleFeedPost[post-id="${id}"] .single-post-comments-section`);
            template_engine('.existing-single-comment', thispost.comments, `.singleFeedPost[post-id="${id}"] .existing-comments`);
        }
    }
}

let post = {
    visible:0,
    Feeds: function(x){
        post.data = x;
        $("account .old-post-block-post").remove();
        this.populateFeed(0);
    },
    populateFeed: async function (x) {
        
        scrollObserver.disconnect();
        let parentDiv = (path.parts[1] && path.parts[1] == 'groups') ? 'network-group-posts':'network-timeline-posts';
        /* $('.network-group-posts').html('');
        $('.network-timeline-posts').html(''); */

        if(x == 0){
            /* $("#blog_archive_wrapper").scrollTop(6);
            $("#blog_archive_wrapper").empty(); */
            $('.network-group-posts').html('');
            $('.network-timeline-posts').html('');
            this.visible = 0;
        }
        this.addthese = post.data.slice(this.visible,this.visible+2);
        /* await template_engine('.single_blog_wrapper',this.addthese,'#blog_archive_wrapper'); */
        this.addthese = this.addthese.map((x) => {return {...x, ...{date: (new Date(x.posted_on*1000)).toString().slice(4,21)}}});
        await template_engine(".old-post-block-post", this.addthese,`.${parentDiv}`);
        this.addthese.forEach((post)=>{
            $(`.singleFeedPost[post-id="${post.id}"] .col-xs-8 p`).text(`${post.likes.length} Likes`);
            $(`.singleFeedPost[post-id="${post.id}"] .col-xs-4 p`).text(`${post.comments.length} Comments`);
            $(`.singleFeedPost[post-id="${post.id}"]`).attr('likes-count',post.likes.length);
            $(`.singleFeedPost[post-id="${post.id}"]`).attr('comments-count',post.likes.length);
            let ifUserLikedPost = post.likes.filter(x => x.member_id == auth.memberData.personal.id)[0];
            if(ifUserLikedPost){
                console.log(ifUserLikedPost);
                $(`.singleFeedPost[post-id="${post.id}"]`).addClass('liked');
                $(`.singleFeedPost[post-id="${post.id}"]`).attr('reaction-type', ifUserLikedPost.reaction_type);
            }
        })
        this.visible = $(`.${parentDiv} .old-post-block-post`).length;
        if(this.visible < this.data.length && $(`.${parentDiv} .old-post-block-post`).length){
            setTimeout(()=>{
                scrollObserver.observe($(`.${parentDiv} .old-post-block-post:eq(${this.visible-1})`)[0]);
            },100)
        }
    },
    toggleLike: function (id, reaction) {
        $(`.singleFeedPost[post-id="${id}"] .col-xs-8 p`).text(`0 Likes`);
        if(reaction){
            $(`.singleFeedPost[post-id="${id}"]`).addClass('liked');
            $(`.singleFeedPost[post-id="${id}"]`).attr('reaction-type', reaction);
            xhttp.post('like',{id:id, reaction:reaction}).then(post.updateLikes);
        }else if($(`.singleFeedPost[post-id="${id}"]`).hasClass('liked')){
            $(`.singleFeedPost[post-id="${id}"]`).removeClass('liked');
            xhttp.delete('like',{id:id}).then(post.updateLikes);
        }else{
            $(`.singleFeedPost[post-id="${id}"]`).addClass('liked');
            $(`.singleFeedPost[post-id="${id}"]`).attr('reaction-type', 1);
            xhttp.post('like',{id:id, reaction: 1}).then(post.updateLikes);
        }
    },
    updateLikes:function(data){
        $(`.singleFeedPost[post-id="${data[0]?.post_id}"] .col-xs-8 p`).text(`${data.length} Likes`);
    },
    checkLikes: function () {
        post.archive.forEach((post)=>{
            $(`.singleFeedPost[post-id="${post.id}"] .col-xs-8 p`).text(`${post.likes.length} Likes`);
            $(`.singleFeedPost[post-id="${post.id}"] .col-xs-4 p`).text(`${post.comments.length} Comments`);
            let ifUserLikedPost = post.likes.filter(x => x.member_id == auth.memberData.personal.id)[0];
            if(ifUserLikedPost){
                console.log(ifUserLikedPost);
                $(`.singleFeedPost[post-id="${post.id}"]`).addClass('liked');
                $(`.singleFeedPost[post-id="${post.id}"]`).attr('reaction-type', ifUserLikedPost.reaction_type);
            }
        })
    },
    showLikes: function (id) {
        let thispost = post.archive.filter(x => x.id == id)[0];
        $(`.singleFeedPost[post-id="${id}"] .single-post-comments-section`).empty();
        $(`.singleFeedPost[post-id="${id}"] .single-post-comments-section`).html(`
            <div class="likes-container">
                <h5>${thispost.likes.length} Likes</h5>
            </div>
        `)
        template_engine(".single-like-from-member", thispost.likes, `.singleFeedPost[post-id="${id}"] .single-post-comments-section .likes-container`);
    },
    openComments: async function(id){
        let thispost = post.data.filter(x => x.id == id)[0];
        $(`.singleFeedPost[post-id="${id}"] .single-post-comments-section`).empty();
        template_engine('.single-post-comments-section-template', {photo: auth.memberData.personal.photo, postId: id}, `.singleFeedPost[post-id="${id}"] .single-post-comments-section`);
        template_engine('.existing-single-comment', thispost.comments, `.singleFeedPost[post-id="${id}"] .existing-comments`);
        new EmojiPicker({
            trigger: [
                {
                    selector: `.start-emoji-${id}`,
                    insertInto: `.newcommentbody-${id}` // '.selector' can be used without array
                }
            ],
            closeButton: true,
            //specialButtons: green
        });
    },
    addComment: function (id, comment) {
        if(!id || comment.length< 3){
            return false;
        }
        xhttp.post('comment',{post_id: id, comment: comment}).then((comments)=>{
            post.data.filter(x => x.id==id)[0].comments = comments;
            post.archive = post.data;
            post.openComments(id);
        })
    },
    gotorecom: function(){
        route(`network/${path.parts[1]}/praise`);
    },
    saveRecommendation: function(){
        let r = $("#writearecommendation11").val();
        if(r.length < 5){
            return false;
        }
        xhttp.put('recommendation',{id: network.currentFriend.personal.id, text: r}).then(()=>{
            network.load().then(()=>{
                network.populate();
            })
        })
    }
}