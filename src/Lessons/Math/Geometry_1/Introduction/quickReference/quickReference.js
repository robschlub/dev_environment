// var exports = module.exports = {};

// exports.remoteTest2 = {hello: 'there3'};

function abc() {
  console.log('asdf qwerty');
  if (window.quickReference == null) {
    window.quickReference = {};
  }
  window.quickReference.test = 'hello from quick referece';
}

abc();
