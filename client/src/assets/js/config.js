import axios from 'axios';

// 环境
const EnvironmentConfig = {
  'UAT': {
    url: '/api',
  },
  'PROD': {
    url: '',
  }
};

// 接口编号
const ApiConfig = {
  signIn: 'A001',
  queryFriends: 'A002',
  addFriends: 'A003',
  getFriends: 'A004',
  queryRoomId: 'A005',
  storedRecord: 'A006'
};

// 环境定义
const Environment = EnvironmentConfig['UAT'];

// 公共方法
const SetLocalStorage = (data, name) => {
  data = JSON.stringify(data);
  localStorage.setItem(name, data);
};

const GetLocalStorage = (name) => {
  return JSON.parse(localStorage.getItem(name));
};

// 创建请求实例
const Request = axios.create({
  timeout: 7000,
  baseURL: Environment.url,
  headers: {'Content-Type': 'application/json'}
});

// 添加请求拦截器
Request.interceptors.request.use(config => {
  return config
});

// 添加响应拦截器
Request.interceptors.response.use(response => {
  return response.data
}, error => {
  console.log(error)
});

export {ApiConfig, Request, SetLocalStorage, GetLocalStorage}
