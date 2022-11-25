import React from 'react';
import {Card} from "antd";
import {LockOutlined} from "@ant-design/icons";

interface share {
    sid: string,
    title: string,
    content: string,
    user: string,
    post_date: Date,
    isDel: boolean
}

interface data{
    d: share
}

function ShareCard(props : data){
    // @ts-ignore
    const {d} = props;
    return (
        <Card>
            {/*// @ts-ignore*/}
            <div>
                id: {d.sid} <br />
                标题: {d.title} <br />
                {/*// @ts-ignore*/}
                发布者: {d.user || d.raw_user.username} <br />
                发布日期: {d.post_date} <br />
                <div
                    style = {{
                        padding: "5vh",
                        backgroundColor: "lightgray"
                    }}
                    dangerouslySetInnerHTML={{__html: d.content}} />
            </div>
        </Card>
    );
}

export default ShareCard;