//讨论
const mongoose = require('mongoose');

const discussSchema = mongoose.Schema({
    did: {type: String, unique: true, required: true},
    tid: {type: String},
    userid: {type: String},
    post_date: Date,
    //support HTML content
    content: String,
    // main, attach
    //optional
    attach_did: String,
    isDel: Boolean,
});

const discussModel = mongoose.model('discussModel',
    discussSchema,
    'discuss');

module.exports = discussModel;