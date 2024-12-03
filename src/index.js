import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/css/index.css";
import App from "./App";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import LoginProvider from "./providers/LoginProvider";
import WarningProvider from "./providers/WarningProvider";
import LoadingProvider from "./providers/LoadingProvider";
import GlobalContainer from "./components/global/GlobalContainer";
import Page_Catalog from "./pages/Catalog";
import Page_NotFound from "./pages/404";
import Page_Auth from "./pages/Auth";
import Page_Order from "./pages/Order";
import Page_Customers from "./pages/Customers";
import Page_Supplier from "./pages/Suppliers";
import Page_Users from "./pages/Users";

// Definisi route aplikasi
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Outlet />,
        children: [
          {
            path: "/",
            element: <Page_Catalog />,
          },
          {
            path: "/pemesanan",
            element: <Page_Order />,
          },
          {
            path: "/customer",
            element: <Page_Customers />,
          },
          {
            path: "/supplier",
            element: <Page_Supplier />,
          },
          {
            path: "/users",
            element: <Page_Users />,
          },
        ],
      },
    ],
  },
  {
    path: "/auth",
    element: <Page_Auth />,
  },
  {
    path: "*",
    element: <Page_NotFound />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // Penambahan provider dan root aplikasi
  <React.StrictMode>
    <LoginProvider>
      <WarningProvider>
        <LoadingProvider>
          <RouterProvider router={router} />

          <GlobalContainer />
        </LoadingProvider>
      </WarningProvider>
    </LoginProvider>
  </React.StrictMode>
);
