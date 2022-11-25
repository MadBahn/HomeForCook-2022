import React, {Component} from 'react';
import {Button, Checkbox, Empty, Segmented, Space} from "antd";
import ShareCard from "../../pub_comps/share_card";
import {http, invoke} from "@tauri-apps/api";
import {confirm} from "@tauri-apps/api/dialog"

import CommentCard from "../../pub_comps/comment_card";
import TopicCard from "../../pub_comps/topic_card";
import DiscussCard from "../../pub_comps/discuss_card";
import UserCard from "../../pub_comps/user_card";
import {LockOutlined} from "@ant-design/icons";

class Data extends Component {
    state = {
        url_cfg: {},
        _switch: "share",
        data: [],
        chose_all: false,
        chose_count: 0
    }

    request = async (url : string, type : string) => {
        return (await http.fetch(url, {
            method: "POST",
            body: http.Body.json({
                type: type
            })
        }).then(r => {
            //@ts-ignore
            console.log(r.data.data);
            // @ts-ignore
            if(r.data.errCode === "OK-100"){
                //@ts-ignore
                // console.log("ret:",ret);
                //@ts-ignore
                return r.data.data.map(i => {
                    return {...i, isChosen: false}
                });
            }
            return [];
        }).catch(err => {return err;}));
    }

    delete = async (i : any) => {
        if(await confirm("此操作不可逆，是否继续？",{
            title: "警告",
            type: "warning"
        })){
            const {url_cfg} = this.state;
            const [tmp,self] = [{},this];
            let _id = "";
            switch (this.state._switch) {
                case "share": _id = i.sid; break;
                case "comment": _id = i.cid; break;
                case "topic": _id = i.tid; break;
                case "discuss": _id = i.did; break;
                case "user": _id = i.userid; break;
            }
            // @ts-ignore
            http.fetch(url_cfg.server_url + url_cfg.api.delete_complete, {
                method: "POST",
                body: http.Body.json({
                    id_in: _id
                })
            }).then(async r => {
                // @ts-ignore
                if(r.data.errCode === "OK-200"){
                    // @ts-ignore
                    tmp.data = await self.request(url_cfg.server_url + url_cfg.api.get_data, self.state._switch).then(r => {return r});
                    // @ts-ignore
                    self.setState({data: tmp.data});
                }
            });
        }
    }

    lock = async (i : any) => {
        if( await confirm("是否继续",{
            title: "确认",
            type: "info"
        })){
            const {url_cfg} = this.state;
            const [self, tmp] = [this, {}];
            let _id = "";
            switch (this.state._switch) {
                case "share": _id = i.sid; break;
                case "comment": _id = i.cid; break;
                case "topic": _id = i.tid; break;
                case "discuss": _id = i.did; break;
                case "user": _id = i.userid; break;
            }
            const index = _id.at(0);

            const _exec = (url : string,body : http.Body) => {
                http.fetch(url,{
                    method: "POST",
                    body: body
                }).then(async r => {
                    console.log(r)
                    // @ts-ignore
                    if(r.data.errCode === "OK-200"){
                        // @ts-ignore
                        tmp.data = await self.request(url_cfg.server_url + url_cfg.api.get_data, self.state._switch).then(r => {return r});
                        // @ts-ignore
                        self.setState({data: tmp.data});
                    }
                });
            };
            switch (index) {
                case 's':
                case 'c':
                case 't':
                case 'd':
                    console.log("common");
                    // @ts-ignore
                    _exec(url_cfg.server_url + url_cfg.api.lock_content, http.Body.json({
                        data: _id
                    }));
                    break;
                case 'u':
                    console.log("user");
                    // @ts-ignore
                    _exec(url_cfg.server_url + url_cfg.api.lock_user, http.Body.json({
                        userid: _id
                    }));
                    break;
            }
        }
    }

    onSegmentChange = async (e : any) => {
        let t = '';
        switch (e) {
            case "帖子": t = 'share'; break;
            case "评论": t = 'comment'; break;
            case "主题": t = 'topic'; break;
            case "讨论": t = 'discuss'; break;
            case "用户": t = 'user'; break;
        }
        // @ts-ignore
        const tdata = await (this.request(this.state.url_cfg.server_url + this.state.url_cfg.api.get_data, t).then(r => {return r}));
        this.setState({_switch: t, data: tdata, chose_all: false, chose_count: 0});
    }

    init = () => {
        const self = this;
        const tmp = {};
        invoke("read_cfg").then(async r => {
            // @ts-ignore
            tmp.url_cfg = JSON.parse(r);
            // @ts-ignore
            tmp.data = await self.request(tmp.url_cfg.server_url + tmp.url_cfg.api.get_data, self.state._switch).then(r => {return r});
            console.log(tmp);
            self.setState({...tmp});
            console.log("state:",self.state);
        });
    }

