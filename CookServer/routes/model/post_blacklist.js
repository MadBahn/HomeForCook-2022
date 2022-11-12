const mongoose = require('mongoose');

const postBlacklistSchema = mongoose.Schema({
    blackid: {type: String, unique: true},
    userid: String,
});

const postBlacklistModel = mongoose.model('postBlacklistModel',
    postBlacklistSchema,
    'post_blacklist');

module.exports = postBlacklistModel;