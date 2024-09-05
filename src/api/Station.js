import request from '../utils/http-utils.js';
// 服务站点管理 API

/**
 * 分页查询
 * @param {Object} queryPrams 查询参数
 * @returns
 */
export function getStaList(queryPrams) {
  return request({
    url: '/station/getAllByPage',
    method: 'post',
    data: queryPrams,
  });
}

/**
 * 新增服务站点信息
 * @param {Object} data 服务站点信息
 * @returns
 */
export function addStaInfo(data) {
  return request({
    url: '/station/addSta',
    method: 'post',
    data: data,
  });
}

/**
 * 修改服务站点信息
 * @param {Object} data 服务站点信息
 * @returns
 */
export function updateStaInfo(data) {
  return request({
    url: '/station/updateSta',
    method: 'post',
    data: data,
  });
}

/**
 * 根据服务站点 ID 删除服务站点信息
 * @param {Number} staId 服务站点 ID
 * @returns
 */
export function deleteStaById(staId) {
  return request({
    url: `/station/delSta/${staId}`,
    method: 'delete',
  });
}
