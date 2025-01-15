import { tokenUtilsApi } from '../enviromentVariables';

export default async function sendLinkWhatsapp({
  phone, message, linkUrl, image, title, linkDescription, companyName, contactName,
}) {
  try {
    const strNum = phone.replace(/[^\d]+/g, '');

    const response = await fetch(
      `https://utils.captamobilidade.com.br/whatsapp/sendLink?phone=${strNum}&message=${encodeURIComponent(message)}&isAutImp=false&companyName=${encodeURIComponent(companyName)}&contactName=${encodeURIComponent(contactName)}&linkUrl=${encodeURIComponent(linkUrl)}&image=${encodeURIComponent(image)}&title=${encodeURIComponent(title)}&linkDescription=${encodeURIComponent(linkDescription)}`,
      {
        method: 'post',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenUtilsApi}`,
        },
      },
    );
    console.log('responseOfSendEmail', response);
    return { success: true };
  } catch (error) {
    console.log('errorOfSendWhatsapp', error);
    return { success: false, error };
  }
}
