import request from '../utils/http-utils.js'
// 和设备台账相关 APIDevice
const mapApi = {
	mapList: '/map/getAllByPage', // 分页 API
	Operatemap: '/map',// 基础 CRUD API
}

// 获得每个服务点的位置信息
export function StaVO(){
	return request({
		url: mapApi.Operatemap+"/StaVO",
		method: 'post',
	})
}
// 获得每个事故的位置信息
export function AccidentVO(){
	return request({
		url: mapApi.Operatemap+"/AccidentVO",
		method: 'post',
	})
}

