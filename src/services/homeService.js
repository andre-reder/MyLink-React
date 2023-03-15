import HttpClient from './utils/HttpClient';
import { pathName } from '../pathName';

class AuthService {
  constructor() {
    this.httpClient = new HttpClient(pathName);
  }

  async checkIsCompanyHabilitated({
    codEmpresa,
  }) {
    return this.httpClient.get(`/RTL_Acesso?appCode=2&codEmpresa=${codEmpresa}`);
  }

  async getWorkplacesList({
    codEmpresa,
  }) {
    return this.httpClient.get(`/RTL_ListaLT?codEmpresa=${codEmpresa}`);
  }

  async calculateRoute({
    codEmpresa,
    codLocTrab,
    reqBody,
  }) {
    return this.httpClient.post(`/RTL_Roteirizar?appCode=2&codEmpresa=${codEmpresa}&codLocTrab=${codLocTrab}`, reqBody);
  }

  async checkResulStatus({
    codConsulta,
  }) {
    return this.httpClient.post(`/RTL_VerificaProc?codConsulta=${codConsulta}`);
  }
}

export default new AuthService();
