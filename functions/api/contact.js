/**
 * Website forms — server-side submit.
 * Cloudflare Pages Function served at https://theharnessproject.org/api/contact
 *
 * Used by the Contact form (/contact), the Pricing request form (/pricing) and the
 * 90-day pilot request form (/partners). Each submission is emailed to the inbox
 * through Resend (resend.com), with Reply-To set to the visitor so "Reply" works.
 *
 * Setup (once): Cloudflare dashboard → Workers & Pages → this site → Settings →
 * Variables and Secrets →
 *   RESEND_API_KEY  (Secret, required)  from resend.com → API Keys
 *   FORM_TO         (optional)          inbox that receives submissions; default email@theharnessproject.org
 *   FORM_FROM       (optional)          sender; default "The HARNESS Project Website <forms@theharnessproject.org>"
 *                                       (the domain must be verified in Resend → Domains)
 * then redeploy. Until RESEND_API_KEY is set, GET reports { live: false } and the
 * browser falls back to the old open-your-email-app flow, so the forms never dead-end.
 *
 * Contract:
 *   GET  → { live: boolean }
 *   POST { kind: 'contact' | 'pilot', topic, name, email, organization, type, track,
 *          participants, start, message, page, website (honeypot), t (ms on page) }
 *   200  { ok: true }
 *   4xx/5xx { ok: false, code } where code is bad_request | not_configured | upstream
 *
 * Zero Stigma Tax: nothing is stored here and message content is never logged.
 */

const DEFAULT_TO = 'email@theharnessproject.org';
const DEFAULT_FROM = 'The HARNESS Project Website <forms@theharnessproject.org>';
const MAX_BODY_BYTES = 32 * 1024;
const MIN_FILL_MS = 2500; // faster than this is a bot
const EMAIL_RE = /^[^\s@<>"']{1,64}@[^\s@<>"']{1,190}\.[A-Za-z]{2,}$/;

const FIELDS = {
  contact: [
    ['name', 'Name', 120, true],
    ['email', 'Email', 254, true],
    ['topic', 'Topic', 80, false],
    ['message', 'Message', 5000, true],
  ],
  pilot: [
    ['name', 'Name', 120, true],
    ['email', 'Email', 254, true],
    ['organization', 'Organization', 200, true],
    ['type', 'Organization type', 80, false],
    ['track', 'Interested in', 80, false],
    ['participants', 'Participants', 40, false],
    ['start', 'Hoped-for start', 80, false],
    ['message', 'Who they serve and what they need', 5000, false],
  ],
};

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

const oneLine = (s) => String(s || '').replace(/[\r\n\t]+/g, ' ').trim();

function sameSite(request) {
  const origin = request.headers.get('Origin');
  if (!origin) return true; // some privacy browsers drop it; the other checks still apply
  try {
    const host = new URL(origin).hostname;
    return (
      host === new URL(request.url).hostname ||
      host === 'theharnessproject.org' ||
      host.endsWith('.theharnessproject.org') ||
      host.endsWith('.pages.dev') ||
      host === 'localhost' ||
      host === '127.0.0.1'
    );
  } catch {
    return false;
  }
}

export const onRequestGet = ({ env }) => json({ live: Boolean(env.RESEND_API_KEY) });

export async function onRequestPost({ request, env }) {
  if (!env.RESEND_API_KEY) return json({ ok: false, code: 'not_configured' }, 503);
  if (!sameSite(request)) return json({ ok: false, code: 'bad_request' }, 403);

  const len = Number(request.headers.get('Content-Length') || 0);
  if (len > MAX_BODY_BYTES) return json({ ok: false, code: 'bad_request' }, 413);

  let data;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return json({ ok: false, code: 'bad_request' }, 413);
    data = JSON.parse(raw);
  } catch {
    return json({ ok: false, code: 'bad_request' }, 400);
  }
  if (!data || typeof data !== 'object') return json({ ok: false, code: 'bad_request' }, 400);

  // Bots: filled the hidden field, or submitted faster than a person can type.
  // Answer "ok" so they don't learn to adapt; nothing is sent.
  if (oneLine(data.website) || Number(data.t || 0) < MIN_FILL_MS) return json({ ok: true });

  const kind = data.kind === 'pilot' ? 'pilot' : 'contact';
  const values = {};
  for (const [key, , max, required] of FIELDS[kind]) {
    let v = String(data[key] ?? '').trim();
    if (key !== 'message') v = oneLine(v);
    if (v.length > max) v = v.slice(0, max);
    if (required && !v) return json({ ok: false, code: 'bad_request', field: key }, 400);
    values[key] = v;
  }
  if (!EMAIL_RE.test(values.email)) return json({ ok: false, code: 'bad_request', field: 'email' }, 400);

  const subject =
    kind === 'pilot'
      ? `Pilot request: ${values.organization}`
      : `Website inquiry: ${values.topic || 'General question'}`;

  const page = oneLine(data.page).slice(0, 200);
  const lines = FIELDS[kind].map(([key, label]) =>
    key === 'message' ? `\n${label}:\n${values[key] || '(none)'}` : `${label}: ${values[key] || '(none)'}`
  );
  lines.push('', `Sent from: theharnessproject.org${page || '/'}`, 'Reply to this email to answer them directly.');

  let res;
  try {
    res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.FORM_FROM || DEFAULT_FROM,
        to: [env.FORM_TO || DEFAULT_TO],
        reply_to: values.email,
        subject: subject.slice(0, 200),
        text: lines.join('\n'),
      }),
    });
  } catch {
    return json({ ok: false, code: 'upstream' }, 502);
  }
  if (!res.ok) {
    console.log('contact form: email provider returned', res.status); // status only, never content
    return json({ ok: false, code: 'upstream' }, 502);
  }
  return json({ ok: true });
}
