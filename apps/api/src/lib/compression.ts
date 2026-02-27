import { gzip, gunzip } from "node:zlib"
import { promisify } from "node:util"

const gzipAsync = promisify(gzip)
const gunzipAsync = promisify(gunzip)

export async function compressGzip(text: string): Promise<Buffer> {
  return gzipAsync(text, { level: 9 })
}

export async function decompressGzip(buffer: Buffer | ArrayBuffer): Promise<string> {
  const buf = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer)
  const result = await gunzipAsync(buf)
  return result.toString("utf-8")
}
