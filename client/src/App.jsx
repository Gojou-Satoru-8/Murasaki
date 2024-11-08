import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"; // For setting theme dynamically
// import { Provider } from "react-redux";
// import store from "./store";
import useGetCurrentUser from "./hooks/useGetCurrentUser";
import Root from "./pages/RootLayout";
import HomePage from "./pages/HomePage";
import NotePage from "./pages/NotePage";
// import NewNotePage from "./pages/NewNotePage";
import ErrorPage from "./pages/ErrorPage";
import RegisterPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/Settings";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useState, useEffect } from "react";
// import { authActions } from "./store";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />, // Catches all non-existent routes
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      { path: "/notes/:id", element: <NotePage /> },
      {
        path: "/new-note",
        element: <NotePage isNew />,
      },
      {
        path: "/settings",
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: "/sign-up",
    element: <RegisterPage />,
    // errorElement: <ErrorPage />,
    // action: signupAction,
  },
  {
    path: "/login",
    element: <LoginPage />,
    // errorElement: <ErrorPage />,
    // action: loginAction,
  },
  {
    path: "forgot-password",
    element: <ForgotPasswordPage />,
  },
]);

function App() {
  // NOTE: Logic involving getting logged in user from server session, and setting it in redux authState
  // has been moved to customhook below

  const authState = useGetCurrentUser();
  const { setTheme } = useTheme(); // Now this works because it's inside NextThemesProvider

  useEffect(() => {
    if (authState.user?.settings?.uiTheme) {
      setTheme(authState.user.settings.uiTheme);
    }
  }, [authState.user?.settings?.uiTheme, setTheme]);

  if (authState.loading) return <div>Loading</div>;
  console.log(authState.user?.settings);

  return <RouterProvider router={router} />;
}

export default App;
