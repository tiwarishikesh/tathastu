config = {
    serviceurl : '/service/'
}

let old_path  = {};
let path      = {};
let base_path = "";
let data;
let file      = '';
let file_one  = '';
let file_two  = '';

$(document).ready(()=>{
    checklogin();
})

function togglePasswordField(){
    if($("#password").attr('type')=="password"){
        $("#password").attr('type','text');
        $("#password").parent().addClass('passwordvisible');
    }else{
        $("#password").attr('type','password');
        $("#password").parent().removeClass('passwordvisible');
    }
}

function checklogin() {
    xhttp.get('authentication').then((response)=>{
        logUserIn(response);
    }).catch(()=>{
        showsnackbar('Please Log in to continue');
        $('cover').remove();
    })
}

auth = {
    logout: function(){
        $('body').attr('auth', 'false');
        localStorage.setItem('auth', 'false');
        xhttp.delete('auth', {}, {}).then(() => {
            window.location.reload();
        })
    }
}

function login() {
    let error = false;

    let payload = {
        email    : $("#loginID").val()  ? $("#loginID").val()  : (error= true, alert('Use ID')),
        password : $("#password").val() ? $("#password").val() : (error= true, alert('Use Password'))
    }

    if(!error){
        xhttp.post('authentication',payload).then((response)=>{
            logUserIn(response);
        })
    }
}

function refreshEverything(){
    showsnackbar('Refresh Everything');
}

function uploadPDF() {
    if(!file){
        return false;
    }
    let formData = new FormData();
    formData.append("file",true);
    formData.append("pdf",file[0]);
    $.ajax({
        type: "POST",
        url: '/service/upload',
        data: formData,
        dataType: 'json',
        contentType: false,
        processData: false,
        success: function (response) {
            console.log('succes!!');
        },
        error: function (error) {
            console.log('error');
        }
    });
}

