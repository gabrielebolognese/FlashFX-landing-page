/*
 * Privacy notice content, transcribed from the Termly document
 * 3988d8e2-6a65-4a0e-b9ed-f9d69258766b (last updated 31 January 2026) and
 * rendered natively rather than through Termly's embed script.
 *
 * WHY NATIVE RATHER THAN EMBEDDED
 *
 * The embed injects its text client-side, so the server HTML is an empty shell.
 * This version is in the server HTML, which means it is readable without
 * JavaScript, indexable, and printable.
 *
 * THE COST OF THAT, WHICH SOMEONE MUST OWN
 *
 * Editing the policy in Termly no longer updates this page. When the Termly
 * document changes, this file has to be updated by hand and `lastUpdated`
 * bumped. `/privacy` still carries the live embed, so if the two ever disagree,
 * `/privacy` is the authoritative one.
 *
 * Inline links use [text](url) and are parsed by the renderer.
 */

export const lastUpdated = '31 January 2026';
export const legalEntity = 'FlashFX S.r.l.';
export const contactEmail = 'support@flashfx.app';
export const postalAddress = ['FlashFX S.r.l.', 'xxv aprile', 'Pontecchio, RO 45030', 'Italy'];
export const dsarUrl = 'https://app.termly.io/dsar/3988d8e2-6a65-4a0e-b9ed-f9d69258766b';

export type Block =
  | { kind: 'p'; text: string }
  | { kind: 'ul'; items: string[] }
  | { kind: 'h3'; text: string };

export interface PolicySection {
  id: string;
  title: string;
  inShort?: string;
  blocks: Block[];
}

/** The plain-language summary that opens the page. */
export const keyPoints: { question: string; answer: string }[] = [
  {
    question: 'What personal information do we process?',
    answer:
      'Email addresses and passwords, when you register. Payment details if you buy something, handled entirely by Stripe. Profile information from a social account if you choose to sign in with one.',
  },
  {
    question: 'Do we process sensitive personal information?',
    answer:
      'No. Nothing in the categories treated as special or sensitive under data protection law — racial or ethnic origin, sexual orientation, religious belief and so on.',
  },
  {
    question: 'Do we collect information from third parties?',
    answer: 'No. We do not buy or receive personal information about you from anyone else.',
  },
  {
    question: 'Do we sell your information?',
    answer:
      'No. We have not disclosed, sold or shared personal information to third parties for a business or commercial purpose in the preceding twelve months, and we will not.',
  },
  {
    question: 'How long do we keep it?',
    answer:
      'No longer than the period during which you have an account with us, unless the law requires otherwise. After that it is deleted or anonymised.',
  },
  {
    question: 'What are your rights?',
    answer:
      'Depending on where you live: access, correction, deletion, a copy of your data, portability, and objection. You can withdraw consent at any time.',
  },
];

