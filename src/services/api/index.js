import * as axios from 'axios';
import config from '@/config.private'

export default axios.create({
  baseURL: config.api,
  withCredentials: false
});
