// 날짜출력
function getCalDate(calDay, str)
{
    if(calDay == null) calDay = 0;
    if(str == null) str = "";

    var curDate = new Date();
    curDate.setDate(parseInt(curDate.getDate(), 10) + calDay);
    
    var year = parseInt(curDate.getFullYear(), 10); 
    var month = parseInt(curDate.getMonth(), 10) + 1;
    var day = parseInt(curDate.getDate(), 10);
    if(month < 10) month = "0" + month;
    if(day < 10) day = "0" + day;
    
    return year + str + month + str + day;  
}

function format_stdate(date) {
  if(date == null) return "";
  return date.replace(/([0-9]{4})([0-9]{2})([0-9]{2})/, "$1-$2-$3");
}


function format_stdatekr(date) {
  if(date == null) return "";
  return date.replace(/([0-9]{4})([0-9]{2})([0-9]{2})/, "$1년 $2월 $3일");
}

function hjson(params) {
    var options = $.extend({
        url: '',
        dataType: 'json',
        data: null,
        timeout: 30000,
        beforeSend: null,
        error: function (request, error) {
            if (error == "timeout") {
                alert('timeout');
            } else {
                alert(error);
            }
        },
        datasuccess: null,
        datafail: null,
        success: function (data) {
            if (data.Result == "SUCCESS") {
                if (params.datasuccess != null) {
                    params.datasuccess(data);
                }
            } else if (data.Result == "AUTH") {
                if (params.datafail != null) {
                    params.datafail(data.Result);
                } else {
                    location.href = "index.html"
                }
            }
        }
    }, params);

    $.ajax(options);
}

(function ($) {
    //https://github.com/danheberden/serializeObject
    $.fn.serializeObject = function () {
        var data = {},
        lookup = data; //current reference of data
        try {
            if (this[0].tagName && this[0].tagName.toUpperCase() == "FORM") {
                var arr = this.serializeArray();
                if (arr) {
                    $.each(arr, function () {
                        //obj[this.name] = this.value;
                        var named = this.name.replace(/\[([^\]]+)?\]/g, ',$1').split(','),
                    cap = named.length - 1,
                    i = 0;

                        // Ensure that only elements with valid `name` properties will be serialized
                        if (named[0]) {
                            for (; i < cap; i++) {
                                // move down the tree - create objects or array if necessary
                                lookup = lookup[named[i]] = lookup[named[i]] ||
                          (named[i + 1] == "" ? [] : {});
                            }

                            // at the end, psuh or assign the value
                            if (lookup.length != undefined) {
                                lookup.push($(this).val());
                            } else {
                                if (!lookup[named[cap]])
                                    lookup[named[cap]] = this.value; //$(this).val();
                                else {
                                    if (!(lookup[named[cap]] instanceof Array))
                                        lookup[named[cap]] = [lookup[named[cap]]];
                                    lookup[named[cap]].push(this.value);
                                }
                            }

                            // assign the reference back to root
                            lookup = data;
                        }
                    });
                } //if ( arr ) {
            }
        }
        catch (e) { alert(e.message); }
        finally { }

        return data;
    };
})(jQuery);

//http://mwultong.blogspot.com/2006/12/javascript-comma-number-thousands.html
function commify(n) {
    var reg = /(^[+-]?\d+)(\d{3})/;   // 정규식
    n += '';                          // 숫자를 문자열로 변환

    while (reg.test(n))
        n = n.replace(reg, '$1' + ',' + '$2');

    return n;
}

function setInputNumber(obj) {
    obj.value = obj.value.replace(/[^0-9]/g, '');
    obj.value = commify(decommify(obj.value));
}

function setInputNumber2(obj) {
    obj.value = obj.value.replace(/[^-0-9]/g, '');
    obj.value = commify(decommify(obj.value));
}

function decommify(n) {
    return n.replace(/,/gi, "");
}

function format_phone(num) {
    return num.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, "$1-$2-$3");
}

function format_zipcode(zipcode) {
    return zipcode.replace(/([0-9]{3})([0-9]{3})/, "$1-$2");
}

