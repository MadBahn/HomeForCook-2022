//话题，需要讨论以展示其内容
const mongoose = require('mongoose');

const themeSchema = mongoose.Schema({
    tid: {type: String, unique: true, required: true},
    title: {type: String},
    post_date: Date,
    userid: {type: String},
    isDel: Boolean,
});

const themeModel = mongoose.model('themeModel',
    themeSchema,
    'theme');

module.exports = themeModel;