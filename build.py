"""Render posts/*.md into index.html.

Run from the repo root:  python build.py
Each posts/<slug>.md becomes the <div id="project-<slug>-page"> block and a
ledger row. Everything in index.html outside the marker comments is left alone.
The post format is documented in posts/README.md.
"""
import html
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
POSTS = ROOT / "posts"
INDEX = ROOT / "index.html"

LEDGER_START = "<!-- posts:ledger:start -->"
LEDGER_END = "<!-- posts:ledger:end -->"
PAGES_START = "<!-- posts:pages:start -->"
PAGES_END = "<!-- posts:pages:end -->"

IMG = '<img loading="lazy" decoding="async" src="{src}" alt="{alt}" class="background-image slide-up" style="animation-delay: 0.3s;{extra}">'


def esc(text):
    return html.escape(text, quote=True)


def esc_text(text):
    return html.escape(text, quote=False)


# ---------------------------------------------------------------- front matter

def parse_front_matter(text):
    m = re.match(r"---\n(.*?)\n---\n?", text, re.S)
    if not m:
        raise ValueError("missing front matter")
    meta = {}
    key = None
    for raw in m.group(1).splitlines():
        if not raw.strip():
            continue
        if raw.startswith("  - ") and key:
            meta.setdefault(key, [])
            if not isinstance(meta[key], list):
                meta[key] = []
            meta[key].append(raw[4:].strip())
            continue
        if raw.startswith("  ") and key and isinstance(meta.get(key), list) and meta[key]:
            meta[key][-1] += "\n" + raw.strip()
            continue
        k, _, v = raw.partition(":")
        key = k.strip()
        v = v.strip()
        meta[key] = v if v else []
    return meta, text[m.end():]


def parse_timeline(entries):
    out = []
    for e in entries:
        first, _, rest = e.partition("\n")
        date, _, title = first.partition(" | ")
        out.append((date.strip(), title.strip(), rest.strip()))
    return out


def parse_specs(entries):
    return [s.strip() for s in entries]


# --------------------------------------------------------------------- inline

def inline(text, slugs):
    text = esc_text(text)
    text = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", text)

    def link(m):
        target = m.group(1)
        label = m.group(2) if m.group(2) else target
        if target in slugs:
            return f'<a href="#" class="inline-page-link" data-page="project-{target}">{label}</a>'
        return f'<a href="{target}">{label}</a>'

    text = re.sub(r"\[\[([^\]|]+)(?:\|([^\]]+))?\]\]", link, text)
    return text


# ---------------------------------------------------------------------- body

FIG_RE = re.compile(r"!\[([^\]]*)\]\(([^)\s]+)(?:\s+\"([^\"]*)\")?\)")


def parse_figure_line(line):
    """Return list of (alt, src, hint) for every image on the line."""
    return [(a, s, h or "") for a, s, h in FIG_RE.findall(line)]


def figure_html(images, caption, slugs):
    cap = f'<figcaption class="post-caption">{inline(caption, slugs)}</figcaption>' if caption else ""
    if len(images) == 1:
        alt, src, hint = images[0]
        src_e = esc(src)
        if src.lower().endswith(".mp4"):
            body = f'<video src="{src_e}" class="background-image slide-up" style="animation-delay: 0.3s;" preload="none" muted loop playsinline></video>'
        elif hint.startswith("wrap:"):
            wrap_style, _, img_style = hint[5:].partition("|img:")
            body = (f'<div style="{esc(wrap_style)}">\n'
                    f'                                {IMG.format(src=src_e, alt=esc(alt), extra=" " + esc(img_style) if img_style else "")}\n'
                    f'                            </div>')
        elif hint.startswith("img:"):
            body = IMG.format(src=src_e, alt=esc(alt), extra=" " + esc(hint[4:]))
        else:
            body = IMG.format(src=src_e, alt=esc(alt), extra="")
        return ("                        <figure class=\"post-figure\">\n"
                f"                            {body}\n"
                + (f"                            {cap}\n" if cap else "")
                + "                        </figure>")
    container = 'display: flex; gap: 1em; justify-content: center; flex-wrap: wrap;'
    first_hint = images[0][2]
    if first_hint.startswith("container:"):
        container = first_hint.split("|", 1)[0][10:]
    parts = []
    for alt, src, hint in images:
        h = hint
        if h.startswith("container:"):
            h = h.split("|", 1)[1] if "|" in h else ""
        extra = " " + esc(h[4:]) if h.startswith("img:") else " flex: 1; max-width: 48%;"
        parts.append("                                " + IMG.format(src=esc(src), alt=esc(alt), extra=extra))
    return ("                        <figure class=\"post-figure\">\n"
            f"                            <div class=\"dual-image-container\" style=\"{esc(container)}\">\n"
            + "\n".join(parts) + "\n"
            "                            </div>\n"
            + (f"                            {cap}\n" if cap else "")
            + "                        </figure>")


