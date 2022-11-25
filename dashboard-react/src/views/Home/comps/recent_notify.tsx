import {Button, Card} from "antd";
import React, {Component} from 'react';

class RecentNotify extends Component {
    constructor(props : any) {
        super(props);
    }

    sendExec = (i : any) => {
        // @ts-ignore
        this.props._exec(i);
    }

    render() {
        //@ts-ignore
        const {item} = this.props;
        return (
            <Card
                title = {"来自"+item.user.username+"的举报"}
                style = {{backgroundColor: "#eeeeee", marginBottom: "2vh"}}>
                举报原因：{item.content} <br/>
                <div
                    style={ {
                        backgroundColor: "lightgray",
                        padding: "1vh",
                        minWidth: "60vh",
                        marginBottom: "1vh"
                    } }
                    dangerouslySetInnerHTML = {{__html: item.refer_to.content}}/>
                <span>
                    举报日期：{ item.post_date }
                </span>
                <br />
                <Button onClick={() => this.sendExec(item.notify_id)} style={{marginTop:"2vh"}}>
                    处理
                </Button>
            </Card>
        );
    }
}

export default RecentNotify;