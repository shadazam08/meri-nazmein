import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function getSessionCookieOptions(options: {
  domain?: string;
  path?: string;
  sameSite?: boolean | "lax" | "strict" | "none";
  secure?: boolean;
  httpOnly?: boolean;
  maxAge?: number;
  expires?: Date;
}) {
  // Cookie deletion ko preserve karo.
  if (options.maxAge === 0) {
    return {
      ...options,
      secure: process.env.NODE_ENV === "production" ? true : options.secure,
    };
  }

  // Normal auth session ko persistent mat banao.
  const sessionOptions = {
    ...options,
  };

  delete sessionOptions.maxAge;
  delete sessionOptions.expires;

  return {
    ...sessionOptions,
    secure: process.env.NODE_ENV === "production",
  };
}

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },

      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, getSessionCookieOptions(options));
          });
        } catch {
          // Server Components cannot always write cookies.
          // Proxy handles session refresh.
        }
      },
    },
  });
}
