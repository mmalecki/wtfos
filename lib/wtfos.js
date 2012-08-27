var os = require('os'),
    which = require('which'),
    lsbRelease = require('lsb-release');

module.exports = function (cb) {
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
  else {
    //
    // WTFOS?!
    //
    cb(null, result);
  }
};
