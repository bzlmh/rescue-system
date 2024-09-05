import request from '../utils/http-utils.js'
// 和设备台账相关 API
const OrderApi = {
	OrderList: '/order/getAllByPage', // 分页 API
	OperateOrder: '/order',// 基础 CRUD API
}

// 分页获取 Order 列表
export function getOrderList(page) {
	return request({
		url: OrderApi.OrderList,
		method: 'post',
		data: page
	})
}

// 改变状态码
export function updateStatus(orderId,status) {
	return request({
		url: OrderApi.OperateOrder + "/updateStatus",
		method: 'post',
		data: {
			orderId:orderId,
			status:status,
		},
	})
}

