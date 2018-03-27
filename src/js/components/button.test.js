import React from 'react';
import renderer from 'react-test-renderer';
import Button from './button';

describe('Button', () => {
  // test('dummy', () => {
  //   expect(true).toBe(true);
  // });
  test('Should render correctly', () => {
    const component = renderer.create(<Button />);
    const tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });
});

