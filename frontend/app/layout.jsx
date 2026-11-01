import React from "react";

export const metadata = { title: "Playbase — Steam game data & analytics", description: "Explore Steam games, trends, player counts and game discovery tools." };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/playbase/css/variables.css" />
        <link rel="stylesheet" href="/playbase/css/base.css" />
        <link rel="stylesheet" href="/playbase/css/navbar.css" />
        <link rel="stylesheet" href="/playbase/css/layout.css" />
        <link rel="stylesheet" href="/playbase/css/home.css" />
        <link rel="stylesheet" href="/playbase/css/components.css" />
        <link rel="stylesheet" href="/playbase/css/browse.css" />
        <link rel="stylesheet" href="/playbase/css/analytics.css" />
        <link rel="stylesheet" href="/playbase/css/game-detail.css" />
        <link rel="stylesheet" href="/playbase/css/pages.css" />
        <link rel="stylesheet" href="/playbase/css/footer.css" />
        <link rel="stylesheet" href="/playbase/css/enhancements.css" />
        <link rel="stylesheet" href="/playbase/css/mobile.css" />
        <link rel="stylesheet" href="/playbase/css/hover-and-filters.css" />
        <link rel="stylesheet" href="/playbase/css/hybrid.css" />
        <link rel="stylesheet" href="/playbase/css/intelligence.css" />
        <link rel="stylesheet" href="/playbase/css/light-theme.css" />
        <link rel="stylesheet" href="/playbase/css/account.css" />
        <link rel="stylesheet" href="/playbase/css/mixer.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
