/*
 * Release history. Newest first — the page renders this array in order and does
 * not sort it, so put new entries at the top.
 *
 * TO ADD A RELEASE, copy this and fill it in:
 *
 *   {
 *     date: '2026-08-14',                    // ISO. Renders as "14 August 2026"
 *     version: '2.4',                        // optional, omit if you do not version
 *     title: 'Repeaters and cloners',        // one line, what actually landed
 *     changes: [
 *       { type: 'added',   text: 'Grid, radial and path distribution for repeaters.' },
 *       { type: 'improved', text: 'Timeline scrubbing is smoother on long projects.' },
 *       { type: 'fixed',   text: 'Exported PNG sequences no longer drop the final frame.' },
 *     ],
 *   },
 *
 * Only write down things that shipped. A changelog that lists work in progress
 * stops being a changelog, and an entry claiming a feature that is not live is
 * the same class of problem FIX.md M4 removed from the rest of the site.
 *
 * An empty array is fine — the page renders an honest empty state rather than
 * breaking or inventing filler.
 */

export type ChangeType = 'added' | 'improved' | 'fixed';

export interface Change {
  type: ChangeType;
  text: string;
}

export interface Release {
  date: string;
  version?: string;
  title: string;
  changes: Change[];
}

/** Labels and colours per change type. */
export const CHANGE_META: Record<ChangeType, { label: string; color: string }> = {
  added: { label: 'Added', color: '#4ade80' },
  improved: { label: 'Improved', color: '#f5c842' },
  fixed: { label: 'Fixed', color: '#7C5CBF' },
};

export const releases: Release[] = [];
