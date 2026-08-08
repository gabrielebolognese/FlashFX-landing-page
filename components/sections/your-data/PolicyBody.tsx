import Link from 'next/link';
import { RichText } from './RichText';
import {
  contactEmail,
  dataCategories,
  dsarUrl,
  postalAddress,
  sections,
  type Block,
} from './yourDataContent';

function CategoriesTable() {
  return (
    <div className="overflow-x-auto border border-fx-border rounded-card my-6">
      <table className="w-full min-w-[560px] text-sm">
        <caption className="sr-only">
          Categories of personal information collected in the past twelve months
        </caption>
        <thead>
          <tr className="border-b border-fx-border">
            <th scope="col" className="px-4 py-3 text-left font-medium text-fx-text-secondary uppercase tracking-wider text-xs">
              Category
            </th>
            <th scope="col" className="px-4 py-3 text-left font-medium text-fx-text-secondary uppercase tracking-wider text-xs">
              Examples
            </th>
            <th scope="col" className="px-4 py-3 text-center font-medium text-fx-text-secondary uppercase tracking-wider text-xs">
              Collected
            </th>
          </tr>
        </thead>
        <tbody>
          {dataCategories.map((category) => (
            <tr key={category.letter} className="border-b border-fx-border last:border-b-0">
              <th scope="row" className="px-4 py-3 text-left font-normal align-top">
                <span className="font-mono text-xs mr-2 opacity-60">{category.letter}</span>
                <span className="text-fx-text-primary">{category.name}</span>
              </th>
              <td className="px-4 py-3 text-fx-text-secondary align-top text-xs leading-relaxed">
                {category.examples}
              </td>
              <td className="px-4 py-3 text-center align-top">
                <span
                  className="font-mono text-xs font-bold"
                  style={{ color: category.collected ? '#4ade80' : undefined }}
                >
                  {category.collected ? 'YES' : 'NO'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        if (block.kind === 'categories') {
          return <CategoriesTable key={i} />;
        }

        if (block.kind === 'h3') {
          return (
            <h3
              key={i}
              className="font-display text-lg font-bold text-fx-text-primary mt-7 mb-3 first:mt-0"
            >
              {block.text}
            </h3>
          );
        }

        if (block.kind === 'ul') {
          return (
            <ul key={i} className="space-y-2.5 my-4">
              {block.items.map((item) => (
                <li key={item} className="text-fx-text-secondary leading-relaxed pl-5 relative">
                  <span
                    className="absolute left-0 top-[0.6em] w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: 'rgba(245, 197, 24, 0.6)' }}
                  />
                  <RichText text={item} />
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={i} className="text-fx-text-secondary leading-relaxed my-4">
            <RichText text={block.text} />
          </p>
        );
      })}
    </>
  );
}

export function PolicyBody() {
  return (
    <section className="relative w-full px-6 py-16 md:py-20">
      <div className="max-w-4xl mx-auto">
        <nav aria-label="Contents" className="mb-16">
          <h2 className="font-mono text-xs uppercase tracking-wider text-fx-text-secondary mb-4">
            Contents
          </h2>
          <ol className="space-y-1.5">
            {sections.map((section, i) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="text-fx-text-secondary hover:text-fx-accent-yellow transition-colors"
                >
                  <span className="font-mono text-xs mr-3 opacity-60">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-14">
          {sections.map((section, i) => (
            <article key={section.id} id={section.id} className="scroll-mt-24">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-fx-text-primary mb-4">
                <span className="font-mono text-base mr-3" style={{ color: '#f5c842' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                {section.title}
              </h2>

              {section.inShort && (
                <p className="text-sm text-fx-text-primary leading-relaxed mb-5 pl-5 border-l-2 border-fx-accent-yellow">
                  <span className="font-medium">In short: </span>
                  <span className="text-fx-text-secondary">
                    <RichText text={section.inShort} />
                  </span>
                </p>
              )}

              <Blocks blocks={section.blocks} />
            </article>
          ))}

          <article id="contact" className="scroll-mt-24">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-fx-text-primary mb-4">
              <span className="font-mono text-base mr-3" style={{ color: '#f5c842' }}>
                {String(sections.length + 1).padStart(2, '0')}
              </span>
              How to contact us, and how to get your data
            </h2>

            <p className="text-fx-text-secondary leading-relaxed my-4">
              To review, update or delete the personal information we hold about you, submit a{' '}
              <a
                href={dsarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-fx-accent-blue hover:underline"
              >
                data subject access request
              </a>
              . For anything else about this notice, email{' '}
              <a href={`mailto:${contactEmail}`} className="text-fx-accent-blue hover:underline">
                {contactEmail}
              </a>
              .
            </p>

            <address className="not-italic text-fx-text-secondary leading-relaxed my-6">
              {postalAddress.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>

            <p className="text-sm text-fx-text-secondary leading-relaxed mt-10 pt-6 border-t border-fx-border">
              This page reproduces our privacy notice in full. The{' '}
              <Link href="/privacy" className="text-fx-accent-blue hover:underline">
                privacy policy
              </Link>{' '}
              is the authoritative version. If the two ever disagree, that one governs. See also
              our{' '}
              <Link href="/terms" className="text-fx-accent-blue hover:underline">
                terms of service
              </Link>{' '}
              and{' '}
              <Link href="/acceptable-use-policy" className="text-fx-accent-blue hover:underline">
                acceptable use policy
              </Link>
              .
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
