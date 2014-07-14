// ex) <input type="text" id="cal" name="cal" value="" size="8" onFocus="calendarShow(this)">

//document.write('<div id="layerCalendar" style="background-color:#FFFFFF; border:solid 2px #CFCFCF; display:none; width:auto; height:auto; padding:10px; position:absolute; left:0px; top:0px; z-index:1;"></div>');

var calendarObj, calendarValue, calendarLayer, calendarFunc, currDate;
var today = new Date();
var checkDateList = [];
var multiResvFlag = false;

// 달력 출력
function calendarInit(objName)
{
	if(objName != null) calendarLayer = document.getElementById(objName);
	//var today = getDateStr(new Date(), "-");
	if(currDate == null) currDate = new Date();

	var year = currDate.getFullYear(); 
	var month = currDate.getMonth();
	var day = currDate.getDate();

	var dateFirst = new Date(year, month, 1); 	// 월 시작일
	var startCellNum = dateFirst.getDay();		// 주간 요일값
	var dateLast = new Date(year, month + 1, 0); // 월 마지막 날
	var endCellNum = dateLast.getDay();		// 마지막 날 요일값
	var daylen = dateLast.getDate();			// 월 일수
	var weekArray = ["일","월","화","수","목","금","토"];
	var fColor, bColor, overColor, viewDate, cssName, viewDateStr;
	var calTable = '';

	calTable += '<center>';
	calTable += '<table width="180" border="0" style="margin-bottom:5px;"><tr>';
	calTable += '<td width="20" style="font-weight:bold;"><a href="javascript:;" onClick="calendarSet(\'month\',-1);" style="text-decoration:none; "><span class= "btn_cprev"></span></a></td>';
	calTable += '<td align="center" style="font-weight:bold; line-height:11px;">' + year + '년 ' + (parseInt(month,10)+1) + '월</td>';
	calTable += '<td width="20" align="right" style="font-weight:bold;"><a href="javascript:;" onClick="calendarSet(\'month\',1);" style="text-decoration:none; "><span class= "btn_cnext"></span></a></td></tr>';
	calTable += '<tr><td height="5" colspan="3"></td></tr></table>';
	calTable += '<table cellpadding="0" id="calendarDayTable" cellspacing="0" border="0" bordercolor="#CFCFCF" style="font-family:arial; font-weight:bold; border-collapse:collapse;" onMouseWheel="calendarSetWheel();"  onContextMenu="return false;">';
	calTable += '<tr height="18" align="center">';
	
	for (var i=0; i<7; i++) {
		calTable += '<td width="30">' + weekArray[i] + '</td>';
	}
	calTable += '</tr><tr height="20" align="center">';

	for(var s=0; s<startCellNum; s++) calTable += '<td></td>';

	for(var d=1; d<=daylen; d++) {
		viewDate = new Date(year, month, d);
		viewDateStr = getDateStr(viewDate);
		
		if(viewDateStr == calendarValue) {
			cssName = "checkday";
		} else if(viewDateStr == getDateStr(today)) {
			cssName = "today";
		} else {
			cssName = (viewDate.getDay() == 0) ? "holiday" : "default";
		}
		calTable += '<td id="calendar_' + viewDateStr + '" onClick="selectDate(this, ' + d + ', event);" class="' + cssName + '" dayno="' + viewDate.getDay() + '">' + d + '</td>';
		if(viewDate.getDay() == 6) {
			calTable += '</tr>';
			if(d != daylen) calTable += '<tr height="20" align="center">';
		}
	}

	for(var s=endCellNum+1; s<7; s++) calTable += '<td></td>';
	if(endCellNum != 6) calTable += '</tr>';
	calTable += '</table>';
	calTable += '</center>';

	calendarLayer.innerHTML = calTable;
	
	calendarMarkInit();
}

// 날짜 마킹 표시
function calendarMarkInit()
{
	if(checkDateList.length == 0) return;
	for(var i=0; i<checkDateList.length; i++) {
		$("#calendar_" + checkDateList[i]).css("background-color", "#B7ECF9");
	}
}


