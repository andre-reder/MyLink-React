import HttpClient from './utils/HttpClient';
import { pathName } from '../pathName';

class AuthService {
  constructor() {
    this.httpClient = new HttpClient(pathName);
  }

  async getToken({
    reqBody,
  }) {
    return this.httpClient.post({ path: '/RTL_TK0', reqBody });
  }
}

export default new AuthService();
