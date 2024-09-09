import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ThemeProvider as NextThemesProvider } from "next-themes"; // For setting theme dynamically
import Root from "./pages/RootLayout";
import HomePage from "./pages/HomePage";
import NewNotePage from "./pages/NewNotePage";
import ErrorPage from "./pages/ErrorPage";
import RegisterPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";

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
  return (
    <NextThemesProvider attribute="class" defaultTheme="light">
      <RouterProvider router={router} />
    </NextThemesProvider>
  );
}

export default App;
