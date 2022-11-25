import React, {Component} from 'react';
import {Button, Card, Empty, Table} from "antd";
import {http, invoke} from "@tauri-apps/api";
import ShareCard from "../../pub_comps/share_card";
import CommentCard from "../../pub_comps/comment_card";
import TopicCard from "../../pub_comps/topic_card";
import DiscussCard from "../../pub_comps/discuss_card";
import {confirm} from "@tauri-apps/api/dialog";

class Notify extends Component {
    state = {
        url_cfg: {},
        data: []
    }

    init = async () => {
        const tmp = {};
        //@ts-ignore
        tmp.url_cfg = JSON.parse(await invoke("read_cfg").then());

        //@ts-ignore
        tmp.data = (await this.request(tmp.url_cfg.server_url + tmp.url_cfg.api.get_notify)
            .then())
            .data.data;
        this.setState({...tmp});

        console.log(this.state);
    }

    request = async (url: string) => {
        return await http.fetch(url, {
            method: "POST",
            body: http.Body.json({
                isRecent: false,
                isDetail: true,
            })
        }).then();
    }

    doExec = async (id: string) => {
        if( await confirm("是否继续？",{
            title:"确认",
            type: "info"
        })){
            const {url_cfg} = this.state;
            const self = this;
            // @ts-ignore
            const errCode = (await http.fetch(url_cfg.server_url + url_cfg.api.exec_notify, {
                method: "POST",
                body: http.Body.json({
                    notify_id: id
                })
            }).then()).data.errCode;
            // @ts-ignore
            (errCode === "OK-200" && this.setState({data: (await this.request(url_cfg.server_url + url_cfg.api.get_notify)
                    .then())
                    .data.data}));
        }
    }

    componentDidMount() {
        this.init();
    }

    render() {
        const data = this.state.data.map( (i, index) => {
            // @ts-ignore
            return{...i,key: index}
        });
        console.log(data);
        const columns = [
            {
                title: 'id',
                dataIndex: 'notify_id',
                key: 'notify_id'
            },
            {
                title: '举报原因',
                dataIndex: 'content',
                key: 'content'
            },
            {
                title: '举报日期',
                dataIndex: 'post_date',
                key: 'post_date'
            }
        ]
        return (
            <div style={{height: "95vh", overflowY: "auto"}}>
                <Table
                    dataSource={data}
                    columns={columns}
                    pagination={{
                        hideOnSinglePage: true
                    }}
                    expandable={{
                        expandedRowRender: record =>
                            <div>
                                <Card bordered={true} >
                                    <p>举报者：{record.user.username}</p>
                                </Card>
                                {(record.refer_to.sid && !record.refer_to.cid) && <ShareCard d={record.refer_to} />}
                                {(record.refer_to.sid && record.refer_to.cid) && <CommentCard d={record.refer_to} />}
                                {(record.refer_to.tid && !record.refer_to.did) && <TopicCard d={record.refer_to} />}
                                {(record.refer_to.tid && record.refer_to.did) && <DiscussCard d={record.refer_to} />}
                                {(!record.refer_to.tid &&
                                    !record.refer_to.did &&
                                    !record.refer_to.sid &&
                                    !record.refer_to.cid) && <Empty description="咦，数据好像被删除了。"/>}
                                {!record.isDone && <Button onClick={() => this.doExec(record.notify_id)}>处理</Button>}
                            </div>
                    }}
                />
            </div>
        );
    }
}

export default Notify;