export const sections: PolicySection[] = [
  {
    id: 'what-we-collect',
    title: 'What information do we collect',
    inShort: 'We collect personal information that you provide to us.',
    blocks: [
      {
        kind: 'p',
        text: 'We collect personal information that you voluntarily provide when you register on the Services, express an interest in our products, participate in activities on the Services, or otherwise contact us.',
      },
      { kind: 'h3', text: 'Information you give us' },
      { kind: 'ul', items: ['Email addresses', 'Passwords'] },
      { kind: 'h3', text: 'Sensitive information' },
      { kind: 'p', text: 'We do not process sensitive information.' },
      { kind: 'h3', text: 'Payment data' },
      {
        kind: 'p',
        text: 'If you make a purchase we may collect data necessary to process your payment, such as your payment instrument number and its security code. All payment data is handled and stored by Stripe. Their privacy notice is at [stripe.com/en-it/privacy](https://stripe.com/en-it/privacy).',
      },
      { kind: 'h3', text: 'Social media login data' },
      {
        kind: 'p',
        text: 'You may register using an existing social media account. If you do, we receive certain profile information from that provider — often your name, email address, friends list and profile picture, plus anything else you have made public there.',
      },
      {
        kind: 'p',
        text: 'All personal information you provide must be true, complete and accurate, and you must tell us if any of it changes.',
      },
    ],
  },
  {
    id: 'how-we-process',
    title: 'How we process your information',
    inShort:
      'To provide, improve and administer our Services, communicate with you, for security and fraud prevention, and to comply with law.',
    blocks: [
      {
        kind: 'ul',
        items: [
          'To facilitate account creation and authentication, and otherwise manage user accounts — so you can create an account, log in, and keep it in working order.',
          'To save or protect a person’s vital interest, such as to prevent harm.',
        ],
      },
      {
        kind: 'p',
        text: 'We may also process your information for other purposes, but only with your prior explicit consent.',
      },
    ],
  },
  {
    id: 'legal-bases',
    title: 'What legal bases we rely on',
    inShort:
      'We only process your personal information when we have a valid legal reason to do so under applicable law.',
    blocks: [
      { kind: 'h3', text: 'If you are in the EU or UK' },
      {
        kind: 'p',
        text: 'The GDPR and UK GDPR require us to explain the legal bases we rely on. We may rely on:',
      },
      {
        kind: 'ul',
        items: [
          'Consent — where you have given us permission for a specific purpose. You can withdraw it at any time.',
          'Legal obligations — where processing is necessary to comply with the law, cooperate with law enforcement or a regulator, or exercise or defend legal rights.',
          'Vital interests — where processing is necessary to protect your vital interests or those of a third party, such as a potential threat to someone’s safety.',
        ],
      },
      { kind: 'h3', text: 'If you are in Canada' },
      {
        kind: 'p',
        text: 'We may process your information where you have given express consent, or where consent can reasonably be inferred. You can withdraw consent at any time. In limited cases the law permits processing without consent — for example where collection is clearly in your interests and consent cannot be obtained in time, for fraud detection and prevention, for certain business transactions, or where disclosure is required by a subpoena, warrant or court order.',
      },
    ],
  },
  {
    id: 'sharing',
    title: 'When and with whom we share your information',
    inShort: 'Only in the specific situations described here.',
    blocks: [
      {
        kind: 'ul',
        items: [
          'Business transfers — we may share or transfer your information in connection with, or during negotiations of, a merger, sale of company assets, financing, or acquisition of all or part of our business.',
        ],
      },
      {
        kind: 'p',
        text: 'We may also disclose personal information to service providers under a written contract with each of them.',
      },
    ],
  },
  {
    id: 'ai',
    title: 'AI-powered features',
    inShort:
      'We offer features powered by artificial intelligence, machine learning and similar technologies.',
    blocks: [
      {
        kind: 'p',
        text: 'We provide these through third-party AI service providers, namely OpenAI and Anthropic. Your input, output and personal information are shared with and processed by those providers to enable the AI features. You must not use them in any way that violates those providers’ terms or policies.',
      },
      { kind: 'h3', text: 'What the AI features do' },
      { kind: 'ul', items: ['AI automation'] },
      {
        kind: 'p',
        text: 'All personal information processed using AI features is handled in line with this notice and our agreements with those third parties.',
      },
    ],
  },
  {
    id: 'social-logins',
    title: 'How we handle social logins',
    inShort:
      'If you register or log in using a social media account, we may receive certain information about you.',
    blocks: [
      {
        kind: 'p',
        text: 'We use what we receive only for the purposes described in this notice, or as otherwise made clear to you. We do not control, and are not responsible for, other uses of your personal information by your social media provider. We recommend reviewing their privacy notice and their privacy settings.',
      },
    ],
  },
  {
    id: 'retention',
    title: 'How long we keep your information',
    inShort: 'Only as long as necessary for the purposes set out here, unless the law requires longer.',
    blocks: [
      {
        kind: 'p',
        text: 'No purpose in this notice requires us to keep your personal information for longer than the period during which you have an account with us, unless a longer retention period is required or permitted by law — for tax, accounting or other legal requirements.',
      },
      {
        kind: 'p',
        text: 'When we have no ongoing legitimate business need to process your information, we will delete or anonymise it. Where that is not possible — for example because it sits in a backup archive — we will store it securely and isolate it from further processing until deletion is possible.',
      },
    ],
  },
  {
    id: 'security',
    title: 'How we keep your information safe',
    inShort:
      'Through a system of organisational and technical security measures — with the honest caveat below.',
    blocks: [
      {
        kind: 'p',
        text: 'We have implemented appropriate and reasonable technical and organisational security measures designed to protect any personal information we process.',
      },
      {
        kind: 'p',
        text: 'However, no electronic transmission over the internet and no information storage technology can be guaranteed to be 100% secure. We cannot promise that hackers, cybercriminals or other unauthorised third parties will never defeat our security and improperly collect, access, steal or modify your information. Transmission to and from our Services is at your own risk, and you should only use the Services within a secure environment.',
      },
    ],
  },
  {
    id: 'your-rights',
    title: 'Your privacy rights',
    inShort:
      'Depending on where you live, you may have rights giving you greater access to and control over your personal information.',
    blocks: [
      {
        kind: 'p',
        text: 'In the EEA, UK, Switzerland and Canada these may include the right to request access and obtain a copy of your personal information, to request rectification or erasure, to restrict processing, to data portability where applicable, and not to be subject to automated decision-making. If a decision producing legal or similarly significant effects were ever made solely by automated means, we would tell you, explain the main factors, and offer a simple way to request human review. In certain circumstances you may also object to processing.',
      },
      { kind: 'h3', text: 'Withdrawing your consent' },
      {
        kind: 'p',
        text: 'Where we rely on your consent, you can withdraw it at any time by contacting us, or by updating your preferences. Withdrawal does not affect the lawfulness of processing before it, nor processing carried out on a lawful basis other than consent.',
      },
      { kind: 'h3', text: 'Your account' },
      {
        kind: 'p',
        text: 'You can review or change the information in your account, or terminate it, by logging in to your account settings. On termination we will deactivate or delete your account and information from our active databases. We may retain some information to prevent fraud, troubleshoot problems, assist investigations, enforce our legal terms, or comply with legal requirements.',
      },
      { kind: 'h3', text: 'If you want to complain' },
      {
        kind: 'p',
        text: 'You can complain to us directly using the contact details below. If you are in the EEA or UK and believe we are processing your information unlawfully, you may also complain to your [Member State data protection authority](https://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm) or the [UK data protection authority](https://ico.org.uk/make-a-complaint/data-protection-complaints/data-protection-complaints/). In Switzerland, contact the [Federal Data Protection and Information Commissioner](https://www.edoeb.admin.ch/edoeb/en/home.html).',
      },
      {
        kind: 'p',
        text: 'If you complain to us we will acknowledge it within 30 days, investigate without unjustifiable delay, keep you informed of progress, and explain the outcome.',
      },
    ],
  },
  {
    id: 'do-not-track',
    title: 'Do Not Track and Global Privacy Control',
    blocks: [
      {
        kind: 'p',
        text: 'There is no finalised uniform standard for recognising Do Not Track signals, so we do not currently respond to DNT browser signals or similar mechanisms. If a standard is adopted that we must follow, we will say so in a revised version of this notice.',
      },
      {
        kind: 'p',
        text: 'We do recognise and honour Global Privacy Control. If you use a browser or extension that supports GPC, we treat it as a valid opt-out of the sale or sharing of your personal information for targeted advertising under applicable state privacy laws, and apply it automatically without any further action from you. More at [globalprivacycontrol.org](https://globalprivacycontrol.org/).',
      },
    ],
  },
  {
    id: 'us-residents',
    title: 'United States residents',
    inShort:
      'Residents of many US states have rights to access, correct, obtain a copy of, or delete their personal information.',
    blocks: [
      {
        kind: 'p',
        text: 'This applies if you live in California, Colorado, Connecticut, Delaware, Florida, Indiana, Iowa, Kentucky, Maryland, Minnesota, Montana, Nebraska, New Hampshire, New Jersey, Oregon, Rhode Island, Tennessee, Texas, Utah or Virginia. Those rights may be limited in some circumstances by applicable law.',
      },
      { kind: 'h3', text: 'Your rights' },
      {
        kind: 'ul',
        items: [
          'To know whether we are processing your personal data',
          'To access your personal data',
          'To correct inaccuracies in it',
          'To request its deletion',
          'To obtain a copy of the personal data you previously shared with us',
          'Not to be discriminated against for exercising these rights',
          'To opt out of processing for targeted advertising, sale of personal data, or profiling with legal or similarly significant effects',
        ],
      },
      {
        kind: 'p',
        text: 'Depending on your state you may also have the right to a list of the categories of third parties we have disclosed personal data to, a list of specific third parties, or the right to review and question how personal data has been profiled.',
      },
      { kind: 'h3', text: 'How to exercise them' },
      {
        kind: 'p',
        text: 'Submit a data subject access request, email us, or use the contact details at the bottom of this page. On receiving a request we need to verify your identity, using only the information in your request. If we cannot verify you from what we already hold, we may ask for more.',
      },
      {
        kind: 'p',
        text: 'You may designate an authorised agent. We may deny a request from an agent who does not provide proof of valid authorisation. If we decline to act on your request, you may appeal by emailing us; we will respond in writing with our reasons, and if the appeal is denied you may complain to your state attorney general.',
      },
      { kind: 'h3', text: 'Selling and sharing' },
      {
        kind: 'p',
        text: 'We have not disclosed, sold or shared any personal information to third parties for a business or commercial purpose in the preceding twelve months, and we will not sell or share personal information belonging to website visitors, users or other consumers.',
      },
    ],
  },
  {
    id: 'other-regions',
    title: 'Other regions',
    blocks: [
      { kind: 'h3', text: 'Australia and New Zealand' },
      {
        kind: 'p',
        text: 'We collect and process your personal information under Australia’s Privacy Act 1988 and New Zealand’s Privacy Act 2020. This notice satisfies the notice requirements of both. If you do not provide the personal information necessary for a given purpose, it may affect our ability to offer you the products or services you want, respond to your requests, manage your account, or confirm your identity and protect your account.',
      },
      {
        kind: 'p',
        text: 'You may request access to or correction of your personal information at any time. If you believe we are processing it unlawfully you can complain to the [Office of the Australian Information Commissioner](https://www.oaic.gov.au/privacy/privacy-complaints/lodge-a-privacy-complaint-with-us) or the [Office of the New Zealand Privacy Commissioner](https://www.privacy.org.nz/your-rights/making-a-complaint/).',
      },
      { kind: 'h3', text: 'Republic of South Africa' },
      {
        kind: 'p',
        text: 'You may request access to or correction of your personal information at any time. If you are unsatisfied with how we handle a complaint, you can contact [The Information Regulator (South Africa)](https://inforegulator.org.za/) — general enquiries at enquiries@inforegulator.org.za, complaints at POPIAComplaints@inforegulator.org.za.',
      },
    ],
  },
  {
    id: 'updates',
    title: 'Updates to this notice',
    inShort: 'Yes, we will update it as necessary to stay compliant with relevant laws.',
    blocks: [
      {
        kind: 'p',
        text: 'The updated version will be marked by a revised date at the top. If we make material changes we may notify you by prominently posting a notice, or by contacting you directly. We encourage you to review it from time to time.',
      },
    ],
  },
];
