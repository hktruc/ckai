export function sha256File(path: string): string;
export function parseFrontmatter(markdown: string): Record<string, unknown>;
export function contentApprovalFingerprint(markdown: string): string;
export function bridgePaths(repoRoot: string): Record<string, string>;
export function assembleExistingReviewPackage(job: {contentId: string; source: {artifactPath: string}}, paths: Record<string, string>):
  | {packageDir: string; videoPath: string; captionPath: string; headlinePath: string; coverPath: string}
  | {blocked: true; code: string; message: string}
  | null;
export function validateApprovedSource(job: unknown, repoRoot: string):
  | {ok: true; sourcePath: string; sourceSha256: string; fields: Record<string, unknown>}
  | {ok: false; code: string; message: string};
