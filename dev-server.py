#!/usr/bin/env python3
"""Local preview server that mirrors Vercel's `cleanUrls` behaviour.

Python's stock http.server has no concept of clean URLs, so `/about` would
404 locally while working in production. This serves `about.html` for
`/about` and redirects `/about.html` to `/about`, matching vercel.json so
local testing reflects the deployed routing.

    python3 dev-server.py [port]
"""

import os
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit, urlunsplit

ROOT = os.path.dirname(os.path.abspath(__file__))


class CleanURLHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def do_GET(self):
        parts = urlsplit(self.path)
        path = parts.path

        # /about.html -> /about   (Vercel issues a 308 here)
        if path.endswith(".html") and path != "/index.html":
            target = urlunsplit(("", "", path[: -len(".html")], parts.query, parts.fragment))
            self.send_response(308)
            self.send_header("Location", target)
            self.end_headers()
            return

        # /about -> serve about.html
        if not os.path.splitext(path)[1] and path != "/":
            candidate = os.path.join(ROOT, path.lstrip("/") + ".html")
            if os.path.isfile(candidate):
                self.path = urlunsplit(("", "", path + ".html", parts.query, ""))

        return super().do_GET()

    def do_HEAD(self):
        # Route HEAD through the same rewrite/redirect logic as GET,
        # otherwise tooling probing with HEAD sees different behaviour.
        parts = urlsplit(self.path)
        path = parts.path
        if path.endswith(".html") and path != "/index.html":
            target = urlunsplit(("", "", path[: -len(".html")], parts.query, parts.fragment))
            self.send_response(308)
            self.send_header("Location", target)
            self.end_headers()
            return
        if not os.path.splitext(path)[1] and path != "/":
            candidate = os.path.join(ROOT, path.lstrip("/") + ".html")
            if os.path.isfile(candidate):
                self.path = urlunsplit(("", "", path + ".html", parts.query, ""))
        return super().do_HEAD()

    def end_headers(self):
        # Never cache during development
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, fmt, *args):
        sys.stderr.write("%s\n" % (fmt % args))


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 4173
    print(f"Serving {ROOT} with clean URLs on http://localhost:{port}")
    ThreadingHTTPServer(("", port), CleanURLHandler).serve_forever()
