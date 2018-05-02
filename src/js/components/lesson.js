// @flow

import * as React from 'react';
import '../../css/style.scss';
import { Lesson, Section } from '../Lesson/LessonBase';
// import Canvas from './canvas';
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
  diagrams: Object;

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
    this.diagrams = {};
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

  makeDiagrams() {
    let sections = [];
    if (this.type === 'multi') {
      sections.push(this.lesson.sections[this.state.section]);
    } else if (this.type === 'single') {
      // eslint-disable-next-line prefer-destructuring
      sections = this.lesson.sections;
    }
    const allDiagrams = {};
    sections.forEach((section) => {
      // const sectionDiagrams = [];
      // Can only create diagrams if single page primary section, or when in
      // a multi page lesson
      // if (this.type === 'multi' || section.isSinglePagePrimary) {
      section.diagrams.forEach((d) => {
        if (!(d.id in allDiagrams)) {
          allDiagrams[d.id] = new d.DiagramClass(d.id);
        }
      });
      // }
      section.setState(allDiagrams);
      // Can only run multi only state if single page primary section, or when
      // in a multi page lesson
      if (this.type === 'multi' || section.isSinglePagePrimary) {
        section.setStateMultiOnly(allDiagrams);
      }
      // allDiagrams.push(...sectionDiagrams);
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

  renderSection(section: Section) {
    const output = [];
    if (section.title) {
      this.key += 1;
      const title = <div className='lesson_title' key={this.key}>
        {section.title}
      </div>;
      output.push(title);
    }
    this.key += 1;
    let content;
    if (this.type === 'multi' || section.isSinglePagePrimary) {
      content = section.htmlContent;
    } else {
      content = section.htmlContentNoDiagrams;
    }
    const sectionContent = <div key={this.key}
      dangerouslySetInnerHTML={ {
        __html: `${content}`,
      } }
      />;
    output.push(sectionContent);
    return output;
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
