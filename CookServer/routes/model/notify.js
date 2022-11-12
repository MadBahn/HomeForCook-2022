const mongoose = require('mongoose');

const notifySchema = mongoose.Schema({
    notify_id: {type: String, unique: true, required: true},
    userid: String,
    post_date: Date,
    refer_to: String,
    content: String,
    isDone: Boolean
});

const notifyModel = mongoose.model('notifyModel',
    notifySchema,
    'notify');

module.exports = notifyModel;