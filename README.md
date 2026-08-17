# Bhavi & Priyanka — Wedding Invitation (Flask)

## Folder structure

```
wedding-invite/
├── app.py                 # Flask app entry point
├── requirements.txt
├── templates/
│   └── index.html         # the invitation page (Jinja template)
└── static/
    ├── css/
    │   └── style.css       # all styling
    ├── js/
    │   └── main.js         # countdown, scroll reveal, hearts, music, petals
    └── images/
        ├── peacock.png     # ADD YOUR PEACOCK IMAGE HERE
        └── gaensha.png     # ADD YOUR GANESHA IMAGE HERE
```

## 1. Add your images

Drop your actual `peacock.png` and `gaensha.png` files into `static/images/`.
Those exact filenames are already referenced in `templates/index.html`, so no
other changes are needed once they're in place.

## 2. Add your song (optional)

Open `templates/index.html`, find this line near the top of `<body>`:

```html
<audio id="bgMusic" loop preload="none"></audio>
```

Put your MP3 file in `static/images/` (or make a `static/audio/` folder) and
point the tag at it, e.g.:

```html
<audio id="bgMusic" loop preload="none" src="{{ url_for('static', filename='audio/song.mp3') }}"></audio>
```

## 3. Run it locally

```bash
cd wedding-invite
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Then open **http://127.0.0.1:5000** in your browser.

## 4. Hosting it for real

Any host that runs Python/Flask works. A few easy free/cheap options:

- **Render** (render.com) — connect your GitHub repo, it auto-detects Flask,
  free tier available.
- **PythonAnywhere** — upload the folder directly, good for small personal
  sites, free tier available.
- **Railway** (railway.app) — connect repo, auto-deploys.

For any of these: push this folder to a GitHub repo, then connect that repo
to the host. Do **not** use `app.run(debug=True)` in production — the hosts
above run your app with a proper WSGI server (e.g. gunicorn) automatically,
so you don't need to change anything else.

If you'd rather not deal with a server at all, this same design also works
as a single static HTML file (no Flask needed) — ask if you'd like that
version back instead.
