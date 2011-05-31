// Singleton MoteList
MoteList = (function() {
	var motes = [];
	var dist = [];
	var nextId = 1;
	
	function register( mote ) {
		var x = 0.05 + ((nextId-1) / (numNodes-1))*0.9 + (Math.random()-0.5)*0.1;
		var y = Math.random();
		mote.id = nextId++;
		motes.push({ x:x, y:y, mote:mote });
	}

	function drawAll() {
		var activeEdges = [];
		
		for ( var i = 0; i < motes.length; i++ )
			for ( var j = 0; j < motes.length; j++ ) {
				var m1 = motes[i];
				var m2 = motes[j];
				
				if ( getDist(m1,m2) > maxDist )
					continue;
				
				if ( m1.mote.clusterId == m2.mote.clusterId ) {
					activeEdges.push({m1:m1, m2:m2});
					continue;
				}
				
				canvas.strokeStyle = '#2C3340'; //'#8da6ce';
				canvas.beginPath()
				canvas.moveTo( Math.round(m1.x * SCREENSIZE) + 0.5, Math.round( m1.y * SCREENSIZE ) + 0.5);
				canvas.lineTo( Math.round(m2.x * SCREENSIZE) + 0.5, Math.round( m2.y * SCREENSIZE ) + 0.5);
				canvas.stroke();
			}
		
		for ( var i = 0; i < activeEdges.length; i++ ) {
			var m1 = activeEdges[i].m1;
			var m2 = activeEdges[i].m2;
			
			canvas.strokeStyle = '#d8fa3c';
			canvas.beginPath()
			canvas.moveTo( Math.round(m1.x * SCREENSIZE) + 0.5, Math.round( m1.y * SCREENSIZE ) + 0.5);
			canvas.lineTo( Math.round(m2.x * SCREENSIZE) + 0.5, Math.round( m2.y * SCREENSIZE ) + 0.5);
			canvas.stroke();
		}
		
		for ( var i = 0; i < motes.length; i++ ) {
			var moteContainer = motes[i];
			var x = Math.round( moteContainer.x * SCREENSIZE );
			var y = Math.round( moteContainer.y * SCREENSIZE );
			canvas.fillStyle = '#ff6400'; // this.active ? '#ff6400' : '#fbde2d';
			canvas.fillRect(x-1, y-1, 3, 3);
			if ( moteContainer.mote.isClusterHead )
			{
				canvas.textAlign = 'center';
				canvas.fillText(moteContainer.mote.clusterId.toString(), x, y-5);
			}
		}
	}

	function send( sender, msg ) {
		var sender = getMoteContainer(sender);
		if ( sender == null ) throw new Error('Unknown mote id');
		
		for ( var i = 0; i < motes.length; i++ ) {
			if ( motes[i] == sender )
				continue;
			
			var dist = getDist( sender, motes[i] );
			if ( dist < maxDist ) {
				motes[i].mote.onRecv.call(motes[i].mote, msg);
			}
		}
	}
	
	/*private*/ function getMoteContainer( mote ) {
		for ( var i = 0; i < motes.length; i++ )
			if ( motes[i].mote == mote)
				return motes[i];
		return null;
	}

	/*private*/ function getDist( m1, m2 ) {
		if ( typeof dist[m1.mote.id] == 'undefined' ) {
			dist[m1.mote.id] = [];
		}
		if ( typeof dist[m2.mote.id] == 'undefined') {
			dist[m2.mote.id] = [];
		}
		if ( typeof dist[m1.mote.id][m2.mote.id] == 'undefined' ) {
			dist[m1.mote.id][m2.mote.id] = Math.sqrt( Math.pow(m1.x-m2.x,2) + Math.pow(m1.y-m2.y,2) );
			dist[m2.mote.id][m1.mote.id] = dist[m1.mote.id][m2.mote.id];
		}
			return dist[m1.mote.id][m2.mote.id];
	}
	
	function getClusters() {
		var clusters = {};
		for ( var i = 0; i < motes.length; i++ ) {
			var mote = motes[i];
			if ( typeof clusters[mote.mote.clusterId] == 'undefined' )
				clusters[mote.mote.clusterId] = 1;
			else
				clusters[mote.mote.clusterId]++;
		}
		return clusters;
	}

	return {
		register: register,
		drawAll: drawAll,
		send: send,
		getClusters: getClusters
	}
}());