// @flow
import { Content } from './LessonContent';
// import WebGLInstance from './webgl/webgl';
// import getShaders from './webgl/shaders';

type LessonType = 'multiPage' | 'singlePage';

class Lesson {
  content: Content;
  type: LessonType;

  currentSectionIndex: number;
  currentDiagrams: Object;
  state: Object;
  inTransition: boolean;

  refresh: (string) => void;

  constructor(content: Content, lessonType: LessonType) {
    this.content = content;
    this.type = lessonType;
    this.currentDiagrams = {};
    this.currentSectionIndex = 0;
    this.state = {};
    this.inTransition = false;
    this.refresh = function () {}; // eslint-disable-line func-names
  }

  getContentHtml(): string {
    let htmlText = '';
    if (this.type === 'multiPage') {
      const section = this.content.sections[this.currentSectionIndex];
      htmlText = section.getContent(this.type);
    } else {
      this.content.sections.forEach((section) => {
        htmlText = `${htmlText}${section.getContent(this.type)}`;
      });
    }
    return htmlText;
  }

  goToSection(sectionIndex: number) {
    if (sectionIndex >= 0 && sectionIndex < this.content.sections.length) {
      this.saveState();
      this.currentSectionIndex = sectionIndex;
      // this.createDiagramsAndSetState();
      this.refreshView();
    }
    // return false;
  }

  currentSection() {
    return this.content.sections[this.currentSectionIndex];
  }

  saveState() {
    if (this.type === 'multiPage') {
      this.state = this.currentSection().getState(this.currentDiagrams);
    }
  }

  stopDiagrams() {
    Object.keys(this.currentDiagrams).forEach((key) => {
      const diagram = this.currentDiagrams[key];
      diagram.stop();
    });
  }

  nextSection() {
    if (this.currentSectionIndex < this.content.sections.length - 1) {
      if (this.inTransition) {
        this.stopDiagrams();
      }
      this.inTransition = true;
      this.currentSection().transitionNext(
        this.currentDiagrams,
        this.finishTransNext.bind(this),
      );
      // this.renderDiagrams();
    }
  }

  renderDiagrams() {
    Object.keys(this.currentDiagrams).forEach((key) => {
      this.currentDiagrams[key].animateNextFrame();
    });
  }
  finishTransNext() {
    this.goToSection(this.currentSectionIndex + 1);
  }

  finishTransPrev() {
    this.goToSection(this.currentSectionIndex - 1);
  }

  refreshView() {
    this.refresh(this.getContentHtml());
    this.setState();
  }

  prevSection() {
    if (this.currentSectionIndex > 0) {
      if (this.inTransition) {
        this.stopDiagrams();
      }
      this.inTransition = true;
      this.currentSection().transitionPrev(
        this.currentDiagrams,
        this.finishTransPrev.bind(this),
      );
    }
  }

  closeDiagrams() {
    Object.keys(this.currentDiagrams).forEach((key) => {
      const diagram = this.currentDiagrams[key];
      diagram.destroy();
    });
    this.currentDiagrams = {};
  }

  setState() {
    let { sections } = this.content;
    if (this.type === 'multiPage') {
      sections = [this.content.sections[this.currentSectionIndex]];
    }

    sections.forEach((section) => {
      section.setState(this.currentDiagrams, this.state, this.type);
    });
    this.renderDiagrams();
  }

  createDiagrams() {
    this.closeDiagrams();
    let { sections } = this.content;
    // If multi page, only going to create one diagram
    if (this.type === 'multiPage') {
      sections = [this.content.sections[this.currentSectionIndex]];
      const id = 'multipage_diagram';
      this.currentDiagrams[id] = new this.content.DiagramClass(id);
    }
    if (this.type === 'singlePage') {
      // If single page, may create many diagrams
      sections.forEach((section) => {
        const sectionDiagrams = section.getDiagramList(this.type);
        sectionDiagrams.forEach((d) => {
          if (!(d.id in this.currentDiagrams)) {
            this.currentDiagrams[d.id] = new d.DiagramClass(d.id);
          }
        });
      });
    }
  }
}

export default Lesson;
