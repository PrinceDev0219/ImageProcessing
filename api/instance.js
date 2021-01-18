import axios from "axios";
import { store } from "state-pool"
// axios.defaults.baseURL = 'http://10.10.13.226:5000';
axios.defaults.baseURL = 'https://scantogo-v1-api-server-node.herokuapp.com';
axios.defaults.headers.common['Authorization'] = store.getState('token');

export default axios;