def render_body(body, slugs):
    lines = body.split("\n")
    sections = []
    cur = None
    i = 0
    while i < len(lines):
        line = lines[i]
        s = line.strip()
        if s.startswith("## "):
            cur = {"title": s[3:].strip(), "tall": False, "blocks": []}
            if cur["title"].endswith(" {tall}"):
                cur["title"] = cur["title"][:-7]
                cur["tall"] = True
            sections.append(cur)
            i += 1
            continue
        if s == "---":
            cur = {"title": "", "tall": False, "closing": True, "blocks": []}
            sections.append(cur)
            i += 1
            continue
        if not s:
            i += 1
            continue
        if cur is None:
            raise ValueError(f"content before first '## ' heading: {s[:60]}")
        if s.startswith("### "):
            cur["blocks"].append(("h4", s[4:].strip()))
            i += 1
            continue
        if s.startswith("!["):
            images = parse_figure_line(s)
            caption = ""
            if i + 1 < len(lines) and lines[i + 1].strip().startswith("![") and len(images) == 1 and not images[0][1].lower().endswith(".mp4"):
                nxt = parse_figure_line(lines[i + 1].strip())
                if nxt and not nxt[0][1].lower().endswith(".mp4"):
                    images += nxt
                    i += 1
            if i + 1 < len(lines) and lines[i + 1].strip().startswith("> "):
                caption = lines[i + 1].strip()[2:]
                i += 1
            cur["blocks"].append(("figure", images, caption))
            i += 1
            continue
        if re.match(r"^(-|\d+\.) ", s):
            ordered = s[0].isdigit()
            items = []
            while i < len(lines) and re.match(r"^(-|\d+\.) ", lines[i].strip()):
                items.append(re.sub(r"^(-|\d+\.) ", "", lines[i].strip()))
                i += 1
            cur["blocks"].append(("list", ordered, items))
            continue
        para = [s]
        i += 1
        while i < len(lines) and lines[i].strip() and not re.match(r"^(## |### |!\[|- |\d+\. |> )", lines[i].strip()):
            para.append(lines[i].strip())
            i += 1
        cur["blocks"].append(("p", " ".join(para)))
    return sections


def closing_html(sec, slugs):
    figs = [figure_html(b[1], b[2], slugs) for b in sec["blocks"] if b[0] == "figure"]
    return "\n".join(f.replace("\n    ", "\n", 1).replace("\n                        ", "\n                    ") for f in figs)


def section_html(sec, slugs):
    cls = "background-container tall-figures" if sec["tall"] else "background-container"
    out = [f'                    <div class="{cls}">',
           f'                        <h3 class="background-title">{inline(sec["title"], slugs)}</h3>']
    for b in sec["blocks"]:
        if b[0] == "p":
            out.append('                        <p class="background-description">')
            out.append(f'                            {inline(b[1], slugs)}')
            out.append('                        </p>')
        elif b[0] == "h4":
            out.append("")
            out.append(f'                        <h4 style="font-size: 1.2em; margin-top: 1.5em; color: var(--primary-soft);">{inline(b[1], slugs)}</h4>')
        elif b[0] == "figure":
            out.append(figure_html(b[1], b[2], slugs))
        elif b[0] == "list":
            tag = "ol" if b[1] else "ul"
            out.append(f'                        <{tag} class="background-description" style="margin-left: 2em;">')
            for it in b[2]:
                out.append(f'                            <li>{inline(it, slugs)}</li>')
            out.append(f'                        </{tag}>')
    out.append('                    </div>')
    return "\n".join(out)


