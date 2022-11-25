import React from 'react';
import {Button, Card, Col, Row, Statistic} from "antd";
import {CommentOutlined, MessageOutlined, NumberOutlined, ProfileOutlined} from "@ant-design/icons";

function ServerStatus(props : any) {
    const { server_url,  data_count, status } = props;
    return (
        <Row style={{margin: "2vh"}}>
            <Card title="数据条数" className="subcard">
                <Row gutter={8}>
                    <Col span={6}>
                        <Statistic title="帖子" prefix={<ProfileOutlined />} value={data_count.share} suffix="个"/>
                    </Col>
                    <Col span={6}>
                        <Statistic title="评论" prefix={<MessageOutlined />} value={data_count.comment} suffix="条"/>
                    </Col>
                    <Col span={6}>
                        <Statistic title="主题" prefix={<NumberOutlined />} value={data_count.topic} suffix="个"/>
                    </Col>
                    <Col span={6}>
                        <Statistic title="讨论" prefix={<CommentOutlined />} value={data_count.discuss} suffix="条"/>
                    </Col>
                </Row>
            </Card>
            <Card title="服务器" className="subcard">
                <Row gutter={8}>
                    <Col span={6}>
                        <Statistic title="状态" value={
                            // @ts-ignore
                            status.msg + ""
                        }/>
                        { //@ts-ignore
                            !status.success && <Button type="primary" onClick={() => this.init()}>刷新</Button> }
                    </Col>
                    <Col>
                        <Statistic title="地址（在cfg.json中修改server_url字段）" value={
                            //@ts-ignore
                            server_url + ""
                        }/>
                    </Col>
                </Row>
            </Card>
        </Row>
    );
}

export default ServerStatus;