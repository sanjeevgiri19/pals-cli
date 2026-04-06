/**
 * @param {string} baseUrl
 * @param {() => Promise<string|null>} getBearerToken
 * @param {string} path
 * @param {RequestInit} [init]
 */
export async function apiRequest(baseUrl, getBearerToken, path, init = {}) {
  const root = baseUrl.replace(/\/$/, "");
  const url = `${root}${path.startsWith("/") ? path : `/${path}`}`;
  const headers = new Headers(init.headers || {});
  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }
  const token = await getBearerToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(url, { ...init, headers });
  const text = await res.text();
  let json = null;
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      throw new Error(`Non-JSON response (${res.status}): ${text.slice(0, 200)}`);
    }
  }

  if (!res.ok) {
    const msg =
      json?.error?.message ||
      json?.message ||
      (typeof json === "string" ? json : null) ||
      `Request failed (${res.status})`;
    const err = new Error(msg);
    err.status = res.status;
    err.body = json;
    throw err;
  }

  return json;
}
