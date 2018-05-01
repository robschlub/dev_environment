// @flow

import * as React from 'react';
import '../../css/style.scss';
import { page1, Page } from '../Lesson/content';
import Canvas from './canvas';
import '../Lesson/lessonStyle.scss';

type Props = {
  id?: string;
  didMountFn?: (string) => mixed;
};

export default class LessonPage extends React.Component
                                    <Props> {
  page: Page;
  key: number;

  constructor(props: Props) {
    super(props);
    this.page = page1;
    this.key = 0;
  }

  componentDidMount() {
    // Instantiate all the diagrams now that the canvas elements have been
    // created.
    this.page.sections.forEach((section) => {
      section.paragraphs.forEach((paragraph) => {
        if (paragraph.type === 'diagram') {
          const d = paragraph;
          const diagram = new d.DiagramClass(d.id);
          section.setState(diagram);
        }
      })
    })
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

  renderPage() {
    return this.page.sections.map(section => this.renderSection(section));
  }

  render() {
    return <div className='main_page'>
      <div className='lesson_container lesson_text'>
        {this.renderPage()}
      </div>
    </div>;
  }
}