// 날짜 외부입력
function calendarDateSet(strDate)
{
	if(strDate.length != 8) return;
	currDate = getStrToDate(strDate);
	calendarValue = strDate;
	calendarInit();
	if(calendarFunc != null) calendarFunc(calendarValue);
}

// 날짜 선택
function selectDate(obj, selDay, ev)
{
	currDate.setDate(selDay);
	calendarValue = getDateStr(currDate);
	
	var status = parseInt($("input[name=SCHEDULESTATUS]").val()) || 0;

	if(ev.ctrlKey) {
		multiResvFlag = true;
		
		if(($("#reservInputForm").length > 0 && $("#reservInputForm").css("display") == "none") || ($("#reservInputForm").length == 0 && $(".left_reserve > .resvPatientbox").length == 0)) {
			alert("예약할 환자를 먼저 선택하세요.");
			return;
		}
		
		if($("#checkResvdate").css("display") == "none" && status < 2) {
			$("#checkResvdate").show();
			$("#btResv").hide();
			$("#btResvMulti").show();
		}
		
		if(checkDateList.indexOf(calendarValue) > -1) {
			checkDateList = removeElement(checkDateList, checkDateList.indexOf(calendarValue));
			obj.style.backgroundColor = "";
		} else {
			checkDateList.push(calendarValue);
			obj.style.backgroundColor = "#B7ECF9";
		}
		
		var prnDate = "";
		for(var i=0; i<checkDateList.length; i++) {
			prnDate += ", " + getStrToDate(checkDateList[i]).format('mm월 dd일');
		}
		$("#checkResvdate").text(prnDate.substr(2));
	} else {
		if(multiResvFlag) {
			$("#checkResvdate").text('');
			$("#checkResvdate").hide();
			if(status < 2) {
				$("#btResv").show();
				$("#btResvMulti").hide();
			}
			checkDateList = [];
			calendarInit();
			multiResvFlag = false;
		}
		
		$("#calendarLayer .checkday").each(function() {
			var cssName = $(this).attr("dayno") == "0" ? "holiday" : "default";
			$(this).attr("class", cssName);
		});
		obj.className = "checkday";
		if(calendarFunc != null) calendarFunc(calendarValue);
	}
}

// 금일날짜 이동
function setToday()
{
	calendarObj.value = getDateStr(new Date());
	if(calendarFunc != null) eval(calendarFunc);
	calendarHide();
}

// 날짜 계산
function dateCal(calType, cal)
{
	var calYear = currDate.getFullYear(); 
	var calMonth = currDate.getMonth();
	var calDay = currDate.getDate();
	
	switch(calType) {
		case "year": currDate.setYear(parseInt(calYear, 10)+cal); break;
		case "month": currDate.setMonth(parseInt(calMonth, 10)+cal); break;
		case "day": currDate.setDate(parseInt(calDay, 10)+cal); break;
	}
}

// 날짜 이동(월)
function calendarSet(calType, cal)
{
	dateCal(calType, cal);
	calendarInit();	
}

// 날짜이동(마우스 휠)
function calendarSetWheel()
{
	if(event.wheelDelta > 0) {
		calendarSet("month", 1);
	} else {
		calendarSet("month", -1);
	}
}

