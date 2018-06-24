// @flow
import { LessonContent } from './LessonContent';
import Diagram from '../diagram/Diagram';

// Flow:
//
//  Coming from any section
//    - setEnterState               Guaranteed
//    - showOnly                    Guaranteed
//    - hideOnly                    Guaranteed
//    - show                        Guaranteed
//    - hide                        Guaranteed
//    - transitionFromPrev/Next     Can be cancelled
//    - transitionFromAny           Can be cancelled / skipped
//    - setPlannedPositions?        Can be cancelled / skipped
//    - setSteadyState              Can be skipped
//
//  Go to next, prev or goTo
//    - transitionToPrev/Next       Can be cancelled / skipped
//    - transitionToAny             Can be cancelled / skipped
//    - saveState                   Guaranteed
//    - setLeaveState               Guaranteed

class Lesson {
  // ContentClass: Object;
  content: LessonContent;

  currentSectionIndex: number;
  diagram: Diagram | null;
  state: Object;
  inTransition: boolean;
  transitionCancelled: boolean;
  comingFrom: 'next' | 'prev' | 'goto' | '' ;
  goingTo: 'next' | 'prev' | 'goto' | '' ;
  refresh: (string, number) => void;
  goToSectionIndex: number;

  constructor(content: Object) {
    this.content = content;
    // this.content = new Content(this.diagram);
    this.diagram = null;
    this.currentSectionIndex = 0;
    this.state = {};
    this.inTransition = false;
    this.refresh = function () {}; // eslint-disable-line func-names
    this.comingFrom = '';
    this.transitionCancelled = false;
    this.goToSectionIndex = 0;
  }

  getContentHtml(): string {
    let htmlText = '';
    const section = this.content.sections[this.currentSectionIndex];
    htmlText = section.getContent();
    return htmlText;
  }

  nextSection() {
    const { diagram } = this;
    if (this.currentSectionIndex < this.content.sections.length - 1 && diagram) {
      // If in transition, then cancel the transition.
      if (this.inTransition) {
        const { comingFrom } = this;
        this.stopTransition();
        if (comingFrom === 'prev') {
          return;
        }
      } else {
        // Stop diagrams if not in transition to stop any animations.
        // this.stopDiagrams();
      }
      // this.currentSection().goingTo = 'next';
      // this.sections.[this.currentSectionIndex + 1].comingFrom = 'prev';
      this.transitionStart('prev');
      this.goToSectionIndex = this.currentSectionIndex + 1;
      this.currentSection().transitionToNext(this.finishTransToNextOrPrev.bind(this));
    }
  }
  prevSection() {
    const { diagram } = this;
    if (this.currentSectionIndex > 0 && diagram) {
      if (this.inTransition) {
        const { comingFrom } = this;
        this.stopTransition();
        if (comingFrom === 'next') {
          return;
        }
      } else {
        this.stopDiagrams();
      }
      // this.currentSection().goingTo = 'prev';
      // this.sections.[this.currentSectionIndex + 1].comingFrom = 'next';
      this.transitionStart('next');
      this.goToSectionIndex = this.currentSectionIndex - 1;
      this.currentSection().transitionToPrev(this.finishTransToNextOrPrev.bind(this));
    }
  }

  goToSection(sectionIndex: number) {
    if (sectionIndex >= 0 && sectionIndex < this.content.sections.length) {
      if (this.inTransition) {
        this.stopTransition();
      } else {
        this.stopDiagrams();
      }
      // this.currentSection().goingTo = 'goto';
      // this.sections.[this.currentSectionIndex + 1].comingFrom = 'goto';
      this.transitionStart('goto');
      this.goToSectionIndex = sectionIndex;
      this.currentSection().transitionToAny(this.finishTransToAny.bind(this));
    }
  }

  transitionStart(direction: 'next' | 'prev' | 'goto' | '' = '') {
    this.inTransition = true;
    this.comingFrom = direction;
    if (direction === 'prev') {
      this.content.goingTo = 'next';
      this.content.comingFrom = 'prev';
    } else if (direction === 'next') {
      this.content.goingTo = 'prev';
      this.content.comingFrom = 'next';
    } else {
      this.content.goingTo = 'goto';
      this.content.comingFrom = 'goto';
    }
    const { diagram } = this;
    if (diagram) {
      diagram.inTransition = true;
    }
  }

  finishTransToNextOrPrev(flag: boolean = true) {
    if (flag === false) {
      this.finishTransToAny();
    } else {
      this.currentSection().transitionToAny(this.finishTransToAny.bind(this));
    }
  }

  finishTransToAny() {
    this.setLeaveStateAndMoveToNextSection();
  }

  setLeaveStateAndMoveToNextSection() {
    // console.log("asdf")
    const possibleState = this.currentSection().setLeaveState();
    if (possibleState !== null && possibleState !== undefined) {
      this.state = possibleState;
    }

    this.currentSectionIndex = this.goToSectionIndex;
    this.refresh(this.getContentHtml(), this.currentSectionIndex);
  }

  setState() {
    const { diagram } = this;
    const section = this.content.sections[this.currentSectionIndex];
    if (diagram) {
      section.setEnterState(this.state);
      section.setOnClicks();
      section.setVisible();
      this.renderDiagrams();
      if (this.transitionCancelled) {
        this.finishTransitionFromAny();
      }
      if (this.comingFrom === 'next') {
        section.transitionFromNext(this.finishTransFromNextOrPrev.bind(this));
      } else if (this.comingFrom === 'prev') {
        section.transitionFromPrev(this.finishTransFromNextOrPrev.bind(this));
      } else {
        section.transitionFromAny(this.finishTransitionFromAny.bind(this));
      }
    }
  }

  finishTransFromNextOrPrev(flag: boolean = true) {
    if (flag === false) {
      this.finishTransitionFromAny();
    } else {
      const section = this.content.sections[this.currentSectionIndex];
      section.transitionFromAny(this.finishTransitionFromAny.bind(this));
    }
  }

  finishTransitionFromAny() {
    const section = this.content.sections[this.currentSectionIndex];
    section.setSteadyState(this.state);
    this.inTransition = false;
    const { diagram } = this;
    if (diagram) {
      diagram.inTransition = false;
    }
    this.comingFrom = '';
    this.transitionCancelled = false;
    this.renderDiagrams();
  }

  currentSection() {
    return this.content.sections[this.currentSectionIndex];
  }

  stopDiagrams() {
    const { diagram } = this;
    if (diagram) {
      diagram.stop(false);
    }
  }


  stopTransition() {
    const { diagram } = this;
    this.transitionCancelled = true;
    if (diagram) {
      diagram.inTransition = false;
      diagram.stop(false);
    }
    this.inTransition = false;
  }

  renderDiagrams() {
    const { diagram } = this;
    if (diagram) {
      diagram.animateNextFrame();
    }
  }

  closeDiagram() {
    const { diagram } = this;
    if (diagram) {
      diagram.destroy();
    }
    this.diagram = null;
  }

  initialize() {
    this.closeDiagram();
    this.content.initialize();
    this.diagram = this.content.diagram;
  }
}

export default Lesson;
