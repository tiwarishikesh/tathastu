let socket= {
    init: function () {
        this.timeKeeper = {
            short : Number((new Date()).getTime())/1000,
            long  : Number((new Date()).getTime())/1000
        };
        if(auth.memberData){
            network.read().then(()=>{
                chat.getAll();
            })
        }else{
            setTimeout(() => {
                network.read().then(()=>{
                    chat.getAll();
                })
            }, 1000);
        }
        /* this.call(); */
    },
    call: function() {
        xhttp.get('socket',socket.timeKeeper, {timeout: 1000*this.timer}).then((response)=>{
            socket.processResponse(response);
        }).catch(()=>{
            socket.call();
        });        
    },
    processResponse: function () {
        console.log(response);
    },
    timer: 15
}

chat = {
    close: function () {
        $(".single-chat-body").hide();
        $(".chats-archive").show();
        $(".single-chat-view").hide();
        chat.currentChat = null;
    },
    refresh: function () {
        xhttp.get('chat').then((response)=>{
            if(JSON.stringify(chat.og) == JSON.stringify(response)){
                /* console.log('no change'); */
            }else{
                /* console.log('Something changed'); */
                chat.archive = JSON.parse(JSON.stringify(response));
                chat.og = JSON.parse(JSON.stringify(response));
                chat.populate();
            }
        })
    },
    getAll: function () {
        return new Promise((resolve, reject)=>{
            xhttp.get('chat').then((response)=>{
                chat.archive = JSON.parse(JSON.stringify(response));
                chat.og = JSON.parse(JSON.stringify(response));
                chat.populate();
                resolve();
                setInterval(() => {
                    chat.refresh();
                }, 5000);
            })
        });
    },
    init: function (id) {
        xhttp.post('chat',{id: id}).then((response)=>{
            chat.open(response);
        });
    },
    populate: function () {
        chat.archive.forEach(chat => {
            let other_guy;
            if(chat.member_one == auth.memberData.personal.id){
                other_guy = network.data.member.filter(x => x.id == chat.member_two)[0];
                chat.person_id = other_guy.id;
                chat.person_name = other_guy.fname+ ' ' + other_guy.lname;
                chat.person_photo = other_guy.photo ? `/service/build/${other_guy.photo}` : 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png';
                chat.last_message = chat.messages[chat.messages.length - 1] ? chat.messages[chat.messages.length - 1].message : 'Start of chat';
                chat.last_msg_time = (new Date(Number(chat.messages[0]?.time))).toString().slice(21,24);
            }else{
                other_guy = network.data.member.filter(x => x.id == chat.member_one)[0];
                chat.person_id = other_guy.id
                chat.person_name = other_guy.fname+ ' ' + other_guy.lname;
                chat.person_photo = other_guy.photo ? `/service/build/${other_guy.photo}` : 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png';
                chat.last_message = chat.messages[chat.messages.length - 1] ? chat.messages[chat.messages.length - 1].message : 'Start of chat';
                chat.last_msg_time = (new Date(Number(chat.messages[0]?.time))).toString().slice(21,24);
            }
        });
        $('.chats-archive .single-chat-wrapper').remove();
        template_engine(".single-chat-wrapper", chat.archive, ".chats-archive").then(()=>{
            if(chat.currentChat){
                chat.open(chat.currentChat);
            }
        });
    },
    open: function (id){
        $(".single-chat-body").show();
        $(".chats-archive").hide();
        $(".single-chat-view").show();
        let mychat = chat.archive.filter(x => x.id == id)[0];
        chat.currentChat = id;
        mychat.messages.forEach((message)=>{
            if(message.sender == auth.memberData.personal.id){
                message.sor = 'sent';
                message.verboseTime = (new Date(message.time)).toString().slice(16,24);
            }else{
                message.sor = 'recieved';
                message.verboseTime = (new Date(message.time)).toString().slice(16,24);
            }
        });
        $(".single-chat-body-message").empty();
        $(".single-chat-view img").attr('src',mychat.person_photo);
        $(".single-chat-view h4").text(mychat.person_name);
        $(".single-chat-view h4").attr('onclick',`route('network/${mychat.person_id}')`);
        $(".single-chat-view img").attr('onclick',`route('network/${mychat.person_id}')`);
        template_engine(".single-message",mychat.messages, ".single-chat-body-message");
    },
    sendMessage: function () {
        if(!chat.currentChat || !$(".newmessagebody").val()){return  false}

        xhttp.post('chatMessage',{
            chat_id: chat.currentChat,
            message: $(".newmessagebody").val()
        }).then((response)=>{
            $(".newmessagebody").val('');
        })
    }
}

