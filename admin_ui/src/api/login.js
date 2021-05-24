import request from '@/utils/request'

export function loginByUsername(name, password) {
  const data = {
    name,
    password
  }
  // mock
  return new Promise((resolve, reject) => {
    resolve({
      data: {
        data:{
          name: 'admin',
          avatar: '',
          perms: ['*']
        }
      }
    });
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  
  // mock
  return new Promise((resolve, reject) => {
    resolve({
      data: {
        data:{
          name: 'admin',
          avatar: '',
          perms: ['*']
        }
      }
    });
  })
}

