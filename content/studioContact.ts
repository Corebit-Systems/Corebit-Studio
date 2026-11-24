const phoneLabel = '+382 68 914 816';
const whatsappLabel = '+359 88 290 5657';

export const studioContact = {
  email: 'corebitstudio@corebitsystems.io',
  telephone: phoneLabel.replaceAll(' ', ''),
  phoneLabel,
  whatsappUrl: `https://wa.me/${whatsappLabel.replace(/\D/g, '')}`,
  whatsappLabel,
};
