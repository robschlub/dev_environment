function Lesson2Content(director) {
    "use strict";
    LessonContent.call(this, director);
    let diagram = this.diagram;
    let geometry = this.geometry;
    let actionWord = this.actionWord;
    let formatString = this.formatString;
    let equationDim = this.equationDim;
    let pulseNow = this.pulseNow;
    let onClickRotatePulse = this.onClickRotatePulse;
    let onClickRotate = this.onClickRotate;
    let onClickPulse = this.onClickPulse;
    
    let triangle = geometry._triangle;
    let shapes = geometry._shapes;
    let startLine = geometry._circle._startLine;
    let circle = geometry._circle;
    let stick = geometry._circle._stick;

    
    this.title = 'What is an Angle?';
    this.subTitle = 'And how do you measure it?';
    let _this = this;

    let text;
    text =  '<p>Many shapes have |_corners|.</p>' +
            '<p>The sharpness of the corner is a property that can describe a shape.</p>' +
            '';
    this.addPage({
        title: 'Corners',
        text: text,
        modifiers: {
            _corners: actionWord('corners', '_corners', 'L2_col_corners'),
        },
        state: function() {

            geometry.showOnly([ shapes, 
                                shapes['_square'], 
                                shapes['_octagon'], 
                                shapes['_pent'],
                                triangle, 
                                triangle['_line'],
                                ]);
            _this.hideAnnotation();
            document.getElementById("annotation").setAttribute("style", "font-size:0;")
            document.getElementById("_corners").onclick = geometry.toggleCorners.bind(geometry);
        },
        transitionNext: function(done) {
            geometry.showOnly([triangle, triangle['_line']]);
            triangle.animateTo(triangle.presetTransforms['onScreenCenter'], 0.7, 0, tools.easeinout,done)
        },
    });

    text =  '<p>Somes corners are |_more_sharp|, while others are |_less_sharp|.</p>' +
            '<p>So how can you measure sharpness?</p>' +
            '<p>What name do we give to the sharpness?</p>'+
            '';
    this.addPage({
        text: text,
        modifiers: {
            _more_sharp: actionWord('more sharp', '_more_sharp', 'L2_col_more_sharp'),
            _less_sharp: actionWord('less sharp', '_less_sharp', 'L2_col_less_sharp'),
        },
        state: function() {
            geometry.showOnly([triangle,triangle['_line']]);
            _this.hideAnnotation();
            document.getElementById("_more_sharp").onclick = triangle.toggleSharpCorners.bind(triangle);
            document.getElementById("_less_sharp").onclick = triangle.toggleLessSharpCorners.bind(triangle);
        },
        transitionNext: function(done) {
            startLine.show = true;
            geometry._circle.show = true;
            startLine.transform = startLine.presetTransforms['offScreen'].copy();
            triangle.animateTo(triangle.presetTransforms['offScreen'], 0.7);
            startLine.animateTo(startLine.presetTransforms['onScreenCenter'],0.7,0,tools.easeinout,done)
            stick.isMovable = false;
        },
        transitionPrev: function(done) {
            triangle.animateTo(triangle.presetTransforms['onScreenSmall'], 0.7, 0, tools.easeinout,done)
        }
    });

    text = '<p>Start with a line.</p>';
    this.addPage({
        title: 'Angle',
        text: text,
        state: function() {
            geometry.showOnly([geometry._circle, startLine]);
            _this.hideAnnotation();
            startLine.transform = startLine.presetTransforms['onScreenCenter'].copy();
            stick.isMovable = false;

            // state.resetAngle();
        },
        transitionPrev: function(done) {
            triangle.show = true;
            triangle._line.show = true;
            startLine.animateTo(startLine.presetTransforms['offScreen'],0.7);
            triangle.animateTo(triangle.presetTransforms['onScreenCenter'],0.7,0, tools.easeinout,done)
        },
        transitionNext: function(done) {
            // state.stick.setState(geo.point)
            // startLine.animateTo(startLine.presetTransforms['offScreen'],0.7,0,tools.easeinout,_this.finishTransNext.bind(_this));
            startLine.animateTo(startLine.presetTransforms['onScreen'],0.7,0,tools.easeinout,done);
            // _this.finishTransNext();
            // startLine.animateTo(startLine.presetTransforms['onScreen'],0.7,0, tools.easeinout,_this.finishTransNext.bind(_this));
            // state.startLine.animateOffsetTo(geo.point(0, 0), 0.7, _this.finishTransNext.bind(_this));
            // state.stick.hide = false;
        },
    });

    text =  '<p>Add a |_movable_line|.</p>' +
            '<p>|_Anchor| one end.</p>' +
            '<p>Rotate one line by |_pushing| the free end.</p>'+
            '';
    this.addPage({
        text:   text,
        modifiers: {
            _movable_line: actionWord('movable line', '_movable_line', 'L2_col_stick'),
            _Anchor:       actionWord('Anchor',       '_Anchor',       'L2_col_anchor'),
            _pushing:      actionWord('pushing',      '_pushing',      'L2_col_hint_arrow'),
        },
        state: function() {

            geometry.showOnly([circle, startLine, stick, circle._anchor, circle._hintArrow]);
            startLine.transform = startLine.presetTransforms['onScreen'].copy();
            geometry._circle._anchor.pulseNow();

            diagram.resetAngle();
            stick.isMovable = true;
            diagram.drawFullCircle = false;
            stick.isMovable = true;

            onClickPulse("_Anchor",circle._anchor);
            onClickPulse("_movable_line",stick);
            onClickRotate("_pushing", stick, Math.PI/4,0.8);
        },
        autoNext: function() {
            return stick.transform.rotation >= Math.PI * 2.0 / 90;
        },
        transitionNext: function(done) {
            stick.animateRotationTo(Math.PI / 4, 1,0.7,tools.easeinout, done);
        },
        transitionPrev: function(done) {
            geometry.showOnly([circle, startLine]);
            startLine.animateTo(startLine.presetTransforms['onScreenCenter'],0.7,0,tools.easeinout,done)
        },
    });

    text =  '<p>The two lines form a |_corner|.</p>' +
            '<p>|_Small_rotation| results in a sharp corner.</p>' +
            '<p>|_Large_rotation| results in a less sharp corner.</p>'+
            '';
    this.addPage({
        text:   text,
        modifiers: {
            _corner:         actionWord('corner',        '_corner',            'L2_col_corners'),
            _Small_rotation: actionWord('Small rotation','_Small_rotation',    'L2_col_more_sharp'),
            _Large_rotation: actionWord('Large rotation','_Large_rotation',    'L2_col_less_sharp'),
        },
        state: function() {
            geometry.showOnly([circle, startLine, stick, circle._anchor, circle._hintArrow,
                               circle._corner1, circle._corner2]);
            startLine.transform = startLine.presetTransforms['onScreen'].copy();

            geometry._circle._corner1.pulseNow();
            geometry._circle._corner2.pulseNow();
            document.getElementById("_corner").onclick = function() {
                geometry._circle._corner1.pulseNow();
                geometry._circle._corner2.pulseNow();
            }
            document.getElementById("_Small_rotation").onclick = function() {stick.animateRotationTo(Math.PI / 8, 0,1);}
            document.getElementById("_Large_rotation").onclick = function() {stick.animateRotationTo(7 * Math.PI / 8, 0, 1);}
        },
        transitionPrev: function(done) {
            if (stick.transform.rotation != 0) {
                stick.animateRotationTo(0, 0, 0.5, tools.easeinout, done);
            } else {
                done();
            }
        }
    });

    text =  '<p>So the amount of |_rotation| determines the sharpness of the |_corner|.</p>' +
            '<p>The Latin word for |_corner1| is |_angulus|.</p>' +
            '<p>Our word for <i>corner sharpness</i> comes from Latin and is |_angle|.</p>'+
            '';
    this.addPage({
        text:   text,
        modifiers: {
            _rotation:      actionWord('rotation', '_rotation',   'L2_col_arc'),
            _corner:        actionWord('corner',   '_corner',     'L2_col_corners'),
            _corner1:       actionWord('corner',   '_corner1',    'L2_col_corners'),
            _angulus:       actionWord('angulus',  '_angulus',    'L2_col_corners'),
            _angle:         actionWord('angle',    '_angle',      'L2_col_angle'),
        },
        state: function() {
            stick.isMovable = true;
            _this.showOnlyStickCornerRotation();
            circle._rotationAngle.setAngle(stick.transform.rotation);
            onClickPulse("_corner",[circle._corner1,circle._corner2]);
            onClickPulse("_corner1",[circle._corner1,circle._corner2]);
            onClickPulse("_angulus",[circle._corner1,circle._corner2]);
            onClickPulse("_angle",circle._rotationAngle._angleFill);
            onClickPulse("_rotation",[circle._rotationAngle._innerline,circle._rotationAngle._outerline, 
                                      circle._rotationAngle._arrow2, circle._rotationAngle._arrow1]);
        },
    });

    text=   'So how do we measure the sharpness, the amount of rotation, the |_angle|?' +
            '';
    this.addPage({
        title: 'Measuring an Angle',
        text:   text,
        modifiers: {
            _angle: actionWord('angle', '_angle', 'L2_col_angle'),
        },
        state: function() {
            stick.isMovable = true;
            geometry.showOnly([circle,
                startLine,
                stick,
                circle._anchor, 
                circle._hintArrow,
                circle._rotationAngle,
                circle._rotationAngle._angleFill,
            ]);
            startLine.transform = startLine.presetTransforms['onScreen'].copy();
            circle._rotationAngle.setAngle(stick.transform.rotation);
            onClickPulse('_angle',circle._rotationAngle._angleFill);
        },
    });

    text =  '<p>One way is to divide a circle up into portions, and count the number of portions in an |_angle|.</p>' +
            '<p>Here, a circle is divided into 12 equal portions (like a clock).</p>' +
            '';
    this.addPage({
        text:   text,
        modifiers: {
            _angle:             actionWord('angle',         '_angle',           'L2_col_angle'),
        },
        state: function() {
            stick.isMovable = true;
            geometry.showOnly([ circle,
                                circle._fullCircle,
                                circle._portions12,
                                startLine,
                                circle._anchor,
                                circle._hintArrow,
                                stick,
                                circle._rotationAngle,
                                circle._rotationAngle._angleFill]);
            circle._rotationAngle.setAngle(stick.transform.rotation);
            document.getElementById("annotation").setAttribute("style", "font-size:0;")
            _this.setupAnnotation(12, 'Angle', 'Portions', 1);
            onClickPulse('_angle',circle._rotationAngle._angleFill);
            onClickPulse("annotation-label-text",circle._rotationAngle._angleFill);
            // onClickPulse("_angle",geometry.angleFill);
        },
    });


    text =  '<p>Now, as you rotate the stick to change the |_angle|, you can count how many portions there are.</p>' +
            '<p>Try different portion sizes:' +
            '<ul>' +
                '<li>|_12_Portions| in a circle</li>' +
                '<li>|_100_Portions| in a circle</li>' +
            '</ul></p>';
    this.addPage({
        text:   text,
        modifiers: {
            _angle:             actionWord('angle',         '_angle',           'L2_col_angle'),
            _12_Portions:       actionWord('12 Portions',   '_12_Portions',     'L2_col_deselect'),
            _100_Portions:      actionWord('100 Portions',  '_100_Portions',    'L2_col_deselect'),
        },
        state: function() {
            stick.isMovable = true;
            _this.showOnlyStickAngle()
            circle._rotationAngle.show=true;
            circle._rotationAngle._line.show=true;
            circle._rotationAngle._portions12.show = true;
            circle._rotationAngle.setAngle(stick.transform.rotation);

            onClickPulse("_angle",circle._rotationAngle._angleFill);

            let portion12 = document.getElementById("_12_Portions");
            let portion100 = document.getElementById("_100_Portions")

            function portionEnable(portion, enable) {
                if(enable) {
                    if (portion.classList.contains("L2_col_deselect")) {
                        portion.classList.remove("L2_col_deselect");
                        portion.classList.add("L2_col_select");
                    } 
                }
                else {
                    if (portion.classList.contains("L2_col_select")) {
                        portion.classList.remove("L2_col_select");
                        portion.classList.add("L2_col_deselect");
                    }
                }
            }
            if (diagram.portions == 12) {
                portionEnable(portion12, true);
                portionEnable(portion100, false);
                circle._rotationAngle._portions12.show=true;
            } else {
                portionEnable(portion12, false);
                portionEnable(portion100, true);
                circle._rotationAngle._portions100.show=true;
            }
            portion12.onclick = function() {
                circle._rotationAngle._portions12.show=true;
                circle._rotationAngle._portions100.show=false;
                portionEnable(portion12, true);
                portionEnable(portion100, false);
                diagram.portions = 12;
                diagram.updateAnnotation();
            }
            portion100.onclick = function() {
                circle._rotationAngle._portions100.show=true;
                circle._rotationAngle._portions12.show=false;
                portionEnable(portion12, false);
                portionEnable(portion100, true);
                diagram.portions = 100;
                diagram.updateAnnotation();
            }
            _this.setupAnnotation(12, 'Angle', 'Portions', 1);
            onClickPulse("annotation-label-text",circle._rotationAngle._angleFill);
        },
    });

    text =  '<p>So how many portions should we split a circle into?</p>' +
            '<p>There are two common practices. The first is splitting the circle into |_360| portions.</p>' +
            '<p>Each portion is usually called a |_degree| and is represented by the symbol |_deg|. </p>' +
            '<p>The word |_degree| comes from |_Latin|:</p>' +
            '<ul> '+
                '<li>|_de|: |_down|</li>' +
                '<li>|_gradus|: |_step|</li>' +
            '</ul>'+
            '<p>So 360 degrees (360&deg;) is the same as saying there are 360 smaller steps or pieces of a circle.</p> ' +
            '',
    this.addPage({
        title: 'Degrees',
        text: text,
        modifiers: {
            _deg:          formatString('&deg;',      '',          'english'),
            _360:          formatString('360',        '',          'english'),
            _degree:       formatString('degree',     '',          'english'),
            _Latin:        formatString('Latin',      '',          'latin'),
            _de:           formatString('de',         '',          'latin'),
            _gradus:       formatString('gradus',     '',          'latin'),
            _down:         formatString('down',       '',          'translation'),
            _step:         formatString('step',       '',          'translation'),
        },
        state: function() {
            stick.isMovable = false;
            geometry.showOnly([ circle,
                                circle._fullCircle, 
                                circle._rotationAngle, 
                                circle._rotationAngle._portions36Fixed, 
                                circle._rotationAngle._portions360Fixed]);
            diagram.annotatingValue = false;
            document.getElementById("annotation").setAttribute("style", "font-size:0%;")
        },
    });

    text =  '<p>Why choose 360? </p>'+
            '<p>If you were defining it today, you could choose anything!</p>'+
            '<p>But the circle is a concept people have worked on and understood for thousands of years.</p>'+
            '  Earliest known possibilities of using 360 degrees in a circle is from ' +
            '  the Persian calendar of 360 days. The Babylonians also divided a circle up into 360 parts.</p>' +
            '';
    this.addPage({
        text: text,
        state: function() {
            stick.isMovable = true;
            _this.showOnlyStickAngle()
            
            circle._fullCircle.show=true;
            circle._rotationAngle._portions36Fixed.show=true;
            circle._rotationAngle._portions360Fixed.show=true;

            diagram.annotatingValue = false;
            _this.setupAnnotation(360, 'Angle', '&deg;', 0);
            onClickPulse("annotation-label-text",circle._rotationAngle._angleFill);
        },
    });

    text =  '<p>Why did they choose 360?</p> '+
            '<p>It\'s hard to say, but one reason might be 360 is an easy number to work with when you don\'t have a calculator.</p>' +
            '<p>360 has a lot of numbers that can divide into it without a remainder:</p>' +
            '<p>1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36, 40, 45, 60, 72, 90, 120, 180, 360.'+
            '<p>This means it\'s easy to work with portions of a circle.</p>' +
            '<ul>' +
                '<li>1/3 of a circle is 60&deg;</li>' +
                '<li>1/4 of a circle is 90&deg;</li>' +
                '<li>1/20 of a circle is 18&deg;</li>' +
                '<li>1/60 of a circle is 6&deg;</li>' +
            '</ul>'+
            '';
    this.addPage({
        text: text,
        state: function() {
            stick.isMovable = true;
            _this.showOnlyStickAngle()
            circle._fullCircle.show=true;
            circle._rotationAngle._portions36Fixed.show=true;
            circle._rotationAngle._portions360Fixed.show=true;

            diagram.annotatingValue = false;
            _this.setupAnnotation(360, 'Angle', '&deg;', 0);
            onClickPulse("annotation-label-text",circle._rotationAngle._angleFill);
        },
    }); 

    text =  '<p>What does measuring an |_angle| in degrees look like?</p>'+
            '';
    this.addPage({
        text: text,
        modifiers: {
            _angle:             actionWord('angle',         '_angle',           'L2_col_angle'),
        },
        state: function() {
            stick.isMovable = true;
            _this.showOnlyStickAngle();
            _this.showDegrees();
            circle._rotationAngle.setAngle(stick.transform.rotation);
            _this.setupAnnotation(360, 'Angle', '&deg;', 0);
            onClickPulse("_angle",circle._rotationAngle._angleFill);
            onClickPulse("annotation-label-text",circle._rotationAngle._angleFill);
        },
    }); 

    text =  '<p>The second common way to define an |_angle| is to |_relate| it to |_radius| and |_arc_length|.</p>' +
            '<p>If we relate these three properties, then we only need to know or measure two and then we can calculate the third.</p>' +
            '';
    this.addPage({
        title: 'Radians',
        text: text,
        modifiers: {
            _relate:   formatString('relate',    '',            'keyword'),
            _angle:      actionWord('angle',     '_angle',      'L2_col_angle'),
            _radius:     actionWord('radius',    '_radius',     'L2_col_stick'),
            _arc_length: actionWord('arc length','_arc_length', 'L2_col_arc'),
        },
        state: function() {
            stick.isMovable = true;
            _this.showOnlyStickArcAngle();
            circle._rotationAngle._innerarc.show=true;
            circle._rotationAngle._outerarc.show=true;
            onClickPulse("annotation-label-text",circle._rotationAngle._angleFill);

            onClickPulse("_angle",circle._rotationAngle._angleFill);
            onClickPulse("_radius",stick);
            onClickPulse("_arc_length",[circle._rotationAngle._arc,
                                        circle._rotationAngle._innerarc,
                                        circle._rotationAngle._outerarc]);
            document.getElementById("annotation").setAttribute("style", "font-size:0%;")
        },
    }); 

    text =  '' +
            '<p>Rotate the stick, till the |_arc_length| is the |_same| as the stick length (|_radius|).</p>' +
            '<p>|_Compare| the |_arc_length1| to the |_radius1| length at different angles.<p>' +
            '<p>We can define the angle as how many radius lengths the arc length is.</p>' +
            '';
    this.addPage({
        text: text,
        modifiers: {
            _same:        actionWord('same',        '_same',        'L2_col_rotate'),
            _radius:      actionWord('radius',      '_radius',      'L2_col_stick'),
            _radius1:     actionWord('radius',      '_radius1',     'L2_col_stick'),
            _arc_length:  actionWord('arc length',  '_arc_length',  'L2_col_arc'),
            _arc_length1: actionWord('arc length',  '_arc_length1', 'L2_col_arc'),
            _Compare:     actionWord('Compare',     '_Compare',     'L2_col_compare'),
        },
        state: function() {
            _this.showOnlyStickArcAngle();
            stick.isMovable = true;
            circle._rotationAngle._portionsRad.show = true;
            circle._rotationAngle._straightCircle.show = true;
            circle._rotationAngle._arcLine.show = true;
            _this.setupAnnotation(Math.PI * 2, 'Angle', 'Radius Lengths', 2);
            onClickPulse("annotation-label-text",circle._rotationAngle._angleFill);
            onClickPulse("_radius", stick);
            onClickPulse("_radius1", stick);
            onClickPulse("_arc_length", [circle._rotationAngle._arc,
                                         circle._rotationAngle._innerarc,
                                         circle._rotationAngle._outerarc]);
            onClickPulse("_arc_length1", [circle._rotationAngle._arc,
                                         circle._rotationAngle._innerarc,
                                         circle._rotationAngle._outerarc]);
            onClickRotate('_same', circle._stick, 1, 0.8,0, _this.stopAnimatingComparison.bind(_this));

            document.getElementById("_Compare").onclick = function() {
                let compStick = circle._comparisonStick;
                let straightCircle = circle._rotationAngle._straightCircle;
                let arcLine = circle._rotationAngle._arcLine;
                stick.stopAnimating();
                stick.isMovable = false;
                
                compStick.show = true;
                stick.color = [0, 0, 1, 0.25];
                circle._rotationAngle._arc.color = [1, 0, 0, 0.25];
                circle._rotationAngle._innerarc.color = tools.copy(circle._rotationAngle._arc.color);
                circle._rotationAngle._outerarc.color = tools.copy(circle._rotationAngle._arc.color);
                compStick.transform = stick.transform.copy();
                // compStick.transform.rotation *= -1;
                compStick.animatePlan([ tools.animationPhase(tools.Transform(d2.point(circle._stickLength * 1.1, 0),Math.PI / 2, d2.point(1,1)), 0.8),
                                        tools.animationPhase(tools.Transform(d2.point(circle._stickLength * 1.1, 0),Math.PI / 2, d2.point(1,1)), 2.4),
                                        tools.animationPhase(circle._stick.transform.copy(), 0.8)],
                // compStick.animateSeries([compStick.animOffRotPhase(d2.point(geometry.stickLength * 1.1, 0), -Math.PI / 2, 0.8),
                //         compStick.animOffRotPhase(d2.point(geometry.stickLength * 1.1, 0), -Math.PI / 2, 2.4),
                //         compStick.animOffRotPhase(state.stick.current.offset, state.stick.current.rotation * -1, 0.8)
                    // ],
                    function() {
                        // circle._rotationAngle._innerarc.color = tools.copy(circle._rotationAngle._arc.color);
                        // circle._rotationAngle._outerarc.color = tools.copy(circle._rotationAngle._arc.color);
                        stick.isMovable = true;
                        stick.color = [0, 0, 1, 1];
                        compStick.show = false;
                        circle._rotationAngle._arcLine.pointsToDraw = 0;
                        circle._rotationAngle._arc.color = [1, 0, 0, 1];
                        circle._rotationAngle._innerarc.color = tools.copy(circle._rotationAngle._arc.color);
                        circle._rotationAngle._outerarc.color = tools.copy(circle._rotationAngle._arc.color);
                    });
                circle._rotationAngle._straightCircle.pulseNow();
            }
        },
        transitionNext: function(done) {
            _this.stopAnimatingComparison();
            done()
        },
        transitionPrev: function(done) {
            _this.stopAnimatingComparison();
            done()
        },
        transitionSkipTo: function(toIndex, done) {
            _this.stopAnimatingComparison();
            done(toIndex);
        }
    });

    text =  '' +
            '<p>The |_angle| formed when |_arc_length| equals |_radius_length| is called a |_radian|.</p>' +
            '<p>The word radian comes from the word radius.</p>' +
            '<p>Increasing the angle by 1 radian, increases the arc length by a radius length.</p>' +
            '<p>So, if you have an angle of |_2_radians|, and the radius is 1 meter, then the arc length will be 2 meters.</p>' +
            '<p>In other words:</p>' +
            '   <dim id="inline_equation"></dim>' +
            '<p>Note, you can only use this equation when the angle is in radians! It does not work if the angle is measured in degrees.</p>' +
            '';
    this.addPage({
        text: text,
        modifiers: {
            _radian:         actionWord('radian',        '_radian',        'L2_col_rotate'),
            _2_radians:      actionWord('2 radians',     '_2_radians',     'L2_col_rotate'),
            _radius_length:  actionWord('radius length', '_radius_length', 'L2_col_stick'),
            _arc_length:     actionWord('arc length',    '_arc_length',    'L2_col_arc'),
            _angle:          actionWord('angle',         '_angle',         'L2_col_angle'),
        },
        state: function() {
            _this.showOnlyStickArcAngle();
            stick.isMovable = true;
            _this.showRadians();
            _this.setupAnnotation(Math.PI * 2, 'Angle', 'radians', 2);
            onClickPulse('_radius_length', stick);
            onClickPulse('_arc_length', [circle._rotationAngle._arc,
                                         circle._rotationAngle._innerarc,
                                         circle._rotationAngle._outerarc]);
            onClickPulse('_angle', circle._rotationAngle._angleFill);
            onClickRotate('_radian', stick, 1, 0.8);
            onClickRotate('_2_radians', stick, 2, 0.8);

            let equation =
                equ.elem(equ.text("arc length", "a1", "action_word L2_col_arc")) +
                equ.elem(equ.text("=")) +
                equ.elem(equ.text("angle", "a2", "action_word L2_col_angle")) +
                equ.elem(equ.text("x")) +
                equ.elem(equ.text("radius", "a3", "action_word L2_col_stick"));
            document.getElementById("inline_equation").innerHTML = equation;

            onClickPulse('a3', stick);
            onClickPulse('a1', [circle._rotationAngle._arc,
                                         circle._rotationAngle._innerarc,
                                         circle._rotationAngle._outerarc]);
            onClickPulse('a2', circle._rotationAngle._angleFill);
            onClickPulse("annotation-label-text",circle._rotationAngle._angleFill);
        },
    });


    text =  '<p>How many radians are there in a half circle and full circle?</p>' +
            '<p>A |_half_circle| has 3.14 radians.</p>' +
            '<p>A |_full_circle| has 6.28 radians.</p>' +
            '<p>We will often say there are 3.14 radians in a circle. But this is an approximation.</p>'+
            '<p>A more accurate approximation is 3.141592653589793.</p>'+
            '';
    this.addPage({
        text: text,
        modifiers: {
            _half_circle: actionWord('half circle', '_half_circle', 'L2_col_rotate'),
            _full_circle: actionWord('full circle', '_full_circle', 'L2_col_rotate'),
        },
        state: function() {
            circle._stick.isMovable = true;
            _this.showOnlyStickArcAngle();
            _this.showRadians();
            _this.setupAnnotation(Math.PI * 2, 'Angle', 'radians', 2);
            onClickRotate('_half_circle', circle._stick, Math.PI, 0.8);
            onClickRotate('_full_circle', circle._stick, Math.PI * 2 * 0.9999, 0.8, 1);
            onClickPulse("annotation-label-text",circle._rotationAngle._angleFill);
        },
    });

    text =  '<p>At first glance, splitting a circle up into 6.28 slices isn\'t as convenient as splitting it up into 360 slices.</p>'+
            '<p>A radian is a big slice, and there are plenty of applications that will require a portion of a radian.</p>'+
            '<p>For example, if you want to use a quarter circle, instead of a simple calculation in degrees:</p>'+
            '<p>360/4 = 90</p>'+
            '<p>you need to whip out the calculator for radians:</p>'+
            '<p>6.28/4 = 1.57.</p>'+
            '<p>Also, a radian doesn\'t even go into a circle without a remainder. 6 radians go into a circle, but we are left with 0.28 radians remaining.</p>'+
            '';
    this.addPage({
        text: text,
        modifiers: {
            _value: formatString('value', '_value', 'keyword'),
        },
        state: function() {
            stick.isMovable = true;
            _this.showOnlyStickArcAngle();
            _this.showRadians();
            _this.setupAnnotation(Math.PI * 2, 'Angle', 'radians', 2);
            onClickPulse("annotation-label-text",circle._rotationAngle._angleFill);
        },
    });

    text =  '<p>But, because we |_related| the |_angle| unit to the |_radius| and |_arc_length|, we only need two ' +
                'of the properties to find the third - which is very very powerful. So powerful, that people deal '+
                'with this weird angular size because the advantages outweigh the disadvantages.</p>'+
            '<p>One way they deal with it, is instead of writing out the approximate value 3.14159... each time, '+
                'they just substite the value with the greek letter |_pi|.</p>'+
            '<p>So instead of saying there are 3.14159 radians in a half circle, you can simply say there are |_pi_radians|.</p>'+
            '<p>Instead of saying there are 6.2832 radians in a circle, you say there are |_2pi_radians|.</p>'+
            '';
    this.addPage({
        title: '&pi;',
        text: text,
        modifiers: {
            _pi:          actionWord('&pi;',           '_pi',         'L2_col_rotate'),
            _pi_radians:  actionWord('&pi; radians;',   '_pi_radians', 'L2_col_rotate'),
            _2pi_radians:  actionWord('2&pi; radians;', '_2pi_radians','L2_col_rotate'),
            _related:   formatString('related',        '',            'keyword'),
            _angle:       actionWord('angle',          '_angle',      'L2_col_angle'),
            _radius:      actionWord('radius',         '_radius',     'L2_col_stick'),
            _arc_length:  actionWord('arc length',     '_arc_length', 'L2_col_arc'),
        },
        state: function() {
            circle._stick.isMovable = true;
            _this.showOnlyStickArcAngle();
            _this.showRadians();
            _this.setupAnnotation(Math.PI * 2, 'Angle', 'radians', 2);
            onClickPulse("_angle",circle._rotationAngle._angleFill);
            onClickPulse("_radius",stick);
            onClickPulse("_arc_length",[circle._rotationAngle._arc,
                                         circle._rotationAngle._innerarc,
                                         circle._rotationAngle._outerarc]);
            onClickRotate("_pi",stick, Math.PI, 0.8, 0);
            onClickRotate("_pi_radians",stick, Math.PI, 0.8, 0);
            onClickRotate("_2pi_radians",stick, Math.PI*2*0.9999, 0.8, 1);
            onClickPulse("annotation-label-text",circle._rotationAngle._angleFill);
        },
    });

    text =  '<p>Let\'s use what we\'ve learned about radians to calculate the |_circumference| of any circle that we know the radius of.</p>' +
            '<p>When using radians, angle and radius is related to arc length by:</p>' +
            '   <dim id="inline_equation1"></dim>' +
            '<p>Now, a complete circle has an angle of 6.28, or 2&pi; radians.</p>' +
            '<p>Therefore, we can calculate the circumference of any circle just by knowing the radius:<p>'+
            '   <dim id="inline_equation2"></dim>' +
            '';
    this.addPage({
        text: text,
        modifiers: {
            _circumference:  actionWord('circumference',   '_circumference', 'L2_col_arc'),
        },
        state: function() {
            circle._stick.isMovable = true;
            _this.showOnlyStickArcAngle();
            _this.showRadians();
            _this.setupAnnotation(Math.PI * 2, 'Angle', 'radians', 2);

            let equation1 =
                equ.elem(equ.text("arc length", "e1_arc", "action_word L2_col_arc")) +
                equ.elem(equ.text("=")) +
                equ.elem(equ.text("angle", "e1_angle", "action_word L2_col_angle")) +
                equ.elem(equ.text("x")) +
                equ.elem(equ.text("radius", "e1_radius", "action_word L2_col_stick"));
            document.getElementById("inline_equation1").innerHTML = equation1;
            let equation2 =
                equ.elem(equ.text("circumference", "e2_circ", "action_word L2_col_arc")) +
                equ.elem(equ.text("=")) +
                equ.elem(equ.text("2&pi;", "e2_2pi", "action_word L2_col_angle")) +
                equ.elem(equ.text("x")) +
                equ.elem(equ.text("radius", "e2_radius", "action_word L2_col_stick"));
            document.getElementById("inline_equation2").innerHTML = equation2;

            onClickPulse('e1_radius', circle._stick);
            onClickPulse('e1_arc', [circle._rotationAngle._arc,
                                         circle._rotationAngle._innerarc,
                                         circle._rotationAngle._outerarc]);
            onClickPulse('e1_angle', circle._rotationAngle._angleFill);
            onClickPulse('e2_radius', circle._stick);
            onClickRotatePulse.call(_this,'e2_circ', circle._stick, [circle._rotationAngle._arc,
                                         circle._rotationAngle._innerarc,
                                         circle._rotationAngle._outerarc], Math.PI*2*0.9999,0.8,1);
            onClickRotatePulse.call(_this,'e2_2pi', circle._stick, circle._rotationAngle._angleFill, Math.PI*2*0.9999,0.8,1);
            onClickRotatePulse.call(_this,'_circumference', circle._stick, [circle._rotationAngle._arc,
                                         circle._rotationAngle._innerarc,
                                         circle._rotationAngle._outerarc], Math.PI*2*0.9999,0.8,1);
            onClickPulse("annotation-label-text",circle._rotationAngle._angleFill);
        },
    });

    text =  '<p>Some important angles are:</p>' +
            '<table class="L2_angle_list_table">' +
            '<tr> <td>|_full_circle|     </td>  <td>|_360|</td>  <td>|_2pi|  </td> </tr>'+ 
            '<tr> <td>|_three_quarter|   </td>  <td>|_270|</td>  <td>|_3pi_2|</td> </tr>'+
            '<tr> <td>|_half_circle|     </td>  <td>|_180|</td>  <td>|_pi|   </td> </tr>'+
            '<tr> <td>|_quarter_circle|  </td>  <td>|_90|</td>   <td>|_pi_2| </td> </tr>'+
            '<tr> <td>|_third_half|      </td>  <td>|_60|</td>   <td>|_pi_3| </td> </tr>'+
            '<tr> <td>|_sixth_half|      </td>  <td>|_30|</td>   <td>|_pi_6| </td> </tr>'+
            '</table>'+
            '',
    this.addPage({
        title: 'Common Angles',
        text: text,
        modifiers: {
            _full_circle:   formatString('Full Circle:',          '_full_circle',     'L2_angle_list_description'),
            _three_quarter: formatString('Three Quarter Circle:', '_three_quarter',   'L2_angle_list_description'),
            _half_circle:   formatString('Half Circle:',          '_half_circle',     'L2_angle_list_description'),
            _quarter_circle:formatString('Quarter Circle:',       '_quarter_circle',  'L2_angle_list_description'),
            _third_half:    formatString('Third of Half Circle:', '_third_half',      'L2_angle_list_description'),
            _sixth_half:    formatString('Sixth of Half Circle:', '_sixth_half',      'L2_angle_list_description'),
            _360:           actionWord('360&deg;',                '_360',             'L2_col_rotate L2_angle_list_degrees'),
            _270:           actionWord('270&deg;',                '_270',             'L2_col_rotate L2_angle_list_degrees'),
            _180:           actionWord('180&deg;',                '_180',             'L2_col_rotate L2_angle_list_degrees'),
            _90:            actionWord('90&deg;',                 '_90',              'L2_col_rotate L2_angle_list_degrees'),
            _60:            actionWord('60&deg;',                 '_60',              'L2_col_rotate L2_angle_list_degrees'),
            _30:            actionWord('30&deg;',                 '_30',              'L2_col_rotate L2_angle_list_degrees'),
            _2pi:           equationDim(                          '_2pi',             'L2_col_rotate l2_angle_list_radians action_word'),
            _3pi_2:         equationDim(                          '_3pi_2',           'L2_col_rotate l2_angle_list_radians action_word'),
            _pi:            equationDim(                          '_pi',              'L2_col_rotate l2_angle_list_radians action_word'),
            _pi_2:          equationDim(                          '_pi_2',            'L2_col_rotate l2_angle_list_radians action_word'),
            _pi_3:          equationDim(                          '_pi_3',            'L2_col_rotate l2_angle_list_radians action_word'),
            _pi_6:          equationDim(                          '_pi_6',            'L2_col_rotate l2_angle_list_radians action_word'),
        },
        state: function() {
            _this.showOnlyStickAngle();
            stick.isMovable = true;
            _this.showDegrees();
            _this.setupAnnotation(360, 'Angle', '&deg;', 0);
            onClickPulse("annotation-label-text",circle._rotationAngle._angleFill);
            document.getElementById("_2pi").innerHTML   = equ.elem(equ.text('2&pi;'));
            document.getElementById("_3pi_2").innerHTML = equ.frac(equ.text('3&pi;'),equ.text('2'));
            document.getElementById("_pi").innerHTML    = equ.elem(equ.text('&pi;'));
            document.getElementById("_pi_2").innerHTML  = equ.frac(equ.text('&pi;'),equ.text('2'));
            document.getElementById("_pi_3").innerHTML  = equ.frac(equ.text('&pi;'),equ.text('3'));
            document.getElementById("_pi_6").innerHTML  = equ.frac(equ.text('&pi;'),equ.text('6'));

            _this.onClickRotateWithUnits('_360',   stick, Math.PI*2*0.9999, 0.8, 1, 360);
            _this.onClickRotateWithUnits('_2pi',   stick, Math.PI*2*0.9999, 0.8, 1, Math.PI*2);
            _this.onClickRotateWithUnits('_270',   stick, 3*Math.PI/2,      0.8, 1, 360);
            _this.onClickRotateWithUnits('_3pi_2', stick, 3*Math.PI/2,      0.8, 1, Math.PI*2);
            _this.onClickRotateWithUnits('_180',   stick,   Math.PI,        0.8, 0, 360);
            _this.onClickRotateWithUnits('_pi',    stick,   Math.PI,        0.8, 0, Math.PI*2);
            _this.onClickRotateWithUnits('_90',    stick,   Math.PI/2,      0.8, 0, 360);
            _this.onClickRotateWithUnits('_pi_2',  stick,   Math.PI/2,      0.8, 0, Math.PI*2);
            _this.onClickRotateWithUnits('_60',    stick,   Math.PI/3,      0.8, 0, 360);
            _this.onClickRotateWithUnits('_pi_3',  stick,   Math.PI/3,      0.8, 0, Math.PI*2);
            _this.onClickRotateWithUnits('_30',    stick,   Math.PI/6,      0.8, 0, 360);
            _this.onClickRotateWithUnits('_pi_6',  stick,   Math.PI/6,      0.8, 0, Math.PI*2);
        },
    });

    text =  '<p>The sharpness of the |_corner| formed by two |_lines| is the |_angle|.</p>'+
            '<p>There are 2 common ways to measure angle.</p>' +
            '<ul>'+
                '<li>|_degrees| - useful when using angle values</li>'+
                '<li>|_radians| - useful for relating |_radius| and |_arc_length|</li>'+
            '</ul>'+
            '<p>There are 360 degrees in a full circle.</p>' +
            '<p>There are 2&pi; radians in a full circle.</p>' +
            '<p>The arc of one radian has a length equal to the radius.</p>' +
            '',
    this.addPage({
        title: 'Summary',
        text: text,
        modifiers: {
            _angle:        actionWord('angle',          '_angle',      'L2_col_angle'),
            _degrees:      actionWord('degrees',        '_degrees',    'L2_col_degrees'),
            _radians:      actionWord('radians',        '_radians',    'L2_col_radians'),
            _arc_length:   actionWord('arc length',     '_arc_length', 'L2_col_arc'),
            _lines:        actionWord('lines',          '_lines',      'L2_col_stick'),
            _corner:       actionWord('corner',         '_corner',     'L2_col_corners'),
            _radius:       actionWord('radius',         '_radius',     'L2_col_stick'),
            _arc_length:   actionWord('arc length',     '_arc_length', 'L2_col_arc'),
        },
        state: function() {
            stick.isMovable = true;
            _this.showOnlyStickAngle();
            // showRadians();
            onClickPulse("annotation-label-text",circle._rotationAngle._angleFill);
            _this.setupAnnotation(Math.PI * 2, 'Angle', 'radians', 2);
            document.getElementById("_lines").onclick = function () {
                stick.pulseNow();
                _this.geometry._circle._startLine.pulseNow();
            }
            onClickPulse("_arc_length",[circle._rotationAngle._arc,
                                         circle._rotationAngle._innerarc,
                                         circle._rotationAngle._outerarc]);
            onClickPulse("_arc_length",[circle._rotationAngle._arc,
                                         circle._rotationAngle._innerarc,
                                         circle._rotationAngle._outerarc]);
            onClickPulse("_angle",circle._rotationAngle._angleFill);
            
            document.getElementById("_corner").onclick = function() {
                geometry._circle._corner1.pulseNow();
                geometry._circle._corner2.pulseNow();
            }
            document.getElementById("_corner").onclick = function () {
                geometry._circle._corner1.show = !geometry._circle._corner1.show;
                geometry._circle._corner2.show = !geometry._circle._corner2.show;
                geometry._circle._corner1.pulseNow();
                geometry._circle._corner2.pulseNow();
            }
            onClickPulse("_radius",stick);
            onClickPulse("_arc_length",[circle._rotationAngle._arc,
                                         circle._rotationAngle._innerarc,
                                         circle._rotationAngle._outerarc]);
            document.getElementById("_arc_length").onclick = function () {
                circle._rotationAngle._arc.show = !circle._rotationAngle._arc.show;
                circle._rotationAngle._innerarc.show = !circle._rotationAngle._innerarc.show;
                circle._rotationAngle._outerarc.show = !circle._rotationAngle._outerarc.show;
                circle._rotationAngle._arc.pulseNow();
                circle._rotationAngle._innerarc.pulseNow();
                circle._rotationAngle._outerarc.pulseNow();
            }
            document.getElementById("_radians").onclick = function () {
                circle._rotationAngle._portionsRad.show = !circle._rotationAngle._portionsRad.show;
                circle._rotationAngle._portions36.show = false;
                circle._rotationAngle._portions360.show = false;
                _this.setupAnnotation(Math.PI * 2, 'Angle', 'radians', 2);
            }
            document.getElementById("_degrees").onclick = function () {
                circle._rotationAngle._portionsRad.show = false;
                circle._rotationAngle._portions36.show = !circle._rotationAngle._portions36.show;
                circle._rotationAngle._portions360.show = !circle._rotationAngle._portions360.show;
                _this.setupAnnotation(360, 'Angle', 'degrees', 0);
            }
        },
    });

};
Lesson2Content.prototype = Object.create(LessonContent.prototype)

