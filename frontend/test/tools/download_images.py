#!/usr/bin/env python3
"""Download real Steam images for every game in js/data-real.js into images/games/.

Run from the project folder (needs internet, Python 3 only):   python tools/download_images.py

Saves, per game:   <id>.jpg (cover)   <id>-hero.jpg (wide banner)   <id>-1.jpg ... <id>-5.jpg (screenshots)
Files that already exist are skipped. The site picks these local files up automatically (see gameBg() in js/utils.js).
Images are Valve's / the publishers' property — fine for local testing; check their terms before publishing a site.
"""
import json, os, re, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "images", "games")
HOSTS = ["https://shared.akamai.steamstatic.com/store_item_assets/steam", "https://cdn.akamai.steamstatic.com/steam",
         "https://cdn.cloudflare.steamstatic.com/steam", "https://steamcdn-a.akamaihd.net/steam"]
UA = {"User-Agent": "Mozilla/5.0 (Playbase image downloader)"}

def get(url, timeout=20):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=timeout) as r:
        return r.read()

def save(urls, path):
    if os.path.exists(path): return "exists"
    for u in urls:
        try:
            data = get(u)
            if len(data) > 1000:
                open(path, "wb").write(data); return "ok"
        except Exception:
            pass
    return "FAILED"

def main():
    src = open(os.path.join(ROOT, "js", "data-real.js"), encoding="utf-8").read()
    games = re.findall(r'id:"([a-z0-9_-]+)",\s*appid:(\d+)', src)
    os.makedirs(OUT, exist_ok=True)
    for gid, appid in games:
        res = [save([f"{h}/apps/{appid}/header.jpg" for h in HOSTS], f"{OUT}/{gid}.jpg"),
               save([f"{h}/apps/{appid}/library_hero.jpg" for h in HOSTS], f"{OUT}/{gid}-hero.jpg")]
        shots = 0
        try:   # screenshots come from the store API (may be blocked in some regions)
            info = json.loads(get(f"https://store.steampowered.com/api/appdetails?appids={appid}&l=english"))[appid]["data"]
            for n, s in enumerate(info.get("screenshots", [])[:5], 1):
                if save([s["path_full"].split("?")[0]], f"{OUT}/{gid}-{n}.jpg") != "FAILED": shots += 1
        except Exception:
            pass
        print(f"{gid:14} cover={res[0]:7} hero={res[1]:7} screenshots={shots}/5")
    print("Done. Reload the site (Ctrl+F5).")

if __name__ == "__main__":
    main()
