import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold text-gray-900">
            Steam Lite
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm text-gray-500 hover:text-gray-900">Home</Link>
          <Link to="/search" className="text-sm text-gray-500 hover:text-gray-900">Search</Link>
          <Link to="/login" className="text-sm font-medium text-blue-600 hover:text-blue-800">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;