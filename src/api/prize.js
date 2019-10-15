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
