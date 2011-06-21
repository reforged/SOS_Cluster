$.extend( Mote.prototype, {

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

    // if HEAD
    onJoinReq: function( msg ) {
        if ( ! this.isClusterHead )
            return;

        if ( msg.clusterId != this.clusterId )
            return;

        var knowsAll = true;
        //console.debug(this.id, 'compare:', JSON.stringify(this.clusterMotes), msg.motes);
        for ( var i = 0; i < this.clusterMotes.length; i++ )
            if ( msg.motes.indexOf( this.clusterMotes[i] ) == -1) {
                knowsAll = false;
                break;
            }

        //console.debug(msg.sender,'joinReqRes knows all',knowsAll)

        if ( knowsAll ) {
            MoteList.send( this, {
                type:MTYPE.RE_JOINREQ,
                clusterId: this.clusterId,
                newMember: msg.sender,
                slot: this.nextClusterSlot++,
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

    newCluster: function() {
        //console.debug(this.id, 'starting new cluster');
        this.isClusterHead = true;
        this.clusterId = this.id;
        this.nextClusterSlot = 1;
        this.slot = this.nextClusterSlot++;
        this.clusterMotes = [this.id];
        draw();
    },

    rotateHead: function() {
        var i = Math.floor( Math.random() * this.clusterMotes.length );
        console.log("i==", i);
        var newHead = this.clusterMotes[i];
        //special case
        if( newHead.id == this.id )
            newHead = this.clusterMotes[ (i+1) % this.clusterMotes.length ];

        console.log( "rotating head to mote #", newHead );

        MoteList.send( this, {
            sender: this.id,
            to:  newHead,
            type: MTYPE.ROTATE,
            clusterId: this.clusterId,
            clusterMotes: this.clusterMotes,
        });

        this.isClusterHead = false;
    },

});
