import request from '../utils/http-utils.js'
const apiPath = {
	milestoneList: '/milestone/SelectInfo/page',
	OperateMilestone: '/milestone',
	OperateQrcode:'/qrcode',
	Download:"/img/"
}

// 获取二维码信息列表
export function getMilestoneList(page) {
	return request({
		url: apiPath.milestoneList,
		method: 'post',
		data: page
	})
}

// 添加二维码信息
export function addMilestone(data) {
	return request({
		url: apiPath.OperateMilestone,
		method: 'post',
		data: data
	})
}

// 修改二维码信息
export function updateMilestone(data) {
	return request({
		url: apiPath.OperateMilestone,
		method: 'put',
		data: data
	})
}

// 根据 ID 查询
export function getMileById(id) {
	return request({
		url: apiPath.OperateMilestone+"/getMileById"+`/${id}`,
		method: 'get'
	})
}

// 生成二维码
export function getUnlimited(data) {
	return request({
		url: apiPath.OperateQrcode + "/getUnlimited",
		method: 'post',
		data:data
	})
}


// 批量下载二维码
// export function downPic(data) {
// 	return request({
// 		url: apiPath.OperateQrcode + "/downPic",
// 		method: 'post',
// 		data:data
// 	})
// }


export function downPic(url) {
	return request({
		url: apiPath.Download+url,
		method: 'get',
		responseType: 'arraybuffer'
	})
}

// 删除二维码相关功能
export function deleteMilestonrByMileId(id) {
	return request({
		url: apiPath.OperateMilestone+"/deleteById" + `/${id}`,
		method: 'delete'
	})
}


// 删除二维码相关功能
export function getMapInfo() {
	return request({
		url: apiPath.OperateMilestone+"/getMapInfo" ,
		method: 'get'
	})
}

