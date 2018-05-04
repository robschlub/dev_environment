/* eslint-disable prefer-destructuring */

import Lesson from './Lesson';
import { Content, Section, actionWord, diagramCanvas } from './LessonContent';

describe('Lesson', () => {
  let lessonMulti;
  let lessonSingle;
  let mockSetState;

  beforeEach(() => {
    class Diagram {
      constructor(id) {
        this.id = id;
      }
    }
    mockSetState = jest.fn();
    class Section1 extends Section {
      setTitle() {
        return 'S1 Title';
      }
      setContent() {
        return 'S1 Content';
      }
      setState(diagrams, type) {
        mockSetState(diagrams, type);
      }
    }
    class Section2 extends Section {
      setTitle() {
        return 'S2 Title';
      }
      setContent() {
        return [
          'S2 Content Line 1',
          'S2 Content Line 2',
          '|Diagram_1|',
        ];
      }
      setModifiers() {
        return {
          Diagram_1: diagramCanvas('d1_id', Diagram),
        };
      }
      setState(diagrams, type) {
        mockSetState(diagrams, type);
      }
    }
    class Section3 extends Section {
      setTitle() {
        return 'S3 Title';
      }
      setContent() {
        return 'S3 Content |Diagram_1| |Diagram_2|';
      }
      setModifiers() {
        return {
          Diagram_1: diagramCanvas('d1_id', Diagram, '', 'multiPage'),
          Diagram_2: diagramCanvas('d2_id', Diagram),
        };
      }
      setState(diagrams, type) {
        mockSetState(diagrams, type);
      }
    }
    const content = new Content(
      'Lesson Title',
      [
        new Section1(),
        new Section2(),
        new Section3(),
      ],
    );
    lessonMulti = new Lesson(content, 'multiPage');
    lessonSingle = new Lesson(content, 'singlePage');
  });
  test('Instantiation', () => {
    expect(lessonSingle).not.toBe(null);
    expect(lessonMulti).not.toBe(null);
  });
  describe('Single Page', () => {
    let lesson;
    beforeEach(() => {
      lesson = lessonSingle;
    });
    test('Get Single Page Content HTML', () => {
      const html = lesson.getContentHtml();
      const count1 = (html.match(/d1_id/g) || []).length;
      const count2 = (html.match(/d2_id/g) || []).length;
      expect(count1).toBe(1);
      expect(count2).toBe(1);
    });
    test('createDiagramsAndSetState', () => {
      expect(mockSetState.mock.calls).toHaveLength(0);
      lesson.createDiagramsAndSetState();
      expect(mockSetState.mock.calls).toHaveLength(3);

      const expectedDiagrams = {
        d1_id: { id: 'd1_id' },
        d2_id: { id: 'd2_id' },
      };
      const expectedType = 'singlePage';
      expect(mockSetState.mock.calls[0][0]).toEqual(expectedDiagrams);
      expect(mockSetState.mock.calls[0][1]).toEqual(expectedType);
      expect(mockSetState.mock.calls[1][0]).toEqual(expectedDiagrams);
      expect(mockSetState.mock.calls[1][1]).toEqual(expectedType);
      expect(mockSetState.mock.calls[2][0]).toEqual(expectedDiagrams);
      expect(mockSetState.mock.calls[2][1]).toEqual(expectedType);
    });
  });
  describe('Multi Page', () => {
    let lesson;
    beforeEach(() => {
      lesson = lessonMulti;
    });
    test('Get Multi Page Content HTML', () => {
      lesson.goToSection(2);
      const html = lesson.getContentHtml();
      const count1 = (html.match(/d1_id/g) || []).length;
      const count2 = (html.match(/d2_id/g) || []).length;
      expect(count1).toBe(1);
      expect(count2).toBe(1);
    });
    test('NextPage', () => {
      expect(lesson.currentSectionIndex).toBe(0);
      lesson.nextSection();
      expect(lesson.currentSectionIndex).toBe(1);
    });
    test('createDiagramsAndSetState', () => {
      let diagrams;
      let type;
      expect(mockSetState.mock.calls).toHaveLength(0);
      lesson.createDiagramsAndSetState();
      diagrams = mockSetState.mock.calls[0][0];
      type = mockSetState.mock.calls[0][1];
      expect(diagrams).toEqual({});
      expect(type).toEqual('multiPage');

      lesson.nextSection();
      lesson.createDiagramsAndSetState();
      diagrams = mockSetState.mock.calls[1][0];
      type = mockSetState.mock.calls[1][1];
      expect(diagrams).toEqual({ d1_id: { id: 'd1_id' } });
      expect(type).toEqual('multiPage');

      lesson.nextSection();
      lesson.createDiagramsAndSetState();
      diagrams = mockSetState.mock.calls[2][0];
      type = mockSetState.mock.calls[2][1];
      expect(diagrams).toEqual({
        d1_id: { id: 'd1_id' },
        d2_id: { id: 'd2_id' },
      });
      expect(type).toEqual('multiPage');
      expect(mockSetState.mock.calls).toHaveLength(3);
    });
  });
});
