#!/usr/bin/env python3
"""Live-reloading dev server for the static notes site.

Serves the repo root and reloads the browser whenever HTML/CSS/JS/JSON change.

Run with:  uv run serve.py   (optionally: uv run serve.py --port 5555)
"""
import argparse

from livereload import Server

WATCH_GLOBS = [
    "index.html",
    "html/*.html",
    "assets/*.css",
    "assets/*.js",
    "assets/*.json",
]


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--host", default="localhost")
    parser.add_argument("--port", type=int, default=5500)
    args = parser.parse_args()

    server = Server()
    for glob in WATCH_GLOBS:
        server.watch(glob)

    print(f"Serving http://{args.host}:{args.port}/  (Ctrl-C to stop)")
    server.serve(root=".", host=args.host, port=args.port, open_url_delay=1)


if __name__ == "__main__":
    main()
