// @flow

import * as React from 'react';
import '../../css/style.scss';
import ShapesDiagram from '../Lesson/shapesDiagram';
import CircleDiagram from '../Lesson/circleDiagram';
import page from '../Lesson/content';
import Canvas from './canvas';
import '../Lesson/lessonStyle.scss';
// import '../../css/diagram.scss';

type Props = {
  id?: string;
  didMountFn?: (string) => mixed;
};

// const page = new Page();

export default class LessonPage extends React.Component
                                    <Props> {
  page: page;
  diagram: ShapesDiagram;
  diagramCircle: CircleDiagram;
  key: number;

  constructor(props: Props) {
    super(props);
    this.page = page;
    this.key = 0;
  }

  componentDidMount() {
    for (let i = 0; i < this.page.length; i += 1) {
      const section = this.page[i];
      for (let j = 0; j < section.paragraphs.length; j += 1) {
        const paragraph = section.paragraphs[j];
        if (typeof paragraph === 'object') {
          const d = paragraph;
          const diagram = new d.Diagram(d.id);
          section.setState(diagram);
        }
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  addParagraph(text: string, i: number) {
    return <div
      className="lesson_text"
      key={i}
      dangerouslySetInnerHTML={ {
        __html: `<p>${text}`,
      } }
    />;
  }

  // eslint-disable-next-line class-methods-use-this
  addDiagram(id: string, i: number) {
    return <Canvas id={id} key={i}/>;
  }

  renderSection(section: Object) {
    let sectionRender = section.paragraphs.map((p) => {
      if (typeof p === 'string') {
        this.key += 1;
        return this.addParagraph(p, this.key);
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
    return this.page.map(section => this.renderSection(section));
  }

  render() {
    return <div className='main_page'>
      <div className='lesson_container'>
        {this.renderPage()}
      </div>
    </div>;
  }
}
