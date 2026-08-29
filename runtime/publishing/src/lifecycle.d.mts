export type FacebookPackageManifest = Record<string, any>;
export const FACEBOOK_REELS: 'Facebook Reels';
export function createFacebookReelsPackageManifest(input: Record<string, any>): FacebookPackageManifest;
export function approveRelease(manifest: FacebookPackageManifest, approval: Record<string, any>, options: {repoRoot: string; fixtureMode?: boolean}): FacebookPackageManifest;
export function recordPublication(manifest: FacebookPackageManifest, input: Record<string, any>, options: {repoRoot: string; fixtureMode?: boolean}): FacebookPackageManifest;
export function writeManifestAtomic(path: string, manifest: FacebookPackageManifest): void;
export function verifyPackageVideo(manifest: FacebookPackageManifest, repoRoot: string): boolean;
