var _canvas, canvas;

function init_canvas() {
    var body = document.getElementsByTagName('body')[0];
    _canvas = document.createElement('canvas');
    _canvas.id = 'display';
    _canvas.width = SCREENWIDTH;
    _canvas.height = SCREENHEIGHT;
    $(_canvas).click(function( e ) {
        var x = e.pageX - $(this).offset().left;
        var y = e.pageY - $(this).offset().top;
        if ( !MoteList.killMoteAt(x,y) ) {
            MoteList.newMoteAt( x, y );
        }

    });
    body.appendChild(_canvas);
    canvas = _canvas.getContext('2d');
}

window.addEventListener('load', init_canvas, true );