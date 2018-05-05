/* eslint-disable prefer-destructuring */

import Lesson from './Lesson';
import { Content, Section, diagramCanvas } from './LessonContent';

describe('Lesson', () => {
  let lessonMulti;
  let lessonSingle;
  let mockSetState;
  let mockGetState;

  beforeEach(() => {
    class Diagram {
      constructor(id) {
        this.id = id;
      }
    }
    mockSetState = jest.fn();
    mockGetState = jest.fn();
    mockGetState
      .mockReturnValueOnce({ angle: 1 })
      .mockReturnValueOnce({ angle: 2 })
      .mockReturnValueOnce({ angle: 3 });
    class Section1 extends Section {
      setTitle() {
        return 'S1 Title';
      }
      setContent() {
        return 'S1 Content';
      }
      setState(diagrams, state, type) {
        mockSetState(diagrams, state, type);
      }
      getState(diagrams) {
        return mockGetState(diagrams);
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
      getState(diagrams) {
        return mockGetState(diagrams);
      }
      setState(diagrams, state, type) {
        mockSetState(diagrams, state, type);
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
      setState(diagrams, state, type) {
        mockSetState(diagrams, state, type);
      }
      getState(diagrams) {
        return mockGetState(diagrams);
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
      expect(mockSetState.mock.calls[0][2]).toEqual(expectedType);
      expect(mockSetState.mock.calls[1][0]).toEqual(expectedDiagrams);
      expect(mockSetState.mock.calls[1][2]).toEqual(expectedType);
      expect(mockSetState.mock.calls[2][0]).toEqual(expectedDiagrams);
      expect(mockSetState.mock.calls[2][2]).toEqual(expectedType);
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
    test('Save State', () => {
      lesson.createDiagramsAndSetState();
      expect(mockGetState.mock.calls).toHaveLength(0);
      expect(lesson.state).toEqual({});

      lesson.saveState();
      expect(lesson.state).toEqual({ angle: 1 });
      expect(mockGetState.mock.calls).toHaveLength(1);
      expect(mockGetState.mock.calls[0][0]).toEqual({});
      lesson.currentSectionIndex = 2;
      lesson.createDiagramsAndSetState();

      lesson.saveState();
      expect(lesson.state).toEqual({ angle: 2 });
      expect(mockGetState.mock.calls).toHaveLength(2);
      expect(mockGetState.mock.calls[1][0]).toEqual({
        d1_id: { id: 'd1_id' },
        d2_id: { id: 'd2_id' },
      });
    });
    test('NextPage', () => {
      let result;
      expect(lesson.state).toEqual({});
      expect(lesson.currentSectionIndex).toBe(0);
      expect(mockGetState.mock.calls).toHaveLength(0);

      result = lesson.nextSection();
      expect(lesson.currentSectionIndex).toBe(1);
      expect(lesson.state).toEqual({ angle: 1 });
      expect(mockGetState.mock.calls).toHaveLength(1);
      expect(result).toBe(true);

      result = lesson.nextSection();
      expect(lesson.currentSectionIndex).toBe(2);
      expect(lesson.state).toEqual({ angle: 2 });
      expect(mockGetState.mock.calls).toHaveLength(2);
      expect(result).toBe(true);

      // This is out of bounds, so nothing should change
      result = lesson.nextSection();
      expect(lesson.currentSectionIndex).toBe(2);
      expect(lesson.state).toEqual({ angle: 2 });
      expect(mockGetState.mock.calls).toHaveLength(2);
      expect(result).toBe(false);
    });
    test('PrevPage', () => {
      let result;
      expect(lesson.state).toEqual({});
      expect(mockGetState.mock.calls).toHaveLength(0);
      lesson.currentSectionIndex = 2;
      expect(lesson.currentSectionIndex).toBe(2);

      result = lesson.prevSection();
      expect(lesson.currentSectionIndex).toBe(1);
      expect(lesson.state).toEqual({ angle: 1 });
      expect(mockGetState.mock.calls).toHaveLength(1);
      expect(result).toBe(true);

      result = lesson.prevSection();
      expect(lesson.currentSectionIndex).toBe(0);
      expect(lesson.state).toEqual({ angle: 2 });
      expect(mockGetState.mock.calls).toHaveLength(2);
      expect(result).toBe(true);

      // This is out of bounds, so nothing should change
      result = lesson.prevSection();
      expect(lesson.currentSectionIndex).toBe(0);
      expect(lesson.state).toEqual({ angle: 2 });
      expect(mockGetState.mock.calls).toHaveLength(2);
      expect(result).toBe(false);
    });
    test('createDiagramsAndSetState', () => {
      let diagrams;
      let type;
      expect(mockSetState.mock.calls).toHaveLength(0);
      lesson.createDiagramsAndSetState();
      diagrams = mockSetState.mock.calls[0][0];
      type = mockSetState.mock.calls[0][2];
      expect(diagrams).toEqual({});
      expect(type).toEqual('multiPage');

      lesson.nextSection();
      lesson.createDiagramsAndSetState();
      diagrams = mockSetState.mock.calls[1][0];
      type = mockSetState.mock.calls[1][2];
      expect(diagrams).toEqual({ d1_id: { id: 'd1_id' } });
      expect(type).toEqual('multiPage');

      lesson.nextSection();
      lesson.createDiagramsAndSetState();
      diagrams = mockSetState.mock.calls[2][0];
      type = mockSetState.mock.calls[2][2];
      expect(diagrams).toEqual({
        d1_id: { id: 'd1_id' },
        d2_id: { id: 'd2_id' },
      });
      expect(type).toEqual('multiPage');
      expect(mockSetState.mock.calls).toHaveLength(3);
    });
  });
});
