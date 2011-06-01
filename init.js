
var numNodes = 2;
var maxDist = 0.15;
var timeScale = 1/8;
var SCREENSIZE = 800;

function draw()
{
	canvas.fillStyle = '#0c1021';
	canvas.fillRect(0,0,SCREENSIZE,SCREENSIZE);

	canvas.font = 'bold 14px Monaco, monospace';
	//canvas.textAlign = 'left';
	//canvas.fillStyle = 'white';
	//canvas.fillText('Selbstorganisierende Systeme',10,21);

	MoteList.drawAll();
}

function init() {
	for ( var i = 0; i < numNodes; i++ )
		window.setTimeout( function() { new Mote(); draw(); }, i*1000*timeScale );
}

window.addEventListener('load', init, true );
window.addEventListener('load', draw, true );
