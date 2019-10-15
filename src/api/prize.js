import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/prize/list',
    method: 'get',
    params: query
  })
}
