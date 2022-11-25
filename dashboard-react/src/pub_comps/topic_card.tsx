import React from 'react';
import {Card} from "antd";

interface topic{
    tid: string,
    title: string,
    user: string,
    post_date: Date,
    isDel: boolean
}

interface data{
    d: topic
}

function TopicCard(props : data) {
    // @ts-ignore
    const {d} = props;
    return (
        <Card>
            <p>id：{d.tid}</p>
            <p>主题：{d.title}</p>
            {/*// @ts-ignore*/}
            <p>创建者：{d.user || d.raw_user.username}</p>
            {/*// @ts-ignore*/}
            <p>创建日期：{d.post_date}</p>
        </Card>
    );
}

export default TopicCard;