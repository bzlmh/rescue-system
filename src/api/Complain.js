import request from '../utils/http-utils.js';
// 用户投诉管理 API

/**
 * 分页查询投诉信息
 * @param {Object} queryPrams 投诉信息
 * @returns
 */
export function getComplainList(queryPrams) {
  return request({
    url: '/complain/getByOrder',
    method: 'post',
    data: queryPrams,
  });
}

/**
 * 添加投诉信息
 * @param {Object} data 投诉信息
 * @returns
 */
export function addComplainInfo(data) {
  return request({
    url: '/complain/add',
    method: 'post',
    data: data,
  });
}

/**
 * 修改投诉状态为已完成处理
 * @param {String} comId 投诉 ID
 * @returns
 */
export function updateComplainStatus(comId) {
  return request({
    url: `/complain/updateStatus/${comId}`,
    method: 'post',
  });
}
