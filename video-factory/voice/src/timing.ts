export type FitResult = {slotDurationSeconds: number; fitDeltaSeconds: number; fitStatus: 'PASS' | 'REVISE'};

export const evaluateFit = (start: number, end: number, measuredDuration: number, requiredEnd = end): FitResult => {
  const usable = requiredEnd - start;
  const delta = Number((usable - measuredDuration).toFixed(3));
  return {slotDurationSeconds: usable, fitDeltaSeconds: delta, fitStatus: delta >= 0 ? 'PASS' : 'REVISE'};
};
