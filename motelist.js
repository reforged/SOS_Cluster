// Singleton MoteList
MoteList = (function() {
    var motes = [];
    var dist = [];
    var nextId = 1;

    function register( mote ) {
		var x = Math.round( 0.05*SCREENSIZE + ((nextId-1) / (numNodes-1))*0.9 * SCREENSIZE + (Math.random()-0.5)*0.1 * SCREENSIZE );
		var y = Math.round( Math.random() * SCREENSIZE );
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
				canvas.moveTo( Math.round(m1.x) + 0.5, Math.round( m1.y ) + 0.5);
				canvas.lineTo( Math.round(m2.x) + 0.5, Math.round( m2.y ) + 0.5);
				canvas.stroke();
			}

		for ( var i = 0; i < activeEdges.length; i++ ) {
			var m1 = activeEdges[i].m1;
			var m2 = activeEdges[i].m2;

			canvas.strokeStyle = '#d8fa3c';
			canvas.beginPath()
			canvas.moveTo( m1.x + 0.5, m1.y + 0.5);
			canvas.lineTo( m2.x + 0.5, m2.y + 0.5);
			canvas.stroke();
		}

		for ( var i = 0; i < motes.length; i++ ) {
			var moteContainer = motes[i];
			var x = moteContainer.x;
			var y = moteContainer.y;
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

    /* private */
    function getMoteAt( x, y ) {
		for ( var i = 0; i < motes.length; i++ ) {
			var mote = motes[i];
			if ( Math.abs(mote.x - x) <= 3 && Math.abs(mote.y - y) <= 3 )
				return mote;
		}
		return null;
    }

    /* private */
    function killMote( mote ) {
		// send message to kill the mote.
		send( mote.mote, {
			type: MTYPE.MOTE_GONE,
			clusterId: mote.mote.ClusterId,
			sender: mote.mote.id,
		});
		// delete mote from internal list of existent motes and from caches
		motes.splice( motes.indexOf(mote), 1 );
		dist[mote.mote.id] = undefined;
		for ( var i = 0; i < motes.length; i++)
			dist[motes[i].mote.id][mote.mote.id] = undefined;
    }

    function killMoteAt( x, y) {
        mote = getMoteAt( x, y );
        if( mote == null )
			return false;

        killMote( mote );
		draw();
		return true;

    }

    return {
		register: register,
		drawAll: drawAll,
		send: send,
		getClusters: getClusters,
		killMoteAt: killMoteAt,
    }
}());