function format_date(date, formatStr) {
    if (date == null) return "";
    var parts = date.match(/^(\d{4})(\d\d)(\d\d)(\d)*$/);
    if (parts == null) return;
    var date = new Date(parts[1], parts[2] - 1, parts[3]);
    //return date.toString(format);
    return date.format(formatStr)
}
function format_gender(gender) {
  if(gender == 1) {
    return "남";
  }
  else if (gender == 2) {
    return "여";
  }
  else {
    return "-";
  }
}
function format_dobAge(str) {
  str = str.replace(/ /g,'');
  var len = str.length;
  var age=0;
  if (len >= 8)
  {
    var uYear = str.substring(0, 4);
    var uMonth = str.substring(4, 6);
    var uDay = str.substring(6, 8);
    
    if(uYear == 0) return 0;
    
    uYear = parseInt(uYear);
    uMonth = parseInt(uMonth);
    uDay = parseInt(uDay);

    var date = new Date();
    var year = parseInt(date.getFullYear(),10);
    var month = parseInt(date.getMonth(),10) + 1;
    var day = parseInt(date.getDate(),10);

    if (uMonth > month) {
        age = year - uYear - 1;
    } else if (uMonth == month) {
        if (uDay <= day)
            age = year - uYear;
        else
            age = year - uYear - 1;
    } else {
        age = year - uYear;
    }
  }
  return age;
}
// datetime 12자리
function format_datetime(datetime, format) {
    if (datetime == null) return "";
    var parts = datetime.toString().match(/^(\d{4})(\d\d)(\d\d)(\d\d)(\d\d)(\d)*$/);
    if (parts == null) return;
    var datetime = new Date(parts[1], parts[2] - 1, parts[3], parts[4], parts[5]);
    //return datetime.toString(format);
    return datetime.format(format);
}
function format_time(time) {
  return time.replace(/([0-9]{2})([0-9]{2})/, "$1:$2").substring(0,5);
}


function parseQuery() {
    var map = new Map();
    var query = location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        map.put(pair[0], pair[1]);
    }
    return map;
}

function JSONtoString(object) {
    var isArray = (object.join && object.pop && object.push
                    && object.reverse && object.shift && object.slice && object.splice);
    var results = [];

    for (var i in object) {
        var value = object[i];

        if (typeof value == "object")
            results.push((isArray ? "" : "\"" + i.toString() + "\" : ")
                             + JSONtoString(value));
        //else if (value)
        else
            results.push((isArray ? "" : "\"" + i.toString() + "\" : ")
                            + (typeof value == "string" ? "\"" + value + "\"" : value));
    }

    return (isArray ? "[" : "{") + results.join(", ") + (isArray ? "]" : "}");
}

function mphon(obj) {
    obj.value = PhonNumStr(obj.value);
}

function PhonNumStr(str) {
    var RegNotNum = /[^0-9]/g;
    var RegPhonNum = "";
    var DataForm = "";

    // return blank     
    if (str == "" || str == null) return "";

    // delete not number
    str = str.replace(RegNotNum, '');

    if (str.length < 4) return str;

    if (str.length > 3 && str.length < 7) {
        DataForm = "$1-$2";
        RegPhonNum = /([0-9]{3})([0-9]+)/;
    } else if (str.length == 7) {
        DataForm = "$1-$2";
        RegPhonNum = /([0-9]{3})([0-9]{4})/;
    } else if (str.length == 9) {
        DataForm = "$1-$2-$3";
        RegPhonNum = /([0-9]{2})([0-9]{3})([0-9]+)/;
    } else if (str.length == 10) {
        if (str.substring(0, 2) == "02") {
            DataForm = "$1-$2-$3";
            RegPhonNum = /([0-9]{2})([0-9]{4})([0-9]+)/;
        } else {
            DataForm = "$1-$2-$3";
            RegPhonNum = /([0-9]{3})([0-9]{3})([0-9]+)/;
        }
    } else if (str.length > 10 || str.length == 8) {
        DataForm = "$1-$2-$3";
        RegPhonNum = /([0-9]{3})([0-9]{4})([0-9]+)/;
    }

    while (RegPhonNum.test(str)) {
        str = str.replace(RegPhonNum, DataForm);
    }
    return str;
}

function removeElement(sor, from, to) {
    if (sor.constructor != Array) return;
    var arr = [];
    for (var i = 0; i < sor.length; i++) {
        if (to == undefined) {
            if (from == i) continue;
        } else {
            if (from <= i && i <= to) continue;
        }
        arr.push(sor[i]);
    }
    return arr;
}