    switchChosen = ( e : any) => {
        const { data } = this.state;
        let { chose_count } = this.state;
        // @ts-ignore
        console.log("find:",data.indexOf(e));
        // @ts-ignore
        data[data.indexOf(e)].isChosen = !data[data.indexOf(e)].isChosen;
        this.setState({
            data: data,
            chose_count: chose_count += (
                // @ts-ignore
                data[data.indexOf(e)].isChosen ?
                    1 : -1
            ),
            chose_all: chose_count === data.length
        });
    }

    selectAll = () => {
        const { data } = this.state;
        // @ts-ignore
        const tag = data.filter( f => { return f.isChosen});
        const v = tag.length === data.length;
        console.log(v);
        const dout = data.map(m => {
            // @ts-ignore
            return {...m, isChosen: !v};
        });
        this.setState({
            data: dout,
            chose_all: !v,
            chose_count: !v ? dout.length : 0});
    }

    delSelected = async () => {
        if(await confirm("此操作不可逆，是否继续？",{
            type: "warning",
            title: "警告"
        })){
            const { data, _switch, url_cfg } = this.state;
            for(let i = data.length - 1; i>=0; i--) {
                let id;
                const [tmp,self] = [{},this];
                // @ts-ignore
                if(data[i].isChosen){
                    switch (_switch) {
                        case "share":
                            // @ts-ignore
                            id = data[i].sid;
                            break;
                        case "comment":
                            // @ts-ignore
                            id = data[i].cid;
                            break;
                        case "topic":
                            // @ts-ignore
                            id = data[i].tid;
                            break;
                        case "discuss":
                            // @ts-ignore
                            id = data[i].did;
                            break;
                        case "user":
                            // @ts-ignore
                            id = data[i].userid;
                            break;
                    }
                    await http.fetch(
                        // @ts-ignore
                        url_cfg.server_url + url_cfg.api.delete_complete,
                        {
                            method: "POST",
                            body: http.Body.json({
                                id_in: id,
                            }),
                        }).then(async r => {
                        // @ts-ignore
                        if(r.data.errCode === "OK-200" && i === 0){
                            // @ts-ignore
                            tmp.data = await self.request(url_cfg.server_url + url_cfg.api.get_data, _switch).then(r => {return r});
                            // @ts-ignore
                            self.setState({data: tmp.data});
                        }
                    });
                }
            }
        }
    }

    componentDidMount() {
        this.init();
    }

    render() {
        const {data, chose_all, chose_count} = this.state;
        return (
            <div>
                <Space>
                    <Segmented defaultValue={"帖子"} options={["帖子","评论","主题","讨论","用户"]} onChange={(e) => this.onSegmentChange(e)}/>
                    <Button onClick={this.selectAll}>{!chose_all ? "全选" : "取消全选"}</Button>
                    {chose_count > 0 && <Button onClick={this.delSelected} type="primary" danger>删除</Button>}
                </Space>
                <div style={{marginTop: "3vh",height: "90vh",overflowY: "auto"}}>
                    {data.length === 0 && <Empty description="好像没有数据欸"/> }
                    <div>
                    {/*    小工具栏*/}
                    </div>
                    {data.map((d,i) =>
                        <div style={{minHeight: "12vh", marginBottom: "1vh"}} key={i}>
                            {/*//@ts-ignore*/}
                            {(d.sid && !d.cid) && <ShareCard d={d} />}
                            {/*//@ts-ignore*/}
                            {(d.sid && d.cid) && <CommentCard d={d} />}
                            {/*//@ts-ignore*/}
                            {(d.tid && !d.did) && <TopicCard d={d} />}
                            {/*//@ts-ignore*/}
                            {(d.tid && d.did) && <DiscussCard d={d} />}
                            {/*//@ts-ignore*/}
                            {(d.userid) && <UserCard d={d} />}
                            <Space style={{marginTop:"1vh"}} size="middle">
                                {/*//@ts-ignore*/}
                                <Checkbox checked={d.isChosen} onChange={() => this.switchChosen(d)}/>
                                {/*//@ts-ignore*/}
                                {d.isDel && <LockOutlined style={{width: "5vh", height: "5vh", fontSize: "5vh"}} />}
                                {/*//@ts-ignore*/}
                                <Button onClick={() => this.lock(d)}>{d.isDel ? "解锁" :"锁定"}</Button>
                                {/*//@ts-ignore*/}
                                {(d.userid && d.isBan) && <Button>解封</Button>}
                                <Button type="primary" danger onClick={() => this.delete(d)}>删除</Button>
                            </Space>
                        </div>)}
                </div>
            </div>
        );
    }
}

export default Data;