// Lesson2Content.prototype.toggle_circle_fraction = function(fraction, direction) {
//     this.diagram.stick.animateRotationTo(Math.PI * 2 / fraction, 0.7, direction);
// }

Lesson2Content.prototype.showOnlyStickArcAngle = function() {
    let circle = this.geometry._circle;
    this.geometry.showOnly([ circle,
                        circle._anchor,
                        circle._hintArrow,
                        circle._stick,
                        circle._rotationAngle._arc,
                        circle._rotationAngle._innerarc,
                        circle._rotationAngle._outerarc,
                        circle._rotationAngle,
                        circle._rotationAngle._angleFill,
                        circle._startLine,
        ]);
    circle._startLine.transform = circle._startLine.presetTransforms['onScreen'].copy();
    circle._rotationAngle.setAngle(circle._stick.transform.rotation);
}

Lesson2Content.prototype.showOnlyStickCornerRotation = function() {
    let circle = this.geometry._circle;
    this.geometry.showOnly([
                circle,
                circle._anchor,
                circle._hintArrow,
                circle._stick,
                circle._corner1,
                circle._corner2,
                circle._rotationAngle,
                circle._rotationAngle._line,
                circle._rotationAngle._innerline,
                circle._rotationAngle._outerline,
                circle._rotationAngle._arrow1,
                circle._rotationAngle._arrow2,
                circle._rotationAngle._angleFill,
                circle._startLine,
            ]);
    circle._startLine.transform = circle._startLine.presetTransforms['onScreen'].copy();
    circle._rotationAngle.setAngle(circle._stick.transform.rotation);
}

