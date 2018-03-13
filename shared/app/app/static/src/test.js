// @flow

// function Console(text) {
//   console.log(text); // eslint-disable-line no-console
// }

// import Console from './mod_test';
// import cal from './mod_test';
import * as tools from './mod_test';

tools.Console(tools.add(1, 5).toString());
tools.Console(tools.mulToString(1, 5).toString());
