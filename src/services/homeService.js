import { pathName } from '../pathName';
import HttpClient from './utils/HttpClient';

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
    semIntregraRJ,
    reqBody,
  }) {
    return this.httpClient.post({
      path: `/RTL_Roteirizar?appCode=2&codEmpresa=${codEmpresa}&codLocTrab=${codLocTrab}&semIntregraRJ=${semIntregraRJ}`,
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

  async getItensAndFiltersList({
    token,
    ufRes,
    ufLT,
  }) {
    return this.httpClient.get({
      path: `/RTL_Bilhetes?appCode=2&ufRes=${ufRes}&ufLT=${ufLT}`,
      authorization: token,
    });
  }

  async confirmManualRouting({
    token,
    reqBody,
  }) {
    return this.httpClient.post({
      path: '/RTL_Bilhetes',
      reqBody,
      authorization: token,
    });
  }
}

export default new HomeService();
