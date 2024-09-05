import request from '../utils/http-utils.js';
// 组织管理 API

/**
 * 分页查询
 * @param {Object} queryPrams 查询参数
 * @returns
 */
export function getOrganizationList(queryPrams) {
  return request({
    url: '/org/getAllByPage',
    method: 'post',
    data: queryPrams,
  });
}

/**
 * 新增组织信息
 * @param {Object} data 电话信息
 * @returns
 */
export function addOrganizationInfo(data) {
  return request({
    url: '/org/addOrg',
    method: 'post',
    data: data,
  });
}

/**
 * 修改组织信息
 * @param {Object} data 电话信息
 * @returns
 */
export function updateOrganizationInfo(data) {
  return request({
    url: '/org/updateOrg',
    method: 'post',
    data: data,
  });
}

/**
 * 根据组织 ID 删除组织信息
 * @param {Number} orgId 组织 ID
 * @returns
 */
export function deleteById(orgId) {
  return request({
    url: `/org/delOrg/${orgId}`,
    method: 'delete',
  });
}
