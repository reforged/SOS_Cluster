
var numNodes = 100;
var timeScale = 1/2;
var SCREENHEIGHT = 780;
var SCREENWIDTH = SCREENHEIGHT/5*8;
var maxDist = 0.15*SCREENHEIGHT;
var newMoteSlot = 500;

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

window.addEventListener('load', init, true );
window.addEventListener('load', draw, true );
