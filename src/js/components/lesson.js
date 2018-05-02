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
  addText(text: string, i: number) {
    return <div
      key={i}
      dangerouslySetInnerHTML={ {
        __html: `${text}`,
      } }
    />;
  }

  // eslint-disable-next-line class-methods-use-this
  addDiagram(id: string, i: number) {
    return <Canvas id={id} key={i}/>;
  }

  renderSection(section: Object) {
    let sectionRender = section.paragraphs.map((p) => {
      if (p.type === 'text' || p.type === 'html') {
        this.key += 1;
        return this.addText(p.text, this.key);
      } else if (p.type === 'html') {
        return p.text;
      }
      this.key += 1;
      return this.addDiagram(p.id, this.key);
    });
    if (section.title) {
      this.key += 1;
      const title = <div className='lesson_title' key={this.key}>
        {section.title}
      </div>;
      sectionRender = [title].concat(sectionRender);
    }
    return sectionRender;
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
        {this.addButtons()}
        <div className='lesson_container lesson_text'>
          {this.renderPage()}
        </div>
      </div>
    </div>;
  }
}
