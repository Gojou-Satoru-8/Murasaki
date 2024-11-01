import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Form, Link, useLocation, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import { Input, Button } from "@nextui-org/react";
import Header from "../components/Header";
import { MailIcon } from "../assets/MailIcon";
import { EyeSlashFilledIcon, EyeFilledIcon } from "../assets/EyeIconsPassword";

import { authActions } from "../store";
import { useRedirectIfAuthenticated } from "../hooks/checkAuthHooks";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const location = useLocation();
  // console.log("Location/Navigation messages: ", location.state);
  const signUpSuccessfulMessage = location.state?.message; // For sign up successful message from signup page

  const [message, setMessage] = useState(signUpSuccessfulMessage || "");
  const [isLoading, setIsLoading] = useState(false);
  const [eyeIconVisible, setEyeIconVisible] = useState(false);
  // On first load, there won't be any error, only sign up successful message
  // But on subsequent rerenders, when errors will be there, we shall show the errors only

  // NOTE: Following logic moved to checkAuthHooks.jsx:
  // const authState = useSelector((state) => state.auth);
  // // console.log(authState);
  // useEffect(() => {
  //   if (authState.isAuthenticated) navigate("/");
  // });
  const authState = useRedirectIfAuthenticated();

  useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => setMessage(""), 8000);
      return () => clearTimeout(timeout);
    }
  }, [message]);

  const toggleEyeIconVisibility = () => setEyeIconVisible((prev) => !prev);
  const handleLoginForm = async (e) => {
    setIsLoading(true);
    setMessage("");

    e.preventDefault();
    const formData = new FormData(e.target);
    // console.log(formData);
    // for (const [name, value] of formData) {
    //   console.log(name, value);
    // }

    const formDataObj = Object.fromEntries(formData);
    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST", // POST
        body: JSON.stringify(formDataObj),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      // console.log(response);

      const data = await response.json();

      // console.log(data);
      // Now we're ready to show the output instead of Loading text
      setTimeout(() => {
        // NOTE: Set a timer of 1.5 seconds here, if you want the loading alert to persist for sometime
        setIsLoading(false);
        setMessage(data.message);
        // Expected Responses with messages:
        // Status: 200 (Logged in Successfully), 401 (Incorrect password), 404 (No such user with the email)
        // if (data.status !== "success") return;
        if (response.status !== 200) return;

        dispatch(authActions.setUser({ user: data.user }));
        setTimeout(() => navigate("/"), 1000);
      }, 1500);
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <>
      <Header />
      <main className="h-[80vh] flex justify-center items-center">
        <Card className="w-[95%] md:w-1/2 mx-auto" isBlurred>
          <CardHeader className="flex-col justify-center pt-10 px-20 gap-4">
            <h1 className="text-4xl">Log In</h1>
            {isLoading && (
              <div className="bg-primary rounded py-2 px-4">
                <p>Validating... Please wait!</p>
              </div>
            )}
            {message && (
              <div className="bg-primary rounded py-2 px-4">
                <p>{message}</p>
              </div>
            )}
          </CardHeader>
          {/* <Form action="/login" method="POST"> */}
          <Form method="POST" onSubmit={handleLoginForm}>
            <CardBody className="px-20 gap-3 justify-center ">
              <Input
                type="email"
                name="email"
                label="Email"
                labelPlacement="outside"
                size="lg"
                endContent={
                  <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0 m-auto" />
                }
                required
              ></Input>
              <Input
                type={eyeIconVisible ? "text" : "password"}
                name="password"
                label="Password"
                labelPlacement="outside"
                size="lg"
                endContent={
                  <button
                    className="focus:outline-none m-auto"
                    type="button"
                    onClick={toggleEyeIconVisibility}
                    aria-label="toggle password visibility"
                  >
                    {eyeIconVisible ? (
                      <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
                required
              ></Input>
              <div className="flex flex-row justify-center gap-8 pt-2">
                <Button type="reset" color="danger">
                  Reset
                </Button>
                <Button type="submit" color="primary">
                  Log In
                </Button>
              </div>
            </CardBody>
          </Form>
          <CardFooter className="justify-center text-center">
            <div className="my-1 flex flex-col gap-2">
              <p className="">
                Not a member yet?{" "}
                <Link to="/sign-up" className="text-blue-500">
                  Sign Up
                </Link>
              </p>
              <p>
                Forgot Password? Reset it{" "}
                <Link to="/forgot-password" className="text-blue-500">
                  Here
                </Link>
              </p>
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
