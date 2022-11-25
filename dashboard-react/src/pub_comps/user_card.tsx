import React from 'react';
import {Card} from "antd";

interface user {
    userid: string,
    username: string,
    gender: string,
    birthday: Date,
    isDel: boolean,
    isBan: boolean
}

interface data {
    d: user
}

function UserCard(props : data) {
    const {d} = props;
    return (// @ts-ignore
        <Card bodyStyle={{display: "flex", placeItems: "flex-start"}}>
            <div style={{
                width: "10vh",
                height: "10vh",
                backgroundSize: "100%",
                backgroundPosition: "center",
                borderRadius: "50%",
                backgroundColor: "gray",
                border: "2px solid lightgray",
                // @ts-ignore
                backgroundImage: "url("+d.headImg?.toString()+")"
            }}/>
            <div style={{marginLeft: "1vh"}}>
                <p>id：{d.userid.toString()}</p>
                <p>用户昵称：{d.username.toString()}</p>
                <p>性别：{d.gender.toString()}</p>
                <p>生日：{d.birthday.toString()}</p>
            </div>

        </Card>
    );
}

export default UserCard;