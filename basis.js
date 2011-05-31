//==================================================================
//===== basis.js ===================================================
//===== © Copyright 2007 by Robert Oehlmann ========================
//==================================================================
//===== Funktionsbibliothek für den einfacheren Umgang mit =========
//===== AJAX und DOM ===============================================
//==================================================================
//===== Komptiblität getestet im Microsoft Internet Explorer =======
//===== und Mozilla Firefox ========================================
//==================================================================




//==================================================================
//===== JavaScript =================================================
//==================================================================

Object.extend = function(d,s)
{
	for (var p in s) d[p]=s[p];
	return d;
}

Function.prototype.bind = function()
{
	var __this = this, args = Array.prototype.slice.call(arguments), parent = args.shift();
	return function()
	{
		return __this.apply(
			parent,
			args.concat(Array.prototype.slice.call(arguments))
		);
	}
}

Function.prototype.bindAsEventListener = function()
{
	var __this = this, args = Array.prototype.slice.call(arguments), parent = args.shift();
	return function(event)
	{
		argsInner = Array.prototype.slice.call(arguments), event = argsInner.shift();
		return __this.apply(
			parent,
			[( event || window.event)].concat(args).concat(argsInner)
		);
	}
}

Class = {};
Class.create = function create(obj)
{
	newclass = function()
	{
		if (typeof this.construct != 'undefined')
			this.construct();
	};
	newclass.prototype = obj;
	newclass.prototype.constructor = newclass;
	return newclass;
}

var ElementUtils = {
	show: function() { this.style.display=''; },
	hide: function() { this.style.display='none'; },
	showhide: function() { if (this.style.display=='') this.style.display='none'; else this.style.display=''; },
	_extended: true
}

function $(elm)
{
	if (typeof elm == 'string')
		elm=document.getElementById(elm);
	if (elm)
		if (!elm._extended)
			elm.extend(ElementUtils);    
	return elm;
}

if ( !Array.prototype.indexOf )
Array.prototype.indexOf = function(search)
{
	for (var i = 0; i < this.length; i++)
		if (this[i]==search) return i;
	return -1;
}


//==================================================================
//===== Effects ====================================================
//==================================================================

Effects = {};

function posColor(pos, start, end)
{
	var r = Math.round(start.r*(1-pos)+end.r*pos);
	var g = Math.round(start.g*(1-pos)+end.g*pos);
	var b = Math.round(start.b*(1-pos)+end.b*pos);
	return 'rgb('+r.toString()+','+g.toString()+','+b.toString()+')';
}

Effects.Highlight = function()
{
	this.init = function(elm,start,end,options)
	{
		this.elm = $(elm);
		this.start = start;
		this.end = end;
		this.options = Object.extend({ duration:1000 }, options);
		this.steps = Math.round(this.options.duration/50);
		this.pos = 0;
		setTimeout(this.nextPos.bind(this) ,50);
	}
	
	this.nextPos = function()
	{
		var rgb = posColor(this.pos/this.steps, this.start, this.end);
		this.elm.style.backgroundColor = rgb;
		this.pos+=1;
		if (this.pos<=this.steps) setTimeout(this.nextPos.bind(this),50);
		else if (this.options.onComplete) this.options.onComplete();
	}
	
	this.init.apply(this, arguments);
}


//==================================================================
//===== AJAX =======================================================
//==================================================================

function createXML()
{
	try {
		return new XMLHttpRequest();
	} catch(w3c) {
		try {
			return new ActiveXObject("Msxml2.XMLHTTP");
		} catch(msie) {
			try {
				return new ActiveXObject("Microsoft.XMLHTTP");
			} catch(msie_alt) {
				return false;
			}
		}
	}
}

Ajax = {}
Ajax.Request = function(url, options)
{
	var asynchronous	= options.asynchronous || true;
	var contentType		= options.contentType || 'application/x-www-form-urlencoded';
	var encoding		= options.encoding || 'utf-8';
	var method			= options.method || 'get';
	var postBody		= options.postBody || null;
	var forceReload		= options.forceReload || true;
	var evalScripts		= options.evalScripts || false;
	var XMLHttp = createXML();
	XMLHttp.open(method,url,asynchronous);
	XMLHttp.setRequestHeader('Content-Type', contentType+'; charset='+encoding);
	if (forceReload)
		XMLHttp.setRequestHeader('If-Modified-Since', 'Sat, 1 Jan 2000 00:00:00 GMT');
	if (postBody!=null)
		XMLHttp.setRequestHeader('Content-length', postBody.length);
	XMLHttp.send(postBody);
	
	XMLHttp.onreadystatechange = function()
	{
		if (XMLHttp.readyState == 4)
		{
			if (XMLHttp.status == 200 || XMLHttp.status == 0)
			{
				if (evalScripts) { eval(XMLHttp.responseText); }
				if (options.onComplete) options.onComplete(XMLHttp);
			}
			else
				{ if (options.onFailure) options.onFailure(XMLHttp); }
		}
	}
}


/**
* Retrieve the coordinates of the given event relative to the center
* of the widget.
*
* @param event
*   A mouse-related DOM event.
* @param reference
*   A DOM element whose position we want to transform the mouse coordinates to.
* @return
*    A hash containing keys 'x' and 'y'.
*/
function getRelativeCoordinates( event, reference )
{
	var x, y;
	event = event || window.event;
	var el = event.target || event.srcElement;
	
	if (!window.opera && typeof event.offsetX != 'undefined') {
	  // Use offset coordinates and find common offsetParent
	  var pos = { x: event.offsetX, y: event.offsetY };
	
	  // Send the coordinates upwards through the offsetParent chain.
	  var e = el;
	  while (e) {
		e.mouseX = pos.x;
		e.mouseY = pos.y;
		pos.x += e.offsetLeft;
		pos.y += e.offsetTop;
		e = e.offsetParent;
	  }
	
	  // Look for the coordinates starting from the reference element.
	  var e = reference;
	  var offset = { x: 0, y: 0 }
	  while (e) {
		if (typeof e.mouseX != 'undefined') {
		  x = e.mouseX - offset.x;
		  y = e.mouseY - offset.y;
		  break;
		}
		offset.x += e.offsetLeft;
		offset.y += e.offsetTop;
		e = e.offsetParent;
	  }
	
	  // Reset stored coordinates
	  e = el;
	  while (e) {
		e.mouseX = undefined;
		e.mouseY = undefined;
		e = e.offsetParent;
	  }
	}
	else {
	  // Use absolute coordinates
	  var pos = getAbsolutePosition(reference);
	  x = event.pageX  - pos.x;
	  y = event.pageY - pos.y;
	}
	// Subtract distance to middle
	return { x: x, y: y };
}

function getAbsolutePosition(element) {
	var r = { x: element.offsetLeft, y: element.offsetTop };
	if (element.offsetParent) {
	  var tmp = getAbsolutePosition(element.offsetParent);
	  r.x += tmp.x;
	  r.y += tmp.y;
	}
	return r;
};