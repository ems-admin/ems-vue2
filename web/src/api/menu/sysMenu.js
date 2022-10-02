import request from "../../utils/request";

/**
 * 拉取当前用户的所有菜单
 * @returns {AxiosPromise}
 */
export function queryAllMenu(){
    return request({
        url: '/sys/menu/all',
        method: 'get'
    })
}

/**
 * 获取当前登录用户菜单树
 * @returns {AxiosPromise}
 */
export function getMenuTree(){
    return request({
        url: '/sys/menu/tree',
        method: 'get'
    })
}

/**
 * 获取菜单列表
 * @param params
 * @returns {AxiosPromise}
 */
export function getMenuTable(params){
    return request({
        url: '/sys/menu/table',
        method: 'get',
        params
    })
}
