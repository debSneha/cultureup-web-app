import axios from 'axios';
import { decryptData } from '../utils/crypto';

const client = axios.create({ baseURL: process.env.VITE_BASE_URL  });
export const request = async (options: any) => {
  const token = decryptData(sessionStorage.getItem('auth_token'), process.env.VITE_SALT!)
  client.defaults.headers.common.Authorization = `Bearer ${token}`;

  const onSuccess = (response: any) => {
    return response;
  };
  const onError = (error: any) => {
    throw error.response;
  };

  return client({ ...options })
    .then(onSuccess)
    .catch(onError);
};