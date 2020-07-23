var webAddress = '//aa5jc.ngrok.io/supermon/jc_stats.php';

var uiBorder = ['bg-1'];
var uiColors = ['bg-2', 'bg-3', 'bg-4', 'bg-3', 'bg-4', 'bg-3', 'bg-4'];
var uiColorsDark = ['bg-2-dark', 'bg-3-dark', 'bg-4-dark', 'bg-3-dark', 'bg-4-dark', 'bg-3-dark', 'bg-4-dark'];
var uiInactive = ['bg-7', 'bg-8'];

var tmrClock = null;
var data = {
	location: {
		latitude:'',
		longitude:''
	},
	server: {
		cputemp: { F:0,C:0 },
		memory: { percentAvailable: '100' },
		cpuusage: 0
	},
	timestamp: {time:'00:00'}
};
function getData() {
	var request = new XMLHttpRequest();
	request.open('GET', webAddress, true);

	request.onload = function() {
		if (request.status >= 200 && request.status < 400) {
			// Success!
			data = JSON.parse(request.responseText);
			
			// Calculate any values
			data.server.memory.percentAvailable = Math.round((data.server.memory.free / data.server.memory.total) * 100);
			data.server.cpuusage = Math.round(((data.server.cpuusage.split("load average: ")[1].split(", ")[1]) * 100) / data.server.cores);
			data.location.headerString = data.location.latitude + ', ' + data.location.longitude;
			data.weather.headerString = data.weather.observation + ", " + data.weather.temperature.F + " (" + data.weather.temperature.C + ")";
			data.server.ports.headerString = "AllStar (" + data.server.ports.allstar + "), Asterisk (" + data.server.ports.asteriskMgmt + "), SSH (" + data.server.ports.ssh + ")";
			
			// Update the page
			updateField("data.server.cputemp.F", "CPU temp: ", "° F");
			updateField("data.server.memory.percentAvailable", "RAM free: ", "%");
			updateField("data.server.cpuusage", "CPU used: ", "%");
			updateField("data.timestamp.time");
			updateField("data.location.headerString", "LOCATION: ");
			updateField("data.location.AMSL", "ALTITUDE: ", " meters");
			updateField("data.weather.headerString", "WEATHER: ")
			updateField("data.server.ports.headerString", "PORTS: ");
		} else {
			console.error("The server returned an error.");
		}
	};

	request.onerror = function() {
		console.error("Unable to connect to " + webAddress);
	};

	request.send();
}
function updateField(val, prefix, suffix){
	if (prefix == null) {prefix = "";}
	if (suffix == null) {suffix = "";}
	var el = document.getElementById(val);
	
	if (el.hasAttribute("data-label")) {
		el.setAttribute("data-label", prefix + eval(val) + suffix); 	
	}
	else if (el.getElementsByClassName("text").length > 0) {
		el.getElementsByClassName("text")[0].innerText = prefix + eval(val) + suffix;
	}
	else {
		el.innerText = prefix + eval(val) + suffix;
	}
}
function getStatColor(stat, statValue) {
	var good = ['bg-2'];
	var bad = ['bg-red-1','bg-red-2'];
	
	var rtn = good;
	
	if (stat == "temp" && statValue > 170) { rtn = bad; }
	if (stat == "memory" && statValue < 40) { rtn = bad; }
	if (stat == "cpu" && statValue > 70) { rtn = bad; }
	
	return rtn;
}
function showAlternateData(objId, altValue) {
	oldValue = $("#" + objId).attr("data-label");
	$("#" + objId).attr("data-label", altValue);
	$("#" + objId).attr("href", 'javascript:showAlternateData("' + objId + '", "' + oldValue + '");');
}
function toggleFullScreen(event) {
  var element = document.body;

	if (event instanceof HTMLElement) {
		element = event;
	}

	var isFullscreen = document.webkitIsFullScreen || document.mozFullScreen || false;

	element.requestFullScreen = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || function () { return false; };
	document.cancelFullScreen = document.cancelFullScreen || document.webkitCancelFullScreen || document.mozCancelFullScreen || function () { return false; };

	isFullscreen ? document.cancelFullScreen() : element.requestFullScreen();
}
var bracket = {type:'wrapper', class:'sdk bracket typeA', children:[
		{type:'wrapper', class:'content', id:"bracketContents", children: [
			//{type:'img', src:'st-pi.png'}
			{type:'htmlTag', tag:'div', text:'', 
			 style:'background-image: url("/interfaces/AA5JC/ufp.png"); background-size:contain; background-repeat: no-repeat; background-position: center center; height:100%; width:100%', 
			 color:LCARS.colorGen(uiColors).replace('bg-', 'text-')}
		]},
		{type:'elbow', version:'top-left', size:'small', color:LCARS.colorGen(uiColors), children:[{type:'bar'}], noEvent:true},	
		{type:'elbow', version:'top-right', size:'small', color:LCARS.colorGen(uiColors), children:[{type:'bar'}], noEvent:true},	
		{type:'elbow', version:'bottom-left', size:'small', color:LCARS.colorGen(uiColors), children:[{type:'bar'}], noEvent:true},	
		{type:'elbow', version:'bottom-right', size:'small', color:LCARS.colorGen(uiColors), children:[{type:'bar'}], noEvent:true},        
		{type:'column', flex:'v', children:[
			{type:'bar', flexC:'v', color:LCARS.colorGen(uiColors)},
			{type:'bar', flexC:'v', color:LCARS.colorGen(uiColors), children:[{type:'bar', color:'bg-white'}]},
			{type:'bar', flexC:'v', color:LCARS.colorGen(uiColors)}                     
		]},
		{type:'column', flex:'v', children:[
			{type:'bar', flexC:'v', color:LCARS.colorGen(uiColors)},
			{type:'bar', flexC:'v', color:LCARS.colorGen(uiColors)},
			{type:'bar', flexC:'v', color:LCARS.colorGen(uiColors)}                     
		]},
		{type:'column', flex:'v', children:[
			{type:'bar', flexC:'v', color:LCARS.colorGen(uiColors)},
			{type:'bar', flexC:'v', color:LCARS.colorGen(uiColors), children:[{type:'bar', color:'bg-white'}]},
			{type:'bar', flexC:'v', color:LCARS.colorGen(uiColors)}                    
		]},
		{type:'column', flex:'v', children:[
			{type:'bar', flexC:'v', color:LCARS.colorGen(uiColors)},
			{type:'bar', flexC:'v', color:LCARS.colorGen(uiColors)},
			{type:'bar', flexC:'v', color:LCARS.colorGen(uiColors)}                     
		]}
	]
};
function buildNemesisUi() {
	var nemesisUI = {type:'wrapper', id:'wpr_viewport', version:'row', flex:'h', arrive:function(){$(this).viewport('zoom', {width:1920, height:1080});}, children:[

		//Left Column Wrapper
		{type:'column', flex:'v', children:[
			{type:'wrapper', children:[

				//Bracket
				{type:'bracket', template:bracket},

				//Top Button Group
				{type:'wrapper', flex:'h', version:'button-wrap', children:[
					{type:'button', color:LCARS.colorGen(getStatColor('temp',data.server.cputemp.F)), version:'left', id:'data.server.cputemp.F', label:'', href: 'javascript:showAlternateData("data.server.cputemp.F", "CPU temp: " + data.server.cputemp.C + "° C");' },
					{type:'button', color:LCARS.colorGen(getStatColor('memory',data.server.memory.percentAvailable)), id: 'data.server.memory.percentAvailable', label:'', href: 'javascript:showAlternateData("data.server.memory.percentAvailable", "RAM free: " + data.server.memory.free + " MB");' },
					{type:'button', color:LCARS.colorGen(getStatColor('cpu',data.server.cpuusage)), version:'left', id:'data.server.cpuusage', label:''},
					{type:'button', color:LCARS.colorGen(uiInactive)},
					{type:'button', color:LCARS.colorGen(uiInactive), version:'left'},
					{type:'button', color:LCARS.colorGen(uiInactive)}
				]},

				//Bottom Button Group
				{type:'wrapper', flex:'h', version:'button-wrap', children:[
					{type:'button', color:LCARS.colorGen(uiColors), version:'left', label:'HamVOIP', href:'javascript:window.open("https://hamvoip.org/");' },
					{type:'button', color:LCARS.colorGen(uiColors), version:'button', label:'LCARS SDK', href:'javascript:window.open("https://github.com/Aricwithana/LCARS-SDK/");' },
					{type:'button', color:LCARS.colorGen(uiColors), version:'left', label:'ngrok', href:'javascript:window.open("https://ngrok.com/");' },
					{type:'button', color:LCARS.colorGen(uiColors), version:'button', label:'Let\'s Encrypt', href:'javascript:window.open("https://letsencrypt.org/");' },
					{type:'button', color:LCARS.colorGen(uiColors), version:'left', label:'Github', href:'javascript:window.open("https://github.com/JoshuaCarroll/StarTrak")'},
					{type:'button', color:LCARS.colorGen(uiColors), version:'button', label:'Appveyor', href:'javascript:window.open("https://ci.appveyor.com/project/JoshuaCarroll/startrak")' },
				]}
			]},

			{type:'column', style:'justify-content: flex-end;', flexC:'v', flex:'v', children:[
				{type:'complexButton', id:'data.timestamp.time', text: '00:00', template:LCARS.templates.sdk.buttons.complexText.typeG, colors:LCARS.colorGroupGen(uiColors, 3)}
			]}
		]},

		//Main Area
		{type:'wrapper', version:'column', id:'wpr_mainView', flex:'v', flexC:'h', children:[   

			//Header
			{type:'row', version:'header', flex:'h', children:[

				//Elbow & Button
				{type:'column', flex:'v', children:[
					{type:'elbow', version:'bottom-left', color:LCARS.colorGen(uiBorder), flexC:'v'}
				]},

				{type:'wrapper', flexC:'h', flex:'v', children:[

					//Header Content Area
					{type:'wrapper', version:'content', flexC:'v', children:[
						{type:'row', flex:'h', children:[
							{type:'column', class:'headerCol1 text-grey-3', flex:'h', children:[
								{type:'wrapper', flex:'h', class:'stats', children:[
									{type:'htmlTag', tag:'ul', children:[
										{type:'htmlTag', tag:'li', id:'data.location.headerString'},
										{type:'htmlTag', tag:'li', id:'data.location.AMSL'},
										{type:'htmlTag', tag:'li', id:'data.weather.headerString'},
										{type:'htmlTag', tag:'li', id:'data.server.ports.headerString'},
									]}
								]}
							]},
							{type:'column', class:'headerCol2', flex:'h', children:[
								//Header Title
								{type:'title', text:'AA5JC', class:'headerTitle'},

								//Header Pill Button Group
								{type:'wrapper', flex:'h', class:'button-wrap headerButtons', children:[
									{type:'button', color:LCARS.colorGen(uiColors), version:'left', label:'Full screen', href:'javascript:toggleFullScreen();'},
									{type:'button', color:LCARS.colorGen(uiColors), version:'button', label:'Get data', href:'javascript:getData();'},
									{type:'button', color:LCARS.colorGen(uiInactive), version:'left', label:'', href:''},
									{type:'button', color:LCARS.colorGen(uiColors), version:'button', label:'Digital Bridge', href: 'javascript:setContent("http://digitalbridge.southcentralus.cloudapp.azure.com/allmon2/link.php?nodes=499601")'}
								]}
							]}	
						]}
					]},
					//Header Bottom Bars
					{type:'row', version:'frame', flex:'h', children:[
						{type:'bar', color:LCARS.colorGen(uiBorder)},
						{type:'bar', color:LCARS.colorGen(uiBorder)},
						{type:'bar', color:LCARS.colorGen(uiBorder)},
						{type:'bar', color:LCARS.colorGen(uiBorder), flexC:'h'},
						{type:'bar', color:LCARS.colorGen(uiBorder)},
						{type:'bar', color:LCARS.colorGen(uiBorder)},
						{type:'bar', color:LCARS.colorGen(uiBorder)}
					]}
				]}
			]},

			//Main Content Area
			{type:'wrapper', class:'main', flex:'h', flexC:'v', children:[

				//Left Columns & Elbow
				{type:'wrapper', version:'column', flex:'v', children:[
					{type:'elbow', version:'top-left', color:LCARS.colorGen(uiBorder), class:'step-two'},
					{type:'button', id:'btn01', color:LCARS.colorGen(uiColorsDark), label: 'AllStar Link', href:'javascript:setContent("https://www.allstarlink.org/nodelist/", "btn01");'},
					{type:'button', id:'btn02', color:LCARS.colorGen(uiColorsDark), label:'BrandMeister', href:'javascript:setContent("https://brandmeister.network/", "btn02");'},
					{type:'button', id:'btn03', color:LCARS.colorGen(uiColorsDark), label:'QRZ Log', href:'javascript:setContent("https://logbook.qrz.com/", "btn03")' },
					{type:'button', id:'btn04', color:LCARS.colorGen(uiColorsDark), label:'Jitsi', href:'javascript:setContent("https://meet.jit.si/fcarc", "btn04")'},
					{type:'button', id:'btn05', color:LCARS.colorGen(uiColorsDark), label:'Radar', href:'javascript:setContent("https://embed.windy.com/embed2.html?lat=' + data.location.latitude + '&lon=' + data.location.longitude + '&detailLat=34.769&detailLon=-92.439&zoom=7&level=surface&overlay=radar&product=radar&calendar=now&type=map&location=coordinates&metricWind=mph&metricTemp=%C2%B0F&radarRange=-1", "btn05")'},
					{type:'button', id:'btn06', color:LCARS.colorGen(uiColorsDark), label:'Ark Dept Health', href:'javascript:setContent("https://experience.arcgis.com/experience/c2ef4a4fcbe5458fbf2e48a21e4fece9", "btn06")'},
					{type:'button', id:'btn07', color:LCARS.colorGen(uiColorsDark), label:'KARK COVID', href:'javascript:setContent("https://www.kark.com/news/health/coronavirus/confirmed-cases-of-covid-19-in-arkansas-up-to-118/#content", "btn07")'},
					{type:'button', id:'btn08', color:LCARS.colorGen(uiColorsDark), label:'NWS Chat', href:'javascript:setContent("https://nwschat.weather.gov/live/", "btn08")'},
					{type:'button', color:LCARS.colorGen(uiBorder), flexC:'v'}
				]},

				{type:'column', flexC:'h', flex:'v', children:[
					//Top Bars Group
					{type:'row', flex:'h', class:'frame', children:[
						{type:'bar', color:LCARS.colorGen(uiBorder)},
						{type:'bar', color:LCARS.colorGen(uiBorder), version:'small'},
						{type:'bar', color:LCARS.colorGen(uiBorder)},
						{type:'bar', color:LCARS.colorGen(uiBorder), flexC:'h'},
						{type:'bar', color:LCARS.colorGen(uiBorder)},
						{type:'bar', color:LCARS.colorGen(uiBorder)},
						{type:'bar', color:LCARS.colorGen(uiBorder)}
					]},

					//Main Content Wrapper
					{type:'wrapper', class:'content', flexC:'v', style:' overflow:auto;', children:[
						{
							type:'htmlTag', tag:'div', id:'divMainContent', text:'', 
							style:'border-radius: 30px 0 0 0; width: 100%; height: 100%; overflow: hidden;', 
							color:LCARS.colorGen(uiColors).replace('bg-', 'text-') 
						}
					]}
				]}
			]}
		]}
	]}; 
	
	$("body").html("");
	$(nemesisUI).createObject({appendTo:'body'});
}
function getUtcTime() {
	var now = new Date;
	var hours = now.getUTCHours().toString() ;
	var minutes = now.getMinutes().toString();
	var separator = ":";
	if (hours.length == 1) { hours = "0" + hours; }
	if (minutes.length == 1) {minutes = "0" + minutes; }
	return hours + separator + minutes;
}
function getMillisecondsLeft() {
	var now = new Date();
	var ms = ((60 - now.getSeconds()) * 1000) + (1000 - now.getMilliseconds());
	return ms;
}
function tmrClock_tick() {
	getData();
	tmrClock = window.setTimeout(function() {
		tmrClock_tick();
	}, getMillisecondsLeft());
}
function setContent(url, caller) {
	var iframeName = url.replace(/:/g,"").replace(/\//g,"").replace(/\./g,"");
	arrCharactersToStopAt = ["?","#"];
	for (var x = 0; x < arrCharactersToStopAt.length; x++) {
		if (iframeName.indexOf(arrCharactersToStopAt[x]) > 0) {
			iframeName = iframeName.substring(0,iframeName.indexOf(arrCharactersToStopAt[x]));
		}
	}

	if ( $("#"+iframeName).length ) {
		if ($("#"+iframeName).is(":visible")) {
			$("#"+iframeName).remove();
			setButtonStatus(caller, false);
		}
		else {
			$("iframe").hide();
			$("#"+iframeName).show();
			setButtonStatus(caller, true);
		}
	}
	else {
		setButtonStatus(caller, true);
		$("iframe").hide();
		$("#divMainContent").append("<iframe id='" + iframeName + "' allow='camera;microphone' src='" + url + "'></iframe>");
	}
}
function setButtonStatus(obj, isEnabled) {
	if (obj != null) {
		if (isEnabled) {
			var objClass = $("#"+obj).attr("class").replace("-dark","");
			$("#"+obj).attr("class", objClass);
		}
		else {
			var objClass = $("#"+obj).attr("class") + "-dark";
			$("#"+obj).attr("class", objClass);
		}
	}
}
$(document).on('ready', function(){
	$("body").html("");
	buildNemesisUi();
	getData();
	tmrClock_tick();
});









