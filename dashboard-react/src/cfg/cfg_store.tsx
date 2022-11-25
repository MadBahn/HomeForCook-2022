import {legacy_createStore as createStore} from "redux";
import cfgReducer from "./cfg_reducer";

export default createStore(cfgReducer);