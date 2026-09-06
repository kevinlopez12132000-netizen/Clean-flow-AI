import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Routes reachable without a session.
const PUBLIC_PATHS = ['/login', '/signup', '/forgot-password', '/reset-password'];
// Of those, the ones a logged-in user shouldn't linger on (reset-password
// is excluded: a user who just completed the recovery-email flow has a
// session by the time they land there, and any logged-in user is allowed
// to use it to change their password).
const AUTH_ONLY_PATHS = ['/login', '/signup', '/forgot-password'];

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({ request });
  const { pathname } = request.nextUrl;

  // Route handlers under /auth/ (e.g. the email-link confirmation
  // endpoint) manage their own redirects.
  if (pathname.startsWith('/auth/')) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isApiRoute = pathname.startsWith('/api/');

  if (!user) {
    if (PUBLIC_PATHS.includes(pathname)) return response;
    if (isApiRoute) {
      return NextResponse.json({ error: 'No autenticado.' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (AUTH_ONLY_PATHS.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Everything else requires an active business membership; onboarding is
  // the one place a logged-in-but-business-less user is allowed.
  const { count } = await supabase
    .from('business_members')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const hasBusiness = Boolean(count);

  if (pathname === '/onboarding') {
    if (hasBusiness) return NextResponse.redirect(new URL('/', request.url));
    return response;
  }

  if (!hasBusiness) {
    if (isApiRoute) {
      return NextResponse.json({ error: 'Completa el registro de tu negocio primero.' }, { status: 403 });
    }
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  return response;
}
