import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  Input,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@nextui-org/react";
import { SearchIcon } from "./SearchIcon.jsx";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store/index.js";

const Header = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/logout", { credentials: "include" });
      if (!response.ok) {
        alert("Unable to log out! Server Issue");
        return;
      }
      const data = await response.json();
      console.log(data);
      dispatch(authActions.unsetUser()); // Need to call this, cuz this will cause a re-render of the components
      // which are using the authState, for example HomePage, based on which we are nagivated to Login
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <header className="my-6">
      <Navbar
        isBordered
        className="dark:bg-gray-700 bg-gray-950 text-white w-[95%] sm:w-[90%] mx-auto my-2 rounded-3xl"
      >
        <NavbarContent className="items-center gap-8" justify="start">
          <NavbarBrand className="mr-4">
            <p className="font-bold text-inherit text-3xl text-purple-300">Murasaki</p>
          </NavbarBrand>
          <Input
            classNames={{
              base: "max-w-full sm:max-w-[15rem] h-10",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper:
                "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
            }}
            placeholder="Type to search..."
            size="sm"
            startContent={<SearchIcon size={18} />}
            type="search"
          />
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="secondary"
                name={authState.user?.name
                  .split(" ")
                  .map((segment) => segment.at(0))
                  .join("")}
                // Here we're taking initials of each segment of name
                size="sm"
                src={authState.user?.profilePic}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">{authState.user ? "Signed in as" : "Not Signed in"}</p>
                <p className="font-semibold">{authState.user && authState.user.email}</p>
              </DropdownItem>
              <DropdownItem key="settings">My Settings</DropdownItem>
              {/* <DropdownItem key="configurations">Configurations</DropdownItem> */}
              <DropdownItem key="logout" color="danger" onClick={handleLogout}>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </Navbar>
    </header>
  );
};

export default Header;