// 달력 위치 계산
function calendarLayerLocation(setType)
{
	//alert(calendarLayer.offsetWidth+ '/' + calendarLayer.offsetHeight);
	var objLoc = getBounds(calendarObj);
	//alert(objLoc.left  + '/' + objLoc.top + '/' + objLoc.width + '/' + objLoc.height);
	var t, l = objLoc.left;
	switch(setType) {
		case "top":
			t = objLoc.top - calendarLayer.offsetHeight - 1;
			break;
		case "rightTop":
			t = objLoc.top - calendarLayer.offsetHeight - 1;
			l = objLoc.left - (calendarLayer.offsetWidth - objLoc.width); 
			break;
		case "rightBottom":
			t = objLoc.top + calendarObj.offsetHeight + 1;
			l = objLoc.left - (calendarLayer.offsetWidth - objLoc.width); 
			break;
		case "bottom": t = objLoc.top + calendarObj.offsetHeight + 1; break;
		default: t = objLoc.top + calendarObj.offsetHeight + 1; break;
	}

	calendarLayer.style.posTop = t;
	calendarLayer.style.posLeft = l;

	/*
	if(navigator.appName == "Netscape") {
		calendarLayer.style.top = t;
		calendarLayer.style.left = objLoc.left;
	} else {
		calendarLayer.style.posTop = t;
		calendarLayer.style.posLeft = objLoc.left;
	}
	*/
}

// 화면상 객체의 위치 및 크기
function getBounds(tag) 
{ 
	var ret = new Object(); 
	if(tag.getBoundingClientRect) { 
		var rect = tag.getBoundingClientRect(); 
		ret.left = rect.left + (document.documentElement.scrollLeft || document.body.scrollLeft); 
		ret.top = rect.top + (document.documentElement.scrollTop || document.body.scrollTop); 
		ret.width = rect.right - rect.left; 
		ret.height = rect.bottom - rect.top; 
	} else { 
		var box = document.getBoxObjectFor(tag); 
		ret.left = box.x; 
		ret.top = box.y; 
		ret.width = box.width; 
		ret.height = box.height; 
	} 

	return ret;
}

// 달력 초기화
function calendarShow(obj, setType, funcName)
{
	// 초기화
	//obj.blur();
	calendarLayer = document.getElementById('layerCalendar');
	calendarObj = obj;
	calendarValue = obj.value.toString();
	calendarFunc = funcName;
	
	//if(calendarLayer.style.display == 'block') {calendarHide(); return;}
	
	if(calendarValue && calendarValue.length == 8) {
		var year = parseInt(calendarValue.substr(0,4), 10);
		var month = parseInt(calendarValue.substr(4,2), 10);
		var day = parseInt(calendarValue.substr(6,2), 10);
		currDate = new Date(year, month-1, day);
	} else {
		calendarValue = getDateStr(new Date());
		currDate = new Date();
	}
//alert(getDateStr(currDate));
	calendarInit();
	calendarLayer.style.display = 'block';
	calendarLayerLocation(setType);

/*
	if(document.attachEvent) {
		document.attachEvent('onfocus', eventMethod);
	} else if (document.addEventListener) {
		document.addEventListener('focus', eventMethod);
	}
*/
}

function eventMethod(E)
{
	var tg = (window.event) ? E.srcElement : E.target;
	if(tg.name != calendarObj.name) {
		alert(tg.name +'/'+ calendarObj.name)
		calendarHide();
	}
}

// 달력 감추기
function calendarHide()
{
	calendarObj = null;
	calendarFunc = null;
	calendarLayer.style.display = 'none';
	calendarLayer.innerHTML = '';

/*
	if(document.attachEvent) {
		document.detachEvent('onfocus', eventMethod);
	} else if (document.addEventListener) {
		document.removeEventListener('focus', eventMethod);
	}
*/
}

// Date 문자변환
function getDateStr(setDate, divStr)
{
	if(divStr == null) divStr = "";
	var year = parseInt(setDate.getFullYear(), 10); 
	var month = parseInt(setDate.getMonth(), 10) + 1;
	var day = parseInt(setDate.getDate(), 10);
	if(month < 10) month = "0" + month;
	if(day < 10) day = "0" + day;
	
	return year + divStr + month + divStr + day;
}

function wr(str)
{
	document.write(str + '<br>');
}

function dateEcho(dateObj)
{
	var dateStr = dateObj.getFullYear().toString() + dateObj.getMonth().toString() + dateObj.getDate().toString();
	wr(dateStr);
}
