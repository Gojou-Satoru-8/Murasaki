import { Divider, Button } from "@nextui-org/react";
import { Link } from "react-router-dom";
import NoteIcon from "../assets/pen.png";
import { useSelector } from "react-redux";

const Sidebar = ({ className }) => {
  const tags = useSelector((state) => state.notes.tags);

  return (
    <div className={className}>
      <div className="h-[15%] mx-4 my-2 flex flex-col">
        <div className="py-2">
          <Link to="/new-note">
            <Button className="w-[95%]" startContent={<img src={NoteIcon}></img>}>
              {" "}
              New Note
            </Button>
          </Link>
        </div>
        <Divider />
        <div className="py-2 text-center">
          <Link to="/">Home</Link>
        </div>
        {/* <div className="py-2">
          <Link to="/"></Link>
        </div> */}
      </div>
      <Divider />
      <div className="h-[70%] mx-2 my-6 flex flex-col justify-start gap-4 overflow-auto">
        <div className="text-center">
          <h1>Tags</h1>
        </div>
        <ul>
          {tags.map((tag) => (
            <div className="py-3" key={tag}>
              <li>{tag}</li>
              <Divider />
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
