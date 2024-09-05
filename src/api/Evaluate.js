import request from '../utils/http-utils.js'
// 和设备台账相关 APIDevice
const EvualateApi = {
	EvualateList: '/evalate/getAllByPage', // 分页 API
	OperateEvualate: '/evaluate',// 基础 CRUD API
}

// 分页获取 Evualate 列表
export function getEvaluateList(page) {
	return request({
		url: EvualateApi.OperateEvualate+"/getEvaluate",
		method: 'post',
		data: page
	})
}
export function getAvg(){
	return request({
		url: EvualateApi.OperateEvualate+"/getAvg",
		method: 'post',
	})
}

