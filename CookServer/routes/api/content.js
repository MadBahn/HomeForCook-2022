const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");

const errCode = require("../common/err_code");
const commonScript = require("../common/common_script");

//user data
const userInfoModel = require("../model/user_info");
//content data
const shareModel = require("../model/share");
const themeModel = require("../model/theme");
const discussModel = require("../model/discuss");
const commentModel = require("../model/comment");
const postBlacklistModel = require("../model/post_blacklist");

// Write the router here.

/*

share{
    content
    comments{
        comment1{},
        comment2{},
        ......
        commentN{}
    }
}

topic{
    discuss1{},
    discuss2{},
    ......
    discussN{}
}


*/


/*
s
{
    "sid":"",
    "userid":"",
    "content":"",
    "isDel": false
}

c
{
    "type":"comment",
    "data":{
        "cid":"c1122",
        "sid":"s4123",
        "userid":"u123",
        "content":"asd",
        "isDel": false
    }
}

d
{
    "did":"",
    "tid":"",
    "userid":"",
    "content":"",
    "isDel": false
    "type":"attach",
    "attach_did":"",
    "isDel":false
}
*/

//post
router.post("/post_content", function (req, res) {
    //ES6语法
    const { type, data } = req.body;
    let model,query;
    //save data
    //写数据库闭包
    const exec = function () {
        model.set({post_date: new Date()})
        model.save(function (err, r) {
            if(err) return res.send(err);
            res.send({...errCode.OK_NO_DATA, desc: "WRITE SUCCESSFULLY"});
        });
    }

    // console.log(model);
    //user & content query.
    userInfoModel.findOne({userid:data.userid}).exec(async function (error, result) {
        if(error) return res.send(error);
        const bl = await postBlacklistModel.find({userid: data.userid}).exec().then();
        console.log(bl);
        if(!result) return res.send({...errCode.DATA_NOT_EXIST, desc: "user not exist"});
        else if(bl.length !== 0) return res.send({...errCode.USER_BAN});
        else {
            switch (type) {
                case "share":
                    if(data.sid !== undefined && data.sid !== "") {
                        model = new shareModel(data);
                        query = {'sid':data.sid};
                        shareModel.findOne(query).exec(function (errorS, resultS) {
                            if(errorS) return res.send(errorS);
                            if(resultS) return res.send({...errCode.DATA_EXIST, desc: "share exists"});
                            else exec();
                        });
                    }
                    else {
                        res.send({...errCode.PARAM_ERROR, desc:"id error!"});
                    }
                    break;
                case "comment":
                    if(data.cid !== undefined && data.cid !== ""){
                        model = new commentModel(data);
                        query = {'cid':data.cid};
                        commentModel.findOne(query).exec(function (errorC, resultC) {
                            if(errorC) return res.send(errorC);
                            if(resultC) return res.send({...errCode.DATA_EXIST, desc: "comment exists."});
                            else shareModel.findOne({"sid": model.sid}).exec(function (errorS, resultS) {
                                console.log("share:",resultS,errorS);
                                if(errorS) res.send(errorS);
                                if(!resultS) return res.send({...errCode.DATA_NOT_EXIST, desc: "share not exists."});
                                else exec();
                            });
                        });
                    }
                    else {
                        res.send({...errCode.PARAM_ERROR, desc:"id error!"});
                    }
                    break;
                case "discuss":
                    if(data.did !== undefined && data.did !== "") {
                        model = new discussModel(data);
                        query = {'did':data.did};
                        themeModel.findOne({"tid":model.tid}).exec(function (errorT, resultT) {
                            if(errorT) return res.send(errorT);
                            if(!resultT) return res.send({...errCode.DATA_NOT_EXIST, desc: "topic not exists."});
                            else discussModel.findOne(query).exec( function (errorD, resultD) {
                                if(errorD) return res.send(errorD);
                                if(resultD) return res.send({...errCode.DATA_EXIST, desc: "discuss exists."});
                                else exec();
                            });
                        });
                    }
                    else {
                        res.send({...errCode.PARAM_ERROR, desc:"id error!"});
                    }
                    break;
            }
        }
    });
});

/*
{
    "t_data": {
        "tid": "t1122",
        "title": "hello",
        "userid": "u1234",
        "isDel": false
    },
    "d_data": {
        "did": "d1142",
        "tid": "t1122",
        "userid": "u1234",
        "content": "asqw",
        "type": "main",
        "attach_did": "",
        "isDel": false
    }
}
*/

