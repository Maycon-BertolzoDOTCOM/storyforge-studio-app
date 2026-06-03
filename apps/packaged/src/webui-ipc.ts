import { requestJsonIpc } from "@open-design/sidecar";
import { SIDECAR_MESSAGES } from "@open-design/sidecar-proto";

import { isNotRunningIpcError } from "./webui-config.js";

// The IPC request shape probeWebuiStatus depends on. Injectable so the
// classify-vs-rethrow behavior can be unit-tested without a real socket.
export type WebuiIpcRequester = (
  socketPath: string,
  payload: unknown,
  opts: { timeoutMs: number },
) => Promise<unknown>;

// One desktop IPC STATUS probe. Returns the live instance's URLs, null when
// nothing is listening on the namespace (a missing/refused socket), and RETHROWS
// every other failure (timeout, permission, malformed/ok:false reply). The
// rethrow is the point: callers must distinguish "no worker" from "a wedged live
// worker". Swallowing the latter would let `start` race into a duplicate launch
// on the same namespace/ports, and let the readiness poll hide a real failure
// behind the generic startup timeout.
export async function probeWebuiStatus(
  ipcPath: string,
  request: WebuiIpcRequester = requestJsonIpc,
): Promise<{ url: string; daemonUrl: string | null } | null> {
  try {
    const reply = (await request(ipcPath, { type: SIDECAR_MESSAGES.STATUS }, { timeoutMs: 800 })) as {
      url?: string;
      daemonUrl?: string | null;
    };
    if (reply?.url != null && reply.url.length > 0) {
      return { url: reply.url, daemonUrl: reply.daemonUrl ?? null };
    }
    return null;
  } catch (error) {
    if (isNotRunningIpcError(error)) return null;
    throw error;
  }
}
