"""Serve FERDA briefly and verify representative static responses."""

import http.server
import socketserver
import threading
import urllib.request


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass


PATHS = (
    "/",
    "/assets/ferda/branding/splash_main.webp",
    "/assets/ferda/icons/ferda-ui-icon-nav-today.webp",
    "/assets/ferda/avatars/avatar_otter.webp",
)


with socketserver.TCPServer(("127.0.0.1", 0), QuietHandler) as server:
    port = server.server_address[1]
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()

    for path in PATHS:
        with urllib.request.urlopen(f"http://127.0.0.1:{port}{path}") as response:
            body = response.read()
            assert response.status == 200
            assert body
            print(path, response.status, response.headers.get_content_type(), len(body))

    server.shutdown()
