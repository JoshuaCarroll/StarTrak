/** LCARS SDK 16323.311
* This file is a part of the LCARS SDK.
* https://github.com/AricwithanA/LCARS-SDK/blob/master/LICENSE.md
* For more information please go to http://www.lcarssdk.org.
**/

var data = null;
function getData() {
	var request = new XMLHttpRequest();
	request.open('GET', 'http://10.1.10.10/supermon/jc_stats.php', true);

	request.onload = function() {
		if (request.status >= 200 && request.status < 400) {
			// Success!
			data = JSON.parse(request.responseText);
			
			data.server.memory.percentAvailable = Math.round((data.server.memory.free / data.server.memory.total) * 100);
			data.server.cpuusage = Math.round((data.server.cpuusage.split("load average: ")[1].split(", ")[1]) * 100);
			
			buildNemesisUi();
		} else {
			// We reached our target server, but it returned an error
		}
	};

	request.onerror = function() {
		// There was a connection error of some sort
	};

	request.send();
}

function getStatColor(stat, statValue) {
	var good = ['bg-blue-1', 'bg-blue-2'];
	var bad = ['bg-red-1', 'bg-red-2', 'bg-red-3'];
	
	var rtn = good;
	
	if (stat == "temp" && statValue > 170) { rtn = bad; }
	if (stat == "memory" && statValue < 40) { rtn = bad; }
	if (stat == "cpu" && statValue > 75) { rtn = bad; }
	
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

var uiColors = ['bg-green-1','bg-green-2','bg-green-3','bg-green-4','bg-blue-1','bg-blue-2'];
   
//Template for the Bracket Element   
var bracket = {type:'wrapper', class:'sdk bracket typeA', children:[
		{type:'wrapper', class:'content', id:"bracketContents", children: [
			//{type:'img', src:'st-pi.png'}
			{type:'htmlTag', tag:'div', text:'', 
			 style:'background-image: url("ufp.png"); background-size:contain; background-repeat: no-repeat; background-position: center center; height:100%; width:100%', 
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

//UI Framing.  Uses the Arrive event to trigger the Viewport scaling.
function buildNemesisUi() {
	var nemesisUI = {type:'wrapper', id:'wpr_viewport', version:'row', flex:'h', arrive:function(){$(this).viewport('zoom', {width:1920, height:1080});}, children:[

		//Left Column Wrapper
		{type:'column', flex:'v', children:[
			{type:'wrapper', children:[

				//Bracket
				{type:'bracket', template:bracket},

				//Top Button Group
				{type:'wrapper', flex:'h', version:'button-wrap', children:[
					{type:'button', color:LCARS.colorGen(getStatColor('temp',data.server.cputemp.F)), version:'left',id:'cpuTemp', label: "Temp: " + data.server.cputemp.F + "° F", href: 'javascript:showAlternateData("cpuTemp", "CPU: " + data.server.cputemp.C + "° C");' },
					{type:'button', color:LCARS.colorGen(getStatColor('memory',data.server.memory.percentAvailable)), id: 'cpuMemory', label: "RAM free: " + data.server.memory.percentAvailable + "%", href: 'javascript:showAlternateData("cpuMemory", "RAM free: " + data.server.memory.free + " MB");' },
					{type:'button', color:LCARS.colorGen(getStatColor('cpu',data.server.cpuusage)), version:'left', label:'CPU: ' + data.server.cpuusage + '%'},
					{type:'button', color:LCARS.colorGen(uiColors)},
					{type:'button', color:LCARS.colorGen(uiColors), version:'left'},
					{type:'button', color:LCARS.colorGen(uiColors), label: "Full screen", href: "javascript:toggleFullScreen();"}            
				]},

				//Bottom Button Group
				{type:'wrapper', flex:'h', version:'button-wrap', children:[
					{type:'button', color:LCARS.colorGen(uiColors), version:'left', label:'AllStar Link', href:'javascript:setContent("https://www.allstarlink.org/");' },
					{type:'button', color:LCARS.colorGen(uiColors), version:'button', label:'BrandMeister', href:'javascript:setContent("https://brandmeister.network/");' },
					{type:'button', color:LCARS.colorGen(uiColors), version:'left', label:'Github', href:'javascript:openTab("https://github.com/JoshuaCarroll/AA5JC-Digital-Analog-Bridge")' },
					{type:'button', color:LCARS.colorGen(uiColors), version:'button', label:'Ham VOIP', href:'javascript:setContent("http://hamvoip.org/")' },
					{type:'button', color:LCARS.colorGen(uiColors), version:'left', label:'QRZ', href:'javascript:openTab("https://qrz.com")', state:'ra_g1'},
					{type:'button', color:LCARS.colorGen(uiColors), version:'button', label:'Jitsi', href:'javascript:setContent("https://meet.jit.si/fcarc")', state:'ra_g1'},
				]}
			]},

			{type:'column', style:'justify-content: flex-end;', flexC:'v', flex:'v', children:[
				{type:'complexButton', id:'divClock', text: data.timestamp.time, template:LCARS.templates.sdk.buttons.complexText.typeG, colors:LCARS.colorGroupGen(uiColors, 3)}
			]}
		]},

		//Main Area
		{type:'wrapper', version:'column', id:'wpr_mainView', flex:'v', flexC:'h', children:[   

			//Header
			{type:'row', version:'header', flex:'h', children:[

				//Elbow & Button
				{type:'column', flex:'v', children:[
					{type:'button', color:LCARS.colorGen(uiColors), size:'step-two'},
					{type:'elbow', version:'bottom-left', color:LCARS.colorGen(uiColors), flexC:'v'}
				]},

				{type:'wrapper', flexC:'h', flex:'v', children:[

					//Header Content Area
					{type:'wrapper', version:'content', flexC:'v', children:[

						//Header Title
						{type:'title', text:'AA5JC Analog-Digital Bridge'},

						//Header Pill Button Group
						{type:'wrapper', flex:'h', class:'button-wrap', children:[
							{type:'button', color:LCARS.colorGen(uiColors), version:'left', label:'49960', href:'javascript:setContent("http://10.1.10.10/supermon/link.php?nodes=49960")'},
							{type:'button', color:LCARS.colorGen(uiColors), version:'button', label:'1999', href: 'javascript:setContent("http://10.1.10.10/supermon/link.php?nodes=1999")'},
							{type:'button', color:LCARS.colorGen(uiColors), version:'left', label:'Full screen', href:'javascript:toggleFullScreen();'},
							{type:'button', color:LCARS.colorGen(uiColors), version:'button', label:'Get data', href:'javascript:getData();'}
						]},
					]},

					//Header Bottom Bars
					{type:'row', version:'frame', flex:'h', children:[
						{type:'bar', color:LCARS.colorGen(uiColors)},
						{type:'bar', color:LCARS.colorGen(uiColors)},
						{type:'bar', color:LCARS.colorGen(uiColors)},
						{type:'bar', color:LCARS.colorGen(uiColors), flexC:'h'},
						{type:'bar', color:LCARS.colorGen(uiColors)},
						{type:'bar', color:LCARS.colorGen(uiColors)},
						{type:'bar', color:LCARS.colorGen(uiColors)}
					]}

				]}

			]},

			//Main Content Area
			{type:'wrapper', class:'main', flex:'h', flexC:'v', children:[

				//Left Columns & Elbow
				{type:'wrapper', version:'column', flex:'v', children:[
					{type:'elbow', version:'top-left', color:LCARS.colorGen(uiColors), class:'step-two'},
					{type:'button', color:LCARS.colorGen(uiColors)},
					{type:'button', color:LCARS.colorGen(uiColors), size:'step-two'},
					{type:'button', color:LCARS.colorGen(uiColors)},
					{type:'button', color:LCARS.colorGen(uiColors), size:'step-two'},
					{type:'button', color:LCARS.colorGen(uiColors), flexC:'v'}
				]},

				{type:'column', flexC:'h', flex:'v', children:[
					//Top Bars Group
					{type:'row', flex:'h', class:'frame', children:[
						{type:'bar', color:LCARS.colorGen(uiColors)},
						{type:'bar', color:LCARS.colorGen(uiColors), version:'small'},
						{type:'bar', color:LCARS.colorGen(uiColors)},
						{type:'bar', color:LCARS.colorGen(uiColors), flexC:'h'},
						{type:'bar', color:LCARS.colorGen(uiColors)},
						{type:'bar', color:LCARS.colorGen(uiColors)},
						{type:'bar', color:LCARS.colorGen(uiColors)}
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

var tmrClock;
function tmrClock_tick() {
	getData();
	
	tmrClock = window.setTimeout(function() {
		tmrClock_tick();
	}, getMillisecondsLeft());
}

function setContent(url) {
	$("#divMainContent").html("<iframe style='height:100%; width:100%' allow='camera;microphone' src='" + url + "'></iframe>");
}

$(document).on('ready', function(){
	$("body").html("");
	// $(nemesisUI).createObject({appendTo:'body'}); // Called by getData()
	getData();
	tmrClock_tick();
});









