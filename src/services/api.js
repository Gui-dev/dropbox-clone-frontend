import axios from 'axios'

const api = axios.create( {

  // baseURL: "http://192.168.0.105:3333"
  baseURL: "https://dropboxclonebackend.herokuapp.com"
} )

export default api