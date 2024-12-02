import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/css/index.css";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginProvider from "./providers/LoginProvider";
import WarningProvider from "./providers/WarningProvider";
import LoadingProvider from "./providers/LoadingProvider";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <LoginProvider>
      <WarningProvider>
        <LoadingProvider>
          <RouterProvider router={router} />
        </LoadingProvider>
      </WarningProvider>
    </LoginProvider>
  </React.StrictMode>
);
