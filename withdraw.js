var ATSession = require('atsession');
var session  = new ATSession();
var cs = require('coinstring');
var Table = require('cli-table');

function success() {
  console.log("logged in");
}

function failure() {
  console.log("authentication failure");
  process.exit();
}

//message {"R":{"Explorer":"","Facebook":null,"Faucet":"","Forum":null,"FullName":"Litecoin","ImgUrl":"","LastBlock":718931,"LastBlockHash":"e59d4d24d45485495fa6f274362c78c7c5ec5ae346f5416a95c7ed4008bd6545","LastBlockTime":"2015-01-27T17:22:10","LatestVersion":null,"MinConfs":3,"MinDepositAmount":0.0010000000,"MinWithdrawal":0.1000000000,"Name":"LTC","RunningVersion":null,"Twitter":null,"Website":""},"I":"4"}
function GetCoinInfoR(res) {
  console.log(res.Name, res.LastBlock, res.LastBlockTime);
  return true;
}

function gpw() {
  session.rpc('walletHub', 'getPendingWithdrawals', [], GetPendingWithdrawalsR);
  if (globalcoin) {
    session.rpc('infoHub', 'getCoinInfo', [globalcoin], GetCoinInfoR);
  }
}

function GetPendingWithdrawalsR(res) {
  if (res.length>0) {
    res.forEach(function(obj) {
      var table = new Table({
        chars: {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''},
      });
      Object.keys(obj).forEach(function(key) {
        table.push([key, obj[key]]);
      });
      console.log(table.toString());
    });
    setTimeout(gpw, 120000); //120 seconds
    return true;
  } else {
    console.log(res);
    process.exit();
  }
}

function WithdrawCoinsR(res) {
  console.log(res);
  gpw();
}

session.set_debug_level(2); // 2 = verbose
session.set_debug_level(0); // 0 = none
session.start();
session.useauthtoken(success, failure);
session.usepin(success, failure);
var globalcoin=process.argv[2];
var qty=process.argv[3];
var addr=process.argv[4];
if (qty>0) {
  try {
    if (globalcoin==='BLC') {
      var d = cs.decode_blc(addr);
    } else if (addr.substring(0,1)!=='@') {
      var d = cs.decode(addr);
    } else {
      var d = '';
    }
    console.log(d);
    session.rpc('walletHub','withdrawCoins', [globalcoin, qty, addr], WithdrawCoinsR);
  } catch (e) {
    console.log('bad address');
    console.log(e);
    process.exit();
  }
} else {
  gpw();
}
