"use strict;"

var ATSession = require('atsession.js');
var tardy = require('tardy.js');
var session  = new ATSession();
var Table = require('cli-table');

session.set_debug_level(2); // 2 = verbose
session.set_debug_level(0); // 0 = none
session.start();

function GetMarketInfoR(mkt, table, i) {
  var bid=mkt.Bid.toFixed(8); if (bid<=0) {bid='';}
  var ask=mkt.Ask.toFixed(8); if (ask<=0) {ask='';}
  var last=mkt.LastPrice.toFixed(8); if (ask<=0) {ask='';}

  table[i]=[mkt.Name, mkt.Partner, bid, ask, last];
}

function GetAllActiveMarketsR(mkts) {
  var table = new Table({
    head: ['name', 'ptnr', 'bid', 'ask', 'last'],
    colWidths: [6, 6, 18, 18, 18],
  });
  var num_markets=mkts.length;
  var num_returns=0;
  var i;

  for (i=0; i<num_markets; i++) {
// http://stackoverflow.com/questions/1203876/how-to-pass-a-variable-by-value-to-an-anonymous-javascript-function
    (function(mkt, i) {
      table.push([mkt.Name,mkt.Partner,'','']);
      session.rpc('infoHub','getMarketInfo', [mkt.Name, mkt.Partner], function(r) {
        GetMarketInfoR(r, table, i);
        if (++num_returns==num_markets) {
          console.log(table.toString());
          process.exit();
        }
        return true;
      });
    })(mkts[i], i);
  }

  return true;
}

session.rpc('infoHub','getAllActiveMarkets', [], GetAllActiveMarketsR);

//getInitMarketPage(coin, partner, username, authtoken)
//getMarketAvailableBalance(coin, partner, username, authtoken)
//getMarketInfo(coin, partner)
//getOpenBuyOrders(coin, partner, username, authtoken)
//getOpenSellOrders(coin, partner, username, authtoken)
//getRecentTrades(count)
//getRichList(coin, username, authtoken)
//getTradeHistory(coin, partner)
//getTradersList(coin, partner, username, authtoken)
