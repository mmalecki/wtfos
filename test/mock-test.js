var assert = require('assert'),
    cb = require('assert-called'),
    wtfos = require('../');

wtfos.result = {
  distribution: 'ubuntu'
};

wtfos(cb(function (err, data) {
  assert(!err);
  assert.deepEqual(data, {
    distribution: 'ubuntu'
  });
}));
