import { Fragment } from 'react';

/*
 * Minimal [text](url) parser for the policy content.
 *
 * Deliberately not a markdown library and deliberately not
 * dangerouslySetInnerHTML: this renders legal text transcribed from a third
 * party, and the safest thing to do with it is treat every span as plain text
 * and build the anchors ourselves. Links are rendered as external only when the
 * URL is external, which every link in this document currently is.
 */
const LINK = /\[([^\]]+)\]\(([^)]+)\)/g;

export function RichText({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  LINK.lastIndex = 0;
  while ((match = LINK.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<Fragment key={`t${lastIndex}`}>{text.slice(lastIndex, match.index)}</Fragment>);
    }

    const [, label, href] = match;
    const isExternal = /^https?:\/\//.test(href);

    parts.push(
      <a
        key={`l${match.index}`}
        href={href}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className="text-fx-accent-blue hover:underline"
      >
        {label}
      </a>
    );

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(<Fragment key={`t${lastIndex}`}>{text.slice(lastIndex)}</Fragment>);
  }

  return <>{parts}</>;
}
