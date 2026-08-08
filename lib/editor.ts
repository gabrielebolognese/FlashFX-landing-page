/**
 * Where the editor lives, and how to deep-link into it.
 *
 * Every call to action on this site sends people to editor.flashfx.app. The
 * host is here once so a change of domain is a change of one line rather than a
 * search across forty components.
 *
 * ── The deep-link contract ──────────────────────────────────────────────────
 *
 * The editor accepts a single query parameter, `?template=<id>`. Given a known
 * id it creates a fresh project, sets that feature up, plays it, and cleans the
 * URL. That is the whole interface: no SDK, no API, no shared code, nothing
 * imported from the editor project. This file's only job is to build a string.
 *
 * **Ids must match exactly.** The editor whitelists them and silently ignores
 * anything it does not recognise — an unknown or misspelt id does not error, it
 * just drops the visitor on the dashboard with no template and no explanation.
 * There is no way for this repo to validate an id at build time, so `TEMPLATES`
 * below is the list of ones confirmed to exist, and new entries belong there
 * only once the editor side has shipped them.
 */

export const EDITOR_URL = 'https://editor.flashfx.app';

/**
 * Template ids confirmed on the editor side.
 *
 * Keep this in step with the editor's whitelist. A typo here is invisible in
 * every check this repo can run — types pass, the build passes, the link works,
 * and the visitor quietly lands on an empty dashboard.
 */
export const TEMPLATES = {
  particles: 'particles',
} as const;

export type TemplateId = (typeof TEMPLATES)[keyof typeof TEMPLATES];

/**
 * A deep link that opens the editor on a given template.
 *
 * Typed against `TEMPLATES`, so a template that has not been added above is a
 * compile error rather than a link that silently does nothing.
 */
export function editorTemplate(id: TemplateId): string {
  return `${EDITOR_URL}/?template=${id}`;
}
