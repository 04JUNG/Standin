/**
 * BFF(앱 서버) 호출 최소 헬퍼.
 *
 * 서버가 내려주는 `message`는 화면에 쓰지 않는다. 서버 문구는 언제든 바뀌고
 * 기술적일 수 있으며, 계정 존재 여부 같은 정보를 흘릴 수 있다. `code`만 보고
 * 이쪽 문구를 고른다(데스크톱 앱의 shared/api/errorMessages.ts와 같은 원칙).
 */

const RAW_BASE = import.meta.env.VITE_API_BASE_URL;

/** 서버가 연결돼 있는지. 없으면 폼은 제출 성공을 가장하지 않는다(CLAUDE.md §4). */
export const HAS_API = Boolean(RAW_BASE);

const BASE = RAW_BASE ? RAW_BASE.replace(/\/+$/, "") : "";

type ServerErrorBody = {
  error?: { code?: string; message?: string; requestId?: string };
};

/** 정규화된 API 오류. `field`가 있으면 해당 입력 아래에 붙인다. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly field?: "email" | "password",
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const MESSAGES: Record<string, { text: string; field?: "email" | "password" }> = {
  EMAIL_TAKEN: {
    text: "이미 가입된 이메일입니다. 데스크톱 앱에서 로그인해 주세요.",
    field: "email",
  },
  INVALID_INPUT: {
    text: "이메일 형식과 비밀번호(8자 이상)를 확인해 주세요.",
  },
  EMAIL_NOT_VERIFIED: {
    text: "이메일 인증이 아직 완료되지 않았습니다. 메일함을 확인해 주세요.",
  },
  RATE_LIMITED: {
    text: "요청이 많습니다. 잠시 후 다시 시도해 주세요.",
  },
};

const SERVER_ERROR = "서버에 문제가 있습니다. 잠시 후 다시 시도해 주세요.";
const NETWORK_ERROR = "서버에 연결할 수 없습니다. 네트워크를 확인해 주세요.";
const FALLBACK = "요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.";

export function postJson<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, body);
}

async function request<T>(path: string, body: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, "NETWORK", NETWORK_ERROR);
  }

  if (!res.ok) {
    let code = "UNKNOWN";
    let requestId: string | undefined;
    try {
      const data = (await res.json()) as ServerErrorBody;
      code = data.error?.code ?? code;
      requestId = data.error?.requestId;
    } catch {
      // JSON이 아니면 상태 코드만으로 판단한다.
    }
    // 요청 ID는 화면이 아니라 콘솔에만 남긴다(디버깅용).
    if (requestId) console.warn(`[api] ${res.status} ${code} (requestId=${requestId})`);

    const known = MESSAGES[code];
    if (known) throw new ApiError(res.status, code, known.text, known.field);
    throw new ApiError(res.status, code, res.status >= 500 ? SERVER_ERROR : FALLBACK);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