function getElement(sor, from, to) {
    if (sor.constructor != Array) return;
    var arr = [];
    for (var i = 0; i < sor.length; i++) {
        if (from <= i && i <= to) {
            arr.push(sor[i]);
        }
    }
    return arr;
}

function getQueryParams() {
    var params = {};
    if (location.search) {
        var parts = location.search.substring(1).split('&');

        for (var i = 0; i < parts.length; i++) {
            var nv = parts[i].split('=');
            if (!nv[0]) continue;
            params[nv[0]] = nv[1] || true;
        }
    }

    return params;
}

function showMessage(msgText) {
    //alert(navigator.appVersion.indexOf("MSIE 7"));
    //if(navigator.appVersion.indexOf("MSIE 7") > -1 || navigator.appVersion.indexOf("MSIE 8") > -1) hSize += 30;
    //alert(msgText); return;
    parent.showMessage(msgText); return;

    var wSize = 320, hSize = 125;
    var obj = document.getElementById('AlertLayer');
    var Loc = centerPosition(wSize, hSize).split('/');

    document.getElementById('AlertMessage').innerHTML = msgText;
    obj.style.left = Loc[0] + 'px';
    obj.style.top = Loc[1] + 'px';
    obj.style.display = 'block';
    obj.focus();
}

function hideMessage() {
    var obj = document.getElementById('AlertLayer');
    document.getElementById('AlertMessage').innerHTML = '';
    obj.style.display = 'none';
}

var alertHTML = '<div id="AlertLayer" style="background-color:#474747; border:solid 2px #CFCFCF; display:none; width:320px; height:125px; position:absolute; left:0px; top:0px; z-index:9; border-radius:8px; padding:2px;">'
        + '  <div id="AlertMessage" style="color:#FFFFFF; padding-top:30px; font-size:18px; height:58px; text-align:center;"></div>'
        + '  <button style="margin:0; font:bold 16px Dotum; width:100%; height:35px; padding:5px 15px 5px 15px;" onClick="hideMessage()">확인</button>'
        + '</div>';
document.write(alertHTML);

function centerPosition(wSize, hSize) {
    s_width = screen.width;
    s_height = screen.height;

    l = (s_width - wSize) / 2 - 1;
    t = (s_height - (hSize + 100)) / 2 - 1;

    return l + '/' + t;
}

function ajaxRequestErrorMessage(code)
{
    if(code == null) return "";
    var message = "";
    switch(code) {
        case 0: message = "네트워크연결이 실패하였습니다."; break;        // timeout
        case 200:   message = "요청 데이터 오류"; break;
        case 401:   message = "접근 권한이 없습니다."; break;
        case 403:   message = "접근 거부되었습니다."; break;
        case 404:   message = "요청 페이지를 찾을 수 없습니다."; break;
        case 500:   message = "서버 내부 오류 발생"; break;
    }
    
    return message;
}
function getCodeByName(arr, codeName, valName, code)
{
    var val = "";
    if(arr == null || arr.length ==0) return val;
    for(var key in arr) {
        if(arr[key][codeName] == code) {
             val = arr[key][valName];
             break;
        }
    }
    return val;
}

function getStrToDate(str)
{
    if(str == null || str == "") return;
    var parts = str.match(/^(\d{4})(\d\d)(\d\d).*$/);
    if(parts == null) return;
    return new Date(parts[1], parts[2]-1, parts[3]);
}
function getDayKr(dayNo)
{
    var dayKr = "";
    switch(dayNo) {
        case 0: dayKr = "일"; break;
        case 1: dayKr = "월"; break;
        case 2: dayKr = "화"; break;
        case 3: dayKr = "수"; break;
        case 4: dayKr = "목"; break;
        case 5: dayKr = "금"; break;
        case 6: dayKr = "토"; break;
    }
    
    return dayKr;
}
// 날짜 간격 계산
function dateTermCal(dateStr, moveType, cal)
{
    if(dateStr == null || dateStr.length < 8) return;
    var currDate = getStrToDate(dateStr);

    switch(moveType) {
        case "day": currDate.setDate(currDate.getDate() + cal); break;
        case "week": currDate.setDate(currDate.getDate() + cal * 7); break;
        case "month": currDate.setMonth(currDate.getMonth() + cal); break;
        case "year": currDate.setFullYear(currDate.getFullYear() + cal); break;
    }
    
    return getDateToStr(currDate);
}
function getDateToStr(setDate)
{
    var year = parseInt(setDate.getFullYear(), 10); 
    var month = parseInt(setDate.getMonth(), 10) + 1;
    var day = parseInt(setDate.getDate(), 10);
    if(month < 10) month = "0" + month;
    if(day < 10) day = "0" + day;
    
    return year.toString() + month.toString() + day.toString();
}

