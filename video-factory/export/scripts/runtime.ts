import {hydrateReviewPreview, loadTest0002ReviewInput} from '../../review/scripts/runtime';
import {createTest0002ExportManifest} from '../src/manifest/test0002';

export const loadTest0002ExportInput = () => {
  const reviewInput = hydrateReviewPreview(loadTest0002ReviewInput());
  return {exportManifest: createTest0002ExportManifest(reviewInput.review), reviewInput};
};
