import {invoke} from "@tauri-apps/api";

export default async function cfgReducer (prev : any, action : any) {
    if (prev === undefined){
        prev = {}
    }

    return prev = await invoke("read_cfg").then() || {};

}