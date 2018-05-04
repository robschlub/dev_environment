// @flow
import { Content } from './LessonContent';

type LessonType = 'multiPage' | 'singlePage';

class Lesson {
  content: Content;
  type: LessonType;

  currentSectionIndex: number;
  currentDiagrams: Object;
  state: Object;

  constructor(content: Content, lessonType: LessonType) {
    this.content = content;
    this.type = lessonType;
    this.currentDiagrams = {};
    this.currentSectionIndex = 0;
    this.state = {};
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

  goToSection(sectionIndex: number): boolean {
    if (sectionIndex >= 0 && sectionIndex < this.content.sections.length) {
      this.saveState();
      this.currentSectionIndex = sectionIndex;
      this.createDiagramsAndSetState();
      return true;
    }
    return false;
  }

  currentSection() {
    return this.content.sections[this.currentSectionIndex];
  }

  saveState() {
    if (this.type === 'multiPage') {
      this.state = this.currentSection().getState(this.currentDiagrams);
    }
  }

  nextSection(): boolean {
    if (this.currentSectionIndex < this.content.sections.length - 1) {
      this.saveState();
      this.currentSectionIndex += 1;
      // this.createDiagramsAndSetState();
      return true;
    }
    return false;
  }
  prevSection(): boolean {
    if (this.currentSectionIndex > 0) {
      this.saveState();
      this.currentSectionIndex -= 1;
      // this.createDiagramsAndSetState();
      return true;
    }
    return false;
  }

  createDiagramsAndSetState() {
    const allDiagrams = {};
    let { sections } = this.content;
    if (this.type === 'multiPage') {
      sections = [this.content.sections[this.currentSectionIndex]];
    }

    sections.forEach((section) => {
      const sectionDiagrams = section.getDiagramList(this.type);
      sectionDiagrams.forEach((d) => {
        // only create a diagram if it doesn't already exist
        if (!(d.id in allDiagrams)) {
          allDiagrams[d.id] = new d.DiagramClass(d.id);
        }
      });
      section.setState(allDiagrams, this.state, this.type);
    });
    this.currentDiagrams = allDiagrams;
  }
}

export default Lesson;
