export const contactMessageLimit = 1000;
export const contactDraftEvent = 'corebit:contact-draft';

let pendingDraft = '';

export function stageContactDraft(messages: string[]) {
  pendingDraft = messages
    .map((message) => message.trim())
    .filter(Boolean)
    .join('\n\n')
    .replace(/<[^>]+>/g, (text) => text.replaceAll('<', '‹').replaceAll('>', '›'))
    .slice(0, contactMessageLimit)
    .trimEnd();

  if (pendingDraft) window.dispatchEvent(new Event(contactDraftEvent));
}

export function takeContactDraft() {
  const draft = pendingDraft;
  pendingDraft = '';
  return draft;
}

export function mergeContactDraft(current: string, draft: string) {
  if (!current.trim()) return draft;
  if (current.includes(draft)) return current;
  return `${current.trimEnd()}\n\n${draft}`.slice(0, contactMessageLimit).trimEnd();
}
