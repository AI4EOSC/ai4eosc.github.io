/** "13:00 - 14:30 UTC" from an event's UTC start and end. */
export function eventTime(data: { eventStart?: Date; eventEnd?: Date }) {
  if (!data.eventStart) return undefined;
  const hm = (d: Date) => d.toISOString().slice(11, 16);
  return `${hm(data.eventStart)}${data.eventEnd ? ` - ${hm(data.eventEnd)}` : ''} UTC`;
}
