// @flow

import * as React from 'react';
import '../../css/style.scss';
import { Lesson, Paragraph } from '../Lesson/LessonBase';
import Canvas from './canvas';
import Button from './button';

type Props = {
  lesson: Lesson;
  section: number;
};

type State = {
  section: number,
  // diagramIds: Array<string>,
};

export default class MultiPageLesson extends React.Component
                                    <Props, State> {
  lesson: Lesson;
  key: number;
  state: State;

  constructor(props: Props) {
    super(props);
    this.state = {
      section: props.section,
    };
    this.lesson = props.lesson;
    this.key = 0;
  }

  goToNext() {
    if (this.state.section < this.lesson.sections.length - 1) {
      this.setState({
        section: this.state.section + 1,
      });
      this.makeDiagrams();
    }
  }

  goToPrevious() {
    if (this.state.section > 0) {
      this.setState({
        section: this.state.section - 1,
      });
      this.makeDiagrams();
    }
  }

  getDiagrams(): Array<Paragraph> {
    const section = this.lesson.sections[this.state.section];
    const diagrams = [];
    section.paragraphs.forEach((paragraph) => {
      if (paragraph.type === 'diagram') {
        diagrams.push(paragraph);
      }
    });
    return diagrams;
  }

  makeDiagrams() {
    const section = this.lesson.sections[this.state.section];
    const diagrams = this.getDiagrams();
    diagrams.forEach((diagram) => {
      const d = new diagram.DiagramClass(diagram.id);
      section.setState(d);
    });
  }

  componentDidMount() {
    // Instantiate all the diagrams now that the canvas elements have been
    // created.
    this.makeDiagrams();
    // section.paragraphs.forEach((paragraph) => {
    //   if (paragraph.type === 'diagram') {
    //     const d = paragraph;
    //     const diagram = new d.DiagramClass(d.id);
    //     section.setState(diagram);
    //   }
    // });
    const nextButton = document.getElementById('button-next');
    if (nextButton instanceof HTMLElement) {
      nextButton.onclick = this.goToNext.bind(this);
    }
    const prevButton = document.getElementById('button-previous');
    if (prevButton instanceof HTMLElement) {
      prevButton.onclick = this.goToPrevious.bind(this);
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

  render() {
    return <div>
      <div className='main_page'>
        <div className = "button_container">
          <Button label="Previous" id="button-previous" className="-primary -multi-page-lesson"/>
          <Button label="Next" id="button-next" className="-primary -multi-page-lesson"/>
        </div>
        <div className='lesson_container lesson_text'>
          {this.renderSection(this.lesson.sections[this.state.section])}
        </div>
      </div>
    </div>;
  }
}