Lesson2Content.prototype.showOnlyStickAngle = function() {
    let circle = this.geometry._circle;
    this.geometry.showOnly([
                circle,
                circle._anchor,
                circle._hintArrow,
                circle._stick,
                circle._rotationAngle,
                circle._rotationAngle._angleFill,
                circle._startLine,
            ]);
    circle._startLine.transform = circle._startLine.presetTransforms['onScreen'].copy();
    circle._rotationAngle.setAngle(circle._stick.transform.rotation);
}
Lesson2Content.prototype.showDegrees = function() {
    let circle = this.geometry._circle;
    circle.show = true;
    circle._rotationAngle.show = true;
    circle._rotationAngle._portions36.show = true;
    circle._rotationAngle._portions360.show = true;
}
Lesson2Content.prototype.showRadians = function() {
    let circle = this.geometry._circle;
    circle.show = true;
    circle._rotationAngle.show = true;
    circle._rotationAngle._portionsRad.show = true;
}

Lesson2Content.prototype.stopAnimatingComparison = function() {
    let circle = this.geometry._circle;
    circle._comparisonStick.stopAnimating();
    circle._rotationAngle._straightCircle.pulse.pulsing = false;
}

Lesson2Content.prototype.hideAnnotation = function() {
    document.getElementById("annotation").setAttribute("style", "font-size:0;")
}

