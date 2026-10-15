"""Record current player counts and current Steam prices for every known game.
Run periodically (e.g. every 15 minutes) with: python -m app.scripts.record_snapshots
Steam may rate-limit large catalogs; REQUEST_DELAY_SECONDS is respected.
"""
import time
from datetime import datetime
import requests
from app.database import SessionLocal
from app.models.game import Game
from app.models.player_snapshot import PlayerSnapshot
from app.models.price_snapshot import PriceSnapshot
from app.config import STEAM_CURRENT_PLAYERS_URL, STEAM_APPDETAILS_URL, REQUEST_DELAY_SECONDS

def main():
    db = SessionLocal()
    try:
        games = db.query(Game).filter(Game.appid.isnot(None)).all()
        session = requests.Session()
        for game in games:
            now = datetime.utcnow()
            try:
                response = session.get(STEAM_CURRENT_PLAYERS_URL, params={"appid": game.appid}, timeout=12)
                response.raise_for_status()
                payload = response.json().get("response", {})
                if payload.get("result") == 1 and payload.get("player_count") is not None:
                    db.add(PlayerSnapshot(game_id=game.id, player_count=int(payload["player_count"]), recorded_at=now))
            except (requests.RequestException, ValueError, TypeError):
                pass
            try:
                response = session.get(STEAM_APPDETAILS_URL, params={"appids": game.appid, "cc": "us", "l": "en"}, timeout=12)
                response.raise_for_status()
                entry = response.json().get(str(game.appid), {})
                if entry.get("success") and entry.get("data", {}).get("price_overview"):
                    price = entry["data"]["price_overview"]
                    currency = price.get("currency", "USD")
                    current = (int(price.get("initial", 0)), int(price.get("final", 0)), int(price.get("discount_percent", 0)), currency)
                    previous = db.query(PriceSnapshot).filter(PriceSnapshot.game_id == game.id).order_by(PriceSnapshot.recorded_at.desc()).first()
                    if not previous or (previous.price_initial, previous.price_final, previous.discount_percent, previous.currency) != current:
                        db.add(PriceSnapshot(game_id=game.id, price_initial=current[0], price_final=current[1], discount_percent=current[2], currency=current[3], recorded_at=now))
                    game.price_initial, game.price_final, game.discount_percent, game.currency = current
            except (requests.RequestException, ValueError, TypeError, KeyError):
                pass
            db.commit()
            time.sleep(REQUEST_DELAY_SECONDS)
    finally:
        db.close()
if __name__ == "__main__":
    main()
