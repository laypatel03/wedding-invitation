from flask import Flask, render_template

app = Flask(__name__)


@app.route("/")
def index():
    """Serves the wedding invitation page."""
    return render_template("index.html")

@app.route("/menu")
def menu():
    """Serves the wedding invitation page."""
    return render_template("menu.html")


if __name__ == "__main__":
    # debug=True is handy while you're editing; turn it off before you deploy.
    app.run(debug=True, host="0.0.0.0", port=5050)

