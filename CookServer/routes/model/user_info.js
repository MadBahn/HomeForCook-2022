//用户信息
const mongoose = require('mongoose');

const userInfoSchema = mongoose.Schema({
    userid: {type: String, unique: true, required: true},
    username: {type: String, unique: true},
    headImg: String,
    gender: String,
    birthday: Date,
    isDel: Boolean,
});

const userInfoModel = mongoose.model('userInfoModel',
    userInfoSchema,
    'user_info');

module.exports = userInfoModel;