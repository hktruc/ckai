import type {ReviewIssue, ReturnTarget} from './model';

export type ReviewIssueCategory = 'claim-script' | 'segmentation' | 'visual-concept' | 'animation-mechanics' | 'voice-pronunciation-timing' | 'caption-mix-finishing';

export const routeIssue = (category: ReviewIssueCategory): ReturnTarget => ({
  'claim-script': 'script',
  segmentation: 'storyboard',
  'visual-concept': 'visual-director',
  'animation-mechanics': 'animation',
  'voice-pronunciation-timing': 'voice',
  'caption-mix-finishing': 'finishing',
} satisfies Record<ReviewIssueCategory, ReturnTarget>)[category];

export const validateIssues = (issues: ReviewIssue[]): string[] => {
  const errors: string[] = [];
  if (new Set(issues.map((issue) => issue.id)).size !== issues.length) errors.push('Review issue IDs must be unique');
  for (const issue of issues) {
    if (!issue.reason.trim() || !issue.requiredCorrection.trim()) errors.push(`${issue.id} needs reason and required correction`);
    if (issue.status === 'accepted-minor' && issue.severity !== 'minor') errors.push(`${issue.id} only minor issues may be accepted`);
  }
  return errors;
};
