/**
 * Fifteen puzzle grid.js, puzzle.js shared.js solver.js combined.
 */

// grid.js
(function() {
  this.originalPosition = function(num) {
    return [parseInt((num - 1) / 4, 10), parseInt((num - 1) % 4, 10)];
  };
  this.rectilinearDistance = function(num, curRow, curCol) {
    var origCol, origRow, _ref;
    _ref = originalPosition(num), origRow = _ref[0], origCol = _ref[1];
    return Math.abs(origRow - curRow) + Math.abs(origCol - curCol);
  };
  this.Grid = (function() {
    function Grid(grid, emptyPos) {
      var row, _i, _len;
      if (grid == null) {
        grid = INIT_GRID;
      }
      if (emptyPos == null) {
        emptyPos = [3, 3];
      }
      this.emptyPos = [].concat(emptyPos);
      this.grid = [];
      for (_i = 0, _len = grid.length; _i < _len; _i++) {
        row = grid[_i];
        this.grid.push([].concat(row));
      }
    }
    Grid.prototype.validMoves = function() {
      var colNum, rowNum, valid, _ref;
      _ref = this.emptyPos, rowNum = _ref[0], colNum = _ref[1];
      valid = [];
      if (colNum !== 0) {
        valid.push(LEFT);
      }
      if (colNum !== 3) {
        valid.push(RIGHT);
      }
      if (rowNum !== 0) {
        valid.push(ABOVE);
      }
      if (rowNum !== 3) {
        valid.push(BELOW);
      }
      return valid;
    };
    Grid.prototype.positionToMove = function(rowNum, colNum) {
      var emptyCol, emptyRow, _ref;
      _ref = this.emptyPos, emptyRow = _ref[0], emptyCol = _ref[1];
      if (rowNum === emptyRow) {
        if (colNum === emptyCol - 1) {
          return LEFT;
        }
        if (colNum === emptyCol + 1) {
          return RIGHT;
        }
      }
      if (colNum === emptyCol) {
        if (rowNum === emptyRow - 1) {
          return ABOVE;
        }
        if (rowNum === emptyRow + 1) {
          return BELOW;
        }
      }
      return null;
    };
    Grid.prototype.applyMoveFrom = function(sourceDirection) {
      var deltaCol, deltaRow, emptyPos, grid, nextGrid, number, row, sourceCol, sourceRow, targetCol, targetRow, _i, _len, _ref, _ref2, _ref3, _ref4;
      _ref = this.emptyPos, targetRow = _ref[0], targetCol = _ref[1];
      _ref2 = directionToDelta(sourceDirection), deltaRow = _ref2[0], deltaCol = _ref2[1];
      emptyPos = (_ref3 = [targetRow + deltaRow, targetCol + deltaCol], sourceRow = _ref3[0], sourceCol = _ref3[1], _ref3);
      grid = [];
      _ref4 = this.grid;
      for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
        row = _ref4[_i];
        grid.push([].concat(row));
      }
      grid[targetRow][targetCol] = grid[sourceRow][sourceCol];
      grid[sourceRow][sourceCol] = 0;
      nextGrid = new Grid(grid, emptyPos);
      number = grid[targetRow][targetCol];
      nextGrid._lowerSolutionBound = this.lowerSolutionBound() - rectilinearDistance(number, sourceRow, sourceCol) + rectilinearDistance(number, targetRow, targetCol);
      return nextGrid;
    };
    Grid.prototype.applyMoves = function(sourceDirections) {
      var dir, nextGrid, _i, _len;
      nextGrid = this;
      for (_i = 0, _len = sourceDirections.length; _i < _len; _i++) {
        dir = sourceDirections[_i];
        nextGrid = nextGrid.applyMoveFrom(dir);
      }
      return nextGrid;
    };
    Grid.prototype.lowerSolutionBound = function() {
      /*
       This calculates a lower bound on the minimum
       number of steps required to solve the puzzle

       This is the sum of the rectilinear distances
       from where each number is to where it should
       be
       */      var colNum, moveCount, number, rowNum;
      if (!(this._lowerSolutionBound != null)) {
        moveCount = 0;
        for (rowNum in this.grid) {
          rowNum = parseInt(rowNum, 10);
          for (colNum in this.grid[rowNum]) {
            colNum = parseInt(colNum, 10);
            number = this.grid[rowNum][colNum];
            if (number === 0) {
              continue;
            }
            moveCount += rectilinearDistance(number, rowNum, colNum);
          }
        }
        this._lowerSolutionBound = moveCount;
      }
      return this._lowerSolutionBound;
    };
    Grid.prototype.isSolved = function() {
      return this.lowerSolutionBound() === 0;
    };
    Grid.prototype.log = function() {
      var row, _i, _len, _ref, _results;
      console.log("Empty: " + this.emptyPos);
      _ref = this.grid;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        row = _ref[_i];
        _results.push(console.log(JSON.stringify(row)));
      }
      return _results;
    };
    return Grid;
  })();
}).call(window);
// end grid.js

