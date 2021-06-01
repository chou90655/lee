import axios from 'axios'
// import { getRequstInfo } from '../util/cach'
import { toast } from '../util/tools'

const request = axios.create({
  baseURL: process.env.VUE_APP_LOTTERY_BASE_API,
  timeout: 60000,
  headers: {
    post: {
      'Content-Type': 'application/json'
    }
  }
})
request.interceptors.request.use(config => {
  // const base = getRequstInfo()
  // config.headers = { ...config.headers, ...base }
  // config.data = { ...config.data, ...base }
  return config
}, err => {
  console.log(err)
  toast()
  return Promise.resolve(err)
})

request.interceptors.response.use(res => {
  const { data } = res
  if (data) {
    if (data.code === '200') return data.data
    else if (data.code === '401') {
      toast(data.msg)
      window.location.href = '#/login'
    } else toast(data.msg)
  } else toast()
}, err => {
  console.log(err)
  return Promise.resolve(err)
})

export default request