function logUserIn(user) {
    user = user.user;
    showsnackbar(`Hello, ${user.fname}`);
    $("login").remove();
    $('account').show();

    xhttp.get('init').then((response)=>{
        data = response;
        
        populate_data();
        setInterval(() => {
            checkUrl();
        }, 100);
    
        setTimeout(() => {
            const fileSelector = document.getElementById('file-selector');
            fileSelector.addEventListener('change', (event) => {
                const fileList = event.target.files;
                var fr = new FileReader();                
                    /* console.log(fr.readAsText(fileList[0])) */
                    file = fileList;
                    if(file[0]){
                        $(".file_chosen_state").text(file[0].name);
                        $(".file_chosen_state").attr("type",file[0].type);
                    }else{
                        $(".file_chosen_state").text("Choose File or Drag your file over this");
                        $(".file_chosen_state").attr("type",null);
                    }
            });

            const fileSelectorTwo = document.getElementById('consent-one');
            fileSelectorTwo.addEventListener('change', (event) => {
                const fileList = event.target.files;
                var fr = new FileReader();                
                    /* console.log(fr.readAsText(fileList[0])) */
                    
                    file_one = fileList;
                    if(file_one[0]){
                        let formData = new FormData();
                        formData.append("file",true);
                        formData.append("pdf",file_one[0]);
                        $(".file_chosen_state:eq(0)").text(file_one[0].name);
                        $(".file_chosen_state:eq(0)").attr("type",file_one[0].type);
                        $.ajax({
                            type: "POST",
                            url: '/service/upload-doc-one',
                            data: formData,
                            dataType: 'json',
                            contentType: false,
                            processData: false,
                            success: function (response) {
                                showsnackbar('Uploading Document');
                                
                                response.id = $(".data-to-edit-title:eq(0)").attr('current-member');
                                xhttp.post("document-one",response).then(()=>{
                                    showsnackbar('Document Name Updated');
                                    refreshData();
                                })
                            },
                            error: function (error) {
                                console.log('error');
                            }
                        });
                    }else{
                        $(".file_chosen_state:eq(0)").text("Choose File or Drag your file over this");
                        $(".file_chosen_state:eq(0)").attr("type",null);
                    }
            });

            const fileSelectorThree = document.getElementById('consent-two');
            fileSelectorThree.addEventListener('change', (event) => {
                const fileList = event.target.files;
                var fr = new FileReader();                
                    /* console.log(fr.readAsText(fileList[0])) */
                    
                    file_two = fileList;
                    if(file_one[0]){
                        let formData = new FormData();
                        formData.append("file",true);
                        formData.append("pdf",file_two[0]);
                        $(".file_chosen_state:eq(1)").text(file_two[0].name);
                        $(".file_chosen_state:eq(1)").attr("type",file_two[0].type);
                        $.ajax({
                            type: "POST",
                            url: '/service/upload-doc-one',
                            data: formData,
                            dataType: 'json',
                            contentType: false,
                            processData: false,
                            success: function (response) {
                                showsnackbar('Uploading Document');
                                
                                response.id = $(".data-to-edit-title:eq(1)").attr('current-member');
                                xhttp.post("document-two",response).then(()=>{
                                    showsnackbar('Document Name Updated');
                                    refreshData();
                                })
                            },
                            error: function (error) {
                                console.log('error');
                            }
                        });
                    }else{
                        $(".file_chosen_state:eq(1)").text("Choose File or Drag your file over this");
                        $(".file_chosen_state:eq(1)").attr("type",null);
                    }
            });
            $('body').attr('role',user.role);
            $('header div').text('Hello, '+ user.fname);
            $('cover').remove();
            if(path.parts[0] == '' || path.parts[0] == 'login'){
                route('dashboard');
            }
        }, 500);
    })
}
function refreshData() {
    xhttp.get('init').then((response)=>{
        data = response;
        populate_data();
    });
}
function populate_data() {
    $("#myMembersTable").DataTable().destroy();
    $("#myWingsTable").DataTable().destroy();
    $("#myCommiteeTable").DataTable().destroy();


    $("#myMembersTable tbody").empty();
    setTimeout(() => {
        data.members.forEach((member, index)=>{
            console.log(member.contact.filter(x => x.contact_type == "email")[0]);
            $('#myMembersTable tbody').append(`
                <tr>
                    <td>
                        <tag class="english" style="display:block"> ${member.fname} ${member.lname}</tag>
                        <tag class="marathi"> ${member.marathi_fname|| ''} ${member.marathi_lname || ''}</tag>
                    </td>
                    <td>${member.contact.filter(x => x.contact_type == "email")[0]?.contact_detail || 'N.A.'}</td>
                    <td>${member.contact.filter(x => x.contact_type == "phone")[0]?.contact_detail || 'N.A.'}</td>
                    <td>${data.wings.filter(x => x.id == member.room?.current_wing)[0]?.name} / ${member.room?.current_room_number}</td>
                    <td>${member.consent_one ? `<i class="far fa-cloud-download" onclick="pdfviewer.show('${member.consent_one}')"></i>`:''} &nbsp; ${member.consent_two ? `<i class="far fa-cloud-download" onclick="pdfviewer.show('${member.consent_two}')"></i>`:''}</td>
                    <td><div class="new-button small-button scaled-down" style="width:max-content" onclick="startMemberEdit(${member.id})">EDIT</div></td>
                </tr>
            `);
            $("#edit_commitee_members_drop").html(`<option value=""></option>`);
            $("#edit_commitee_members_drop").append(`
                <option value="${member.id}">${member.fname} ${member.lname}</option>
            `)
        })
        $("#myMembersTable").DataTable({
            order: [[3, 'asc']]
        });
        setTimeout(() => {
            $('select[name="myMembersTable_length"]').select2();
            $("#edit_commitee_members_drop").select2();
        }, 500);
    }, 500);


    $("#myWingsTable tbody").empty();
    data.wings.forEach((wing, index)=>{
        $('#myWingsTable tbody').append(`
            <tr>
                <td>${wing.name}</td>
                <td style="text-transform:capitalize">${wing.type}</td>
                <td>${data.members.filter(x => x.room.current_wing == wing.id || x.room.new_wing == wing.id).length}</td>
                <td style="width:max-content"><div class="new-button small-button scaled-down" style="width:max-content;margin:0;" onclick="startWingEdit(${wing.id})">EDIT</div></td>
            </tr>
        `)
        if(wing.type=="old"){
            $("#member_current_wing").append(`
                <option value="${wing.id}">${wing.name}</option>
            `)
        }else{
            $("#member_new_wing").append(`
                <option value="${wing.id}">${wing.name}</option>
            `)
        }
    })
    $("#myWingsTable").DataTable({
        order: [[1, 'asc']]
    });
    $("#member_current_wing").select2();
    $("#member_new_wing").select2();
    setTimeout(() => {
        $('select[name="myWingsTable_length"]').select2();
    }, 500);


    $("#myCommiteeTable tbody").empty();
    data.commitee.forEach((commitee, index)=>{
        commitee.members = data.commitee_to_members.filter(x => x.commitee_id == commitee.id).map((x) => {
            let member = data.members.filter(member => member.id == x.user_id)[0];
            if(member){
                member.position = x.position;
            }
            return member;
        })
        console.log(commitee)
        $('#myCommiteeTable tbody').append(`
            <tr>
                <td>${commitee.name}</td>
                <td>${commitee.description}</td>
                <td>${commitee.members.map((x, index) => {return `${++index}. ${x.fname} ${x.lname} : ${x.position}`}).join(`</br>`)}</td>
                <td style="width:max-content"><div class="new-button small-button scaled-down" style="width:max-content;margin:0;" onclick="startCommiteeEdit(${commitee.id})">EDIT</div></td>
            </tr>
        `)
    })
    
    $('.documents-list-members').empty();
    $(".documents-list").empty();
    data.documents.forEach((document)=>{
        $(".documents-list-members").append(`
            <div class="container w-full p-0 single-document-members w-full">
                <div class="col-sm-3">${document.name}</div>
                <div class="col-sm-4">${document.description}</div>
                <div class="col-sm-2">Updated On:<br>${(new Date(Number(document.datetime*1000)).toString()).slice(0,24)}</div>
                <div class="col-sm-3"><div class="new-button scaled-down" onclick="documents.membersView(${document.id})">View</div></div>
            </div>
        `);
        $(".documents-list").append(`
        <div class="container w-full p-0 single-document-members w-full">
            <div class="col-sm-3">${document.name}</div>
            <div class="col-sm-3">${document.description}</div>
            <div class="col-sm-4"><small>Viewed By:</small>&nbsp; ${document.views.map(x => x.id).filter((c, index) => {
                return document.views.map(x => x.id).indexOf(c) === index;
            }).length}<br>${document.views.map((x) => {return `${x.fname} ${x.lname}: ${(new Date(Number(x.datetime*1000))).toString().slice(4,21)}`}).join('<br>')}</div>
            <div class="col-sm-2"><div class="new-button scaled-down" onclick="documents.membersView(${document.id})">View</div></div>
        </div>
        `);
    })

    $("#myCommiteeTable").DataTable();
    setTimeout(() => {
        $('select[name="myCommiteeTable_length"]').select2();
    }, 500);

}