// puzzle.js
(function() {
  var ControlBarView, OverlayView, PuzzleCellView, PuzzleView;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  PuzzleCellView = (function() {
    PuzzleCellView.prototype.spacing = 5;
    PuzzleCellView.prototype.cellSize = 100;
    function PuzzleCellView(_arg) {
      var origColNum, origRowNum;
      this.number = _arg.number, this.controller = _arg.controller;
      this.node = $('<div/>', {
        "class": 'cell',
        text: this.number
      });
      this.node.mousedown(__bind(function() {
        return this.controller.handleCellClicked(this.rowNum, this.colNum);
      }, this));
      origRowNum = parseInt((this.number - 1) / 4, 10);
      origColNum = parseInt((this.number - 1) % 4, 10);
      if ((origRowNum + origColNum) % 2 === 0) {
        this.node.addClass('dark');
      } else {
        this.node.addClass('light');
      }
    }
    PuzzleCellView.prototype.setPosition = function(rowNum, colNum, duration, cb) {
      this.rowNum = rowNum;
      this.colNum = colNum;
      if (duration == null) {
        duration = 0;
      }
      if (cb == null) {
        cb = $.noop;
      }
      return this.node.animate({
        top: "" + (this.spacing + this.rowNum * (this.spacing + this.cellSize)) + "px",
        left: "" + (this.spacing + this.colNum * (this.spacing + this.cellSize)) + "px"
      }, duration, cb);
    };
    return PuzzleCellView;
  })();
  ControlBarView = (function() {
    function ControlBarView(_arg) {
      var shuffleBtn, solveBtn, titleText;
      this.controller = _arg.controller;
      this.node = $('<div/>', {
        "class": 'control-bar'
      });
      this.controls = $('<div/>');
      shuffleBtn = $('<div/>', {
        text: 'shuffle',
        "class": 'shuffle-button',
        click: __bind(function() {
          return this.controller.handleShuffleClicked();
        }, this)
      });
      titleText = $('<div/>', {
        text: 'Fifteen',
        "class": 'title-text'
      });
      solveBtn = $('<div/>', {
        text: 'solve',
        "class": 'solve-button',
        click: __bind(function() {
          return this.controller.handleSolveClicked();
        }, this)
      });
      this.controls.append(shuffleBtn);
      this.controls.append(titleText);
      this.controls.append(solveBtn);
      this.node.append(this.controls);
    }
    return ControlBarView;
  })();
  OverlayView = (function() {
    function OverlayView(_arg) {
      this.controller = _arg.controller;
      this.node = $('<div/>', {
        "class": 'overlay-container'
      });
      this.overlay = $('<div/>', {
        "class": 'overlay'
      });
      this.glowing = false;
      this.node.append(this.overlay);
      this.node.hide();
    }
    OverlayView.prototype.setMessage = function(msg) {
      return this.overlay.text(msg);
    };
    OverlayView.prototype.show = function(msg, cb) {
      if (msg != null) {
        this.setMessage(msg);
      }
      return this.node.fadeIn(__bind(function() {
        if (cb) {
          cb();
        }
        this.glowing = true;
        return this.glowOut();
      }, this));
    };
    OverlayView.prototype.hide = function(cb) {
      this.glowing = false;
      return this.node.fadeOut(cb);
    };
    OverlayView.prototype.glowOut = function() {
      if (!this.glowing) {
        return;
      }
      return this.overlay.animate({
        opacity: 0.6
      }, 1000, __bind(function() {
        return this.glowIn();
      }, this));
    };
    OverlayView.prototype.glowIn = function() {
      if (!this.glowing) {
        return;
      }
      return this.overlay.animate({
        opacity: 0.8
      }, 1000, __bind(function() {
        return this.glowOut();
      }, this));
    };
    return OverlayView;
  })();
  PuzzleView = (function() {
    function PuzzleView(_arg) {
      var cell, colNum, grid, num, rowNum;
      this.controller = _arg.controller, this.container = _arg.container, grid = _arg.grid;
      this.container.addClass('puzzle-container');
      this.node = $('<div/>').addClass('puzzle').appendTo(this.container);
      this.controlsShown = true;
      this.moving = false;
      this.moveQueue = [];
      this.cellViews = [];
      for (rowNum in grid) {
        rowNum = parseInt(rowNum, 10);
        this.cellViews[rowNum] = [];
        for (colNum in grid[rowNum]) {
          colNum = parseInt(colNum, 10);
          num = grid[rowNum][colNum];
          if (num === 0) {
            cell = null;
            this.emptyPos = [rowNum, colNum];
          }
          if (num !== 0) {
            cell = new PuzzleCellView({
              number: num,
              controller: this.controller
            });
            cell.setPosition(rowNum, colNum);
            this.node.append(cell.node);
          }
          this.cellViews[rowNum].push(cell);
        }
      }
      this.controlBarView = new ControlBarView({
        controller: this.controller
      });
      this.node.append(this.controlBarView.node);
      this.overlayView = new OverlayView({
        controller: this.controller
      });
      this.node.append(this.overlayView.node);
    }
    PuzzleView.prototype.queueMoves = function(moves) {
      return this.moveQueue = this.moveQueue.concat(moves);
    };
    PuzzleView.prototype.runQueue = function(duration, pause, cb) {
      if (cb == null) {
        cb = $.noop;
      }
      if (this.moveQueue.length === 0) {
        cb();
        return;
      }
      this.moving = true;
      return this.moveFrom(this.moveQueue.shift(), duration, __bind(function() {
        if (this.moveQueue.length > 0) {
          return setTimeout(__bind(function() {
            return this.runQueue(duration, pause, cb);
          }, this), pause);
        } else {
          this.moving = false;
          return cb();
        }
      }, this));
    };
    PuzzleView.prototype.moveFrom = function(sourceDirection, duration, cb) {
      var cellView, deltaCol, deltaRow, sourceCol, sourceRow, targetCol, targetRow, _ref, _ref2, _ref3;
      _ref = this.emptyPos, targetRow = _ref[0], targetCol = _ref[1];
      _ref2 = directionToDelta(sourceDirection), deltaRow = _ref2[0], deltaCol = _ref2[1];
      this.emptyPos = (_ref3 = [targetRow + deltaRow, targetCol + deltaCol], sourceRow = _ref3[0], sourceCol = _ref3[1], _ref3);
      cellView = this.cellViews[sourceRow][sourceCol];
      this.cellViews[targetRow][targetCol] = cellView;
      this.cellViews[sourceRow][sourceCol] = null;
      return cellView.setPosition(targetRow, targetCol, duration, cb);
    };
    PuzzleView.prototype.hideControls = function(cb) {
      this.controlsShown = false;
      return $(this.node).animate({
        height: "-=50px"
      }, cb);
    };
    PuzzleView.prototype.showControls = function(cb) {
      this.controlsShown = true;
      return $(this.node).animate({
        height: "+=50px"
      }, cb);
    };
    PuzzleView.prototype.showOverlay = function(msg, cb) {
      return this.overlayView.show(msg, cb);
    };
    PuzzleView.prototype.setOverlayMessage = function(msg) {
      return this.overlayView.setMessage(msg);
    };
    PuzzleView.prototype.hideOverlay = function(cb) {
      return this.overlayView.hide(cb);
    };
    PuzzleView.prototype.isInteractive = function() {
      return this.controlsShown && !this.moving;
    };
    return PuzzleView;
  })();
  this.randomMoveList = function(grid, nMoves, moveList) {
    var last, ldc, ldr, nextGrid, sourceDirection, validMoves, _ref;
    if (moveList == null) {
      moveList = [];
    }
    if (moveList.length === nMoves) {
      return moveList;
    }
    validMoves = grid.validMoves();
    if (moveList.length > 0) {
      last = _.last(moveList);
      _ref = directionToDelta(last), ldr = _ref[0], ldc = _ref[1];
      validMoves = _.filter(validMoves, function(m) {
        return !directionsAreOpposites(last, m);
      });
    }
    sourceDirection = _.shuffle(validMoves)[0];
    nextGrid = grid.applyMoveFrom(sourceDirection);
    moveList.push(sourceDirection);
    return randomMoveList(nextGrid, nMoves, moveList);
  };
  this.Puzzle = (function() {
    Puzzle.prototype.moveDuration = 100;
    Puzzle.prototype.movePause = 20;
    function Puzzle(container) {
      this.container = container;
      this.grid = new Grid(INIT_GRID, [3, 3]);
      this.view = new PuzzleView({
        container: this.container,
        grid: INIT_GRID,
        controller: this
      });
    }
    Puzzle.prototype.shuffle = function(nMoves, cb) {
      return this.applyMoves(randomMoveList(this.grid, nMoves), cb);
    };
    Puzzle.prototype.applyMoves = function(moves, cb) {
      this.grid = this.grid.applyMoves(moves);
      this.view.queueMoves(moves);
      return this.view.runQueue(this.moveDuration, this.movePause, cb);
    };
    Puzzle.prototype.handleShuffleClicked = function() {
      if (this.view.isInteractive()) {
        this.view.showOverlay('shuffling');
        return this.view.hideControls(__bind(function() {
          return this.shuffle(25, __bind(function() {
            this.view.hideOverlay();
            return this.view.showControls();
          }, this));
        }, this));
      }
    };
    Puzzle.prototype.handleSolveClicked = function() {
      if (this.view.isInteractive() && !this.grid.isSolved()) {
        return this.view.hideControls(__bind(function() {
          return this.view.showOverlay('solving', __bind(function() {
            return solve(this.grid, {
              complete: __bind(function(_arg) {
                var steps;
                steps = _arg.steps;
                return this.view.hideOverlay(__bind(function() {
                  return this.applyMoves(steps, __bind(function() {
                    return this.view.showControls();
                  }, this));
                }, this));
              }, this),
              error: __bind(function(_arg) {
                var msg;
                msg = _arg.msg;
                this.view.hideOverlay();
                return this.view.showControls();
              }, this)
            });
          }, this));
        }, this));
      }
    };
    Puzzle.prototype.handleCellClicked = function(rowNum, colNum) {
      var move;
      if (this.view.isInteractive()) {
        move = this.grid.positionToMove(rowNum, colNum);
        if (move != null) {
          return this.applyMoves([move]);
        }
      }
    };
    return Puzzle;
  })();
}).call(window);

