import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useRedirectIfNotAuthenticated } from "../hooks/checkAuthHooks";
import usePopulateNotes from "../hooks/notesHooks";
const RootLayout = () => {
  const authState = useRedirectIfNotAuthenticated();

  return (
    <>
      <Header />
      <Outlet context={authState} />
      <Footer />
    </>
  );
};

export default RootLayout;
