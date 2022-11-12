const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const uuid = require("uuid");

const Mongo_Common = require("../common/mongo_server");
const errCode = require("../common/err_code");
const commonScript = require("../common/common_script");

//user data
const userInfoModel = require("../model/user_info");
const userAuthModel = require("../model/user_auth");
//content data
const shareModel = require("../model/share");
const themeModel = require("../model/theme");
const discussModel = require("../model/discuss");
const commentModel = require("../model/comment");
//notify
const notifyModel = require("../model/notify");
const postBlacklistModel = require("../model/post_blacklist");

router.get("/", function (req, res) {
    res.send('OK');
})

//小程序部分无需调用
router.get("/count/:type",function (req, res){
    //初始化数据前获取数据条数
    const { type } = req.params;

    const _exec = (m) => {
        m.find().count().exec(function (e, r) {
            if(e) return res.send(e);
            return res.send({...errCode.OK, data: {count: r}});
        })
    }
    switch (type) {
        case 's': _exec(shareModel);break;
        case 'c': _exec(commentModel);break;
        case 't': _exec(themeModel);break;
        case 'd': _exec(discussModel);break;
        case 'u': _exec(userInfoModel);break;
    }
});

//小程序部分无需调用
router.post("/data", function (req, res) {
    const { type, start_at, amount } = req.body;
    // console.log(req.body);

    let m;
    let final = [];

    const _exec = (m, isUser) => {
        m.find().sort('-post_date').count().exec(function (error, count) {
            if(error) return res.send(error);
            if(count !== 0) {
                m.find().skip(start_at).limit(amount)
                    .exec(function (ef, rf) {
                        // console.info(rf);
                        if(ef) return res.send(ef);

                        for(let i = 0 ; i < rf.length ; i ++) {
                            // console.log("i:",rf[i]);
                            const t = rf[i]._doc;
                            userInfoModel.findOne({userid: t.userid})
                                .exec(async function (eu, ru) {
                                    if(eu) return res.send(eu)
                                    if(ru) {
                                        if(!isUser){
                                            delete t.userid;
                                            t.user = ru._doc.username;
                                        } else {
                                            t.isBan = !!(await postBlacklistModel.findOne({userid: t.userid}).exec().then());
                                        }
                                        final.push(t);
                                        if(i === rf.length - 1){
                                            // console.log(final)
                                            res.send({...errCode.OK,data: final});
                                        }
                                    }
                                });
                        }
                    });
            }
            else return res.send({...errCode.DATA_NOT_EXIST});
        });
    }

    switch(type){
        case "share":{
            _exec(shareModel, false);
            break;
        }
        case "comment":{
            _exec(commentModel, false);
            break;
        }
        case "topic":{
            _exec(themeModel, false);
            break;
        }
        case "discuss":{
            _exec(discussModel, false);
            break;
        }
        case "user":{
            _exec(userInfoModel, true);
            break;
        }
    }
});

//彻底删除
//小程序部分无需调用
router.post("/del_content_complete", function (req, res){
    const { id_in } = req.body;

    const type = id_in.at(0);

    const _del = (m, q) => {
        m.findOneAndDelete(q).exec(function (err) {
            if(err) return res.send(err);
            res.send({...errCode.OK_NO_DATA, desc: "deleted the content"});
        });
    }

    switch(type) {
        case "u":
            //特殊操作
            userAuthModel.findOneAndDelete({userid: id_in}).exec(function (e1, r1) {
                if(e1) return res.send(e1);
                _del(userInfoModel, {userid: id_in});
            });
            break;
        case "s":
            _del(shareModel, {sid: id_in});
            break;
        case "c":
            _del(commentModel, {cid: id_in});
            break;
        case "t":
            _del(themeModel, {tid: id_in});
            break;
        case "d":
            _del(discussModel, {did: id_in});
            break;
    }
});
//notify

