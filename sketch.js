//ADJUSTABLE GRID SIZE
var cols = 25;
var rows = 25;
//************************

//MORE GLOBAL VARIABLES
var grid = new Array(cols);
var w;
var h;

var openSet = [];
var closedSet = [];
var start;
var end;
var path = [];
var r = [];
var g = [];
var b = [];

//CELL CLASS
function Cell(x, y) {
	this.x = x;
	this.y = y;
	this.f = 0;
	this.g = 0;
	this.h = 0;
	this.neighbors = [];
	this.wall = false;
	
//ASSIGNS WALLS IN THE GRID
	if(random(1) < 0.3) {
		this.wall = true;
	}
	
//DRAWS THE GRID
	this.show = function(col) {
		fill(col);
		if(this.wall) {
			fill(0);
		}
		noStroke();
		rect(this.x*w, this.y*h, w-1, h-1);
	}
	
//ADDS NEIGHBORS TO THE SET FOR CALCULATION OF PATH SCORES
	this.addNeighbors = function(grid) {
//LINEAR
		if(x < cols-1) {
			this.neighbors.push(grid[this.x+1][this.y]);
		}
		if(x > 0) {
			this.neighbors.push(grid[this.x-1][this.y]);
		}
		if(y < rows - 1) {
			this.neighbors.push(grid[this.x][this.y+1]);
		}
		if(y > 0) {
			this.neighbors.push(grid[this.x][this.y-1]);
		}
//DIAGONALS
		if(x > 0 && y > 0) {
			this.neighbors.push(grid[this.x-1][this.y-1]);
		}
		if(x > 0 && y < rows - 1) {
			this.neighbors.push(grid[this.x-1][this.y+1]);
		}
		if(x < cols - 1 && y > 0) {
			this.neighbors.push(grid[this.x+1][this.y-1]);
		}
		if(x < cols - 1 && y < rows - 1) {
			this.neighbors.push(grid[this.x+1][this.y+1]);
		}
	}
}

function removeCell(arr, element) {
	for(var c = arr.length-1; c >= 0; c--) {
		if(arr[c] == element) {
			arr.splice(c, 1);
		}
	}
}

//EUCLIDEAN DISTANCE HEURISTIC
function heuristic(a,b) {
	var d = dist(a.x, a.y, b.x, b.y);
	return d;
}

//SETUP FOR THE PROGRAM
function setup() {
//CREATING GRID
	createCanvas(400, 400);
	
	w = width / cols;
	h = height / rows;

	for(var x = 0; x < cols; x++) {
		grid[x] = new Array(rows);
	}
	
//CREATING INDIVIDUAL CELLS
	for(var x = 0; x < cols; x++) {
		for(var y = 0; y < rows; y++) {
			grid[x][y] = new Cell(x, y);
		}
	}

//ADDING NEIGHBORS FOR EACH CELL
	for(var x = 0; x < cols; x++) {
		for(var y = 0; y < rows; y++) {
			grid[x][y].addNeighbors(grid);
		}
	}
	
//ADJUSTABLE START AND END POINTS
	start = grid[0][0];
	end = grid[cols - 1][rows - 1];

//FORCES START CELL AND END CELL TO BE OPEN
	start.wall = false;
	end.wall = false;

	openSet.push(start);
}

//MAIN DRIVER FUNCTION
function draw() {
	if(openSet.length > 0) {
		var shortest = 0;
		for(var x = 0; x < openSet.length; x++) {
			if(openSet[x].f < openSet[shortest].f) {
				shortest = x;
			}
		}
		var current = openSet[shortest];

		//IF THE BEST AVAILABLE ADJACENT CELL IS THE END, THEN THE LOOP ENDS AND THE PROGRAM HAS SUCCEEDED
		if(openSet[shortest] == end) {
			noLoop();
			console.log("DONE");
		}

		//PROCESSING EACH CELL AS THE LOOP PROGRESSES
		removeCell(openSet, current);
		closedSet.push(current);		

		//CALCULATES SCORE USING G SCORE AND HEURISTIC TO CHOOSE THE BEST PATH
		var neighbors = current.neighbors;
		for(var x = 0; x < neighbors.length; x++) {
			var neighbor = neighbors[x];
			if(!closedSet.includes(neighbor) && !neighbor.wall) {
				var temp_g = current.g + 1;

				var betterPath = false;
				if(openSet.includes(neighbor)) {
					if(temp_g < neighbor.g) {
						neighbor.g = temp_g;
						betterPath = true;
					}
				} else {

					neighbor.g = temp_g;
					betterPath = true;
					openSet.push(neighbor);
				}

				if(betterPath) {
					neighbor.prev = current;
					neighbor.h = heuristic(neighbor, end);
					neighbor.f = neighbor.g + neighbor.h;
				}
			}
		}
	//NO PATH AVAILABLE
	} else {
		console.log("NO SOLUTION");
		noLoop();
		return;
	}

//COLORS FOR EACH CELL'S STATE
	background(0);

	for(var x = 0; x < cols; x++) {
		for(var y = 0; y < rows; y++) {
			grid[x][y].show(color(255));
		}
	}

	for(var x = 0; x < closedSet.length; x++) {
		closedSet[x].show(color(250, 0, 0));
	}
	
	for(var x = 0; x < openSet.length; x++) {
		openSet[x].show(color(250, 250, 0));
	}

	//ESTABLISHES THE PATH
	path = [];
	var tmp = current;
	path.push(tmp);
	while(tmp.prev) {
		path.push(tmp.prev);
		tmp = tmp.prev;
	}

	for(var x = 0; x < path.length; x++) {
		path[x].show(color(0, 250, 0));
	}
}