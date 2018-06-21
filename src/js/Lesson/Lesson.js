// @flow
import { LessonContent } from './LessonContent';
import Diagram from '../diagram/Diagram';


// Flow:
//
//  Coming from any section
//    - initialState                Guaranteed
//    - showOnly                    Guaranteed
//    - hideOnly                    Guaranteed
//    - show                        Guaranteed
//    - hide                        Guaranteed
//    - transitionFromPrev/Next     Can be cancelled
//    - transitionFromAny           Can be cancelled / skipped
//    - setPlannedPositions?        Can be cancelled / skipped
//    - finalState                  Can be skipped
//
//  Go to next, prev or goTo
//    - leaveState                  Guaranteed
//    - saveState                   Guaranteed
//    - transitionToPrev            Can be cancelled / skipped
//    - transitionToAny             Can be cancelled / skipped

class Lesson {
  // ContentClass: Object;
  content: LessonContent;

  currentSectionIndex: number;
  diagram: Diagram | null;
  state: Object;
  inTransition: boolean;
  comingFrom: string;
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
      this.stopDiagrams();
      // this.currentSection().saveState();
      this.transitionStart('next');
      this.currentSection().transitionNext(this.finishTransNext.bind(this));
    }
  }
  prevSection() {
    const { diagram } = this;
    if (this.currentSectionIndex > 0 && diagram) {
      this.stopDiagrams();
      // this.currentSection().saveState();
      this.transitionStart('prev');
      this.currentSection().transitionPrev(this.finishTransPrev.bind(this));
    }
  }

  transitionStart(direction: string = '') {
    if (this.inTransition) {
      this.stopDiagrams();
    }
    // console.log("2a", this.currentSectionIndex, this.inTransition)
    this.inTransition = true;
    if (direction === 'next') {
      this.comingFrom = 'prev';
    } else if (direction === 'prev') {
      this.comingFrom = 'next';
    } else {
      this.comingFrom = '';
    }
    const { diagram } = this;
    if (diagram) {
      diagram.inTransition = true;
    }
  }

  finishTransNext() {
    this.transitionStop();
    this.goToSection(this.currentSectionIndex + 1);
  }
  finishTransPrev() {
    this.transitionStop();
    this.goToSection(this.currentSectionIndex - 1);
  }


  goToSection(sectionIndex: number) {
    if (sectionIndex >= 0 && sectionIndex < this.content.sections.length) {
      if (this.inTransition) {
        this.stopDiagrams();
      }
      this.goToSectionIndex = sectionIndex;
      this.currentSection().transitionToAny(this.finishTransToAny.bind(this));
    }
  }

  finishTransToAny() {
    this.saveState();
    this.currentSectionIndex = this.goToSectionIndex;
    this.refresh(this.getContentHtml(), this.currentSectionIndex);
  }

  setState() {
    const { diagram } = this;
    const section = this.content.sections[this.currentSectionIndex];
    if (diagram) {
      section.setInitialState(this.state);
      section.setVisible();
      this.renderDiagrams();
      if (this.comingFrom === 'next') {
        this.inTransition = true;
        section.transitionFromNext(this.finishTransFromNext.bind(this));
        this.comingFrom = '';
      } else if (this.comingFrom === 'prev') {
        this.inTransition = true;
        section.transitionFromPrev(this.finishTransFromPrev.bind(this));
        this.comingFrom = '';
      } else {
        section.transitionFromAny(this.finishTransitionFromAny.bind(this));
        this.comingFrom = '';
      }
    }
  }

  finishTransitionFromAny(flag: boolean = true) {
    this.transitionStop();
    const section = this.content.sections[this.currentSectionIndex];

    if (flag) {
      section.setState(this.state);
    }
    this.renderDiagrams();
  }
  finishTransFromPrev(flag: boolean = true) {
    // if (flag) {
    const section = this.content.sections[this.currentSectionIndex];
    if (!flag) {
      this.transitionStop();
    }
    section.transitionFromAny(this.finishTransitionFromAny.bind(this));
  }
  finishTransFromNext(flag: boolean = true) {
    const section = this.content.sections[this.currentSectionIndex];
    if (!flag) {
      this.transitionStop();
    }
    section.transitionFromAny(this.finishTransitionFromAny.bind(this));
  }

  currentSection() {
    return this.content.sections[this.currentSectionIndex];
  }

  saveState() {
    const { diagram } = this;
    if (diagram) {
      this.state = this.currentSection().getState(diagram);
    }
  }

  stopDiagrams() {
    const { diagram } = this;
    if (diagram) {
      diagram.stop(false);
    }
  }


  transitionStop() {
    const { diagram } = this;
    if (diagram) {
      diagram.inTransition = false;
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
