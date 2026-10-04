import React from "react";
import Navbar from "../components/Navbar";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Steam Lite
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Browse and discover great games in a light, modern interface.
          </p>
        </div>
      </main>
    </div>
  );
};

export default HomePage;