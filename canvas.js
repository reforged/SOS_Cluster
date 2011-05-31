var _canvas, canvas;

function init_canvas() {
	var body = document.getElementsByTagName('body')[0];
	_canvas = document.createElement('canvas');
	_canvas.id = 'display';
	_canvas.width = SCREENSIZE;
	_canvas.height = SCREENSIZE;
	body.appendChild(_canvas);
	canvas = _canvas.getContext('2d');
}

window.addEventListener('load', init_canvas, true );
