// import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import SidebarHome from "../components/SidebarHome";
import Content from "../components/Content";
// import { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Button, CardFooter, Chip } from "@nextui-org/react";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { useSelector, useDispatch } from "react-redux";
import usePopulateNotes from "../hooks/notesHooks";
// import { useRedirectIfNotAuthenticated } from "../hooks/checkAuthHooks";

import { notesActions } from "../store";

const stripHtml = (html) => {
  const temp = document.createElement("div");
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || "";
};

const HomePage = () => {
  // const authState = useRedirectIfNotAuthenticated();
  // console.log(authState);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const notesState = useSelector((state) => state.notes);
  console.log("Notes-state: ", notesState);

  const { notes, selectedTags } = notesState;
  // const selectedTags = window.localStorage.getItem("selectedTags").split(",");
  let notesToDisplay = [];
  if (selectedTags?.length == 0) notesToDisplay = [...notes];
  else
    notesToDisplay = notes.filter((note) => note.tags.some((tag) => selectedTags?.includes(tag)));
  // console.log(notesToDisplay);

  const handleViewNote = async (id) => {
    // const response = await fetch(`http://localhost:3000/notes/${id}`, {
    //   credentials: "include",
    // });
    // const data = await response.json();
    // console.log(data);
    // navigate(`/notes/${id}`, { state: { note: notes.find((note) => note._id === id) } });
    navigate(`/notes/${id}`);
  };
  const handleDeleteNote = async (id) => {
    const response = await fetch(`http://localhost:3000/notes/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    // const data = await response.json();
    // console.log(data);
    if (response.status !== 204) {
      alert("Unable to delete");

      return;
    }
    dispatch(notesActions.deleteNote(id));
  };

  return (
    <MainLayout>
      <SidebarHome styles={"default"} />
      <Content title={notes.length === 0 ? "You have no notes" : "All Your Notes Here"}>
        {/* {isLoading && <h1 className="mt-10 text-center">Loading your notes...</h1>} */}
        <div className="mt-10 grid xl:grid-cols-4 md:grid-cols-[repeat(3,31%)] sm:grid-cols-[repeat(2,45%)] grid-cols-1 justify-center gap-8">
          {notesToDisplay?.length > 0 &&
            notesToDisplay.map((note) => (
              <Card
                className="w-full hover:-translate-y-2 "
                classNames={{
                  base: "w-full h-56 hover:-translate-y-2 border hover:border-purple-300 overflow-scroll",
                }}
                // isBlurred
                isFooterBlurred
                isPressable
                onPress={() => handleViewNote(note._id)}
                key={note._id}
              >
                <CardHeader className="justify-center">
                  <div className="flex gap-5">
                    <div className="flex flex-col gap-1 items-start justify-center">
                      <h3 className="text-medium font-semibold leading-none text-default-600">
                        {note.title}
                      </h3>
                    </div>
                  </div>
                </CardHeader>
                <CardBody>
                  <ScrollShadow hideScrollBar size={35} offset={5}>
                    {/* {stripHtml(note.noteContent)} */}
                    <div className="text-sm">{note.summary}</div>
                  </ScrollShadow>
                </CardBody>
                {/* <CardFooter className="justify-evenly">
                <Link to={`/notes/${note._id}`}>
                  <Button
                    className={""}
                    color="primary"
                    radius="full"
                    size="sm"
                    variant="solid"
                    // onClick={() => handleViewNote(note._id)}
                  >
                    View
                  </Button>
                </Link>
                <Button
                  className={""}
                  color="danger"
                  radius="full"
                  size="sm"
                  variant="solid"
                  onClick={() => handleDeleteNote(note._id)}
                >
                  Delete
                </Button>
              </CardFooter> */}
                {/* <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between"> */}
                <CardFooter className="py-1 overflow-auto">
                  <div className="w-full flex flex-wrap gap-2 justify-center m-auto">
                    {note.tags?.map((tag, index) => (
                      <Chip key={index} variant="flat">
                        {tag}
                      </Chip>
                    ))}
                  </div>
                </CardFooter>
              </Card>
            ))}
        </div>
      </Content>
    </MainLayout>
  );
};

export default HomePage;
