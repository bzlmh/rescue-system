import request from '../utils/http-utils.js';
// 电话信息管理 API

/**
 * 分页查询
 * @param {Object} queryPrams 查询参数
 * @returns
 */
export function getTelephoneList(queryPrams) {
  return request({
    url: '/tel/getAllByPage',
    method: 'post',
    data: queryPrams,
  });
}

/**
 * 新增电话信息
 * @param {Object} data 电话信息
 * @returns
 */
export function addTelInfo(data) {
  return request({
    url: '/tel/addTel',
    method: 'post',
    data: data,
  });
}

/**
 * 修改电话信息
 * @param {Object} data 电话信息
 * @returns
 */
export function updateTelInfo(data) {
  return request({
    url: '/tel/updateTel',
    method: 'post',
    data: data,
  });
}

/**
 * 根据电话 ID 删除电话信息
 * @param {Number} telId 电话 ID
 * @returns
 */
export function deleteTelById(telId) {
  return request({
    url: `/tel/delTel/${telId}`,
    method: 'delete',
  });
}
