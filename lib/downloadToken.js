import crypto from "crypto";

const TOKEN_TTL_MS = 15 * 60 * 1000; // 15 minutes

function secret() {
  const s = process.env.NEXTAUTH_SECRET;
  if (!s) throw new Error("NEXTAUTH_SECRET is not configured.");
  return s;
}

function sign(payload) {
  return crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createDownloadToken(purchaseId) {
  const exp = Date.now() + TOKEN_TTL_MS;
  const payload = `${purchaseId}.${exp}`;
  const signature = sign(payload);
  return Buffer.from(`${payload}.${signature}`).toString("base64url");
}

export function verifyDownloadToken(token) {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const [purchaseId, expStr, signature] = decoded.split(".");
    if (!purchaseId || !expStr || !signature) return null;

    const expectedSignature = sign(`${purchaseId}.${expStr}`);
    const sigBuf = Buffer.from(signature);
    const expectedBuf = Buffer.from(expectedSignature);
    if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) return null;

    const exp = Number(expStr);
    if (!Number.isFinite(exp) || Date.now() > exp) return null;

    return { purchaseId };
  } catch {
    return null;
  }
}
