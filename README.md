# LG OLED Living Art Gallery — prototype 01

**Live gallery:** https://jme1233.github.io/lg-living-art-gallery/

Deployed to GitHub Pages and checked in desktop Chrome on October 11, 2026. Physical LG C9 validation is pending. The desktop browser rejected the page full-screen request; its fallback message passed. Use the TV browser's own full-screen control. See TEST-RESULTS.md for tested behavior and limits.

Static browser gallery for Jaymie's LG OLED65C9PUA (manufactured February 2020; Wi-Fi). The native Gallery app, browser website loading, and browser full-screen were verified by the owner before this milestone. **This prototype has not been validated on the TV.**

## Start here

Open `index.html` on a computer for a local preview, or serve the directory:

```sh
python3 -m http.server 8000
```

Visit http://localhost:8000. The hosting root contains `index.html`, `gallery.css`, `gallery.js`, `artwork.js`, `.nojekyll`, and `artwork/`. There is no installation, compilation, framework, backend, paid API, or hardware dependency for the gallery.

## Deployment with GitHub Pages

GitHub Free supports Pages from public repositories. Use a public repository containing only this prototype and public artwork. Repository contents and the gallery will be publicly accessible.

1. Sign in to your existing GitHub account and create a public repository named `lg-living-art-gallery`. Do not initialize it if you will use the Git commands below.
2. From this project's directory, commit and push:

