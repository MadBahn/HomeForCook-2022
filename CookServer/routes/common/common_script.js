const mongoose = require("mongoose");

const shareModel = require("../model/share");
const commentModel = require("../model/comment");
const themeModel = require("../model/theme");
const discussModel = require("../model/discuss");

const Mongo_Common = require("../common/mongo_server");

const commonScripts = [];

commonScripts.getContent = async (id) => {
    switch( id.at(0) ){
        case 's':
            return await shareModel.findOne({sid: id}).exec().then()
        case 'c':
            return await commentModel.findOne({cid: id}).exec().then()
        case 't':
            return await themeModel.findOne({tid: id}).exec().then()
        case 'd':
            return await discussModel.findOne({did: id}).exec().then()
    }
}

commonScripts.getSubContent = async (sub_id) => {
    switch (sub_id.at(0)){
        case 's':
            return await commentModel.find({sid: sub_id}).exec().then()
        case 't':
            return await discussModel.find({tid: sub_id}).exec().then()
    }
}

commonScripts.connect = () => mongoose.connect(Mongo_Common.URL);

module.exports = commonScripts;