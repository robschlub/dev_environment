// @flow

import * as tools from './tools/tools';

tools.Console(tools.add(2, 10).toString());
tools.Console(tools.mulToString(2, 5).toString());

const myId:HTMLElement | null = document.getElementById('intro');

if (myId instanceof HTMLElement) {
  myId.innerHTML = '<p>Hello from JS - Auto deployed by travis!!</p>';
}
