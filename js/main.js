var serverUrl =  "http://int.trustnhope.com:3114/inbody/";
var serverImg =  "http://int.trustnhope.com:3114";
var searchDate = '';
var searchName = '';
var viewType = '';
var listDate = '';
var datePage = 2;
var namePage = 2,
      ActivePage = 'report.html',
      pageMoveType = 'day',
      cc04,
      cc05,
      cc06,
      doctorList,
      nurseList;
var minTable = [0,5,10,15,20,25,30,35,40,45,50,55],
      officeWeekHours = [8,18];

document.onreadystatechange = function () {
    if (document.readyState == 'complete') {
        //parent.loadMask(false);
    }
};

$(document).ready(function () {
    $('input[name=Today], input[name=datepicker]').val(getCalDate());
    $( "#datepicker" ).datepicker(jqueryDatepickerOption);

    // $(window).unload(function () { parent.loadMask(true); });
    var dateObj = getStrToDate(getCalDate());
    $('.Today, .selectdate').text(dateObj.format("yyyy. mm. dd") + " (" + getDayKr(dateObj.getDay()) + "요일)");

    $("#form1").submit(function () {
        var srDate = $("input[name='srDate']").val();
        $("input[name='srType']").val(viewType);
        searchDate = $("input[name='srDate']").val().replace(/-/g, '');
        searchName = $("input[name='srName']").val();
        if(searchDate == "날짜") searchDate = "";
        if(searchName == "이름") searchName = "";

        $("#srName").blur();
        // parent.loadMask(true, true);
        
        loadPatientList(true);
        return false;
    });

    // $("#Logout").click(function () {
    //     var url = serverUrl + "logout.json";
    //     $.ajax({
    //         url: url,
    //         type: "POST",
    //         dataType: "jsonp",
    //         jsonp: "callback",
    //         timeout: 15000,
    //         crossDomain:true,
    //         cache:false,
    //         success: function (data) {
    //             $.cookie('ORGID', '', { expires: 90 });
    //             location.href = "index.html";
    //         },
    //       error: function (xhr, option, error) {
    //          showMessage(ajaxRequestErrorMessage(xhr.status));
    //       }
    //     });
    // });
    var $url;

    $('.menuTab li').on('click',function(ev){
        // ev.preventdefault();

        var url = $(this).attr('data-url'); 
        $('#ApMenu').hide();
        if(url !== 'reservation.html'){
            $('.wrap_left').hide();  $('#Contents').removeClass('inner').removeClass('resize').removeClass('AppFrame');
            $('body').addClass('Chart').removeClass('Resv');

        }else{
            $('.wrap_left').show();  $('#Contents').addClass('inner').removeClass('resize');       
            $('body').addClass('Resv').removeClass('Chart'); 
            $('.resultList').empty();
            $('#calendarLayer').show();
        }
        url === 'report.html' ? $('#subMenu').show() : $('#subMenu').hide();

        $('.menuTab li').each(function(){
          $(this).removeClass('active_top');
        });
        $(this).addClass('active_top');

        $('#Contents')[0].contentWindow.location.href = url;
       $url = url;
    });
    $('.Today').on('click', function(){
            $('.wrap_left').show();
            $('#subMenu, #ApMenu').hide();
            $('#Contents').addClass('inner');
            $('#Contents').removeClass('AppFrame');
            $('body').addClass('Savenotice');
            $('#Contents')[0].contentWindow.location.href = 'Consultboard_2.html?srDate=';
    });


  var $iframe = $('#Contents'); 
  
  $iframe.find('.resev_list td').on('click', function(){
    $('#left_contents .ApList').show();
  });

  $('#subMenu li').on('click',function(){
    var $this = $(this);
    if($this.hasClass('notSelect')){
      return;
    }else{ 
    var tab = $(this).attr('data-tab');
    $('#subMenu li').each(function(){
        $(this).removeClass('subMenu_active');
        $(this).hasClass('subMenu_active') ? '' : $this.addClass('subMenu_active'); 
    });
    }
  });

  $('#subMenu li').on('click', function(){
    if($(this).hasClass('notSelect')){
      return;
    }else{
      var $link = $(this).attr('data-link');
      $('#Contents')[0].contentWindow.location.href = $link;
      ActivePage = $link;
     switch(ActivePage){
      case 'report.html' :
          pageMoveType = 'day';
      break;
      case 'Wreport.html' :
          pageMoveType = 'week';
      break;
      case 'Mreport.html' :
          pageMoveType = 'month';
      break;
      case 'Yreport.html' :
          pageMoveType = 'year';
      break;
    } 
    }
  });

  $('.btn_prev').on('click',function(){
         $('#Contents')[0].contentWindow.location.href = ActivePage + "?srDate=" + dateTermCal($('input[name=Today]').val(), pageMoveType, -1);
         $('input[name=Today]').val(dateTermCal($('input[name=Today]').val(), pageMoveType, -1));
         var dateobj = getStrToDate($('input[name=Today]').val());
         $('.selectdate').text(dateobj.format("yyyy. mm. dd") + " (" + getDayKr(dateobj.getDay()) + "요일)");
  });
  $('.btn_next').on('click',function(){
         $('#Contents')[0].contentWindow.location.href = ActivePage + "?srDate=" + dateTermCal($('input[name=Today]').val(), pageMoveType, +1);
         $('input[name=Today]').val(dateTermCal($('input[name=Today]').val(), pageMoveType, 1));
         var dateobj = getStrToDate($('input[name=Today]').val());
         $('.selectdate').text(dateobj.format("yyyy. mm. dd") + " (" + getDayKr(dateobj.getDay()) + "요일)");
  });

 $('.btn_search').on('click',function(){
  patientSearch();
 });
  
      $('#ApMenu li').off().on('click',function(){
        var tab = $(this).attr('data-tab');
         var $this = $(this);
            if($this.hasClass('notSelect')){
              return;
            }else{ 
            var tab = $(this).attr('data-tab');
            $('#ApMenu li').each(function(){
                $(this).removeClass('subMenu_active');
                $(this).hasClass('subMenu_active') ? '' : $this.addClass('subMenu_active'); 
            });
            }
        ShowApMenu(tab);
        });


  calendarFunc = function(setDate) {
    srDate = setDate;
    $(".Today").text(currDate.format('yyyy. mm. dd (ddd요일)'));
    $("input[name=hiddenDate]").val(currDate);
    // $("#board_date input[name=srDate]").val(getStrToDatepicker(srDate));
    resetScheduleInit(srDate);
  };

  $('.moveTo').on('click',function(){
    if($('body').hasClass('Resv')) resetScheduleInit(getCalDate());    
  });

  calendarInit("calendarLayer");

  // 임시환자등록
  $(".tempPatientSave").click(function() {
    var customer = {};
    var $wrapObj = $(this).parent().parent();
    var custname = $wrapObj.find("input[name=tempName]").val();
    var custcell1 = $wrapObj.find("select[name=tempPhone1]").val() + $wrapObj.find("input[name=tempPhone2]").val() + $wrapObj.find("input[name=tempPhone3]").val();    
    var url = serverUrl + "AppCustomerSave.json?custname=" + custname + "&custcell1=" + custcell1;

    hjson({
      url: url,
      type: "POST",
      dataType: "jsonp",
      jsonp: "callback",
      timeout: 15000,
      crossDomain:true,
      cache:false,
      success: function(data) {

      }
    });   
  });
  


//end
});

