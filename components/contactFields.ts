export const contactFields = ['name', 'email', 'message'] as const;
export type ContactField = (typeof contactFields)[number];

export const contactNameMaxLength = 100;
export const contactEmailMaxLength = 254;
export const contactMessageMinLength = 10;
export const contactNamePattern = /^[\p{L}\p{M}\s'\-,.]+$/u;

export function hasContactMarkup(message: string) {
  return /<[^>]+>/.test(message);
}
