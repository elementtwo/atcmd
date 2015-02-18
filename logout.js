var ATSession = require('atsession');
var path = require('path');
var fs = require('fs');
var session  = new ATSession();

function filename(fname) {
  return path.join(session.confdir, fname);
}

function unlinkFile(fname) {
  //try { fs.mkdirSync(session.confdir); } catch (e) {}
  fs.unlinkSync(filename(fname));
}

try {
  unlinkFile("authtoken");
  unlinkFile("username");
  unlinkFile("password");
  unlinkFile("pin");
} catch (e) {
  console.log("read error");
}