function initList()
{
    // $("#PatientListArticle dd").click(function () {
    //     $("#loadMaskLayer").css("visibility", "visible");
    //     location.href = "Result.html?patientID=" + $(this).attr("patientID") + "&today=" + $(this).attr("measureDate");
    // });

    // $(".date").each(function () {
    //     $(this).text(format_date($(this).text(), "yyyy.mm.dd"));
    // });

    // $(".MeasureDate").each(function () {
    //     $(this).text(format_date($(this).text(), "yyyy.mm.dd"));
    // });

    // $(".MeasureTime").each(function () {
    //     $(this).text(format_datetime($(this).text(), "TT h:MM"));
    // });
}

function loadConsultboard(init) 
{
    var url = serverUrl + "CustomerStatusBoard.json";

    $.ajax({
        url: url,
        type: "POST",
        dataType: "jsonp",
        jsonp: "callback",
        timeout: 15000,
          crossDomain:true,
          cache:false,
        success: function (jsonData) {
            var data = jsonData.object;
                                    $("#ConsultTmpl").tmpl(data.scheduleList).appendTo("#OrderDate");

            // if (data.Result == "SUCCESS") {
                //alert(JSONtoString(data.PatientDateList));

            // }
            // if(init) {
            //     parent.loadMask(false); 
            //     parent.loadMask(false, true);
            // }
        },
        error: function (xhr, option, error) {
            if(init) {
                // parent.loadMask(false, true);
                location.href = "index.html";
            }
            showMessage(ajaxRequestErrorMessage(xhr.status));
        }       
    });
}


