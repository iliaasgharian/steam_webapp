"""
Stress-test script for the Steam backend, using Locust.

Run with:
    locust -f locustfile.py --host=http://localhost:8000

Then open http://localhost:8089 in your browser to start the test
and watch live charts (requests/sec, response times, failures).
"""

import random
from locust import HttpUser, task, between


class SteamApiUser(HttpUser):
    # Each simulated user waits 1-3 seconds between actions,
    # to mimic realistic human browsing pace rather than hammering nonstop.
    wait_time = between(1, 3)

    def on_start(self):
        """
        Runs once per simulated user at the start of the test.
        Registers a unique user and logs in, so authenticated
        endpoints can be tested too.
        """
        self.email = f"loadtest_{random.randint(1, 10_000_000)}@example.com"
        self.password = "loadtest123"

        self.client.post(
            "/api/auth/register",
            json={"email": self.email, "password": self.password, "full_name": "Load Test"},
        )

        response = self.client.post(
            "/api/auth/login",
            json={"email": self.email, "password": self.password},
        )
        token = response.json().get("access_token") if response.status_code == 200 else None
        self.auth_headers = {"Authorization": f"Bearer {token}"} if token else {}

    # ---- Public endpoints (most frequent, like real traffic) ----

    @task(5)
    def browse_games(self):
        self.client.get("/api/games", name="/api/games")

    @task(3)
    def search_games(self):
        query = random.choice(["counter", "dota", "rpg", "strike", "simulator"])
        self.client.get(f"/api/games?q={query}", name="/api/games?q=[search]")

    @task(2)
    def view_game_detail(self):
        appid = random.choice([730, 570, 440, 271590, 578080])
        with self.client.get(f"/api/games/{appid}", name="/api/games/[appid]", catch_response=True) as response:
            # 404 is expected if that appid doesn't exist in the DB yet â€” don't count it as a failure.
            if response.status_code in (200, 404):
                response.success()

    @task(2)
    def list_genres(self):
        self.client.get("/api/genres", name="/api/genres")

    @task(1)
    def list_categories(self):
        self.client.get("/api/categories", name="/api/categories")

    @task(1)
    def list_companies(self):
        self.client.get("/api/companies", name="/api/companies")

    # ---- Authenticated endpoints ----

    @task(2)
    def view_profile(self):
        if self.auth_headers:
            self.client.get("/api/users/me", headers=self.auth_headers, name="/api/users/me")

    @task(1)
    def view_favorite_games(self):
        if self.auth_headers:
            self.client.get(
                "/api/users/me/favorite-games",
                headers=self.auth_headers,
                name="/api/users/me/favorite-games",
            )
