import {
  Input,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Avatar,
  Divider,
} from "@nextui-org/react";
import { MailIcon } from "../assets/MailIcon";
import { UserIcon } from "../assets/UserIcon";
import { EyeFilledIcon, EyeSlashFilledIcon } from "../assets/EyeIconsPassword";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChangePasswordModalButton from "./ChangePasswordModalButton";
import { useNavigate } from "react-router-dom";
import { authActions } from "../store";
import { notesActions } from "../store";

const SettingsAccount = () => {
  // const [eyeIconVisible, setEyeIconVisible] = useState(false);
  const authState = useSelector((state) => state.auth);
  console.log("Account Settings Page:", authState);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(false);
  const [error, setError] = useState("");
  const [userInfo, setUserInfo] = useState({
    email: authState.user?.email,
    username: authState.user?.username,
    name: authState.user?.name,
  });

  console.log("User Info:", userInfo);

  const handleChangeInfo = (e) => {
    setUserInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCancelUpdate = (e) => {
    setUserInfo({
      email: authState.user?.email,
      username: authState.user?.username,
      name: authState.user?.name,
    });
    setIsEditing(false);
  };
  const setTimeNotification = ({ message = "", error = "" }, seconds = 3) => {
    setTimeout(() => {
      setIsLoading(false);
      setMessage(message);
      setError(error);
      setIsEditing(false);
    }, seconds * 1000);
  };
  const handleUpdateUserInfo = async (e) => {
    setIsLoading(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("http://localhost:3000/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: userInfo.username, name: userInfo.name }),
        credentials: "include",
      });

      console.log(response);
      if (response.status === 401) {
        dispatch(authActions.unsetUser());
        // dispatch(notesActions.setNotes({ notes: [] }));
        dispatch(notesActions.clearAll());
        navigate("/log-in", { state: { message: "Time Out! Please log-in again" } });
        return;
      }

      const data = await response.json();
      console.log("Data: ", data);
      if (!response.ok || data.status === "fail") {
        setTimeNotification({ error: data.message }, 2);
        return;
      }
      dispatch(authActions.updateUser({ user: data.user }));

      setTimeNotification({ message: data.message }, 2);
    } catch (err) {
      console.log("Unable to update user-info: ", err.message);
      setTimeNotification({ error: "No Internet Connection!" }, 2);
    }
  };
  useEffect(() => {
    // Success or Error Messages are removed after 2 seconds.
    setTimeout(() => {
      if (error) setError("");
      if (message) setMessage("");
    }, 4000);
  }, [error, message]);
  // const toggleEyeIconVisibility = () => setEyeIconVisible((prev) => !prev);
  return (
    <div className="mt-10 sm:w-5/6 lg:w-2/3 m-auto">
      {/* <h2 className="text-2xl text-center">Account Settings</h2> */}
      <Card>
        <CardHeader className="flex-col justify-center pt-10 px-20 gap-4 text-center">
          {!isEditing && (
            <>
              <Avatar
                size="lg"
                // isBordered
                // color="secondary"
                // showFallback
                // src=""
                // name={authState.user.name}
              ></Avatar>
              <h3 className="text-3xl text-center">{authState.user?.name}</h3>
            </>
          )}

          {isLoading && (
            <div className="bg-primary rounded py-2 px-4">
              <p>Saving! Please wait</p>
            </div>
          )}
          {error && (
            <div className="bg-danger rounded py-2 px-4">
              <p>{error}</p>
            </div>
          )}
          {message && (
            <div className="bg-success rounded py-2 px-4">
              <p>{message}</p>
            </div>
          )}
        </CardHeader>
        <CardBody className="px-10 gap-5 justify-center">
          {/* <h3 className="text-xl text-center">Account Settings</h3> */}
          <Input
            type="email"
            name="email"
            label="Email"
            labelPlacement="outside"
            value={userInfo.email}
            onChange={handleChangeInfo}
            readOnly
            isDisabled={isEditing} // readOnly means non-editable, isDisabled is non-editable and faded
            // variant="underlined"
            classNames={{ input: "text-center" }}
            startContent={
              <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0 m-auto" />
            }
            required
          ></Input>
          <Input
            type="username"
            name="username"
            label="User Name"
            labelPlacement="outside"
            value={userInfo.username}
            onChange={handleChangeInfo}
            // isDisabled
            readOnly={!isEditing}
            isDisabled={isLoading}
            // variant="underlined"
            classNames={{ input: "text-center" }}
            startContent={<UserIcon className="m-auto" />}
            // endContent={<Button size="sm">Edit</Button>}
            required
          ></Input>
          {isEditing && (
            <Input
              type="name"
              name="name"
              label="Name"
              labelPlacement="outside"
              value={userInfo.name}
              onChange={handleChangeInfo}
              // isDisabled
              readOnly={!isEditing}
              isDisabled={isLoading}
              // variant="underlined"
              classNames={{ input: "text-center" }}
              required
            ></Input>
          )}
        </CardBody>
        <CardFooter className="flex flex-col gap-5">
          <div className="flex flex-row justify-center gap-8 m-auto">
            {isEditing ? (
              <>
                <Button
                  type="button"
                  color="warning"
                  onClick={handleCancelUpdate}
                  isDisabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  color="success"
                  onClick={handleUpdateUserInfo}
                  isDisabled={isLoading}
                >
                  Update
                </Button>
              </>
            ) : (
              <Button type="button" color="primary" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            )}
          </div>
          <Divider />
          <div className="flex flex-row justify-center gap-8 m-auto">
            <ChangePasswordModalButton />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SettingsAccount;
