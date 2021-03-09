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
  getMessageRecord: 'A006',
  getMessageList: 'A007',
  getUserData: 'A008',
  changeNickname: 'A009',
  changePhoto: 'A010',
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

const AcquisitionTime = () => {
  let date = new Date();
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  let d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  let h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  let minute = date.getMinutes();
  minute = minute < 10 ? ('0' + minute) : minute;
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute;
};

const FormatTime = (date) => {
  if (new Date(Date.parse(date.replace(/-/g, "/"))).toString().slice(0, 10) === new Date().toString().slice(0, 10)) {
    let h = new Date(Date.parse(date.replace(/-/g, "/"))).getHours();
    h = h < 10 ? ('0' + h) : h;
    let minute = new Date(Date.parse(date.replace(/-/g, "/"))).getMinutes();
    minute = minute < 10 ? ('0' + minute) : minute;
    return h + ':' + minute;
  } else {
    return date;
  }
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

export {ApiConfig, Request, SetLocalStorage, GetLocalStorage, AcquisitionTime, FormatTime}
