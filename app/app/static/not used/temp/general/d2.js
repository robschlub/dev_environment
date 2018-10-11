let d2 = (function() {
    function point(x,y) {
        return new Point(x,y);
    }
    function Point(x,y) {
        this.x = x;
        this.y = y;
    }
    Point.prototype.copy = function() {
        return new Point(this.x, this.y);
    }
    Point.prototype.sub = function(q){
        return point(this.x-q.x, this.y-q.y);
    }
    Point.prototype.add = function(q){
        return point(this.x+q.x, this.y+q.y);
    }
    Point.prototype.distance = function() {
        return Math.sqrt(this.x*this.x + this.y*this.y);
    }
    Point.prototype.round = function(precision=8) {
        return point(tools.round(this.x,precision),tools.round(this.y, precision));
    }
    Point.prototype.rotate = function(angle, center=null) {
        c = Math.cos(angle);
        s = Math.sin(angle);
        matrix = [c,-s,
                  s, c];
        if (center == null) {
            center = point(0,0);
        }
        let pt = this.sub(center);
        return point(matrix[0]*pt.x + matrix[1]*pt.y + center.x,
                 matrix[2]*pt.x + matrix[3]*pt.y + center.y);
    }
    Point.prototype.isEqualTo = function(q, precision=undefined) {
        let pr = this;
        let qr = q;
        if(precision) {
            pr = this.round(precision);
            qr = qr.round(precision);
        }
        if (pr.x == qr.x && pr.y == qr.y) {
            return true;
        }
        return false;
    }
    Point.prototype.isNotEqualTo = function(q, precision=undefined) {
        return !this.isEqualTo(q, precision);
    }
    Point.prototype.isOnLine = function(l, precision) {
        return l.hasPointOn(this, precision);
    }
    Point.prototype.isOnUnboundLine = function(l, precision) {
        return l.hasPointAlong(this, precision);
    }
    Point.prototype.console = function(text) {
        console.log(text + this.x + ', ' + this.y);
    }
    function isLeft(p0, p1, p2) {
    return ( (p1.x - p0.x) * (p2.y - p0.y)
            - (p2.x -  p0.x) * (p1.y - p0.y) );
    }
    Point.prototype.isInPolygon = function(polygonVertices) {
        let windingNumber = 0;
        let n = polygonVertices.length-1;
        let v = polygonVertices;
        let p = this;
        let popLastPoint = false;
        // polygonVertices needs to have the last vertex the same as the first vertex
        if (v[0].isNotEqualTo(v[n])) {
            v.push(v[0]);
            popLastPoint = true;
            n+=1;
        }
        for (let i=0;i<n;++i) {
            if (v[i].y <= p.y) {
                if (v[i+1].y  > p.y)      // an upward crossing
                    if (isLeft( v[i], v[i+1], p) > 0)  // P left of  edge
                        ++windingNumber;            // have  a valid up intersect
            }
            else {                        // start y > P.y (no test needed)
                if (v[i+1].y  <= p.y)     // a downward crossing
                     if (isLeft( v[i], v[i+1], p) < 0)  // P right of  edge
                         --windingNumber;            // have  a valid down intersect
            }
        }
        if (popLastPoint) {
            v.pop();
        }
        if(windingNumber ==0 ){
            return false;
        }
        return true;
    }
    Point.prototype.isOnPolygon = function(polygonVertices) {
        let popLastPoint = false;
        let p=this;
        let n = polygonVertices.length-1;   //Number of sides
        let v = polygonVertices;

        // polygonVertices needs to have the last vertex the same as the first vertex
        if (v[0].isNotEqualTo(v[n])) {
            v.push(v[0]);
            popLastPoint = true;
            n+=1;
        }
        
        for (let i=0;i<n;++i) {
            // if(p.isEqualTo(v[i])) {
            //     return true;
            // }
            let l = line(v[i],v[i+1]);
            if (p.isOnLine(l)) {
                return true;
            }
        }
        if (p.isInPolygon(polygonVertices)) {
            return true;
        }

        if (popLastPoint) {
            v.pop();
        }
        return false;
    }


    function pointinRect(q, p1, p2, precision = undefined) {
        if (precision == undefined) {
            if ( q.x >= Math.min(p1.x, p2.x) && 
                 q.x <= Math.max(p1.x, p2.x) && 
                 q.y >= Math.min(p1.y, p2.y) && 
                 q.y <= Math.max(p1.y, p2.y)    )
                return true;
        }
        else {
            if ( tools.round(q.x,precision) >= tools.round(Math.min(p1.x, p2.x),precision) && 
                 tools.round(q.x,precision) <= tools.round(Math.max(p1.x, p2.x),precision) && 
                 tools.round(q.y,precision) >= tools.round(Math.min(p1.y, p2.y),precision) && 
                 tools.round(q.y,precision) <= tools.round(Math.max(p1.y, p2.y),precision)    )
                return true;
        }
        return false;
    }
    function line(p1, p2) {
        return new Line(p1, p2);
    }
    function Line(p1, p2) {
        this.A = p2.y-p1.y;
        this.B = p1.x-p2.x; 
        this.C = this.A*p1.x + this.B*p1.y;
        this.p1 = p1;
        this.p2 = p2;
    }
    Line.prototype.round = function(precision=8) {
        let lineRounded = line(this.p1, this.p2);
        lineRounded.A = tools.round(lineRounded.A,precision);
        lineRounded.B = tools.round(lineRounded.B,precision);
        lineRounded.C = tools.round(lineRounded.C,precision);
        return lineRounded;
    }
    Line.prototype.length = function(){
        // return this.p1.sub(this.p2).distance();
        return distance(this.p1,this.p2);
    }
    Line.prototype.midpoint = function() {
        let length = this.length();
        let direction = this.p2.sub(this.p1)
        let angle = Math.atan2(direction.y, direction.x);
        let midpoint = d2.point(this.p1.x + length/2*Math.cos(angle), this.p1.y + length/2*Math.sin(angle));
        return midpoint;
    }
    Line.prototype.hasPointAlong = function(p, precision = undefined) {
        if (precision == undefined) {
            if (this.C == this.A*p.x + this.B * p.y) {
                return true;
            }
        }
        else {
            if (tools.round(this.C,precision) == tools.round(this.A*p.x + this.B * p.y,precision)) {
                return true;
            }
        }
        return false
    }
    Line.prototype.hasPointOn = function(p, precision = undefined) {
        if (this.hasPointAlong(p, precision)) {
            if (pointinRect(p, this.p1, this.p2, precision)) {
                return true
            }
        }
        return false;
    }
    Line.prototype.isEqualTo = function(line2, precision = undefined) {
        let l1 = this;
        let l2 = line2;
        if (precision) {
            l1 = l1.round(precision);
            l2 = l2.round(precision);
            l1.p1 = l1.p1.round(precision);
            l1.p2 = l1.p2.round(precision);
            l2.p1 = l2.p1.round(precision);
            l2.p2 = l2.p2.round(precision);
        }
        if (l1.A!=l2.A) {
            return false;
        }
        if (l1.B!=l2.B) {
            return false;
        }
        if (l1.C!=l2.C) {
            return false;
        }
        if (l1.p1.isNotEqualTo(l2.p1) && l1.p1.isNotEqualTo(l2.p2)) {
            return false;
        }
        if (l1.p2.isNotEqualTo(l2.p1) && l1.p2.isNotEqualTo(l2.p2)) {
            return false;
        }
        return true;
    }
    Line.prototype.isOnSameLineAs = function(line2, precision = 8) {
        l1 = this.round(precision);
        l2 = line2.round(precision);
        // If A and B are zero, then this is not a line
        if (l1.A == 0 && l1.B == 0 || l2.A ==0 && l2.B == 0) {
            return false;
        }
        // If A is 0, then it must be 0 on the other line. Similar with B
        if (l1.A != 0) {
            let scale = l2.A/l1.A;
            if (l1.B * scale != l2.B) {
                return false;
            }
            if (l1.C * scale != l2.C) {
                return false;
            }
            return true;
        }
        if (l2.A != 0) {
            let scale = l1.A/l2.A;
            if (l2.B * scale != l1.B) {
                return false;
            }
            if (l2.C * scale != l1.C) {
                return false;
            }
            return true;
        }
        if (l1.B != 0) {
            let scale = l2.B/l1.B;
            if (l1.A * scale != l2.A) {
                return false;
            }
            if (l1.C * scale != l2.C) {
                return false;
            }
            return true;
        }
        if (l2.B != 0) {
            let scale = l1.B/l2.B;
            if (l2.A * scale != l1.A) {
                return false;
            }
            if (l2.C * scale != l1.C) {
                return false;
            }
            return true;
        }
        return true;
    }
    Line.prototype.intersectsWith = function(line2, precision=8) {
        let l2 = line2; //line2.round(precision);
        let l1 = this; //this.round(precision);
        let det = l1.A*l2.B - l2.A*l1.B;
        if(tools.round(det,precision) != 0){
            let i = point(0,0);
            i.x = (l2.B*l1.C - l1.B*l2.C)/det;
            i.y = (l1.A*l2.C - l2.A*l1.C)/det;
            if (pointinRect(i, l1.p1, l1.p2, precision) && 
                pointinRect(i, l2.p1, l2.p2, precision)){
                return {
                    onLine: true,
                    inLine: true,
                    intersect: i,
                }
            }
            else {
                return {
                    onLine: true,
                    inLine: false,
                    intersect: i,
                }
            }
        }
        if (det == 0 && (l1.isOnSameLineAs(l2, precision))) {
            // if the lines are colliner then:
            //   - if overlapping, 
            //      - if partially overlapping: the intersect point is halfway between overlapping ends
            //      - if one line is within the other line, the intersect point is halfway between the midpoints
            //   - if not overlapping, the intersect point is halfway between the nearest ends
            // let l1 = this;
            if(!l1.p1.isOnLine(l2,precision) && !l1.p2.isOnLine(l2,precision) && !l2.p1.isOnLine(l1,precision) && !l2.p2.isOnLine(l1,precision)) {
                let line11 = line(l1.p1,l2.p1);
                let line12 = line(l1.p1,l2.p2);
                let line21 = line(l1.p2,l2.p1);
                let line22 = line(l1.p2,l2.p2);

                let i = line11.midpoint();
                let len = line11.length();
                if(line12.length() < len) {
                    i = line12.midpoint();
                    len = line12.length();
                }
                if(line21.length() < len) {
                    i = line21.midpoint();
                    len = line21.length();
                }
                if(line22.length() < len) {
                    i = line22.midpoint();
                    len = line22.length();
                }
                return {
                    onLine: true,
                    inLine: false,
                    intersect: i,
                }
            }
            if( (l1.p1.isOnLine(l2,precision) && l1.p2.isOnLine(l2,precision) && (!l2.p1.isOnLine(l1,precision) || !l2.p2.isOnLine(l1,precision))) ||
                (l2.p1.isOnLine(l1,precision) && l2.p2.isOnLine(l1,precision) && (!l1.p1.isOnLine(l2,precision) || !l1.p2.isOnLine(l2,precision))) ) {
                let midLine = line(l1.midpoint(), l2.midpoint());
                let i = midLine.midpoint();
                return {
                    onLine: true,
                    inLine: true,
                    intersect: i,
                }
            }
            let midLine = undefined;
            if( l1.p1.isOnLine(l2,precision) && !l1.p2.isOnLine(l2,precision) && l2.p1.isOnLine(l1,precision) && !l2.p2.isOnLine(l1,precision)) {
                midLine = line(l1.p1, l2.p1);
            }
            if( l1.p1.isOnLine(l2,precision) && !l1.p2.isOnLine(l2,precision) && !l2.p1.isOnLine(l1,precision) && l2.p2.isOnLine(l1,precision)) {
                midLine = line(l1.p1, l2.p2);
            }
            if( !l1.p1.isOnLine(l2,precision) && l1.p2.isOnLine(l2,precision) && l2.p1.isOnLine(l1,precision) && !l2.p2.isOnLine(l1,precision)) {
                midLine = line(l1.p2, l2.p1);
            }
            if( !l1.p1.isOnLine(l2,precision) && l1.p2.isOnLine(l2,precision) && !l2.p1.isOnLine(l1,precision) && l2.p2.isOnLine(l1,precision)) {
                midLine = line(l1.p2, l2.p2);
            }
                
            let i = midLine.midpoint();
            return {
                onLine: true,
                inLine: true,
                intersect: i,
            }
        }
        return {
            onLine: false,
            inLine: false,
            intersect: undefined,
        }
    }
    function distance(p1, p2) {
        return Math.sqrt(Math.pow(p2.x-p1.x,2) + Math.pow(p2.y-p1.y,2));
    }
    function deg(angle) {
        return angle*180/Math.PI;
    }
    function minAngleDiff(angle1, angle2) {
        return Math.atan2(Math.sin(angle1-angle2), Math.cos(angle1-angle2));
    }

    function normAngle (angle) {
        let newAngle = angle;
        while (newAngle >= Math.PI*2.0) {
            newAngle -= Math.PI*2.0;
        }
        while (newAngle < 0) {
            newAngle += Math.PI*2.0;    
        }
        return newAngle;
    }

    return {
        point: point,
        line: line,
        distance: distance,
        minAngleDiff: minAngleDiff,
        deg: deg,
        normAngle: normAngle,
    }
})();