router.post("/create_theme", function (req, res) {
    //main
    const { t_data, d_data } = req.body;

//    先创建topic，后创建discuss

    userInfoModel.findOne({userid:t_data.userid}).exec(async function (error, result) {
        if(error) return res.send(error);
        if(!result) return res.send({...errCode.DATA_NOT_EXIST,desc: "user not exist"});
        else if((await postBlacklistModel.find({userid:t_data.userid}).exec().then()).length !== 0) return res.send({...errCode.USER_BAN});
        else {
            if( (t_data.tid !== undefined && t_data.tid !== "")
                &&
                (d_data.did !== undefined && d_data.did !== "")) {
                themeModel
                    .findOne({"tid":t_data.tid})
                    .exec( function (error, result) {
                        // console.log(error, result);
                        if(error) return res.send(error);
                        if(result) return res.send({...errCode.DATA_EXIST, desc: "topic exists."});
                        else discussModel
                            .findOne({"did":d_data.did})
                            .exec(function (errorD, resultD) {
                                if(errorD) return res.send(errorD);
                                if(resultD) return res.send({...errCode.DATA_EXIST, desc: "discuss exists."});
                                else {
                                    const tModel = new themeModel(t_data);
                                    const dModel = new discussModel(d_data);
                                    tModel.set({post_date: new Date()});
                                    dModel.set({post_date: new Date()});
                                    tModel.save(function (err, r) {
                                        if(err) return res.send(err);
                                        dModel.save(function (err1, r1) {
                                            if(err1) return res.send(err1);
                                            res.send({...errCode.OK_NO_DATA, desc: "CREATED SUCCESSFULLY"});
                                        })
                                    });
                                }
                            });
                    });
            }
            else res.send({...errCode.PARAM_ERROR, desc: "ID ERROR!!!"});
        }
    });
});
//delete

router.post("/delete_content", function (req, res) {
    const { data } = req.body;
//使用字符串解析法判断id

    const _save = (m, q) => {
        m.findOne(q).exec(function (err, r) {
                if(err) return res.send(err);
                if(!r) return res.send({...errCode.DATA_NOT_EXIST});
                else {
                    r.set({isDel: !r.isDel});
                    // console.log(r);
                    r.save(function (err, rr) {
                        if (err) return res.send(err);
                        if (rr) return res.send({...errCode.OK_NO_DATA, desc: "locked"});
                    })
                }
            });

    }
    const first = data.at(0);
    // let model;
//    匹配： s, c, t, d

    //注： 此处仅修改isDel属性
    switch (first) {
        case "s":
            _save(shareModel, {sid:data});
            break;
        case "c":
            _save(commentModel, {cid:data});
            break;
        case "t":
            _save(themeModel, {tid:data});
            break;
        case "d":
            _save(discussModel, {did:data});
            break;
    }
});

//delete the comment

//delete the discuss

router.get("/get_content/:get_id", async function (req, res) {
    const { get_id } = req.params;
    const type = get_id.at(0);

    console.log(get_id);

    const c = (await commonScript.getContent(get_id));

    // console.log("c:",c);

    let result = {};
    let final = {
        main: {},
        comments: [],
        discusses: []
    };

    if(type === "s") delete final.discusses;
    else delete final.comments;

    if(c && !c.isDel){
        const cc = c._doc
        let u = await userInfoModel.findOne({userid: c.userid}).exec().then();
        // console.log(u);
        if(u){
            delete cc.userid;
            cc.user = u._doc;
        }
        final.main = cc;
        let sub;
        if(type === "s") sub = await commonScript.getSubContent(c.sid);
        else sub = await commonScript.getSubContent(c.tid);

        console.log("sub: ",sub);

        for (let i = 0; i < sub.length; i++){
            if(!sub[i].isDel) {
                const sub_t = sub[i]._doc;
                const ut = (await userInfoModel.findOne({userid: sub[i].userid}).exec().then())._doc
                if(ut){
                    delete sub_t.userid;
                    sub_t.user = ut;
                    if(type === "s") final.comments.push(sub_t);
                    else final.discusses.push(sub_t);
                }
            }
        }
        console.log(final);
        result = {...errCode.OK, data: final};
    } else if(!c || c.isDel) {
        result = {...errCode.DATA_NOT_EXIST, desc: "No such content."};
    }

    res.send(result);

//    如果是share，首先加载share（一条），然后加载comment（多条）
//    如果是theme，首先加载theme（一条），然后加载discuss（多条）
});

router.post("/list", function (req, res) {
    const { type, start_at, amount } = req.body;
    // console.log(req.body);

    let m;
    let final = [];

    const _exec = (m) => {
        m.find().count().exec(function (error, count) {
                if(error) return res.send(error);
                if(count !== 0) {
                    m.find({isDel: false}).skip(start_at).limit(amount).sort('-post_date')
                        .exec(async function (ef, rf) {
                            // console.info(rf);
                            if(ef) return res.send(ef);
                            for(let i = 0 ; i < rf.length ; i ++) {
                                // console.log("i:",rf[i]);
                                const t = rf[i]._doc;
                                await userInfoModel.findOne({userid: t.userid, isDel: false})
                                    .exec(function (eu, ru) {
                                        if(eu) return res.send(eu)
                                        if(ru && !ru.isDel) {
                                            delete t.userid;
                                            t.user = ru._doc;
                                            console.log(final);
                                        }
                                        final.push(t);
                                        if(i === rf.length - 1){
                                            console.log(final);
                                            res.send({...errCode.OK, data: final});
                                        }
                                    });
                            }
                        });
                }
                else return res.send({...errCode.DATA_NOT_EXIST, desc: "There's no data yet."});
            });
    }
//    s, t
    switch(type){
        case "share":{
            m = shareModel;
            break;
        }
        case "topic":{
            m = themeModel;
            break;
        }
    }
    _exec(m);
});

module.exports = router;
