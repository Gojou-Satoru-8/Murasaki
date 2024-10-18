import { Divider, Button } from "@nextui-org/react";
import { Link } from "react-router-dom";
import NoteIcon from "../assets/pen.png";
import HomeIcon from "../assets/home.png";
import CloseIcon from "../assets/close (1).png";
import { useDispatch, useSelector } from "react-redux";
import { notesActions } from "../store";

const Sidebar = ({ className }) => {
  const tags = useSelector((state) => state.notes.tags);
  const selectedTags = useSelector((state) => state.notes.selectedTags);
  console.log(tags, selectedTags);

  const dispatch = useDispatch();

  return (
    <div className={className}>
      <div className="h-[20%] mx-4 my-10 flex flex-col">
        <div className="py-2 text-center">
          <Link to="/new-note">
            <Button
              variant="light"
              color="secondary"
              className="w-[80%]"
              startContent={<img src={NoteIcon}></img>}
            >
              New Note
            </Button>
          </Link>
        </div>
        <Divider />
        <div className="py-2 text-center">
          <Link to="/">
            <Button
              color="secondary"
              variant="light"
              className="w-[80%]"
              startContent={<img src={HomeIcon}></img>}
            >
              Home
            </Button>
          </Link>
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
        <div className="my-2 text-center">
          {selectedTags?.length !== 0 && (
            <Button
              size="sm"
              variant="flat"
              color="primary"
              radius=""
              onClick={() => dispatch(notesActions.clearSelectedTags())}
            >
              Clear Tags
            </Button>
          )}
          {/* <Divider /> */}
        </div>
        <ul>
          <div className="flex flex-row flex-wrap justify-center gap-2">
            {tags.map((tag) => (
              <div className="py-1" key={tag}>
                <li>
                  <Button
                    size="sm"
                    variant={selectedTags?.includes(tag) ? "solid" : "ghost"}
                    color="primary"
                    radius="full"
                    onClick={() => {
                      // console.log("Outer button clicked");
                      dispatch(notesActions.addSelectedTags(tag));
                    }}
                  >
                    {tag}

                    {selectedTags?.includes(tag) && (
                      <div
                        className="hover:bg-red-400 rounded-lg min-w-3"
                        onClick={(e) => {
                          e.stopPropagation(); // Stopping the "click" event here, otherwise it will trigger the onClick
                          // event-handler of the parent element Button
                          // console.log("Inner div clicked");
                          dispatch(notesActions.removeSelectedTags(tag));
                        }}
                      >
                        <img src={CloseIcon} alt="" width={"15"} />
                      </div>
                    )}
                  </Button>
                </li>
                {/* <Divider /> */}
              </div>
            ))}
          </div>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
