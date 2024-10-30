import Header from "../components/Header";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import { Divider, Input, Button } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Form, Link, redirect, useActionData, useNavigate } from "react-router-dom";
import { MailIcon } from "../assets/MailIcon";
import { UserIcon } from "../assets/UserIcon";
import { EyeFilledIcon, EyeSlashFilledIcon } from "../assets/EyeIconsPassword";
import { useRedirectIfAuthenticated } from "../hooks/checkAuthHooks";
const validatePassword = (password, passwordConfirm) => {
  const errors = [];
  if (password.length < 8 || password.length > 15)
    errors.push("Password must range between 8 and 15 characters");
  // if (!password.search(/(%|_|#)/))
  //   errors.push("Password must include a special character like %, _, #");
  if (password !== passwordConfirm) errors.push("Passwords must match");
  return [...errors];
};

const SignUpPage = () => {
  // const authState = useSelector((state) => state.auth);
  const authState = useRedirectIfAuthenticated();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [eyeIconVisible, setEyeIconVisible] = useState({ password: false, passwordConfirm: false });
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => setError(""), 8000);
      return () => clearTimeout(timeout);
    }
  }, [error]);

  // useEffect(() => {
  //   if (authState.isAuthenticated) navigate("/");
  // });

  const toggleEyeIconVisibility = (key) => {
    setEyeIconVisible((prev) => {
      // console.log(key, prev[key]);
      return { ...prev, [key]: !prev[key] };
    });
  };
  const handleSignUpForm = async (e) => {
    setIsLoading(true);
    setError("");
    e.preventDefault();
    const formData = new FormData(e.target);
    console.log(formData);
    for (const [name, value] of formData) {
      console.log(name, value);
    }

    const formDataObj = Object.fromEntries(formData);
    const errors = validatePassword(formDataObj.password, formDataObj.passwordConfirm);
    console.log(errors);

    if (errors.length > 0) {
      setIsLoading(false);
      setError(errors.join(". "));
      return;
    }

    // NOTE: Rest of the validations happen on the server-side
    const response = await fetch("http://localhost:3000/signup", {
      method: "POST", // POST
      body: JSON.stringify(formDataObj),
      headers: { "Content-Type": "application/json" },
    });
    console.log(response);

    const data = await response.json();
    console.log(data);
    // Now we're ready to show the output instead of Loading text
    setTimeout(async () => {
      // NOTE: Set a timer of 1.5 seconds here, if you want the loading alert to persist for sometime
      setIsLoading(false);
      if (data.status !== "success") {
        setError(data.message);
        return;
      }
      setError("");

      navigate("/log-in", { state: { message: "Sign Up successful" } });
    }, 1000);
  };
  return (
    <>
      <Header />
      <main className="h-[80vh] flex justify-center items-center">
        <Card className="w-[95%] md:w-1/2 mx-auto" isBlurred>
          <CardHeader className="flex-col justify-center pt-10 px-20 gap-4">
            <h1 className="text-4xl">Sign Up</h1>
            {error && (
              <div className="bg-danger rounded py-2 px-4">
                <p>{error}</p>
              </div>
            )}
            {isLoading && (
              <div className="bg-primary rounded py-2 px-4">
                <p>Validating! Please wait</p>
              </div>
            )}
          </CardHeader>
          <Form method="POST" onSubmit={handleSignUpForm}>
            <CardBody className="px-20 gap-6 justify-center ">
              <Input
                type="email"
                name="email"
                label="Email"
                endContent={
                  <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0 m-auto" />
                }
                required
              ></Input>
              <Input
                type="username"
                name="username"
                label="User Name"
                endContent={<UserIcon className="m-auto" />}
                required
              ></Input>
              <Input
                type="name"
                name="name"
                label="Name (First Name and Last Name)"
                required
              ></Input>
              <Input
                type={eyeIconVisible.password ? "text" : "password"}
                name="password"
                label="Password"
                endContent={
                  <button
                    className="focus:outline-none m-auto"
                    type="button"
                    onClick={(e) => toggleEyeIconVisibility("password")}
                    aria-label="toggle password visibility"
                  >
                    {eyeIconVisible.password ? (
                      <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
                required
              ></Input>
              <Input
                type={eyeIconVisible.passwordConfirm ? "text" : "password"}
                name="passwordConfirm"
                label="Confirm Password"
                endContent={
                  <button
                    className="focus:outline-none m-auto"
                    type="button"
                    onClick={(e) => toggleEyeIconVisibility("passwordConfirm")}
                    aria-label="toggle password visibility"
                  >
                    {eyeIconVisible.passwordConfirm ? (
                      <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
                required
              ></Input>
              <div className="flex flex-row justify-center gap-8">
                <Button type="reset" color="danger">
                  Reset
                </Button>
                <Button type="submit" color="primary">
                  Sign Up
                </Button>
              </div>
            </CardBody>
          </Form>
          <CardFooter className="justify-center">
            <p>
              Already a member?{" "}
              <Link to="/log-in" className="text-blue-500">
                Log In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
    </>
  );
};

// export const action = async ({ request, params }) => {
// const navigate = useNavigate();
// console.log("Request: ", request);
// console.log("Params: ", params);

// const formData = await request.formData();
// console.log(formData);
// for (const [name, value] of formData) {
//   console.log(name, value);
// }

// const formDataObj = Object.fromEntries(formData);
// const response = await fetch("http://localhost:3000/signup", {
//   method: request.method, // POST
//   body: JSON.stringify(formDataObj),
//   headers: { "Content-Type": "application/json" },
// });
// console.log(response);

// const data = await response.json();
// console.log(data);
// if (data.status !== "success") {
//   return data;
// }
// return redirect("/log-in");
// return navigate("/log-in", { message: "Logged In successfully" });
// };
export default SignUpPage;
