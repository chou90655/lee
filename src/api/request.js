import axios from 'axios'
import qs from 'qs'
import { toast, api } from '../util/tools'
import Store from '../store'

const request = axios.create({
  baseURL: process.env.VUE_APP_LOTTERY_BASE_API,
  timeout: 60000,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
})
request.interceptors.request.use(config => {
  config.baseURL = api.url || process.env.VUE_APP_LOTTERY_BASE_API
  const { userInfo } = Store.state
  config.headers.token = userInfo.token
  config.data = qs.stringify({ ...config.data, username: userInfo.username })
  return config
}, err => {
  console.log(err)
  toast()
  return Promise.resolve(err)
})

request.interceptors.response.use(res => {
  const { data, config } = res
  if (res) {
    if (data.code === 0) return data.data
    if (data.code === 995 && config.url.includes('apijiekou.getLotteryOpencodes.do')) return {}
    else if (data.code === 999) {
      toast(data.message)
      setTimeout(() => {
        parent.postMessage('login', '*')
      }, 1500)
    } else toast(data.message)
  } else toast()
  return Promise.reject(data)
}, err => {
  console.log(err)
  return Promise.resolve(err)
})

export default request
