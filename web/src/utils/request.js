import axios from "axios";
import routers from '../router/routers'
import store from "../store";
import {errorMsg} from "./message";

//  创建axios实例
const instance = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_BASE_URL : 'http://localhost:8415',
    timeout: 5000   //  请求超时时间（毫秒）
})

//  request拦截器
instance.interceptors.request.use(
    config => {
        //  如果已登录
        if (store.state.token){
            //  在请求头添加token
            config.headers['Authorization'] = 'Bearer ' + store.state.token
        }
        //  统一请求类型json
        config.headers['Content-Type'] = 'application/json'
        return config
    },
    error => {
        Promise.reject(error)
    }
)

//  response拦截器
instance.interceptors.response.use(
    response => {
        //  请求成功，直接返回数据
        return response.data
    },
    error => {
        if (!error.response){
            errorMsg(error.message)
        } else {
            //  请求返回码
            let code;
            if (error.response){
                code = error.response.status
            }
            //  请求返回错误
            const data = error.response.data
            if (code){
                //  如果是未授权
                if (code === 401){
                    //  说明token过期，使用refresh_token对当前token进行刷新
                    const refreshToken = store.state.refreshToken
                    //  如果存在
                    if (refreshToken){
                        this.refreshToken(refreshToken)
                    //  否则
                    } else {
                        //  清空token
                        store.dispatch('tokenAction', null)
                        //  并跳转到登录页面，进行重新登录
                        routers.push({
                            path: '/login',
                            query: {
                                backto: routers.currentRoute.fullPath
                            }
                        })
                    }
                    //  如果是没有权限
                } else if (code === 403){
                    //  直接跳转至401页面
                    routers.replace({path: '/401'})
                    //  如果是服务器异常或其他异常
                } else {
                    //  如果存在异常信息，显示异常信息
                    if (data){
                        errorMsg(data.detail)
                    }
                }
            } else {
                errorMsg('接口请求失败')
            }
        }
        return Promise.reject(error)
    }
)

/**
 * 刷新token
 * @param refreshToken
 */
export function refreshToken(refreshToken){
    //  刷新token
    axios({
        url: '/auth/refresh',
        method: 'put',
        headers: {
            Authorization: `Bearer ${refreshToken}`
        }
    }).then(res => {
        if (res.success){
            store.dispatch('tokenAction', res.data)
        } else {
            errorMsg(res.msg)
        }
    })
}

export default instance