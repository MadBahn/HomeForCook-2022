//评论
const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    cid: {type: String, unique: true},
    // attach to share
    sid: {type: String},
    userid: {type: String},
    post_date: Date,
//    text only
    content: {type: String},
    isDel: Boolean,
});

const commentModel = mongoose.model('commentModel',
    commentSchema,
    'comment');

module.exports = commentModel;