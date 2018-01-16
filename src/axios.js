import * as axios from 'axios';

export default axios.create({
  baseURL: 'http://10.1.38.88:3400/api',
  withCredentials: false
});
