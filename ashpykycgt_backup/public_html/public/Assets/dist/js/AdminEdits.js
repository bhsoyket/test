$(document).ready(function() {
//-------- Activating SideBar Icons ----------------//
    var url = window.location.pathname;
    var id = url.substring(url.lastIndexOf('/') + 1).toLowerCase();
    if (id){
        if (id==''){
            $(document).find('#Dashboard').addClass('active')

        }else if (id=='users'){
            $(document).find('#Users').addClass('active')

        }else if (id=='bubbles'){
            $(document).find('#Bubbles').addClass('active')

        }else if (id=='system'){
            $(document).find('#System').addClass('active')

        }else if (id=='chats'){
            $(document).find('#Chats').addClass('active')

        }else if (id=='bugs'){
            $(document).find('#Bugs').addClass('active')

        }else {
            $(document).find('#Dashboard').addClass('active')

        }
    }
//---------------- Displaying user info in a model ----------------//
$(document).on('click',".User-Modal-Btn",function (e){
    e.preventDefault()
    var UserID= $(this).attr("data-userid")
    $.ajax({
        type: "POST",
        url: "/CG-Admin/getUserInfo",
        data:{
            UserID:UserID,
        },


        success: function (data, status) {
            $("#UsersInfoModal .modal-body .row").html('')
            $("#UsersInfoModal .modal-body .row").append(
                '<div class="col-md-6">\n' +
                '              <label for="FTitle">User Name</label>\n' +
                '              <input type="text" value="'+data.User.Name+'" class="form-control" id="Name"\n' +
                '                     aria-describedby="emailHelp" placeholder="Type...">\n' +
                '              <small id="emailHelp" class="form-text text-muted"></small>\n' +
                '            </div>\n' +
                '<div class="col-md-6">\n' +
                '              <label for="FTitle">Password</label>\n' +
                '              <input type="password" value="" class="form-control" id="Password"\n' +
                '                     aria-describedby="emailHelp" placeholder="Type...">\n' +
                '              <small id="emailHelp" class="form-text text-muted">Leave empty to not be changed</small>\n' +
                '            </div>\n' +
                '            <div class="col-md-6">\n' +
                '              <label for="FTitle">User Email</label>\n' +
                '              <input type="text" disabled value="'+data.User.email+'" class="form-control" id="Email"\n' +
                '                     aria-describedby="emailHelp" placeholder="Type...">\n' +
                '              <small id="emailHelp" class="form-text text-muted"></small>\n' +
                '            </div>\n' +
                '            <div class="col-md-6">\n' +
                '              <label for="FTitle">User Business Name</label>\n' +
                '              <input type="text" value="'+data.User.BusinessName+'" class="form-control" id="BName"\n' +
                '                     aria-describedby="emailHelp" placeholder="Type...">\n' +
                '              <small id="emailHelp" class="form-text text-muted"></small>\n' +
                '            </div>\n' +
                '            <div class="col-md-6">\n' +
                '              <label for="FTitle">User Industry</label>\n' +
                '              <input type="text" value="'+data.User.Industry+'" class="form-control" id="Industry"\n' +
                '                     aria-describedby="emailHelp" placeholder="Type...">\n' +
                '              <small id="emailHelp" class="form-text text-muted"></small>\n' +
                '            </div>\n' +
                '            <div class="col-md-6">\n' +
                '              <label for="FTitle">User Website URL</label>\n' +
                '              <input type="text" value="'+data.User.WebsiteURL+'" class="form-control" id="WURL"\n' +
                '                     aria-describedby="emailHelp" placeholder="Type...">\n' +
                '              <small id="emailHelp" class="form-text text-muted"></small>\n' +
                '            </div>\n' +
                '            <div class="col-md-6">\n' +
                '              <label for="FTitle">User Goals</label>\n' +
                '              <input type="text" value="'+data.User.Goals+'" class="form-control" id="Goals"\n' +
                '                     aria-describedby="emailHelp" placeholder="Type...">\n' +
                '              <small id="emailHelp" class="form-text text-muted"></small>\n' +
                '            </div>\n' +
                '            <div class="col-md-6">\n' +
                '              <label for="FTitle">User UserGroup</label>\n' +
                '              <input type="text" value="'+data.User.userGroup+'" class="form-control" id="UserGroup"\n' +
                '                     aria-describedby="emailHelp" placeholder="Type...">\n' +
                '              <small id="emailHelp" class="form-text text-muted">Change to 1200 to make this user admin</small>\n' +
                '            </div>\n'+
            '            <div class="col-md-6">\n' +
            '              <label for="FTitle">User Banned</label>\n' +
            '              <input type="text" value="'+data.User.Banned+'" class="form-control" id="Banned"\n' +
            '                     aria-describedby="emailHelp" placeholder="Type...">\n' +
            '              <small id="emailHelp" class="form-text text-muted"></small>\n' +
            '            </div>')
            $("#UserSave-Btn").attr("data-userid",data.User.id)

        },
        error: function (data) {
            window.location.href='https://completegreet.com/login';
        }
    })


})
$(document).on('click',".Plan-Modal-Btn",function (e){
    e.preventDefault()
    var Plan= $(this).data("plan")
    $("#PlansInfoModal .modal-body .row").html('')
    $("#PlansInfoModal .modal-body .row").append('            <div class="col-md-6">\n' +
        '                            <label for="FTitle">Plan Name</label>\n' +
        '                            <input type="text" value="'+Plan.PName+'" class="form-control" id="PName"\n' +
        '                                   aria-describedby="emailHelp" placeholder="Type...">\n' +
        '                            <small id="emailHelp" class="form-text text-muted"></small>\n' +
        '                        </div>\n' +
        '                        <div class="col-md-6">\n' +
        '                            <label for="FTitle">Plan Price($)</label>\n' +
        '                            <input type="number" value="'+Plan.Price+'" class="form-control" id="PPrice"\n' +
        '                                   aria-describedby="emailHelp" placeholder="Type...">\n' +
        '                            <small id="emailHelp" class="form-text text-muted"></small>\n' +
        '                        </div>' )
    $("#PlanSave-Btn").attr("data-order",Plan.Order)

})
    $("#UserSave-Btn").on('click',function (e){
        e.preventDefault()
      var  userGroup=$("#UserGroup").val(),
            Name=$("#Name").val(),
            password=$("#Password").val(),
            BusinessName=$("#BName").val(),
            Industry=$("#Industry").val(),
            WebsiteURL=$("#WURL").val(),
            Goals=$("#Goals").val(),
            // isEnrolled:0,
            Banned=$("#Banned").val(),
        UserId=$(this).attr("data-userid")
        $.ajax({
            type: "POST",
            url: "/CG-Admin/SaveUserInfo",
            data:{
                userGroup,
                Name,
                password,
                BusinessName,
                Industry,
                WebsiteURL,
                Goals,
                Banned  ,
                UserId
            },


            success: function (data, status) {
                if (data.Status=="Success"){
                $(".Toast-Success").removeClass('d-none')
                $(".Toast-Success .toast-body").text("User Updated")
                $(".Toast-Success").toast('show')
                setTimeout(function (){
                    $(".Toast-Success").addClass('d-none')

                },3500)
                }else {
                    $(".Toast-Warning").removeClass('d-none')
                    $(".Toast-Warning .toast-body").text("Failed: "+data.err)
                    $(".Toast-Warning").toast('show')
                    setTimeout(function (){
                        $(".Toast-Warning").addClass('d-none')

                    },3500)
                }
            },
            error: function (data) {
                window.location.href='https://completegreet.com/login';
            }
        })
        $('#UsersInfoModal').modal('hide')

    })
    $("#PlanSave-Btn").on('click',function (e){
        e.preventDefault()
      var  PName=$("#PName").val(),
            PPrice=$("#PPrice").val(),
        PlanOrder=$(this).data("order")
        $.ajax({
            type: "POST",
            url: "/CG-Admin/SavePlanInfo",
            data:{
              PName,
                PPrice,
                PlanOrder
            },


            success: function (data, status) {
                if (data.Status=="Success"){
                $(".Toast-Success").removeClass('d-none')
                $(".Toast-Success .toast-body").text("Plan Updated")
                $(".Toast-Success").toast('show')
                setTimeout(function (){
                    $(".Toast-Success").addClass('d-none')
                    location.reload()
                },3500)
                }else {
                    $(".Toast-Warning").removeClass('d-none')
                    $(".Toast-Warning .toast-body").text("Failed: "+data.err)
                    $(".Toast-Warning").toast('show')
                    setTimeout(function (){
                        $(".Toast-Warning").addClass('d-none')

                    },3500)
                }
            },
            error: function (data) {
                window.location.href='https://completegreet.com/login';
            }
        })
        $('#PlansInfoModal').modal('hide')

    })
    $("#SystemSave-Btn").on('click',function (e){
        e.preventDefault()
       let MetaTitle= $("#MetaTitle").val(),
            MetaDescription= $("#MetaDescription").val(),
            NotificationSound= $("#NotificationSound").val(),
            BubbleId= $("#BubbleId").val(),
            MaxVideoSize= $("#MaxVideoSize").val()
        $.ajax({
            type: "POST",
            url: "/CG-Admin/SaveSystemInfo",
            data:{
                MetaTitle,
                MetaDescription,
                BubbleId,
                NotificationSound,
                MaxVideoSize,
            },


            success: function (data, status) {
                if (data.Status=="Success"){
                $(".Toast-Success").removeClass('d-none')
                $(".Toast-Success .toast-body").text("System Updated")
                $(".Toast-Success").toast('show')
                setTimeout(function (){
                    $(".Toast-Success").addClass('d-none')
                    // location.reload()
                },3500)
                }else {
                    $(".Toast-Warning").removeClass('d-none')
                    $(".Toast-Warning .toast-body").text("Failed: "+data.err)
                    $(".Toast-Warning").toast('show')
                    setTimeout(function (){
                        $(".Toast-Warning").addClass('d-none')
                        location.reload()

                    },3500)
                }
            },
            error: function (data) {
                window.location.href='https://completegreet.com/login';
            }
        })
        if( document.getElementById("LogoImg").files.length != 0 ) {
            var formData = new FormData(document.getElementById("LogoForm"));
            e.preventDefault();
            $.ajax({
                type: "POST",
                url: "/CG-Admin/SaveLogoImg",
                data: formData,
                processData: false,
                contentType: false,


                success: function (data, status) {
                    if (data.error) {
                        $(".Toast-Warning").removeClass('d-none')
                        $(".Toast-Warning .toast-body").text("Failed: "+data.error.message)
                        $(".Toast-Warning").toast('show')
                        setTimeout(function (){
                            $(".Toast-Warning").addClass('d-none')

                        },3500)

                    } else if (data.Success = "Success") {
                        $(".Toast-Success").removeClass('d-none')
                        $(".Toast-Success .toast-body").text("Image Uploaded")
                        $(".Toast-Success").toast('show')
                        setTimeout(function (){
                            $(".Toast-Success").addClass('d-none')
                            location.reload()
                        },3500)
                    }
                },
                error: function (data) {

                }

            })
        }
        if( document.getElementById("NotificationSoundFile").files.length != 0 ) {
            var formData = new FormData(document.getElementById("NotificationSoundForm"));
            e.preventDefault();
            $.ajax({
                type: "POST",
                url: "/CG-Admin/SaveNotificationSoundFile",
                data: formData,
                processData: false,
                contentType: false,


                success: function (data, status) {
                    if (data.error) {
                        $(".Toast-Warning").removeClass('d-none')
                        $(".Toast-Warning .toast-body").text("Failed: "+data.error.message)
                        $(".Toast-Warning").toast('show')
                        setTimeout(function (){
                            $(".Toast-Warning").addClass('d-none')

                        },3500)

                    } else if (data.Success = "Success") {
                        $(".Toast-Success").removeClass('d-none')
                        $(".Toast-Success .toast-body").text("Notification Added")
                        $(".Toast-Success").toast('show')
                        setTimeout(function (){
                            $(".Toast-Success").addClass('d-none')
                            location.reload()
                        },3500)
                    }
                },
                error: function (data) {

                }

            })
        }

        $('#SystemInfoModal').modal('hide')

    })
    //-------------- Checking If image is selected ----------//
    if (document.getElementById("LogoImg")){
        document.getElementById("LogoImg")
            .onchange = function(event) {
            const files = this.files[0];
            const  fileType = files['type'];
            const validImageTypes = ['image/gif', 'image/jpeg','image/jpg','image/webp', 'image/png'];
            if (!validImageTypes.includes(fileType)) {
                $(".Toast-Warning").removeClass('d-none')
                $(".Toast-Warning .toast-body").text('please select a valid image')
                $(".Toast-Warning").toast('show')
                setTimeout(function (){
                    $(".Toast-Warning").addClass('d-none')

                },3500)

            }else {
                $(".Toast-Success").removeClass('d-none')
                $(".Toast-Success .toast-body").text('Image Selected')
                $(".Toast-Success").toast('show')
                setTimeout(function (){
                    $(".Toast-Success").addClass('d-none')

                },3500)
            }

        }
    }


})