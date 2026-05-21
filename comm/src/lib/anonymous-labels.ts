import type { CommentRow } from "@/lib/comments";

/**
 * Assign stable anonymous labels per author within a single thread.
 *
 * - Anonymous comments by the post's author get `작성자`.
 * - Other anonymous authors get `익명1`, `익명2`, ... in order of first
 *   appearance (createdAt ascending).
 * - Non-anonymous comments are not included in the map; UI falls back to
 *   their real displayName.
 *
 * Same authorId in the same thread always yields the same label, regardless
 * of how many comments they made.
 */
export function computeAnonymousLabels(
  comments: CommentRow[],
  postAuthorId: string,
): Map<string, string> {
  const labels = new Map<string, string>();
  const sorted = [...comments].sort(
    (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
  );
  let counter = 0;
  for (const c of sorted) {
    if (!c.anonymous) continue;
    if (labels.has(c.author.id)) continue;
    if (c.author.id === postAuthorId) {
      labels.set(c.author.id, "작성자");
    } else {
      counter += 1;
      labels.set(c.author.id, `익명${counter}`);
    }
  }
  return labels;
}
