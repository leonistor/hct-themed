import { JWTAuthentication, type Payload } from "payload";

export function tokenCookieName(payload: Payload): string {
  return `${payload.config.cookiePrefix}-token`;
}

export async function getAdminUser(payload: Payload, request: Request) {
  const headers = new Headers(request.headers);
  headers.set("DisableAutologin", "true");
  try {
    const { user } = await JWTAuthentication({
      headers,
      payload,
      strategyName: "local-jwt",
    });
    return user;
  } catch {
    return null;
  }
}

export function setAuthCookie(
  cookieName: string,
  token: string,
  expiresAtSeconds: number,
  secure: boolean,
): string {
  const maxAge = Math.max(
    0,
    expiresAtSeconds - Math.floor(Date.now() / 1000),
  );
  return `${cookieName}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure ? "; Secure" : ""}`;
}

export function clearAuthCookie(cookieName: string, secure: boolean): string {
  return `${cookieName}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT${secure ? "; Secure" : ""}`;
}