function loadPatientList(init) 
{
    var page, url;
    
    if (init) {
        page = 1;
        url = serverUrl + "PatientList.json?ORGID=" + $.cookie('ORGID') + "&srType=" + viewType + "&page=" + page + "&srDate=" + searchDate + "&srName=" + searchName;
    } else {
        page = viewType == "date" ? datePage : namePage;
        url = serverUrl + "PatientAddList.json?ORGID=" + $.cookie('ORGID') + "&srType=" + viewType + "&page=" + page + "&srDate=" + searchDate + "&srName=" + searchName;
    }

    $.ajax({
        url: url,
        type: "POST",
        dataType: "jsonp",
        jsonp: "callback",
        timeout: 15000,
          crossDomain:true,
          cache:false,
        success: function (jsonData) {
            var data = jsonData.object;
            if (data.Result == "SUCCESS") {
                if (init || viewType == "date") {
                    if (init) $("#OrderDate").empty();
                    if (data.PatientDateList.length > 0) {
                        if (!init) datePage++;
                        
                        for(var i in data.PatientDateList) {
                            if (data.PatientDateList[i].Image != null && data.PatientDateList[i].Image != "" && data.PatientDateList[i].Image.indexOf('default_') == -1) data.PatientDateList[i].Image = serverImg + data.PatientDateList[i].Image;
                        }
                        $("#listTmpl").tmpl(data.PatientDateList).appendTo("#OrderDate");
                        
                        var dtDate = '';
                        $("#OrderDate > dt").each(function () {
                            if ($(this).css('display') == 'none') {
                                dtDate = $(this).text();
                                if (listDate != dtDate) {
                                    listDate = dtDate;
                                    $(this).css('display', 'block');
                                    $(this).text(format_date(dtDate, "yyyy.mm.dd"));
                                } else {
                                    $(this).remove();
                                }
                            }
                        });
                    }
                }
                
                if (init || viewType == "name") {
                          if (init) $("#OrderName").empty();
                    if (data.PatientNameList.length > 0) {
                        if (!init) namePage++;

                        for (var i in data.PatientNameList) {
                            if (data.PatientNameList[i].Image != null && data.PatientNameList[i].Image != "" && data.PatientNameList[i].Image.indexOf('default_') == -1) data.PatientNameList[i].Image = serverImg + data.PatientNameList[i].Image;
                        }
                        $("#listTmpl").tmpl(data.PatientNameList).appendTo("#OrderName");
                    }
                }
                
                if(init) {
                    searchDate = data.SearchDate;
                    searchName = data.SearchName;
                    viewType = data.ViewType;
                
                    if (searchDate != '') $('#srDate').val(format_date(searchDate, 'yyyy-mm-dd'));
                    if (searchName != '') $('#srName').val(searchName);
                }
                
                initList();
                myScroll.refresh();
            }
            if(init) {
                // parent.loadMask(false); 
                // parent.loadMask(false, true);
            }
        },
        error: function (xhr, option, error) {
            if(init) {
                // parent.loadMask(false, true);
                location.href = "index.html";
            }
            showMessage(ajaxRequestErrorMessage(xhr.status));
        }       
    });
}


// iScroll
var myScroll,
pullDownEl, pullDownOffset,
pullUpEl, pullUpOffset,
generatedCount = 0;
document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
//document.addEventListener('DOMContentLoaded', function () { setTimeout(loaded, 200); }, false);

