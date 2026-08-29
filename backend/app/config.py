"""
Central place for project settings.
Kept simple for now — can be swapped for pydantic-settings/.env later.
"""

DATABASE_FILE = "steam_games.db"

# Steam API
STEAM_APPDETAILS_URL = "https://store.steampowered.com/api/appdetails"
STEAM_APPLIST_URL = "https://api.steampowered.com/ISteamApps/GetAppList/v2/"
STEAM_CURRENT_PLAYERS_URL = "https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/"

# Be conservative with request pacing to avoid Steam's rate limits.
REQUEST_DELAY_SECONDS = 1.5

# Auth (placeholders — replace with real secrets via environment variables)
JWT_SECRET_KEY = "CHANGE_ME_BEFORE_PRODUCTION"
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 1 day
