import { zApiInstanceId, zApiSecurityToken, zApiToken } from '../enviromentVariables';

export default async function sendDocumentWhatsapp({
  phone, message, linkUrl, fileName,
}) {
  try {
    const strNum = phone.replace(/[^\d]+/g, '');

    const response = await fetch(
      `https://api.z-api.io/instances/${zApiInstanceId}/token/${zApiToken}/send-document/pdf`,
      {
        method: 'post',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Client-Token': zApiSecurityToken,
        },
        body: JSON.stringify({
          phone: `+55${strNum}`,
          caption: message,
          document: linkUrl,
          fileName,
        }),
      },
    );
    console.log('responseOfSendEmail', response);
    return { success: true };
  } catch (error) {
    console.log('errorOfSendWhatsapp', error);
    return { success: false, error };
  }
}
