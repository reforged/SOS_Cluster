
// Class Mote
function Mote() {
	this.id = null; // my ID
	this.isClusterHead = false; // am I cluster head?
	this.clusterId = null; // the cluster I'm member or head of
	this.clusterMotes = null; // only cluster head uses this
	MoteList.register(this); // get my ID 
	this.start();
}
$.extend(Mote.prototype, {
	
	onRecv: function( msg ) {	
		switch ( msg.type ) {
			case MTYPE.WHOISTHERE:
				this.onWhoIsThere( msg );
				break;
			case MTYPE.RE_WHOISTHERE:
				this.onWhoIsThereRes( msg );
				break;
			case MTYPE.LISTMEMBERS:
				this.onListMembers( msg );
				break;
			case MTYPE.RE_LISTMEMBERS:
				this.onListMembersRes( msg );
				break;
			case MTYPE.JOINREQ:
				this.onJoinReq( msg );
				break;
			case MTYPE.RE_JOINREQ:
				this.onJoinReqRes( msg );
				break;
		}
	},
	
	start: function() {
		this.availableClusters = [];
		MoteList.send( this, { sender: this.id, type: MTYPE.WHOISTHERE });
		window.setTimeout( this.selectCluster.bind(this), 500*timeScale );
	},
	
	clusterSort: function( c1, c2 ) {
		return c1.size - c2.size;
	},

	
});
	


MTYPE = {
	WHOISTHERE: 1,
	RE_WHOISTHERE: 2,
	LISTMEMBERS: 3,
	RE_LISTMEMBERS: 4,
	JOINREQ: 5,
	RE_JOINREQ: 6,
	MOTE_GONE: 7,
}