```sh
git init -b main
git add .
git commit -m "Add C9 Living Art Gallery prototype"
git remote add origin https://github.com/YOUR_USERNAME/lg-living-art-gallery.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your account login. GitHub may require your normal Git authentication. Do not put tokens in project files or share them in chat.

Alternatively, create the repository with a README and use GitHub's **Add file → Upload files** to upload the project contents, preserving the `artwork/` directory. Do not upload only the ZIP or add an extra enclosing folder.

3. In the repository, open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, select **main** and **/(root)**, then **Save**.
4. Wait for GitHub's Pages deployment to succeed. GitHub documents that publishing can take up to 10 minutes. Use the exact live URL displayed in Settings → Pages; do not treat an expected URL as proof of deployment.
5. Open the live site on a desktop. Test the checklist below before opening it on the TV. No custom domain or Wix change is needed.

If GitHub CLI is already installed and authenticated, the equivalent fresh-repository route is:

```sh
git init -b main
git add .
git commit -m "Add C9 Living Art Gallery prototype"
gh repo create lg-living-art-gallery --public --source=. --remote=origin --push
gh api --method POST repos/{owner}/lg-living-art-gallery/pages -f 'source[branch]=main' -f 'source[path]=/'
```

Use only one repository-creation route. These instructions are provided for reproducibility; they are not a record that deployment has occurred.

Sources: [GitHub: creating a Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site), [publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site), [Pages quickstart](https://docs.github.com/en/pages/quickstart), [Pages REST API](https://docs.github.com/en/rest/pages/pages#create-a-github-pages-site).

## Controls

- Artwork starts rotating automatically, initially every 30 seconds. Options: 10 seconds, 30 seconds, 1, 5, 10, or 15 minutes. The interval persists if localStorage is available; unavailable storage does not block the gallery.
- Previous / Next change art; Pause / Resume stop or restart rotation. Each successfully loaded image receives a full interval.
- Controls hide after 12 seconds. Clicking the image or pressing Enter / OK reveals them. Left / right change art and Space toggles pause when a form control is not focused. Native select and button keyboard behavior is preserved.
- Full screen attempts a feature-detected standard or prefixed browser method. If unavailable or rejected, use the TV browser's own full-screen menu. Full-screen availability on this prototype remains untested on the TV.
- TV diagnostics exposes the user-agent, CSS viewport size, and loaded image dimensions. It stays open until toggled off.
- Images retain their complete aspect ratio with black margins where needed. Layout uses measured pixel sizes rather than `object-fit`. Failed loads skip to another image; all-image failure exposes an error and pauses instead of spinning forever. A 20-second image timeout prevents indefinite loading.

## Update artwork

1. Add JPEGs to `artwork/`. Prefer baseline sRGB JPEG, with a long edge up to 3840 pixels to start. Smaller files may improve Wi-Fi loading; adjust after the physical TV test. Image dimensions do not guarantee browser output resolution.
2. Edit `artwork.js`:

```js
var GALLERY_ARTWORK = [
  {src: 'artwork/your-image.jpg', title: 'Your title', artist: 'Artist / attribution'},
  {src: 'artwork/another-image.jpg', title: 'Another title', artist: 'Artist / attribution'}
];
```

Use relative paths with matching capitalization, separate entries with commas, and escape apostrophes inside strings. Keep filenames simple. The page uses `textContent` for titles and artist names. Publish only artwork you have permission to distribute publicly.

3. Commit and push the changed files to `main` (or edit / upload through GitHub). Pages republishes from the same source. Reload the TV page; for stubborn image caching use a new image filename and update its entry.

```sh
git add artwork/ artwork.js
git commit -m "Update gallery artwork"
git push
```

The three included samples are original geometric compatibility studies, **not museum paintings or AI-generated artwork**. Each JPEG is 3840 × 2160 pixels. They are local files; the gallery does not call external image hosts. `tools/make_samples.py` can regenerate them using Python, Pillow and numpy; it is not needed to run or deploy the site. See `ARTWORK-LICENSE.md`.

## Compatibility strategy and limits

The runtime uses ES5-style JavaScript, script tags, baseline JPEG, `Image`, timer callbacks, `textContent`, absolute positioning, measured aspect-ratio fitting, and key codes. No modules, promises required for operation, fetch, service workers, canvas, WebGL, CSS grid, flex gaps, or `inset` shorthand. Storage and full-screen APIs are optional and guarded.

LG lists Chromium 53 for webOS TV 4.x (2018–2019). This motivates a conservative target; the TV's actual current firmware/browser engine is **not confirmed**. The model and manufacturing date alone do not validate individual APIs. The diagnostics and physical test must establish the actual result.

Source: [LG Web API and Web Engine](https://webostv.developer.lge.com/develop/specifications/web-api-and-web-engine).

The 4K samples are source image dimensions. Neither a modern desktop test nor user-agent emulation proves the C9 browser's capabilities or display resolution. OLED-specific protections, automatic shutdown, screen wake, scheduling, upload privacy and unattended operation are deferred. Rotation and hidden controls are not validated burn-in safeguards. This milestone is for supervised compatibility testing.

## Milestone acceptance test

Desktop browser:

1. Load the deployed URL; check all three samples with Previous / Next.
2. Select 10 seconds and observe at least three automatic transitions and wrapping to the first image.
3. Pause for longer than 10 seconds; confirm it stays on the same image. Resume.
4. Change to 30 seconds; confirm timing changes. Reload and confirm the selected interval persists if storage is allowed.
5. Hide controls; reveal by clicking the image or Enter. Check resize / aspect ratio and full-screen.
6. Open diagnostics; check source image dimensions and browser string. Inspect desktop console for page errors.

Physical LG C9 (owner only):

1. Open the verified live Pages URL in the TV web browser. Enable the browser's own full-screen display.
2. Confirm the first artwork appears, with no cropped edges, distortion, or error text. Note whether the image looks sharp enough at normal viewing distance.
3. Select 10 seconds; watch three transitions and wrapping. Test Previous / Next and Pause / Resume.
4. Select 30 seconds; observe the timing. Hide / reveal controls with the remote. Report whether OK / arrows operate as intended; remote events may differ from desktop events.
5. Open TV diagnostics and send the displayed browser string, CSS viewport, loaded image dimensions, and any failure description. Report TV firmware separately if available.
6. Close the gallery after this supervised test. Return pass/fail for loading, rotation, interval, pause, full-screen, control recovery and sharpness. Only then mark the TV milestone verified.

## Developer checks and next milestones

`node tests/runtime.test.cjs` checks the gallery logic in a small simulated DOM with a deterministic clock. It is not a browser or TV test. See `TEST-RESULTS.md` for observed checks and pending validation.

Next, after the C9 test passes: iPhone companion interface, personal uploads and privacy design, museum curation, scheduling, OLED safeguards, and AI morphing. Add and test one milestone at a time.