function loaded() {
   pullDownEl = document.getElementById('pullDown');
   pullDownOffset = pullDownEl.offsetHeight;
   pullUpEl = document.getElementById('pullUp');
   pullUpOffset = pullUpEl.offsetHeight;

   myScroll = new iScroll('wrapper', {
       useTransition: true,
       topOffset: pullDownOffset,
       onRefresh: function () {
           if (pullUpEl.className.match('loading')) {
               pullUpEl.className = '';
               pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more...';
           }
       },
       onScrollMove: function () {
           if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
               pullUpEl.className = 'flip';
               pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Release to refresh...';
               this.maxScrollY = this.maxScrollY;
           } else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
               pullUpEl.className = '';
               pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more...';
               this.maxScrollY = pullUpOffset;
           }
       },
       onScrollEnd: function () {
           if (pullUpEl.className.match('flip')) {
               pullUpEl.className = 'loading';
               pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Loading...';
               loadPatientList(false); // Execute custom function (ajax call?)
           }
       }
   });

   setTimeout(function () { document.getElementById('wrapper').style.left = '0'; }, 800);
}


function patientSearch()
{
    var url = "AppPatientSearch.json?keyword=" + $("input[name=searchbox]").val(),
          cc05;

    $('.resultbox').show();
    $('#calendarLayer').hide();
    $('.resultList').empty();
// configList
// doctorList
// hospital
    $.ajax({
        url: serverUrl + url,
        type: "POST",
        dataType: "jsonp",
        jsonp: "callback",
        timeout: 15000,
          crossDomain:true,
          cache:false,
        success: function (jsonData) {
            var data = jsonData.object;
            for(var i = 0; i < data.customerList.custname.length; i++) {
              $("#CustomerListTmpl").tmpl(data.customerList.custname[i]).appendTo(".wrap_left .resultList");
            }
            // if($('body').hasClass('Chart')){
                DetailView ();
            // } else if ($('body').hasClass('Resv')) {
            //     ModifyHistory();
            // }
            $('.cst').text(data.customerCount.custname);
            $('.keyword').text($("input[name=searchbox]").val());
            cc04 = JSON.parse(data.configList.cc04);
            cc05 = JSON.parse(data.configList.cc05);
            cc06 = JSON.parse(data.configList.cc06);
            doctorList = JSON.parse(data.configList.doctorList);
            nurseList = JSON.parse(data.configList.nurseList);
            formatList();
            $("input[name=searchbox]").val('');
        },
        error: function (xhr, option, error) {
            if(init) {
                // parent.loadMask(false, true);
                location.href = "index.html";
            }
            showMessage(ajaxRequestErrorMessage(xhr.status));
        }       
    });
}

function formatList () {
  $(".format .phone").each(function() {
    $(this).text(format_phone($(this).text()));
  });
  $(".format .gender").each(function() {
    $(this).text(format_gender($(this).text()));
  });
  $(".format .jn").each(function() {
    $(this).text(format_jn($(this).text()));
  });
  $(".totals").each(function() {
    $(this).text(commify($(this).text()));
  });
  $(".format .age").each(function() {
    $(this).text(format_age($(this).text()));
  });
  $(".format .svcarea").each(function() {
    $(this).text(getCodeByName(cc05, "CODE", "CONFIG", $(this).text()));
  });
  $(".format .recent").each(function() {
    if($(this).text() != '')
      $(this).text("최근 " + format_stdate($(this).text()));
  });
  $(".format .visitType").each(function() {
    $(this).text(getCodeByName(cc04, "CODE", "CONFIG", $(this).text()));
  });
  $(".format .drname").each(function() {
    $(this).text(getCodeByName(doctorList, "EMPLOYEEID", "EMPLNAME", $(this).text()));
  });

  $(".resultList .format").removeClass("format");
}

function formatList2 ($target) {
  $(".phone",$target).each(function() {
    $(this).text(format_phone($(this).text()));
  });
  $(".gender",$target).each(function() {
    $(this).text(format_gender($(this).text()));
  });
  $(".jn",$target).each(function() {
    $(this).text(format_jn($(this).text()));
  });
  $(".totals",$target).each(function() {
    $(this).text(commify($(this).text()));
  });
  $(".age",$target).each(function() {
    $(this).text(format_age($(this).text()));
  });
  $(".svcarea",$target).each(function() {
    $(this).text(getCodeByName(cc05, "CODE", "CONFIG", $(this).text()));
  });
  $(".drname",$target).each(function() {
    $(this).text(getCodeByName(doctorList, "EMPLOYEEID", "EMPLNAME", $(this).text()));
  });

  $(".recent",$target).each(function() {
    if($(this).text() != ''){
      $(this).text("최근 " + format_stdate($(this).text()));
    }
  });  
}

