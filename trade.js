var ATSession = require('atsession');
var session  = new ATSession();

function success() {
  console.log("logged in");
}

function failure() {
  console.log("authentication failure");
  process.exit();
}

function CreateBuyOrderR(ret) {
  console.log(ret);

  process.exit();
  return false;
}

// AmountChange, Ask, AveragePrice, Bid, BuyFee, DayAverage, DayHigh, DayLow, DayVolume,
// FullName, FullPartner, LastPrice, MarketCap, MinTradeAmount, Name, NetworkFee,
// Notices[], Partner, PercentChange, RXFee, SellFee, TXFee, Weeks52
function GetMarketInfoR(info) {
  buyfee=info.BuyFee;   //0.0025
  sellfee=info.SellFee; //0.0025
  min=info.MinTradeAmount; //0.0001

  console.log("buyfee: "+buyfee);
  console.log("sellfee: "+sellfee);
  console.log("min: "+min);

  var coin=process.argv[2];
  var ptnr=process.argv[3];
  var action;
  if (process.argv[4] === 'buy') {
    action='createBuyOrder';
  } else if (process.argv[4] === 'sell') {
    action='createSellOrder';
  } else {
    process.exit();
  }
  var price=process.argv[5];
  var cost_or_quantity=process.argv[6];
  session.rpc('tradeHub',action, [coin, ptnr, price, cost_or_quantity], CreateBuyOrderR);

  return true;
}

session.set_debug_level(2); // 2 = verbose
session.set_debug_level(0); // 0 = none
session.start();
session.useauthtoken(success, failure);
session.usepin(success, failure);
var coin=process.argv[2];
var ptnr=process.argv[3];
session.rpc('infoHub','getMarketInfo', [coin, ptnr], GetMarketInfoR);
