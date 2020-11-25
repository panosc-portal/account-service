const setAccountAttributes = function(account, userInfo) {
  account.email = userInfo.get('email');
  account.uid = userInfo.get('uid');
  account.gid = userInfo.get('gid');
  account.homePath = userInfo.get('homeDirectory');
}

module.exports = {
  setAccountAttributes: setAccountAttributes
};
