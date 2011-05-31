

// Singleton VertexList
VertexList = (function() {
	
	var vertices = [];
	var edges = [];
	
	function getAll()
	{
		return Object.extend([], vertices);
	}
	
	function getEdges()
	{
		return Object.extend([], edges);
	}
	
	function insert( item )
	{
		for ( var i = 0; i < vertices.length; i++ )
		{
			var dist = Math.sqrt( Math.pow(vertices[i].x - item.x, 2) + Math.pow(vertices[i].y - item.y, 2) );
			if ( dist < maxDist )
				edges.push( new Edge( vertices[i], item, dist ) );
		}
		
		return vertices.push( item );
	}
	
	function drawAll()
	{
		for ( var i = 0; i < edges.length; i++ )
			edges[i].draw();
		for ( var i = 0; i < vertices.length; i++ )
			vertices[i].draw();
	}
	
	return {
		getAll: getAll,
		getEdges: getEdges,
		insert: insert,
		drawAll: drawAll
	}
	
}());


// Class Vertex
function Vertex( x, y )
{
	this.x = x;
	this.y = y;
	this.edges = [];
	this.active = false;
	this.id = VertexList.insert( this );
}
Object.extend( Vertex.prototype, {
	
	draw: function()
	{
		canvas.fillStyle = this.active ? '#ff6400' : '#fbde2d';
		canvas.fillRect(this.x-1, this.y-1, 3, 3);
		
		if ( this.id )
		{
			canvas.textAlign = 'center';
			canvas.fillText(this.id.toString(), this.x, this.y-5);
		}
	}
	
});


// Class Edge
function Edge( v1, v2, weight )
{
	this.v1 = v1;
	this.v2 = v2;
	this.weight = weight;
	this.v1.edges.push( this );
	this.v2.edges.push( this );
}
Object.extend( Edge.prototype, {
	
	draw: function()
	{
		canvas.strokeStyle = this.v1.active || this.v2.active ? '#d8fa3c' : '#8da6ce';
		canvas.beginPath()
		var p = this.v1;
		canvas.moveTo(p.x + 0.5, p.y + 0.5);
		var p = this.v2;
		canvas.lineTo(p.x + 0.5, p.y + 0.5);
		canvas.stroke();
	}
	
});
