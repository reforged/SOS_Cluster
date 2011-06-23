
var numNodes = 150;
var timeScale = 1/5;
var SCREENHEIGHT = 780;
var SCREENWIDTH = SCREENHEIGHT/5*8;
var maxDist = 0.15*SCREENHEIGHT;
var newMoteSlot = 500;
var rotate = 0;
var interval;

function draw()
{
    canvas.fillStyle = '#0c1021';
    canvas.fillRect(0,0,SCREENWIDTH,SCREENHEIGHT);
    canvas.font = 'bold 14px Monaco, monospace';
    MoteList.drawAll();
}

function init() {
    for ( var i = 0; i < numNodes; i++ )
        window.setTimeout( function() { ( new Mote() ).start(); draw(); }, i*newMoteSlot*2*timeScale );
}

function clock() {
    if ( rotate )
        MoteList.rotateHeads();
}

window.addEventListener('load', init, true );
window.addEventListener('load', draw, true );
window.addEventListener('load', function() { interval = setInterval( clock, 12000*timeScale )}, true);