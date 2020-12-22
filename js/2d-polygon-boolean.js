// Implementation of the Greiner-Hormann polygon clipping algorithm
//


/*  Ported from Mukesh Prasad's public domain code:
 *    http://tog.acm.org/resources/GraphicsGems/gemsii/xlines.c
 *
 *   This function computes whether two line segments,
 *   respectively joining the input points (x1,y1) -- (x2,y2)
 *   and the input points (x3,y3) -- (x4,y4) intersect.
 *   If the lines intersect, the return value is an array
 *   containing coordinates of the point of intersection.
 *
 *   Params
 *        x1, y1,  x2, y2   Coordinates of endpoints of one segment.
 *        x3, y3,  x4, y4   Coordinates of endpoints of other segment.
 *
 *   Also Accepts:
 *    4 objects with the minimal object structure { x: .., y: ..}
 *    4 arrays where [0] is x and [1] is y
 *
 *   The value returned by the function is one of:
 *
 *        undefined - no intersection
 *        array     - intersection
 *        true      - colinear
 */

function segseg(x1, y1, x2, y2, x3, y3, x4, y4) {

  if (arguments.length === 4) {
    var p1 = x1;
    var p2 = y1;
    var p3 = x2;
    var p4 = y2;

    // assume array [x, y]
    if (p1.length && p1.length === 2) {
      x1 = p1[0];
      y1 = p1[1];
      x2 = p2[0];
      y2 = p2[1];
      x3 = p3[0];
      y3 = p3[1];
      x4 = p4[0];
      y4 = p4[1];

    // assume object with obj.x and obj.y
    } else {
      x1 = p1.x;
      y1 = p1.y;
      x2 = p2.x;
      y2 = p2.y;
      x3 = p3.x;
      y3 = p3.y;
      x4 = p4.x;
      y4 = p4.y;
    }
  }


  var a1, a2, b1, b2, c1, c2; // Coefficients of line eqns.
  var r1, r2, r3, r4;         // 'Sign' values
  var denom, offset;          // Intermediate values
  var x, y;                   // Intermediate return values

  // Compute a1, b1, c1, where line joining points 1 and 2
  // is "a1 x  +  b1 y  +  c1  =  0".
  a1 = y2 - y1;
  b1 = x1 - x2;
  c1 = x2 * y1 - x1 * y2;

  // Compute r3 and r4.
  r3 = a1 * x3 + b1 * y3 + c1;
  r4 = a1 * x4 + b1 * y4 + c1;

  // Check signs of r3 and r4.  If both point 3 and point 4 lie on
  // same side of line 1, the line segments do not intersect.
  if ( r3 !== 0 && r4 !== 0 && ((r3 >= 0 && r4 >= 0) || (r3 < 0 && r4 < 0))) {
    return; // no intersection
  }


  // Compute a2, b2, c2
  a2 = y4 - y3;
  b2 = x3 - x4;
  c2 = x4 * y3 - x3 * y4;

  // Compute r1 and r2
  r1 = a2 * x1 + b2 * y1 + c2;
  r2 = a2 * x2 + b2 * y2 + c2;

  // Check signs of r1 and r2.  If both point 1 and point 2 lie
  // on same side of second line segment, the line segments do
  // not intersect.
  if (r1 !== 0 && r2 !== 0 && ((r1 >= 0 && r2 >= 0) || (r1 < 0 && r2 < 0))) {
    return; // no intersections
  }

  // Line segments intersect: compute intersection point.
  denom = a1 * b2 - a2 * b1;

  if ( denom === 0 ) {
    return true;
  }

  offset = denom < 0 ? - denom / 2 : denom / 2;

  x = b1 * c2 - b2 * c1;
  y = a2 * c1 - a1 * c2;

  return [
    ( x < 0 ? x : x ) / denom,
    ( y < 0 ? y : y ) / denom,
  ];
};


//////////////////////////////////////////////////////////////////

var orient = require('robust-orientation')[3]
var makeSlabs = require('slab-decomposition')
var makeIntervalTree = require('interval-tree-1d')
var bsearch = require('binary-search-bounds')

function visitInterval() {
  return true
}

function intervalSearch(table) {
  return function(x, y) {
    var tree = table[x]
    if(tree) {
      return !!tree.queryPoint(y, visitInterval)
    }
    return false
  }
}

