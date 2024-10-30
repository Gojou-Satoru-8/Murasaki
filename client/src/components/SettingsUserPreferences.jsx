import { Form } from "react-router-dom";
import { Input, Card, CardHeader, CardBody, Button } from "@nextui-org/react";
import { MailIcon } from "../assets/MailIcon";
import { UserIcon } from "../assets/UserIcon";
import { EyeFilledIcon, EyeSlashFilledIcon } from "../assets/EyeIconsPassword";
import { useState } from "react";
import { useSelector } from "react-redux";

const SettingsPreferences = () => {
  const [eyeIconVisible, setEyeIconVisible] = useState(false);
  const authState = useSelector((state) => state.auth);
  console.log("Account Settings Page:", authState);

  const toggleEyeIconVisibility = () => setEyeIconVisible((prev) => !prev);
  return (
    <div className="my-10">
      {/* <h2 className="text-2xl text-center">Account Settings</h2> */}
      <Card>
        <CardHeader className="flex-col justify-center pt-10 px-20 gap-4">
          <h3 className="text-2xl">User Settings</h3>
          {/* {error && (
        <div className="bg-danger rounded py-2 px-4">
          <p>{error}</p>
        </div>
      )}
      {isLoading && (
        <div className="bg-primary rounded py-2 px-4">
          <p>Validating! Please wait</p>
        </div>
      )} */}
        </CardHeader>
        <Form method="POST" onSubmit={() => {}}>
          <CardBody className="px-20 gap-3 justify-center">
            <Input
              type="email"
              name="email"
              label="Email"
              labelPlacement="outside"
              value={authState.user.email}
              endContent={
                <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0 m-auto" />
              }
              required
            ></Input>
            <Input
              type="username"
              name="username"
              label="User Name"
              labelPlacement="outside"
              value={authState.user.username}
              endContent={<UserIcon className="m-auto" />}
              required
            ></Input>
            <Input
              type="name"
              name="name"
              label="Name (First Name and Last Name)"
              labelPlacement="outside"
              value={authState.user.name}
              required
            ></Input>
            <Input
              type={eyeIconVisible.password ? "text" : "password"}
              name="password"
              label="Password"
              labelPlacement="outside"
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
              labelPlacement="outside"
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
                Update
              </Button>
            </div>
          </CardBody>
        </Form>
      </Card>
    </div>
  );
};

export default SettingsPreferences;
