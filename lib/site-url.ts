import { headers } from 'next/headers';

// Used to build absolute redirect URLs for Supabase email links (signup
// confirmation, password recovery). Prefer an explicit env var in
// production so these links don't depend on request headers.
export async function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;

  const headerList = await headers();
  const host = headerList.get('host') ?? 'localhost:3000';
  const protocol = host.startsWith('localhost') ? 'http' : 'https';
  return `${protocol}://${host}`;
}
