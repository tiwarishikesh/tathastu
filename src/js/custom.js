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
    setInterval(() => {
        checkUrl();
    }, 100);
});



let home = {
    init: function () {
        $("#animated-thumbnails-gallery")
        .justifiedGallery({
            captions: false,
            lastRow: "hide",
            rowHeight: 250,
            margins: 20
        })
        .on("jg.complete", function() {
            lightGallery(document.getElementById("animated-thumbnails-gallery"), {
                autoplayFirstVideo: false,
                pager: false,
                galleryId: "nature",
                flipHorizontal: false,
                flipVertical: false,
                rotateLeft: false,
                plugins: [
                    lgZoom,
                    lgThumbnail,
                    lgShare,
                    lgRotate,
                    lgFullscreen,
                    lgAutoplay
                ],
                mobileSettings: {
                    controls: false,
                    showCloseIcon: false,
                    download: false,
                    rotate: false
                }
            });
        });
        let t = $('home').height() / $(window).height();
        $(".backgrounddecorations").css('height',$('home').css('height'));
        for (let index = 0; index < 5+1; index++) {
            $(".backgrounddecorations").append(`<img class="background-decoration-images" src="assets/background-images/circle.png" style="width:35vw;top:${(index*100)-25}vh;${index % 2 == 0 ? 'right:-11vw;': 'left:-20vw;'}">`);
            $(".backgrounddecorations").append(`<img class="background-decoration-images" src="assets/background-images/${index%2==0 ? 'sun':'star'}.png" style="width:12vw;top:${(index*100)+10}vh;${index % 2 == 0 ? 'left:15vw;': 'right:15vw;'}">`);
        }
        Array.from($(".background-decoration-images")).forEach((element, index)=>{
            if(index > 1){
                gsap.to(element, {
                yPercent: 50,
                ease: "none",
                scrollTrigger: {
                    trigger: element,
                    // start: "top bottom", // the default values
                    // end: "bottom top",
                    scrub: true
                    }, 
                });
            }
        })
        gsap.to(".home-understand-out-process",{
            scrollTrigger:{
                trigger: ".home-understand-out-process",
                pin:".steps-images-wrapper",
                start:"top top",
                end: "bottom bottom",
                scrub: 1.5
            },
        });
        $(".steps-single-image-wrapper img").css('width',$(".steps-single-image-wrapper").parent().css('width'));
        $('.steps-single-image-wrapper').css('margin-top',($(window).height() - $('.steps-single-image-wrapper').height())/3);
        $(".steps-single-image-wrapper").css('width',0);
        $(".steps-single-image-wrapper:eq(0)").css('width','100%');
        $(".steps-single-image-wrapper:eq(0)").css('opacity','00');
        const t6 = gsap.timeline({
            scrollTrigger: {
                trigger: ".home-understand-out-process",
                start: "top top",
                end: "bottom bottom",
                scrub: 4,
                toggleActions: "play reverse play reverse"
            }
        });
        t6
            .to('.step-1-image', { 
                width:'100%',
                opacity:1,
                stagger: 0.5,
                ease: Power3.inOut 
            }).to('.step-2-image', { 
                width:'100%',
                stagger: 0.5,
                ease: Power3.inOut 
            }).to('.step-3-image', { 
                width:'100%',
                stagger: 0.5,
                ease: Power3.inOut 
            }).to('.step-4-image', { 
                width:'100%',
                stagger: 0.5,
                ease: Power3.inOut 
            });

    }
}

function checkUrl() {
    if (window.location.href.toLowerCase() == path.href) {
        return false;
    }
    parseURL().then(() => {
        if(path.parts[0] == "home"){
            home.init();
        }
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