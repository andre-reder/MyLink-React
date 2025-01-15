import { tokenUtilsApi } from '../enviromentVariables';

export default async function sendDocumentWhatsapp({
  phone, message, linkUrl, fileName, companyName, contactName,
}) {
  try {
    const strNum = phone.replace(/[^\d]+/g, '');

    const response = await fetch(
      `https://utils.captamobilidade.com.br/whatsapp/sendPdf?phone=${strNum}&message=${encodeURIComponent(message)}&isAutImp=false&linkUrl=${encodeURIComponent(linkUrl)}&fileName=${encodeURIComponent(fileName)}&companyName=${encodeURIComponent(companyName)}&contactName=${encodeURIComponent(contactName)}`,
      {
        method: 'post',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenUtilsApi}`,
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
