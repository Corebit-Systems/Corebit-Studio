export const projectReferenceQuery = 'example';

export const projectReferences = {
  'cupertino-roast': 'Cupertino Roast',
  'shift-drive': 'Shift & Drive STO',
  'umami-bistro': 'Umami Bistro',
  'aura-wellness': 'Aura Wellness',
} as const;

export type ProjectReferenceId = keyof typeof projectReferences;

export function isProjectReference(value: unknown): value is ProjectReferenceId {
  return typeof value === 'string' && Object.hasOwn(projectReferences, value);
}
