---
name: tpa-theme
description: TPA Platform brand identity and HTML theme. Use when generating HTML documents, dashboards, portals, mockups, or any visual artefact for the TPA Platform — Malaysia project. Sourced from the original design language in docs/archive/RSA-Integration-Analysis-MVP.html (relative to project root).
---

# TPA Platform — Theme & Brand

The TPA Platform inherits its visual language from the design baseline preserved at `docs/archive/RSA-Integration-Analysis-MVP.html`. The TPA brand keeps the same component vocabulary and spacing system, but the **red accent** is the canonical TPA primary; navy is the body chrome; greens/ambers/blues are reserved for status semantics.

When generating HTML pages, **always reuse this token set** — don't invent new colors, type scales, or border radii.

---

## 1. Brand color tokens

Copy verbatim into `<style>` of every page. **Do not redefine.**

```css
:root {
  /* Brand primary */
  --red:        #c8202f;   /* primary brand red */
  --red-dark:   #9f1623;   /* hover / pressed */
  --red-light:  #fdeeef;   /* tinted bg, active nav */

  /* Chrome / body */
  --navy:       #1f2a37;   /* topbar, headings, body text */
  --navy-2:     #2a3645;   /* hover topbar elements */

  /* Status semantics */
  --green:      #10b981;   /* success */
  --amber:      #f59e0b;   /* warning */
  --blue:       #2563eb;   /* informational */

  /* Neutral scale */
  --g50:  #f9fafb;
  --g100: #f3f4f6;
  --g150: #eceef2;
  --g200: #e5e7eb;
  --g300: #d1d5db;
  --g400: #9ca3af;
  --g500: #6b7280;
  --g600: #4b5563;
  --g700: #374151;
  --g800: #1f2937;

  /* Layout */
  --sidebar-w: 260px;
  --topbar-h:  56px;
}
```

### Color usage rules
- **Red (`--red`)** — primary brand. Use on logo accent, topbar pill, section number badges, active nav, key call-to-action buttons, primary tag chips. Never use for body text.
- **Navy (`--navy`)** — body text, headings, topbar background. Body copy is `var(--g700)`; headings tighten to `--navy`.
- **Status colors** — green for "admitted/approved/success", amber for "review/flagged/warning", blue for "informational/info banners". Reds outside the brand red are reserved for "declined/rejected/error" — use `#fee2e2` bg + `--red-dark` text.
- **Neutrals** — backgrounds in `--g50` / `--g100`; borders in `--g200` / `--g150`; muted text in `--g500` / `--g600`.

---

## 2. Typography

```css
body {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 15px;
  line-height: 1.65;
  color: var(--navy);
  background: #fff;
  -webkit-font-smoothing: antialiased;
}

code, pre, .mono {
  font-family: "JetBrains Mono", "SF Mono", monospace;
}
```

Font sourcing (top of `<head>`):

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap"
  rel="stylesheet"
/>
```

### Type scale
| Element | Size | Weight | Color |
|---|---|---|---|
| `.doc-title` | 30 px | 800 | `var(--navy)` |
| `h2` | 20 px | 700 | `var(--navy)` (with red `.h2-num` badge optional) |
| `h3` | 16 px | 700 | `var(--navy)` |
| `h4` | 13 px | 700, uppercase, 0.08em tracking | `var(--g500)` |
| Body | 15 px | 400 | `var(--g700)` |
| `code` | 12.5 px | 500 | `var(--red-dark)` on `var(--g100)` |
| `pre` | 12.5 px | mono | `#e2e8f0` on `#0f172a` |
| Table | 13.5 px | — | `var(--g700)`; headers 11 px 700 uppercase `var(--g500)` |

---

## 3. Layout primitives

### Topbar (fixed, navy)
```html
<header class="topbar">
  <a class="topbar-logo" href="../index.html">
    <div class="topbar-logo-icon">TPA</div>
    <span class="topbar-logo-text">TPA Platform — Malaysia</span>
  </a>
  <span class="topbar-pill">Planning · v1.1</span>
  <a class="topbar-parent-link" href="../index.html">↑ All documents</a>
</header>
```

### Layout
```html
<div class="layout">
  <aside class="sidebar"><!-- TOC --></aside>
  <main class="main"><!-- content --></main>
</div>
```

The sidebar contains a 10-px uppercase "ON THIS PAGE" or "DOCUMENTS" label, grouped `.toc-group` headings, and `.toc-link` items. Active link gets a red left border and tinted background.

---

## 4. Component library

Use these classes verbatim. Definitions live in the shared CSS that every TPA HTML page must include (see §6).

