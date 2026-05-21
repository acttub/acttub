import { customAlphabet } from "nanoid";

const alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const shortId = customAlphabet(alphabet, 10);
const shareToken = customAlphabet(alphabet, 16);

export function newPlaylistSlug() {
  return shortId();
}

export function newShareToken() {
  return shareToken();
}

export function slugifyTagName(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
