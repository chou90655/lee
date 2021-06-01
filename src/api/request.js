import axios from 'axios'
import qs from 'qs'
// import { getRequstInfo } from '../util/cach'
import { toast } from '../util/tools'

const request = axios.create({
  baseURL: process.env.VUE_APP_LOTTERY_BASE_API,
  timeout: 60000,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
})
request.interceptors.request.use(config => {
  // const base = getRequstInfo()
  config.headers.token = '$2y$10$FMWa7Q.1/m0d5UadxMeq2ul04nkYMNGaMtex0ktndWwoukv5VHU9a'
  config.data = qs.stringify({ ...config.data })
  return config
}, err => {
  console.log(err)
  toast()
  return Promise.resolve(err)
})

request.interceptors.response.use(res => {
  const { data } = res
  if (res) {
    if (data.code === 0) return data.data
    if (data.code === 995) return {}
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
