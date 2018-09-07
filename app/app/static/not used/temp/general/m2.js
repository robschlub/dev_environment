let m3 = (function(){
    function mul(a,b) {
        return [
            a[0]*b[0] + a[1]*b[3] + a[2]*b[6],
            a[0]*b[1] + a[1]*b[4] + a[2]*b[7],
            a[0]*b[2] + a[1]*b[5] + a[2]*b[8],
            a[3]*b[0] + a[4]*b[3] + a[5]*b[6],
            a[3]*b[1] + a[4]*b[4] + a[5]*b[7],
            a[3]*b[2] + a[4]*b[5] + a[5]*b[8],
            a[6]*b[0] + a[7]*b[3] + a[8]*b[6],
            a[6]*b[1] + a[7]*b[4] + a[8]*b[7],
            a[6]*b[2] + a[7]*b[5] + a[8]*b[8]
        ];
    }
    function t(a) {
        return [
            a[0], a[3], a[6],
            a[1], a[4], a[7],
            a[2], a[5], a[8],
        ]
    }
    function identity() {
        return [
            1,0,0,
            0,1,0,
            0,0,1
        ]
    }
    function copy(a) {
        return [
            a[0], a[1], a[2],
            a[3], a[4], a[5],
            a[6], a[7], a[8]
        ]
    }
    function translationMatrix(tx, ty) {
        return [
            1, 0, tx,
            0, 1, ty,
            0, 0, 1,
        ];
    }
    function translate(m, tx, ty) {
        return mul(m, translationMatrix(tx, ty));
    }
    function rotationMatrix(angle) {
        let c = Math.cos(angle);
        let s = Math.sin(angle);
        return [
            c, -s, 0,
            s, c, 0,
            0, 0, 1,
        ];
    }
    function rotate(m, angle) {
        return mul(m, rotationMatrix(angle));
    }

    function scaleMatrix(sx, sy) {
        return [
            sx, 0, 0,
            0, sy, 0,
            0, 0, 1,
        ];
    }

    function scale(m, sx, sy) {
        return mul(m, scaleMatrix(sx, sy));
    }

    function transform(m, px, py) {
        return [
            m[0]*px + m[1]*py + m[2],
            m[3]*px + m[4]*py + m[5]
        ]
    }
    function pointTransform(m,p) {
        let result = transform(m, p.x, p.y);
        return d2.point(result[0], result[1]);
        // return {
        //     x:m[0]*p.x + m[1]*p.y + m[2],
        //     y:m[3]*p.x + m[4]*p.y + m[5],
        // }
        
    }

    function inverse(m) {
        det = m[0] * (m[4] * m[8] - m[7] * m[5]) -
                 m[1] * (m[3] * m[8] - m[5] * m[6]) +
                 m[2] * (m[3] * m[7] - m[4] * m[6]);
        invdet = 1/det;
        
        let minv00 = (m[4] * m[8] - m[7] * m[5]) * invdet;
        let minv01 = (m[2] * m[7] - m[1] * m[8]) * invdet;
        let minv02 = (m[1] * m[5] - m[2] * m[4]) * invdet;
        let minv10 = (m[5] * m[6] - m[3] * m[8]) * invdet;
        let minv11 = (m[0] * m[8] - m[2] * m[6]) * invdet;
        let minv12 = (m[3] * m[2] - m[0] * m[5]) * invdet;
        let minv20 = (m[3] * m[7] - m[6] * m[4]) * invdet;
        let minv21 = (m[6] * m[1] - m[0] * m[7]) * invdet;
        let minv22 = (m[0] * m[4] - m[3] * m[1]) * invdet;

        return [
          minv00, minv01, minv02,
          minv10, minv11, minv12,
          minv20, minv21, minv22
        ]
    }


    return {
        mul:mul,
        identity:identity,
        t:t,
        copy:copy,
        translate:translate,
        rotate:rotate,
        transform:transform,
        scale:scale,
        inverse:inverse,
        pointTransform:pointTransform,

    }
})();