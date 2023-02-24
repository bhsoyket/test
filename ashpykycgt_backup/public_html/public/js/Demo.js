$(document).ready(function (){
    function validURL(str) {
        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return !!pattern.test(str);
    }

    $("#Demo-btn").on('click',function (e){
        e.preventDefault()
        var webisteUrl=$("#Demo-Website").val()
        if (validURL(webisteUrl)){
            $(".browser-tab-input").val(webisteUrl)
            $(".browser-container").html('')
            $(".browser-container").append('<iframe src="'+webisteUrl+'" style="border:none;width: 100%;height: 100vh" frameBorder="0" title="Iframe Example"></iframe>\n')

            $(".Bubble-Body").removeClass("d-none")
            $(".Bubble-large-container").removeClass("d-none")
        }
    })


    //----------- Video Adjustment ---------//




    var video1 = document.getElementById('Large-container-video');

    var playBtn = document.getElementById('play-btn');
    var pauseBtn = document.getElementById('pause-btn');
    var muteBtn = document.getElementById('mute-btn');
    var unmuteBtn = document.getElementById('unmute-btn');
    var replayBtn = document.getElementById('replay-btn');

    playBtn.addEventListener('click', pausePlayHandler, false);
    pauseBtn.addEventListener('click', pausePlayHandler, false);
    muteBtn.addEventListener('click', muteUnmuteHandler, false);
    unmuteBtn.addEventListener('click', muteUnmuteHandler, false);
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
        if (video1.volume == 0.0) {
            // If muted, then turn it on
            video1.volume = 1.0;
            // Show mute button and hide unmute button
            muteBtn.style.visibility = 'visible';
            unmuteBtn.style.visibility = 'hidden';
        } else {
            // If unmuted, then turn it off
            video1.volume = 0.0;
            // Show unmute button and hide mute button
            muteBtn.style.visibility = 'hidden';
            unmuteBtn.style.visibility = 'visible';
        }
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
    //----------- Opening and Closing Large Bubble Container --------//

    $("#Bubble-Body").on('click',function (){

        var Position = $(':radio[name="Position"]').filter(':checked').val();
        if(Position=='Right') {
            $(".Bubble-large-container").css('right','0px')
        }else if (Position=='Left'){
            $(".Bubble-large-container").css('left','0px')

        }
        $(".Bubble-large-container").removeClass("go-down")
        video1.pause();
    })
    $(".exit-btn").on('click',function (){
        $(".Bubble-large-container").addClass("go-down")
        setTimeout(function (){
            $(".Step-1").removeClass("go-left")
            $(".Step-1").removeClass("go-right")
            $(".Step-2").removeClass("go-left")
            $(".Step-2").removeClass("go-right")
        },300)
        video1.pause();
    })
    //---------- Switching between steps ----------//
    $("#step-1-btn").on('click',function (){
        $(".Step-1").addClass("go-left")

        video1.pause();
    })
    $("#step-2-btn").on('click',function (){
        $(".Step-2").addClass("go-left")
        // pauseBtn.click()
    })
    $(".back-btn").on('click',function (){

        if ($(this).parent().parent().hasClass("Step-3")){
            $(".Step-2").removeClass("go-left")
            $(".Step-2").removeClass("go-right")
        }else if ($(this).parent().parent().hasClass("Step-2")){
            $(".Step-1").removeClass("go-left")
            $(".Step-1").removeClass("go-right")

        }
    })
})