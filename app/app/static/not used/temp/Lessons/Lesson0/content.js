function Lesson1Content(director){
  "use strict";
  let _this = director;
  return [
    {
      text:'<p>The definition, standardization and calculation of shapes '+
           'helps us understand and change the world around us.</p>' +
           '<p>To use a shape, you need to be able to communicate it (draw, describe) and/or calculate it.</p>' +
           '<p>To do these things, you\'ve got to define it. Give it a name. Then you\'ve got to quantify it '+
           '- identify some properties that describe it. Often those properties can be related or dependent '+
           'on one and other.</p>',
      state: function(){
        _this.toggleCanvas(false);
        _this.lesson.state.moveable = false;
      },
      autoNext: function() {},
      autoPrev: function() {},
      transitionNext: function() {_this.finishTransNext()},
      transitionPrev: function() {_this.finishTransPrev()},
    },
		{
			text:'<p>Start with a <span class="Lesson1_stick">stick</span> or straight line.</p>',
		 	state: function(){
        _this.toggleCanvas(true);
		 		_this.lesson.geometry.hintArrow.hide=true;
		 		_this.lesson.geometry.anchor.hide = true;
		 		_this.lesson.state.resetAngle();
		 		_this.lesson.state.moveable = false;
        _this.lesson.state.drawFullCircle=false

		 		},
      autoNext: function() {},
      autoPrev: function() {},
      transitionNext: function() {_this.finishTransNext()},
      transitionPrev: function() {_this.finishTransPrev()},
		},

		{
			text: '<p><span class="Lesson1_anchor">Anchor</span> one end '+
            'and then <span class="Lesson1_hintArrow">push</span> the free end.</p>',
			state: function() {
        _this.lesson.geometry.pulseAnchor();
				_this.lesson.geometry.anchor.hide = false;
				_this.lesson.geometry.hintArrow.hide=false;
				_this.lesson.state.moveable = true;
        _this.lesson.state.resetAngle();
        _this.lesson.state.drawFullCircle=false;
      },
      autoNext: function() {
        return _this.lesson.state.currentAngle >= Math.PI*2.0/360;
      },
      autoPrev: function() {},
      transitionNext: function() {
                            _this.lesson.state.animateGoToAngle(45*Math.PI/180,1,1.0, _this.finishTransNext.bind(_this));
                            },
      transitionPrev: function() {_this.finishTransPrev()},
		},

		{
			text: '<p>Trace where the free end travels.</p><p>A complete '+
            'rotation forms a <span class="Lesson1_circle">shape</span>.</p>',
			state:   function() {
        _this.lesson.state.drawFullCircle=false;


      },
      autoNext: function() {
          return _this.lesson.state.drawFullCircle;
      },
      autoPrev: function() {
        return _this.lesson.state.currentAngle < Math.PI*2.0/360 && !_this.lesson.state.drawFullCircle;
      },
      transitionNext: function() {
        if (!_this.lesson.state.drawFullCircle) {
          if(_this.lesson.state.currentAngle > 0){
            _this.lesson.state.animateGoToAngle(0*Math.PI/180,1,1.0, _this.finishTransNext.bind(_this));
          }
          else {
            _this.finishTransNext()
          }
        }
      },
      transitionPrev: function() {
                              _this.lesson.state.animateGoToAngle(0*Math.PI/180,-1,1.0, _this.finishTransPrev.bind(_this));
                            },
		},

		{
			text: '<p>When the ancient greeks first named this shape, they named it after a familiar object that '+
            'looked the same. They called it a <span class="Lesson1_circle_alt">Kirkos</span> which meant <i>ring</i>.</p>' +
            '<p>Later, when this shape was described in Latin, it was also called a ring. In Latin, the word ' +
            'for <i>ring</i> is <span class="Lesson1_circle_alt">Circulus</span>.</p>' +
            '<p>The word we use today is <span class="Lesson1_circle">circle</span>. If we were naming it for the '+
            'first time today, we may have called it a <span class="Lesson1_circle_alt">ring</span></p>',
			state:   function() {
        _this.lesson.state.drawFullCircle=true;

      },
      autoNext: function() {},
      autoPrev: function() {},
      transitionNext: function() {_this.finishTransNext()},
      transitionPrev: function() {
        if (_this.lesson.state.currentAngle == 0) {
          _this.lesson.state.setCurrentAngle(359*Math.PI/180);
          _this.lesson.state.drawFullCircle=false;
          _this.lesson.state.animateGoToAngle(45*Math.PI/180,-1,1.0, _this.finishTransPrev.bind(_this));
        }
        else{
          _this.finishTransPrev()
        }
      },
		},
    {
      text: '<p>Now we have named the shape we can name some properties which will ' +
            'help to describe its size.<p>' +
            '<p>If the stick were longer, the circle would be larger. Therefore, one property ' +
            'of the circle is this <span class="Lesson1_stick_alt">stick</span> length.</p>' + 
            '<p>In Latin, the word <span class="Lesson1_stick_alt">radius</span> was used. This was ' +
            'the word for a <span class="Lesson1_stick_alt">spoke</span> on a chariot wheel.</p>' +
            '<p>We also use the word <span class="Lesson1_stick">radius</span>.</p>',
      state:   function() {},
      autoNext: function() {},
      autoPrev: function() {},
      transitionNext: function() {_this.finishTransNext()},
      transitionPrev: function() {_this.finishTransPrev()},
    },
    {
      text: '<p>Another property, is the length of the <span class="Lesson1_circle_alt">trace</span> '+
            'or <span class="Lesson1_circle_alt">boundary</span>.</p>' +
            '<p>In Latin, the word <span class="Lesson1_circle_alt">circumferentia</span> '+
            'was used, which is formed from the words <i>circum</i> (around) and <i>ferre</i> (carry). ' +
            'It was essentially named a <span class="Lesson1_circle_alt">carry around</span>.</p>' +
            '<p>Today, we use a word very similar to the Latin word. We call it the ' +
            '<span class="Lesson1_circle">circumference</span>.</p>',
      state:   function() {},
      autoNext: function() {},
      autoPrev: function() {},
      transitionNext: function() {_this.finishTransNext()},
      transitionPrev: function() {_this.finishTransPrev()},
    },
    {
      text: '<p>And so we have named a <span class="Lesson1_circle">circle</span>, and two properties, ' +
            'the <span class="Lesson1_stick">radius</span> and ' + 
            '<span class="Lesson1_circle">circumference</span>.</p>' + 
            '<p>If we were to name these today, we might have called the shape a ' + 
            '<span class="Lesson1_circle">ring</span> with properties <span class="Lesson1_stick">spoke</span> ' + 
            'and <span class="Lesson1_circle">carryaround</span>!</p>',
      state:   function() {
        _this.toggleCanvas(true);
        _this.lesson.state.moveable = true;
      },
      autoNext: function() {},
      autoPrev: function() {},
      transitionNext: function() {_this.finishTransNext()},
      transitionPrev: function() {_this.finishTransPrev()},
    },
        {
      text: '<p>Properties help us describe the size of the shape.</p> ' +
            '<p>Properties can also be powerful if we can find relationships between them.</p>' +
            // '<p>If we can calculate one property from another, then we need to only measure one.' + 
            '<p>For example, measuring the radius is simple with a ruler, but how can you measure ' +
            'the curved circumference?</p>' +
            '<p>If you know the relationship between the radius and circumference, ' +
            'you can simply calculate one from the other.',

      state:   function() { 
        _this.toggleCanvas(false);
        _this.lesson.state.moveable = false;
        },
      autoNext: function() {},
      autoPrev: function() {},
      transitionNext: function() {_this.finishTransNext()},
      transitionPrev: function() {_this.finishTransPrev()},
    },
	];  	
};
