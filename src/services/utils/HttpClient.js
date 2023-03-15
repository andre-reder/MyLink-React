/* eslint-disable no-nested-ternary */
class HttpClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async get({ path, authorization }) {
    const fetchConfig = {
      headers: {
        authorization: `Bearer ${authorization}`,
      },
    };
    const response = await fetch(`${this.baseURL}${path}`, fetchConfig);

    const contentType = response.headers.get('Content-Type');

    let body = null;
    if (contentType.includes('application/json')) {
      body = await response.json();
    }

    if (response.ok) {
      return body;
    }

    throw new Error(
      body?.error || `${response.status} - ${response.statusText}`,
    );
  }

  async post({
    path, reqBody, contentType, authorization,
  }) {
    const formData = new FormData();
    if (contentType === 'multipart/form-data') {
      reqBody.forEach((keyValue) => {
        formData.append(keyValue.key, keyValue.value);
      });
    }

    const fetchConfig = (reqBody) ? (
      (contentType === 'multipart/form-data') ? {
        method: 'POST',
        body: formData,
        headers: {
          authorization: `Bearer ${authorization}`,
        },
      } : {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${authorization}`,
        },
        body: `${reqBody}`,
      }
    ) : {
      method: 'POST',
      headers: {
        authorization: `Bearer ${authorization}`,
      },
    };

    const response = await fetch(`${this.baseURL}${path}`, fetchConfig);

    const responseContentType = response.headers.get('Content-Type');

    let body = null;
    if (responseContentType.includes('application/json')) {
      body = await response.json();
    }

    if (response.ok) {
      return body;
    }

    throw new Error(
      body?.error || `${response.status} - ${response.statusText}`,
    );
  }

  async put({
    path, reqBody, contentType, authorization,
  }) {
    const formData = new FormData();
    if (contentType === 'multipart/form-data') {
      reqBody.forEach((keyValue) => {
        formData.append(keyValue.key, keyValue.value);
      });
    }

    const fetchConfig = (reqBody) ? (
      (contentType === 'multipart/form-data') ? {
        method: 'PUT',
        body: formData,
        headers: {
          authorization: `Bearer ${authorization}`,
        },
      } : {
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${authorization}`,
        },
        body: `${reqBody}`,
      }
    ) : {
      method: 'PUT',
    };

    const response = await fetch(`${this.baseURL}${path}`, fetchConfig);

    const responseContentType = response.headers.get('Content-Type');

    let body = null;
    if (responseContentType.includes('application/json')) {
      body = await response.json();
    }

    if (response.ok) {
      return body;
    }

    throw new Error(
      body?.error || `${response.status} - ${response.statusText}`,
    );
  }

  async patch({
    path, reqBody, contentType, authorization,
  }) {
    const formData = new FormData();
    if (contentType === 'multipart/form-data') {
      reqBody.forEach((keyValue) => {
        formData.append(keyValue.key, keyValue.value);
      });
    }

    const fetchConfig = (reqBody) ? (
      (contentType === 'multipart/form-data') ? {
        method: 'PATCH',
        body: formData,
        headers: {
          authorization: `Bearer ${authorization}`,
        },
      } : {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${authorization}`,
        },
        body: `${reqBody}`,
      }
    ) : {
      method: 'PATCH',
    };

    const response = await fetch(`${this.baseURL}${path}`, fetchConfig);

    const responseContentType = response.headers.get('Content-Type');

    let body = null;
    if (responseContentType.includes('application/json')) {
      body = await response.json();
    }

    if (response.ok) {
      return body;
    }

    throw new Error(
      body?.error || `${response.status} - ${response.statusText}`,
    );
  }

  async delete(path, reqBody, authorization) {
    const fetchConfig = reqBody ? {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${authorization}`,
      },
      body: `${reqBody}`,
    } : {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${authorization}`,
      },
    };
    const response = await fetch(`${this.baseURL}${path}`, fetchConfig);

    const contentType = response.headers.get('Content-Type');

    let body = null;
    if (contentType.includes('application/json')) {
      body = await response.json();
    }

    if (response.ok) {
      return body;
    }

    throw new Error(
      body?.error || `${response.status} - ${response.statusText}`,
    );
  }
}

export default HttpClient;
