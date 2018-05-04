// @flow

import * as React from 'react';
import '../../css/style.scss';
import { Lesson, Section } from '../Lesson/LessonBase';
// import Canvas from './canvas';
import Button from './button';

type Props = {
  lesson: Lesson;
  section?: number;
  type: 'singlePage' | 'multiPage';
};

type State = {
  section: number,
};

export default class LessonComponent extends React.Component
                                    <Props, State> {
  lesson: Lesson;
  key: number;
  type: 'multiPage' | 'singlePage';
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
    if (this.type === 'multiPage') {
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
    if (this.type === 'multiPage') {
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
    this.diagrams = {};
    let sections = [];
    if (this.type === 'multiPage') {
      sections.push(this.lesson.sections[this.state.section]);
    } else if (this.type === 'singlePage') {
      // eslint-disable-next-line prefer-destructuring
      sections = this.lesson.sections;
    }

    sections.forEach((section) => {
      const diagrams = section.getDiagramList(this.type);
      diagrams.forEach((d) => {
        // only create a diagram if it doesn't already exist
        if (!(d.id in this.diagrams)) {
          this.diagrams[d.id] = new d.DiagramClass(d.id);
        }
      });
      section.setState(this.diagrams, this.type);
    });
  }

  componentDidMount() {
    // Instantiate all the diagrams now that the canvas elements have been
    // created.
    this.makeDiagrams();

    if (this.type === 'multiPage') {
      const nextButton = document.getElementById('lesson__button-next');
      if (nextButton instanceof HTMLElement) {
        nextButton.onclick = this.goToNext.bind(this);
      }
      const prevButton = document.getElementById('lesson__button-previous');
      if (prevButton instanceof HTMLElement) {
        prevButton.onclick = this.goToPrevious.bind(this);
      }
    }
  }

  renderTitle(title: string) {
    this.key += 1;
    return <div className='lesson__title' key={this.key}>
        {title}
      </div>;
  }

  renderContent(content: string) {
    this.key += 1;
    return <div key={this.key} className='lesson__text'
      dangerouslySetInnerHTML={ {
        __html: `${content}`,
      } }
      />;
  }

  renderSection(section: Section) {
    const output = [];
    if (section.title) {
      output.push(this.renderTitle(section.title));
    }
    const content = section.getContent(this.type);
    if (content) {
      output.push(this.renderContent(content));
    }
    return output;
  }

  addButtons() {
    if (this.type === 'multiPage') {
      return <div className = "lesson__button-container fixed-bottom">
          <Button label="Previous" id="lesson__button-previous" className="-primary -multi-page-lesson"/>
          <Button label="Next" id="lesson__button-next" className="-primary -multi-page-lesson"/>
        </div>;
    }
    return <div />;
  }
  renderPage() {
    if (this.type === 'singlePage') {
      return this.lesson.sections.map(section => this.renderSection(section));
    }
    return this.renderSection(this.lesson.sections[this.state.section]);
  }
  render() {
    return <div>
      <div className="lesson__container">
        {this.renderPage()}
      </div>
      <div className = "row">
        {this.addButtons()}
      </div>
    </div>;
  }
}
