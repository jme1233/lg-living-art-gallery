# Artwork import attempts and manual follow-up

Updated October 12, 2026. This log distinguishes a human check from a missing API image and an ordinary HTTP failure. An unavailable download is not evidence that an artwork is copyrighted or that the website blocks the owner's browser.

## Human-verification queue

**Art Institute of Chicago:** The earlier attempt reported an image-download human-verification challenge in this environment. Metadata was saved successfully. The exact challenged image URL and challenge text were not retained; the individual candidates below have not been re-tested during this update. Do not label every candidate as individually blocked.

| Candidate recorded in the metadata | Museum page | Suggested filename | Category |
| --- | --- | --- | --- |
| Van Gogh — The Bedroom | https://www.artic.edu/artworks/28560 | van-gogh-bedroom.jpg | classical |
| Seurat — A Sunday on La Grande Jatte — 1884 | https://www.artic.edu/artworks/27992 | seurat-grande-jatte.jpg | classical |
| Hokusai — The Great Wave | https://www.artic.edu/artworks/24645 | hokusai-great-wave-aic.jpg | classical |
| Monet — Cliff Walk at Pourville | https://www.artic.edu/artworks/14620 | monet-cliff-walk.jpg | classical |
| Monet — Water Lily Pond | https://www.artic.edu/artworks/97933 | monet-water-lily-pond.jpg | classical |
| Cezanne — The Bay of Marseille, Seen from L'Estaque | https://www.artic.edu/artworks/16487 | cezanne-marseille.jpg | classical |

These are saved source candidates, not a claim that the owner requested every individual title. The saved AIC metadata marks these images public domain. Recheck the live artwork page's download/usage information when obtaining a new file. A Met edition of The Great Wave is already included; the AIC edition is optional.

## Missing images / API availability

The Met object API returned `isPublicDomain=false` and an empty `primaryImage` for the following attempts. No CAPTCHA was observed. This records the API response only; it does not establish the copyright status of the underlying painting.

| Artwork | Object/page | Outcome / action |
| --- | --- | --- |
| Monet — Water Lilies | https://www.metmuseum.org/art/collection/search/437137 | No usable API image. NGA's The Japanese Footbridge was obtained as a water-lily alternative. |
| Monet — Bridge over a Pond of Water Lilies | https://www.metmuseum.org/art/collection/search/437127 | No usable API image. Check the museum page manually and its specific image permissions. |
| Kandinsky — Improvisation 27 (Garden of Love II) | https://www.metmuseum.org/art/collection/search/488319 | Import stopped at the missing Open Access image check. Manual image availability/permission remains unconfirmed. |
| Kandinsky — Kleine Welten VII (Small Worlds VII) | https://www.metmuseum.org/art/collection/search/360148 | Metadata checked; no usable API image. Manual availability/permission remains unconfirmed. |

## Download errors with successful alternatives

- Wikimedia Commons HTML pages for the Hoh mist forest and Enchanted Valley trail photographs returned HTTP 403 to the local downloader. No human-verification or CAPTCHA text was observed, so the reason is unconfirmed. The direct image downloads succeeded, and the official Olympic National Park Flickr pages mark both public domain. No owner action is needed.
- The Smithsonian Institution general object URL `https://www.si.edu/object/saam_1977.107.1` returned 404 to web retrieval. The Smithsonian American Art Museum artwork page and image download succeeded. No owner action is needed.

## Manual route into this gallery

1. Open the artwork's official museum page in your own browser. If it requests a human check, complete it there. Use the museum's image-download control and check the image's public-domain / Open Access marking. For any image with unclear distribution permission, send its page link first.
2. Download the highest-resolution JPEG offered. Keep the original file; do not stretch it, crop it to 16:9, or use a screenshot of the painting.
3. The easiest handoff is to attach the downloaded JPEG here with its source-page link and title. I can prepare a baseline sRGB JPEG, add its attribution and category, upload it to the repository, and test the published version. A download in your browser does not authenticate this environment, so the actual image file is the useful handoff.
4. To upload yourself instead, open https://github.com/jme1233/lg-living-art-gallery/tree/main/artwork and choose **Add file → Upload files**. Use the suggested simple filename and commit it to `main`.
5. A file upload alone does not put it in rotation. Add an entry in `artwork.js` before the final `];`, separated from the previous entry by a comma:

```js
{category: 'classical', src: 'artwork/monet-water-lily-pond.jpg',
 title: 'Water Lily Pond', artist: 'Claude Monet · 1917–19 · Art Institute of Chicago'}
```

6. Add the source/permission record to `artwork-sources.json`. Category values are `classical`, `nature`, `dark`, and `abstract`. Commit the changes; GitHub Pages republishes automatically. Reload the gallery and select the matching collection. If caching persists, use a new filename or increase the version query on `artwork.js` in `index.html`.

Prefer sending the file here so preparation, metadata, upload and testing can be handled together. Keep future failures in this log with the actual URL, artwork, observed response, blocker type, alternative outcome, and any required owner action. Do not bypass access challenges automatically.
