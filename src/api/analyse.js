import request from '../utils/http-utils.js'
// 和设备台账相关 APIDevice
const AnalyseApi = {
	OperateAnalyse: '/analysis',// 基础 CRUD API
}

// 分页获取 Analyse 列表
export function getStationComplain() {
	return request({
		url: AnalyseApi.OperateAnalyse+"/getStationComplain",
		method: 'post',
	})
}
export function getComplaintCountByStandard() {
	return request({
		url: AnalyseApi.OperateAnalyse+"/getComplaintCountByStandard",
		method: 'post',
	})
}
export function getOrderCount() {
	return request({
		url: AnalyseApi.OperateAnalyse+"/getOrderCount",
		method: 'post',
	})
}
export function getComplainCount() {
	return request({
		url: AnalyseApi.OperateAnalyse+"/getComplainCount",
		method: 'post',
	})
}
export function getStationCount() {
	return request({
		url: AnalyseApi.OperateAnalyse+"/getStationCount",
		method: 'post',
	})
}

