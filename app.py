import os

from flask import Flask, render_template

try:
    from waitress import serve as waitress_serve
except ImportError:
    waitress_serve = None

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


if __name__ == "__main__":
    host = os.getenv("FLASK_HOST", "0.0.0.0")
    port = int(os.getenv("FLASK_PORT", "5000"))

    if waitress_serve is not None:
        threads = int(os.getenv("WAITRESS_THREADS", "8"))
        waitress_serve(app, host=host, port=port, threads=threads)
    else:
        debug = os.getenv("FLASK_DEBUG", "1") == "1"
        print("Waitress is not installed in this Python environment; using Flask dev server.")
        app.run(host=host, port=port, debug=debug)
