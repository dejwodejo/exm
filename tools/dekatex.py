#!/usr/bin/env python3
"""De-bloat pre-rendered KaTeX in the note HTML.

Every KaTeX blob embeds its own TeX source in
    <annotation encoding="application/x-tex">…</annotation>
so we can replace the whole multi-thousand-char blob with the raw TeX:

    inline   <span class="katex">…</span>            ->  \\(  … \\)
    display  <span class="katex-display">…</span>    ->  \\[  … \\]

Math then renders client-side via KaTeX auto-render (added to each note's
<head> by patch_head()). The TeX becomes editable in place.

Usage:  python3 tools/dekatex.py            # convert all html/*.html in place
        python3 tools/dekatex.py FILE ...   # convert specific files
        python3 tools/dekatex.py --check     # report sizes, write nothing
"""
import glob
import html
import re
import sys

# Auto-render block injected before </head>. Delimiters \( \) and \[ \] are
# unambiguous (unlike $), so prose containing a literal $ never misfires.
AUTORENDER = """<script defer src="{prefix}assets/katex/katex.min.js"></script>
<script defer src="{prefix}assets/katex/auto-render.min.js"></script>
<script>document.addEventListener("DOMContentLoaded",function(){{renderMathInElement(document.body,{{delimiters:[{{left:"\\\\[",right:"\\\\]",display:true}},{{left:"\\\\(",right:"\\\\)",display:false}}],throwOnError:false}});}});</script>
"""


def _matching_span(s, start):
    """Given index of a '<span' that opens a block, return index just past its
    balanced '</span>'. Handles arbitrary nesting."""
    depth = 0
    i = start
    tag = re.compile(r"<(/?)span\b", re.I)
    while True:
        m = tag.search(s, i)
        if not m:
            raise ValueError("unbalanced <span> starting at %d" % start)
        if m.group(1):
            depth -= 1
            if depth == 0:
                end = s.index(">", m.end()) + 1
                return end
        else:
            depth += 1
        i = m.end()


def _tex_of(block):
    m = re.search(
        r'<annotation encoding="application/x-tex"\s*>(.*?)</annotation\s*>', block, re.S
    )
    if not m:
        raise ValueError("no TeX annotation in block")
    return html.unescape(m.group(1)).strip()


def convert(s):
    out = []
    i = 0
    n_inline = n_display = 0
    # Match either the display wrapper or a bare inline katex span. Display is
    # tried first so we consume the whole <span class="katex-display">…</span>
    # (which contains an inner .katex) as one unit.
    opener = re.compile(r'<span\s+class="katex(-display)?"\s*>')
    while True:
        m = opener.search(s, i)
        if not m:
            out.append(s[i:])
            break
        out.append(s[i : m.start()])
        end = _matching_span(s, m.start())
        block = s[m.start() : end]
        tex = _tex_of(block)
        if m.group(1):  # katex-display
            out.append("\\[" + tex + "\\]")
            n_display += 1
        else:
            out.append("\\(" + tex + "\\)")
            n_inline += 1
        i = end
    return "".join(out), n_inline, n_display


def patch_head(s, path):
    if "auto-render.min.js" in s:
        return s  # already patched
    prefix = "../" if "/html/" in path.replace("\\", "/") or path.startswith("html/") else ""
    block = AUTORENDER.format(prefix=prefix)
    return s.replace("</head>", block + "</head>", 1)


def main(argv):
    check = "--check" in argv
    files = [a for a in argv if not a.startswith("-")] or sorted(glob.glob("html/*.html"))
    grand_before = grand_after = 0
    for f in files:
        s = open(f, encoding="utf-8").read()
        before = len(s)
        new, ni, nd = convert(s)
        new = patch_head(new, f)
        after = len(new)
        grand_before += before
        grand_after += after
        pct = 100 * (before - after) / before if before else 0
        print(
            f"{f:44} {before/1024:6.0f}KB -> {after/1024:6.0f}KB  "
            f"(-{pct:4.1f}%)  {ni} inline, {nd} display"
        )
        if not check:
            open(f, "w", encoding="utf-8").write(new)
    print(
        f"\nTOTAL {grand_before/1024:.0f}KB -> {grand_after/1024:.0f}KB  "
        f"(-{100*(grand_before-grand_after)/grand_before:.1f}%)"
        + ("   [--check: nothing written]" if check else "")
    )


if __name__ == "__main__":
    main(sys.argv[1:])
