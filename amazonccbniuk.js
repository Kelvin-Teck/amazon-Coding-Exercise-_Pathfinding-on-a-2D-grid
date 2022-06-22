function AmazonsselfdrivingPathfinder(map, start, end, allowDiagonals) {
  this.map = map;
  this.lastCheckedNode = start;
  this.openSet = [];
  // openSet will starts with beginning node only
  this.openSet.push(start);
  this.closedSet = [];
  this.start = start;
  this.end = end;
  this.allowDiagonals = allowDiagonals;

  //This function returns a measure of aesthetic preference for
  //use when ordering the openSet. It is used to prioritise
  //between equal standard heuristic scores. It can therefore
  //be anything you like without affecting the ability to find
  //a minimum cost path.

  this.visualDist = function (a, b) {
    return dist(a.i, a.j, b.i, b.j);
  };

  // An educated guess of how far it is between two points

  this.heuristic = function (a, b) {
    var d;
    if (allowDiagonals) {
      d = dist(a.i, a.j, b.i, b.j);
    } else {
      d = abs(a.i - b.i) + abs(a.j - b.j);
    }
    return d;
  };

  // Function to delete element from the array
  this.removeFromArray = function (arr, elt) {
    // Could use indexOf here instead to be more efficient
    for (var i = arr.length - 1; i >= 0; i--) {
      if (arr[i] == elt) {
        arr.splice(i, 1);
      }
    }
  };

  //do one finding step.
  //returns 0 if search ongoing
  //returns 1 if goal reached
  //returns -1 if no solution
  this.step = function () {
    if (this.openSet.length > 0) {
      // Best next option
      var winner = 0;
      for (var i = 1; i < this.openSet.length; i++) {
        if (this.openSet[i].f < this.openSet[winner].f) {
          winner = i;
        }
        //if we have a tie according to the standard heuristic
        if (this.openSet[i].f == this.openSet[winner].f) {
          //Choose to explore options with longer known paths
          if (this.openSet[i].g > this.openSet[winner].g) {
            winner = i;
          }
        
          if (!this.allowDiagonals) {
            if (
              this.openSet[i].g == this.openSet[winner].g &&
              this.openSet[i].vh < this.openSet[winner].vh
            ) {
              winner = i;
            }
          }
        }
      }
      var current = this.openSet[winner];
      this.lastCheckedNode = current;

      // Check finished...
      if (current === this.end) {
        console.log("FINISHED!");
        return 1;
      }

      // moving from openSet to closedSet...
      this.removeFromArray(this.openSet, current);
      this.closedSet.push(current);

      // Check all the neighbors...
      var neighbors = current.getNeighbors();

      for (var i = 0; i < neighbors.length; i++) {
        var neighbor = neighbors[i];

        // check for the next spot...
        if (!this.closedSet.includes(neighbor)) {
          // checks if this is a better path than before...
          var tempG = current.g + this.heuristic(neighbor, current);

          // Checks if this is a better path than before...
          if (!this.openSet.includes(neighbor)) {
            this.openSet.push(neighbor);
          } else if (tempG >= neighbor.g) {
            // if it's not a better path...
            continue;
          }

          neighbor.g = tempG;
          neighbor.h = this.heuristic(neighbor, end);
          if (!allowDiagonals) {
            neighbor.vh = this.visualDist(neighbor, end);
          }
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.previous = current;
        }
      }
      return 0;
      // then no solution...
    } else {
      console.log("No solution could be found");
      return -1;
    }
  };
}

console.log(AStarPathFinder);
