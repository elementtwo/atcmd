var ATSession = require('atsession');
var session  = new ATSession();
var Table = require('cli-table');

var doExit = true;
var doExit = false;

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
    if (functions[hub]) {
      pushFunctions(table, functions, hub);
    } else {
      Object.keys(functions).forEach(function(h) {
        Object.keys(functions[h]).forEach(function(func) {
          if (hub===func) {
            table.push([h, func, functions[h][func]]);
          }
        });
      });
    }
  } else {
    Object.keys(functions).forEach(function(hub) {
      pushFunctions(table, functions, hub);
    });
  }
  console.log(table.toString());
}

function arrayEqual(arr1, arr2) {
  return (JSON.stringify(arr1) == JSON.stringify(arr2));
}

function printArray(arr) {
  if (arrayEqual(arr, [])) {
    console.log("[]");
    return true;
  }
  var keys=[];
  var widths=[];
}

function callback(res) {
  if (Array.isArray(res)) {
    if (arrayEqual(res, [])) {
      console.log("[]");
      if (doExit) {
        process.exit();
      } else {
        return true;
      }
    }
    var keys=[];
    var widths=[];
    res.forEach(function(ele) {
      if (arrayEqual(keys, [])) {
        keys=Object.keys(ele);
        keys.forEach(function(key, idx) {
          key_len=key.length;
          val_len=ele[key].toString().length;
          if (key_len>val_len) {
            widths[idx]=key_len+2;
          } else {
            widths[idx]=val_len+2;
          }
        });
      } else if (arrayEqual(keys, Object.keys(ele))) {
        keys.forEach(function(key, idx) {
          var val_len=ele[key].toString().length;
          if (widths[idx]<val_len+2) {
            widths[idx]=val_len+2;
          }
        });
      } else {
        console.log(res);
        return true;
      }
    });
    var table = new Table({
      head: keys,
      colWidths: widths,
      chars: {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''},
    });
    res.forEach(function(ele) {
      keys=Object.keys(ele);
      var arr=[];
      keys.forEach(function(key, idx) {
        arr.push(ele[key]);
      });
      table.push(arr);
    });
    console.log(table.toString());
    if (doExit) {
      process.exit();
    } else {
      return true;
    }
  } else {
    console.log(res);
    if (doExit) {
      process.exit();
    } else {
      return true;
    }
  }
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
  session.rpc(hub, func, process.argv.slice(4), callback);
}
