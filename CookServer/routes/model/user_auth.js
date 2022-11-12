//用户认证
const mongoose = require('mongoose');

const userAuthSchema = mongoose.Schema({
    aid: {type: String, unique: true},
    //一个用户只能有一个认证
    userid: {type: String},
    //用于登录的用户名是唯一的
    auth_name: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    isDel: Boolean,
});

const userAuthModel = mongoose.model('userAuthModel',
    userAuthSchema,
    'user_auth');

module.exports = userAuthModel;