// end puzzle.js

// shared.js
(function() {
  this.ABOVE = "ABOVE";
  this.RIGHT = "RIGHT";
  this.LEFT = "LEFT";
  this.BELOW = "BELOW";
  this.directionToDelta = function(direction) {
    switch (direction) {
      case ABOVE:
        return [-1, 0];
      case RIGHT:
        return [0, 1];
      case BELOW:
        return [1, 0];
      case LEFT:
        return [0, -1];
    }
  };
  this.directionsAreOpposites = function(a, b) {
    var adc, adr, bdc, bdr, _ref, _ref2;
    _ref = directionToDelta(a), adr = _ref[0], adc = _ref[1];
    _ref2 = directionToDelta(b), bdr = _ref2[0], bdc = _ref2[1];
    return (adr + bdr === 0) && (adc + bdc === 0);
  };
  this.INIT_GRID = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 0]];
}).call(window);

// end shared.js

// solver.js
(function() {
  this.SolverState = (function() {
    function SolverState(grid, steps) {
      var lowerSolutionBound;
      this.grid = grid;
      lowerSolutionBound = this.grid.lowerSolutionBound();
      this.steps = [].concat(steps);
      this.solved = this.grid.isSolved();
      this.val = lowerSolutionBound + steps.length;
    }
    return SolverState;
  })();
  this.SolverStateMinHeap = (function() {
    SolverStateMinHeap.prototype.maxSize = 100000;
    function SolverStateMinHeap() {
      this.data = [];
    }
    SolverStateMinHeap.prototype.enqueue = function(pt) {
      this.data.push(pt);
      this.bubbleUp(this.data.length - 1);
      if (this.data.length === this.maxSize) {
        return this.data.pop();
      }
    };
    SolverStateMinHeap.prototype.dequeue = function() {
      var end, ret;
      ret = this.data[0];
      end = this.data.pop();
      if (this.data.length > 0) {
        this.data[0] = end;
        this.bubbleDown(0);
      }
      return ret;
    };
    SolverStateMinHeap.prototype.bubbleUp = function(curPos) {
      var cur, parent, parentPos;
      if (curPos === 0) {
        return;
      }
      parentPos = ~~((curPos - 1) / 2);
      cur = this.data[curPos];
      parent = this.data[parentPos];
      if (cur.val < parent.val) {
        this.data[curPos] = parent;
        this.data[parentPos] = cur;
        return this.bubbleUp(parentPos);
      }
    };
    SolverStateMinHeap.prototype.bubbleDown = function(curPos) {
      var cur, left, leftPos, right, rightPos, swapPos;
      leftPos = curPos * 2 + 1;
      rightPos = curPos * 2 + 2;
      cur = this.data[curPos];
      left = this.data[leftPos];
      right = this.data[rightPos];
      swapPos = null;
      if ((left != null) && left.val < cur.val) {
        swapPos = leftPos;
      }
      if ((right != null) && right.val < left.val && right.val < cur.val) {
        swapPos = rightPos;
      }
      if (swapPos != null) {
        this.data[curPos] = this.data[swapPos];
        this.data[swapPos] = cur;
        return this.bubbleDown(swapPos);
      }
    };
    SolverStateMinHeap.prototype.empty = function() {
      return this.data.length === 0;
    };
    return SolverStateMinHeap;
  })();
  this.solve = function(startGrid, _arg) {
    var candidates, complete, curState, error, frontier, grid, its, lastStep, nextGrid, nextState, nextSteps, sourceDirection, startState, steps, _results;
    complete = _arg.complete;
    error = _arg.error;
    frontier = _arg.frontier;
    if (complete != null) {
      complete;
    } else {
      complete = $.noop;
    }
    if (error != null) {
      error;
    } else {
      error = $.noop;
    }
    if (!(frontier != null)) {
      frontier = new SolverStateMinHeap;
      startState = new SolverState(startGrid, []);
      frontier.enqueue(startState);
    }
    its = 0;
    _results = [];
    while (!frontier.empty()) {
      its += 1;
      if (its > 1000) {
        window.setTimeout(function() {
          return solve(startGrid, {
            complete: complete,
            error: error,
            frontier: frontier
          });
        }, 10);
        return;
      }
      curState = frontier.dequeue();
      if (curState.solved) {
        steps = curState.steps;
        complete({
          steps: curState.steps,
          iterations: its
        });
        return;
      }
      grid = curState.grid;
      steps = curState.steps;
      candidates = _.shuffle(grid.validMoves());
      lastStep = _.last(steps);
      if (lastStep != null) {
        candidates = _(candidates).filter(function(x) {
          return !directionsAreOpposites(x, lastStep);
        });
      }
      _results.push((function() {
        var _i, _len, _results2;
        _results2 = [];
        for (_i = 0, _len = candidates.length; _i < _len; _i++) {
          sourceDirection = candidates[_i];
          nextGrid = grid.applyMoveFrom(sourceDirection);
          nextSteps = steps.concat([sourceDirection]);
          nextState = new SolverState(nextGrid, nextSteps);
          _results2.push(frontier.enqueue(nextState));
        }
        return _results2;
      })());
    }
    return _results;
  };
}).call(window);

// end solver.js