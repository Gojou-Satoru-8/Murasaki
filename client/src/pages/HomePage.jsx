// import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import MainContent from "../components/MainContent";
// import { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Button, CardFooter } from "@nextui-org/react";
import { useSelector, useDispatch } from "react-redux";
import usePopulateNotes from "../hooks/notesHooks";
// import { useRedirectIfNotAuthenticated } from "../hooks/checkAuthHooks";

import { notesActions } from "../store";

const HomePage = () => {
  // const authState = useRedirectIfNotAuthenticated();
  // console.log(authState);
  const dispatch = useDispatch();
  const notesState = usePopulateNotes();
  console.log("Notes-state: ", notesState);

  const { notes, selectedTags } = notesState;
  // const selectedTags = window.localStorage.getItem("selectedTags").split(",");
  let notesToDisplay = [];
  if (selectedTags?.length == 0) notesToDisplay = [...notes];
  else
    notesToDisplay = notes.filter((note) => note.tags.some((tag) => selectedTags?.includes(tag)));
  // console.log(notesToDisplay);

  // const handleViewNote = async (id) => {
  //   const response = await fetch(`http://localhost:3000/notes/${id}`, {
  //     credentials: "include",
  //   });
  //   const data = await response.json();
  //   console.log(data);
  //   navigate(`/notes/${id}`, { state: { note: notes.find((note) => note._id === id) } });
  // };
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
    <MainContent title={notes.length === 0 ? "You have no notes" : "All Your Notes Here"}>
      {/* {isLoading && <h1 className="mt-10 text-center">Loading your notes...</h1>} */}
      <div className="mt-10 grid md:grid-cols-[repeat(3,30%)] sm:grid-cols-[repeat(2,45%)] grid-cols-1 justify-center gap-8">
        {notesToDisplay?.length > 0 &&
          notesToDisplay.map((note) => (
            <Card className="w-full hover:-translate-y-2" key={note._id}>
              <CardHeader className="justify-center">
                <div className="flex gap-5">
                  <div className="flex flex-col gap-1 items-start justify-center">
                    <h4 className="text-small font-semibold leading-none text-default-600">
                      {note.title}
                    </h4>
                  </div>
                </div>
              </CardHeader>
              <CardFooter className="justify-evenly">
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
              </CardFooter>
            </Card>
          ))}
      </div>
    </MainContent>
  );
};

export default HomePage;
