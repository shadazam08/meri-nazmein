import { createBrowserClient } from "@supabase/ssr";

function getBrowserCookies() {
  if (typeof document === "undefined") {
    return [];
  }

  return document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .filter(Boolean)
    .map((cookie) => {
      const separatorIndex = cookie.indexOf("=");

      if (separatorIndex === -1) {
        return {
          name: cookie,
          value: "",
        };
      }

      return {
        name: cookie.slice(0, separatorIndex),
        value: cookie.slice(separatorIndex + 1),
      };
    });
}

function setBrowserCookies(
  cookiesToSet: Array<{
    name: string;
    value: string;
    options?: {
      domain?: string;
      path?: string;
      sameSite?: boolean | "lax" | "strict" | "none";
      secure?: boolean;
      httpOnly?: boolean;
      maxAge?: number;
      expires?: Date;
    };
  }>,
) {
  if (typeof document === "undefined") {
    return;
  }

  for (const { name, value, options } of cookiesToSet) {
    const cookieParts = [`${name}=${value}`, `Path=${options?.path ?? "/"}`];

    if (options?.domain) {
      cookieParts.push(`Domain=${options.domain}`);
    }

    const sameSite = options?.sameSite === "strict" ? "Strict" : options?.sameSite === "none" ? "None" : "Lax";

    cookieParts.push(`SameSite=${sameSite}`);

    // HTTPS production mein auth cookie Secure hogi.
    if (options?.secure === true || window.location.protocol === "https:") {
      cookieParts.push("Secure");
    }

    // maxAge=0 means delete cookie.
    // Normal auth session ke liye Max-Age/Expires intentionally nahi bhej rahe,
    // isliye browser-close ke baad cookie persistent nahi rahegi.
    if (options?.maxAge === 0) {
      cookieParts.push("Max-Age=0");
    }

    document.cookie = cookieParts.join("; ");
  }
}

export function createClient() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll() {
        return getBrowserCookies();
      },

      setAll(cookiesToSet) {
        setBrowserCookies(cookiesToSet);
      },
    },
  });
}
