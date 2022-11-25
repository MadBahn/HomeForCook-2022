import React from 'react';
import {Card} from "antd";

interface discuss {
    did: string,
    tid: string,
    content: string,
    user: string,
    post_date: Date,
    isDel: boolean
}

interface data {
    d: discuss
}

function DiscussCard(props : data) {
    const {d} = props;
    return (
        <Card>
            <p>id：{d.did}</p>
            <p>在哪个主题下发布：{d.tid}</p>
            {/*// @ts-ignore*/}
            <p>发布者: {d.user || d.raw_user.username}</p>
            {/*// @ts-ignore*/}
            <p>发布日期：{d.post_date}</p>
            <div
                style = {{
                    padding: "2vh",
                    backgroundColor: "lightgray"
                }}
                dangerouslySetInnerHTML={{
                __html: d.content
            }}/>
        </Card>
    );
}

export default DiscussCard;