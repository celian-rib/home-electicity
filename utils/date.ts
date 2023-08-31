export function dateToString (dateToConvert: string | Date | undefined) {
  if (!dateToConvert) { return 'xx'; }
  const pad = (n: number) => (n < 10 ? `0${n}` : n);
  const date = new Date(dateToConvert);
  const day = date.getDate();
  const month = date.toLocaleString('fr-FR', { month: 'long' });
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  if (new Date().getDate() === day) {
    return `Aujourd'hui ${hours}:${minutes}`;
  }

  if (new Date().getDate() - 1 === day) {
    return `Hier ${hours}:${minutes}`;
  }

  return `${day} ${month} ${hours}:${minutes}`;
}

export function dateToAgo (dateToConvert: string | Date | undefined) {
  if (!dateToConvert) { return 'xx'; }

  const date = new Date(dateToConvert);
  const now = new Date();

  const diff = Math.round((now.getTime() - date.getTime()) / 1000);
  const diffMinutes = Math.round(diff / 60);
  const diffSeconds = diff % 60;

  if (diffMinutes > 0) {
    return `Mis à jour il y a ${diffMinutes} minutes`;
  } else if (diffSeconds > 0) {
    return `Mis à jour il y a ${diffSeconds} secondes`;
  }
}
