$(document).ready(function() {
//------------- Video Controls -----------------------//
    var video1 = document.getElementById('Large-container-video');


    var playBtn = document.getElementById('play-btn');
    var pauseBtn = document.getElementById('pause-btn');
    var muteBtn = document.getElementById('mute-btn');
    var unmuteBtn = document.getElementById('unmute-btn');
    var stopBtn = document.getElementById('stop-btn');
    var replayBtn = document.getElementById('replay-btn');

    playBtn.addEventListener('click', pausePlayHandler, false);
    pauseBtn.addEventListener('click', pausePlayHandler, false);
    muteBtn.addEventListener('click', muteUnmuteHandler, false);
    unmuteBtn.addEventListener('click', muteUnmuteHandler, false);
    // stopBtn.addEventListener('click', stopHandler, false);
    replayBtn.addEventListener('click', replayHandler, false);

    function pausePlayHandler(e) {
        if (video1.paused) {
            // If paused, then play
            video1.play();
            // Show pause button and hide play button
            $("#play-btn").fadeOut()
            // pauseBtn.style.visibility = 'visible';
            // playBtn.style.visibility = 'hidden';
        } else {
            // If playing, then pause
            video1.pause();
            // Show play button and hide pause button
            // var el = document.getElementById("play-btn");
            // fadeIn(el, 250);
            $("#play-btn").fadeIn()

            // pauseBtn.style.visibility = 'hidden';
            // playBtn.style.visibility = 'visible';
        }
    }

    function muteUnmuteHandler(e) {
        if($(video1).prop('muted') ) {
            $(video1).prop('muted', false);
            muteBtn.style.visibility = 'visible';
            unmuteBtn.style.visibility = 'hidden';
        } else {
            $(video1).prop('muted', true);
            muteBtn.style.visibility = 'hidden';
            unmuteBtn.style.visibility = 'visible';
        }
        // if (video1.volume == 0.0) {
        //     // If muted, then turn it on
        //     video1.volume = 1.0;
        //     // Show mute button and hide unmute button
        //
        //     muteBtn.style.visibility = 'visible';
        //     unmuteBtn.style.visibility = 'hidden';
        // } else {
        //     // If unmuted, then turn it off
        //     video1.volume = 0.0;
        //     // Show unmute button and hide mute button
        //     muteBtn.style.visibility = 'hidden';
        //     unmuteBtn.style.visibility = 'visible';
        // }

    }

    function stopHandler(e) {
        // There is no stop method for HTML5 video
        // As a workaround, pause the video
        // and set currentTime to 0
        video1.currentTime = 0;
        video1.pause();
        // Show or hide other video buttons accordingly
    }

    function replayHandler(e) {
        // There is no replay method for HTML5 video
        // As a workaround, set currentTime to 0
        // and play the video
        video1.currentTime = 0;
        video1.play();
        // Show or hide other video buttons accordingly
    }
    video1.addEventListener('play', videoPausePlayHandler, false);
    video1.addEventListener('pause', videoPausePlayHandler, false);

    function videoPausePlayHandler(e) {
        if (e.type == 'play') {
            $("#play-btn").fadeOut()

            // pauseBtn.style.visibility = 'visible';
            // playBtn.style.visibility = 'hidden';
        } else if (e.type == 'pause') {
            // var el = document.getElementById("play-btn");
            // fadeIn(el, 250);
            $("#play-btn").fadeIn()

            // pauseBtn.style.visibility = 'hidden';
            // playBtn.style.visibility = 'visible';
        }
    }
//-------- progress bar ---------------//

    var vid = document.getElementById("Large-container-video");
    vid.ontimeupdate = function(){
        var percentage = ( vid.currentTime / vid.duration ) * 100;
        $(".video-progressbar span").css("width", percentage+"%");
    };

    $(".video-progressbar").on("click", function(e){
        var offset = $(this).offset();
        var left = (e.pageX - offset.left);
        var totalWidth = $(".video-progressbar").width();
        var percentage = ( left / totalWidth );
        var vidTime = vid.duration * percentage;
        vid.currentTime = vidTime;
    });//click()
//-------------------------------------------------//
//----------- Opening and Closing Large Bubble Container --------//


    $(document).on('click',".exit-btn",function (){
        setTimeout(function (){
            // $(".Step-1").removeClass("go-left")
            // $(".Step-1").removeClass("go-right")
            // $(".Step-2").removeClass("go-left")
            // $(".Step-2").removeClass("go-right")
        },300)
        video1.pause();
    })
    //---------- Switching between steps ----------//
    $("#step-1-btn").on('click',function (){
        $(".Step-1").addClass("go-left")

        video1.pause();
    })
    $(document).on('click','.back-btn',function (){
        // $(".Step-1").removeClass("go-left")
        // $(".Step-1").removeClass("go-right")
        // if ($(this).parent().parent().hasClass("Step-3")){
        //     $(".Step-2").removeClass("go-left")
        //     $(".Step-2").removeClass("go-right")
        // }else if ($(this).parent().parent().hasClass("Step-2")){
        //     $(".Step-1").removeClass("go-left")
        //     $(".Step-1").removeClass("go-right")
        //
        // }
        if ($(this).parent().parent().hasClass("Fake-Step")){
            $(".Step-1").removeClass("go-left")
            $(".Step-1").removeClass("go-right")
        }else if ($(this).parent().parent().hasClass("Step-2")){
            $(".Fake-Step").removeClass("go-left")
            $(".Fake-Step").removeClass("go-right")

        }else {
            $(".Step-1").removeClass("go-left")
            $(".Step-1").removeClass("go-right")
        }
    })
//---------- Required Functions -------------//
    function CheckContrast(color) {
        var v=0
        if (color.length >6) { color= color.substring(1,color.length)}
        var rgb = parseInt(color, 16);
        var r = Math.abs(((rgb >> 16) & 0xFF)+v); if (r>255) r=r-(r-255);
        var g = Math.abs(((rgb >> 8) & 0xFF)+v); if (g>255) g=g-(g-255);
        var b = Math.abs((rgb & 0xFF)+v); if (b>255) b=b-(b-255);
        // r = Number(r < 0 || isNaN(r)) ? 0 : ((r > 255) ? 255 : r).toString(16);
        // if (r.length == 1) r = '0' + r;
        // g = Number(g < 0 || isNaN(g)) ? 0 : ((g > 255) ? 255 : g).toString(16);
        // if (g.length == 1) g = '0' + g;
        // b = Number(b < 0 || isNaN(b)) ? 0 : ((b > 255) ? 255 : b).toString(16);
        // if (b.length == 1) b = '0' + b;
        if ((r*0.299 + g*0.587 + b*0.114) > 186){
            return true
        }else {
            return false
        }
        // return "#" + r + g + b;
    }
    function getTintedColor(color, v) {
        if (color.length >6) { color= color.substring(1,color.length)}
        var rgb = parseInt(color, 16);
        var r = Math.abs(((rgb >> 16) & 0xFF)+v); if (r>255) r=r-(r-255);
        var g = Math.abs(((rgb >> 8) & 0xFF)+v); if (g>255) g=g-(g-255);
        var b = Math.abs((rgb & 0xFF)+v); if (b>255) b=b-(b-255);
        r = Number(r < 0 || isNaN(r)) ? 0 : ((r > 255) ? 255 : r).toString(16);
        if (r.length == 1) r = '0' + r;
        g = Number(g < 0 || isNaN(g)) ? 0 : ((g > 255) ? 255 : g).toString(16);
        if (g.length == 1) g = '0' + g;
        b = Number(b < 0 || isNaN(b)) ? 0 : ((b > 255) ? 255 : b).toString(16);
        if (b.length == 1) b = '0' + b;
        return "#" + r + g + b;
    }
    //-------------------------------------------//

    var Bubble=$(".Bubble-large-container").data("bubbleinfo")
    // const article = document.querySelector(".Bubble-large-container");

    // alert(article.getAttribute('data-bubbleinfo'))
    var NotificationSound=$(".Bubble-large-container").data("notisound")
    $(video1).attr('src','https://completegreet.com/files/users/'+Bubble.UserId+'/Bubble-Videos/'+Bubble.BubbleVideo)
    if (CheckContrast(Bubble.BubbleBackgroundColor)){
            $(".live-chat-name").css('color',"#000000")
            $("#Name-Message").css('color',"#000000")
            $("#Email-Message").css('color',"#000000")
            $(".multi-step-input-label").css('color',"#000000")


        }else {
            $(".live-chat-name").css('color',"#ffffff")
            $("#Name-Message").css('color',"#ffffff")
            $("#Email-Message").css('color',"#ffffff")
            $(".multi-step-input-label").css('color',"#ffffff")

        }
    $(".send-message-container").css('background-color',Bubble.BubbleBackgroundColor)
    //----------------------------------//
    var darkenColor=  getTintedColor(Bubble.BubbleButtonColor,-50)
    $(".multi-step-btn").css('background-color',Bubble.BubbleButtonColor)
    $(".sender-left-msg").css("background-color",Bubble.BubbleButtonColor)
     $("#send-msg-btn").css("background-color",Bubble.BubbleButtonColor)
 $("#fake-send-msg-btn").css("background-color",Bubble.BubbleButtonColor)
    
    $(".sender-left-msg").css("border-color",Bubble.BubbleButtonColor)

    $(".multi-step-btn").css('border-color',darkenColor)
    if (CheckContrast(Bubble.BubbleButtonColor)){
        $(".multi-step-btn").css('color',"#000000")
        $(".sender-left-msg").css('color',"#000000")
        $("#send-msg-btn").css('color',"#000000")
$("#fake-send-msg-btn").css('color',"#000000")

    }else {
        $(".multi-step-btn").css('color',"#ffffff")
        $(".sender-left-msg").css('color',"#ffffff")
        $("#send-msg-btn").css('color',"#ffffff")
$("#fake-send-msg-btn").css('color',"#ffffff")

    }
    //---------------------------------------//
    if(Bubble.BubbleVideoFit) {

        $("#Large-container-video").css('object-fit','cover')

    }else {
        $("#Large-container-video").css('object-fit','contain')

    }
    if (Bubble.BubbleName=='' ||!Bubble.BubbleName.replace(/\s/g, '').length){
        $(".live-chat-name").text('LIVE CHAT')
        $(".Toast-Name").text('LIVE CHAT')

    }else {
        $(".live-chat-name").text(Bubble.BubbleName)
        $(".Toast-Name").text(Bubble.BubbleName)

    }
    //------------------------------//
//-------------- Checking Email Address ---------------//
    function isEmail(email) {
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(email);
    }
    //----------- Generating Random Strings ---------------//
    function makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }
//-------------------------------------------//

    function createCookie(name, value, days) {
        var expires;
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toGMTString();
        }
        else {
            expires = "";
        }
        document.cookie = name + "=" + value + expires + "; path=/";
    }

    function getCookie(c_name) {
        if (document.cookie.length > 0) {
            c_start = document.cookie.indexOf(c_name + "=");
            if (c_start != -1) {
                c_start = c_start + c_name.length + 1;
                c_end = document.cookie.indexOf(";", c_start);
                if (c_end == -1) {
                    c_end = document.cookie.length;
                }
                return unescape(document.cookie.substring(c_start, c_end));
            }
        }
        return "";
    }
    function delete_cookie(name) {
        document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    // createCookie("CompleteGreet",makeid(10),1)
    // delete_cookie("Test")
    var Name
    var Email
    var socket
    var ChatCode
    var chat_ID= Math.floor(Math.random() * Math.pow(10, 9)) + Math.pow(10, 5);
var Cookies=getCookie("CompleteGreet")
    var BubbleID=Bubble.id
    var checkChat=false
    var messages
    var IPAddress
    var City
    var Country
    var GreetMsg=Bubble.BubbleGreetMsg
    var firstMessageflag
    var ImageURL
    //------------ Checking if there is cookies associated with client ------------------//
    $.ajax({
        type: "POST",
        url: "https://completegreet.com/users/GetChatInfo",
        data:{Cookies,BubbleID},
        success: function (data, status) {
            // GreetMsg=data.GreetMsg
            if (data.Status=="ChatFound"){
                checkChat=true
                firstMessageflag=true
                $("#Name-Message").val(data.chat.ClientName)
                 $("#Email-Message").val(data.chat.ClientEmail)
                Name=data.chat.ClientName
                Email=data.chat.ClientEmail
                ChatCode=data.chat.ChatCode
                messages=data.Messages
                ImageURL=data.ImageURL
                $("#step-2-btn").click()
                $("#fake-send-msg-btn").click()
                $(".Step-1").addClass("go-left")

                video1.pause();

            }else {
                firstMessageflag=false
            }


        },
        error: function (data) {
            alert("fail");
        }
    })
//------------------------------------------------------//

    //------------ Getting User Location Info ---------//
    $.getJSON('https://geolocation-db.com/json/')
        .done (function(location) {

            $.ajax({
                type: "GET",
                url: "https://ipapi.co/"+location.IPv4+"/json/",

                success: function (data, status) {
                    IPAddress=location.IPv4
                    City=data.city
                    Country=data.country_name

                },
                error: function (data) {

                }
            })

        });
///------------------- Test --------------------//
//     '            <div class="direct-chat-msg">\n' +
//
//     '<!--                <img class="direct-chat-img" src="/docs/3.0/assets/img/user1-128x128.jpg" alt="message user image">-->\n' +
//     '                <!-- /.direct-chat-img -->\n' +
//     '                <div class="direct-chat-text sender-left-msg">\n' +
//     '                    '+GreetMsg+'\n' +
//     '                </div>\n' +
//     '                <div class="direct-chat-infos clearfix">\n' +
//     '<!--                    <span class="direct-chat-name float-left">Alexander Pierce</span>-->\n' +
//     '                 <span class="direct-chat-timestamp ">'+data.replace("T"," ").slice(10,-8)+'</span>\n' +
//     '                </div>\n' +
//     '                <!-- /.direct-chat-text -->\n' +
//     '                <!-- /.direct-chat-infos -->\n' +
//     '            </div>\n' +
//     '            <!-- /.direct-chat-msg -->\n' +
// console.log(window.location.href)
    $("#step-2-btn").on('click',function (){
         Name= $("#Name-Message").val()
         Email= $("#Email-Message").val()
        if (Name==''|| Email==''){
            $(".Toast-Warning").removeClass('d-none')
            $(".Toast-Warning .toast-body").text("fill empty fields")

        }else if (!isEmail(Email)){
            $(".Toast-Warning").removeClass('d-none')
            $(".Toast-Warning .toast-body").text("enter a valid email address")
        }else {
            $(".Toast-Warning").addClass('d-none')
            $("#fake-msg-content").val('')
            if (!$.trim(Bubble.BubbleGreetMsg)||Bubble.BubbleGreetMsg==null){
                $( ' <div class="card-body p-0">\n' +
                    '        <!-- Conversations are loaded here -->\n' +
                    '        <div class="direct-chat-messages h-100">\n' +


                    '            <!-- /.direct-chat-msg -->\n' +
                    '            <!-- Message. Default to the left -->\n' +
                    '            <div class="direct-chat-msg">\n' +

                    '<!--                <img class="direct-chat-img" src="/docs/3.0/assets/img/user1-128x128.jpg" alt="message user image">-->\n' +
                    '                <!-- /.direct-chat-img -->\n' +
                    '                <!-- /.direct-chat-text -->\n' +
                    '                <!-- /.direct-chat-infos -->\n' +
                    '            </div>\n' +
                    '            <!-- /.direct-chat-msg -->\n' +

                    '        <!--/.direct-chat-messages-->\n' +
                    '    </div>\n' +
                    '    <!-- /.card-body -->\n'  ).insertBefore(".card-footer")
            }else {
                var time=new Date()
                var data=time.toISOString()
                $( ' <div class="card-body p-0">\n' +
                    '        <!-- Conversations are loaded here -->\n' +
                    '        <div class="direct-chat-messages h-100">\n' +


                    '            <!-- /.direct-chat-msg -->\n' +
                    '            <!-- Message. Default to the left -->\n' +


                    '        <!--/.direct-chat-messages-->\n' +
                    '    </div>\n' +
                    '    <!-- /.card-body -->\n'  ).insertBefore(".card-footer")
                if (firstMessageflag==false){

                }
            }

            if (messages) {
                messages.forEach(function (msg) {
                    if (msg.SenderID == msg.ChatCode) {
                        Rightmessage(msg.content, msg.createdAt)

                    } else {
                        Leftmessage(msg.content, msg.createdAt,ImageURL)

                    }
                    $(".direct-chat-messages").animate({scrollTop: $('.direct-chat-messages')[0].scrollHeight}, 0);

                })
            }
            var darkenColor=  getTintedColor(Bubble.BubbleButtonColor,-50)
            $(".multi-step-btn").css('background-color',Bubble.BubbleButtonColor)
            $(".sender-left-msg").css("background-color",Bubble.BubbleButtonColor)
             $("#send-msg-btn").css("background-color",Bubble.BubbleButtonColor)
 $("#fake-send-msg-btn").css("background-color",Bubble.BubbleButtonColor)
            $(".sender-left-msg").css("border-color",Bubble.BubbleButtonColor)

            $(".multi-step-btn").css('border-color',darkenColor)
            if (CheckContrast(Bubble.BubbleButtonColor)){
                $(".multi-step-btn").css('color',"#000000")
                $(".sender-left-msg").css('color',"#000000")
                $("#send-msg-btn").css('color',"#000000")
$("#fake-send-msg-btn").css('color',"#000000")

            }else {
                $(".multi-step-btn").css('color',"#ffffff")
                $(".sender-left-msg").css('color',"#ffffff")
                $("#send-msg-btn").css('color',"#ffffff")
$("#fake-send-msg-btn").css('color',"#ffffff")

            }
            $(".Step-2").addClass("go-left")
            setTimeout(function (){
                $(".Step-2").remove()

            },1000)

            //------- Initializing socket ----------//
            $.ajax({
                type: "POST",
                url: "https://completegreet.com/Bubble/Connect",

                success: function (data, status) {
                    socket=io("https://completegreet.com", {
                        withCredentials: true,

                    });

                    var today = new Date();
                    if (!checkChat){
                        var CookieID=makeid(10)
                        createCookie("CompleteGreet",CookieID,10)
                        ChatCode=makeid(5)

                    }else {
                        var CookieID=getCookie("CompleteGreet")
                    }

                    var date =today.getDate() +'-'+(today.getMonth()+1)+'-'+today.getFullYear();
                    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                    function startChat(Sender_Name,Sender_Email,Receiver_ID,Chat_ID,BubbleID,CookieID,ChatCode) {
                        return {
                            Sender_Name,
                            Sender_Email,
                            Receiver_ID,
                            Chat_ID,
                            BubbleID,
                            CookieID,
                            ChatCode,
                            date:Date.now(),
                            time :time
                        }
                    }

                    socket.emit('new chat',startChat(Name,Email,Bubble.UserId,chat_ID,Bubble.id,CookieID,ChatCode),IPAddress,City,Country)
                    socket.emit("new connection",ChatCode,Bubble.UserId,Email)

                    if (data.Status=="Fail") {

                    }



                },
                error: function (data) {
                    alert("fail");
                }
            })


        }
        // pauseBtn.click()
    })

    function playSound(url) {
        const audio = new Audio(NotificationSound);
        audio.play();
    }

    function Leftmessage(message,date,ImageURL){
        var today = new Date(date);
        today.setHours(today.getHours() + 1);
        date=today.toISOString()
        $(".direct-chat-messages").append('            <!-- Message. Default to the left -->\n' +
            '            <div  class="direct-chat-msg">\n' +
            '                <div class="direct-chat-infos clearfix">\n' +
            '<!--                    <span class="direct-chat-name float-left">Alexander Pierce</span>-->\n' +
            '<!--                    <span class="direct-chat-timestamp float-right">23 Jan 2:00 pm</span>-->\n' +
            '                </div>\n' +
            '                <!-- /.direct-chat-infos -->\n' +
            '               <img class="direct-chat-img" src="'+ImageURL+'" alt="message user image">\n' +
            '                <!-- /.direct-chat-img -->\n' +
            '                <div  class="direct-chat-text sender-left-msg">\n' +
            '                 '+message+'   \n' +
            '                </div>\n' +
            '                <!-- /.direct-chat-text -->\n' +
            '                <div class="direct-chat-infos clearfix">\n' +
            '<!--                    <span class="direct-chat-name float-left">Alexander Pierce</span>-->\n' +
            '                 <span class="direct-chat-timestamp ">'+date.replace("T"," ").slice(10,-8)+'</span>\n' +
            '                </div>\n' +
            '                <!-- /.direct-chat-infos -->\n' +
            '            </div>\n' +
            '            <!-- /.direct-chat-msg -->\n' )
        var darkenColor=  getTintedColor(Bubble.BubbleButtonColor,-50)
        $(".multi-step-btn").css('background-color',Bubble.BubbleButtonColor)
        $(".sender-left-msg").css("background-color",Bubble.BubbleButtonColor)
         $("#send-msg-btn").css("background-color",Bubble.BubbleButtonColor)
 $("#fake-send-msg-btn").css("background-color",Bubble.BubbleButtonColor)
        $(".sender-left-msg").css("border-color",Bubble.BubbleButtonColor)

        $(".multi-step-btn").css('border-color',darkenColor)
        if (CheckContrast(Bubble.BubbleButtonColor)){
            $(".multi-step-btn").css('color',"#000000")
            $(".sender-left-msg").css('color',"#000000")
            $("#send-msg-btn").css('color',"#000000")
$("#fake-send-msg-btn").css('color',"#000000")

        }else {
            $(".multi-step-btn").css('color',"#ffffff")
            $(".sender-left-msg").css('color',"#ffffff")
            $("#send-msg-btn").css('color',"#ffffff")
$("#fake-send-msg-btn").css('color',"#ffffff")

        }

    }


    function Rightmessage(message,date){
        var today = new Date(date);
        today.setHours(today.getHours() + 1);
        date=today.toISOString()
        $(".direct-chat-messages").append('            <!-- Message to the right -->\n' +
            '            <div class="direct-chat-msg right">\n' +

            '                <!-- /.direct-chat-infos -->\n' +
            '<!--                <img class="direct-chat-img" src="/docs/3.0/assets/img/user3-128x128.jpg" alt="message user image">-->\n' +
            '                <!-- /.direct-chat-img -->\n' +
            '                <div class="direct-chat-text">\n' +
            '                   '+message+'\n' +
            '                </div>\n' +
            '                <div class="direct-chat-infos clearfix">\n' +
            '<!--                    <span class="direct-chat-name float-right">Sarah Bullock</span>-->\n' +
            '                 <span class="direct-chat-timestamp float-right">'+date.replace("T"," ").slice(10,-8)+'</span>\n' +
            '                </div>\n' +
            '                <!-- /.direct-chat-text -->\n' +
            '            </div>\n'  )

    }
    $("#send-msg-btn").on('click',function (e){

        var Message= $("#msg-content").val()

        if(Message!=''&&$.trim(Message)) {
            e.preventDefault();




            var info={
                Email:Email,
                SenderID:ChatCode,
                Receiver:Bubble.UserId,
                BubbleID: Bubble.id,
                UserId: Bubble.UserId,
                ChatCode:ChatCode,
                text:Message

            }
            socket.emit(ChatCode.toString(),info);
            socket.emit(ChatCode+"ULURL",window.location.href)





        }

        else {
            alert("Chat Box is Empty")
        }

        $('#msg-content').val('');
        $('#msg-content').focus();
        $("#send-msg-btn").prop('disabled', true);





    })
    $("#fake-send-msg-btn").on('click',function (e) {
        if($("#fake-msg-content").val().length != 0) {
            $('#msg-content').val($("#fake-msg-content").val());
            $("#send-msg-btn").prop('disabled', false);
        }
        else {

        }

            $(".Fake-Step").addClass("go-left")

    })
        //---------- assigning ChatCode and socket -------------//
    assign()
    function assign(){
        var timer=setInterval(function (){
            if (ChatCode==undefined||socket==undefined){

            }else {
                //------------- Receiving Messages and Displaying it ----------//

                socket.on("connect", () => {// x8WIv7-mJelg7on_ALbx
                });
                var Message= $("#msg-content").val()

                if(Message!=''&&$.trim(Message)) {
                    $("#send-msg-btn").click()

                }

                socket.on(ChatCode,(msgInfo,chat,ImageURL)=>{
                    // Rightmessage(msgInfo.content,msgInfo.createdAt)

                    if(msgInfo.SenderID==Bubble.UserId){
                        Leftmessage(msgInfo.content,msgInfo.createdAt,ImageURL)
                        playSound("https://assets.mixkit.co/sfx/preview/mixkit-happy-bells-notification-937.mp3")
                        var CurrentIframe=window.parent.document.getElementById('LContainer')
                        $(CurrentIframe).css('transform','translateY(0%)')

                    }else {
                        Rightmessage(msgInfo.content,msgInfo.createdAt)
                    }
                    $(".direct-chat-messages").animate({ scrollTop:$('.direct-chat-messages')[0].scrollHeight  }, 0);

                })

                socket.on(ChatCode+"ULURL", (msg)=>{
                    socket.emit(ChatCode+"ULURL",window.location.href)
                })
                socket.emit(ChatCode+"ULURL",window.location.href)
                clearInterval(timer)

            }
        },100)

    }
    //------------------ Checking if chat input is empty ------------//
    $(document).on('keyup',"#msg-content",function() {
        if($(this).val().length != 0) {
            $("#send-msg-btn").prop('disabled', false);

        }
        else {
            $("#send-msg-btn").prop('disabled', true);

        }
    });
    $(document).on('keyup',"#fake-msg-content",function() {
        if($(this).val().length != 0) {
            $("#fake-send-msg-btn").prop('disabled', false);

        }
        else {
            $("#fake-send-msg-btn").prop('disabled', true);

        }
    });
    //------------------ Sending Message on Enter Click ------------//
    $(document).on('keypress',function(e) {
        if(e.which == 13) {
            if($("#msg-content").val().length != 0){
                $('#send-msg-btn').click();
            }
        }
    });
    $(document).on('keypress',function(e) {
        if(e.which == 13) {
            if($("#fake-msg-content").val().length != 0){
                $('#fake-send-msg-btn').click();
            }
        }
    });


})