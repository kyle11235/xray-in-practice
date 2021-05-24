import request from '@/utils/request'

export function all(query) {
  return request({
    url: '/all',
    method: 'get',
    params: query
  })
}

export function approved(query) {
  return request({
    url: '/approved',
    method: 'get',
    params: query
  })
}

export function denied(query) {
  return request({
    url: '/denied',
    method: 'get',
    params: query
  })
}

export function details(query) {
  return request({
    url: '/details',
    method: 'get',
    params: query
  })
}

export function approve(query) {
  return request({
    url: '/approve',
    method: 'get',
    params: query
  })
}


export function deny(query) {
  return request({
    url: '/deny',
    method: 'get',
    params: query
  })
}
