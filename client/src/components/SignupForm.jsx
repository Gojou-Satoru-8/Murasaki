import { useState } from "react";
import { Form } from "react-router-dom";
import { Input, Button } from "@nextui-org/react";
import { MailIcon } from "../assets/MailIcon";
import { UserIcon } from "../assets/UserIcon";
import { EyeFilledIcon, EyeSlashFilledIcon } from "../assets/EyeIconsPassword";

const validatePassword = (password, passwordConfirm) => {
  const errors = [];
  if (password.length < 8 || password.length > 15)
    errors.push("Password must range between 8 and 15 characters");
  // if (!password.search(/(%|_|#)/))
  //   errors.push("Password must include a special character like %, _, #");
  if (password !== passwordConfirm) errors.push("Passwords must match");
  return [...errors];
};

const SignupForm = ({ setUIElements, setTimeNotification, setSelectedForm }) => {
  const [eyeIconVisible, setEyeIconVisible] = useState({ password: false, passwordConfirm: false });
  const toggleEyeIconVisibility = (key) => {
    setEyeIconVisible((prev) => {
      // console.log(key, prev[key]);
      return { ...prev, [key]: !prev[key] };
    });
  };
  const handleSignUpForm = async (e) => {
    // setUIElements({ loading: true, message: "", error: "" });
    setTimeNotification({ loading: true });
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
      //   setIsLoading(false);
      //   setError(errors.join(". "));
      setTimeNotification({ error: errors.join(". ") });
      return;
    }

    // NOTE: Rest of the validations happen on the server-side
    try {
      const response = await fetch("http://localhost:3000/api/signup", {
        method: "POST", // POST
        body: JSON.stringify(formDataObj),
        headers: { "Content-Type": "application/json" },
      });
      console.log(response);

      const data = await response.json();
      console.log(data);
      // Now we're ready to show the output instead of Loading text
      if (!response.ok || data.status !== "success") {
        setTimeNotification({ error: data.message }, 1.5);
        return;
      }

      setTimeout(() => {
        setTimeNotification({ message: data.message });
        setSelectedForm("Log In");
      }, 1500);
    } catch (err) {
      console.log(err);
      setTimeNotification({ error: "No Internet Connection" });
    }
  };
  return (
    <Form method="POST" onSubmit={handleSignUpForm} className="flex flex-col gap-4 my-2">
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
      <Input type="name" name="name" label="Name (First Name and Last Name)" required></Input>
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
      <div className="flex flex-row justify-center gap-8 pt-4">
        <Button type="reset" color="danger">
          Reset
        </Button>
        <Button type="submit" color="primary">
          Sign Up
        </Button>
      </div>
    </Form>
  );
};

export default SignupForm;
