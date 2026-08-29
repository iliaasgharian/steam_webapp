"""
Import every model here so that Base.metadata knows about all tables
before create_all() is called (e.g. from a setup script or main.py).
"""

from app.models.game import Game
from app.models.genre import Genre, game_genres
from app.models.category import Category, game_categories
from app.models.company import Company, game_developers, game_publishers
from app.models.player_snapshot import PlayerSnapshot
from app.models.sales_chart import SalesChart
from app.models.user import User, SearchHistory, FavoriteGame, FavoriteGenre
