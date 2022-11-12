let errCode = {};

errCode.OK = { errCode:"OK-100", data: {}};
errCode.OK_NO_DATA = {desc: "OK", errCode: "OK-200"};

errCode.PARAM_ERROR = {desc: "param error", errCode: "PARAM-100"};
errCode.PARAM_NOT_EXIST = {desc: "param not exist", errCode: "PARAM-200"};

errCode.LOGIN_ERROR = {desc: "check your authname or your password", errCode: "LOGIN-100"};

errCode.DATA_EXIST = {desc: "data exists", errCode: "DATA-100"};
errCode.DATA_NOT_EXIST = {desc: "data not exists", errCode: "DATA-200"};

errCode.USER_BAN = {desc: "user banned", errCode: "USER-100"};

module.exports = errCode;