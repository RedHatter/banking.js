var url = require('url');

/**
 * Unique Id Generator
 *
 * @param {number} length
 * @return {string} radix
 * @return {string} uuid
 * @api private
 */

var Util = module.exports = {};

Util.uuid = function(len,radix) {
    var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var chars = CHARS, uuid = [];
    radix = radix || chars.length;

    if (len) {
      for (var i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    } else {
      var r;
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';

      for (var i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random()*16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }

    return uuid.join('');
};

/**
 * [mixin description]
 * @param  {[type]} base [description]
 * @param  {[type]} obj  [description]
 * @return {[type]}      [description]
 */

Util.mixin = function (base, obj) {
  for (var key in base) {
    obj[key] = (obj[key]) ? obj[key] : base[key];
  }
  return obj;
};

/**
 * Makes a secure request to an ofx server and posts an OFX payload
 * @param options
 * @param ofxPayload
 * @param cb
 */
Util.request = function(options, ofxPayload, cb) {
  var parsedUrl = url.parse(options.url);
  fetch(options.url, {
    method: 'POST',
    body: ofxPayload,
    headers: options.headers.reduce((all, header) => {
      if (options[header]) {
        all[header] = options[header];
      } else if (header === 'Content-Length') {
        all[header] = ofxPayload.length;
      } else if (header === 'Host') {
        all[header] = parsedUrl.host;
      }

      return all
    }, {})
  })
  .then(res => {
    if (res.ok) {
      return res.text()
    }

    cb(new Error(res.statusText), null);
  })
  .then(text => cb(false, text));
};
