import type { ProjectReferenceId } from './projectReference';

export const contactMessageLimit = 1000;
export const contactDraftEvent = 'corebit:contact-draft';

interface ContactDraft {
  message: string;
  reference?: ProjectReferenceId;
}

let pendingDraft: ContactDraft | undefined;

export function stageContactDraft(messages: string[], reference?: ProjectReferenceId) {
  const message = messages
    .map((message) => message.trim())
    .filter(Boolean)
    .join('\n\n')
    .replace(/<[^>]+>/g, (text) => text.replaceAll('<', '‹').replaceAll('>', '›'))
    .slice(0, contactMessageLimit)
    .trimEnd();

  if (!message && !reference) return;
  pendingDraft = { message, reference };
  window.dispatchEvent(new Event(contactDraftEvent));
}

export function takeContactDraft() {
  const draft = pendingDraft;
  pendingDraft = undefined;
  return draft;
}

export function mergeContactDraft(current: string, draft: string) {
  if (!current.trim()) return draft;
  if (current.includes(draft)) return current;
  return `${current.trimEnd()}\n\n${draft}`.slice(0, contactMessageLimit).trimEnd();
}
