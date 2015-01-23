var ATSession = require('atsession');
var session  = new ATSession();
var Table = require('cli-table');

function success() {
  console.log("logged in");
}

function failure() {
  console.log("authentication failure");
  process.exit();
}

session.set_debug_level(2); // 2 = verbose
session.set_debug_level(0); // 0 = none
session.start();
session.useauthtoken(success, failure);
session.usepin(success, failure);

function pushFunctions(table, functions, hub) {
  Object.keys(functions[hub]).forEach(function(func) {
    table.push([hub, func, functions[hub][func]]);
  });
}

function printFunctions(functions, hub) {
  var table = new Table({
    head: ['hub', 'func', 'params'],
    colWidths: [12, 35, 75],
    chars: {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''},
  });

  if (hub) {
    pushFunctions(table, functions, hub);
  } else {
    Object.keys(functions).forEach(function(hub) {
      pushFunctions(table, functions, hub);
    });
  }
  console.log(table.toString());
}

var hub=process.argv[2];
var func=process.argv[3];
if (!hub) {
  printFunctions(session.getFunctions());
  process.exit();
} else if (!func) {
  printFunctions(session.getFunctions(), hub);
  process.exit();
} else {
  session.rpc(hub, func, process.argv.slice(4), null);
}