# ---------------------------------------------------------------------- page

def render_page(slug, meta, sections, slugs):
    pid = f"project-{slug}"
    prefix = meta.get("popup-prefix", slug)
    chips = meta.get("tags", []) or []
    hero = meta.get("hero", "")
    hero_alt = meta.get("hero-alt", meta["title"])
    hero_cap = meta.get("hero-caption", "")
    hero_scale = meta.get("hero-scale", "")
    out = [f'    <div id="{pid}-page" class="page">',
           '        <section class="project-detail-section">',
           '            <div class="project-detail-container">',
           f'                <h1 class="project-detail-title fade-in">{esc_text(meta["title"])}</h1>',
           '                <div class="post-meta fade-in" style="animation-delay: 0.1s;">',
           f'                    <span class="post-meta-date">{esc_text(meta["date"])}</span>',
           '                    <span class="post-meta-sep">·</span>',
           '                    <span class="post-meta-chips">']
    for c in chips:
        out.append(f'                        <span class="post-meta-chip">{esc_text(c)}</span>')
    out += ['                    </span>',
            '                    <span class="post-meta-sep">·</span>',
            f'                    <span class="post-meta-read">~{esc_text(meta["read"])} min read</span>',
            '                </div>',
            '                <figure class="post-figure slide-up">']
    if hero_scale:
        out += ['                    <div style="overflow: hidden; width: 100%; max-width: 800px; margin: 0 auto; background: transparent;">',
                f'                        <img loading="lazy" decoding="async" src="{esc(hero)}" alt="{esc(hero_alt)}" class="project-detail-image" style="transform: scale({esc(hero_scale)}); transform-origin: center; width: 100%; background: transparent;">',
                '                    </div>']
    else:
        out.append(f'                    <img loading="lazy" decoding="async" src="{esc(hero)}" alt="{esc(hero_alt)}" class="project-detail-image">')
    if hero_cap:
        out.append(f'                    <figcaption class="post-caption">{inline(hero_cap, slugs)}</figcaption>')
    out += ['                </figure>',
            '                <div class="project-detail-content slide-up" style="animation-delay: 0.2s;">']
    if meta.get("lead"):
        out += ['                    <p class="project-detail-description">',
                f'                        {inline(meta["lead"], slugs)}',
                '                    </p>']
    specs = parse_specs(meta.get("specs", []) or [])
    if specs:
        out += ['                    <div class="side-boxes-container">',
                '                        <div class="specs-container">',
                f'                            <h3 class="specs-title">{esc_text(meta.get("specs-title", "Specifications"))}</h3>',
                '                            <ul class="specs-list">']
        for sp in specs:
            out.append(f'                                <li>{inline(sp, slugs)}</li>')
        out += ['                            </ul>',
                '                        </div>',
                '                    </div>']
    out.append("")
    normal = [s for s in sections if not s.get("closing")]
    closing = [s for s in sections if s.get("closing")]
    out.append("\n\n".join(section_html(s, slugs) for s in normal))
    for s in closing:
        out.append(closing_html(s, slugs))
    out.append('                </div>')
    tl = parse_timeline(meta.get("timeline", []) or [])
    out += ['',
            '                <h3 class="timeline-title slide-up" style="animation-delay: 0.4s;">Project Timeline</h3>',
            '                <div class="timeline slide-up" style="animation-delay: 0.4s;">',
            '                    <div class="timeline-content">',
            '                        <div class="timeline-track"></div>']
    for n, (date, title, _) in enumerate(tl, 1):
        delay = 0.6 + 0.2 * (n - 1)
        out += [f'                        <div class="timeline-item" style="animation-delay: {delay:.1f}s;">',
                f'                            <div class="timeline-marker" data-description="{prefix}-desc-{n}">',
                f'                                <span class="timeline-date">{esc_text(date)}</span>',
                f'                                <h4>{esc_text(title)}</h4>',
                '                            </div>',
                '                        </div>']
    out += ['                    </div>',
            '                    <div id="timeline-popup" class="timeline-popup">',
            '                        <button class="popup-close">×</button>']
    for n, (_, _, desc) in enumerate(tl, 1):
        out += [f'                        <div id="{prefix}-desc-{n}" class="timeline-description-content" style="display: none;">',
                f'                            <p>{inline(desc, slugs)}</p>',
                '                        </div>']
    back_delay = 0.6 + 0.2 * len(tl)
    out += ['                    </div>',
            '                </div>',
            f'                <button class="back-button light-button slide-up" style="animation-delay: {back_delay:.1f}s;" data-page="projects">Back to Projects</button>',
            '            </div>',
            '        </section>',
            '    </div>']
    return "\n".join(out)


