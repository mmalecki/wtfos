var os = require('os'),
    which = require('which'),
    lsbRelease = require('lsb-release'),
    swVers = require('sw-vers');

module.exports = function (cb) {
  //
  // As silly as it seems, it makes mocking possible.
  // This API should not be considered stable.
  //
  if (typeof module.exports.result === 'object') {
    return process.nextTick(function () {
      cb(null, module.exports.result);
    });
  }

  var result = {};

  ['release', 'platform', 'type', 'arch'].forEach(function (f) {
    result[f] = os[f]();
  });

  if (result.type === 'Linux') {
    lsbRelease(function (err, lsb) {
      if (!err) {
        result.distribution = lsb.distributorID;
      }
      return cb(null, result);
    });
  }
  else if (result.type === 'SunOS') {
    which('pkgin', function (err) {
      //
      // If it has `pkgin`, it's SmartOS.
      // Remark: oversimplification?
      //
      if (!err) {
        result.distribution = 'SmartOS';
      }
      return cb(null, result);
    });
  }
  else if (result.type === 'Darwin') {
    swVers(function (err, data) {
      if (!err) {
        result.distribution = data.productName;
      }
      return cb(null, result);
    });
  }
  else {
    //
    // WTFOS?!
    //
    cb(null, result);
  }
};
