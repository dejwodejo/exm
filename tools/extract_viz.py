#!/usr/bin/env python3
"""Extract interactive <figure class="viz"> blocks out of the note HTML.

Each note carries hand-authored visualizations as a
    <figure class="viz" id="X"> … </figure>
optionally followed by a bare <script> … </script> that draws into it.
These are big and clutter the prose. This moves each one into

    visual/<note>/<id>.html        (the figure + its script, verbatim)

and leaves a lightweight placeholder in the note:

    <div class="viz-mount" data-viz="X"></div>

The loader in assets/notes.js fetches the partial at runtime, injects the
figure, then re-executes its script — so the notes stay small and editable
while the page looks identical. Works over http (dev server + GitHub Pages);
degrades gracefully on file://.

Usage:  python3 tools/extract_viz.py            # all html/*.html
        python3 tools/extract_viz.py FILE ...
        python3 tools/extract_viz.py --check     # report, write nothing
"""
import glob
import os
import re
import sys

FIG_OPEN = re.compile(r'<figure class="viz" id="([^"]+)">')


def _find_close(s, start, tag):
    """Index just past the first </tag> at or after `start`. viz figures and
    scripts never nest, so a first-match close is correct."""
    m = re.compile(r"</%s\s*>" % tag).search(s, start)
    if not m:
        raise ValueError("no closing </%s> after %d" % (tag, start))
    return m.end()


def extract(s, note):
    """Return (new_html, [(id, partial_text), ...])."""
    out = []
    partials = []
    i = 0
    while True:
        m = FIG_OPEN.search(s, i)
        if not m:
            out.append(s[i:])
            break
        out.append(s[i : m.start()])
        vid = m.group(1)
        fig_end = _find_close(s, m.end(), "figure")
        block_end = fig_end
        # a bare <script> (no attributes) glued to the figure belongs with it
        tail = re.match(r"\s*<script>", s[fig_end:])
        if tail:
            block_end = _find_close(s, fig_end + tail.end(), "script")
        partials.append((vid, s[m.start() : block_end].strip() + "\n"))
        out.append('<div class="viz-mount" data-viz="%s"></div>' % vid)
        i = block_end
    return "".join(out), partials


def main(argv):
    check = "--check" in argv
    files = [a for a in argv if not a.startswith("-")] or sorted(glob.glob("html/*.html"))
    grand_saved = 0
    total_viz = 0
    for f in files:
        s = open(f, encoding="utf-8").read()
        note = os.path.splitext(os.path.basename(f))[0]
        new, partials = extract(s, note)
        if not partials:
            continue
        saved = len(s) - len(new)
        grand_saved += saved
        total_viz += len(partials)
        print(f"{f:44} {len(s)/1024:6.0f}KB -> {len(new)/1024:6.0f}KB  "
              f"{len(partials):2} viz -> visual/{note}/")
        if check:
            continue
        d = os.path.join("visual", note)
        os.makedirs(d, exist_ok=True)
        for vid, text in partials:
            open(os.path.join(d, vid + ".html"), "w", encoding="utf-8").write(text)
        open(f, "w", encoding="utf-8").write(new)
    print(f"\n{total_viz} figures extracted, notes shrank by "
          f"{grand_saved/1024:.0f}KB total"
          + ("   [--check: nothing written]" if check else ""))


if __name__ == "__main__":
    main(sys.argv[1:])
