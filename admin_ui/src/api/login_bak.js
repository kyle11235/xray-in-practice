import request from '@/utils/request'

export function loginByUsername(name, password) {
  const data = {
    name,
    password
  }
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  
  // not necessary to have this api, successful login return info directly
  // but complex login unable to use it directly...

  return request({
    url: '/user/readByName',
    method: 'get',
    params: token
  })

  // mock
  // return new Promise((resolve, reject) => {
  //   resolve({
  //     data: {
  //       data:{
  //         name: 'admin',
  //         avatar: '',
  //         perms: ['*']
  //       }
  //     }
  //   });
  // })
}

