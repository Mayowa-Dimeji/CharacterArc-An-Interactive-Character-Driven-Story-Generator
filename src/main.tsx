import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import "./output.css";
import App from "./App";
import CreateCharacter from "./pages/CreateCharacter";
import { CharacterProvider } from "./CharacterContext";

import Play from "./pages/Play";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <CreateCharacter /> },
      { path: "create", element: <CreateCharacter /> },
      { path: "play", element: <Play /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CharacterProvider>
      <RouterProvider router={router} />
    </CharacterProvider>
  </React.StrictMode>
);
