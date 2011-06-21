
// Class Mote
function Mote() {
    this.id = null; // my ID
    this.slot = null;
    this.isClusterHead = false; // am I cluster head?
    this.clusterId = null; // the cluster I'm member or head of
    this.clusterMotes = null; // List of all member in the cluster; only cluster head uses this
    this.nextClusterSlot = null; // The slot given to the next joining member; only clusterhead uses this
    MoteList.register(this); // get my ID
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
        case MTYPE.MOTE_GONE:
            this.onMoteGone( msg );
            break;
        case MTYPE.ROTATE:
            console.log("in mtype rotate");
            this.acceptClusterHead( msg );
            break;
        }
    },

    start: function() {
        this.availableClusters = [];
        MoteList.send( this, { sender: this.id, type: MTYPE.WHOISTHERE });
        window.setTimeout( this.selectCluster.bind(this), newMoteSlot*timeScale );
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
    ROTATE: 8,
}
