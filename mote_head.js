Object.extend( Mote.prototype, {
	
	// if HEAD
	onWhoIsThere: function( msg ) {
		if ( ! this.isClusterHead )
			return;
		
		MoteList.send( this, {
			sender:this.id,
			type:MTYPE.RE_WHOISTHERE,
			clusterId:this.clusterId,
			size:this.clusterMotes.length
		})
	},
	
	// if JOINING
	onWhoIsThereRes: function( msg ) {
		this.availableClusters.push({
			id:msg.clusterId,
			head:msg.sender,
			size:msg.size
		});
	},
	
	// if MEMBER
	onListMembers: function( msg ) {
		if ( this.isClusterHead )
			return;
		
		if ( msg.clusterId != this.clusterId )
			return;
		
		console.debug(this.id,'I am member of',this.clusterId);
		
		MoteList.send( this, {
			sender:this.id,
			type:MTYPE.RE_LISTMEMBERS,
			clusterId:this.clusterId
		})
	},
	
	// if JOINING
	onListMembersRes: function( msg ) {
		if ( msg.clusterId != this.joiningClusterId )
			return;
		
		this.joiningMemberList.push( msg.sender );
	},
	
	// if HEAD
	onJoinReq: function( msg ) {
		if ( ! this.isClusterHead )
			return;
		
		if ( msg.clusterId != this.clusterId )
			return;
		
		var knowsAll = true;
		console.debug(this.id, 'compare:', JSON.stringify(this.clusterMotes), msg.motes);
		for ( var i = 0; i < this.clusterMotes.length; i++ )
			if ( msg.motes.indexOf( this.clusterMotes[i] ) == -1) {
				knowsAll = false;
				break;
			}
		
		console.debug(msg.sender,'joinReqRes knows all',knowsAll)
		
		if ( knowsAll ) {
			MoteList.send( this, {
				type:MTYPE.RE_JOINREQ,
				clusterId: this.clusterId,
				newMember: msg.sender,
				success: true
			});
			this.clusterMotes.push( msg.sender );
		}
		else
			MoteList.send( this, {
				type:MTYPE.RE_JOINREQ,
				clusterId: this.clusterId,
				newMember: msg.sender,
				success: false
			});
	},
	
	// if JOINING
	onJoinReqRes: function( msg ) {
		if ( msg.newMember != this.id )
			return;
		if ( msg.clusterId != this.joiningClusterId )
			throw new Error('THIS SHOULD NOT HAPPEN!');
		
		if ( msg.success ) {
			this.clusterId = msg.clusterId;
			console.debug(this.id, 'joining cluster', this.clusterId);
			draw();
		}
		else {
			this.selectCluster();
		}
	},
	
	// ===========================
	
	start: function() {
		this.availableClusters = [];
		MoteList.send( this, { sender: this.id, type: MTYPE.WHOISTHERE });
		window.setTimeout( this.selectCluster.bind(this), 500*timeScale );
	},
	
	selectCluster: function() {
		if (this.availableClusters.length == 0) {
			this.newCluster();
			return;
		}
		
		console.debug(this.id, 'available Clusters:', JSON.stringify(this.availableClusters));
		
		this.availableClusters.sort(this.clusterSort);
		
		var cluster = this.availableClusters.shift();
		console.debug(this.id,'now trying to connect to cluster', cluster);
		this.joiningClusterId = cluster.id;
		this.joiningMemberList = [cluster.head];
		if ( cluster.size > 1 ){
			console.debug(this.id,'listening for cluster members of cluster id',cluster.id);
			MoteList.send( this, {
				sender: this.id,
				type:MTYPE.LISTMEMBERS,
				clusterId:cluster.id
			} );
			window.setTimeout( this.joinReq.bind(this), 100*timeScale )
		}
		else {
			this.joinReq();
		}
	},
	
	clusterSort: function( c1, c2 ) {
		return c1.size - c2.size;
	},
	
	joinReq: function () {
		console.debug( this.id, 'join Req to', this.joiningClusterId, 'members:', this.joiningMemberList );
		MoteList.send( this, {
			sender: this.id,
			type:MTYPE.JOINREQ,
			clusterId:this.joiningClusterId,
			motes:this.joiningMemberList
		})
	},
	
	newCluster: function() {
		console.debug(this.id, 'starting new cluster');
		this.isClusterHead = true;
		this.clusterId = this.id;
		this.clusterMotes = [this.id];
	}
	
});