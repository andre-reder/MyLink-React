import HttpClient from './utils/HttpClient';
import { pathName } from '../pathName';

class HomeService {
  constructor() {
    this.httpClient = new HttpClient(pathName);
  }

  async checkIsCompanyHabilitated({
    token,
    codEmpresa,
  }) {
    return this.httpClient.get({
      path: `/RTL_Acesso?appCode=2&codEmpresa=${codEmpresa}`,
      authorization: token,
    });
  }

  async getWorkplacesList({
    token,
    codEmpresa,
  }) {
    return this.httpClient.get({
      path: `/RTL_ListaLT?codEmpresa=${codEmpresa}`,
      authorization: token,
    });
  }

  async calculateRoute({
    token,
    codEmpresa,
    codLocTrab,
    reqBody,
  }) {
    return this.httpClient.post({
      path: `/RTL_Roteirizar?appCode=2&codEmpresa=${codEmpresa}&codLocTrab=${codLocTrab}`,
      reqBody,
      authorization: token,
    });
  }

  async checkResulStatus({
    token,
    codConsulta,
  }) {
    return this.httpClient.get({
      path: `/RTL_VerificaProc?codConsulta=${codConsulta}`,
      authorization: token,
    });
  }

  async checkCpf({
    cpf,
    codEmpresa,
    token,
  }) {
    return this.httpClient.post({
      path: `/RTL_VerificaProc?cpf=${cpf}&codEmpresa=${codEmpresa}`,
      authorization: token,
    });
  }

  async sendAddressProof({
    codFuncionario,
    reqBody,
  }) {
    return this.httpClient.post({
      path: `/RTL_ArquivosDocs?codFuncionario=${codFuncionario}&TipoArquivo=6`,
      contentType: 'multipart/form-data',
      reqBody,
    });
  }
}

export default new HomeService();
