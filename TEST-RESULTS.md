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

## Pending physical LG C9 test

Owner must validate loading over Wi-Fi, automatic rotation, timing, pause/resume, remote operation, full-screen display, sharpness and browser diagnostics. Source image dimensions do not establish TV browser rendering resolution. No OLED safeguard, scheduling, companion interface, personal upload or AI morphing behavior is included or validated.

See README.md for the physical TV checklist and deployment/artwork-update instructions.