let documents = {
    membersView: function (id) {
        xhttp.get('document',{id: id});
        pdfviewer.show(data.documents.filter(x => x.id == id)[0]?.filename);
    },
    save: function () {
        let error = false;

        let payload = {
            name        : $("#edit_document_name").val()        ? $("#edit_document_name").val()        : (showsnackbar('Please include a name for the document'), error = true),
            description : $("#edit_document_description").val() ? $("#edit_document_description").val() : (showsnackbar('Please include a name for the document'), error = true)
        }

        if(!file[0]){
            showsnackbar('Please include a file to upload');
            return false;
        }

        if(error){
            return false;
        }

        if(!file){
            return false;
        }

        let formData = new FormData();
        formData.append("file",true);
        formData.append("pdf",file[0]);
        $.ajax({
            type: "POST",
            url: '/service/upload',
            data: formData,
            dataType: 'json',
            contentType: false,
            processData: false,
            success: function (response) {
                showsnackbar('Uploading Document')
                payload.filename = response.payload;
                xhttp.post("document",payload).then(()=>{
                    showsnackbar('Document Uploaded');
                    refreshData();
                })
            },
            error: function (error) {
                console.log('error');
            }
        });


    }
}

function startMemberEdit(id) {
    let member = data.members.filter(x => x.id == id)[0];

    if(!member){
        return false;
    }

    $(".data-to-edit-title").text(`Editing: ${member.fname} ${member.lname}`);

    $("#edit_member_fname").val(member.fname);
    $("#edit_member_lname").val(member.lname);
    $(`input[name="memberRoles"][value="${member.preference}"]`).prop('checked',true);
    $("#edit_member_email").val(member.contact.filter(x => x.contact_type=="email")[0]?.contact_detail);
    $("#edit_member_phone").val(member.contact.filter(x => x.contact_type=="phone")[0]?.contact_detail);



    $("#member_current_wing").val(member.room.current_wing).trigger('change');
    $("#member_new_wing").val(member.room.new_wing).trigger('change');
    $("#member_current_room").val(member.room.current_room_number);
    $("#member_new_room").val(member.room.new_room_number);

    $(".data-to-edit-title").attr('current-member',id);

    $(".data-to-edit").show();
    $(".please-select-to-edit").hide();
}