function wrapLeftShow(custID){
  $('.wrap_left, #ApMenu').show();
  $('body').addClass('Chart');
  $('#Contents').addClass('resize');
  ConsultView(custID,function () {
    $('#Contents')[0].contentWindow.location.href = 'Chart.html?custID='  + custID + '&peDocmemo=false&page=1';
  });
}


function ModifyHistory (scheduleID,officeWeekHours, customerID){
      var url = serverUrl + "Reservation.json?scheduleID=" + scheduleID + '&customerID= ' + customerID;
      $('.resultList').empty();
      $('.resultbox').hide();
    $.ajax({
        url: url,
        type: "POST",
        dataType: "jsonp",
        jsonp: "callback",
        timeout: 15000,
          crossDomain:true,
          cache:false,
        success: function (jsonData) {
            var data = jsonData.object;
            cc04 = JSON.parse(data.configCode.cc04);
            cc05 = JSON.parse(data.configCode.cc05);
            cc06 = JSON.parse(data.configCode.cc06);
            doctorList = JSON.parse(data.configCode.doctorList);
            nurseList = JSON.parse(data.configCode.nurseList);

            // $('.resultList').empty();
            $('#calendarLayer').hide();
            if (scheduleID !== '' && data.scheduleList.length !== 0) {
                var customerInfo = searchObjectList(data.scheduleList, 'SCHEDULEID', scheduleID);
            }else{
                var customerInfo = data.customerInfo;             
            }
            $("#ResultTmpl").tmpl(customerInfo).appendTo(".wrap_left .resultList");

            var $select = $('select[name=SCHDOCTOR], select[name=VISITTYPE], select[name=SVCAREA], select[name=CONDITION1], select[name=SCHNURSE], select[name=RESVEMPLID], select[name=resvHour], select[name=resvMin]');
            $select.fancySelect();

            prnCodeByOptionHTML($("select[name=VISITTYPE]"), cc04, "CODE", "CONFIG");
            prnCodeByOptionHTML($("select[name=SVCAREA]"), cc05, "CODE", "CONFIG");
            prnCodeByOptionHTML($("select[name=CONDITION1]"), cc06, "CODE", "CONFIG");
            prnCodeByOptionHTML($('select[name=SCHDOCTOR]'), doctorList, "EMPLOYEEID", "EMPLNAME");
            prnCodeByOptionHTML($("select[name=SCHNURSE]"), nurseList, "EMPLOYEEID", "EMPLNAME");
            prnCodeByOptionHTML($("select[name=RESVEMPLID]"), nurseList, "EMPLOYEEID", "EMPLNAME");
            setResvTimeTable(officeWeekHours);

           
           if (customerInfo.RESVTIME !== '' && customerInfo.RESVTIME !== null){
               $('select[name=resvHour]').val(customerInfo.RESVTIME.substr(0,2));
               $('select[name=resvMin]').val(customerInfo.RESVTIME.substr(2,2));
           } 
            $("select[name=VISITTYPE]").val(customerInfo.VISITTYPE);
            $("select[name=SVCAREA]").val(customerInfo.SVCAREA);
            $("select[name=CONDITION1]").val(customerInfo.CONDITION1);
            $("select[name=SCHDOCTOR]").val(customerInfo.SCHDOCTOR);
            $("select[name=SCHNURSE]").val(customerInfo.SCHNURSE);
            $("select[name=RESVEMPLID]").val(customerInfo.RESVEMPLID);
            $('input[name=checkdate]').val(format_stdate(customerInfo.RESVDATE));
            if (customerInfo.RESVDATE === getCalDate()){
              $('.btn_app').show();
            }else{
              $('.btn_app').hide();
            }
            formatList2($('.ApList'));     

            $select.trigger('update.fs');
            SaveAppoint (true);
        },
        error: function (xhr, option, error) {
            if(init) {
                // parent.loadMask(false, true);
                // location.href = "index.html";
            }
            showMessage(ajaxRequestErrorMessage(xhr.status));
        }       
    });
}