router.post("/post_notify", async function (req, res) {
    const { notify_id, userid, refer_to, content } = req.body;

    let result;

    const [isNExist, isUExist, isCExist] = [
        await notifyModel.findOne({notify_id: notify_id}).exec().then(),
        await userInfoModel.findOne({userid: userid}).exec().then(),
        await commonScript.getContent(refer_to)
    ];

    console.log(isCExist);

    if(!isNExist && isUExist && isCExist && (userid !== isCExist.userid)){
        const writeN = new notifyModel({
            notify_id: notify_id,
            userid: userid,
            post_date: new Date(),
            refer_to: refer_to,
            content: content,
            isDone: false
        });
        result = {...errCode.OK,data: await writeN.save()};
    } else {
        if(isNExist){
            result = {...errCode.DATA_EXIST, desc: "Notify Exists."};
        } else if(!isUExist){
            result = {...errCode.DATA_NOT_EXIST, desc: "User not exist"};
        } else if(!isCExist){
            result = {...errCode.DATA_NOT_EXIST, desc: "Content not exist"};
        } else if(isCExist.userid === userid){
            result = {...errCode.PARAM_ERROR, desc: "Not the same."};
        }
    }

    res.send(result);

});

//小程序部分无需调用
router.post("/get_notify", async function (req, res) {
    const { start_at, amount, isRecent, isDetail } = req.body;

    mongoose.connect(Mongo_Common.URL).then(() => console.log("success"));

    const q = isRecent ? {isDone: false} : {}
    let result;

    if(await notifyModel.find().count().exec().then() !== 0){
        let tmp = await notifyModel
            .find(q)
            .sort("-post_date")
            .skip(start_at)
            .limit(amount)
            .exec()
            .then();

        let final = [];

        for (let i = 0; i < tmp.length ; i++){
            let tt = tmp[i]._doc;
            const tu = await userInfoModel.findOne({userid: tt.userid}).exec().then()
            if(tu) {
                delete tt.userid;
                tt.user = tu._doc;
            }
            if(isDetail) {
                const _tmp = tt.refer_to;
                const t_r = (await commonScript.getContent(_tmp));
                // console.log(t_r);
                if(t_r){
                    tt.refer_to = t_r._doc;
                    const utt = (await userInfoModel.findOne({userid: tt.refer_to.userid}).exec().then());
                    if(utt){
                        delete tt.refer_to.userid;
                        tt.refer_to.raw_user = utt._doc;
                    }
                } else tt.refer_to = _tmp;
            }
            final.push(tt);
        }
        result = {...errCode.OK, data: final};
    } else {
        result = {...errCode.DATA_NOT_EXIST, desc: "There's no notify yet."};
    }

    res.send(result);
});

//小程序部分无需调用
router.post("/exec_notify", async function (req, res) {
    const { notify_id } = req.body;
    let result;

    const tn = await notifyModel
        .findOne({notify_id: notify_id})
        .exec()
        .then();

    if(tn && !tn.isDone){
        const tc = await commonScript.getContent(tn.refer_to);
        if(tc) {
            //add the user into the blacklist
            const tu = await userInfoModel.findOne({userid: tc.userid}).exec().then();
            if(tu && !tu.isDel){
                const tmp_id = "b"+uuid.v4();
                const tmp = await postBlacklistModel.findOne({blackid: tmp_id, userid: tu.userid}).exec().then()
                console.log(tmp);
                if(!tmp) {
                    const bli = new postBlacklistModel({
                        blackid: tmp_id,
                        userid: tu.userid
                    });
                    await bli.save().then(r => console.log(r)).catch(err => console.log(err));
                }
            }
            await tc.set({isDel: true}).save();
        }
        await tn.set({isDone: true}).save();
        result = {...errCode.OK_NO_DATA, desc: "Successfully done."};

    } else {
        if(!tn) result = {...errCode.DATA_NOT_EXIST, desc: "No notify."};
        else if(tn.isDone) result = {...errCode.DATA_EXIST, desc: "Notify already done."};
        // else if(!tc) result = {...errCode.DATA_NOT_EXIST, desc: "No content."};
    }

    res.send(result);
});

//小程序部分无需调用
router.post("/remove_blacklist", async function (req, res) {
    const { userid } = req.body;
    let result = {};

    postBlacklistModel
        .find({userid: userid})
        .exec()
        .then(async re => {
            console.log(re);
            if(re) {
                await postBlacklistModel
                    .deleteMany({userid: userid})
                    .exec()
                    .then(rf => {
                        if(rf) result = {...errCode.OK_NO_DATA, desc: "Successfully removed"};
                    })
                    .catch(ef => {
                        if(err) result = {...errCode.DATA_NOT_EXIST, desc: "Something wrong during the operation."};
                    });
            }
        })
        .catch(err => {
            console.log(err);
            if(err) result = {...errCode.DATA_NOT_EXIST, desc: "Something wrong during the operation."};
        });

    res.send(result);

})

module.exports = router;