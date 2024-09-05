import request from '../utils/http-utils.js'
// 和设备台账相关 APIDevice
const AccidentApi = {
	AccidentList: '/accident/getAllByPage', // 分页 API
	OperateAccident: '/accident',// 基础 CRUD API
}

// 分页获取 Accident 列表
export function getAccidentList(page) {
	return request({
		url: AccidentApi.AccidentList,
		method: 'post',
		data: page
	})
}
// 新增组织信息
export function addAccidentInfo(data) {
	return request({
		url: AccidentApi.OperateAccident + "/add",
		method: 'post',
		data: data
	})
}
export function noDistribute(page)
{
	return request({
		url: AccidentApi.OperateAccident + "/noDistribute",
		method: 'post',
		data: page
	})
}
// 删除Accident 列表信息
export function deleleteById(accId) {
	return request({
		url: AccidentApi.OperateAccident+"/del"+`/${accId}`,
		method: 'delete',
	})
}
export function getDistribute(accId){
	return request({
		url:AccidentApi.OperateAccident+"/distribute"+`/${accId}`,
		method:'post',
	})
}

// 改变状态码
export function updateStatus (data) {
	return request({
		url: AccidentApi.OperateAccident+"/updateStatus",
		method: 'put',
		data:data
	})
}

