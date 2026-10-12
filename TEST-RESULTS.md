# Prototype 01 — verification record

Date: October 11, 2026 (America/New_York).

## Passed

- `node tests/runtime.test.cjs`: 11 deterministic logic checks passed. Covers image fitting, previous/next wrapping, timed rotation, interval changes, pause/resume, saved interval and denied storage, hidden control recovery, viewport changes, unavailable fullscreen fallback, failed images, timeouts, diagnostics and local asset existence.
- Pillow inspected each sample: 3840 × 2160 pixels. Moonlit Ridge: 195,760 bytes; Tidal Ribbons: 301,270 bytes; Quiet Horizon: 212,420 bytes. Total: 195,760 + 301,270 + 212,420 = 709,450 bytes.
- Repository access confirmed for jme1233/lg-living-art-gallery, branch main. The owner created the repository; GitHub tools are being used to upload the prototype.

## Pending

- Pages enablement: Settings → Pages → Deploy from a branch → main → /(root) → Save. The connected GitHub tools expose no Pages configuration operation.
- Deployment and live URL: use the URL returned by GitHub after deployment succeeds; an expected address is not verification.
- Desktop browser visual and interaction testing: pending deployment. The cloud browser disallowed local file preview; no workaround was attempted.
- Physical LG C9 validation: pending the owner's test. Source image dimensions do not establish TV browser rendering resolution or sharpness.

The logic checks use a simulated DOM and clock. They are not desktop browser tests, webOS emulation, television validation or OLED protection validation. README.md contains separate desktop and physical TV checklists.
