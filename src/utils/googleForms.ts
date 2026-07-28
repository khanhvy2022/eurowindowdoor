export const submitToGoogleForms = async (data: {
  name: string;
  phone: string;
  email?: string;
  message?: string;
}) => {
  // Google Form Response URL (same form ID, /viewform → /formResponse)
  const formUrl =
    'https://docs.google.com/forms/d/e/1FAIpQLSd3cu-wOS6zPnR13zeh3skeR2URaHMPROL6Mbm96qvJQPaqvg/formResponse';

  // Entry IDs from the original Blogger form configuration
  // entry.1268787465 → Tên (Name)
  // entry.1499324337 → Số ĐT (Phone)
  // entry.687180203  → Email
  // entry.227759760  → Tin Nhắn (Message)
  const formData = new FormData();
  formData.append('entry.1268787465', data.name);
  formData.append('entry.1499324337', data.phone);
  formData.append('entry.687180203',  data.email ?? '');
  formData.append('entry.227759760',  data.message ?? '');

  try {
    await fetch(formUrl, {
      method: 'POST',
      mode: 'no-cors',
      body: formData,
    });
    return true;
  } catch (error) {
    console.error('Google Forms submission error:', error);
    return false;
  }
};
