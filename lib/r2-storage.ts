import { createHash, createHmac } from "node:crypto";

const REGION = "auto";
const SERVICE = "s3";
function config() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET_NAME;
  if (!accountId || !accessKeyId || !secretAccessKey || !bucket) throw new Error("R2 storage is not configured");
  return { accountId, accessKeyId, secretAccessKey, bucket, host: `${accountId}.r2.cloudflarestorage.com` };
}
function sha256(value: string | Buffer) { return createHash("sha256").update(value).digest("hex"); }
function hmac(key: Buffer | string, value: string) { return createHmac("sha256", key).update(value).digest(); }
function signingKey(secret: string, date: string) {
  return hmac(hmac(hmac(hmac(`AWS4${secret}`, date), REGION), SERVICE), "aws4_request");
}
function amzDate(now = new Date()) { return now.toISOString().replace(/[:-]|\.\d{3}/g, ""); }
function encodePath(value: string) {
  return value.split("/").map((part) => encodeURIComponent(part).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`)).join("/");
}
function encodeQuery(value: string) {
  return encodeURIComponent(value).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
}
function scope(date: string) { return `${date}/${REGION}/${SERVICE}/aws4_request`; }

export function createR2UploadUrl(key: string, contentType: string, expiresSeconds = 300) {
  const cfg = config();
  const date = amzDate();
  const day = date.slice(0, 8);
  const credentialScope = scope(day);
  const uri = `/${encodePath(cfg.bucket)}/${encodePath(key)}`;
  const params: Record<string, string> = {
    "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
    "X-Amz-Credential": `${cfg.accessKeyId}/${credentialScope}`,
    "X-Amz-Date": date,
    "X-Amz-Expires": String(expiresSeconds),
    "X-Amz-SignedHeaders": "content-type;host",
  };
  const canonicalQuery = Object.entries(params).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => `${encodeQuery(k)}=${encodeQuery(v)}`).join("&");
  const canonicalHeaders = `content-type:${contentType.trim()}\nhost:${cfg.host}\n`;
  const canonicalRequest = ["PUT", uri, canonicalQuery, canonicalHeaders, "content-type;host", "UNSIGNED-PAYLOAD"].join("\n");
  const stringToSign = ["AWS4-HMAC-SHA256", date, credentialScope, sha256(canonicalRequest)].join("\n");
  const signature = createHmac("sha256", signingKey(cfg.secretAccessKey, day)).update(stringToSign).digest("hex");
  return `https://${cfg.host}${uri}?${canonicalQuery}&X-Amz-Signature=${signature}`;
}
export async function r2Request(method: "GET" | "HEAD" | "DELETE", key: string) {
  const cfg = config();
  const date = amzDate();
  const day = date.slice(0, 8);
  const payloadHash = sha256("");
  const uri = `/${encodePath(cfg.bucket)}/${encodePath(key)}`;
  const canonicalHeaders = `host:${cfg.host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${date}\n`;
  const signedHeaders = "host;x-amz-content-sha256;x-amz-date";
  const canonicalRequest = [method, uri, "", canonicalHeaders, signedHeaders, payloadHash].join("\n");
  const stringToSign = ["AWS4-HMAC-SHA256", date, scope(day), sha256(canonicalRequest)].join("\n");
  const signature = createHmac("sha256", signingKey(cfg.secretAccessKey, day)).update(stringToSign).digest("hex");
  const authorization = `AWS4-HMAC-SHA256 Credential=${cfg.accessKeyId}/${scope(day)}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
  return fetch(`https://${cfg.host}${uri}`, {
    method, headers: { Authorization: authorization, "x-amz-content-sha256": payloadHash, "x-amz-date": date }, cache: "no-store",
  });
}