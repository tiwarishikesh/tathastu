var admin= {
    load: function(){
        xhttp.get('admin',{}).then((response)=>{
            this.data = response.data;
            $("#myMembersTable tbody").empty();
            response.data.members.forEach((x)=>{
                if(x.id == auth.memberData.personal.id){
                    return false;
                }
                $("#myMembersTable tbody").append(`<tr style="border-bottom:1px solid black;">
                <td> ${x.photo ? `<img src="/service/build/${x.photo}"} style="width:50px;">`:''} &nbsp; ${x.fname} ${x.lname}</td>
                <td>${x.club}</td>
                <td style="text-transform:capitalize">${x.role}</td>
                <td>${config.membership_status[x.membership_status]}</td>
                <td><div class="button bordered-button small glassy" style="margin-top:0" onclick="admin.member.view(${x.id})"><p>EDIT</p></td>
                </tr>`);
            })
            $("#myMembersTable").DataTable();
            setTimeout(() => {
                $('select[name="myMembersTable_length"]').select2();
            }, 500);
        })
    },
    member: {
        view: function (x) {
            let member = admin.data.members.filter(m => m.id == x)[0];
            
            $('[name="adminMemberStatus"]').prop('checked',false);
            $(".view-member .name").text(`${member.fname} ${member.lname}`);
            this.currentMember = member;
            if(this.currentMember.membership_status == "2" || this.currentMember.membership_status == "3"){
                $("#editMemberPaid").prop('checked',true);
            }else {
                $("#editMemberPaid").prop('checked',false);
            }
            if(this.currentMember.membership_status == "1" || this.currentMember.membership_status == "2"){
                $("#editMemberApproved").prop('checked',true);
            }else{
                $("#editMemberApproved").prop('checked',false);
            }
            $(`#${this.currentMember.role}`).prop("checked",true);
            $(".view-member").css('opacity',1);

            xhttp.get('admin/member',{id: member.id}).then((response)=>{
                $("#admin_fname_edit").val(response.data.personal.fname);
                $("#admin_lname_edit").val(response.data.personal.lname);
                
                if (["male", "female"].includes(response.data.personal.gender)) {
                    $(`#admin${response.data.personal.gender}`).prop('checked', true);
                    $("#admingender").val("");
                    $("#adminother").addClass('disabled');
                } else {
                    $("#adminother").prop("checked", true);
                    $("#admingender").val(response.data.personal.gender);
                    $("#adminother").removeClass('disabled');
                }
                $("#admin_clubname_edit").val(response.data.personal.club);
                $("#admin_dateofjoining").val(response.data.personal.dateofjoining);
                $("#admin_dob").val(response.data.personal.dateofbirth);

                $("#admin_organisation_name").val(response.data.professional.organisation_name);
                $("#admin_position").val(response.data.professional.position);
                $("#admin_business_adress").html(response.data.professional.organisation_address);

                if (response.data.contact.filter(x => x.contact_type == "email")[0]) {
                    $("#admin_email1").val(response.data.contact.filter(x => x.contact_type == "email")[0].details);
                }
                if (response.data.contact.filter(x => x.contact_type == "email")[1]) {
                    $("#admin_email2").val(response.data.contact.filter(x => x.contact_type == "email")[1].details);
                }
                if (response.data.contact.filter(x => x.contact_type == "phone")[0]) {
                    window.admin_phone1Edit.setNumber(response.data.contact.filter(x => x.contact_type == "phone")[0].details);
                }
                if (response.data.contact.filter(x => x.contact_type == "phone")[1]) {
                    window.admin_phone2Edit.setNumber(response.data.contact.filter(x => x.contact_type == "phone")[1].details);
                }

                quillEditors.AdminAboutSection.container.firstChild.innerHTML = response.data.personal.about || '';
                quillEditors.adminAboutBusinessSection.container.firstChild.innerHTML = response.data.professional.description || '';
            })
        },
        save: function () {
            let payload = {
                id: this.currentMember.id,
                role: $('[name="memberRoles"]:checked').val()
            }

            if(!$("#editMemberApproved").is(":checked") && !$("#editMemberPaid").is(":checked")){
                if(this.currentMember.membership_status != 0){
                    payload.membership_status = 4;
                }else{
                    payload.membership_status = 0;
                }
            }else if($("#editMemberApproved").is(":checked") && !$("#editMemberPaid").is(":checked")){
                payload.membership_status = 1;
            }else if($("#editMemberApproved").is(":checked") && $("#editMemberPaid").is(":checked")){
                payload.membership_status = 2;
            }else if(!$("#editMemberApproved").is(":checked") && $("#editMemberPaid").is(":checked")){
                payload.membership_status = 3;
            }

            let error = false;
            payload.personal = {};
            payload.personal.fname = $("#admin_fname_edit").val();
            payload.personal.lname = $("#admin_lname_edit").val();
            payload.personal.gender = $('[name="admingender"]:checked').val() == "other" ? ($("#gender").val() || 'non binary') : $('[name="admingender"]:checked').val();
            if ($("#adminother").prop("checked") == true) {
                $("#admingender").removeClass('disabled');
            } else {
                $("#admingender").addClass('disabled');
            }
            payload.personal.club = $("#admin_clubname_edit").val();
            payload.personal.dateofbirth = $("#admin_dob").val();
            payload.personal.dateofjoining = $("#admin_dateofjoining").val();
            payload.personal.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

            payload.personal.about = quillEditors.AdminAboutSection.container.firstChild.innerHTML || 'NA';

            payload.contact = [];
            payload.contact.push({
                contact_type: "email",
                details: $("#admin_email1").val(),
                member_id: member.id
            });
            if($("#admin_email2").val()){
                if(RegexCheck.regexes.email.test($("#admin_email2").val())){
                    if (payload.contact.filter(x => x.contact_type == "email")[1]) {
                        payload.contact.filter(x => x.contact_type == "email")[1].details = $("#admin_email2").val() || "";
                    }else{
                        payload.contact.push({
                            contact_type: "email",
                            details: $("#admin_email2").val(),
                            member_id: auth.memberData.personal.id
                        });
                    }
                }else{
                    showsnackbar("Please Enter Valid Second Email ID");
                }
            }
            
            payload.contact.push({
                contact_type: "phone",
                details: '+' + window.admin_phone1Edit.getSelectedCountryData().dialCode + $("#admin_phone1").val(),
                member_id: member.id
            })
            
            if($("#phone2").val().length > 5){
                if (payload.contact.filter(x => x.contact_type == "phone")[1]) {
                    payload.contact.filter(x => x.contact_type == "phone")[1].details = ('+' + window.phone2Edit.getSelectedCountryData().dialCode + $("#admin_phone2").val());
                }else{
                    payload.contact.push({
                        contact_type: "phone",
                        details: '+' + window.admin_phone2Edit.getSelectedCountryData().dialCode + $("#admin_phone2").val(),
                        member_id: member.id
                    })
                }
            }

            payload.professional = {};
            payload.professional.organisation_name = $("#admin_organisation_name").val();
            payload.professional.organisation_address = $("#admin_business_adress").val();
            payload.professional.position = $("#admin_position").val();
            payload.professional.description = quillEditors.adminAboutBusinessSection.container.firstChild.innerHTML || 'NA';

            xhttp.post('admin/member', payload).then(()=>{
                admin.load();
                $(".view-member").css('opacity',0);
            })
        },
        cancelEdit: function(){
            this.currentMember = {};
            $(".view-member").css('opacity',0);
            $(".view-member").css('pointer-events: none',1);
        }
    },
    legal: {
        load: function () {
            return new Promise((resolve, reject)=>{
                xhttp.get('website/legal').then((response)=>{
                    this.Storage = response;
                    resolve();
                })
            });
        },
        selectionChanged: function () {
            this.read().then(()=>{
                let currentEdit = this.Storage.filter((x)=> x.title == $("#edit-legal-section").val())[0];
                quillEditors.legalSection.container.firstChild.innerHTML = currentEdit.text;
            })
        },
        read: function () {
            return new Promise((resolve, reject)=>{
                if(this.Storage){
                    resolve();
                }else{
                    this.load().then(()=>{
                        resolve();
                    })
                }
            })
        },
        save: function () {
            xhttp.post('website/legal',{
                title: $("#edit-legal-section").val(),
                text: quillEditors.legalSection.container.firstChild.innerHTML || 'NA'
            }).then((response)=>{
                showsnackbar(`${$('#edit-legal-section').select2('data')[0]?.text} Updated successfully`);
                this.load().then(this.selectionChanged);
            })
        }
    },
    about: {
        load: function () {
            return new Promise((resolve, reject)=>{
                xhttp.get('website/legal').then((response)=>{
                    this.Storage = response;
                    resolve();
                })
            });
        },
        selectionChanged: function () {
            this.read().then(()=>{
                let currentEdit = this.Storage.filter((x)=> x.title == $("#edit-about-section").val())[0];
                quillEditors.aboutSection.container.firstChild.innerHTML = currentEdit.text;
            })
        },
        read: function () {
            return new Promise((resolve, reject)=>{
                if(this.Storage){
                    resolve();
                }else{
                    this.load().then(()=>{
                        resolve();
                    })
                }
            })
        },
        save: function () {
            xhttp.post('website/legal',{
                title: $("#edit-about-section").val(),
                text: quillEditors.aboutSection.container.firstChild.innerHTML || 'NA'
            }).then((response)=>{
                showsnackbar(`${$('#edit-about-section').select2('data')[0]?.text} Updated successfully`);
                this.load().then(this.selectionChanged);
            })
        }
    },
    home: {
        load: function () {
            return new Promise((resolve, reject)=>{
                xhttp.get('website/home').then((response)=>{
                    this.Storage = response;
                    resolve();
                })
            });
        },
        read: function () {
            return new Promise((resolve, reject)=>{
                if(this.Storage){
                    resolve();
                }else{
                    this.load().then(()=>{
                        resolve();
                    })
                }
            })
        },
        populate: function () {
            this.read().then(()=>{
                $(".home_banner_archive .admin-home-single-image").remove();
                $("#stat1title").val(this.Storage.statistics[0].name);
                $("#stat1").val(this.Storage.statistics[0].number);
                $("#stat2title").val(this.Storage.statistics[1].name);
                $("#stat2").val(this.Storage.statistics[1].number);
                $("#stat3title").val(this.Storage.statistics[2].name);
                $("#stat3").val(this.Storage.statistics[2].number);
                $("#stat4title").val(this.Storage.statistics[3].name);
                $("#stat4").val(this.Storage.statistics[3].number);
                template_engine('.admin-home-single-image', this.Storage.banners, ".home_banner_archive");
            })
            admin.about.read().then(()=>{
                let x = admin.about.Storage;
                $("#landingViewtext").val(x.filter((y)=> y.title == 'landing-view-text')[0].text);
                $("#legendtext").val(x.filter((y)=> y.title == 'legend-text')[0].text);
            })
            this.addNewBanner();
        },
        addNewBanner:function () {
            $(".website-landing-new").html(`
                <div class="dropzone dropzone_square smalltools" id="newLandingPhoto"
                    data-width="512"
                    data-height="512"
                    data-url="/service/bannerPhoto"
                    style="max-width:300px;width: 100%;aspect-ratio:1;display:block;margin:auto;">
                        <input type="file" accept=".png, .jpg, .jpeg" name="thumb" />
                </div>`
            );
            /* data-image="/assets/membergallery/${this.currentPhotoEdit.photo_name}" */
            $('#newLandingPhoto').html5imageupload({
                onAfterProcessImage: function(x) {
                    Promise.all([admin.home.load(),admin.about.load()]).then(()=>{
                        admin.home.populate();
                    })
                },
                onAfterCancel: function() {
                    $('#filename').val('');
                }
            });  
            this.filename = null;
        },
        delete: function (id) {
            xhttp.delete('bannerPhoto',{id: id}).then(()=>{
                Promise.all([admin.home.load(),admin.about.load()]).then(()=>{
                    admin.home.populate();
                })
            })
        },
        save: function () {
            let payload = {
                landingViewText : $("#landingViewtext").val() || 'NA',
                legendText: $("#legendtext").val() || 'NA',
                stats : [
                    {
                        title: $("#stat1title").val(),
                        stat: $("#stat1").val()
                    },
                    {
                        title: $("#stat2title").val(),
                        stat: $("#stat2").val()
                    },
                    {
                        title: $("#stat3title").val(),
                        stat: $("#stat3").val()
                    },
                    {
                        title: $("#stat4title").val(),
                        stat: $("#stat4").val()
                    }
                ]
            };
            xhttp.post('website/home',payload).then(()=>{
                showsnackbar('Data has been updated');
                Promise.all([this.load(),admin.about.load()]).then(()=>{
                    this.populate();
                })

            })
        }
    },
    events:{
        load: function () {
            return new Promise((resolve, reject)=>{
                xhttp.get('admin/events').then((response)=>{
                    this.Storage = response;
                    this.Storage.forEach((x)=>{
                        x.verboseStatus = x.status == '0' ? `<span style="color:gray">UNDER REVIEW</span>` : x.status == '1' ? `<span style="color:green">APPROVED</span>` : x.status == '2' ? `<span style="color:red">REJECTED</span>`: null;
                        x.details = JSON.parse(x.details);
                        x.date = (new Date(Number(x.event_datetime))).toString().slice(8, 11) + ' ' + (new Date(Number(x.event_datetime))).toLocaleString('default', { month: 'long' }) + ' '+(new Date(Number(x.event_datetime))).toString().slice(11, 15);
                        x.time = (new Date(Number(x.event_datetime))).toString().slice(16, 21);
                        x.enddate = (new Date(Number(x.event_end))).toString().slice(8, 11) + ' ' + (new Date(Number(x.event_end))).toLocaleString('default', { month: 'long' }) + ' '+(new Date(Number(x.event_end))).toString().slice(11, 15);
                        x.endtime = (new Date(Number(x.event_end))).toString().slice(16, 21);

                        x.date_duration = x.date == x.enddate ? x.date : `${x.date} - ${x.time}`;
                        x.time_duration = x.date == x.enddate ? `${x.time} - ${x.endtime}` : `${x.enddate} - ${x.endtime}`;

                        if(x.event_type == "online"){
                            x.venue = "Link: " + x.details.link;
                            x.venue_details = "Password: "+x.details.password;
                        }else{
                            x.venue = x.details.venue_name + '<br>' + x.details.venue_address;
                            x.venue_details = "Map : <a href='"+x.details.venue_link+"'>"+ x.details.venue_link+"</a>";
                        }
                    })
                    resolve();
                })
            })
        },
        read: function () {
            return new Promise((resolve, reject)=>{
                if(this.Storage){
                    resolve(this.Storage);
                }else{
                    this.load().then(()=>{
                        resolve(this.Storage);
                    })
                }
            })
        },
        populate: function(){
            $(".admin_event_approve_section").hide();
            this.read().then(()=>{
                $('[linked-to="admin-events"] .admin-single-event').remove();
                template_engine('.admin-single-event', this.Storage,'.admin-events-archive');
            })
        },
        toggleOnlineOffline: function () {
            setTimeout(() => {
                if($("#admin_event_online").is(":checked")){
                    $("#admin_event_details_online").slideDown();
                    $("#admin_event_details_offline").slideUp();
                }else{
                    $("#admin_event_details_online").slideUp();
                    $("#admin_event_details_offline").slideDown();
                }
            }, 100);
        },
        edit: function(id){
            let x = this.Storage.filter((x) => x.id == id)[0];
            if(!x){
                return false;
            }
            $(".admin_event_approve_section").show();
            $(`[linked-to="admin-events"]`).data('current',x.id);
            $(`[linked-to="admin-events"] .side-panel-upper h4:eq(0)`).text('Edit Event');

            $("#admin_event_name").val(x.event_title);
            $("#admin_event_description").val(x.event_description);
            $("#admin_event_online").prop('checked',x.event_type=="online");
            $("#admin_event_approve").prop('checked', x.status == "2" || x.status == "1");
            if(x.event_type=="online"){
                $("#admin_event_link").val(x.details.link);
                $("#admin_event_password").val(x.details.password);
            }else{
                $("#admin_event_venue").val(x.details.venue_name);
                $("#admin_event_address").val(x.details.venue_address);
                $("#admin_event_map_link").val(x.details.venue_link);
            }
            /* $("#admin_event_date").val(x.date +' - '+x.time); */
            mobiscrollPickers.adminNewEvent.setVal([new Date(Number(x.event_datetime)), new Date(Number(x.event_end))]);
            this.toggleOnlineOffline();
        },
        cancelEdit: function(){
            $(`[linked-to="admin-events"] .side-panel-upper h4:eq(0)`).text('Add New');
            $(`[linked-to="admin-events"]`).data('current',null);
            $(`[linked-to="admin-events"] .side-panel-upper input`).val('');
            $(`[linked-to="admin-events"] .side-panel-upper textarea`).val('');
            $(".admin_event_approve_section").hide();
        },
        save: function () {
            let error = false;
            let payload = {
                id: $(`[linked-to="admin-events"]`).data('current') || "NA",
                title: $("#admin_event_name").val() || (showsnackbar('Please specify Event Title'), error = true),
                description: $("#admin_event_description").val() || (showsnackbar('Please specify Event Title'), error = true),
                datetime: $("#admin_event_date").val() ? (new Date($("#admin_event_date").val().replace(' -',''))).getTime() : (showsnackbar('Please specify a date and time'), error = true),
                event_end: $("#admin_event_end_date").val() ? (new Date($("#admin_event_end_date").val().replace(' -',''))).getTime() : (showsnackbar('Please specify a date and time'), error = true),
                type: $("#admin_event_online").is(":checked") ? 'online': 'offline',
                approval: $("#admin_event_approve").is(":checked") ? 'yes' : 'no'
            };
            if($("#admin_event_online").is(":checked")){
                payload.details = {
                    link: $("#admin_event_link").val() || (showsnackbar('Please include event link'), error = true),
                    password: $("#admin_event_password").val() || "NA"
                }
            }else{
                payload.details = {
                    venue_name: $("#admin_event_venue").val() || (showsnackbar('Please include Venue name'), error=true),
                    venue_address: $("#admin_event_address").val() || (showsnackbar('Please include Venue adress'), error=true),
                    venue_link: $("#admin_event_map_link").val() || (showsnackbar('Please include Venue map link'), error=true),
                }
            }
            if(error){
                return false;
            }
            xhttp.post('admin/events',payload).then(()=>{
                showsnackbar('Event Added Successfully');
                $(`[linked-to="admin-events"] .side-panel-upper h4:eq(0)`).text('Add New');
                $(`[linked-to="admin-events"]`).data('current',null);
                $(`[linked-to="admin-events"] .side-panel-upper input`).val('');
                $(`[linked-to="admin-events"] .side-panel-upper textarea`).val('');
                $(".admin_event_approve_section").hide();
                this.load().then(()=>{
                    this.populate();
                })
            })
        },
        delete: function (id) {
            xhttp.delete('myEvent',{id: id}).then(()=>{
                showsnackbar('Event deleted successfully');
                this.load().then(()=>{
                    this.populate();
                })
            })
        }
    },
    advertisement : {
        load: function () {
            return new Promise((resolve, reject)=>{
                xhttp.get('Ads').then((response)=>{
                    this.Storage = response;
                    resolve();
                })
            })
        },
        read: function () {
            return new Promise((resolve, reject)=>{
                if(this.Storage){
                    resolve(this.Storage);
                }else{
                    this.load().then(()=>{
                        resolve(this.Storage);
                    })
                }
            })
        },
        populate: function(){
            this.read().then(()=>{
                $('[linked-to="admin-adverts"] .admin-single-advert').remove();
                this.Storage.forEach((x)=>{
                    x.verboseStatus = x.status == '0' ? `<span style="color:gray">UNDER REVIEW</span>` : x.status == '1' ? `<span style="color:green">APPROVED</span>` : x.status == '2' ? `<span style="color:red">REJECTED</span>`: null;
                    x.paymentStatus = x.payment_status == '1'? `<span style="color:green">PAID</span>` : `<span style="color:gray">UNPAID</span>`;
                   /*  x.details = JSON.parse(x.details);
                    x.date = (new Date(Number(x.event_datetime))).toString().slice(8, 11) + ' ' + (new Date(Number(x.event_datetime))).toLocaleString('default', { month: 'long' }) + ' '+(new Date(Number(x.event_datetime))).toString().slice(11, 15);
                    x.time = (new Date(Number(x.event_datetime))).toString().slice(16, 21);
                    if(x.event_type == "online"){
                        x.venue = "Link" + x.details.link;
                        x.venue_details = "Password: "+x.details.password;
                    }else{
                        x.venue = x.details.venue_name + '<br>' + x.details.venue_address;
                        x.venue_details = "Map : <a href='"+x.details.venue_link+"'>"+ x.details.venue_link+"</a>";
                    } */
                    x.fromHuman = (new Date(Number(x.from))).toString().slice(8, 11) + ' ' + (new Date(Number(x.from))).toLocaleString('default', { month: 'long' }) + ' '+(new Date(Number(x.from))).toString().slice(11, 15)
                    x.toHuman = (new Date(Number(x.till))).toString().slice(8, 11) + ' ' + (new Date(Number(x.till))).toLocaleString('default', { month: 'long' }) + ' '+(new Date(Number(x.till))).toString().slice(11, 15);
                })
                template_engine('.admin-single-advert', this.Storage,'.admin-advertisements-archive');
            })
        },
        toggleOnlineOffline: function () {
            setTimeout(() => {
                if($("#add_event_online").is(":checked")){
                    $("#new_event_details_online").slideDown();
                    $("#new_event_details_offline").slideUp();
                }else{
                    $("#new_event_details_online").slideUp();
                    $("#new_event_details_offline").slideDown();
                }
            }, 100);
        },
        new: function () {

            this.filename = null;
            $("#adminAdPhotoSectionContainer").html(`
                <div class="dropzone dropzone_square smalltools" id="adminAdPhotoSection"
                    data-width="512"
                    data-height="512"
                    data-url="/service/myAdPhoto"
                    style="max-width:300px;width: 100%;aspect-ratio:1;display:block;margin:auto;">
                        <input type="file" accept=".png, .jpg, .jpeg" name="thumb" />
                </div>`
            );
            /* data-image="/assets/membergallery/${this.currentPhotoEdit.photo_name}" */
            $('#adminAdPhotoSection').html5imageupload({
                onAfterProcessImage: function(x) {
                    $("#addEditPhotoInput").attr('data-img',ImageUploadedResponse.filename);
                    admin.advertisement.filename = ImageUploadedResponse.filename;
                },
                onAfterCancel: function() {
                    $('#filename').val('');
                }
            });  
            this.filename = null;
        },
        newImageUploaded: function () {
            admin.advertisement.filename = ImageUploadedResponse?.filename;
            /* ImageUploadedResponse?.image_id */
        },
        edit: function(id){
            let x = this.Storage.filter((x) => x.id == id)[0];
            if(!x){
                return false;
            }
            $(`[linked-to="admin-adverts"]`).data('current',x.id);
            $(`[linked-to="admin-adverts"] .side-panel-upper h4:eq(0)`).text('Edit Advertisement');

            $("#adminAdPhotoSectionContainer").html(`
                <div class="dropzone dropzone_square smalltools" id="adminAdPhotoSection"
                    data-width="512"
                    data-height="512"
                    data-url="/service/myAdPhoto"
                    data-image="/assets/advertisement/${x.image}"
                    style="max-width:300px;width: 100%;aspect-ratio:1;display:block;margin:auto;">
                        <input type="file" accept=".png, .jpg, .jpeg" name="thumb" />
                </div>`
            );

            $('#adminAdPhotoSection').html5imageupload({
                onAfterProcessImage: function(x) {
                    $("#addEditPhotoInput").attr('data-img',ImageUploadedResponse.filename);
                    admin.advertisement.filename = ImageUploadedResponse.filename;
                    member.advertisement.newImageUploaded();
                },
                onAfterCancel: function() {
                    $('#filename').val('');
                }
            });  

            $("#admin_ad_name").val(x.title);
            $("#admin_ad_description").val(x.description);
            $("#admin_ad_link").val(x.link);
            /* $("#admin_ad_from").val(x.fromHuman);
            $("#admin_ad_to").val(x.toHuman); */
            mobiscrollPickers.adminAdvertisement.setVal([new Date(Number(x.from)), new Date(Number(x.till))]);
            $("#admin_price").val(x.price);
            $(`#${$(`[name="updateAdvertisementType"][value="${x.type}"]`).attr('id')}`).prop('checked',true);
            this.filename = x.image;
            if(x.status == "1"){
                $("#editAdvertisementApproved").prop("checked",true)
            }else{
                $("#editAdvertisementApproved").prop("checked",false)
            }

            if(x.payment_status == "1"){
                $("#editAdvertisementPaid").prop("checked",true)
            }else{
                $("#editAdvertisementPaid").prop("checked",false)
            }
        },
        cancelEdit: function(){
            $(`[linked-to="admin-adverts"] .side-panel-upper h4:eq(0)`).text('Add New');
            $(`[linked-to="admin-adverts"]`).data('current',null);
            $(`[linked-to="admin-adverts"] .side-panel-upper input`).val('');
            $(`[linked-to="admin-adverts"] .side-panel-upper textarea`).val('');
            this.new();
        },
        save: function () {
            let error = false;
            let payload = {
                id: $(`[linked-to="admin-adverts"]`).data('current') || "NA",
                title: $("#admin_ad_name").val() || (showsnackbar('Please specify Event Title'), error = true),
                description: $("#admin_ad_description").val() || (showsnackbar('Please specify Event Title'), error = true),
                link: $("#admin_ad_link").val() || "NA",
                from: $("#admin_ad_from").val() ? (new Date($("#admin_ad_from").val())).getTime() : (showsnackbar('Please specify when you want the advertisement to run'), error = true),
                to: $("#admin_ad_to").val() ? (new Date($("#admin_ad_to").val())).getTime() :  (showsnackbar('Please specify till when you want the advertisement to run'), error = true),
                type: $('[name="updateAdvertisementType"]:checked').val() || 'post',
                price: $("#admin_price").val() || (showsnackbar('Please include a price'), error = true),
                photo: this.filename || (showsnackbar('Please include a creative'), error = true),
                status: $("#editAdvertisementApproved").is(":checked")? "1" : "0",
                payment_status: $("#editAdvertisementPaid").is(":checked")? "1":"0"
            };
            if(error){
                return false;
            }
            xhttp.post('Ad',payload).then(()=>{
                showsnackbar('Advertisement submitted Successfully');
                $(`[linked-to="admin-adverts"] .side-panel-upper h4:eq(0)`).text('Add New');
                $(`[linked-to="admin-adverts"]`).data('current',null);
                $(`[linked-to="admin-adverts"] .side-panel-upper input`).val('');
                $(`[linked-to="admin-adverts"] .side-panel-upper textarea`).val('');
                this.filename = null;
                this.load().then(()=>{
                    this.populate();
                })
            })
        },
        delete: function (id) {
            xhttp.delete('Ad',{id: id}).then(()=>{
                showsnackbar('Advertisement deleted successfully');
                this.load().then(()=>{
                    this.populate();
                })
            })
        },
        from_changed: function () {
            
        }
    },
    testimonial:{
        load: function () {
            return new Promise((resolve, reject)=>{
                xhttp.get('Testimonials').then((response)=>{
                    this.Storage = response;
                    resolve();
                })
            })
        },
        read: function () {
            return new Promise((resolve, reject)=>{
                if(this.Storage){
                    resolve(this.Storage);
                }else{
                    this.load().then(()=>{
                        resolve(this.Storage);
                    })
                }
            })
        },
        populate: function(){
            if(!admin.data?.members){
                setTimeout(() => {
                    this.populate();
                }, 500);
                return false;
            }
            $("#admin_testimonial_member").html(`<option value=""></option>`);
            template_engine(`<option value="{{id}}">{{fname}} {{lname}}</option>`,admin.data.members,"#admin_testimonial_member").then(()=>{
                $("#admin_testimonial_member").select2({
                    placeholder: "Select a member"
                });
            });
            this.read().then(()=>{
                $('[linked-to="admin-testimonials"] .admin-single-testimonial').remove();
                this.Storage.forEach((x)=>{
                    x.verboseStatus = x.status == '0' ? `<span style="color:gray">UNDER REVIEW</span>` : x.status == '1' ? `<span style="color:green">APPROVED</span>` : x.status == '2' ? `<span style="color:red">REJECTED</span>`: null;
                })
                template_engine('.admin-single-testimonial', this.Storage,'.admin-testimonials-archive');
            })
        },
        edit: function (id) {
            let x = this.Storage.filter((x) => x.id == id)[0];
            if(!x){
                return false;
            }
            if(x.status == "1"){
                $("#editTestimonialApproved").prop('checked',true);
            }else{
                $("#editTestimonialApproved").prop('checked',false);
            }
            $("#admin-testimonial-edit").data('current',x.id);
            $("#admin-testimonial-edit").val(x.testimonial_text);
            $('#admin_testimonial_member').val(x.member_id).trigger('change');
            $(`[linked-to="admin-testimonials"] .side-panel-upper h4:eq(0)`).text('Edit Testimonial');
        },
        save: function () {
            if(!$("#admin-testimonial-edit").val() || !$("#admin_testimonial_member").val()){
                showsnackbar('Please fill out testimonial text and the member name');
            }
            let payload = {
                id: $("#admin-testimonial-edit").data('current') || 'NA',
                testimonial: $("#admin-testimonial-edit").val(),
                user: $('#admin_testimonial_member').val(),
                approval: $("#editTestimonialApproved").is(":checked") ? 'true' : 'false'
            }
            xhttp.post('Testimonial',payload).then(()=>{
                showsnackbar('Testimonial Recorded Successfully');
                $(`[linked-to="admin-testimonials"] .side-panel-upper h4:eq(0)`).text('Add New');
                $("#admin-testimonial-edit").val('');
                $("#admin-testimonial-edit").data('current',null);
                $("#admin_testimonial_member").val('').trigger('change');
                this.load().then(()=>{
                    this.populate();
                })
            })
        },
        cancelEdit: function () {
            $(`[linked-to="admin-testimonials"] .side-panel-upper h4:eq(0)`).text('Add New');
            $("#admin-testimonial-edit").val('');
            $("#admin-testimonial-edit").data('current',null);
            $("#admin_testimonial_member").val('').trigger('change');
            this.load().then(()=>{
                this.populate();
            })
        },
        delete: function (id) {
            xhttp.delete('Testimonial',{id: id}).then(()=>{
                showsnackbar('Testimonial deleted successfully');
                this.load().then(()=>{
                    this.populate();
                })
            })
        }
    },
    blogs:{
        load: function () {
            return new Promise((resolve, reject)=>{
                xhttp.get('Blog').then((response)=>{
                    this.Storage = response.blogs;
                    resolve();
                })
            })
        },
        read: function () {
            return new Promise((resolve, reject)=>{
                if(this.Storage){
                    resolve(this.Storage);
                }else{
                    this.load().then(()=>{
                        resolve(this.Storage);
                    })
                }
            })
        },
        populate: function(){
            if(Number(path.parts[3]) == path.parts[3] && path.parts[2] == "edit"){
                this.edit(path.parts[3]);
            }else{
                this.read().then(()=>{
                    $('[linked-to="admin-blogs"] .admin-blog-single-card').remove();
                    this.Storage.forEach((x)=>{
                        x.verboseStatus = x.status == '0' ? `<span style="color:gray">UNDER REVIEW</span>` : x.status == '1' ? `<span style="color:green">APPROVED</span>` : x.status == '2' ? `<span style="color:orange">EDITED</span>`: null;
                        x.verboseAccess = x.access == "1" ? `<span style="color:green">PUBLIC</span>` : `<span style="color:blue">MEMBER ONLY</span>`;
                    })
                    template_engine('.admin-blog-single-card', this.Storage,'.admin-blogs-archive');
                    $(".admin-blogs-archive").show();
                    $(".admin-blogs-single").hide();
                })
            }
        },
        edit: function (id) {
            xhttp.get('blog/single',{id: id}).then((response)=>{
                this.currentEdit = response;

                if(this.currentEdit.edited[0]){
                    this.currentEdit.edited = this.currentEdit.edited[0];
                }
                if(!response.current){
                    route('account/admin-blogs');
                }
                $(".admin-blogs-archive").hide();
                $(".admin-blogs-single").show();

                if(this.currentEdit.current.status !== '0'){
                    $("#editBlogApproved").prop("checked",true);
                }else{
                    $("#editBlogApproved").prop("checked",false);
                }

                if(this.currentEdit.current.access == '2'){
                    $("#editBlogMemberOnly").prop("checked",true);
                }else{
                    $("#editBlogMemberOnly").prop("checked",false);
                }

                if(!this.currentEdit.edited){
                    $(".old").hide();
                    $("#blog_new_banner").attr('src',`/assets/blogImages/${this.currentEdit.current.banner}`);
                    $("#blog_new_thumb").attr('src',`/assets/blogImages/${this.currentEdit.current.thumbnail}`);
                    $(".blogAdminExcerpt").text(this.currentEdit.current.excerpt);
                    $(".blogAdminTitle").text(this.currentEdit.current.title);
                    $(".blogAdminReadTime").text(this.currentEdit.current.readtime + ' minutes');
                    $(".blogAdminBody").html(this.currentEdit.current.blog_text);
                }else{
                    $(".old").show();
                    $("#blog_new_banner").attr('src',`/assets/blogImages/${this.currentEdit.current.banner}`);
                    $("#blog_new_thumb").attr('src',`/assets/blogImages/${this.currentEdit.current.thumbnail}`);
                    $("#blog_old_banner").attr('src',`/assets/blogImages/${this.currentEdit.edited.banner}`);
                    $("#blog_old_thumb").attr('src',`/assets/blogImages/${this.currentEdit.edited.thumbnail}`);
                    $(".blogAdminExcerpt").html(`<s>${this.currentEdit.current.excerpt}</s>${this.currentEdit.edited.excerpt}`);
                    $(".blogAdminTitle").html(`<s>${this.currentEdit.current.title}</s>${this.currentEdit.edited.title}`);
                    $(".blogAdminReadTime").html(`<s>${this.currentEdit.current.readtime}</s>${this.currentEdit.edited.readtime} minutes`);
                    /* var re = new RegExp(/<img\s[^>]*?src\s*=\s*['\"]([^'\"]*?)['\"][^>]*?>/gi, "gi");
                    let images1 = admin.blogs.currentEdit.current.blog_text.match(re);
                    let images2 = admin.blogs.currentEdit.edited.blog_text.match(re);

                    let image_matrix = [];

                    images1.forEach((x)=>{
                        image_matrix[(new Date()).getTime()] = x;
                    })
                    images2.forEach((x)=>{
                        image_matrix[(new Date()).getTime()] = x;
                    })

                    console.log(images2); */

                    $(".blogAdminBody").html(diffString(admin.blogs.currentEdit.current.blog_text, admin.blogs.currentEdit.edited.blog_text).replaceAll('&lt;','<').replaceAll('&gt;','>'))
                }
            })
        },
        save: function () {
            let payload = {
                approval: $("#editBlogApproved").is(":checked") ? "true": 'false',
                memberOnly: $("#editBlogMemberOnly").is(":checked") ? "true": 'false',
                id: this.currentEdit.current.id
            }
            xhttp.put('Blog',payload).then(()=>{
                route('account/admin-blogs')
                this.load().then(()=>{
                    this.populate();
                })
            })
        },
        cancelEdit: function () {
            $(`[linked-to="admin-testimonials"] .side-panel-upper h4:eq(0)`).text('Add New');
            $("#admin-testimonial-edit").val('');
            $("#admin-testimonial-edit").data('current',null);
            $("#admin_testimonial_member").val('').trigger('change');
            this.load().then(()=>{
                this.populate();
            })
        },
        delete: function (id) {
            xhttp.delete('Testimonial',{id: id}).then(()=>{
                showsnackbar('Testimonial deleted successfully');
                this.load().then(()=>{
                    this.populate();
                })
            })
        }
    },
    faqs:{
        load: function () {
            return new Promise((resolve, reject)=>{
                xhttp.get('faqs').then((response)=>{
                    this.Storage = response;
                    resolve();
                })
            })
        },
        read: function () {
            return new Promise((resolve, reject)=>{
                if(this.Storage){
                    resolve(this.Storage);
                }else{
                    this.load().then(()=>{
                        resolve(this.Storage);
                    })
                }
            })
        },
        populate: function(){
            this.read().then(()=>{
                $('[linked-to="faq"] .admin-single-faq').remove();
                this.Storage.forEach((x)=>{
                    x.verboseStatus = x.status == '0' ? `<span style="color:gray">INACTIVE</span>` : x.status == '1' ? `<span style="color:green">ACTIVE</span>` : x.status == '2' ? `<span style="color:red">REJECTED</span>`: null;
                })
                template_engine('.admin-single-faq', this.Storage,'.admin-faqs-archive');
            })
        },
        edit: function (id) {
            let x = this.Storage.filter((x) => x.id == id)[0];
            if(!x){
                return false;
            }
            if(x.status == "1"){
                $("#editFAQApproved").prop('checked',true);
            }else{
                $("#editFAQApproved").prop('checked',false);
            }
            $("#admin-faq-edit").data('current',x.id);
            $("#admin-faq-question").val(x.question);
            $("#admin-faq-answer").val(x.answer);
            
            $(`[linked-to="faq"] .side-panel-upper h4:eq(0)`).text('Edit FAQs');
        },
        save: function () {
            if(!$("#admin-faq-question").val() || !$("#admin-faq-answer").val()){
                showsnackbar('Please fill out faq question and answer');
            }
            let payload = {
                id: $("#admin-faq-edit").data('current') || 'NA',
                question: $("#admin-faq-question").val(),
                answer: $('#admin-faq-answer').val(),
                approval: $("#editFAQApproved").is(":checked") ? 'true' : 'false'
            }
            xhttp.post('faqs',payload).then(()=>{
                showsnackbar('FAQ Added Successfully');
                $(`[linked-to="faq"] .side-panel-upper h4:eq(0)`).text('Add New');
                $("#admin-faq-answer").val('');
                $("#admin-faq-question").val('');
                $("#admin-faq-edit").data('current',null);
                this.load().then(()=>{
                    this.populate();
                })
            })
        },
        cancelEdit: function () {
            $(`[linked-to="faq"] .side-panel-upper h4:eq(0)`).text('Add New');
            $("#admin-faq-answer").val('');
            $("#admin-faq-question").val('');
            $("#admin-faq-edit").data('current',null);
            this.load().then(()=>{
                this.populate();
            })
        },
        delete: function (id) {
            xhttp.delete('faqs',{id: id}).then(()=>{
                showsnackbar('FAQ deleted successfully');
                this.load().then(()=>{
                    this.populate();
                })
            })
        }
    },
    bod:{
        load: function () {
            return new Promise((resolve, reject)=>{
                xhttp.get('bod').then((response)=>{
                    this.Storage = response;
                    resolve();
                })
            })
        },
        read: function () {
            return new Promise((resolve, reject)=>{
                if(this.Storage){
                    resolve(this.Storage);
                }else{
                    this.load().then(()=>{
                        resolve(this.Storage);
                    })
                }
            })
        },
        populate: function(){
            if(!admin.data?.members){
                setTimeout(() => {
                    this.populate();
                }, 500);
                return false;
            }
            $("#admin-bod-member").html(`<option value=""></option>`);
            template_engine(`<option value="{{id}}">{{fname}} {{lname}}</option>`,admin.data.members,"#admin-bod-member").then(()=>{
                $("#admin-bod-member").select2({
                    placeholder: "Select a member"
                });
            });
            this.read().then(()=>{
                $('[linked-to="bod"] .admin-single-bod').remove();
                this.Storage.forEach((x)=>{
                    x.verboseStatus = x.status == '0' ? `<span style="color:gray">PAST</span>` : x.status == '1' ? `<span style="color:green">ACTIVE</span>` : x.status == '2' ? `<span style="color:red">PAST</span>`: null;
                })
                template_engine('.admin-single-bod', this.Storage,'.admin-bod-archive');
            })
        },
        edit: function (id) {
            let x = this.Storage.filter((x) => x.id == id)[0];
            if(!x){
                return false;
            }
            if(x.status == "1"){
                $("#editBODcurrent").prop('checked',true);
            }else{
                $("#editBODcurrent").prop('checked',false);
            }
            $("#admin-bod-edit").data('current',x.id);
            $("#admin-bod-position").val(x.position);
            $('#admin-bod-member').val(x.member_id).trigger('change');
            $(`[linked-to="bod"] .side-panel-upper h4:eq(0)`).text('Edit Board Member');
        },
        save: function () {
            if(!$("#admin-bod-member").val() || !$('#admin-bod-position').val()){
                showsnackbar('Please fill out member position and the member name');
                return false;
            }
            let payload = {
                id: $("#admin-bod-edit").data('current') || 'NA',
                member_id: $("#admin-bod-member").val(),
                position: $('#admin-bod-position').val(),
                status: $("#editBODcurrent").is(":checked") ? 'true' : 'false'
            }
            xhttp.post('bod',payload).then(()=>{
                showsnackbar('Board Member Recorded Successfully');
                $(`[linked-to="bod"] .side-panel-upper h4:eq(0)`).text('Add New');
                $("#admin-bod-position").val('');
                $("#admin-bod-edit").data('current',null);
                $("#admin-bod-member").val('').trigger('change');
                this.load().then(()=>{
                    this.populate();
                })
            })
        },
        cancelEdit: function () {
            $(`[linked-to="bod"] .side-panel-upper h4:eq(0)`).text('Add New');
                $("#admin-bod-position").val('');
                $("#admin-bod-edit").data('current',null);
                $("#admin-bod-member").val('').trigger('change');
            this.load().then(()=>{
                this.populate();
            })
        },
        delete: function (id) {
            xhttp.delete('bod',{id: id}).then(()=>{
                showsnackbar('Director deleted successfully');
                this.load().then(()=>{
                    this.populate();
                })
            })
        }
    },
    chapters: {
        populate: function () {
            $("#myChaptersTable tbody").empty();
            network.read().then(()=>{
                websiteData.chapters.forEach((chapter)=>{
                    if(chapter.id == "1"){
                        return false;
                    }
                    $("#myChaptersTable tbody").append(`
                    <tr style="border-bottom:1px solid black;">
                        <td><img style="width:25px;" src="https://cdn.jsdelivr.net/npm/svg-country-flags@1.2.10/svg/${chapter.country.toLowerCase()}.svg"> &nbsp; ${chapter.chapter_name}</td>
                        <td>${chapter.charter_club}</td>
                        <td>${network.data.member.filter(x => x.id == chapter.member_id)[0].fname} ${network.data.member.filter(x => x.id == chapter.member_id)[0].lname}</td>
                        <td>${chapter.status == '1' ? 'Approved': 'Under Review'} ${chapter.payment == "1" ? "Paid": "Unpaid"}</td>
                        <td><div class="button bordered-button small glassy" style="margin-top:0" onclick="admin.chapters.view(${chapter.id})"><p>EDIT</p></td>
                    </tr>`);
                });
    
                $("#myChaptersTable").DataTable();
                setTimeout(() => {
                    $('select[name="myChaptersTable_length"]').select2();
                }, 500);
            })
        },
        view: function (id) {
            network.read().then(()=>{
                let selectData = network.data.member.map((x) => {
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
                $("#updateAdminChapterLeaders").select2({
                    data: selectData,
                    templateResult: function (d) { return $(d.dropdownTemplate)},
                    templateSelection: function (d) { return $(d.dropdownTemplate)}
                });
                getCountryArray().then(async (response)=>{
                    let CountrySelectData = await response.map((x) => {
                        return {
                            id: x.value,
                            dropdownTemplate: `<div class="container w-full p-0">
                                                    <div class="col-xs-2 ">
                                                        <img style="width:100%;max-width:50px" src="${x.image}">
                                                    </div>
                                                    <div class="col-xs-10">
                                                        ${x.text}
                                                    </div>
                                                </div>`
                        }
                    })
                    $("#updateAdminChapterAddressCountry").select2({
                        data: CountrySelectData,
                        templateResult: function (d) { return $(d.dropdownTemplate)},
                        templateSelection: function (d) { return $(d.dropdownTemplate)}
                    })
                    myGoogleMap.init("updateAdminChapterLocation");
                    chapter.MyChapterData = websiteData.chapters.filter(x => x.id == id)[0];
                    if(!chapter.MyChapterData){ return false }
    
                    $(".right-menu-single-item.chapter-edit h4:eq(0)").text("Edit Chapter: "+chapter.MyChapterData.chapter_name);
    
                    $("#updateAdminChapterName").val(chapter.MyChapterData.chapter_name);
                    $("#updateAdminChapterDescription").val(chapter.MyChapterData.description);
                    $("#updateAdminChapterClub").val(chapter.MyChapterData.charter_club);
    
                    $("#updateAdminChapterLeaders").val(chapter.MyChapterData.admins.map(x => x.member_id)).trigger("change");
    
                    $("#updateAdminChapterAddress").val(chapter.MyChapterData.address);
                    $("#updateAdminChapterAddressState").val(chapter.MyChapterData.state);
                    $("#updateAdminChapterAddressPin").val(chapter.MyChapterData.pincode);
                    $("#updateAdminChapterAddressCountry").val(chapter.MyChapterData.country).trigger("change");

                    $("#updateAdminChapterEmail").val(chapter.MyChapterData.email);
                    $("#updateAdminChapterDistrict").val(chapter.MyChapterData.ridistrict);

                    if(chapter.MyChapterData.status == "0"){
                        $("#updateChapterApproval").prop("checked",false);
                        $(".updateAdminChapterPayment").hide();
                    }else{
                        $("#updateChapterApproval").prop("checked",true);
                        if(chapter.MyChapterData.payment == "0"){
                            $(".updateAdminChapterPayment").show();
                        }else{
                            $(".updateAdminChapterPayment").hide();
                        }
                    }
    
                    myGoogleMap.setMarker({lat: chapter.MyChapterData.latitude, lng: chapter.MyChapterData.longitude});
    
                })
            })
        },
        applyEdit: function () {
            let error = false;
            let payload = {
                id           : chapter.MyChapterData.id,
                name         : $("#updateAdminChapterName").val() || (showsnackbar('Please Provide a Chapter Name'), error = true),
                club         : $("#updateAdminChapterClub").val() || (showsnackbar('Please Provide a Chapter Name'), error = true),
                description  : $("#updateAdminChapterDescription").val() || (showsnackbar('Please Provide a Chapter Name'), error = true),
                address      : $("#updateAdminChapterAddress").val() || (showsnackbar('Please provide Address'), error = true),
                state        : $("#updateAdminChapterAddressState").val() || (showsnackbar('Please Provide State'), error = true),
                pin          : $("#updateAdminChapterAddressPin").val() || (showsnackbar('Please Provide a Pin/Area Code'), error = true),
                country      : $("#updateAdminChapterAddressCountry").val() || (showsnackbar('Please Provide Country'), error = true),
                lat          : myGoogleMap.draggable_marker.getPosition().lat(),
                lng          : myGoogleMap.draggable_marker.getPosition().lng(),
                status       : $("#updateChapterApproval").prop("checked") ? '1' : 'na',
                ridistrict   : $("#updateAdminChapterDistrict").val() || (showsnackbar('Please Provide Country'), error = true),
                email        : $("#updateAdminChapterEmail").val() || (showsnackbar('Please Provide Country'), error = true),
            }
            payload.heads = [];
            [
                {leaders    : "updateAdminChapterLeaders"},
            ].forEach((drop)=>{
                $(`#${Object.values(drop)[0]}`).val().forEach((head)=>{
                    let b= {};
                    b[Object.keys(drop)[0]] = head;
                    payload.heads.push(b);
                })
            })
            if(!payload.heads[0]){
                showsnackbar('Cannot remove all key members');
                return false;
            }

            if(error) {return false};

            xhttp.put('adminchapter',payload).then(async (response)=>{
                showsnackbar('Changes Updated');
                websiteData = await xhttp.get('init');
                admin.chapters.populate();
                if(chapter.MyChapterData.id){
                    admin.chapters.view(chapter.MyChapterData.id);
                }
            })
        },
        confirmPayment: function () {
            xhttp.post('chapterPayment',{id: chapter.MyChapterData.id, paymentRef: $("#updateChapterPaymentReference").val()}).then(async (response)=>{
                showsnackbar('Changes Updated');
                websiteData = await xhttp.get('init');
                admin.chapters.populate();
                if(chapter.MyChapterData.id){
                    admin.chapters.view(chapter.MyChapterData.id);
                    $(".confirmLeave").removeClass('confirmLeave');
                }
            })
        }
    }
}


let member_states = {
    0: 'unpaid, unaaproved',
    1: 'unpaid, approved',
    2: 'paid, approved',
    3: 'paid, unapproved'
}


let calendar = {
    showEvent: function (event) {
        $("#event-popup").css('left','00vw');
        $("#event-popup h2").text(event.event.event_title);
        $(".event-popup-description").text(event.event.event_description);

        let x = event.event;
        x.date = (new Date(Number(x.event_datetime))).toString().slice(8, 11) + ' ' + (new Date(Number(x.event_datetime))).toLocaleString('default', { month: 'long' }) + ' '+(new Date(Number(x.event_datetime))).toString().slice(11, 15);
        x.time = (new Date(Number(x.event_datetime))).toString().slice(16, 21);
        x.enddate = (new Date(Number(x.event_end))).toString().slice(8, 11) + ' ' + (new Date(Number(x.event_end))).toLocaleString('default', { month: 'long' }) + ' '+(new Date(Number(x.event_end))).toString().slice(11, 15);
        x.endtime = (new Date(Number(x.event_end))).toString().slice(16, 21);

        x.date_duration = x.date == x.enddate ? x.date : `${x.date} - ${x.time}`;
        x.time_duration = x.date == x.enddate ? `${x.time} - ${x.endtime}` : `${x.enddate} - ${x.endtime}`;

        $("#event-popup .event_date").text(x.date_duration);
        $("#event-popup .event_time").text(x.time_duration);


        if(x.event_type == "online"){
            $(".event-popup-online").show();
            $(".event-popup-offline").hide();
            $(".event-popup-online div:eq(0) span:eq(1)").text(JSON.parse(x.details).link);
            $(".event-popup-online div:eq(1) span:eq(1)").text(JSON.parse(x.details).password);
        }else{
            $(".event-popup-online").hide();
            $(".event-popup-offline").show();
            $(".event-popup-offline div:eq(0) span:eq(1)").text(JSON.parse(x.details).venue_name);
            $(".event-popup-offline div:eq(1) span:eq(1)").text(JSON.parse(x.details).venue_address);
            $(".event-popup-offline div:eq(2) span:eq(1)").text(JSON.parse(x.details).venue_link);
        }
    },
    load: async function () {
        websiteData = await xhttp.get('init');
        console.log(websiteData.events);

        websiteData.events.forEach((event)=>{
            event.start = new Date(Number(event.event_datetime));
            event.end   = new Date(Number(event.event_end));
            event.title = event.event_title;
        })

        console.log(websiteData.events);

        this.instance = mobiscroll.eventcalendar('#demo-full-event-customization', {
            theme: 'ios',
            themeVariant: 'light',
            view: {
                agenda: { type: 'month' },
                calendar: { type: 'week' }
            },
            renderHeader: function () {
                    return '<div mbsc-calendar-nav class="cal-header-nav"></div>' +
                        '<div class="cal-header-picker" style="float:right">' +
                        '<label><input data-icon="material-event-note" mbsc-segmented type="radio" name="view" value="month" class="md-view-change"></label>' +
                        '<label><input data-icon="material-date-range" mbsc-segmented type="radio" name="view" value="week" class="md-view-change" checked></label>' +
                        '<label><input data-icon="material-view-day" mbsc-segmented type="radio" name="view" value="day" class="md-view-change"></label>' +
                        '<label><input data-icon="calendar" mbsc-segmented type="radio" name="view" value="calendar" class="md-view-change"></label>'+
                        '</div>' +
                        '<div style="float:right" mbsc-calendar-prev class="cal-header-prev"></div>' +
                        '<div style="float:right" mbsc-calendar-next class="cal-header-next"></div>';
            },
            renderEvent: function (data) {
                return '<div class="md-full-event-details">' +
                    '<div class="md-full-event-title">' + data.original.event_title + '</div>' +
                    '<div class="md-full-event-location">' +
                    '<div class="md-full-event-label">Location</div><div>' + data.original.event_type + '</div>' +
                    '</div><div class="md-full-event-time">' +
                    '<div class="md-full-event-label">Time</div><div>' + (new Date(Number(data.original.event_datetime))).toString().slice(4,16) + '</div>' +
                    '</div></div></div>';
                return '<div class="md-full-event"><img class="md-full-event-img" src="https://img.mobiscroll.com/demos/' + data.original.img + '" />' +
                    '<div class="md-full-event-details">' +
                    '<div class="md-full-event-title">' + data.event_title + '</div>' +
                    '<div class="md-full-event-location">' +
                    '<div class="md-full-event-label">Location</div><div>' + JSON.parse(data.details).venue_name + '</div>' +
                    '</div><div class="md-full-event-time">' +
                    '<div class="md-full-event-label">Time</div><div>' + (new Date(data.event_datetime)).toString().slice(4,16) + '</div>' +
                    '</div></div></div>';
            },
            onEventClick: function (event, inst) {
                console.log(event);
                calendar.showEvent(event);
            },
            renderLabel: function (data) {
                if (data.isMultiDay) {
                    return '<div  style="cursor:pointer;color:#444;background:#6699ff;padding:5px;border-radius:5px;font-size:18px;" class="multi-day-event">' + data.original.title + '</div>';
                } else {
                    return '<div class="single-day-event" style="cursor:pointer;color:#444;background:#6699ff;padding:5px;border-radius:5px;font-size:18px;">' + data.original.title + '</div>';
                }
            },
            responsive: {
                custom: { // Custom breakpoint
                    breakpoint: 600,
                    view: {
                        calendar: { 
                            labels: true
                        }
                    }
                }
            }
        });
        
        /* websiteData.events.forEach((event)=>{
            this.instance.setEvents(event)
        }) */
        (websiteData.events, function (events) {
            inst.setEvents(events);
        }, 'jsonp');
        /* mobiscroll.util.http.getJson('https://trial.mobiscroll.com/agenda-events/', function (events) {
            calendar.instance.setEvents(events);
        }, 'jsonp'); */

        setTimeout(() => {
            websiteData.events.forEach((event)=>{
                calendar.instance.addEvent(event)
            })
        }, 2000);
        
        document.querySelectorAll('.md-view-change').forEach(function (elm) {
            elm.addEventListener('change', function (ev) {
                switch (ev.target.value) {
                    case 'month':
                        calendar.instance.setOptions({
                            view: {
                                calendar: { type: 'month' },
                                agenda: { type: 'month' },
                            }
                        })
                        break;
                    case 'week':
                        calendar.instance.setOptions({
                            view: {
                                calendar: { type: 'week' },
                                agenda: { type: 'week' },
                            }
                        })
                        break;
                    case 'day':
                        calendar.instance.setOptions({
                            view: {
                                agenda: { type: 'month' }
                            }
                        })
                        break;
                    case 'calendar':
                        calendar.instance.setOptions({
                            view: {
                                calendar: { labels: true }
                            }
                        })
                        break;
                }
            });
        });
    }
}