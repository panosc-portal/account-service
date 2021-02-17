const getUserId = function (userInfo) {
  return userInfo.get('the_userid_claim')
}

const getUID = function (userInfo) {
  return userInfo.get('the_uid_claim')
}

const getGID = function (userInfo) {
  return userInfo.get('the_gid_claim')
}

const getHomePath = function (userInfo) {
  return userInfo.get('the_home_directory_claim')
}


module.exports = {
  getUserId: getUserId,
  getUID: getUID,
  getGID: getGID,
  getHomePath: getHomePath
};