function buildVerticalIndex(segments) {
  var table = {}
  for(var i=0; i<segments.length; ++i) {
    var s = segments[i]
    var x = s[0][0]
    var y0 = s[0][1]
    var y1 = s[1][1]
    var p = [ Math.min(y0, y1), Math.max(y0, y1) ]
    if(x in table) {
      table[x].push(p)
    } else {
      table[x] = [ p ]
    }
  }
  var intervalTable = {}
  var keys = Object.keys(table)
  for(var i=0; i<keys.length; ++i) {
    var segs = table[keys[i]]
    intervalTable[keys[i]] = makeIntervalTree(segs)
  }
  return intervalSearch(intervalTable)
}

function buildSlabSearch(slabs, coordinates) {
  return function(p) {
    var bucket = bsearch.le(coordinates, p[0])
    if(bucket < 0) {
      return 1
    }
    var root = slabs[bucket]
    if(!root) {
      if(bucket > 0 && coordinates[bucket] === p[0]) {
        root = slabs[bucket-1]
      } else {
        return 1
      }
    }
    var lastOrientation = 1
    while(root) {
      var s = root.key
      var o = orient(p, s[0], s[1])
      if(s[0][0] < s[1][0]) {
        if(o < 0) {
          root = root.left
        } else if(o > 0) {
          lastOrientation = -1
          root = root.right
        } else {
          return 0
        }
      } else {
        if(o > 0) {
          root = root.left
        } else if(o < 0) {
          lastOrientation = 1
          root = root.right
        } else {
          return 0
        }
      }
    }
    return lastOrientation
  }
}

function classifyEmpty(p) {
  return 1
}

function createClassifyVertical(testVertical) {
  return function classify(p) {
    if(testVertical(p[0], p[1])) {
      return 0
    }
    return 1
  }
}

function createClassifyPointDegen(testVertical, testNormal) {
  return function classify(p) {
    if(testVertical(p[0], p[1])) {
      return 0
    }
    return testNormal(p)
  }
}

function preprocessPolygon(loops) {
  //Compute number of loops
  var numLoops = loops.length

  //Unpack segments
  var segments = []
  var vsegments = []
  var ptr = 0
  for(var i=0; i<numLoops; ++i) {
    var loop = loops[i]
    var numVertices = loop.length
    for(var s=numVertices-1,t=0; t<numVertices; s=(t++)) {
      var a = loop[s]
      var b = loop[t]
      if(a[0] === b[0]) {
        vsegments.push([a,b])
      } else {
        segments.push([a,b])
      }
    }
  }

  //Degenerate case: All loops are empty
  if(segments.length === 0) {
    if(vsegments.length === 0) {
      return classifyEmpty
    } else {
      return createClassifyVertical(buildVerticalIndex(vsegments))
    }
  }

  //Build slab decomposition
  var slabs = makeSlabs(segments)
  var testSlab = buildSlabSearch(slabs.slabs, slabs.coordinates)

  if(vsegments.length === 0) {
    return testSlab
  } else {
    return createClassifyPointDegen(
      buildVerticalIndex(vsegments),
      testSlab)
  }
}
////////////////////////////////////////////////////////////////

function Node(vec, alpha, intersection) {
  this.vec = vec;
  this.alpha = alpha || 0;
  this.intersect = !!intersection;
}

Node.prototype = {
  vec: null,
  next: null,
  next: null,
  prev: null,
  nextPoly: null,
  neighbor: null,
  intersect: null,
  entry: null,
  visited : false,
  alpha : 0,

  nextNonIntersection : function nodeNextNonIntersection() {
    var a = this;
    while(a && a.intersect) {
      a = a.next;
    }
    return a;
  },

  last : function nodeLast() {
    var a = this;
    while (a.next && a.next !== this) {
      a = a.next;
    }
    return a;
  },

  createLoop : function nodeCreateLoop() {
    var last = this.last();
    last.prev.next = this;
    this.prev = last.prev;
  },

  firstNodeOfInterest : function nodeFirstNodeOfInterest() {
    var a = this;

    if (a) {
      do {
        a=a.next;
      } while(a!==this && (!a.intersect || a.intersect && a.visited));
    }

    return a;
  },

  insertBetween : function nodeInsertBetween(first, last) {
    var a = first;
    while(a !== last && a.alpha < this.alpha) {
      a = a.next;
    }

    this.next = a;
    this.prev = a.prev;
    if (this.prev) {
      this.prev.next = this;
    }

    this.next.prev = this;
  }
};


