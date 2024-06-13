import { zApiInstanceId, zApiSecurityToken, zApiToken } from '../enviromentVariables';

export default async function sendWhatsapp({ phone, message }) {
  try {
    const strNum = phone.replace(/[^\d]+/g, '');

    const response = await fetch(
      `https://api.z-api.io/instances/${zApiInstanceId}/token/${zApiToken}/send-text`,
      {
        method: 'post',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Client-Token': zApiSecurityToken,
        },
        body: JSON.stringify({
          phone: `+55${strNum}`,
          message,
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
