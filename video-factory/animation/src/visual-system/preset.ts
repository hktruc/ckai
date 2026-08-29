export type VisualPresetId = 'CKAI_DARK_PREMIUM_EDITORIAL_V1';

export type VisualPreset = {
  id: VisualPresetId;
  version: 1;
  format: {width: 1080; height: 1920; mobileFirst: true};
  identity: readonly string[];
  color: {canvas: string; canvasLift: string; surface: string; surfaceRaised: string; ink: string; inkMuted: string; amber: string; warmGold: string; burntOrange: string; line: string; glass: string};
  typography: {
    displayFamily: string; textFamily: string; monoFamily: string;
    hero: {min: number; max: number; lineHeight: number; weight: number};
    title: {min: number; max: number; lineHeight: number; weight: number};
    supporting: {min: number; max: number; lineHeight: number; weight: number};
    caption: {size: number; lineHeight: number; weight: number; maxLines: 2};
    hierarchyScaleMinimum: number;
  };
  spacing: {safeTop: number; safeRight: number; safeBottom: number; safeLeft: number; unit: number};
  density: {occupiedGuidance: string; maximumPrimaryFoci: 1; maximumStrongAttractors: 2};
  depth: {vignette: string; ambientLight: string; raisedShadow: string; blur: number};
  lighting: {maximumLitAreaRatio: number; lineWidth: number; glowOpacity: number};
  material: {surface: 'matte-graphite'; raised: 'smoked-glass'; accent: 'restrained-warm-metal'};
  geometry: {radiusSmall: number; radiusMedium: number; radiusLarge: number; lineWidth: number};
  imageTreatment: {background: 'restrained-dark'; separation: 'depth-light'; clutter: 'low'};
  lineTreatment: {style: 'thin-precise-sparse'; hudAllowed: false};
};

export const CKAI_DARK_PREMIUM_EDITORIAL_V1: VisualPreset = Object.freeze<VisualPreset>({
  id: 'CKAI_DARK_PREMIUM_EDITORIAL_V1', version: 1,
  format: {width: 1080, height: 1920, mobileFirst: true},
  identity: ['premium', 'intellectual', 'cinematic', 'minimal', 'confident'],
  color: {
    canvas: '#07090D', canvasLift: '#0C1119', surface: '#111720', surfaceRaised: '#171E28', ink: '#F4F0E8', inkMuted: '#A9AFB8',
    amber: '#D99A43', warmGold: '#C9A66B', burntOrange: '#B85F2D', line: '#343B46', glass: 'rgba(23,30,40,0.72)',
  },
  typography: {
    displayFamily: '"Aptos Display", "Segoe UI Variable Display", "Segoe UI", Arial, sans-serif',
    textFamily: '"Aptos", "Segoe UI Variable Text", "Segoe UI", Arial, sans-serif',
    monoFamily: '"Cascadia Mono", Consolas, monospace',
    hero: {min: 92, max: 132, lineHeight: 0.94, weight: 800}, title: {min: 66, max: 92, lineHeight: 1.02, weight: 760},
    supporting: {min: 28, max: 42, lineHeight: 1.32, weight: 560}, caption: {size: 42, lineHeight: 1.24, weight: 700, maxLines: 2}, hierarchyScaleMinimum: 1.55,
  },
  spacing: {safeTop: 132, safeRight: 84, safeBottom: 176, safeLeft: 84, unit: 8},
  density: {occupiedGuidance: 'Use enough visual mass to create tension and completion; never enforce a numeric occupancy target', maximumPrimaryFoci: 1, maximumStrongAttractors: 2},
  depth: {vignette: 'radial-gradient(circle at 50% 42%, rgba(31,38,49,.42) 0%, rgba(7,9,13,0) 48%, rgba(2,3,5,.72) 100%)', ambientLight: 'radial-gradient(circle at 72% 18%, rgba(217,154,67,.12), transparent 34%)', raisedShadow: '0 28px 90px rgba(0,0,0,.46)', blur: 18},
  lighting: {maximumLitAreaRatio: 0.18, lineWidth: 2, glowOpacity: 0.22},
  material: {surface: 'matte-graphite', raised: 'smoked-glass', accent: 'restrained-warm-metal'},
  geometry: {radiusSmall: 12, radiusMedium: 22, radiusLarge: 34, lineWidth: 1},
  imageTreatment: {background: 'restrained-dark', separation: 'depth-light', clutter: 'low'}, lineTreatment: {style: 'thin-precise-sparse', hudAllowed: false},
});

const PRESETS: Readonly<Record<VisualPresetId, VisualPreset>> = Object.freeze({CKAI_DARK_PREMIUM_EDITORIAL_V1});

export const getVisualPreset = (id: VisualPresetId): VisualPreset => {
  const preset = PRESETS[id];
  if (!preset) throw new Error(`Unknown visual preset: ${id}`);
  return preset;
};

export const DEFAULT_VISUAL_PRESET_ID: VisualPresetId = 'CKAI_DARK_PREMIUM_EDITORIAL_V1';
