# References

This folder contains long-lived reference records and approved reference assets with explicit provenance. It is not a general asset-management system and does not grant production authority by location alone.

## Visual references

Product Owner-supplied PPTX, PDF, slide screenshot, image or video references use these statuses:

- `REFERENCE_ONLY`: may influence hierarchy, lighting, material, composition feeling or Visual DNA discussion; cannot be copied or rendered as a production asset.
- `PRODUCTION_ASSET_APPROVED`: may be used only with direct Product Owner approval provenance, exact SHA-256, source/provenance and license/rights metadata.

Reference status never supplies Content Approval, delegated operator acceptance, evidence authority or Release Approval. A reference-only mockup cannot become actual proof. Use [`TEMPLATE.md`](TEMPLATE.md) and [`reference.ts`](../../video-factory/animation/src/visual-system/reference.ts).

## Audio references

The canonical CKAI Music Library is [`audio/music-library-v1/`](audio/music-library-v1/). Its registry and license evidence preserve selection/provenance history; a registry entry does not automatically make a track production-approved or start Phase 2 Audio Engine.
