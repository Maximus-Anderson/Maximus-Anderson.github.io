# Writing a post

Each file in this folder is one project post. Edit it here, save, commit, push.
GitHub rebuilds `index.html` from these files on every push. To preview
locally first, run `python build.py` in the repo root, then serve the folder
with `python -m http.server`.

The top of each file (between the `---` lines) holds the post's settings.
Everything below the second `---` is the post itself.

## Settings

```
---
title: CR30 Battery Pack: Design and Manufacture
ledger-title: CR30 Battery Pack: Design and Manufacture   (optional, shorter title for the landing list)
date: April 2026
read: 7                    (minutes; shows as "~7 min read")
order: 2                   (1 is the top of the landing list)
tags:
  - Design
  - Manufacture
hero: images/TB-001-CR30_Render_1.png
hero-alt: CR30 Battery Pack                (optional, defaults to the title)
hero-scale: 1.15                           (optional, zooms a render with empty edges)
hero-caption: The CR30 pack. Second iteration, first one to drive.
thumb: images/CR30-Render-Banner.jpg       (optional, landing-list thumbnail if not the hero)
lead: One sentence under the hero photo that says what the post is.
specs-title: Specifications                (optional, defaults to "Specifications")
specs:
  - Configuration: 28s per module, 5 modules in series
  - Pack voltage: 600V nominal
timeline:
  - September 2025 | Milestone 1: Design Phase
    Two or three sentences shown when the marker is clicked.
  - November 2025 | Milestone 2: Manufacturing Begins
    Text for the second marker.
draft: true                                (optional, hides the post from the site)
---
```

Leave out any optional line you don't need. `specs` and `timeline` can be
omitted entirely.

## Body

```
## Section Heading

A paragraph. Blank line between paragraphs. **Bold** works.
Link to another post with [[pack]] or [[pack|custom link text]]
(use the other file's name without .md).

### Sub-heading

Smaller red heading inside a section.

![Alt text for the photo](images/photo.jpg)
> Caption under the photo.

![Left photo](images/a.jpg)
![Right photo](images/b.jpg)
> Two photos on adjacent lines sit side by side. Caption applies to the pair.

![](images/clip.mp4)
> A video. Plays silently when scrolled into view.

- Bulleted list
- **Bold lead-in:** works in lists too

1. Numbered list
2. Second item
```

Every section starts with a `## ` heading. Add ` {tall}` after a heading
(`## The Blown Inverter {tall}`) to make that section's photos square instead
of 4:3, for photos where the bottom matters.

A `---` line after the last section starts a closing area for a photo that
sits outside any section, like the team photo at the end of the pack post.

## Fine-tuning a photo (rare)

A quoted hint after the image path passes CSS through untouched:

```
![Alt](images/x.jpg "img:width: 90%; display: block; margin: 0 auto;")
![Alt](images/x.jpg "wrap:max-width: 700px; margin: 0 auto;|img:width: 100%;")
```

`img:` styles the photo, `wrap:` puts a styled box around it. For a side-by-side
pair, a `container:` hint on the first photo styles the row. You should rarely
need these; the existing posts show every case that exists.
