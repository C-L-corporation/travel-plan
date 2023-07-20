import axios from 'axios'
import Cookies from 'js-cookie'

const token = Cookies.get('token')

axios.defaults.baseURL = 'http://localhost:3000'
axios.defaults.headers.common = { Authorization: `bearer ${token}` }

export default axios
