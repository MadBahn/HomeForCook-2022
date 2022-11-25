import React, {Component} from 'react';
import {http} from "@tauri-apps/api";
import {invoke} from "@tauri-apps/api/tauri";
import {Card, Empty, Row} from "antd";
import {ResponseType} from "@tauri-apps/api/http";

import "./home.css"
import ServerStatus from "./comps/server_status";
import RecentNotify from "./comps/recent_notify";
import {confirm} from "@tauri-apps/api/dialog";

class Home extends Component {
    state = {
        url_cfg: {},
        notify_data: [],
        data_count: {
            share: 0,
            comment: 0,
            topic: 0,
            discuss: 0
        },
        status:{}
    }

    connection_test = async (url : string) => {
        // @ts-ignore
        return await http.fetch(url, {
            method: "GET",
            responseType: ResponseType.Text,
            timeout: 5000,
        })
        .then(res => {return res.status;})
        .catch(err => {return err;});
    }

    async request(url : string) {
        // @ts-ignore
        return (await http.fetch(url, {
            method: "POST",
            body: http.Body.json({
                amount: 5,
                isRecent: true,
                isDetail: true,
            }),
        })
        .then((res : any) => {
            if(res.data.errCode === "OK-100"){
                return res.data.data;
            }
            return [];
        })
        .catch((err) => {
            return (err);
        }));
    }

    init = () => {
        const self = this;
        const tmp = {};
        invoke("read_cfg").then((res: any) => {
            // @ts-ignore
            tmp.url_cfg = JSON.parse(res);
            // @ts-ignore
            self.connection_test(tmp.url_cfg.server_url).then(async r => {
                if(r === 200) {
                    // @ts-ignore
                    tmp.status = {success: true, msg: "连接成功"}
                    //@ts-ignore
                    tmp.data_count = await self.getCount(tmp.url_cfg).then(r => {return r});
                    // @ts-ignore
                    tmp.notify_data = await self.request(tmp.url_cfg.server_url + tmp.url_cfg.api.get_notify).then(r => {return r});
                    self.setState({
                        // @ts-ignore
                        url_cfg: tmp.url_cfg,
                        // @ts-ignore
                        status: tmp.status,
                        // @ts-ignore
                        notify_data: tmp.notify_data,
                        // @ts-ignore
                        data_count: tmp.data_count,
                    });
                } else {
                    // @ts-ignore
                    tmp.status = {success: false, msg: "连接失败"}
                }
                // console.log(tmp);
            });
        });
    }

    getCount = async (url_cfg : any) => {
        const tmp = {share: 0, comment: 0, topic: 0, discuss: 0};
        // @ts-ignore
        tmp.share = (
            await http
                .fetch(url_cfg.server_url + url_cfg.api.count + "/s", {
                    method: "GET",
                })
                .then()
        ).data.data.count;

        // @ts-ignore
        tmp.comment = (
            await http
                .fetch(url_cfg.server_url + url_cfg.api.count + "/c", {
                    method: "GET",
                })
                .then()
        ).data.data.count;

        // @ts-ignore
        tmp.topic = (
            await http
                .fetch(url_cfg.server_url + url_cfg.api.count + "/t", {
                    method: "GET",
                })
                .then()
        ).data.data.count;

        // @ts-ignore
        tmp.discuss = (
            await http
                .fetch(url_cfg.server_url + url_cfg.api.count + "/d", {
                    method: "GET",
                })
                .then()
        ).data.data.count;

        return tmp;
    }

    reload = () => {

    }

    doExec = async (id : string) => {
        if(await confirm("是否处理",{
            title: "确认",
            type: "info"
        })){
            const {url_cfg} = this.state;
            const self = this;
            // console.log("notify_id:", id);
            //@ts-ignore
            await http.fetch(url_cfg.server_url + url_cfg.api.exec_notify, {
                method: "POST",
                body: http.Body.json({
                    notify_id: id
                })
            }).then(async r => {
                //@ts-ignore
                if(r.data.errCode === "OK-200") {
                    //@ts-ignore
                    self.setState({notify_data: (await self.request(url_cfg.server_url + url_cfg.api.get_notify).then(r => {return r}))});
                }
            });
        }
    }

    socket = () => {
        let ws = new WebSocket("ws://localhost:3000");
        ws.onopen = () => {
            ws.send("suka blyat");
        };
        ws.onmessage = e => {
            console.log(e);
        };
    }

    async componentDidMount() {
        this.init();
        this.socket();
    }

    render() {
        const {url_cfg, notify_data, data_count, status} = this.state;
        return (
            <div>
                {/*//@ts-ignore*/}
                <ServerStatus server_url={url_cfg.server_url} status={status} data_count={data_count} />
                <Card style={{margin: "0 4vh"}} title="最近的举报">
                    <Row gutter={8}>
                        <div style={{overflowY: "auto", width: "100%", height: "60vh"}}>
                            {notify_data.length === 0 && <Empty description="好像没有数据欸"/>}
                            {notify_data.map((i, index) =>
                                //@ts-ignore
                                <RecentNotify key={index} item={i} _exec={this.doExec}/>
                            )}
                        </div>
                    </Row>
                </Card>
            </div>
        );
    }
}

export default Home;