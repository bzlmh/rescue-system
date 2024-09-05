import Welcome from '@/views/Welcome.vue';
const childrens = [
  {
    path: '/welcome',
    component: Welcome,
  },
  {
    // 组织信息管理相关页面
    path: '/standbook/orginazation',
    name: 'Orgnazation',
    component: () => import('@/views/standbook/Orginazation.vue'),
  },
  {
    // 服务站点信息管理相关页面
    path: '/standbook/station',
    name: 'Station',
    component: () => import('@/views/standbook/Station.vue'),
  },
  {
    // 服务站点信息管理相关页面
    path: '/standbook/telephone',
    name: 'Telephone',
    component: () => import('@/views/standbook/Telephone.vue'),
  },
  {
    // 台账维修相关页面
    path: '/standbook/fix',
    name: 'Fix',
    component: () => import('@/views/standbook/Fix.vue'),
  },
  {
    // 管理员列表页
    path: '/admin/list',
    component: () => import('@/views/user/Admin.vue'),
  },
  {
    // 系统日志界面
    path: '/system/log',
    component: () => import('@/views/system/Log.vue'),
  },
  {
    // 资料库
    path: '/data/materials',
    name: 'Materials',
    component: () => import('@/views/data/Materials.vue'),
  },
  {
    // 初始化虚拟围栏
    path: '/utils/initMile',
    name: 'InitDefence',
    component: () => import('@/views/utils/InitMile.vue'),
  },
  {
    // 初始化虚拟围栏
    path: '/utils/3Dtest',
    name: 'InitDefence',
    component: () => import('@/views/utils/3Dtest.vue'),
  },
  {
    // 用户评价与管理
    path: '/estimation/complain',
    component: () => import('@/views/estimation/Complain.vue'),
  },
];

export default childrens;
