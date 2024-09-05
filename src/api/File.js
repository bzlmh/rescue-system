// 文件上传，下载，查看。。。
import request from '@/utils/http-utils.js'
// 和设备台账相关 API
const FileApi = {
	OperateFile: '/api/v1/private/oss' ,// 基础 CRUD API
}

/**
 * data: {
 *  deviceId； String,
 *  file: InputStream
 * }
 * @param {*} data 
 * @returns 
 */
export function DeviceUpload (data) {
	return request({
		url: FileApi.OperateFile + '/upload',
		method: 'post',
		data: data
	})
}


export function getFileByDeviceId (prefix) {
	return request({
		url: FileApi.OperateFile + prefix,
		method: 'get'
	})
}