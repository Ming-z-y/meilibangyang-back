import Axios from "axios";
import { Notification } from "@arco-design/web-react";

import { BASE_URL } from "@/services";

const axios = Axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});
// 是否正在刷新的标记
let isRefreshing = false;
// 重试队列
let requests = [];
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// response interceptor
axios.interceptors.response.use(
  (response) => {
    const userStatus = localStorage.getItem("userStatus");
    const data = response.data;
    if (response.status == 200) {
      if (data.status == 10005) {
        if (userStatus == "login") {
          if (!isRefreshing) {
            isRefreshing = true;
            return updateToken().then(res => {
              const { access_token } = res.data.data;
              localStorage.setItem('token', access_token);
              response.config.headers.Authorization = `Bearer ${access_token}`;
              requests.forEach(cb => cb(access_token));
              requests = [];
              return axios(response.config);
            }).catch(err => {
              localStorage.removeItem('token');
              window.location.hash = '#/login';
              return Promise.reject(err);
            }).finally(() => {
              isRefreshing = false;
            })
          } else {
            return new Promise((res) => {
              requests.push(token => {
                response.config.headers.Authorization = `Bearer ${token};`;
                res(axios(response.config));
              })
            })
          }
        }
      }
    } else {
    }
    return data;
    return Promise.reject(new Error(response.statusText || "Error"));
  },
  (error) => {
    console.log("err:", error, error.response);
    if (error.response && error.response.status) {
      switch (error.response.status) {
        // 401: 未登录
        // 未登录则跳转登录页面，并携带当前页面的路径
        // 在登录成功后返回当前页面，这一步需要在登录页操作。
        case 401:
          window.location.hash = "#/login";
          break;
        // 403 token过期
        // 登录过期对用户进行提示
        // 清除本地token和清空vuex中token对象
        // 跳转登录页面
        case 403:
          window.location.hash = "#/login";
          break;
        // 404请求不存在
        case 404:
          Notification.error({
            title: `请求不存在`,
            content: error.response.data?.info || "Error",
            duration: 1500,
          });
          break;
        case 400:
          Notification.error({
            title: `请求参数有误`,
            content: error.response.data?.info || "Error",
            duration: 1500,
          });
          break;
        case 503:
          Notification.error({
            title: `服务器错误`,
            content: error.response.data || "Error",
            duration: 1500,
          });

          break;
        default:
          Notification.error({
            title: `请求错误`,
            content: error.response.data?.info || "Error",
            duration: 1500,
          });
      }
    }
    return Promise.reject(error);
  }
);

function updateToken() {
  const refresh_token = localStorage.getItem('refresh_token');
  return Axios.post('/api/user/refresh', {}, {
    headers: {
      'Authorization': 'Bearer ' + refresh_token
    }
  })
}

export default axios;
