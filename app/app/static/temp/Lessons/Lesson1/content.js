function Lesson1Content(director) {
    "use strict";
    LessonContent.call(this, director);
    let _this = this;
    // let _this = director;
    let geometry = director.lesson.diagrams[0].geometry;
    this.geometry = geometry;
    let diagram = director.lesson.diagrams[0];
    let circle = geometry._circle;
    let stick = geometry._circle._stick;

    // let actionWord = this.actionWord;
    
   
    this.title = 'Shapes';
    this.subTitle = 'And their properties';
    let text;
    text =  '<p>The definition, standardization and calculation of shapes '+
            'helps us understand and change the world around us.</p>' +
            '<p>To use a shape, you need to be able to communicate it (draw, describe) and/or calculate it.</p>' +
            '<p>To do these things, you\'ve got to define it. Give it a name. Then you\'ve got to quantify it '+
            '- identify some properties that describe it. Often those properties can be related or dependent '+
            'on one and other.</p>' + 
            '';
    this.addPage({
            title: 'Introduction',
            text: text,
            state: function() {
                geometry.hideAll()
                // geometry.showOnly([circle, circle._anchor]);
                // circle.show = false;
                _this.hideAnnotation();
            },
        });

    text =  '<p>Start with a |_stick| or straight line.</p>' +
            '';
    this.addPage({
        title: 'Circle',
        text: text,
        modifiers: {
            _stick: _this.actionWord('stick', '_stick', 'L2_col_stick'),
        },
        state: function() {
            geometry.showOnly([circle,
                               stick])
            _this.onClickPulse('_stick',stick)
            stick.isMovable = false;
            diagram.resetAngle();
        }
    });

    text =  '<p>|_Anchor| one end.</p>' +
            '<p>Rotate |_stick| by |_pushing| the free end.</p>'+
            '';
    this.addPage({
        text:   text,
        modifiers: {
            _Anchor:       _this.actionWord('Anchor',       '_Anchor',       'L2_col_anchor'),
            _pushing:      _this.actionWord('pushing',      '_pushing',      'L2_col_hint_arrow'),
            _stick:        _this.actionWord('stick',        '_stick',        'L2_col_stick'),
        },
        state: function() {
            geometry.showAll(); //([circle, stick, circle._anchor, circle._hintArrow, circle._rotationAngle._line]);
            geometry._circle._anchor.pulseNow();
            diagram.resetAngle();
            stick.isMovable = true;

            _this.onClickPulse("_Anchor",circle._anchor);
            _this.onClickPulse("_stick",stick);
            _this.onClickRotate("_pushing", stick, Math.PI/4,0.8);
        },
        autoNext: function() {
            return stick.transform.rotation >= Math.PI * 2.0 / 90;
        },
        transitionNext: function(done) {
            stick.animateRotationTo(Math.PI / 4, 1,0.7,tools.easeinout, done);
        },
        // transitionPrev: function() {
        //     geometry.showOnly([circle, startLine]);
        //     startLine.animateTo(startLine.presetTransforms['onScreenCenter'],0.7,0,tools.easeinout,_this.finishTransPrev.bind(_this))
        // },
    });

    text =  '<p>Trace where the free end travels.</p><p>A complete '+
            'rotation forms a |_shape|.</p>' + 
            '';
    this.addPage({
        text: text,
         modifiers: {
            _shape:       _this.actionWord('shape',       '_shape',       'L2_col_arc'),
        },
        state:   function() {
            geometry.showAll(); 
            stick.isMovable = true;
            _this.onClickRotate("_shape", stick, Math.PI*2*0.999,0.8,1);
            // window.location.href = "html/lesson1.html"
        },
        // autoNext: function() {
        //     return _this.lesson.state.drawFullCircle;
        // },
        // autoPrev: function() {
        //   return _this.lesson.state.currentAngle < Math.PI*2.0/360 && !_this.lesson.state.drawFullCircle;
        // },
        // transitionNext: function() {
        //     if (!_this.lesson.state.drawFullCircle) {
        //         if(_this.lesson.state.currentAngle > 0){
        //             _this.lesson.state.animateGoToAngle(0*Math.PI/180,1,1.0, _this.finishTransNext.bind(_this));
        //         }
        //             else {
        //                 _this.finishTransNext()
        //             }
        //         }
        // },
        transitionPrev: function(done) {
            diagram.resetAngle();
            done();
        },
    });
};
Lesson1Content.prototype = Object.create(LessonContent.prototype);

Lesson1Content.prototype.showAll = function() {
    let circle = this.geometry._circle;
    this.geometry.showOnly([ circle,
                        circle._anchor,
                        circle._hintArrow,
                        circle._stick,
                        cicle._rotationAngle._line,
                        circle._rotationAngle._innerline,
                        circle._rotationAngle._outerline,
    ]);
    this.hideAnnotation();
    circle._rotationAngle.setAngle(circle._stick.transform.rotation);
}

Lesson1Content.prototype.hideAnnotation = function() {
    document.getElementById("annotation").setAttribute("style", "font-size:0;")
}