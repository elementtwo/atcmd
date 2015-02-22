function _gpd(session, flag, done, output) {
  session.rpc('walletHub', 'getPendingDeposits', [], function (res) {
    return GetPendingDepositsR(res, session, flag, done, output);
  });
}

exports.gpd = function(session, done, output) {
  _gpd(session, 0, done, output);
};

function GetPendingDepositsR(res, session, flag, done, output) {
  output(res);
  if (res.length>0) {
    setTimeout(_gpd, 120000, session, 1, done, output); //120 seconds
  } else if (flag) {
    done();
  } else {
    setTimeout(_gpd, 120000, session, 0, done, output); //120 seconds
  }

  return true;
}
