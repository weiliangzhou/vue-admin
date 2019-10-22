import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/clockin/user/list',
    method: 'get',
    params: query
  })
}

export function statDKUser(query) {
  return request({
    url: '/clockin/user/info',
    method: 'get',
    params: query
  })
}

