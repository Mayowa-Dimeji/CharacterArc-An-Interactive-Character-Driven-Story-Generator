import { Outlet, Link, useLocation } from "react-router-dom";

export default function App() {
  const { pathname } = useLocation();
  return (
    <div>
      <header className="border-b">
        <div className="container flex items-center justify-between p-4">
          <div className="text-2xl font-bold py-4">
            <Link to="/" className="font-semibold ">
              CharacterArc
            </Link>
          </div>
          <nav className="flex gap-4 text-md">
            <Link
              to="/create"
              className={
                pathname.startsWith("/create") || pathname === "/"
                  ? "font-semibold"
                  : ""
              }
            >
              Create
            </Link>
            <Link
              to="/play"
              className={pathname.startsWith("/play") ? "font-semibold" : ""}
            >
              Play
            </Link>
          </nav>
        </div>
      </header>
      <main className="container py-6 px-4">
        <Outlet />
      </main>
      <footer className="border-t">
        <div className="container text-sm py-4 text-gray-500">
          © {new Date().getFullYear()} CharacterArc
        </div>
      </footer>
    </div>
  );
}
