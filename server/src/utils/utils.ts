import {URL} from 'url';

export function isPublicUrl(input: string): boolean {
  try {
    const u = new URL(input);
    const host = u.hostname;

    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host.startsWith('10.') ||
      host.startsWith('192.168.') ||
      host.startsWith('172.')
    )
      return false;

    return true;
  } catch {
    return false;
  }
}

export function normalizeUrl(url: string): string {
  try {
    const u = new URL(url);
    u.search = '';
    u.hash = '';
    return u.toString().toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}
