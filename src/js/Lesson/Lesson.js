// @flow
import { LessonContent } from './LessonContent';
import Diagram from '../diagram/Diagram';

function hideInfoButton() {
  const infoButton = document.getElementById('id_lesson__info_button');
  if (infoButton instanceof HTMLElement) {
    infoButton.classList.add('lesson__info_hide');
  }
}

function hideInteractiveHighlightButton() {
  const interactiveHighlightButton = document
    .getElementById('id_lesson__interactive_element_button');
  if (interactiveHighlightButton instanceof HTMLElement) {
    interactiveHighlightButton.classList.add('lesson__interactive_element_button__hide');
  }
}

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
  overlayDiagram: Diagram | null;
  state: Object;
  inTransition: boolean;
  transitionCancelled: boolean;
  comingFrom: 'next' | 'prev' | 'goto' | '' ;
  goingTo: 'next' | 'prev' | 'goto' | '' ;
  refresh: (string, number, ?() => void) => void;
  // refreshPageOnly: (number) => void;
  // blank: () => void;
  goToSectionIndex: number;
  firstPageShown: boolean;

  constructor(content: Object) {
    this.content = content;
    // this.content = new Content(this.diagram);
    this.diagram = null;
    this.overlayDiagram = null;
    this.currentSectionIndex = 0;
    this.firstPageShown = true;
    this.state = {};
    this.inTransition = false;
    this.refresh = function () {}; // eslint-disable-line func-names
    // this.refreshPageOnly = function () {}; // eslint-disable-line func-names
    // this.blank = () => {};
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
        const { firstPageShown } = this;
        const { comingFrom } = this;
        this.stopTransition();
        if (comingFrom === 'prev' || firstPageShown) {
          return;
        }
      } else {
        // Stop diagrams if not in transition to stop any animations.
        this.stopDiagrams();
      }
      this.firstPageShown = false;
      if (this.currentSection().blankTransition.toNext) {
        this.refresh('', this.currentSectionIndex);
      }
      this.content.toggleInfo(false);
      // this.currentSection().goingTo = 'next';
      // this.sections.[this.currentSectionIndex + 1].comingFrom = 'prev';
      this.transitionStart('prev');
      this.goToSectionIndex = this.currentSectionIndex + 1;
      this.currentSection().transitionToNext(this.finishTransToNextOrPrev.bind(this));
    }
    this.renderDiagrams();
  }

  prevSection() {
    const { diagram } = this;
    if (this.currentSectionIndex > 0 && diagram) {
      if (this.inTransition) {
        const { comingFrom } = this;
        const { firstPageShown } = this;
        this.stopTransition();
        if (comingFrom === 'next' || firstPageShown) {
          return;
        }
      } else {
        this.stopDiagrams();
      }
      this.firstPageShown = false;
      if (this.currentSection().blankTransition.toNext) {
        this.refresh('', this.currentSectionIndex);
      }
      // this.currentSection().goingTo = 'prev';
      // this.sections.[this.currentSectionIndex + 1].comingFrom = 'next';
      this.content.toggleInfo(false);
      this.transitionStart('next');
      this.goToSectionIndex = this.currentSectionIndex - 1;
      this.currentSection().transitionToPrev(this.finishTransToNextOrPrev.bind(this));
    }
    this.renderDiagrams();
  }

  goToSection(sectionId: number | string) {
    let sectionIndex = 0;
    if (typeof sectionId === 'number') {
      sectionIndex = sectionId;
    } else {
      this.content.sections.forEach((section, index) => {
        if (section.title === sectionId) {
          sectionIndex = index;
        }
      });
    }
    // this.firstPageShown = false;
    if (sectionIndex >= 0 && sectionIndex < this.content.sections.length) {
      if (this.inTransition) {
        this.stopTransition();
        if (this.firstPageShown) {
          this.firstPageShown = false;
        }
      } else {
        this.stopDiagrams();
      }
      // this.currentSection().goingTo = 'goto';
      // this.sections.[this.currentSectionIndex + 1].comingFrom = 'goto';
      if (this.currentSection().blankTransition.toGoto) {
        this.refresh('', this.currentSectionIndex);
      }
      this.content.toggleInfo(false);
      this.transitionStart('goto');
      this.goToSectionIndex = sectionIndex;
      this.currentSection().transitionToAny(this.finishTransToAny.bind(this));
    }
    this.renderDiagrams();
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
    hideInfoButton();
    hideInteractiveHighlightButton();

    const possibleState = this.currentSection().setLeaveState();
    if (possibleState !== null && possibleState !== undefined) {
      this.state = possibleState;
    }

    this.currentSectionIndex = this.goToSectionIndex;
    this.currentSection().setBlanks();

    let contentHTML = this.getContentHtml();
    if ((this.comingFrom === 'prev' && this.currentSection().blankTransition.fromPrev)
     || (this.comingFrom === 'next' && this.currentSection().blankTransition.fromNext)
     || (this.comingFrom === 'goto' && this.currentSection().blankTransition.fromGoto)) {
      contentHTML = '';
    }
    this.refresh(
      contentHTML, this.currentSectionIndex,
      this.setState.bind(this),
    );
  }

  setState() {
    const { diagram } = this;
    const section = this.content.sections[this.currentSectionIndex];
    if (diagram) {
      section.setEnterState(this.state);
      section.currentInteractiveItem = -1;
      if (this.overlayDiagram) {
        this.overlayDiagram.elements.hideAll();
      }
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
    this.refresh(
      this.getContentHtml(),
      this.currentSectionIndex,
      this.componentUpdateComplete.bind(this),
    );
  }

  componentUpdateComplete() {
    const section = this.content.sections[this.currentSectionIndex];
    section.setOnClicks();
    section.setSteadyState(this.state);
    this.firstPageShown = false;
    section.setInfoButton();
    section.setInteractiveElements();
    section.setInteractiveElementsButton();
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

  highlightNextInteractiveItem() {
    const section = this.content.sections[this.currentSectionIndex];
    if (section.interactiveElementList.length > 0) {
      let index = section.currentInteractiveItem + 1;
      if (index > section.interactiveElementList.length - 1) {
        index = 0;
      }
      const { element, location } = section.interactiveElementList[index];
      this.content.highlightInteractiveElement(element, location);
      section.currentInteractiveItem = index;
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
    this.overlayDiagram = this.content.overlayDiagram;
    this.diagram.lesson = this;
  }
}

export default Lesson;
