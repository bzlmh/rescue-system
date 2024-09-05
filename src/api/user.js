import request from '../utils/http-utils.js'
const apiPath = {
	Login: '/admin/login',
	Logout: '/admin/logout',
	UserDetail: '/user/selectInfo/page',
	UserOperate: '/user'
}
/**
 * login func
 * @param {Object} param
 */
// export function login (param) {
// 	return request({
// 		url: apiPath.Login,
// 		method: 'post',
// 		data: param
// 	})
// }

export function login (param) {
	return request({
		url: "/user/login",
		method: 'post',
		data: param
	})
}

/**
 * logout func
 */
export function logout () {
	return request({
		url: apiPath.Logout,
		method: 'get'
	})
}

/**
 * getUserInfoById func
 * @param {Object} id
 * 通过 id 获取用户的具体信息
 */
export function getUserInfoByPage (data) {
	return request({
		url: apiPath.UserDetail,
		method: 'post',
		data:data
	})
}

/**
 * 添加 user
 * @param {Object} data
 */

export function addUser (data) {
	return request({
		url: apiPath.UserOperate+"/register",
		method: 'post',
		data:data
	})
}

/**
 * 修改 user
 * @param {Object} data
 */
export function updateUser (data) {
	return request({
		url: apiPath.UserOperate+"/updatePassword",
		method: 'put',
		data: data
	})
}


/**
 * 根据 ID 删除
 * @param {Object} id
 */
export function deleteUser (memberID) {
	return request({
		url: apiPath.UserOperate+"/deleteById" + `/${memberID}`,
		method: 'delete'
	})
}

/**
 * 根据 ID 查询
 * @param {Object} id
 */
export function selectUserById (memberID) {
	return request({
		url: apiPath.UserOperate+"/selectById" + `/${memberID}`,
		method: 'get'
	})
}


export function SendMessage (data) {
	return request({
		url: "/SendMessage/All",
		method: 'post',
		data:data
	})
}
