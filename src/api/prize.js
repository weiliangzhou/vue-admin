import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/prize/list',
    method: 'get',
    params: query
  })
}

export function createPrize(data) {
  return request({
    url: '/prize/create',
    method: 'post',
    data
  })
}

export function updatePrize(data) {
  return request({
    url: '/prize/update',
    method: 'post',
    data
  })
}

export function openPrize(params) {
  return request({
    url: '/prize/open_prize',
    method: 'get',
    params
  })
}

// 详情
export function prizeDetail(params) {
  return request({
    url: '/prize/read',
    method: 'get',
    params
  })
}
// 上下架
export function display(params) {
  return request({
    url: '/prize/display',
    method: 'get',
    params
  })
}

// 删除
export function delPrize(params) {
  return request({
    url: '/prize/delete',
    method: 'get',
    params
  })
}

// 查看中奖结果
export function viewWinner(params) {
  return request({
    url: '/prize/view_winner',
    method: 'get',
    params
  })
}
