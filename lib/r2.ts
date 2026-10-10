import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const required = ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET_NAME"] as const;
function client() {
  const values = required.map((key) => process.env[key]);
  if (values.some((value) => !value)) throw new Error("Cloudflare R2 is not configured.");
  const [accountId, accessKeyId, secretAccessKey, bucket] = values as [string, string, string, string];
  return {
    bucket,
    s3: new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
    }),
  };
}
export async function putPrivateObject(key: string, body: Buffer, contentType: string) {
  const { s3, bucket } = client();
  await s3.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: contentType }));
}
export async function deletePrivateObject(key: string) {
  const { s3, bucket } = client();
  await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}
export async function signedPrivateObjectUrl(key: string) {
  const { s3, bucket } = client();
  return getSignedUrl(s3, new GetObjectCommand({ Bucket: bucket, Key: key }), { expiresIn: 60 });
}
