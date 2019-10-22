import request from '@/utils/request'

export function statDKUser(query) {
  return request({
    url: '/stat/user',
    method: 'get',
    params: query
  })
}

