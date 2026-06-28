# Images — drop-in guide

The site currently uses letter monograms (e.g. "JB", "SC") and a branded
gradient as placeholders. The CSS is already wired so real photos "just work"
once you drop them in. Nothing else needs to change structurally.

## Folders

- `host/`     — Joachim's portrait (about page + homepage host strip)
- `guests/`   — one headshot per guest
- `episodes/` — per-episode cover art (square or 16:9)
- `cover/`    — show artwork / social images (optional)

## Recommended sizes & format

- Headshots: square, 600×600 px, `.jpg` or `.webp` (faces look best square)
- Episode art: 1280×720 (16:9) or 1000×1000 (square), `.jpg` / `.webp`
- Keep each file under ~200 KB — compress before adding.

## How to add a photo

### Avatars (host / guest / episode-hero / sidebar)
Inside the avatar element, add an `<img class="avatar-img">` next to the
monogram `<span>`. The image fills the circle automatically; the span is the
fallback if the image is missing.

```html
<!-- before -->
<div class="guest-avatar-lg"><span>SC</span></div>

<!-- after -->
<div class="guest-avatar-lg">
  <img class="avatar-img" src="assets/img/guests/sarah-chen.jpg" alt="Sarah Chen">
</div>
```

This pattern works for: `.host-avatar`, `.about-portrait`, `.guest-avatar`,
`.guest-avatar-lg`, `.guest-box-avatar`, `.ep-hero-guest-avatar`,
`.latest-card-thumb`.

### Episode cover art (episode cards)
Add a cover element as the **first child** of an `.episode-card`:

```html
<a href="episode.html" class="episode-card" data-topic="investing">
  <div class="episode-card-cover">
    <img class="avatar-img" src="assets/img/episodes/ep25.jpg" alt="">
  </div>
  <span class="episode-card-num">EP 25</span>
  ...
</a>
```

If you add `.episode-card-cover` with no `<img>`, it shows a subtle branded
gradient — still better than a bare card, and a clean spot to drop art later.

## File naming (suggested)

- Guests: `firstname-lastname.jpg` (e.g. `sarah-chen.jpg`)
- Episodes: `ep25.jpg`, `ep24.jpg`, …
- Host: `joachim.jpg`
