import Header from "../components/Header";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import { Input, Button } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { Form, Link, useNavigate } from "react-router-dom";
import { MailIcon } from "../assets/MailIcon";
import { EyeFilledIcon, EyeSlashFilledIcon } from "../assets/EyeIconsPassword";
import { useRedirectIfAuthenticated } from "../hooks/checkAuthHooks";

const ForgotPasswordPage = () => {
  const authState = useRedirectIfAuthenticated();
  //   const dispatch = useDispatch();
  const navigate = useNavigate();
  const [uiElements, setUIElements] = useState({
    loading: false,
    error: "",
    message: "",
  });

  const [tokenState, setTokenState] = useState({ tokenMsg: "", tokenSent: false });
  const [eyeIconVisible, setEyeIconVisible] = useState({
    token: false,
    password: false,
  });
  const toggleEyeIconVisibility = (key) => {
    setEyeIconVisible((prev) => {
      // console.log(key, prev[key]);
      return { ...prev, [key]: !prev[key] };
    });
  };

  const setTimeNotification = ({ message = "", error = "", tokenMsg = "" }, seconds = 3) => {
    setTimeout(() => {
      setUIElements({ loading: false, message, error, tokenMsg });
    }, seconds * 1000);
  };

  const getTokenMail = async (e) => {
    setTokenState({ tokenMsg: "Trying to mail your token", tokenSent: false });
    e.preventDefault();
    const formData = new FormData(e.target);
    // for (const [name, value] of formData) {
    //   console.log(name, value);
    // }
    const formDataObj = Object.fromEntries(formData);
    console.log(formDataObj);

    try {
      const response = await fetch("http://localhost:3000/api/generate-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formDataObj), // consists only of email
        // credentials: "include"
      });
      const data = await response.json();
      if (!response.ok || data.status === "fail") {
        setTimeNotification({ error: data.message }, 2);
        return;
      }
      setTokenState({ tokenSent: true, tokenMsg: data.message }, 2);
      //   emailPersisted = formDataObj.email;
    } catch (err) {
      setTimeNotification({ error: "No Internet Connection!" }, 2);
    }
  };
  const handlePasswordReset = async (e) => {
    setUIElements({ loading: true, message: "", error: "", tokenMsg: "" });
    e.preventDefault();
    const formData = new FormData(e.target);
    // for (const [name, value] of formData) {
    //   console.log(name, value);
    // }
    const formDataObj = Object.fromEntries(formData);
    // formDataObj.email = emailPersisted;
    console.log(formDataObj);

    try {
      const response = await fetch("http://localhost:3000/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formDataObj),
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok || data.status === "fail") {
        setTimeNotification({ error: data.message }, 2);
        return;
      }
      //   dispatch(authActions.updateUser({ user: data.user })); // No need as we are not storing password in
      // client state
      // Finally, when successful:
      setTimeNotification({ message: data.message }, 2);
      navigate("/log-in", { state: { message: "Password Changed Successfully" } });
    } catch (err) {
      setTimeNotification({ error: "No Internet Connection!" }, 2);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      if (uiElements.message || uiElements.error)
        setUIElements((prev) => ({ ...prev, message: "", error: "" }));
    }, 4000);
    setTimeout(() => {
      if (tokenState.tokenSent && tokenState.tokenMsg)
        setTokenState((prev) => ({ ...prev, tokenMsg: "" }));
    }, 8000);
  }, [uiElements, tokenState]);

  return (
    <>
      <Header />
      <main className="h-[80vh] flex justify-center items-center">
        <Card className="w-[95%] md:w-1/2 mx-auto" isBlurred>
          <CardHeader className="flex-col justify-center pt-10 px-20 gap-4">
            <h1 className="text-4xl">Forgot Password</h1>
            {uiElements.loading && (
              <div className="bg-primary rounded py-2 px-4">
                <p>Saving! Please wait</p>
              </div>
            )}
            {uiElements.error && (
              <div className="bg-danger rounded py-2 px-4">
                <p>{uiElements.error}</p>
              </div>
            )}
            {uiElements.message && (
              <div className="bg-success rounded py-2 px-4">
                <p>{uiElements.message}</p>
              </div>
            )}
            {tokenState.tokenMsg && <h3 className="text-lg text-center">{tokenState.tokenMsg}</h3>}{" "}
          </CardHeader>
          {!tokenState.tokenSent ? (
            <Form onSubmit={getTokenMail}>
              <CardBody className="px-20 gap-3 justify-center">
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
                <div className="flex flex-row justify-center gap-8 pt-2">
                  <Button type="submit" color="success" isDisabled={tokenState.tokenMsg !== ""}>
                    Get Token
                  </Button>
                </div>
              </CardBody>
            </Form>
          ) : (
            <Form onSubmit={handlePasswordReset}>
              <CardBody className="px-20 gap-3 justify-center">
                {/* <Form action="/login" method="POST"> */}

                <Input
                  type={eyeIconVisible.token ? "text" : "password"}
                  name="token"
                  label="Password Reset Token"
                  labelPlacement="outside"
                  size="lg"
                  endContent={
                    <button
                      className="focus:outline-none m-auto"
                      type="button"
                      onClick={(e) => toggleEyeIconVisibility("token")}
                      aria-label="toggle password visibility"
                    >
                      {eyeIconVisible.token ? (
                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                  required
                ></Input>

                <Input
                  type={eyeIconVisible.password ? "text" : "password"}
                  name="password"
                  label="New Password"
                  labelPlacement="outside"
                  size="lg"
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
                <div className="flex flex-row justify-center gap-8 pt-2">
                  <Button type="submit" color="primary">
                    Change Password
                  </Button>
                </div>
              </CardBody>
            </Form>
          )}
          <CardFooter className="justify-center text-center">
            <div className="my-1 flex flex-col gap-2">
              <p>
                Back to{" "}
                <Link to="/log-in" className="text-blue-500">
                  Login
                </Link>
              </p>
              <p className="">
                Not a member yet?{" "}
                <Link to="/sign-up" className="text-blue-500">
                  Sign Up
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      </main>
    </>
  );
};

export default ForgotPasswordPage;
