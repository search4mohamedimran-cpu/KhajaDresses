import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./components/pages/Home";
import { Login } from "./components/pages/Login";
import { Uniforms } from "./components/pages/Uniforms";
import { Search } from "./components/pages/Search";
import { Feedback } from "./components/pages/Feedback";
import { Contact } from "./components/pages/Contact";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "login", Component: Login },
      { path: "uniforms", Component: Uniforms },
      { path: "search", Component: Search },
      { path: "feedback", Component: Feedback },
      { path: "contact", Component: Contact },
    ],
  },
]);