function memberSave(){
    let error = false;

    let payload = {
        fname               : $("#edit_member_fname").val() ? $("#edit_member_fname").val() : (showsnackbar('Please Enter a Valid First Name'), error = true),
        lname               : $("#edit_member_lname").val() ? $("#edit_member_lname").val() : (showsnackbar('Please Enter a Valid Last Name'),error = true),
        marathi_fname       : $("#edit_member_fname_marathi").val() ? $("#edit_member_fname_marathi").val() : (showsnackbar('Please Enter a Valid Last Name in English'),error = true),
        marathi_lname       : $("#edit_member_lname_marathi").val() ? $("#edit_member_lname_marathi").val() : (showsnackbar('Please Enter a Valid Last Name in Marathi'),error = true),
        email               :  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test($("#edit_member_email").val()) ? $("#edit_member_email").val() : (showsnackbar('Please enter valid EmailID'),error = true),
        number              : $("#edit_member_phone").val().length > 6 ? $("#edit_member_phone").val() : (showsnackbar('Please Enter a Valid Number'), error = true),
        preference          : $('input[name="memberRoles"]:checked')?.val() ? $('input[name="memberRoles"]:checked')?.val() : (showsnackbar('Please Enter a Language Preference'),error = true),
        current_room_number : $("#member_current_room").val() ? $("#member_current_room").val() : (showsnackbar('Please mention valid current Room number'),error = true),
        current_wing        : $("#member_current_wing").val() ? $("#member_current_wing").val() : (showsnackbar('Please mention valid current Wing'),error = true),
        new_room_number     : $("#member_new_room").val() || 'NA',
        new_wing            : $("#member_new_wing").val() || 'NA'
    }
    
    if(error){
        return false;
    }

    if($(".data-to-edit-title").attr('current-member')){
        payload.id = $(".data-to-edit-title").attr('current-member');
        xhttp.put('member',payload).then(()=>{
            refreshData();
        })
    }else{
        xhttp.post('member',payload).then(()=>{
            refreshData();
        })    
    }
    
}

