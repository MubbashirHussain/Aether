const API_BASE = process.env.NEXT_PUBLIC_BACKEND_PUBLIC_API_URL;

interface FormatItem {
  formatId: string;
  ext: string;
  resolution: string;
  filesize?: number;
  quality?: string;
  isAudioAvailable: boolean;
}

interface SafeVideoMetadata {
  platform: string;
  id: string;
  title: string;
  thumbnail: string;
  duration: number;
  author: string;
  formats: FormatItem[];
}

interface SessionResponse {
  sessionId: string;
  unlockAfter: number;
}

interface UnlockResponse {
  metadata: SafeVideoMetadata;
  streamToken: string;
}

export async function fetchAPI(
  url: string,
  options?: RequestInit,
): Promise<Response> {
  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  return response;
}

export async function analyzeUrl(url: string): Promise<SafeVideoMetadata> {
  const res = await fetchAPI("/api/download", {
    method: "POST",
    body: JSON.stringify({ url }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(
      err?.errors?.[0]?.message || `Analysis failed (${res.status})`,
    );
  }

  const json = await res.json();
  return json.data;
}

export async function startSession(url: string): Promise<SessionResponse> {
  const res = await fetchAPI("/api/download/session", {
    method: "POST",
    body: JSON.stringify({ url }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || `Session creation failed (${res.status})`);
  }

  return res.json();
}

export async function unlockSession(
  sessionId: string,
): Promise<UnlockResponse> {
  const res = await fetchAPI("/api/download/unlock", {
    method: "POST",
    body: JSON.stringify({ sessionId }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || `Unlock failed (${res.status})`);
  }

  const jsonRes = await res.json();

  return jsonRes.data;
}

export function getStreamUrl(streamToken: string, download = false): string {
  const base = `${API_BASE}/api/download/stream/${streamToken}`;
  return download ? `${base}?download=1` : base;
}

export async function downloadFormat(
  url: string,
  formatId: string,
  isAudioAvailable = false,
): Promise<Blob> {
  const res = await fetchAPI("/api/download/format", {
    method: "POST",
    body: JSON.stringify({ url, formatId, isAudioAvailable }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || `Format download failed (${res.status})`);
  }

  return res.blob();
}
