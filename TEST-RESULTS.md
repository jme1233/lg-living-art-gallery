# Prototype 01 — verification record

Tested October 11, 2026 (America/New_York).
Live site: https://jme1233.github.io/lg-living-art-gallery/

## Deployment and desktop checks

GitHub Pages returned HTTP 200 with the gallery title. The deployed page was tested in the cloud desktop browser: Chrome 154 on Linux, viewport 1363 × 936 CSS pixels. This is not the LG C9 browser.

Passed:

- All three local JPEGs loaded and decoded at 3840 × 2160 pixels. The first sample fitted to 1363 × 767 CSS pixels, preserving aspect ratio with black margins; desktop screenshot inspected.
- Previous and Next navigated through the collection and wrapped in both directions.
- Pause held Quiet Horizon across an observation lasting over 30 seconds with the 10-second interval selected; Resume restarted rotation.
- Three isolated automatic transitions passed at the 10-second setting: Moonlit Ridge → Tidal Ribbons → Quiet Horizon → Moonlit Ridge. The test paused after each transition. The observed time from clicking Resume through detecting the change and clicking Pause was 10,785 ms, 10,793 ms, and 10,782 ms. These include automation overhead and are not exact image dwell measurements.
- Interval selection changed the status and timing. At the 30-second setting, Moonlit Ridge remained displayed at the 13,025 ms observation, and Tidal Ribbons was displayed by the 33,579 ms observation. This brackets a change rather than measuring the exact transition instant.
- A 60-second interval survived a page reload.
- Controls automatically hid after their configured 12-second delay (checked at approximately 13 seconds), and recovered by clicking the artwork. Explicit Hide controls and Enter recovery also passed.
- Diagnostics displayed the desktop user agent, viewport and JPEG dimensions.

Full-screen limitation:

The cloud desktop browser rejected the page's full-screen request. The fallback message, “Use the browser menu’s full-screen control,” appeared correctly. Full-screen entry through the JavaScript button has not passed a desktop test. On the LG C9, use the browser's own full-screen control already verified by the owner; the gallery's physical TV behavior remains pending.

Browser-test limitations:

Long selector waits and a continuous observation attempt timed out in the browser automation layer. Short isolated observations completed successfully. No change was made to application timers to accommodate automation. Browser logs inspected during testing included extension metadata errors; those are not evidence of gallery JavaScript errors. No uninterrupted long-duration or unattended test was completed. No actual desktop resize or legacy Chromium 53 test was completed.

## Deterministic logic checks

`node tests/runtime.test.cjs`: 11 checks passed. Covers fitting, navigation wrapping, timed rotation, interval changes, pause/resume, saved interval and denied storage, hidden control recovery, simulated viewport changes, unavailable fullscreen fallback, failed images, timeouts, diagnostics and local asset existence. This uses a simulated DOM and clock, not a browser or webOS emulator.

Artwork size inspection: each JPEG is 3840 × 2160. Moonlit Ridge: 195,760 bytes; Tidal Ribbons: 301,270 bytes; Quiet Horizon: 212,420 bytes. Total: 195,760 + 301,270 + 212,420 = 709,450 bytes.

## Owner report: original prototype on physical C9

The owner confirmed artwork display, full-screen and Hide controls, followed by automatic rotation and Pause/Resume. This is owner-reported testing. Detailed firmware, browser diagnostics and output resolution were not supplied.

## Collection 02 — October 12, 2026

13 deterministic logic checks passed, including category isolation for automatic and manual navigation, saved category restoration, stale category fallback, and paused category changes. These use a simulated DOM, not a TV browser. Source image dimensions and hashes are recorded in artwork-sources.json.

Desktop Chrome on Linux, 1363 × 936 CSS pixels:

- All 14 images loaded with the repaired `collections-02b` URLs and decoded at the documented dimensions.
- Manual Previous/Next and category-specific wraparound passed for all four categories. Changing categories while paused preserved the paused state.
- Dark gallery selection survived reload. At the 10-second setting, the dark collection automatically changed from Kalf to Heda and back to Kalf. Exact dwell times were not measured; one long selector wait timed out in browser automation, with the resulting transition confirmed in a later DOM observation.
- Hidden controls recovered by clicking the stage. The final Monet screenshot was visually inspected after repair and showed the complete decoded painting with its original proportions and black margins.
- GitHub blob hashes were checked against the full local JPEG bytes. Separate live HTTP downloads of all 14 versioned JPEGs matched the recorded SHA-256 hashes and fully decoded in Pillow. Header dimensions alone are insufficient validation; incomplete transfers detected during visual QA were replaced before acceptance.

The runtime does not change OLED brightness, control TV power or implement burn-in safeguards. Full-screen was already owner-confirmed on the original build; it was not re-tested in this desktop update.
Physical LG C9 validation of the new images and category selector: pending owner test.

