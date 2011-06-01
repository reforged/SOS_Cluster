var _canvas, canvas;

function init_canvas() {
	var body = document.getElementsByTagName('body')[0];
	_canvas = document.createElement('canvas');
	_canvas.id = 'display';
	_canvas.width = SCREENSIZE;
	_canvas.height = SCREENSIZE;
	$(_canvas).click(function( e ) {
        var x = e.pageX - $(this).offset().left;
        var y = e.pageY - $(this).offset().top;
        MoteList.killMoteAt(x,y);
	    console.debug(x,y);
	});
	body.appendChild(_canvas);
	canvas = _canvas.getContext('2d');
}

window.addEventListener('load', init_canvas, true );