import * as tools from './tools';

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

test('btn, btn -test -> btn btn-test', () => {
  expect(tools.classify('btn', 'btn -test')).toBe('btn btn-test');
});

test('btn, -test -test2 -> btn btn-test btn-test2', () => {
  expect(tools.classify('btn', '-test -test2')).toBe('btn btn-test btn-test2');
});
