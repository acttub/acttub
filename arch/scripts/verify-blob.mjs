import { put, del } from "@vercel/blob";

const token = process.env.BLOB_READ_WRITE_TOKEN;
if (!token) {
  console.error("BLOB_READ_WRITE_TOKEN is not set");
  process.exit(1);
}

const payload = `acttub blob check — ${new Date().toISOString()}`;
const blob = await put("setup-check/hello.txt", payload, {
  access: "public",
  addRandomSuffix: true,
  token,
});
console.log("uploaded:", blob.url);
console.log("pathname:", blob.pathname);

const res = await fetch(blob.url);
const got = await res.text();
const ok = res.ok && got === payload;
console.log("fetched ok:", ok ? "✓" : "✗", `(status ${res.status})`);

await del(blob.url, { token });
console.log("cleaned up ✓");