function setResvTimeTable(officeWeekHours)
{
  // if(officeHours == null) return;
  var hourArr = [], minArr = [];
  for(var i=officeWeekHours[0]; i<=officeWeekHours[1]; i++) {
    hourArr.push(timeString(i));
  }
  
  for(var key in minTable) {
    minArr.push(timeString(minTable[key]));
  }
  
  prnArrayByOptionHTML($("select[name=resvHour]"), hourArr, true);
  prnArrayByOptionHTML($("select[name=resvMin]"), minArr, true);
  
}

function Activebtn(){
  $('.btn_appoint').off().on('click', function(){
    $(this).hasClass('btn_active') ? $(this).removeClass('btn_active') : $(this).addClass('btn_active');
  });
}

function SaveAppoint (init){
Activebtn();
  $('.btn_app').off().on('click',function(){

 CONDITION1= $('select[name=CONDITION1]').val();
 HISTMEMO= $('textarea[name=HISTMEMO]').val();
  NURSEMEMO= $('textarea[name=NURSEMEMO]').val();
  RESVDATE= delhei($('input[name=checkdate]').val());
  RESVEMPLID= $('select[name=RESVEMPLID]').val();
  RESVMEMO= $('textarea[name=RESVMEMO]').val();
  RESVTIME= $('select[name=resvHour]').val() + $('select[name=resvMin]').val() + '00';
  SCHDOCTOR= $('select[name=SCHDOCTOR]').val();
  SCHNURSE= $('select[name=SCHNURSE]').val();
  SVCAREA= $('select[name=SVCAREA]').val();
  VISITTYPE= $('select[name=VISITTYPE]').val();
  CUSTOMERID= $('.ApList').attr('custid');
  SCHEDULEID= $('.ApList').attr('scheduleID');
  SCHEDULEDATE= RESVDATE;
  SCHEDULETIME= RESVTIME;
  SCHEDULESTATUS= 1;
  resvHour= $('select[name=resvHour]').val();
  resvMin=$('select[name=resvMin]').val();
 $('#RESVCFM').hasClass('btn_active') ? RESVCFM = 0 : RESVCFM = 1;
 $('#RESVTMO').hasClass('btn_active') ? RESVTMO = 0 : RESVTMO = 1;
 $('#RESVTDY').hasClass('btn_active') ? RESVTDY = 0 : RESVTDY = 1;

data = 'CONDITION1=' + CONDITION1 + '&HISTMEMO='  + HISTMEMO + '&NURSEMEMO=' + NURSEMEMO + '&RESVDATE=' + RESVDATE + '&RESVEMPLID=' + RESVEMPLID + '&RESVMEMO=' + RESVMEMO
  + '&RESVTIME=' + RESVTIME + '&SCHDOCTOR=' + SCHDOCTOR + '&SCHNURSE=' + SCHNURSE + '&SVCAREA=' + SVCAREA
   + '&VISITTYPE=' + VISITTYPE + '&CUSTOMERID=' + CUSTOMERID + '&SCHEDULEID=' + SCHEDULEID
    + '&SCHEDULEDATE=' + SCHEDULEDATE + '&SCHEDULETIME=' + SCHEDULETIME + '&SCHEDULESTATUS=' + SCHEDULESTATUS
     + '&resvHour=' + resvHour + '&resvMin=' + resvMin + '&cancelFlag=' + cancelFlag;

      var url = serverUrl + "SaveReservation.json?" + data;
      var cancelFlag = false;
     if($(this).hasClass('btResvCancel')) cancelFlag = true;

    $.ajax({
        url: url,
        type: "POST",
        dataType: "jsonp",
        jsonp: "callback",
        timeout: 15000,
          crossDomain:true,
          cache:false,
        success: function (jsonData) {
            var data = jsonData.object;
            var $url = 'reservation.html?srDate=' +$('input[name=checkdate]').val().replace(/-/g, '');
            $('#Contents')[0].contentWindow.location.href = $url;
        },
        error: function (xhr, option, error) {
            if(init) {
                // parent.loadMask(false, true);
                // location.href = "index.html";
            }
            showMessage(ajaxRequestErrorMessage(xhr.status));
        }       
    });
  });

}

