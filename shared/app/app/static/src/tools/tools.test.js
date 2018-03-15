import * as tools from './tools';

test('adds 1 + 2 to equal 3', () => {
  expect(tools.add(1, 2)).toBe(3);
});

test('divide 6 by 2 to equal 3', () => {
  expect(tools.divide(6, 2)).toBe(3);
});
