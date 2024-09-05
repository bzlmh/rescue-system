import request from '../utils/http-utils.js'
// 和设备台账相关 API
const ScenePicApi = {
	RescueList: '/scenePic', // 分页 API
}

// 分页获取 图片 列表
export function getPicList (page) {
	return request({
		url: ScenePicApi.RescueList+"/getPicByRescueId/page",
		method: 'post',
		data: page
	})
}

export function deletePicById (id) {
	return request({
		url: ScenePicApi.RescueList+"/deletePicById/"+`${id}`,
		method: 'delete',
	})
}


// 根据rescuId获取图片获取图片列表
export function getPicById (rescueId) {
	return request({
		url: ScenePicApi.RescueList+"/getPicByRescueId/"+`${rescueId}`,
		method: 'get'
	})
}