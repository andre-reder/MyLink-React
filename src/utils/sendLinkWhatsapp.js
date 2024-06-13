import { zApiInstanceId, zApiSecurityToken, zApiToken } from '../enviromentVariables';

export default async function sendLinkWhatsapp({
  phone, message, linkUrl, image, title, linkDescription,
}) {
  try {
    const strNum = phone.replace(/[^\d]+/g, '');

    const response = await fetch(
      `https://api.z-api.io/instances/${zApiInstanceId}/token/${zApiToken}/send-link`,
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
          image,
          linkUrl,
          title,
          linkDescription,
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
