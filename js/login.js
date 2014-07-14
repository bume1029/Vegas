  $(function() {
    $(".setupbtn").click(function () {
        $("#glayLayer").show();
        $("#SetupLayer").show();
        $(".setupbtn1").show();
        $("input[name='serverIP']").focus();
    });
    $(".savebtn").click(function () {
        var hospitalID = $("input[name='hospitalID']").val();        
            if(hospitalID === "") { 
                showMessage("요양기관기호를 입력하세요."); 
                $("input[name='hospitalID']").val($.cookie('HospitalID')); 
                return false; 
            }

        $("#glayLayer").hide();
        $("#SetupLayer").hide();
        $(".setupbtn1").hide();
    });
    $(".btnlogin").click(function () {
        $("#form1").submit();
    });
   $("#form1").submit(function () {
        if ($("input[name='userID']").val() == "") { showMessage("아이디를 입력하세요."); $("input[name='userID']").focus(); return false; }
        if ($("input[name='passwd']").val() == "") { showMessage("비밀번호를 입력하세요."); $("input[name='passwd']").focus(); return false; }

        var hospitalID = $("input[name='hospitalID']").val();
        var url = "";

       if(hospitalID == "") { showMessage("요양기관기호를 입력하세요."); return false; }
        //url = "https://domestic.vegas-solution.com/inbody/login.json";

        // parent.loadMask(true, true);
        
        $.ajax({
            url: 'http://int.trustnhope.com:3114/inbody/login2.json',
            type: "POST",
            dataType: "jsonp",
            jsonp: "callback",
            timeout: 10000,
            crossDomain:true,
            cache:false,
            data: { "userID": $("input[name='userID']").val(), "passwd": $("input[name='passwd']").val(), "orgno": hospitalID },
            success: function (data) {
                // parent.loadMask(false, true);
                
                // 설정저장
                if(data.object.ORGID == undefined) data.object.ORGID = 0;
                $.cookie('ORGID', data.object.ORGID, { expires: 90 });
                $.cookie('HospitalID', hospitalID, { expires: 90 });

                if (data.object.Result == "FAIL") {
                    showMessage(data.object.Error);
                } else {
                    location.href = "main.html";
                }
            },
            error: function (xhr, option, error) {
                // parent.loadMask(false, true);
                //alert("Code : " + xhr.status + "\r\n Error : " + error + "\r\nMessage : " + ajaxRequestErrorMessage(xhr.status));
                showMessage(ajaxRequestErrorMessage(xhr.status));
            }
        });

        return false;
    });        
    $("input[name='serverIP']").val($.cookie('ServerIP'));
    $("input[name='hospitalID']").val($.cookie('HospitalID'));
    // $(window).unload(function () { parent.loadMask(true); });


});
document.onreadystatechange = function () {
    if (document.readyState == 'complete') {
        // parent.loadMask(false);
    }
};