function cancelMemberEdit() {
    $(".data-to-edit").hide();
    $(".please-select-to-edit").show();

    $(".data-to-edit-title").attr('current-member',null);
}

function addNewMember() {
    $(".data-to-edit-title").text(`Add Nww Member`);

    $("#edit_member_fname").val('');
    $("#edit_member_lname").val('');
    $(`input[name="memberRoles"]`).prop('checked',false);
    $("#edit_member_email").val('');
    $("#edit_member_phone").val('');



    $("#member_current_wing").val('').trigger('change');
    $("#member_new_wing").val('').trigger('change');
    $("#member_current_room").val('');
    $("#member_new_room").val('');

    $(".data-to-edit").show();
    $(".please-select-to-edit").hide();
}


function startWingEdit(id) {
    let wing = data.wings.filter(x => x.id == id)[0];
    if(!wing){
        return false;
    }
    $(".data-to-edit-title").text(`Editing: ${wing.name} Wing`);
    $(".data-to-edit-title").attr('current-wing',id);

    $(`input[name="edit_wing_type"][value="${wing.type}"]`).prop('checked',true);
    $("#edit_wing_name").val(wing.name);

    $(".data-to-edit").show();
    $(".please-select-to-edit").hide();
}

function wingSave(){
    let error = false;
    let payload = {
        name: $("#edit_wing_name").val() || (showsnackbar('PLease specify the name of the wing'),error = true),
        type: $('input[name="edit_wing_type"]:checked')?.val() ? $('input[name="edit_wing_type"]:checked')?.val() : (error = true, showsnackbar('Please Specify if this is an existing wing or a new one'))
    }

    if($(".data-to-edit-title").attr('current-wing')){
        payload.id = $(".data-to-edit-title").attr('current-wing');
        xhttp.put('wings',payload).then(()=>{
            refreshEverything();
        })
    }else{
        xhttp.post('wings',payload).then(()=>{
            refreshEverything();
        });
    }
}

function cancelWingEdit() {
    $(".data-to-edit").hide();
    $(".please-select-to-edit").show();
}

function addNewWing() {
    $(".data-to-edit-title").text(`Add New Wing`);

    $(`input[name="edit_wing_type"]`).prop('checked',false);
    $("#edit_wing_name").val('');

    $(".data-to-edit").show();
    $(".please-select-to-edit").hide();
}

function startCommiteeEdit(id) {
    let commitee = data.commitee.filter(x => x.id == id)[0];
    if(!commitee){
        return false;
    }
    $(".data-to-edit-title").text(`Editing: ${commitee.name}`);

    $("#edit_commitee_name").val(commitee.name);
    $("#edit_commitee_description").val(commitee.description);

    $("#edit_commitee_members_drop").val(data.commitee_to_members.filter(x => x.commitee_id == id).map(x => x.user_id)).trigger('change');

    $(".data-to-edit").show();
    $(".please-select-to-edit").hide();
}

function commiteeSave(){
    showsnackbar('Start to Save');
}

function cancelCommiteeEdit() {
    $(".data-to-edit").hide();
    $(".please-select-to-edit").show();
}

function addNewCommitee() {
    $(".data-to-edit-title").text(`Add New Commitee`);

    $("#edit_commitee_name").val('');
    $("#edit_commitee_description").val('');

    $("#edit_commitee_members_drop").val('').trigger('change');

    $(".data-to-edit").show();
    $(".please-select-to-edit").hide();
}

let pdfviewer = {
    show: function (name) {
        $("#viewer").attr('src','/assets/pdfjs/web/viewer.html?file=/uploads/'+name);
        $('.pdf-viewer').show();
    },
    close: function () {
        $('.pdf-viewer').hide();
    }
}

