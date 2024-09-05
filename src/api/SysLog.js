import request from '../utils/http-utils.js'
const apiPath = {
	baseUrl: '/sysLog',
}



export function selectByPage (data) {
	return request({
		url: apiPath.baseUrl+"/selectInfo/page",
		method: 'post',
		data: data
	})
}
