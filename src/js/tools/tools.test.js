import * as tools from './tools';

describe('Test Classify method', () => {
  // CLassify method tests
  test('Empty inputs case', () => {
    expect(tools.classify('', '')).toBe('');
  });

  test('Empty value case', () => {
    expect(tools.classify('btn', '')).toBe('btn');
  });

  test('Empty key case', () => {
    expect(tools.classify('', '-test')).toBe(' -test');
  });

  test('btn, btn -> btn', () => {
    expect(tools.classify('btn', 'btn')).toBe('btn');
  });

  test('btn, -test -> btn btn-test', () => {
    expect(tools.classify('btn', '-test')).toBe('btn btn-test');
  });

  test('Do nothing case: btn, btn-test -> btn btn-test', () => {
    expect(tools.classify('btn', 'btn-test')).toBe('btn btn-test');
  });

  test('btn, btn -test -> btn btn-test', () => {
    expect(tools.classify('btn', 'btn -test')).toBe('btn btn-test');
  });

  test('btn, -test -test2 -> btn btn-test btn-test2', () => {
    expect(tools.classify('btn', '-test -test2')).toBe('btn btn-test btn-test2');
  });
});

describe('Extract From Object', () => {
  let o;
  beforeEach(() => {
    o = {
      a: 1,
      b: {
        b1: 2,
        b2: 3,
      },
      c: i => i + 1,
      d: (i, j) => i + j,
    };
  });
  describe('Object Property Pointer', () => {
    test('string exists', () => {
      const p = new tools.ObjectKeyPointer(o, 'a');
      expect(p.object).toBe(o);
      expect(p.key).toBe('a');
      expect(p.value()).toBe(1);
    });
    test('string does not exist', () => {
      const p = new tools.ObjectKeyPointer(o, 'z');
      expect(p.object).toBe(o);
      expect(p.key).toBe('');
      expect(p.value()).toBe(undefined);
    });
    test('setting value of key that exists', () => {
      const p = new tools.ObjectKeyPointer(o, 'a');
      p.setValue(100);
      expect(o.a).toBe(100);
    });
    test('setting value of key that does not exist', () => {
      const p = new tools.ObjectKeyPointer(o, 'z');
      expect(p.value()).toBe(undefined);
      expect('z' in o).toBe(false);
    });
    test('execute method with one argument', () => {
      const p = new tools.ObjectKeyPointer(o, 'c');
      const r = p.execute(1);
      expect(r).toBe(2);
    });
    test('execute method with two arguments', () => {
      const p = new tools.ObjectKeyPointer(o, 'd');
      const r = p.execute(1, 2);
      expect(r).toBe(3);
    });
    test('execute method don key that does not exist', () => {
      const p = new tools.ObjectKeyPointer(o, 'z');
      const r = p.execute(1);
      expect(r).toBe(undefined);
      expect('z' in o).toBe(false);
    });
  });
  describe('Extract', () => {
    describe('String input', () => {
      test('string exists', () => {
        const q = tools.extractFrom(o, 'a');
        expect(q).toEqual(new tools.ObjectKeyPointer(o, 'a'));
      });
      test('string does not exist', () => {
        const q = tools.extractFrom(o, 'z');
        expect(q).toEqual(undefined);
      });
    });
    describe('Array input', () => {
      test('Array all exists', () => {
        const q = tools.extractFrom(o, ['a', 'b', 'c']);
        expect(q[0]).toEqual(new tools.ObjectKeyPointer(o, 'a'));
        expect(q[1]).toEqual(new tools.ObjectKeyPointer(o, 'b'));
        expect(q[2].execute(100)).toBe(101);
      });
      test('Array - some exist', () => {
        const q = tools.extractFrom(o, ['a', 'b', 'z', 'c']);
        expect(q[0]).toEqual(new tools.ObjectKeyPointer(o, 'a'));
        expect(q[1]).toEqual(new tools.ObjectKeyPointer(o, 'b'));
        expect(q[2]).toBe(undefined);
        expect(q[3].execute(100)).toBe(101);
      });
      test('Array - none exist', () => {
        const q = tools.extractFrom(o, ['z', 'x', 'y']);
        expect(q[0]).toBe(undefined);
        expect(q[1]).toBe(undefined);
        expect(q[2]).toBe(undefined);
        expect(q).toHaveLength(3);
      });
    });
    describe('Object Input', () => {
      test('All object keys exist', () => {
        const q = tools.extractFrom(
          o,
          {
            a: 10,
            b: 20,
            c: 'test',
          },
        );
        expect(q[0].obj.value()).toEqual(1);
        expect(q[0].value).toEqual(10);
        expect(q[2].obj.execute(100)).toBe(101);
        expect(q[2].value).toBe('test');
        expect(q).toHaveLength(3);
      });
      test('Some object keys exist', () => {
        const q = tools.extractFrom(
          o,
          {
            a: 10,
            z: 20,
            c: 'test',
          },
        );
        expect(q[0].obj.value()).toEqual(1);
        expect(q[0].value).toEqual(10);
        expect(q[1].obj.execute(100)).toBe(101);
        expect(q[1].value).toBe('test');
        expect(q).toHaveLength(2);
      });
    });
  });
});
