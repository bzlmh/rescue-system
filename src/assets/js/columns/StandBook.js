/**
 * 列表表头相关数据
 */

// 组织管理
const OrganizationColumns = [
  {
    title: '组织名称',
    dataIndex: 'orgName',
    width: 260,
  },
  {
    title: '电话号码',
    dataIndex: 'orgTel',
    width: 260,
  },
  {
    title: '组织邮箱',
    dataIndex: 'orgEmail',
    width: 350,
  },
  {
    title: '组织所在地',
    dataIndex: 'orgAddress',
    width: 350,
  },

  {
    title: '组织成员',
    dataIndex: 'orgMembers',
    width: 260,
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 300,
    fixed: 'right',
    scopedSlots: { customRender: 'operation' },
  },
];

//服务站点管理
const StationColumns = [
  {
    title: '服务点名称',
    dataIndex: 'staName',
    width: 200,
  },
  {
    title: '服务范围',
    dataIndex: 'staRange',
    width: 130,
  },
  {
    title: '服务点热线',
    dataIndex: 'staTel',
    width: 200,
  },
  {
    title: '服务点地址',
    dataIndex: 'staLocation',
    width: 220,
  },
  {
    title: '服务点资源',
    dataIndex: 'staResource',
    width: 280,
  },
  {
    title: '服务点合作组织',
    dataIndex: 'staAcompany',
    width: 200,
  },
  {
    title: '服务点描述',
    dataIndex: 'staDescribe',
    width: 300,
  },
  {
    title: '服务点成员',
    dataIndex: 'staMembers',
    width: 130,
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 200,
    fixed: 'right',
    scopedSlots: {
      customRender: 'operation',
    },
  },
];

// 电话信息管理
const TelephoneColumns = [
  {
    title: '电话热线',
    dataIndex: 'telNumber',
    width: 350,
  },
  {
    title: '所属部门类型',
    dataIndex: 'telType',
    width: 350,
    scopedSlots: { customRender: 'telType' },
  },
  {
    title: '所属部门',
    dataIndex: 'hostId',
    width: 600,
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 300,
    fixed: 'right',
    scopedSlots: { customRender: 'operation' },
  },
];

// 用户投诉管理
const ComplainColumns = [
  {
    title: '项目工单号',
    dataIndex: 'orderId',
    width: 300,
  },
  {
    title: '投诉类别',
    dataIndex: 'standardName',
    width: 200,
  },
  {
    title: '投诉内容',
    dataIndex: 'comDescribe',
    width: 400,
  },
  {
    title: '投诉状态',
    dataIndex: 'comStatus',
    width: 100,
    scopedSlots: {customRender: 'comStatus'}
  },
];
const MilestoneColumns = [
  {
    title: '桩号',
    dataIndex: 'mileId',
    width: 50,
  },
  {
    title: '经纬度',
    dataIndex: 'coordinates',
    width: 90,
  },
  {
    title: '路线方向',
    dataIndex: 'lineDirection',
    width: 100,
    scopedSlots: {
      customRender: 'lineDirection',
    },
  },
  {
    title: '二维码图片',
    dataIndex: 'qrcode',
    width: 120,
    scopedSlots: {
      customRender: 'qrcode',
    },
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 200,
    // fixed: "right",
    scopedSlots: {
      customRender: 'operation',
    },
  },
];

const ScenePicColumns = [
  // {
  // 	title: "图片编号",
  // 	dataIndex: "id",
  // 	width: 150,
  // },
  {
    title: '救援id',
    dataIndex: 'rescueId',
    width: 150,
  },
  {
    title: '事故图片',
    dataIndex: 'url',
    width: 120,
    scopedSlots: {
      customRender: 'url',
    },
  },
  {
    title: '操作',
    dataIndex: '',
    width: 200,
    // fixed: "right",
    scopedSlots: {
      customRender: 'operation',
    },
  },
];

const UserColumns = [
  // {
  // 	title: "用户ID",
  // 	dataIndex: "memberID",
  // 	width: 150,
  // },
  {
    title: '账号',
    dataIndex: 'userName',
    width: 150,
  },
  {
    title: '密码',
    dataIndex: 'password',
    width: 120,
    scopedSlots: {
      customRender: 'password',
    },
  },
  {
    title: '注册时间',
    dataIndex: 'createDate',
    width: 200,
  },
  {
    title: '最后登录时间',
    dataIndex: 'lastLoginDate',
    width: 200,
  },
  {
    title: '身份',
    dataIndex: 'identity',
    width: 120,
    scopedSlots: {
      customRender: 'identity',
    },
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 200,
    // fixed: "right",
    scopedSlots: {
      customRender: 'operation',
    },
  },
];

const SysLogColumns = [
  {
    title: '操作账号',
    dataIndex: 'username',
    width: 150,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 120,
  },
  {
    title: '操作接口',
    dataIndex: 'method',
    width: 200,
  },
  {
    title: 'ip地址',
    dataIndex: 'ip',
    width: 200,
  },
  {
    title: '操作时间',
    dataIndex: 'createDate',
    width: 120,
  },
];

export { OrganizationColumns, StationColumns, TelephoneColumns, ComplainColumns, MilestoneColumns, ScenePicColumns, UserColumns, SysLogColumns };
