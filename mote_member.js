$.extend( Mote.prototype, {

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

		//console.debug(this.id,'I am member of',this.clusterId);

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

	// if JOINING
	onJoinReqRes: function( msg ) {
		if ( msg.newMember != this.id )
			return;
		if ( msg.clusterId != this.joiningClusterId )
			throw new Error('THIS SHOULD NOT HAPPEN!');

		if ( msg.success ) {
			this.clusterId = msg.clusterId;
			//console.debug(this.id, 'joining cluster', this.clusterId);
			draw();
		}
		else {
			this.selectCluster();
		}
	},

	// ===========================

	selectCluster: function() {
		if (this.availableClusters.length == 0) {
			this.newCluster();
			return;
		}

		//console.debug(this.id, 'available Clusters:', JSON.stringify(this.availableClusters));

		this.availableClusters.sort(this.clusterSort);

		var cluster = this.availableClusters.shift();
		//console.debug(this.id,'now trying to connect to cluster', cluster);
		this.joiningClusterId = cluster.id;
		this.joiningMemberList = [cluster.head];
		if ( cluster.size > 1 ){
			//console.debug(this.id,'listening for cluster members of cluster id',cluster.id);
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

	joinReq: function () {
		//console.debug( this.id, 'join Req to', this.joiningClusterId, 'members:', this.joiningMemberList );
		MoteList.send( this, {
			sender: this.id,
			type:MTYPE.JOINREQ,
			clusterId:this.joiningClusterId,
			motes:this.joiningMemberList
		})
	},
});