function ShowApMenu(tab){
    var $iframe = $('#Contents').contents(); 
    if(!($iframe.find('.history').hasClass('ChartHide'))) $iframe.find('.history').hide(); 
    $iframe.find('.ChartHide').hide();
      switch(tab){
        case '0':
             $iframe.find('.history').show(); 
        break;
        case '1':
            $iframe.find('.progress').show(); 
        break;
        case '2':
            $iframe.find('.memoNote').show(); 
        break;
        case '3':
            $iframe.find('.addressNote').show(); 
        break;
        case '4':
            $iframe.find('.etc').show(); 
        break;            
    }
}

function DetailView (init){
      // DetailListTmpl
    $('.resultList li').off().on('click',function(){
       loadMask(true);
      var custID = $(this).attr('custID'),
            url = 'getdetailcustomer.json?custid=' + custID;

    // $('.resultList').empty();
    if($('body').hasClass('Chart')){


        if($(this).next('li').hasClass('detail')){
            $(this).next('li').remove();
        } else {
            $.ajax({
                url: serverUrl + url,
                type: "POST",
                dataType: "jsonp",
                jsonp: "callback",
                timeout: 15000,
                  crossDomain:true,
                  cache:false,
                success: function (jsonData) {
                     loadMask(false);
                    var data = jsonData.object;
                    $('.custID_' + custID).after($("#DetailListTmpl").tmpl(data));
                    formatList2($('.custID_' + custID).next('li'));
                },
                error: function (xhr, option, error) {
                    // if(init) {
                        // parent.loadMask(false, true);
                        // location.href = "index.html";
                    // }
                    showMessage(ajaxRequestErrorMessage(xhr.status));
                }       
            });
        }
    } else if ($('body').hasClass('Resv')) {
      $('.resultbox').hide();
        ModifyHistory('',  [6, 21], custID);
    }
   });



}

function resetScheduleInit(srDate)
{

  var $url;

  if ($('body').hasClass('Chart')) {
          // $url = 'Chart.html?custID=' +custID;
  }else{
          $url = 'reservation.html?srDate=' +srDate;
          $('#Contents')[0].contentWindow.location.href = $url;
  }

            //   $.ajax({
            //     url: serverUrl + 'GetCustomerStatusBoard.json?srDate=' + srDate,
            //     type: "POST",
            //     dataType: "jsonp",
            //     jsonp: "callback",
            //     timeout: 15000,
            //       crossDomain:true,
            //       cache:false,
            //     success: function (jsonData) {
            //         var data = jsonData.object;
            //         var scheduleList = data.scheduleList;
            //     },
            //     error: function (xhr, option, error) {
            //         // if(init) {
            //             // parent.loadMask(false, true);
            //             // location.href = "index.html";
            //         // }
            //         showMessage(ajaxRequestErrorMessage(xhr.status));
            //     }       
            // });
}

function loadMask(viewFlag)
{
    if(viewFlag) {
        $(".loadMaskLayer").css("display", "table");
    } else {
        $(".loadMaskLayer").hide();
    }
}
function OnLoad(){
          $('#Contents')[0].contentWindow.location.href = 'index.html';
}

function ConsultView (custID,callback){
      // DetailListTmpl
    $('#calendarLayer').hide();
    loadMask(true);
    var url = 'getdetailcustomer.json?custid=' + custID;

    // $('.resultList').empty();

    $.ajax({
        url: serverUrl + url,
        type: "POST",
        dataType: "jsonp",
        jsonp: "callback",
        timeout: 15000,
          crossDomain:true,
          cache:false,
        success: function (jsonData) {
             loadMask(false);
            var data = jsonData.object;
            $("#CustomerListTmpl").tmpl(data).appendTo('.resultList');
            $("#DetailListTmpl").tmpl(data).appendTo('.resultList');
            formatList();
            formatList2($('.detail'));
            callback();
        },
        error: function (xhr, option, error) {
            // if(init) {
                // parent.loadMask(false, true);
                // location.href = "index.html";
            // }
            showMessage(ajaxRequestErrorMessage(xhr.status));
        }       
    });

}

