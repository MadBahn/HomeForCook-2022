import React from 'react';
import {Card} from "antd";

interface comment {
    cid: string,
    sid: string,
    content: string,
    user: string,
    post_date: Date,
    isDel: boolean
}

interface data{
    d: comment
}

function CommentCard(props : data) {
    // @ts-ignore
    const {d} = props;
    return (// @ts-ignore
        <Card>
            <p>id：{d.cid}</p>
            <p>在哪个帖子下发布：{d.sid}</p>
            {/*// @ts-ignore*/}
            <p>发布者: {d.user || d.raw_user.username}</p>
            {/*// @ts-ignore*/}
            <p>发布日期：{d.post_date}</p>
            评论内容：
            <p style={{
                padding: "2vh",
                backgroundColor: "lightgray"
            }}>{d.content}</p>
        </Card>
    );
}

export default CommentCard;