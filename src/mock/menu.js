// 二级菜单显示
const menus = [
	{
		"id": 100,
		"authName": "基础信息管理",
		"type": "user",
		"path": "",
		"children": [{
				"id": 101,
				"authName": "组织管理",
				"type": "appstore",
				"path": "standbook/orginazation",
				// "children": []
			},
		{
				"id": 102,
				"authName": "服务点管理",
				"type": "appstore",
				"path": "standbook/station",
		},
		{
			"id": 103,
			"authName": "电话信息管理",
			"type": "appstore",
			"path": "standbook/telephone",
		}]
	},
	{
		"id": 200,
		"authName": "救援工单管理",
		"type": "book",
		"path": "",
		"children": [
			{
				"id": 201,
				"authName": "工单管理",
				"type": "appstore",
				"path": "standbook/fix",
				"children": []
			},
			{
				"id": 202,
				"authName": "救援调度与派遣",
				"type": "appstore",
				"path": "standbook/fix",
				"children": []
			}
		]
	},
	{
		"id": 300,
		"authName": "用户评价与反馈",
		"type": "setting",
		"path": "",
		"children": [
			{
				"id": 301,
				"authName": "用户投诉管理",
				"type": "appstore",
				"path": "estimation/complain",
				"children": []
			},
			{
				"id": 302,
				"authName": "用户满意度管理",
				"type": "appstore",
				"path": "admin/list",
				"children": []
			},
		]
	},
	{
		"id": 400,
		"authName": "数据统计与分析",
		"type": "setting",
		"path": "",
		"children": [
			{
				"id": 401,
				"authName": "用户投诉信息统计",
				"type": "appstore",
				"path": "analyse/Complaint",
				"children": []
			},{
				"id": 402,
				"authName": "事故车辆时空分布",
				"type": "appstore",
				"path": "utils/InitMile",
				"children": []
			},{
				"id": 403,
				"authName": "事故原因分析与统计",
				"type": "appstore",
				"path": "utils/3Dtest",
				"children": []
			}
		]
	}
]

export default menus