function checkUrl() {
    if (window.location.href.toLowerCase() == path.href) {
        return false;
    }
    parseURL().then(() => {
        $('.left-menu-single-item').removeClass('active');
        $(`.left-menu-single-item[linked-to="${path.parts[0]}"]`).addClass('active');
        $(`.right-menu-single-item:not([linked-to="${path.parts[0]}"])`).slideUp();
        $(`.right-menu-single-item[linked-to="${path.parts[0]}"]`).slideDown();
    })
}

function route(x, y) {
    /* Object.keys(path.params).forEach((key)=>{
        if(!(window.location.pathname.toLowerCase().includes(key))){
            delete path.params[key];
        }
    }) */
    if (x.length && !y) {
        x = x.replace('&undefined', '');
        if (window.location.href.split(window.location.origin)[1].slice(1).replace('pwa/', '') !== x) {
            config.ispwa ? history.pushState(null, null, `/pwa/` + x) : history.pushState(null, null, `/` + x);
        }
    } else if (y) {
        var temp = window.location.href.split(window.location.origin)[1].slice(1);
        if (x.length) {
            if (temp.split('?')[1]) {
                temp = x + '?' + temp.split('?')[1];
            } else {
                temp = x;
            }
        }
        if (typeof y == "object") {
            y = [y];
        }
        y.forEach((a, index) => {
                    if (Object.keys(path.params).includes(Object.keys(a)[0])) {
                        route(`${temp.split(`${Object.keys(a)[0]}=`)[0]}${Object.keys(a)[0]}=${Object.values(a)[0]}&${temp.split(`${Object.keys(a)[0]}=`)[1].split('&')[1]}`);
            } else {
                route(`${temp}${temp.includes('?') ? '&':'?'}${Object.keys(a)[0]}=${Object.values(a)[0]}`);
            }
        })
    }
}

function parseURL() {
    return new Promise((resolve, reject) => {
        if(path){
            Object.assign(old_path,path);
        }
        path.params = {};
        path.parts = {};
        $.each(window.location.search.toLowerCase().slice(1).split('&'), function(index) {
            if (this.includes('=') && this.split('=')[0] && this.split('=')[1]) {
                path.params[this.split('=')[0]] = this.split('=')[1];
            }
        })
        $.each(window.location.pathname.toLowerCase().slice(base_path.length+1).split('/'), function(index) {
            path.parts[`path_part_${index}`] = this.toString();
            $('body').attr(`path_part_${index}`, this.toString());
        })
        $.each($('body')[0].attributes, function(index) {
            if (this.specified && this.name.indexOf('path_part_') == 0) {
                path.parts[this.name] ? $('body').attr(this.name, path.parts[this.name]) : $('body').removeAttr(this.name);
            }
        })
        $('body').attr('curr_page', JSON.stringify(window.location.pathname.toLowerCase().slice(base_path.length+1).split('/')));
        path.pathname = window.location.pathname.toLowerCase().slice(1);
        path.href = window.location.href.toLowerCase();
        path.parts = Object.values(path.parts);
        /* tracker.urlPathChanged(); */
        //gtag_update     //DO NOT REMOVE
        resolve();
    })
}

let ajax = function(type, data, endpoint, callback) {
    if (type.toString().toLowerCase() == 'get') {
        $.ajax({
            url: config.serviceurl + endpoint,
            data: data,
            type: "GET",
            datatype: "application/json",
            headers: {
                type: "application/json"
            },
            success: function(response) {
                if (response.status == "success") {
                    callback(response.payload);
                }
            }
        })
    } else {
        $.ajax({
            url: config.serviceurl + endpoint,
            type: type,
            datatype: "application/json",
            data: JSON.stringify(data),
            headers: {
                type: "application/json"
            },
            success: function(response) {
                if (response.status == "success") {
                    if (response.status == "success") {
                        callback(response.payload);
                    }
                }
            }
        })
    }
}