function createLinkedList(vecs) {
  var l = vecs.length;
  var ret, where;
  for (var i=0; i<l; i++) {
    var current = vecs[i];
    if (!ret) {
      where = ret = new Node(current);
    } else {
      where.next = new Node(current);
      where.next.prev = where;
      where = where.next;
    }
  }

  return ret;
}

function distance(v1, v2) {
  var x = v1[0] - v2[0];
  var y = v1[1] - v2[1];
  return Math.sqrt(x*x + y*y);
}

function clean(array) {
  var seen = {};
  var cur = array.length - 1;
  while (cur--) {
    var c = array[cur];
    var p = array[cur+1];
    if (c[0] === p[0] && c[1] === p[1]) {
      array.splice(cur, 1);
    }
  }
  return array;
}


function identifyIntersections(subjectList, clipList) {
  var subject, clip;
  var auxs = subjectList.last();
  auxs.next = new Node(subjectList.vec, auxs);
  auxs.next.prev = auxs;

  var auxc = clipList.last();
  auxc.next = new Node(clipList.vec, auxc);
  auxc.next.prev = auxc;

  for(subject = subjectList; subject.next; subject = subject.next) {
    if(!subject.intersect) {
      for(clip = clipList; clip.next; clip = clip.next) {
        if(!clip.intersect) {

          var a = subject.vec,
              b = subject.next.nextNonIntersection().vec,
              c = clip.vec,
              d = clip.next.nextNonIntersection().vec;

          var i = segseg(a, b, c, d);

          if(i && i !== true) {
            var intersectionSubject = new Node(i, distance(a, i) / distance(a, b), true);
            var intersectionClip = new Node(i, distance(c, i) / distance(c, d), true);
            intersectionSubject.neighbor = intersectionClip;
            intersectionClip.neighbor = intersectionSubject;
            intersectionSubject.insertBetween(subject, subject.next.nextNonIntersection());
            intersectionClip.insertBetween(clip, clip.next.nextNonIntersection());
          }
        }
      }
    }
  }
};

function identifyIntersectionType(subjectList, clipList, clipTest, subjectTest, type) {
  var subject, clip;
  var se = clipTest(subjectList.vec) < 0;
  if (type === 'and') {
    se = !se;
  }

  for(subject = subjectList; subject.next; subject = subject.next) {
    if(subject.intersect) {
      subject.entry = se;
      se = !se;
    }
  }

  var ce = subjectTest(clipList.vec) > 0;
  if (type === 'or') {
    ce = !ce;
  }

  for(clip = clipList; clip.next; clip = clip.next) {
    if(clip.intersect) {
      clip.entry = ce;
      ce = !ce;
    }
  }
};

function collectClipResults(subjectList, clipList) {
  subjectList.createLoop();
  clipList.createLoop();

  var crt, results = [], result;

  while ((crt = subjectList.firstNodeOfInterest()) !== subjectList) {
    result = [];
    for (; !crt.visited; crt = crt.neighbor) {

      result.push(crt.vec);
      var forward = crt.entry
      while(true) {
        crt.visited = true;
        crt = forward ? crt.next : crt.prev;

        if(crt.intersect) {
          crt.visited = true;
          break;
        } else {
          result.push(crt.vec);
        }
      }
    }

    results.push(clean(result));
  }

  return results;
};

function polygonBoolean(subjectPoly, clipPoly, operation) {

  var subjectList = createLinkedList(subjectPoly);
  var clipList = createLinkedList(clipPoly);
  var clipContains = preprocessPolygon([clipPoly]);
  var subjectContains = preprocessPolygon([subjectPoly]);

  var subject, clip;

  // Phase 1: Identify and store intersections between the subject
  //          and clip polygons
  var isects = identifyIntersections(subjectList, clipList);

  // Phase 2: walk the resulting linked list and mark each intersection
  //          as entering or exiting
  identifyIntersectionType(
    subjectList,
    clipList,
    clipContains,
    subjectContains,
    operation
  );

  // Phase 3: collect resulting polygons
  return collectClipResults(subjectList, clipList);
};

module.exports = polygonBoolean;