function format_age(str) {
  var len = str.length;
  var age=0;
  if (len >= 7)
  {
    var flag = str.substring(6,7);
    var uYear = str.substring(0, 2);
    var uMonth = str.substring(2, 4);
    var uDay = str.substring(4, 6);

    uYear = parseInt(uYear);
    uMonth = parseInt(uMonth);
    uDay = parseInt(uDay);

    switch (parseInt(flag))
    {
        case 0: // 1800 ~ 1899년에 태어난 여성 
            uYear = uYear + 1800;
            break;
        
        case 1: // 1900 ~ 1999년에 태어난 남성 
            uYear = uYear + 1900;
            break;
        
        case 2: // 1900 ~ 1999년에 태어난 여성 
            uYear = uYear + 1900;
            break;
        
        case 3: // 2000 ~ 2099년에 태어난 남성 
            uYear = uYear + 2000;
            break;
        
        case 4: // 2000 ~ 2099년에 태어난 여성 
            uYear = uYear + 2000;
            break;
        
        case 5: // 1900 ~ 1999년에 외국에서 태어난 남성 
            uYear = uYear + 1900;
            break;
        
        case 6: // 1900 ~ 1999년에 외국에서 태어난 여성 
            uYear = uYear + 1900;
            break;
        
        case 7: // 2000 ~ 2099년에 외국에서 태어난 남성 
            uYear = uYear + 2000;
            break;
        
        case 8: // 2000 ~ 2099년에 외국에서 태어난 여성 
            uYear = uYear + 2000;
            break;
        
        case 9: // 1800 ~ 1899년에 태어난 남성
            uYear = uYear + 1800;
            break;
        
        default:
            uYear = uYear + 1900;
            break;
    }

    var date = new Date();
    var year = parseInt(date.getFullYear(),10);
    var month = parseInt(date.getMonth(),10) + 1;
    var day = parseInt(date.getDate(),10);

    if (uMonth > month) {
        age = year - uYear - 1;
    } else if (uMonth == month) {
        if (uDay <= day)
            age = year - uYear;
        else
            age = year - uYear - 1;
    } else {
        age = year - uYear;
    }
  }
  return age;
}

var jqueryDatepickerOption = {
    monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
    dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
    showMonthAfterYear: true, 
    yearSuffix: "년",
    dateFormat: 'yy-mm-dd'
};

function searchObjectList(list, key, val)
{
    var result = null;
    if(list == null || list.length == 0) return result;
    
    for(var i=0; i<list.length; i++){
        if(list[i][key] == undefined) continue;
        if(list[i][key] == val) {
            result = list[i];
            break;
        }
    }
    
    return result;
}

function format_time(time) {
  return time.replace(/([0-9]{2})([0-9]{2})/, "$1:$2").substring(0,5);
}

function prnCodeByOptionHTML(tarObj, arr, codeName, valName)
{
    if(arr == null || arr.length ==0) return;
    for(var key in arr) {
        tarObj.append('<option value="' + arr[key][codeName] + '">' + arr[key][valName] + '</option>');
    }
}

function timeString(val)
{
    val = val.toString();
    if(val.length == 1) val = "0" + val;
    return val;
}

function prnArrayByOptionHTML(tarObj, arr, keyNull)
{
    if(arr == null || arr.length ==0) return;
    var code = "";
    for(var key in arr) {
        code = keyNull == null ? key : arr[key];
        tarObj.append('<option value="' + code + '">' + arr[key] + '</option>');
    }
}
function delhei(str)
{
    if(str == null) return "";
    return str.replace(/-/g, '');
}
function getUrlParams() {
  var params = {};
  window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str,key,value) {
    params[key] = value;
  });
 
  return params;
}

function format_jn(jn) {
  return jn.replace(/([0-9]{6})([0-9]{1})/, "$1-$2").substring(0,8);
}
