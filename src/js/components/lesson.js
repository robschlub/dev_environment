// @flow

import * as React from 'react';
import '../../css/style.scss';
import { Lesson, Paragraph, Section } from '../Lesson/LessonBase';
import Canvas from './canvas';
import Button from './button';

type Props = {
  lesson: Lesson;
  section?: number;
  type: 'single' | 'multi';
};

type State = {
  section: number,
};

export default class LessonComponent extends React.Component
                                    <Props, State> {
  lesson: Lesson;
  key: number;
  type: string;
  state: State;
  diagrams: Array<Object>;
  subSectionIndex: number;

  constructor(props: Props) {
    super(props);
    if (props.section) {
      this.state = {
        section: props.section,
      };
    } else {
      this.state = {
        section: 0,
      };
    }
    this.type = props.type;
    this.lesson = props.lesson;
    this.key = 0;
    this.diagrams = [];
  }

  goToNext() {
    if (this.type === 'multi') {
      if (this.state.section < this.lesson.sections.length - 1) {
        this.lesson.sections[this.state.section].getState(this.diagrams);
        this.setState({
          section: this.state.section + 1,
        });
        this.makeDiagrams();
      }
    }
  }

  goToPrevious() {
    if (this.type === 'multi') {
      if (this.state.section > 0) {
        this.lesson.sections[this.state.section].getState(this.diagrams);
        this.setState({
          section: this.state.section - 1,
        });
        this.makeDiagrams();
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  getDiagrams(section: Section): Array<Paragraph> {
    const diagrams = [];
    section.paragraphs.forEach((paragraph) => {
      if (paragraph.type === 'diagram') {
        diagrams.push(paragraph);
      }
    });
    return diagrams;
  }

  makeDiagrams() {
    let sections = [];
    if (this.type === 'multi') {
      sections.push(this.lesson.sections[this.state.section]);
    } else if (this.type === 'single') {
      // eslint-disable-next-line prefer-destructuring
      sections = this.lesson.sections;
    }
    let allDiagrams = [];
    sections.forEach((section) => {
      const diagramIds = this.getDiagrams(section);
      const diagrams = [];
      diagramIds.forEach((d) => {
        diagrams.push(new d.DiagramClass(d.id));
        section.setState(diagrams);
        allDiagrams = allDiagrams.concat(diagrams);
      });
    });
    this.diagrams = allDiagrams;
  }

  componentDidMount() {
    // Instantiate all the diagrams now that the canvas elements have been
    // created.
    this.makeDiagrams();

    if (this.type === 'multi') {
      const nextButton = document.getElementById('button-next');
      if (nextButton instanceof HTMLElement) {
        nextButton.onclick = this.goToNext.bind(this);
      }
      const prevButton = document.getElementById('button-previous');
      if (prevButton instanceof HTMLElement) {
        prevButton.onclick = this.goToPrevious.bind(this);
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  addText(text: string) {
    this.key += 1;
    return <p
      key={this.key}
      dangerouslySetInnerHTML={ {
        __html: `${text}`,
      } }
    />;
  }

  addHTML(text: string) {
    this.key += 1;
    return <div
      key={this.key}
      dangerouslySetInnerHTML={ {
        __html: `${text}`,
      } }
    />;
  }

  // eslint-disable-next-line class-methods-use-this
  addDiagram(id: string, i: number) {
    return <Canvas id={id} key={i}/>;
  }

  renderSubSections(section: Object) {
    const rendered = [];
    // let index = i;
    while (this.subSectionIndex < section.paragraphs.length) {
      const index = this.subSectionIndex;
      const subSection = section.paragraphs[index];
      const { type } = subSection;
      if (type === 'divStart') {
        const div = section.paragraphs[index];
        this.subSectionIndex += 1;
        const divSubSections = this.renderSubSections(section);
        this.key += 1;
        rendered.push(<div id={div.id} className={div.className} key={this.key}>
            {divSubSections}
          </div>);
      }
      if (type === 'divEnd') {
        this.subSectionIndex += 1;
        return rendered;
      }
      if (type === 'text') {
        rendered.push(this.addText(subSection.text));
      }
      if (type === 'html') {
        rendered.push(this.addHTML(subSection.text));
      }
      if (type === 'diagram') {
        this.key += 1;
        rendered.push(this.addDiagram(subSection.id, this.key));
      }
      this.subSectionIndex += 1;
    }
    return rendered;
  }

  renderSection(section: Object) {
    this.subSectionIndex = 0;
    const rendered = [];
    if (section.title) {
      this.key += 1;
      const title = <div className='lesson_title' key={this.key}>
        {section.title}
      </div>;
      rendered.push(title);
    }
    rendered.push(...this.renderSubSections(section));
    return rendered;
  }

  addButtons() {
    if (this.type === 'multi') {
      return <div className = "button_container">
          <Button label="Previous" id="button-previous" className="-primary -multi-page-lesson"/>
          <Button label="Next" id="button-next" className="-primary -multi-page-lesson"/>
        </div>;
    }
    return <div />;
  }
  renderPage() {
    if (this.type === 'single') {
      return this.lesson.sections.map(section => this.renderSection(section));
    }
    return this.renderSection(this.lesson.sections[this.state.section]);
  }
  render() {
    return <div>
      <div className='main_page'>
        <div className='lesson_container lesson_text'>
          {this.renderPage()}
        </div>
        {this.addButtons()}
      </div>
    </div>;
  }
}
