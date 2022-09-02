export const lessonsTimes = [
  [8, 30, 9, 50],
  [10, 0, 11, 20],
  [11, 30, 12, 50],
  [13, 30, 14, 50],
  [15, 0, 16, 20],
  [16, 30, 17, 50],
  [18, 0, 19, 20],
  [19, 30, 20, 50]
];

export function dateBetween(date, h1, m1, h2, m2) {
  const h = date.getHours();
  const m = date.getMinutes();
  return (h > h1 || (h === h1 && m >= m1)) && (h < h2 || (h === h2 && m <= m2));
}

export function formatTime(h1, m1) {
  const date = new Date();
  date.setHours(h1);
  date.setMinutes(m1);
  return date.toLocaleTimeString().substring(0, 5);
}

export function getScheduleWeek(date = new Date()) {
  const firstJanuary = new Date(date.getFullYear(), 0, 1);
  const dayNr = Math.ceil((date - firstJanuary) / (24 * 60 * 60 * 1000));
  const weekNr = Math.ceil((dayNr + firstJanuary.getDay()) / 7);
  return weekNr % 2 ? 2 : 1;
}

export function findIncludesInArray(value, arr) {
  return arr
    .filter((group) => group.toLowerCase().trim().includes(value.toLowerCase().trim()))
    .map((value) => ({ value }));
}