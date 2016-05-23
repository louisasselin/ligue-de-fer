
# A very simple Flask Hello World app for you to get started with...

import os.path

from flask import Flask, Response

app = Flask(__name__)

def root_dir():  # pragma: no cover
    return os.path.abspath(os.path.dirname(__file__))


def get_file(filename):  # pragma: no cover
    try:
        src = os.path.join(root_dir(), filename)
        # Figure out how flask returns static files
        # Tried:
        # - render_template
        # - send_file
        # This should not be so non-obvious
        return open(src,'rb').read()
    except IOError as exc:
        return str(exc)


@app.route('/', defaults={'path': 'index.html'})
@app.route('/<path:path>')
def get_resource(path):  # pragma: no cover
    mimetypes = {
        ".css": "text/css",
        ".html": "text/html",
        ".js": "application/javascript",
        ".jpg": "image/jpeg",
        ".png": "image/png",
        ".pdf": "application/pdf",
    }
    ext = os.path.splitext(path)[1]
    mimetype = mimetypes.get(ext, "text/html")
    content = get_file(path)
    return Response(content, mimetype=mimetype)