async function http_call(type,data,endpoint) {
    return new Promise((resolve,reject)=>{
        $.ajax({
            url: config.serviceurl + endpoint,
            data: type.toString().toLowerCase() == 'get' ? data : JSON.stringify(data),
            type: type,
            datatype: "application/json",
            headers: {
                type: "application/json"
            },
            success:function(response){
                resolve(response.payload);
            },
            error:((xhr, status, error)=>{
                console.log(xhr, status, error);
                reject(xhr, status, error);
            })
        })
    })
}

xhttp =  {
    default: function(type,data,endpoint,options){
        return new Promise((resolve,reject)=>{
            $.ajax({
                url: endpoint.startsWith('http')? endpoint:  config.serviceurl + endpoint,
                data: type.toString().toLowerCase() == 'get' ? data : JSON.stringify(data),
                type: type,
                datatype: "application/json",
                headers: {
                    type: "application/json"
                },
                timeout: options?.timeout || 60000,
                success:function(response){
                    if(response.status == "success"){
                        resolve(response.payload);
                    }else{
                        reject({status:"200 OK",ResponseData: response});
                    }
                },
                error:((xhr, status, error)=>{
                    reject({status: xhr?.status, message: xhr?.responseJSON?.response});
                })
            })
        })
    },
    ...Object.assign(
        ...['get','post','put','delete','head','patch', 'options'].map(k => ({ [k]: 
        async function(endpoint, data, options){
            return this.default(k, data, endpoint, options);
        }
     })))
}

window.addEventListener('unhandledrejection', function(event) {
    if(event.reason.status == 403){
        event.preventDefault();
        showsnackbar('Please log in with an authorized account');
        console.warn(event);
        return false;
    }
});

function ajax_promise(type,data,endpoint) {
    return $.ajax({
        url: config.serviceurl + endpoint,
        data: type.toString().toLowerCase() == 'get' ? data : JSON.stringify(data),
        type: type,
        datatype: "application/json",
        headers: {
            type: "application/json"
        }
    })
}

let template_engine = function(identifier, replacements, callback, options) {
    return new Promise((resolve,reject)=>{
        let divTag = '';
        if(!Array.isArray(replacements)){
            replacements = [replacements];
        }
        $.each(replacements,function (index,replacement) {
            let template;
            if(/<([A-Za-z][A-Za-z0-9]*)\b[^>]*>(.*?)<\/\1>/.test(identifier)){
                template = identifier;
            }else {
                template = $(`templates ${identifier}`).parent().html()?.toString();
            }

            if(!template){
                reject('Check Identifier');
            }
            for (const property in replacement) {
                template = template.replace(new RegExp('{{' + property + '}}', 'g'), replacement[property]);
            }
            if(template.includes('{{index}}')){
                template = template.replace(new RegExp('{{index}}', 'g'), index);
            }
            divTag += template;
        })
        callback ? /function\(|[\)\*\{\}]/.test(callback.toString()) ? callback(divTag) : $(callback).length ? (options?.position == "pre" ? $(callback).prepend(divTag) : $(callback).append(divTag)) : console.log("html element doesn't exist") : console.log("Parameter missing");
        resolve(divTag);
    })
}

let payload_gen = function(selectors, callback) {
    let payload = {};
    let error = false;
    for (const [key, value] of Object.entries(selectors)) {
        values = value.split(';');
        if($(values[0]).length){
            switch($(values[0]).attr('type')){
                case 'text':
                    payload[key] = values[1] !== '*' || $(values[0]).val().length ? $(values[0]).val() : (error = true, (value[2] ? showsnackbar(values[2]):null));
                    break;
                case 'email':
                    $(values[0]).val($(values[0]).val().replace(/ /g,''));
                    payload[key] = values[1] !== '*' ||  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/.test($(values[0]).val()) ? $(values[0]).val() : (error = true, (value[2] ? showsnackbar(values[2]):null));
                    break;
                case 'number':
                    payload[key] = values[1] !== '*' || $(values[0]).val().length ? $(values[0]).val().replace(/ /g,'') : (error = true,values[2] ? showsnackbar(values[2]):null);
                    break;
                case 'password':
                    var regexpass = /^[A-Za-z0-9]\w{0,30}$/;
                    if(values[1] && values[1].indexOf("#")!==-1 && $(values[1]).attr('type')=="password"){
                        payload[key] = values[1]!== '*' || regexpass.test($(values[0]).val()) ? ($(values[0]).val() == $(values[1]).val() ? $(values[0]).val() : (error = true, showsnackbar('Passwords do not match'))) : (error = true, showsnackbar('Please Enter password'));
                    }else{
                        payload[key] = values[1]!== '*' || regexpass.test($(values[0]).val()) ? $(values[0]).val() : (error = true, (value[2] ? showsnackbar(values[2]):null));
                    }
                    break;
            }
         }else{
            console.log(`Element ${values} not found`);
         }
    }
    if (callback) {
        error ? callback(false) : callback(payload);
    }
}

