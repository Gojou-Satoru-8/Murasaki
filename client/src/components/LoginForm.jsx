import { useState } from "react";
import { useNavigate, Form } from "react-router-dom";
import { Input, Button } from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { MailIcon } from "../assets/MailIcon";
import { EyeFilledIcon, EyeSlashFilledIcon } from "../assets/EyeIconsPassword";
import { authActions } from "../store";

const LoginForm = ({ setUIElements, setTimeNotification }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [eyeIconVisible, setEyeIconVisible] = useState(false);
  const toggleEyeIconVisibility = () => setEyeIconVisible((prev) => !prev);
  const handleLoginForm = async (e) => {
    // setUIElements({ loading: true, message: "", error: "" });
    setTimeNotification({ loading: true });

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
      console.log(response);

      const data = await response.json();
      console.log(data);
      // Now we're ready to show the output instead of Loading text
      if (!response.ok || data.status !== "success") {
        setTimeNotification({ error: data.message }, 1.5);
        return;
      }

      setTimeNotification({ message: data.message }, 1.5);
      dispatch(authActions.setUser({ user: data.user }));
      //   setTimeout(() => navigate("/"), 3000); // Optional, authActions.setUser triggers a re-render, redirects to /
    } catch (err) {
      console.log(err.message);
      setTimeNotification({ error: "No Internet Connection" });
    }
  };

  return (
    <Form method="POST" onSubmit={handleLoginForm} className="flex flex-col gap-4 my-2">
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
      <div className="flex flex-row justify-center gap-8 pt-4">
        <Button type="reset" color="danger">
          Reset
        </Button>
        <Button type="submit" color="primary">
          Log In
        </Button>
      </div>
    </Form>
  );
};

export default LoginForm;
