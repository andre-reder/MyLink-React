import HttpClient from './utils/HttpClient';
import { pathName } from '../pathName';

class ResultService {
  constructor() {
    this.httpClient = new HttpClient(pathName);
  }

  async getResult({
    codConsulta,
    codFuncionario,
    token,
  }) {
    return this.httpClient.get({
      path: `/RTL_Roteirizar?appCode=2&codConsulta=${codConsulta}&codFuncionario=${codFuncionario}`, authorization: token,
    });
  }

  async checkResultStatus({
    codConsulta,
    token,
  }) {
    return this.httpClient.get({
      path: `/RTL_VerificarStaResult?codConsulta=${codConsulta}`,
      authorization: token,
    });
  }

  async handleResultAction({
    codConsulta,
    cancelamento,
    exibeCarta,
    token,
  }) {
    return this.httpClient.post({
      path: `/RTL_Aceite?codConsulta=${codConsulta}&cancelamento=${cancelamento}&exibeCarta=${exibeCarta}`,
      authorization: token,
    });
  }

  async makeAdjustmentRequest({
    codConsulta,
    comentario,
    token,
  }) {
    return this.httpClient.post({
      path: `/RTL_Atendimento?codConsulta=${codConsulta}&comentario=${comentario}`,
      authorization: token,
    });
  }

  async sendSignature({
    codFuncionario,
    reqBody,
  }) {
    return this.httpClient.post({
      path: `/RTL_ArquivosDocs?codFuncionario=${codFuncionario}&TipoArquivo=7`,
      contentType: 'multipart/form-data',
      reqBody,
    });
  }
}

export default new ResultService();