let chapter = {
    loadInvoices:function () {
        chapter.MyChapterData = websiteData.chapters.filter(x => x.admins.map(x => x.member_id).includes(auth.memberData.personal.id))[0];
        xhttp.get('chapterInvoices',{id: chapter.MyChapterData.id}).then((response)=>{
            chapter.populateInvoices(response);
        })
    },
    populateInvoices: function (invoices) {
        $(".chapter-invoices-archive").empty();
        invoices.forEach((invoice)=>{
            $(".chapter-invoices-archive").append(`
            <div class="container w-full p-0">
                <div class="col-sm-6">
                    <h5>${invoice.item}</h5>
                    <h6>${invoice.item_description}</h6>
                </div>
                <div class="col-sm-3">
                    <p>${(new Date(invoice.timestamp*1000)).toString().slice(4,21)}</p>
                </div>
                <div class="col-sm-3" style="cursor:pointer;" onclick="chapter.chapterSingleInvoices(${invoice.id})">
                    <i class="fas fa-download"></i>
                </div>
            </div>
            `)
        })
    },
    chapterSingleInvoices: function (id) {
        xhttp.get('chapterSingleInvoices',{id: id}).then((response)=>{
            var myWindow = window.open("", "","width=1200,height=800");
            myWindow.document.write(response);
        })
    },
    pay_dues: function () {
        let payload= {
            id: chapter.MyChapterData.id
        }
        xhttp.put('chapterDues', payload).then(()=>{
            network.load().then(async ()=>{
                websiteData = await xhttp.get('init');
                chapter.edit();
            })
        })
    },
    new: function () {
        network.read().then(()=>{
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
            $("#newChapterLeaders").select2({
                data: selectData,
                templateResult: function (d) { return $(d.dropdownTemplate)},
                templateSelection: function (d) { return $(d.dropdownTemplate)}
            });
            /* $("#newChapterViceChairman").select2({
                data: selectData,
                templateResult: function (d) { return $(d.dropdownTemplate)},
                templateSelection: function (d) { return $(d.dropdownTemplate)}
            });
            $("#newChapterSecretary").select2({
                data: selectData,
                templateResult: function (d) { return $(d.dropdownTemplate)},
                templateSelection: function (d) { return $(d.dropdownTemplate)}
            });
            $("#newChapterTreasurer").select2({
                data: selectData,
                templateResult: function (d) { return $(d.dropdownTemplate)},
                templateSelection: function (d) { return $(d.dropdownTemplate)}
            }); */
            getCountryArray().then(async (response)=>{
                let CountrySelectData = await response.map((x) => {
                    return {
                        id: x.value,
                        dropdownTemplate: `<div class="container w-full p-0">
                                                <div class="col-xs-1">
                                                    <img style="width:100%;max-width:35px" src="${x.image}">
                                                </div>
                                                <div class="col-xs-10">
                                                    ${x.text}
                                                </div>
                                            </div>`
                    }
                })
                console.log(CountrySelectData);
                $("#newChapterAddressCountry").select2({
                    data: CountrySelectData,
                    templateResult: function (d) { return $(d.dropdownTemplate)},
                    templateSelection: function (d) { return $(d.dropdownTemplate)}
                })
                IP.get().then((res)=>{
                    console.log(res.countryCode);
                    $("#newChapterAddressCountry").val(res.countryCode).trigger("change");
                });
                myGoogleMap.init("newChapterLocation");
                myGoogleMap.geocodePosition();
            })
        })
    },
    apply: function () {
        let error = false;
        let payload = {
            name: $("#newChapterName").val() || (showsnackbar('Please Provide a Chapter Name'), error = true),
            club: $("#newChapterClub").val() || (showsnackbar('Please Provide a Chapter Name'), error = true),
            description: $("#newChapterDescription").val() || (showsnackbar('Please Provide a Chapter Name'), error = true),
            address: $("#newChapterAddress").val() || (showsnackbar('Please Provide a Chapter Adress'), error = true),
            state: $("#newChapterAddressState").val() || (showsnackbar('Please Provide State'), error = true),
            pin: $("#newChapterAddressPin").val() || (showsnackbar('Please Provide a Pin/Area Code'), error = true),
            country: $("#newChapterAddressCountry").val() || (showsnackbar('Please Provide Country'), error = true),
            email: RegexCheck.regexes.email.test($("#newChapterEmail").val()) || (showsnackbar('Please Provide Official Email ID'), error = true),
            ridistrict: $("#newChapterDistrict").val() || (showsnackbar('Please Provide Chapter District'), error = true),
            lat: myGoogleMap.draggable_marker.getPosition().lat(),
            lng: myGoogleMap.draggable_marker.getPosition().lng()
        }
        payload.heads = [];
        [
            {leader:"newChapterLeaders"}
        ].forEach((drop)=>{
            $(`#${Object.values(drop)[0]}`).val().forEach((head)=>{
                let b= {};
                b[Object.keys(drop)[0]] = head;
                payload.heads.push(b);
            })
        })
        if(error) {return false};

        xhttp.post('chapter',payload).then((response)=>{
            route('account/chapter-edit');
            window.location.reload();
        })
    },
    edit: function () {
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
            $("#updateChapterLeaders").select2({
                data: selectData,
                templateResult: function (d) { return $(d.dropdownTemplate)},
                templateSelection: function (d) { return $(d.dropdownTemplate)}
            });
            /* $("#updateChapterViceChairman").select2({
                data: selectData,
                templateResult: function (d) { return $(d.dropdownTemplate)},
                templateSelection: function (d) { return $(d.dropdownTemplate)}
            });
            $("#updateChapterSecretary").select2({
                data: selectData,
                templateResult: function (d) { return $(d.dropdownTemplate)},
                templateSelection: function (d) { return $(d.dropdownTemplate)}
            });
            $("#updateChapterTreasurer").select2({
                data: selectData,
                templateResult: function (d) { return $(d.dropdownTemplate)},
                templateSelection: function (d) { return $(d.dropdownTemplate)}
            }); */
            getCountryArray().then(async (response)=>{
                let CountrySelectData = await response.map((x) => {
                    return {
                        id: x.value,
                        dropdownTemplate: `<div class="container w-full p-0">
                                                <div class="col-xs-1">
                                                    <img style="width:100%;max-width:35px" src="${x.image}">
                                                </div>
                                                <div class="col-xs-10">
                                                    ${x.text}
                                                </div>
                                            </div>`
                    }
                })
                $("#updateChapterAddressCountry").select2({
                    data: CountrySelectData,
                    templateResult: function (d) { return $(d.dropdownTemplate)},
                    templateSelection: function (d) { return $(d.dropdownTemplate)}
                })
                myGoogleMap.init("updateChapterLocation");
                chapter.MyChapterData = websiteData.chapters.filter(x => x.admins.map(x => x.member_id).includes(auth.memberData.personal.id))[0];
                if(!chapter.MyChapterData){ return false }

                $(".right-menu-single-item.chapter-edit h4:eq(0)").text("Edit Chapter: "+chapter.MyChapterData.chapter_name);

                $("#updateChapterName").val(chapter.MyChapterData.chapter_name);
                $("#updateChapterDescription").val(chapter.MyChapterData.description);
                $("#updateChapterClub").val(chapter.MyChapterData.charter_club);

                $("#updateChapterLeaders").val(chapter.MyChapterData.admins).trigger("change");
                /* $("#updateChapterViceChairman").val(chapter.MyChapterData.admins.filter(x => x.position == "vicechairman").map(x => x.member_id)).trigger("change");
                $("#updateChapterTreasurer").val(chapter.MyChapterData.admins.filter(x => x.position == "treasurer").map(x => x.member_id)).trigger("change");
                $("#updateChapterSecretary").val(chapter.MyChapterData.admins.filter(x => x.position == "secretary").map(x => x.member_id)).trigger("change"); */

                $("#updateChapterAddress").val(chapter.MyChapterData.address);
                $("#updateChapterAddressState").val(chapter.MyChapterData.state);
                $("#updateChapterAddressPin").val(chapter.MyChapterData.pincode);
                $("#updateChapterAddressCountry").val(chapter.MyChapterData.country).trigger("change");
                $("#updateChapterEmail").val(chapter.MyChapterData.email);
                $("#newChapterDistrict").val(chapter.MyChapterData.ridistrict);

                myGoogleMap.setMarker({lat: chapter.MyChapterData.latitude, lng: chapter.MyChapterData.longitude});

                if(chapter.MyChapterData.status == '1'){
                    $(".chapter-badge").css('background','darkgreen');
                    $(".chapter-badge").text('Approved');
                    if(chapter.MyChapterData.payment == "0"){
                        $(".chapter-payment-due").show();
                    }else{
                        $(".chapter-payment-due").hide();
                    }
                }else{
                    $(".chapter-badge").css('background','gray');
                    $(".chapter-badge").text('Under Review');
                    $(".chapter-payment-due").hide();
                }
            })
        })
    },
    applyEdit: function () {
        let error = false;
        let payload = {
            id: chapter.MyChapterData.id,
            name: $("#updateChapterName").val() || (showsnackbar('Please Provide a Chapter Name'), error = true),
            club: $("#updateChapterClub").val() || (showsnackbar('Please Provide a Chapter Name'), error = true),
            description: $("#updateChapterDescription").val() || (showsnackbar('Please Provide a Chapter Name'), error = true),
            address: $("#updateChapterAddress").val() || (showsnackbar('Please Provide a Chapter Adress'), error = true),
            state: $("#updateChapterAddressState").val() || (showsnackbar('Please Provide State'), error = true),
            pin: $("#updateChapterAddressPin").val() || (showsnackbar('Please Provide a Pin/Area Code'), error = true),
            country: $("#updateChapterAddressCountry").val() || (showsnackbar('Please Provide Country'), error = true),
            ridistrict: $("#updateChapterDistrict").val() || (showsnackbar('Please Provide Chapter District'), error = true),
            email: RegexCheck.regexes.email.test($("#updateChapterEmail").val()) || (showsnackbar('Please Provide Official Email ID'), error = true),
            lat: myGoogleMap.draggable_marker.getPosition().lat(),
            lng: myGoogleMap.draggable_marker.getPosition().lng()
        }
        payload.heads = [];
        [
            {leaders:"updateChapterChairman"}
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

        xhttp.put('chapter',payload).then((response)=>{
            network.load().then(async ()=>{
                websiteData = await xhttp.get('init');
                chapter.edit();
            })
        })
    },
    membersview: function () {
        if (!quillEditors.ChapterAdminAboutSection) {
            quillEditors.ChapterAdminAboutSection = new Quill('.chapter-admin-about-edit-section', {
                theme: 'snow'
            });
        }
        if (!quillEditors.chapterAdminAboutBusinessSection) {
            quillEditors.chapterAdminAboutBusinessSection = new Quill('.chapter-admin-business-details-edit-section', {
                theme: 'snow'
            });
        }
        /* tempDatepickers.push($("#admin_dateofjoining").bootstrapMaterialDatePicker({
            format: 'DD MMMM YYYY',
            time: false,
        })); */
        mobiscrollPickers.chapter_admin_DOJ =  mobiscroll.datepicker('#chapter_admin_dateofjoining', {
            controls: ['calendar'],
            dateFormat: 'YYYY',
            dateWheels: '|YYYY|',
            themeVariant:'light',
            theme:'ios',
            touchUi: true
        });
        tempDatepickers.push($("#chapter_admin_dob").bootstrapMaterialDatePicker({
            format: 'DD MMMM YYYY',
            time: false
        }));
        network.read().then(()=>{
            $("#myChapterMembersTable tbody").empty();
            network.data.member.filter(x => x.chapter == auth.memberData.mychapter[0].chapter_id).forEach((x)=>{
                if(x.id == auth.memberData.personal.id){
                    return false;
                }
                $("#myChapterMembersTable tbody").append(`<tr style="border-bottom:1px solid black;">
                <td> ${x.photo ? `<img src="/service/build/${x.photo}"} style="width:50px;">`:''} &nbsp; ${x.fname} ${x.lname}</td>
                <td>${x.club}</td>
                <td style="text-transform:capitalize">${x.role}</td>
                <td>${config.membership_status[x.membership_status]}</td>
                <td><div class="button bordered-button small glassy" style="margin-top:0" onclick="chapter.member.view(${x.id})"><p>EDIT</p></td>
                </tr>`);
            })
            $("#myChapterMembersTable").DataTable();
            setTimeout(() => {
                $('select[name="myChapterMembersTable_length"]').select2();
            }, 500);
        })
    },
    member: {
        view: async function (x) {
            
            let members = await (await network.read()).member;
            let member = members.filter(m => m.id == x)[0];

            $('[name="adminMemberStatus"]').prop('checked',false);
            $(".view-member .name").text(`${member.fname} ${member.lname}`);
            this.currentMember = member;
            if(this.currentMember.membership_status == "2" || this.currentMember.membership_status == "3"){
                $("#editChapterMemberPaid").prop('checked',true);
            }else {
                $("#editChapterMemberPaid").prop('checked',false);
            }
            if(this.currentMember.membership_status == "1" || this.currentMember.membership_status == "2"){
                $("#editChapterMemberApproved").prop('checked',true);
            }else{
                $("#editChapterMemberApproved").prop('checked',false);
            }
            $(`#${this.currentMember.role}`).prop("checked",true);
            $(".view-member").css('opacity',1);

            xhttp.get('admin/member',{id: member.id}).then((response)=>{
                $("#chapter_admin_fname_edit").val(response.data.personal.fname);
                $("#chapter_admin_lname_edit").val(response.data.personal.lname);
                
                if (["male", "female"].includes(response.data.personal.gender)) {
                    $(`#chapter_admin${response.data.personal.gender}`).prop('checked', true);
                    $("#chapter_admingender").val("");
                    $("#chapter_adminother").addClass('disabled');
                } else {
                    $("#chapter_adminother").prop("checked", true);
                    $("#chapter_admingender").val(response.data.personal.gender);
                    $("#chapter_adminother").removeClass('disabled');
                }
                $("#chapter_admin_clubname_edit").val(response.data.personal.club);
                $("#chapter_admin_dateofjoining").val(response.data.personal.dateofjoining);
                $("#chapter_admin_dob").val(response.data.personal.dateofbirth);

                $("#chapter_admin_organisation_name").val(response.data.professional.organisation_name);
                $("#chapter_admin_position").val(response.data.professional.position);
                $("#chapter_admin_business_adress").html(response.data.professional.organisation_address);

                if (response.data.contact.filter(x => x.contact_type == "email")[0]) {
                    $("#chapter_admin_email1").val(response.data.contact.filter(x => x.contact_type == "email")[0].details);
                }
                if (response.data.contact.filter(x => x.contact_type == "email")[1]) {
                    $("#chapter_admin_email2").val(response.data.contact.filter(x => x.contact_type == "email")[1].details);
                }
                if (response.data.contact.filter(x => x.contact_type == "phone")[0]) {
                    window.chapter_admin_phone1Edit.setNumber(response.data.contact.filter(x => x.contact_type == "phone")[0].details);
                }
                if (response.data.contact.filter(x => x.contact_type == "phone")[1]) {
                    window.chapter_admin_phone2Edit.setNumber(response.data.contact.filter(x => x.contact_type == "phone")[1].details);
                }

                quillEditors.ChapterAdminAboutSection.container.firstChild.innerHTML = response.data.personal.about || '';
                quillEditors.chapterAdminAboutBusinessSection.container.firstChild.innerHTML = response.data.professional.description || '';
            })
        },
        save: function () {
            let payload = {
                id: this.currentMember.id,
                role: $('[name="chapterMemberRoles"]:checked').val()
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
    }
}

let getCountryArray = function () {
    return new Promise((resolve, reject)=>{
        var countries = [
            { "text": "Afghanistan", "value": "AF" },
            { "text": "Åland Islands", "value": "AX" },
            { "text": "Albania", "value": "AL" },
            { "text": "Algeria", "value": "DZ" },
            { "text": "American Samoa", "value": "AS" },
            { "text": "Andorra", "value": "AD" },
            { "text": "Angola", "value": "AO" },
            { "text": "Anguilla", "value": "AI" },
            { "text": "Antarctica", "value": "AQ" },
            { "text": "Antigua and Barbuda", "value": "AG" },
            { "text": "Argentina", "value": "AR" },
            { "text": "Armenia", "value": "AM" },
            { "text": "Aruba", "value": "AW" },
            { "text": "Australia", "value": "AU" },
            { "text": "Austria", "value": "AT" },
            { "text": "Azerbaijan", "value": "AZ" },
            { "text": "Bahamas", "value": "BS" },
            { "text": "Bahrain", "value": "BH" },
            { "text": "Bangladesh", "value": "BD" },
            { "text": "Barbados", "value": "BB" },
            { "text": "Belarus", "value": "BY" },
            { "text": "Belgium", "value": "BE" },
            { "text": "Belize", "value": "BZ" },
            { "text": "Benin", "value": "BJ" },
            { "text": "Bermuda", "value": "BM" },
            { "text": "Bhutan", "value": "BT" },
            { "text": "Bolivia", "value": "BO" },
            { "text": "Bosnia and Herzegovina", "value": "BA" },
            { "text": "Botswana", "value": "BW" },
            { "text": "Bouvet Island", "value": "BV" },
            { "text": "Brazil", "value": "BR" },
            { "text": "British Indian Ocean Territory", "value": "IO" },
            { "text": "Brunei Darussalam", "value": "BN" },
            { "text": "Bulgaria", "value": "BG" },
            { "text": "Burkina Faso", "value": "BF" },
            { "text": "Burundi", "value": "BI" },
            { "text": "Cambodia", "value": "KH" },
            { "text": "Cameroon", "value": "CM" },
            { "text": "Canada", "value": "CA" },
            { "text": "Cape Verde", "value": "CV" },
            { "text": "Cayman Islands", "value": "KY" },
            { "text": "Central African Republic", "value": "CF" },
            { "text": "Chad", "value": "TD" },
            { "text": "Chile", "value": "CL" },
            { "text": "China", "value": "CN" },
            { "text": "Christmas Island", "value": "CX" },
            { "text": "Cocos (Keeling) Islands", "value": "CC" },
            { "text": "Colombia", "value": "CO" },
            { "text": "Comoros", "value": "KM" },
            { "text": "Congo", "value": "CG" },
            { "text": "Congo, The Democratic Republic of the", "value": "CD" },
            { "text": "Cook Islands", "value": "CK" },
            { "text": "Costa Rica", "value": "CR" },
            { "text": "Cote D'Ivoire", "value": "CI" },
            { "text": "Croatia", "value": "HR" },
            { "text": "Cuba", "value": "CU" },
            { "text": "Cyprus", "value": "CY" },
            { "text": "Czech Republic", "value": "CZ" },
            { "text": "Denmark", "value": "DK" },
            { "text": "Djibouti", "value": "DJ" },
            { "text": "Dominica", "value": "DM" },
            { "text": "Dominican Republic", "value": "DO" },
            { "text": "Ecuador", "value": "EC" },
            { "text": "Egypt", "value": "EG" },
            { "text": "El Salvador", "value": "SV" },
            { "text": "Equatorial Guinea", "value": "GQ" },
            { "text": "Eritrea", "value": "ER" },
            { "text": "Estonia", "value": "EE" },
            { "text": "Ethiopia", "value": "ET" },
            { "text": "Falkland Islands (Malvinas)", "value": "FK" },
            { "text": "Faroe Islands", "value": "FO" },
            { "text": "Fiji", "value": "FJ" },
            { "text": "Finland", "value": "FI" },
            { "text": "France", "value": "FR" },
            { "text": "French Guiana", "value": "GF" },
            { "text": "French Polynesia", "value": "PF" },
            { "text": "French Southern Territories", "value": "TF" },
            { "text": "Gabon", "value": "GA" },
            { "text": "Gambia", "value": "GM" },
            { "text": "Georgia", "value": "GE" },
            { "text": "Germany", "value": "DE" },
            { "text": "Ghana", "value": "GH" },
            { "text": "Gibraltar", "value": "GI" },
            { "text": "Greece", "value": "GR" },
            { "text": "Greenland", "value": "GL" },
            { "text": "Grenada", "value": "GD" },
            { "text": "Guadeloupe", "value": "GP" },
            { "text": "Guam", "value": "GU" },
            { "text": "Guatemala", "value": "GT" },
            { "text": "Guernsey", "value": "GG" },
            { "text": "Guinea", "value": "GN" },
            { "text": "Guinea-Bissau", "value": "GW" },
            { "text": "Guyana", "value": "GY" },
            { "text": "Haiti", "value": "HT" },
            { "text": "Heard Island and Mcdonald Islands", "value": "HM" },
            { "text": "Holy See (Vatican City State)", "value": "VA" },
            { "text": "Honduras", "value": "HN" },
            { "text": "Hong Kong", "value": "HK" },
            { "text": "Hungary", "value": "HU" },
            { "text": "Iceland", "value": "IS" },
            { "text": "India", "value": "IN" },
            { "text": "Indonesia", "value": "ID" },
            { "text": "Iran, Islamic Republic Of", "value": "IR" },
            { "text": "Iraq", "value": "IQ" },
            { "text": "Ireland", "value": "IE" },
            { "text": "Isle of Man", "value": "IM" },
            { "text": "Israel", "value": "IL" },
            { "text": "Italy", "value": "IT" },
            { "text": "Jamaica", "value": "JM" },
            { "text": "Japan", "value": "JP" },
            { "text": "Jersey", "value": "JE" },
            { "text": "Jordan", "value": "JO" },
            { "text": "Kazakhstan", "value": "KZ" },
            { "text": "Kenya", "value": "KE" },
            { "text": "Kiribati", "value": "KI" },
            { "text": "Korea, Democratic People'S Republic of", "value": "KP" },
            { "text": "Korea, Republic of", "value": "KR" },
            { "text": "Kuwait", "value": "KW" },
            { "text": "Kyrgyzstan", "value": "KG" },
            { "text": "Lao People'S Democratic Republic", "value": "LA" },
            { "text": "Latvia", "value": "LV" },
            { "text": "Lebanon", "value": "LB" },
            { "text": "Lesotho", "value": "LS" },
            { "text": "Liberia", "value": "LR" },
            { "text": "Libyan Arab Jamahiriya", "value": "LY" },
            { "text": "Liechtenstein", "value": "LI" },
            { "text": "Lithuania", "value": "LT" },
            { "text": "Luxembourg", "value": "LU" },
            { "text": "Macao", "value": "MO" },
            { "text": "Macedonia, The Former Yugoslav Republic of", "value": "MK" },
            { "text": "Madagascar", "value": "MG" },
            { "text": "Malawi", "value": "MW" },
            { "text": "Malaysia", "value": "MY" },
            { "text": "Maldives", "value": "MV" },
            { "text": "Mali", "value": "ML" },
            { "text": "Malta", "value": "MT" },
            { "text": "Marshall Islands", "value": "MH" },
            { "text": "Martinique", "value": "MQ" },
            { "text": "Mauritania", "value": "MR" },
            { "text": "Mauritius", "value": "MU" },
            { "text": "Mayotte", "value": "YT" },
            { "text": "Mexico", "value": "MX" },
            { "text": "Micronesia, Federated States of", "value": "FM" },
            { "text": "Moldova, Republic of", "value": "MD" },
            { "text": "Monaco", "value": "MC" },
            { "text": "Mongolia", "value": "MN" },
            { "text": "Montserrat", "value": "MS" },
            { "text": "Morocco", "value": "MA" },
            { "text": "Mozambique", "value": "MZ" },
            { "text": "Myanmar", "value": "MM" },
            { "text": "Namibia", "value": "NA" },
            { "text": "Nauru", "value": "NR" },
            { "text": "Nepal", "value": "NP" },
            { "text": "Netherlands", "value": "NL" },
            { "text": "Netherlands Antilles", "value": "AN" },
            { "text": "New Caledonia", "value": "NC" },
            { "text": "New Zealand", "value": "NZ" },
            { "text": "Nicaragua", "value": "NI" },
            { "text": "Niger", "value": "NE" },
            { "text": "Nigeria", "value": "NG" },
            { "text": "Niue", "value": "NU" },
            { "text": "Norfolk Island", "value": "NF" },
            { "text": "Northern Mariana Islands", "value": "MP" },
            { "text": "Norway", "value": "NO" },
            { "text": "Oman", "value": "OM" },
            { "text": "Pakistan", "value": "PK" },
            { "text": "Palau", "value": "PW" },
            { "text": "Palestinian Territory, Occupied", "value": "PS" },
            { "text": "Panama", "value": "PA" },
            { "text": "Papua New Guinea", "value": "PG" },
            { "text": "Paraguay", "value": "PY" },
            { "text": "Peru", "value": "PE" },
            { "text": "Philippines", "value": "PH" },
            { "text": "Pitcairn", "value": "PN" },
            { "text": "Poland", "value": "PL" },
            { "text": "Portugal", "value": "PT" },
            { "text": "Puerto Rico", "value": "PR" },
            { "text": "Qatar", "value": "QA" },
            { "text": "Reunion", "value": "RE" },
            { "text": "Romania", "value": "RO" },
            { "text": "Russian Federation", "value": "RU" },
            { "text": "RWANDA", "value": "RW" },
            { "text": "Saint Helena", "value": "SH" },
            { "text": "Saint Kitts and Nevis", "value": "KN" },
            { "text": "Saint Lucia", "value": "LC" },
            { "text": "Saint Pierre and Miquelon", "value": "PM" },
            { "text": "Saint Vincent and the Grenadines", "value": "VC" },
            { "text": "Samoa", "value": "WS" },
            { "text": "San Marino", "value": "SM" },
            { "text": "Sao Tome and Principe", "value": "ST" },
            { "text": "Saudi Arabia", "value": "SA" },
            { "text": "Senegal", "value": "SN" },
            { "text": "Serbia and Montenegro", "value": "CS" },
            { "text": "Seychelles", "value": "SC" },
            { "text": "Sierra Leone", "value": "SL" },
            { "text": "Singapore", "value": "SG" },
            { "text": "Slovakia", "value": "SK" },
            { "text": "Slovenia", "value": "SI" },
            { "text": "Solomon Islands", "value": "SB" },
            { "text": "Somalia", "value": "SO" },
            { "text": "South Africa", "value": "ZA" },
            { "text": "South Georgia and the South Sandwich Islands", "value": "GS" },
            { "text": "Spain", "value": "ES" },
            { "text": "Sri Lanka", "value": "LK" },
            { "text": "Sudan", "value": "SD" },
            { "text": "Suriname", "value": "SR" },
            { "text": "Svalbard and Jan Mayen", "value": "SJ" },
            { "text": "Swaziland", "value": "SZ" },
            { "text": "Sweden", "value": "SE" },
            { "text": "Switzerland", "value": "CH" },
            { "text": "Syrian Arab Republic", "value": "SY" },
            { "text": "Taiwan, Province of China", "value": "TW" },
            { "text": "Tajikistan", "value": "TJ" },
            { "text": "Tanzania, United Republic of", "value": "TZ" },
            { "text": "Thailand", "value": "TH" },
            { "text": "Timor-Leste", "value": "TL" },
            { "text": "Togo", "value": "TG" },
            { "text": "Tokelau", "value": "TK" },
            { "text": "Tonga", "value": "TO" },
            { "text": "Trinidad and Tobago", "value": "TT" },
            { "text": "Tunisia", "value": "TN" },
            { "text": "Turkey", "value": "TR" },
            { "text": "Turkmenistan", "value": "TM" },
            { "text": "Turks and Caicos Islands", "value": "TC" },
            { "text": "Tuvalu", "value": "TV" },
            { "text": "Uganda", "value": "UG" },
            { "text": "Ukraine", "value": "UA" },
            { "text": "United Arab Emirates", "value": "AE" },
            { "text": "United Kingdom", "value": "GB" },
            { "text": "United States", "value": "US", synonym: ['USA','United States of America'] },
            { "text": "United States Minor Outlying Islands", "value": "UM" },
            { "text": "Uruguay", "value": "UY" },
            { "text": "Uzbekistan", "value": "UZ" },
            { "text": "Vanuatu", "value": "VU" },
            { "text": "Venezuela", "value": "VE" },
            { "text": "Viet Nam", "value": "VN" },
            { "text": "Virgin Islands, British", "value": "VG" },
            { "text": "Virgin Islands, U.S.", "value": "VI" },
            { "text": "Wallis and Futuna", "value": "WF" },
            { "text": "Western Sahara", "value": "EH" },
            { "text": "Yemen", "value": "YE" },
            { "text": "Zambia", "value": "ZM" },
            { "text": "Zimbabwe", "value": "ZW" }
        ];
        
        countries.forEach((country)=>{
            country.image = 'https://cdn.jsdelivr.net/npm/svg-country-flags@1.2.10/svg/' + country.value.toLowerCase() + '.svg';
        })

        resolve(countries);
    })
}


let search = {
    state:'closed',
    searchFor: "all",
    preferenceUpdated: function () {
        search.searchFor = $('input[type="radio"][name="searchwhat"]:checked').val();
        search.initSearch();
    },
    close: function () {
        search.state = "closed";
        $('search').removeClass('full');
        $("#search_history").slideUp();
        $(".advanced-search").slideUp();
        $(".search_body").slideUp();
        search.advancedMode="deactived";
        search.initUI();
        $(".close_button").fadeOut();
        $("search_closer").hide();
    },
    initUI:function () {
        let position = $("#siteSearchBar")[0].getBoundingClientRect();
        $("search").css('left',position.x);
        $("search").css('top',position.y);
        $("search").css('height',$("#siteSearchBar").css('height'));
        $("search").css('width',$("#siteSearchBar").css('width'));  
        gsap.to($('search'), {backgroundColor:'#fff0'});
    },
    init:function () {
        if(network.data?.member){
        $(".single-recent-click").remove();
            network.data.member.forEach((member)=>{
                $(".recent_clicks").append(`<div class="single-recent-click">
                    <img src="http://localhost:8400/service/build/${member.photo}" alt="">
                <p>${member.fname}</p>
            </div>`)
            })
        }
        if(search.state=="closed"){
            $("#search_body").fadeOut();
            if(search.advancedMode == "activated"){
                $("search").css('height',Number($(".advanced-search").css('height').split('px')[0]) + 50 + 'px');
            }else{
                $("#search_history").slideDown();
                $(".advanced-search").slideUp();
                $("search").css('height',Number($("#siteSearchBar").css('height').split('px')[0]) + 250 + 'px');
            }
            $("search_closer").show();
            gsap.to($('search'), {backgroundColor:'#fff6'});
        }else{

        }
    },
    advanced: function () {
        if(search.state == "open" && search.advancedMode == "activated"){
            search.advancedMode="deactived";
            $(".advanced-search").slideUp();
            return false;
        }
        if(search.state != "open" && search.advancedMode != "activated"){
            search.advancedMode="actived";
            search.init();
        }
        search.advancedMode = "activated";
        websiteData.chapters.forEach((chapter)=>{
            $("#searchchapter").append(`<option value="${chapter.id}">${chapter.chapter_name}</option>`);
        })
        $("#searchchapter").select2();
        getCountryArray().then(async (response)=>{
            let CountrySelectData = await response.map((x) => {
                return {
                    id: x.value,
                    dropdownTemplate: `<div class="container w-full p-0">
                                            <div class="col-xs-3 p-0">
                                                <img style="width:100%;max-width:35px" src="${x.image}">
                                            </div>
                                            <div class="col-xs-7">
                                                ${x.text}
                                            </div>
                                        </div>`
                }
            });
            $("#searchcountry").select2({
                data: CountrySelectData,
                templateResult: function (d) { return $(d.dropdownTemplate)},
                templateSelection: function (d) { return $(d.dropdownTemplate)}
            });
        });
        xhttp.get('classification').then((response)=>{
            response.forEach((classi)=>{
                $("#searchclassification").append(`<option value="${classi.id}">${classi.name}</option>`);
            });
            $("#searchclassification").select2();
        });
        $("#search_history").slideUp();
        $(".advanced-search").slideDown();
        search.init();
    },
    initSearch: async function (x) {
        if(x || $("#search_input").val().length >1){
            search.state = 'open';
            $("#search_history").fadeOut('fast');
            $("search").css('left',0);
            $("search").css('top',0);
            $("search").css('height',$(window).innerHeight());
            $("search").css('width',$(window).innerWidth());  
            $('search').addClass('full');
            $(".close_button").fadeIn();
            $(".search_body").slideDown();
            gsap.to($('search'), {backgroundColor:'#fffd'});
        }
        await search.prepareData();
        network.read().then(async ()=>{
            
            options = {
                // isCaseSensitive: false,
                includeScore: true,
                // shouldSort: true,
                includeMatches: true,
                // findAllMatches: false,
                // minMatchCharLength: 1,
                // location: 0,
                threshold: $("#search_input").val().split(" ").length == 1 ?  0.2 : $("#search_input").val().split(" ").length == 2 ? 0.6 : 0.6,
                // distance: 100,
                // useExtendedSearch: false,
                // ignoreLocation: false,
                // ignoreFieldNorm: false,
                // fieldNormWeight: 1,
                keys: [
                    {name: 'name',weight:1},
                    {name: "organisation_name",weight:1},
                    {name: "club",weight:1},
                    {name: "chapterData.chapter_name",weight:1},
                    {name: "aboutForSearch",weight:1},
                    {name: "descriptionForSearch",weight:1},
                    {name: "keywords",weight:0.5},
                ]
              };

              let final_search_data = search.memberData;
              if(search.advancedMode = "activated"){
                if($("#searchcountry").val()[0]){
                    final_search_data = await final_search_data.filter(x => $("#searchcountry").val().includes(x.chapterData?.country));
                }
                if($("#searchchapter").val()[0]){
                    final_search_data = await final_search_data.filter(x => $("#searchchapter").val().includes(x.chapterData?.id));
                }
                if($("#searchclassification").val()[0]){
                    final_search_data = await final_search_data.filter(x => $("#searchclassification").val().includes(x.classification));
                }
                /* if($("#searchbusinessname").val()){
                    final_search_data = await final_search_data.filter(x => x.organisation_name.toLowerCase().includes($("#searchbusinessname").val().toLowerCase()));
                }
                if($("#searchbusinessdescription").val()){
                    final_search_data = await final_search_data.filter(x => x.descriptionForSearch.toLowerCase().includes($("#searchbusinessdescription").val().toLowerCase()));
                }
                if($("#searchabout").val()){
                    final_search_data = await final_search_data.filter(x => x.aboutForSearch.toLowerCase().includes($("#searchabout").val().toLowerCase));
                } */

              }
              
              const fuse = new Fuse(final_search_data, options);
              
              // Change the pattern
              const pattern = $("#search_input").val().replaceAll(" ","");
              
              if(pattern.length){
                search.populate(fuse.search(pattern))
              }else{
                search.populate(final_search_data)
              }

              /* const groupSearch = new Fuse(websiteData.groups, {
                includeScore: true,
                includeMatches: true,
                threshold: $("#search_input").val().split(" ").length == 1 ?  0.2 : $("#search_input").val().split(" ").length == 2 ? 0.6 : 0.6,
                keys: [
                    {name: 'name',weight:1},
                    {name: "description",weight:1}
                ]
              });
              if(pattern.length){
                search.populateGroups(groupSearch.pattern);
              }else{
                search.populateGroups(null);
              }

              const chapterSearch = new Fuse(websiteData.chapters, {
                includeScore: true,
                includeMatches: true,
                threshold: $("#search_input").val().split(" ").length == 1 ?  0.2 : $("#search_input").val().split(" ").length == 2 ? 0.6 : 0.6,
                keys: [
                    {name: 'chapter_name',weight:1},
                    {name: "description",weight:1},
                    {name: "charter_club",weight: 1}
                ]
              });
              if(pattern.length){
                search.populateChapters(chapterSearch.pattern);
              }else{
                search.populateChapters(null);
              } */
              
              search.groups();
              search.chapters();
              if(search.searchFor == "all"){
                $(".basic_search_body").show();
                $(".dedicated_search_body").hide();
              }else{
                $(".basic_search_body").hide();
                $(".dedicated_search_body").show();
              }
              if(search.searchFor == "all" || search.searchFor == "people"){
                $('.advanced-search').css('height','unset');
              }else{
                $('.advanced-search').css('height','0');
              }
        });
    },
    chapters: function () {
        $(".search_chapters").empty();
        let options = {
            // isCaseSensitive: false,
            includeScore: true,
            // shouldSort: true,
            includeMatches: true,
            // findAllMatches: false,
            // minMatchCharLength: 1,
            // location: 0,
            threshold: $("#search_input").val().split(" ").length == 1 ?  0.2 : $("#search_input").val().split(" ").length == 2 ? 0.6 : 0.6,
            // distance: 100,
            // useExtendedSearch: false,
            // ignoreLocation: false,
            // ignoreFieldNorm: false,
            // fieldNormWeight: 1,
            keys: [
                {name: 'chapter_name',weight:1},
                {name: "description",weight:1},
                {name: "adminsForSearch",weight:1}
            ]
          };
        const pattern = $("#search_input").val().replaceAll(" ","");
        const fuse2 = new Fuse(websiteData.chapters, options);
          if(pattern.length){
            if(search.searchFor == "chapter"){
                $(`.dedicated_search_body .col-sm-4`).empty();
            }
            fuse2.search(pattern).forEach((chapter, index)=>{
                if(search.searchFor == "chapter"){
                    $(`.dedicated_search_body .col-sm-4:eq(${index})`).append(`
                    <div class="container w-full p-0 single-search-chapter">
                        <h2>${chapter.item.chapter_name}</h2>
                        <h3>${chapter.item.description}</h3>
                        <h4>ADMINS: ${chapter.item.adminsForDisplay}</h4>
                    </div>
                `);
                }
                $(".search_chapters").append(`
                    <div class="container w-full p-0 single-search-chapter">
                        <h2>${chapter.item.chapter_name}</h2>
                        <h3>${chapter.item.description}</h3>
                        <h4>ADMINS: ${chapter.item.adminsForDisplay}</h4>
                    </div>
                `);
            })
          }else{
            if(search.searchFor == "chapter"){
                $(`.dedicated_search_body .col-sm-4`).empty();
            }
            websiteData.chapters.forEach((chapter, index)=>{
                if(search.searchFor == "chapter"){
                    $(`.dedicated_search_body .col-sm-4:eq(${index})`).append(`
                    <div class="container w-full p-0 single-search-chapter">
                        <h2>${chapter.chapter_name}</h2>
                        <h3>${chapter.description}</h3>
                        <h4>ADMINS: ${chapter.adminsForDisplay}</h4>
                    </div>
                `);
                }
                $(".search_chapters").append(`
                    <div class="container w-full p-0 single-search-chapter">
                        <h2>${chapter.chapter_name}</h2>
                        <h3>${chapter.description}</h3>
                        <h4>ADMINS: ${chapter.adminsForDisplay}</h4>
                    </div>
                `);
            })
          }
    },
    groups: function(){
        $("#search_events .search_groups").empty();
        let options = {
            // isCaseSensitive: false,
            includeScore: true,
            // shouldSort: true,
            includeMatches: true,
            // findAllMatches: false,
            // minMatchCharLength: 1,
            // location: 0,
            threshold: $("#search_input").val().split(" ").length == 1 ?  0.2 : $("#search_input").val().split(" ").length == 2 ? 0.6 : 0.6,
            // distance: 100,
            // useExtendedSearch: false,
            // ignoreLocation: false,
            // ignoreFieldNorm: false,
            // fieldNormWeight: 1,
            keys: [
                {name: 'name',weight:1},
                {name: "description",weight:1},
                {name: "adminsForSearch",weight:1}
            ]
            };
        const pattern = $("#search_input").val().replaceAll(" ","");
        const fuse1 = new Fuse(websiteData.groups, options);
            if(pattern.length){
            $("#search_events .search_groups").empty();
            if(search.searchFor == "group"){
                $(`.dedicated_search_body .col-sm-4`).empty();
            }
            fuse1.search(pattern).forEach((group, index)=>{
                if(search.searchFor == "group"){
                    console.log(group);
                    $(`.dedicated_search_body .col-sm-4:eq(${index})`).append(`
                    <div class="single-search-group container w-full p-0" onclick="route('network/groups/${group.item.id}');search.close()">
                        <h2>${group.item.name}</h2>
                        <h3>${group.item.description}</h3>
                        <h4>ADMINS: ${group.item.adminsForDisplay}</h4>
                    </div>
                `);
                }
                $("#search_events .search_groups").append(`
                    <div class="single-search-group container w-full p-0" onclick="route('network/groups/${group.item.id}');search.close()">
                        <h2>${group.item.name}</h2>
                        <h3>${group.item.description}</h3>
                        <h4>ADMINS: ${group.item.adminsForDisplay}</h4>
                    </div>
                `);
            })
            }else{
                if(search.searchFor == "group"){
                    $(`.dedicated_search_body .col-sm-4`).empty();
                }
                websiteData.groups.forEach((group, index)=>{
                    if(search.searchFor == "group"){
                        console.log(group);
                        $(`.dedicated_search_body .col-sm-4:eq(${index})`).append(`
                        <div class="single-search-group container w-full p-0" onclick="route('network/groups/${group.id}');search.close()">    
                            <h2>${group.name}</h2>
                            <h3>${group.description}</h3>
                            <h4>ADMINS: ${group.adminsForDisplay}</h4>
                        </div>
                    `);
                    }
                    $("#search_events .search_groups").append(`
                        <div class="single-search-group container w-full p-0" onclick="route('network/groups/${group.id}');search.close()">    
                            <h2>${group.name}</h2>
                            <h3>${group.description}</h3>
                            <h4>ADMINS: ${group.adminsForDisplay}</h4>
                        </div>
                    `);
                })
            }
    },
    populateChapters: function (x) {
        console.log(x);
        if(!x){
            $(".search_chapters").empty();
        }else{
            x.forEach((y)=>{
                let divTag = `
                    <div class="container w-full p-0" style="margin-bottom:20px" onclick="route('network/groups/${x.id}')">
                        <div class="col-xs-3">
                            
                        </div>
                        <div class="col-sm-9">
                            <h4>${y.chapter_name}</h4>
                            <h5>${y.description}</h5>
                            <h6>${y.adminsForDisplay}</h6>
                        </div>
                    </div>
                    `;
                $(".search_chapters").append(divTag);
            })
        }
    },
    populateGroups: function (x) {
        console.log(x);
        if(!x){
            $(".search_groups").empty()
        }else{
            x.forEach((y)=>{
                let divTag = `
                    <div class="container w-full p-0" style="margin-bottom:20px" onclick="route('network/groups/${x.id}')">
                        <div class="col-xs-3">
                            
                        </div>
                        <div class="col-sm-9">
                            <h4>${y.name}</h4>
                            <h5>${y.description}</h5>
                        </div>
                    </div>
                    `;
                $(".search_groups").append(divTag);
            })
        }
    },
    prepareData:    function () {
        return new Promise(async (resolve, reject)=>{
            if(search.dataPrepared){
                resolve();
                return false;
            }
            search.memberData = network.data.member;            
            search.memberData.forEach(async (member)=>{
                member.name = member.fname+' '+member.lname;
                let chapter = websiteData.chapters.filter(x => x.id == member.chapter)[0];
                member.chapterData = chapter;
                member.aboutForSearch = jQuery(member.about).text().toLowerCase();
                member.descriptionForSearch = jQuery(member.description).text().toLowerCase();
                member.keywords = `${member.name} ${member.organisation_name} ${chapter?.chapter_name} ${member.club} ${member.aboutForSearch} ${member.descriptionForSearch}`;

            });
            websiteData.chapters.forEach((chapter)=>{
                chapter.adminsForSearch = (network.data.member.filter(x => chapter.admins.map(x => x.member_id).includes(x.id)).map(x => `${x.fname} ${x.lname}`).join(' '));
                chapter.adminsForDisplay = (network.data.member.filter(x => chapter.admins.map(x => x.member_id).includes(x.id)).map(x => `${x.fname} ${x.lname}`).join(', '));
            });
            websiteData.groups.forEach((group)=>{
                group.adminsForSearch = (network.data.member.filter(x => group.admins.map(x => x.member_id).includes(x.id)).map(x => `${x.fname} ${x.lname}`).join(' '));
                group.adminsForDisplay = (network.data.member.filter(x => group.admins.map(x => x.member_id).includes(x.id)).map(x => `${x.fname} ${x.lname}`).join(', '));
            });
            search.dataPrepared = true; 
            resolve();
        })
    },
    populate: function (members) {
        $("#search_members").empty();
        if(search.searchFor == "people"){
            $(`.dedicated_search_body .col-sm-4`).empty();
        }
        members.forEach((member, index)=>{
            let x;
            let y = "";
            if(member.item){
                x = member.item;
                member.matches.forEach((match)=>{
                    y = y + `<b>${match.key}</b>: ${match.value}<br>`;
                })
            }else{
                x = member;
            }
            console.log(x);
            let divTag = `
            <div class="container w-full p-0 search-result-user" style="margin-bottom:20px;cursor:pointer" onclick="route('network/${x.id}');search.close()">
                <div class="col-xs-3">
                    <img src="${x.photo ? `/service/build/${x.photo}` : null}">
                </div>
                <div class="col-sm-9">
                    <h4>${x.fname} ${x.lname}</h4>
                    <h6>${x.chapterData?.country}</h6>
                    <h5>${x.organisation_name}</h5>
                    <p>${x.description}</p>
                </div>
            </div>
            `;

            $("#search_members").append(divTag);
            if(search.searchFor == "people"){
                $(`.dedicated_search_body .col-sm-4:eq(${index})`).append(divTag);
            }
        });
    }
}

emailTemplate = {
    loadPage:async function () {
        emailTemplate.emailers = await xhttp.get('emailTemplates');
        $('.emailers-list .single-emailer-item').remove();
        emailTemplate.emailers.forEach((emailer)=>{
            if(emailer.type == "fixed"){
                $('.emailers-list:eq(0)').append(`<div onclick="emailTemplate.startEdit(${emailer.id})" class="container w-full single-emailer-item"><p>${emailer.name}</p><p>${emailer.description}</p></div>`)
            }else{
                $('.emailers-list:eq(1)').append(`<div onclick="emailTemplate.startEdit(${emailer.id})" class="container w-full single-emailer-item"><p>${emailer.name}</p><p>${emailer.description}</p></div>`)
            }
        })
    },
    startEdit: function (id) {
        emailTemplate.currentEmailer = null;
        emailTemplate.currentEmailer = emailTemplate.emailers.filter(x => x.id == id)[0];
        if(!emailTemplate.currentEmailer){return false;}

        $('#editor-popup').css('left','0');
        $('#editor-popup h3').text(emailTemplate.currentEmailer.name);
        $('#editor-popup p:eq(0)').text(emailTemplate.currentEmailer.description);

        $('#email-editor-title').val(emailTemplate.currentEmailer.name);
        $('#email-editor-description').val(emailTemplate.currentEmailer.description);
        $('#email-editor-subject').val(emailTemplate.currentEmailer.subject);
        /* $('#email-editor-excerpt').val(emailTemplate.currentEmailer.excerpt); */

        if(emailTemplate.currentEmailer.type == "fixed"){
            $('.email-editor-left-single-panel:eq(1)').hide()
        }else{
            $('.email-editor-left-single-panel:eq(1)').show();
        }

        $('.email-editor-left-single-variable').remove();
        emailTemplate.currentEmailer.variables.forEach((variable)=>{
            $('.email-editor-left-single-panel:eq(2)').append(`<div class="email-editor-left-single-variable variable-id-${variable.id} ${variable.variableType}" onclick="copyToClipboard('${variable.variable}')">
                <p>${variable.variable}</p>
                <p>${variable.description}</p>
            </div>`);
        })
        mobiscrollPickers.customemailerdate.setVal(emailTemplate.currentEmailer.send_on);

        unlayer.loadDesign(emailTemplate.currentEmailer.design);
        setTimeout(() => {
            emailTemplate.designUpdated();
        }, 250);
    },
    designUpdated: function () {
        unlayer.exportHtml(function(data) {
            if(emailTemplate.currentEmailer == null){
                emailTemplate.emailers?.filter(x => x.type == "custom")[0].variables.forEach((variable)=>{
                    if(data.html.includes(variable.variable)){
                        $(`.variable-id-${variable.id}`).addClass('used');
                    }else{
                        $(`.variable-id-${variable.id}`).removeClass('used');
                    }
                })
            }else{
                emailTemplate.currentEmailer.variables.forEach((variable)=>{
                    if(data.html.includes(variable.variable)){
                        $(`.variable-id-${variable.id}`).addClass('used');
                    }else{
                        $(`.variable-id-${variable.id}`).removeClass('used');
                    }
                })
            }
            /* console.log(data.html.includes('{{fname}}')); */
        })
    },
    startNew: function(){
        emailTemplate.currentEmailer = null;

        $('#editor-popup').css('left','0');
        $('#editor-popup h3').text('Create New Email Template');
        $('#editor-popup p:eq(0)').text('');

        $('#email-editor-title').val('');
        $('#email-editor-description').val('');
        $('#email-editor-subject').val('');

        mobiscrollPickers.dateofJoiningRotary = mobiscroll.datepicker('#dobnew', {
            controls: ['calendar'],
            dateFormat: 'DD MMMM YYYY',
            dateWheels: '|DD MM YYYY|',
            themeVariant:'light',
            theme:'ios',
            touchUi: true,
            max: new Date('01 01 2005')
        });

        $('.email-editor-left-single-variable').remove();
        emailTemplate.emailers.filter(x => x.type == "custom")[0].variables.forEach((variable)=>{
            $('.email-editor-left-single-panel:eq(2)').append(`<div class="email-editor-left-single-variable variable-id-${variable.id} ${variable.variableType}" onclick="copyToClipboard('${variable.variable}')">
                <p>${variable.variable}</p>
                <p>${variable.description}</p>
            </div>`);
        })
    },
    saveEdit: function () {
        unlayer.exportHtml(function(data) {
            let variablesList;
            if(emailTemplate.currentEmailer == null){
                variablesList = emailTemplate.emailers.filter(x => x.type == "custom")[0].variables.filter(x => x.variableType=="compulsary");
            }else{
                variablesList = emailTemplate.currentEmailer.variables.filter(x => x.variableType=="compulsary");
            }
            if(variablesList.map(x => x.variable).every(item => data.html.includes(item))){
                let date = null;
                let constraints = null;
                let paid = null;
                let approved = null;
                if(emailTemplate.currentEmailer == null || emailTemplate.currentEmailer.type == 'custom'){
                    date = mobiscrollPickers.customemailerdate.getVal().getTime();
                    paid = $('input[name="customemailpaid"]:checked').val();
                    approved = $('input[name="customemailapproved"]:checked').val();
                }
                xhttp.post('emailTemplate', {
                    design:JSON.stringify(data.design),
                    html:data.html,
                    id: emailTemplate.currentEmailer ? emailTemplate.currentEmailer.id : 'new',
                    title: $('#email-editor-title').val(),
                    description: $("#email-editor-description").val(),
                    constraints: constraints,
                    paid: paid,
                    approved: approved,
                    date: date,
                    subject: $('#email-editor-subject').val()
                }).then((response)=>{
                    emailTemplate.closeEdit();
                    emailTemplate.loadPage();
                })
            }else{
                showsnackbar('You forgot some variables that are compulsary');
            }
        })
    },
    closeEdit: function () {
        $('#editor-popup').css('left','100vw');
    }
}