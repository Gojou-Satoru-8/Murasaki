import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ThemeProvider as NextThemesProvider } from "next-themes"; // For setting theme dynamically
// import { Provider } from "react-redux";
// import store from "./store";
// import useCheckAuth from "./hooks/useCheckAuth";
import Root from "./pages/RootLayout";
import HomePage from "./pages/HomePage";
import NotePage from "./pages/NotePage";
import NewNotePage from "./pages/NewNotePage";
import ErrorPage from "./pages/ErrorPage";
import RegisterPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { authActions } from "./store";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      { path: "/notes/:id", element: <NotePage /> },
      {
        path: "/new-note",
        element: <NewNotePage />,
      },
    ],
  },
  {
    path: "/sign-up",
    element: <RegisterPage />,
    // action: signupAction,
  },
  {
    path: "/log-in",
    element: <LoginPage />,
    errorElement: <ErrorPage />,
    // action: loginAction,
  },
]);

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:3000/current-user", {
          credentials: "include",
        });
        const data = await response.json();
        console.log(data);

        // Set redux store based on whether a user was present in server-session or not.
        if (!data.user) dispatch(authActions.logout());
        else dispatch(authActions.login({ user: data.user }));
      } catch (err) {
        console.log("Auth Check failed", err.message);
        dispatch(authActions.logout());
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [dispatch]);
  // useCheckAuth();
  if (loading) return <div>Loading</div>;
  return (
    <NextThemesProvider attribute="class" defaultTheme="light">
      <RouterProvider router={router} />
    </NextThemesProvider>
  );
}

export default App;
