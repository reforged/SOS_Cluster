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
    $(document).keydown( function(e) {
        if( e.which == 82 ) // r rotates all Heads
            MoteList.rotateHeads();
    });
    $(document).keydown( function(e) {
        if( e.which == 65 )
            rotate = ++rotate % 2;
        //        window.setTimeout( function() {, 30 );
    });
    body.appendChild(_canvas);
    canvas = _canvas.getContext('2d');
}

window.addEventListener('load', init_canvas, true );
