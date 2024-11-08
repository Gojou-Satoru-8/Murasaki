import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Card, CardHeader, CardBody, CardFooter, Tabs, Tab } from "@nextui-org/react";
import Header from "../components/Header";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import { useRedirectIfAuthenticated } from "../hooks/checkAuthHooks";

const LoginPage = () => {
  const location = useLocation();
  // console.log("Location/Navigation messages: ", location.state);
  const navigateMessage = location.state?.message;
  // Messages coming from navigate("/login", {state: {message: "..."}})
  // Such as sign up successful message from signup page, or logged out message when cookie expires

  const [uiElements, setUIElements] = useState({
    loading: false,
    message: navigateMessage || "",
    error: "",
  });

  const [selectedForm, setSelectedForm] = useState("Log In");

  // NOTE: Following logic moved to checkAuthHooks.jsx:
  // const authState = useSelector((state) => state.auth);
  // // console.log(authState);
  // useEffect(() => {
  //   if (authState.isAuthenticated) navigate("/");
  // });
  const authState = useRedirectIfAuthenticated();

  const setTimeNotification = ({ loading = false, message = "", error = "" }, seconds = 0) => {
    // To be called exclusively, i.e either message or error, so as to set one of them, discarding the other.
    // Also discards the loading banner.
    const timeout = setTimeout(() => {
      setUIElements({ loading, message, error });
    }, seconds * 1000);
    return timeout;
  };

  useEffect(() => {
    // Clearing message or error banners
    if (uiElements.message || uiElements.error) {
      const timeout = setTimeNotification({}, 5);
      return () => clearTimeout(timeout);
    }
  }, [uiElements.message, uiElements.error]);

  return (
    <>
      <Header />
      <main className="h-[80vh]">
        <Card className="w-[95%] md:w-2/3 lg:w-1/2 mx-auto mt-8" isBlurred>
          <CardHeader className="flex-col justify-center pt-10 px-20 gap-4">
            <h1 className="text-4xl">{selectedForm}</h1>
            {uiElements.loading && (
              <div className="bg-primary rounded py-2 px-4">
                <p>Validating... Please wait!</p>
              </div>
            )}
            {uiElements.message && (
              <div className="bg-success rounded py-2 px-4">
                <p>{uiElements.message}</p>
              </div>
            )}
            {uiElements.error && (
              <div className="bg-danger rounded py-2 px-4">
                <p>{uiElements.error}</p>
              </div>
            )}
          </CardHeader>

          <CardBody className="px-10 lg:px-20 justify-center">
            <Tabs
              fullWidth
              size="lg"
              aria-label="Tabs form"
              selectedKey={selectedForm}
              onSelectionChange={setSelectedForm}
            >
              <Tab key="Log In" title="Log In">
                <LoginForm
                  setUIElements={setUIElements}
                  setTimeNotification={setTimeNotification}
                />
              </Tab>
              <Tab key="Sign Up" title="Sign Up">
                <SignupForm
                  setUIElements={setUIElements}
                  setTimeNotification={setTimeNotification}
                  setSelectedForm={setSelectedForm}
                />
              </Tab>
            </Tabs>
          </CardBody>
          <CardFooter className="justify-center text-center">
            <div className="my-1 flex flex-col gap-2">
              {selectedForm === "Log In" && (
                <p>
                  Forgot Password? Reset it{" "}
                  <Link to="/forgot-password" className="text-blue-500">
                    Here
                  </Link>
                </p>
              )}
            </div>
          </CardFooter>
        </Card>
      </main>
    </>
  );
};

// export const action = async ({ request, params }) => {
//   console.log("Request: ", request);
//   console.log("Params: ", params);
//   const formData = await request.formData();
//   console.log(formData);
//   for (const [name, value] of formData) {
//     console.log(name, value);
//   }

//   const formDataObj = Object.fromEntries(formData);
//   const response = await fetch("http://localhost:3000/api/login", {
//     method: request.method, // POST
//     body: JSON.stringify(formDataObj),
//     headers: { "Content-Type": "application/json" },
//   });
//   console.log(response);

//   const data = await response.json();
//   console.log(data);
//   if (data.status !== "success") {
//     return data;
//   }
//   return redirect("/");
// };

export default LoginPage;
