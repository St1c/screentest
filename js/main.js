var start;
var clickCounter = {};
clickCounter.time = [];
clickCounter.coordinates = [];
var clickNo = 0;

var BrowserDetect = {
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
	{
		string: navigator.userAgent,
		subString: "Chrome",
		identity: "Chrome"
	},
	{	string: navigator.userAgent,
		subString: "OmniWeb",
		versionSearch: "OmniWeb/",
		identity: "OmniWeb"
	},
	{
		string: navigator.vendor,
		subString: "Apple",
		identity: "Safari",
		versionSearch: "Version"
	},
	{
		prop: window.opera,
		identity: "Opera",
		versionSearch: "Version"
	},
	{
		string: navigator.vendor,
		subString: "iCab",
		identity: "iCab"
	},
	{
		string: navigator.vendor,
		subString: "KDE",
		identity: "Konqueror"
	},
	{
		string: navigator.userAgent,
		subString: "Firefox",
		identity: "Firefox"
	},
	{
		string: navigator.vendor,
		subString: "Camino",
		identity: "Camino"
	},
		{	// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{	// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
		],
		dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			string: navigator.userAgent,
			subString: "iPhone",
			identity: "iPhone/iPod"
		},
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
		]

	};
	BrowserDetect.init();

$(document).ready(function() {

	jQuery.fx.interval = 30;

	start			= new Date().getTime();
	var height		= screen.height;
	var width		= screen.width;
	var resolution	= width + 'x' + height;

	/* Auto-hide flash messages when succeeded */
	setTimeout(function (){ $('.alert-success').fadeOut(2500); },1000);

	/* Contrast Page Javascript Routines */
	$("#frm-screenTestForm input[name='screen']").val(resolution);

	$("span.clickable").click( function() {
		$(this).toggleClass("checked");
	});

	// Random move algorithm for white numbers
	function moveNumbers(){
	$('#numbers > div').each(function () {
		var posx = (Math.random() * ($('#numbers').width() - 80)).toFixed();
		var posy = (Math.random() * ($('#numbers').height() - 80)).toFixed();

		$(this).animate({
			'position':'absolute',
			'margin-left':posx + 'px',
			'margin-top':posy + 'px'
		}, 7000, function(){
			moveNumbers();
		}).delay(Math.random() * 3000);
		});
	};
	moveNumbers();

	// Random position black stars
	var container 			= $('.contrastBlack-wp');
	var maxSearchIterations = 10;
	var min_x 				= 0;
	var max_x 				= container.width() - 60;
	var min_y 				= 0;
	var max_y 				= container.height() - 63;
	var filled_areas 		= new Array();

	function calc_overlap(a1) {
		var overlap = 0;
		for (i = 0; i < filled_areas.length; i++) {

			var a2 = filled_areas[i];

			// no intersection cases
			if (a1.x + a1.width < a2.x) {
				continue;
			}
			if (a2.x + a2.width < a1.x) {
				continue;
			}
			if (a1.y + a1.height < a2.y) {
				continue;
			}
			if (a2.y + a2.height < a1.y) {
				continue;
			}

			// intersection exists : calculate it !
			var x1 = Math.max(a1.x, a2.x);
			var y1 = Math.max(a1.y, a2.y);
			var x2 = Math.min(a1.x + a1.width, a2.x + a2.width);
			var y2 = Math.min(a1.y + a1.height, a2.y + a2.height);

			var intersection = ((x1 - x2) * (y1 - y2));

			overlap += intersection;
		}
		return overlap;
	}

	function moveStars() {

		filled_areas.splice(0, filled_areas.length);

		var index = 0;
		$('.stars').each(function() {
			var rand_x = 0;
			var rand_y = 0;
			var i = 0;
			var smallest_overlap = 9007199254740992;
			var best_choice;
			var area;
			for (i = 0; i < maxSearchIterations; i++) {
				rand_x = Math.round(min_x + ((max_x - min_x) * (Math.random() % 1)));
				rand_y = Math.round(min_y + ((max_y - min_y) * (Math.random() % 1)));
				area = {
					x: rand_x,
					y: rand_y,
					width: $(this).width(),
					height: $(this).height()
				};
				var overlap = calc_overlap(area);
				if (overlap < smallest_overlap) {
					smallest_overlap = overlap;
					best_choice = area;
				}
				if (overlap === 0) {
					break;
				}
			}

			filled_areas.push(best_choice);

			$(this).css({
				position: "absolute",
				"z-index": index++,
				left: rand_x,
				top: rand_y
			});

		});
		return false;
	};
	moveStars();

	// Detect random clicks for cheaters
	$("#contrast-wp, #contrastBlack-wp").click(function(e){

		if ( e.target.id == "contrast-wp" || e.target.id == "contrastBlack-wp" ){
			clickNo								+= 1;
			clickCounter.onClick				= clickNo;
			clicker								= new Date().getTime();
			clickCounter.time[clickNo-1]		= clicker - start;
			clickCounter.coordinates[clickNo-1]	= [e.clientX, e.clientY];
		}
	});

	// Disable CTRL+A for selecting all text
	var ctrlKey = 17, aKey = 65, leftCMD = 91;

	$(document).keydown(function(e)
	{
		if (e.keyCode == ctrlKey) return false;
		if (e.keyCode == aKey) return false;
		if (e.keyCode == leftCMD) return false;	//Disable Command key on Mac
	});


	// Disable text selection (also can be done via CSS)
	(function($){
	$.fn.disableSelection = function() {
		return this
				.attr('unselectable', 'on')
				.css('user-select', 'none')
				.on('selectstart', false);
	};
	})(jQuery);

	$('body:not(select)').disableSelection();

	// Disable Right Click
	$(document).bind("contextmenu", function (eve){
		eve.preventDefault();
	});

	// Sending the result
	$("#frmscreenTestForm-submit").click(function(e){

		e.preventDefault();

		end					= new Date().getTime();
		finalTime			= end-start;
		clickCounter_string = JSON.stringify(clickCounter);

		$("#frm-screenTestForm input[name='focusTime']").val(finalTime);
		$("#frm-screenTestForm input[name='clickNo']").val(clickNo);
		$("#frm-screenTestForm input[name='clickCounter']").val(clickCounter_string);
		$("#frm-screenTestForm input[name='browser']").val(BrowserDetect.browser + " " + BrowserDetect.version + " on " + BrowserDetect.OS);

		if ( $('#smallestVisible input[type=radio]:checked').length < 1 )
		{
			$('#smallestVisible').addClass('checkbox-error');
			alert('Please select smallest visible number');
		}
		else if ( $('#highestVisible input[type=radio]:checked').length < 1  )
		{
			$('#highestVisible').addClass('checkbox-error');
			alert('Please select highest visible number');
		}
		else
		{
			$("#frm-screenTestForm").submit();
		}

	});

});