Lesson2Content.prototype.setupAnnotation = function(portions, label, units, precision) {
    document.getElementById("annotation-label-text").innerHTML = label;
    document.getElementById("annotation").setAttribute("style", "font-size:120%;")
    document.getElementById("annotation-angle-units").innerHTML = units;
    this.diagram.annotatingValue = true;
    this.diagram.portions = portions;
    this.diagram.anglePrecision = precision;
    this.diagram.updateAnnotation();
}

Lesson2Content.prototype.onClickRotateWithUnits = function(id, geometryObj, angle, time, direction, units, preFunc = false) {
    let geometry_ref = this.geometry;
    let circle = this.geometry._circle;
    let _this = this;
    document.getElementById(id).onclick = function() {
        if(preFunc)
            preFunc();
        geometryObj.animateRotationTo(angle, direction, time);
        let units_text = "&deg;";
        let units_precision = 0;
        if (units < Math.PI*2.1){
            units_text = "radians";   
            units_precision = 2; 
            circle._rotationAngle._portionsRad.show = true;
            circle._rotationAngle._portions36.show = false;
            circle._rotationAngle._portions360.show = false;
        }
        else {
            circle._rotationAngle._portionsRad.show = false;
            circle._rotationAngle._portions36.show = true;
            circle._rotationAngle._portions360.show = true;
        }
        _this.setupAnnotation(units, 'Angle', units_text, units_precision);
    }
}