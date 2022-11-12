//分享，可独立展示内容
const mongoose = require('mongoose');

const shareSchema = mongoose.Schema({
    sid: {type: String, unique: true, required: true},
    userid: {type: String},
    title: {type: String},
    //support HTML content
    content: String,
    post_date: Date,
    isDel: Boolean,
});

const shareModel = mongoose.model('shareModel',
    shareSchema,
    'share');

module.exports = shareModel;