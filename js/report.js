  var serverUrl =  "http://int.trustnhope.com:3114/inbody/",
        saleSummary,
        cashReport,
        receiveSummary,
        areaSummary,
        DateUrl = location.href.split('html')[1];

$(function() {
var jqueryDatepickerOption = {
    monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
    dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
    showMonthAfterYear: true, 
    yearSuffix: "년",
    dateFormat: 'yy-mm-dd'
};    
    $( "#datepicker" ).datepicker(jqueryDatepickerOption);
    loadStatement(true);
     // loaded();
});

function loadStatement(init) {
  $('.summarysum tbody').empty();
    if($('.report_left').hasClass('D')){
      suburl = "DailyBalance.json";      
    }else if ($('.report_left').hasClass('W')){
      suburl = "WeeklyBalance.json";
    }else if($('.report_left').hasClass('M')){
      suburl = "MonthlyBalance.json";
    }else{
      suburl = "AnnualBalance.json";
    }
    
    var url = serverUrl + suburl + DateUrl;
    
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
                 saleSummary = data.saleSummary;
                  cashReport = data.cashReport;
                  receiveSummary = data.receiveSummary;
                  areaSummary = data.areaSummary;

            $('#AreaListTmpl').tmpl(areaSummary).appendTo('.summarysum tbody');
            SetcustomerSummary (saleSummary,cashReport,receiveSummary);
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

function SetcustomerSummary (saleSummary,cashReport,receiveSummary){
// 매출집계
 $('#ordAmt_LIABILITYAMT').text(saleSummary[0].LIABILITYAMT);
 $('#ordRate_LIABILITYAMT').text(saleSummary[1].LIABILITYAMT);
 $('#ordAmt_CLAIMAMT').text(saleSummary[0].CLAIMAMT);
 $('#ordRate_CLAIMAMT').text(saleSummary[1].CLAIMAMT);
 $('#ordAmt_INSTOTAL').text(saleSummary[0].INSTOTAL);
 $('#ordRate_INSTOTAL').text(saleSummary[1].INSTOTAL);
 $('#ordAmt_NONINSAMT').text(saleSummary[0].NONINSAMT);
 $('#ordRate_NONINSAMT').text(saleSummary[1].NONINSAMT);
 $('#ordAmt_CHARGETOTAL').text(saleSummary[0].CHARGETOTAL);
 $('#ordRate_CHARGETOTAL').text(saleSummary[1].CHARGETOTAL);
 $('#ordAmt_ORDERAMT').text(saleSummary[0].ORDERAMT);
 $('#ordRate_ORDERAMT').text(saleSummary[1].ORDERAMT);

if (cashReport !== undefined) {
  // 현금시재
   $('#INITAMT').text(cashReport.INITAMT);
   $('#TOTALSALES').text(cashReport.TOTALSALES);
   $('#PAYMENTTOTAL').text(receiveSummary[0].PAYMENTTOTAL);
   $('#CASHAMT').text(cashReport.CASHAMT);
   $('#EXPENSEAMT').text(cashReport.EXPENSEAMT);
   $('#REFUNDAMT').text(cashReport.REFUNDAMT);
   $('#REMAINAMT').text(cashReport.REMAINAMT);
}

// 수납금액합계
 $('#payAmt_M04').text(receiveSummary[0].M04);
 $('#payRate_M04').text(receiveSummary[1].M04);
 $('#payAmt_PAYMENTTOTAL').text(receiveSummary[0].CASHTOTAL);
 $('#payRate_PAYMENTTOTAL').text(receiveSummary[1].CASHTOTAL);
 $('#payAmt_CXX').text(receiveSummary[0].CXX);
 $('#payRate_CXX').text(receiveSummary[1].CXX);
 $('#payAmt_X00').text(receiveSummary[0].X00);
 $('#payRate_X00').text(receiveSummary[1].X00);
 $('#payAmt_CHARGEAMT').text(receiveSummary[0].PAYMENTTOTAL);
 $('#payRate_CHARGEAMT').text(receiveSummary[1].PAYMENTTOTAL);
 $('#payAmt_RXX').text(receiveSummary[0].RXX);
 $('#payRate_RXX').text(receiveSummary[1].RXX);
 $('#payAmt_UNPAIDAMT').text(receiveSummary[0].UNPAIDAMT);

$('.numberorder').each(function(){
  $(this).text(commify($(this).text()));
})
  $(".numfixed").each(function() {
    var val = $(this).text();
    if(val == '') return;
    val = val.replace('%','');
    var fixval = parseFloat($(this).text()).toFixed(2).toString() + '%';    
    $(this).text(fixval);
  });
}

// function loaded()
// {
//   var reportcroll = new IScroll('#wrap_report', { scrollX : false, scrollY : true});
// }
