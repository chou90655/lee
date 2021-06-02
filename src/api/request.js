import axios from 'axios'
import qs from 'qs'
import { toast } from '../util/tools'
import Store from '../store'

const request = axios.create({
  baseURL: process.env.VUE_APP_LOTTERY_BASE_API,
  timeout: 60000,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
})
request.interceptors.request.use(config => {
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
      window.location.href = '#/login'
    } else toast(data.message)
  } else toast()
}, err => {
  console.log(err)
  return Promise.resolve(err)
})

export default request
