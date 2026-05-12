import { AwsClient } from "aws4fetch";

const DEFAULT_BUCKET = process.env.R2_BUCKET_NAME?.trim() || "seedance2-media";

function getR2Env() {
  const accountId = process.env.R2_ACCOUNT_ID?.trim();
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim();

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error("R2 signing credentials are not configured.");
  }

  return {
    accountId,
    accessKeyId,
    secretAccessKey,
    bucket: DEFAULT_BUCKET,
  };
}

export async function createR2SignedUploadUrl(input: {
  objectKey: string;
  contentType: string;
  expiresInSeconds?: number;
}) {
  const env = getR2Env();
  const client = new AwsClient({
    accessKeyId: env.accessKeyId,
    secretAccessKey: env.secretAccessKey,
    service: "s3",
    region: "auto",
  });

  const unsignedUrl = `https://${env.accountId}.r2.cloudflarestorage.com/${env.bucket}/${input.objectKey}`;
  const request = new Request(unsignedUrl, {
    method: "PUT",
    headers: {
      "content-type": input.contentType,
    },
  });

  const signed = await client.sign(request, {
    aws: {
      signQuery: true,
      allHeaders: true,
    },
  });

  return signed.url;
}