def render_ledger_row(n, slug, meta):
    title = meta.get("ledger-title", meta["title"])
    thumb = meta.get("thumb", meta.get("hero", ""))
    return "\n".join([
        f'        <div class="project-banner" data-page="project-{slug}">',
        f'            <span class="banner-index">{n:02d}</span>',
        '            <div class="banner-info">',
        f'                <h3>{esc_text(title)}</h3>',
        f'                <span class="banner-tag">{esc_text(meta["date"])} · {esc_text(meta["read"])} min</span>',
        '            </div>',
        f'            <img class="banner-thumb" src="{esc(thumb)}" alt="{esc(title)}">',
        '            <span class="banner-arrow">→</span>',
        '        </div>'])


# ---------------------------------------------------------------------- main

WORDS_PER_MINUTE = 230


def read_minutes(meta, body):
    text = FIG_RE.sub(" ", body)
    text = re.sub(r"\[\[([^\]|]+)(?:\|([^\]]+))?\]\]", lambda m: m.group(2) or m.group(1), text)
    words = len(re.findall(r"[A-Za-z0-9][\w'./%-]*", text))
    words += len(re.findall(r"[A-Za-z0-9][\w'./%-]*", str(meta.get("lead", ""))))
    return str(max(1, round(words / WORDS_PER_MINUTE)))


def load_posts():
    posts = []
    for p in sorted(POSTS.glob("*.md")):
        if p.name.lower() == "readme.md":
            continue
        meta, body = parse_front_matter(p.read_text(encoding="utf-8"))
        if str(meta.get("draft", "")).lower() == "true":
            continue
        meta["read"] = read_minutes(meta, body)
        posts.append((p.stem, meta, body))
    posts.sort(key=lambda t: int(t[1].get("order", 999)))
    return posts


def main():
    posts = load_posts()
    slugs = {slug for slug, _, _ in posts}
    pages, rows = [], []
    for n, (slug, meta, body) in enumerate(posts, 1):
        sections = render_body(body, slugs)
        pages.append(render_page(slug, meta, sections, slugs))
        rows.append(render_ledger_row(n, slug, meta))
    src = INDEX.read_text(encoding="utf-8")
    for start, end in ((LEDGER_START, LEDGER_END), (PAGES_START, PAGES_END)):
        if src.count(start) != 1 or src.count(end) != 1:
            sys.exit(f"index.html must contain exactly one {start} and {end}")
    a, b = src.index(LEDGER_START) + len(LEDGER_START), src.index(LEDGER_END)
    src = src[:a] + "\n" + "\n\n".join(rows) + "\n        " + src[b:]
    a, b = src.index(PAGES_START) + len(PAGES_START), src.index(PAGES_END)
    src = src[:a] + "\n" + "\n\n".join(pages) + "\n    " + src[b:]
    INDEX.write_text(src, encoding="utf-8", newline="\n")
    print(f"built {len(posts)} posts into index.html")


if __name__ == "__main__":
    main()
