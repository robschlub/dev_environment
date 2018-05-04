// @flow
import { Content } from './LessonContent';

type LessonType = 'multiPage' | 'singlePage';

class Lesson {
  content: Content;
  type: LessonType;

  currentSectionIndex: number;
  state: Object;

  constructor(content: Content, lessonType: LessonType) {
    this.content = content;
    this.type = lessonType;

    this.currentSectionIndex = 0;
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
    this.currentSectionIndex = sectionIndex;
  }

  nextSection() {
    if (this.currentSectionIndex < this.content.sections.length - 1) {
      this.currentSectionIndex += 1;
    }
  }
  prevSection() {
    if (this.currentSectionIndex > 0) {
      this.currentSectionIndex -= 1;
    }
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
      section.setState(allDiagrams, this.type);
    });
  }
}

export default Lesson;
