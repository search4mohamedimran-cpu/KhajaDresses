import { createBrowserRouter, useOutletContext } from "react-router";
import { Layout } from "./components/Layout";
import { SinglePageContainer } from "./components/pages/SinglePageContainer";
import { Uniforms } from "./components/pages/Uniforms";
import { Search } from "./components/pages/Search";
import { Feedback } from "./components/pages/Feedback";
import { Contact } from "./components/pages/Contact";
import { Cart } from "./components/pages/Cart";
import { Login } from "./components/pages/Login";

function SinglePageWrapper() {
  const context = useOutletContext<{ openAuth: () => void; openCart: () => void }>() || {
    openAuth: () => {},
    openCart: () => {},
  };
  return <SinglePageContainer onOpenAuth={context.openAuth} onOpenCart={context.openCart} />;
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: SinglePageWrapper },
      { path: "uniforms", Component: Uniforms },
      { path: "search", Component: Search },
      { path: "feedback", Component: Feedback },
      { path: "contact", Component: Contact },
      { path: "cart", Component: Cart },
      { path: "login", Component: Login },
      { path: "*", Component: SinglePageWrapper },
    ],
  },
]);
