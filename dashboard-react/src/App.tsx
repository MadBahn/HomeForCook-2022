import './App.css';

import { useRoutes, Link } from "react-router-dom";
import React from "react";

import routes from "./router";
import {Layout, Menu} from "antd";
import Sider from "antd/es/layout/Sider";
import {DatabaseFilled, HomeFilled, InfoCircleFilled, WarningFilled} from "@ant-design/icons";

function App() {
    const outlet = useRoutes(routes);

    return (
        <div className="App" style={{height:"100%", overflow: "hidden"}}>
            <Layout style={{height:"100%"}}>
                <Sider trigger={null} >
                    <div style={
                        {
                            height: "8vh",
                            lineHeight: "8vh",
                            textAlign: "center",
                            placeItems: "center",
                            width: "100%",
                            fontWeight: "bold",
                            color: "white"
                        }}>DASHBOARD-REACT</div>
                    <Menu theme="dark" defaultSelectedKeys={["i1"]} mode="inline" items={
                        [
                            {label: "首页", key: "i1",icon: <div><HomeFilled /><Link to="/home" /></div>},
                            {label: "数据", key: "i2",icon: <div><DatabaseFilled /><Link to="/data" /></div>},
                            {label: "举报", key: "i3",icon: <div><WarningFilled /><Link to="/notify" /></div>},
                            {label: "关于", key: "i4",icon: <div><InfoCircleFilled /><Link to="/about" /></div>}
                        ]
                    }/>
                </Sider>
                <Layout style={{padding: "1rem"}}>
                    {outlet}
                </Layout>
            </Layout>
        </div>
    );
}

export default App;