| Component | Class(es) | Purpose |
|---|---|---|
| Section badge | `.h2-num` | Numbered red square next to an `h2` |
| Document meta strip | `.doc-meta` | Date · version · status row under the title |
| Table wrapper | `.table-wrap` | Scrollable border around a `<table>` |
| Info callout | `<blockquote>` | Default blue info card |
| Warning callout | `<blockquote class="warn">` | Amber |
| Success callout | `<blockquote class="info">` | Green |
| MVP banner | `.mvp-banner` | Top-of-page amber gradient banner for MVP context notes |
| Requirement card | `.fr-card` + `.fr-id` + `.fr-priority` (`must`/`should`/`could`) | Used for FR/NFR rows |
| Decision pill | `.tier-pill` (active = red) | Filter-style chips |
| Status chip — admit | `.chip.admit` (green) | Bill-line ADMIT decision |
| Status chip — reduce | `.chip.reduce` (amber) | REDUCE decision |
| Status chip — reject | `.chip.reject` (red-tint) | REJECT decision |
| Status chip — flag | `.chip.flag` (blue) | FLAG decision |
| Code block | `<pre><code>...</code></pre>` | Dark navy code block |
| Inline code | `<code>...</code>` | Red-on-gray pill |
| Cross-link | `.yml-link` | Red dotted-underline link (use for entity references inside prose) |

Status chip CSS (extension on top of the original design — adapted for TPA's adjudication outcomes):

```css
.chip {
  display: inline-flex; align-items: center;
  padding: 2px 8px; border-radius: 999px;
  font-size: 11px; font-weight: 700;
  letter-spacing: 0.04em; text-transform: uppercase;
}
.chip.admit  { background: #d1fae5; color: #065f46; }
.chip.reduce { background: #fef3c7; color: #92400e; }
.chip.reject { background: #fee2e2; color: var(--red-dark); }
.chip.flag   { background: #dbeafe; color: #1e40af; }
```

---

## 5. Page anatomy

Every TPA HTML page follows this structure:

```
┌─────────────────────────────────────────┐
│  TOPBAR (navy, fixed)                   │  56 px
│  [TPA logo]  TPA Platform · pill        │
├──────────┬──────────────────────────────┤
│          │                              │
│  SIDEBAR │  MAIN                        │
│  (g50)   │  (white, max-width 940 px)   │
│  TOC     │                              │
│  260 px  │  • Title 30 px               │
│          │  • Meta strip                │
│          │  • h2 sections               │
│          │  • content                   │
│          │                              │
└──────────┴──────────────────────────────┘
```

Responsive: at `< 900 px`, sidebar hides; main becomes full-width with 32 px gutter.

---

## 6. Shared CSS bundle

Don't paste the full CSS into every page — load it once from a shared file:

```html
<link rel="stylesheet" href="/assets/tpa-theme.css">
```

When generating HTML during the MVP build (before we have a real asset server), inline the CSS at the top of each generated page or fetch it relatively (e.g., `../assets/tpa-theme.css`). The shared file lives at `assets/tpa-theme.css` once scaffolding lands.

---

## 7. Markdown rendering

Generated HTML pages render Markdown client-side using **marked.js** from CDN. Pattern:

```html
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
<script type="text/markdown" id="md-content">
{{ markdown body here }}
</script>
<script>
  const md = document.getElementById('md-content').textContent;
  document.getElementById('rendered').innerHTML = marked.parse(md, { gfm: true, breaks: false });
  // After render, find the first h1 and copy it as document title
  const h1 = document.querySelector('.doc-rendered h1');
  if (h1) {
    document.querySelector('.doc-title').textContent = h1.textContent;
    h1.remove();
  }
</script>
```

The `marked.parse()` output goes into `.doc-rendered` so the standard typography rules apply.

---

## 8. Mermaid theme

When generating Mermaid diagrams, initialise the theme to align with brand:

```html
<script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
<script>
  mermaid.initialize({
    startOnLoad: true,
    theme: 'base',
    themeVariables: {
      fontFamily: 'Inter, sans-serif',
      primaryColor:        '#fdeeef',
      primaryBorderColor:  '#c8202f',
      primaryTextColor:    '#1f2a37',
      lineColor:           '#6b7280',
      tertiaryColor:       '#f9fafb',
      tertiaryBorderColor: '#e5e7eb'
    },
    er: { useMaxWidth: true },
    flowchart: { useMaxWidth: true, htmlLabels: true }
  });
</script>
```

---

## 9. Do / Don't

| Do | Don't |
|---|---|
| Use `var(--red)` for the primary accent everywhere | Pick fresh reds per page |
| Use `--g50` and `--g100` for subtle backgrounds | Use white-on-white surfaces |
| Number `h2` sections with `.h2-num` for long docs | Number `h3` or `h4` |
| Use `.chip.admit/reduce/reject/flag` for adjudication outcomes | Invent ad-hoc colored badges |
| Use Inter for prose, JetBrains Mono for code | Mix in serif faces or system fonts |
| Wrap tables in `.table-wrap` | Let tables overflow on small screens |
| Quote `code` for entity, field, and file names | Italicise them instead |

---

## 10. Quick-start template

The fastest way to start a new HTML doc:

1. Copy `assets/_template.html` (created during scaffolding).
2. Replace `{{TITLE}}`, `{{SUBTITLE}}`, `{{NAV_ACTIVE}}`, and either embed Markdown into `<script type="text/markdown">` or write raw HTML into `<main class="main">`.
3. Save as `docs/<section>/<slug>.html`.

The template auto-loads:
- Inter + JetBrains Mono from Google Fonts
- `assets/tpa-theme.css`
- `marked.min.js` (if `text/markdown` payload is present)
- `mermaid.min.js` (only if a `.mermaid` element is on the page)