function copyToClipboard(value) {
    $('body').append(`<input type="text" value="${value}" id="myInput">`)
  var copyText = document.getElementById("myInput");
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(copyText.value);
  showsnackbar(`Copied ${value}`);
  setTimeout(() => {
    $("#myInput").remove();
  }, 100);
}

function showsnackbar(x) {
    console.log(x);
    if($(window).width()>900){
        Snackbar.show({
            pos: 'top-center',
            showAction: false,
            text: x
        });
    }else{
        Snackbar.show({
            pos: 'top-center',
            showAction: false,
            text: x
        });
    }
}

const zeroPad = (num, places) => String(num).padStart(places, '0');

var Detect = {
    init: function() {
        this.OS = this.searchString(this.dataOS);
    },
    searchString: function(data) {
        for (var i = 0; i < data.length; i++) {
            var dataString = data[i].string;
            var dataProp = data[i].prop;
            if (dataString) {
                if (dataString.indexOf(data[i].subString) != -1)
                    return data[i].identity;
            } else if (dataProp)
                return data[i].identity;
        }
    },
    dataOS: [{
            string: navigator.userAgent,
            subString: 'iPhone',
            identity: 'iOS'
        },
        {
            string: navigator.userAgent,
            subString: 'iPad',
            identity: 'iOS'
        },
        {
            string: navigator.userAgent,
            subString: 'iPod',
            identity: 'iOS'
        },
        {
            string: navigator.userAgent,
            subString: 'Android',
            identity: 'Android'
        },
        {
            string: navigator.platform,
            subString: 'Linux',
            identity: 'Linux'
        },
        {
            string: navigator.platform,
            subString: 'Win',
            identity: 'Windows'
        },
        {
            string: navigator.platform,
            subString: 'Mac',
            identity: 'macOS'
        }
    ]
};

mandatory = () => {
    return new Promise(function(resolve, reject) {
        throw new Error('Missing parameter!');
        resolve();
    })
}

var IP = {
    get: function () {
        return new Promise((resolve, reject)=>{
            if(this.IPData){
                resolve(this.IPData);
            }else{
                this.fetch().then(()=>{
                    resolve(this.IPData)
                });
            }
        })
    },
    fetch: function () {
        return new Promise((resolve, reject)=>{
            $.ajax({
                url: "http://ip-api.com/json",
                type: 'GET',
                success: function(json)
                {
                    IP.IPData = json;
                    resolve();
                },
                error: function(err)
                {
                  console.log("Request failed, error= " + err);
                }
              });
        })   
    }
}

RegexCheck = {
    default : function (type, value, options) {
        return this.regexes[type].test(value);
    },
    ...Object.assign(
        ...['email','phone','password'].map(k => ({ [k]: 
        async function(value, options){
            return this.default(k, value, options);
        }
     }))),
     regexes:{
         email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/,
         password: /^(?=.*[0-9])(?=.*[!@#$%^&*-])[a-zA-Z0-9!@#$%^&*-]{6,30}$/
     }
}