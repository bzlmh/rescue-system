import request from '../utils/http-utils.js'
// 和设备台账相关 API
const getUrlApi = {
	getUrlList: '/api/v1/private/oss', // 分页 API,// 基础 CRUD API
}


// 查看 device 设备信息
export function getgetUrlListById (prefix) {
	return request({
		url: getUrlApi.getUrlList + `/${prefix}`,
		method: 'get'
	})
}


