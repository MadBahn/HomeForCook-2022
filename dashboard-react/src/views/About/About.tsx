import {Card} from "antd";
import { getName, getTauriVersion, getVersion } from "@tauri-apps/api/app";

import React, {Component} from 'react';

class About extends Component {

    state = {
        tauri_info: {}
    }

    get_info = async () => {
        return {
            appName: await getName(),
            appVer: await getVersion(),
            tauriVer: await getTauriVersion()
        }
    }

    async componentDidMount() {
        this.setState({tauri_info: await this.get_info().then()});
    }

    render() {
        const {tauri_info} = this.state;
        return (
            <div>
                <Card title="关于本应用">
                    {//@ts-ignore
                        tauri_info.appName + tauri_info.appVer} <br />
                    Powered by Tauri {//@ts-ignore
                        tauri_info.tauriVer} <br />
                    Web by React
                </Card>
            </div>
        );
    }
}

export default About;




