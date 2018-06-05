// @flow
import { LessonContent } from './LessonContent';
import Diagram from '../diagram/Diagram';

class Lesson {
  // ContentClass: Object;
  content: LessonContent;

  currentSectionIndex: number;
  diagram: Diagram | null;
  state: Object;
  inTransition: boolean;

  refresh: (string, number) => void;

  constructor(content: Object) {
    this.content = content;
    // this.content = new Content(this.diagram);
    this.diagram = null;
    this.currentSectionIndex = 0;
    this.state = {};
    this.inTransition = false;
    this.refresh = function () {}; // eslint-disable-line func-names
  }

  getContentHtml(): string {
    let htmlText = '';
    const section = this.content.sections[this.currentSectionIndex];
    htmlText = section.getContent();
    return htmlText;
  }

  goToSection(sectionIndex: number) {
    if (sectionIndex >= 0 && sectionIndex < this.content.sections.length) {
      if (this.inTransition) {
        this.stopDiagrams();
      }
      this.saveState();
      this.currentSectionIndex = sectionIndex;
      this.refresh(this.getContentHtml(), this.currentSectionIndex);
    }
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
      diagram.stop();
    }
  }

  nextSection() {
    const { diagram } = this;

    if (this.currentSectionIndex < this.content.sections.length - 1 && diagram) {
      if (this.inTransition) {
        this.stopDiagrams();
      }
      this.inTransition = true;
      this.currentSection().transitionNext(
        diagram,
        this.finishTransNext.bind(this),
      );
      // this.renderDiagrams();
    }
  }

  renderDiagrams() {
    const { diagram } = this;
    if (diagram) {
      diagram.animateNextFrame();
    }
  }

  finishTransNext() {
    this.inTransition = false;
    this.goToSection(this.currentSectionIndex + 1);
  }

  finishTransPrev() {
    this.inTransition = false;
    this.goToSection(this.currentSectionIndex - 1);
  }

  prevSection() {
    const { diagram } = this;
    if (this.currentSectionIndex > 0 && diagram) {
      if (this.inTransition) {
        this.stopDiagrams();
      }
      this.inTransition = true;
      this.currentSection().transitionPrev(
        diagram,
        this.finishTransPrev.bind(this),
      );
    }
  }

  closeDiagram() {
    const { diagram } = this;
    if (diagram) {
      diagram.destroy();
    }
    this.diagram = null;
  }

  setState() {
    // let { sections } = this.content;
    const { diagram } = this;
    const sections = [this.content.sections[this.currentSectionIndex]];

    if (diagram) {
      sections.forEach((section) => {
        section.setState(diagram, this.state);
      });
      this.renderDiagrams();
    }
  }

  initialize() {
    this.closeDiagram();
    this.content.initialize();
    this.diagram = this.content.diagram;
    // const id = 'multipage_diagram';
    // const { DiagramClass } = this.content;
    // this.diagram = new DiagramClass(id);
  }
}

export default Lesson;
