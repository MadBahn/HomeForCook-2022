const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const uuid = require("uuid");

const errCode = require("../common/err_code");

const userInfoModel = require("../model/user_info");
const userAuthModel = require("../model/user_auth");


router.get("/",function (req, res) {
    console.log("a"+uuid.v4());
    // nanoid.nanoid()
    res.send("a"+uuid.v4());
});

//register

/*

url: localhost:3000/api/user/register
{
    "info":{
        "userid":"u123",
        "username":"Tom",
        "gender":"M",
        "birthday":"2/2/1990",
        "isDel":false,
        "headImg":""
    },
    "auth":{
        "aid":"a123",
        "userid":"u123",
        "auth_name":"tom",
        "password":"123456",
        "isDel":false
    }
}
*/
router.post("/register", function (req, res) {
    const { info , auth } = req.body;
//    首先查询用户信息和相应的认证信息，两者均不存在时即可创建
//    写入顺序：1.user_info 2.user_auth
    

    // console.info("auth:",auth);

    userAuthModel.findOne({"auth_name":auth.auth_name}).exec( function (errorA, resultA) {
        if(errorA) return res.send(errorA);
        if(resultA){
            // console.log(resultA);
            return res.send({...errCode.DATA_EXIST, desc: "auth exists"});
        }
        else userAuthModel.findOne({"aid":auth.aid})
            .exec( function (errorA, resultA) {
                // console.info("result:",resultA);
                if(errorA) return res.send(errorA);
                if(resultA){
                    if (resultA.userid === auth.userid) {
                        //aid、userid、登录用户名三者之一不能与现有的数据相冲突
                        return res.send({...errCode.DATA_EXIST, desc: "auth exists"});
                    }
                }
                else userInfoModel.findOne({"userid": info.userid}).exec( function (errorI, resultI) {
                    //userid不能与现有的冲突
                    if(errorI) return res.send(errorI);
                    if(resultI) return res.send({...errCode.DATA_EXIST,desc: "user exists"});
                    const _info = new userInfoModel(info);
                    const _auth = new userAuthModel(auth);
                    _info.save(function (err, ri) {
                        if(err) return res.send(err);
                        _auth.save(function (errA) {
                            if(errA) return res.send(errA);
                            res.send({...errCode.OK_NO_DATA, desc: "registered successfully"});
                        });
                    });
                });
            });
    });

});

//login

/*
url: localhost:3000/api/user/login

{
    "auth":{
        "auth_name":"tom",
        "password":"123456",
    }
}

*/
router.post("/login", function (req, res) {
    // console.info(req.body)
    const { auth_name, password } = req.body;

    // console.info(auth);
//成功获取认证信息后根据用户id查询用户信息

    userAuthModel.findOne({"auth_name": auth_name, "password": password}).exec(function (error, result) {
        if(error) return res.send(error);
        else if(!result || result.isDel) return res.send({...errCode.LOGIN_ERROR});
        // console.info(result);
        else userInfoModel.findOne({"userid":result.userid}).exec(function (errorU, resultU) {
            if(errorU) return res.send(errorU);
            if(!resultU || resultU.isDel) return res.send({...errCode.LOGIN_ERROR, desc:"no user use the auth"});

            console.info(result);

            const final = resultU._doc;
            // delete final.userid;

            // final.user = resultU._doc;

            console.log("final:",final);

            return res.send({...errCode.OK, data: final});
            // return res.send({...errCode.OK, data: resultU});
        });
    });
});

router.get("/get_user/:userid", function (req, res) {
    const { userid } = req.params;
    
    userInfoModel.find({userid: userid}).exec(function (error, result) {
        if(error) return res.send(error);
        if(result) return res.send({...errCode.OK,data: result});
        else return res.send({...errCode.DATA_NOT_EXIST, desc: "no user"});
    })
})

/*
{
    "userid":"u123",
    "newInfo":{
        "username":"Suka"
    }
}
* */

//modify_info
router.post("/mod_info", function (req, res) {
    const { userid, newInfo } = req.body;
//首先查找用户，获得数据后进行修改

    userInfoModel.findOne({"userid": userid}).exec( function (error, result) {
        if(error) return res.send(error);
        if(result && !result.isDel) {
            result.set(newInfo);
            result.save( function (errF, resultF) {
                if(errF) return res.send(errF);
                res.send({...errCode.OK,data: resultF});
            });
        }
        else return res.send({...errCode.DATA_NOT_EXIST, desc: "user not exists"});
    });
});
//modify_auth
router.post("/mod_auth", function (req, res) {
    const { auth, newAuth } = req.body;
//首先认证，通过后修改

    userAuthModel.findOne(auth).exec(function (error, result){
        if(error) return res.send(error);
        if(result && !result.isDel) {
            result.set(newAuth);
            result.save( function (ef, rf) {
                if(ef) return res.send(ef);
                res.send({...errCode.OK, data: rf});
            })
        }
        else return res.send({...errCode.LOGIN_ERROR, desc: "Authentication failed"});
    })
});

router.post("/delete_user", async function (req, res) {
    const { userid } = req.body;
    let result = {};

    const ua = await userAuthModel.findOne({userid:userid}).exec().then();
    const ui = await userInfoModel.findOne({userid:userid}).exec().then();

    if(ui && ua) {
        await ua.set({isDel: !ua.isDel}).save();
        await ui.set({isDel: !ui.isDel}).save();
        result = {...errCode.OK_NO_DATA, desc: "user locked."};
    } else {
        result = {...errCode.DATA_NOT_EXIST,desc: "no user"};
    }

    res.send(result);
});

module.exports = router;