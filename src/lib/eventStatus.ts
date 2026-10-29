export const isUpcoming = (isoDate: string) => isoDate >= new Date().toISOString().slice(0, 10);

/** Fills the Upcoming/Past pill and the Register/View event link of every event card under `root`. */
export function fillEventStatus(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-event-date]').forEach(el => {
    const past = !isUpcoming(el.dataset.eventDate!);
    const status = el.querySelector<HTMLElement>('.story-status');
    if (status) {
      status.textContent = past ? 'Past' : 'Upcoming';
      status.classList.toggle('is-past', past);
      status.hidden = false;
    }
    const link = el.querySelector<HTMLElement>('[data-event-action]');
    if (link) link.textContent = past ? 'View event' : 'Register';
  });
}

/**
 * Pulls the upcoming event cards (soonest first) out of a story list.
 * With `block` and `grid` they are copied there and the block is shown; `remove: false` leaves the originals in place.
 * `keep` trims the list to that many cards once the upcoming ones are gone.
 */
export function placeUpcoming(
  list: Element | null,
  { block, grid, keep, remove = true }: { block?: HTMLElement | null; grid?: HTMLElement | null; keep?: number; remove?: boolean } = {},
) {
  if (!list) return;
  fillEventStatus();
  const upcoming = [...list.querySelectorAll<HTMLElement>('[data-event-date]')]
    .filter(el => isUpcoming(el.dataset.eventDate!))
    .sort((a, b) => a.dataset.eventDate!.localeCompare(b.dataset.eventDate!));
  if (block && grid && upcoming.length) {
    upcoming.forEach(el => {
      const card = toEventCard(el);
      const [, month, day] = el.dataset.eventDate!.split('-');
      const tile = document.createElement('div');
      tile.className = 'date-tile';
      tile.setAttribute('aria-hidden', 'true'); // the date is already in the card text
      tile.innerHTML = `<span class="month">${new Date(Date.UTC(2000, +month - 1)).toLocaleDateString('en-GB', { month: 'short', timeZone: 'UTC' })}</span><span class="day">${+day}</span>`;
      card.querySelector('.image')?.append(tile);
      addCalendarActions(card);
      grid.append(card);
    });
    block.hidden = false;
  }
  if (remove) upcoming.forEach(el => el.remove());
  if (keep) [...list.children].slice(keep).forEach(el => el.remove());
}

/**
 * Copy of a story card as a div, so it can hold the calendar links without nesting them in an <a>.
 * The "Register" label becomes the real link and stretches over the whole card.
 */
function toEventCard(el: HTMLElement) {
  const card = document.createElement('div');
  for (const { name, value } of el.attributes) if (name !== 'href' && name !== 'rel') card.setAttribute(name, value);
  card.style.display = '';
  card.classList.add('is-event-card');
  card.innerHTML = el.innerHTML;
  const label = card.querySelector('.read-link')!;
  const link = document.createElement('a');
  for (const { name, value } of label.attributes) link.setAttribute(name, value);
  link.href = (el as HTMLAnchorElement).href;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = label.textContent;
  label.replaceWith(link);
  return card;
}

const icsStamp = (iso: string) => new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, '');
const icsText = (s: string) => s.replace(/([\\,;])/g, '\\$1');

function addCalendarActions(card: HTMLElement) {
  const { eventStart, eventEnd } = card.dataset;
  if (!eventStart) return;
  const start = icsStamp(eventStart);
  const end = icsStamp(eventEnd ?? eventStart);
  const title = card.querySelector('h4')!.textContent!.trim();
  const url = card.querySelector<HTMLAnchorElement>('a.read-link')!.href;

  const google = document.createElement('a');
  google.href = 'https://calendar.google.com/calendar/render?' + new URLSearchParams({ action: 'TEMPLATE', text: title, dates: `${start}/${end}`, details: url });
  google.target = '_blank';
  google.rel = 'noopener noreferrer';
  google.textContent = 'Google Calendar';
  google.setAttribute('aria-label', `Add ${title} to Google Calendar`);

  const ics = document.createElement('button');
  ics.type = 'button';
  ics.textContent = 'Download .ics';
  ics.setAttribute('aria-label', `Download ${title} as an .ics calendar file`);
  ics.addEventListener('click', () => {
    const file = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//AI4EOSC//Stories//EN', 'BEGIN:VEVENT',
      `UID:${start}-${new URL(url).pathname.replace(/\W+/g, '-')}@ai4eosc.eu`,
      `DTSTAMP:${icsStamp(new Date().toISOString())}`, `DTSTART:${start}`, `DTEND:${end}`,
      `SUMMARY:${icsText(title)}`, `DESCRIPTION:${icsText(url)}`, `URL:${url}`, 'END:VEVENT', 'END:VCALENDAR',
    ].join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([file], { type: 'text/calendar' }));
    a.download = 'event.ics';
    a.click();
    URL.revokeObjectURL(a.href);
  });

  const actions = document.createElement('div');
  actions.className = 'event-actions';
  actions.append('Add to calendar:', google, ics);
  // Register on the left, calendar links on the right of the same line
  const footer = document.createElement('div');
  footer.className = 'event-footer';
  const register = card.querySelector('a.read-link')!;
  register.replaceWith(footer);
  footer.append(register, actions);
}
