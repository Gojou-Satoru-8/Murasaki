import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MainContent from "../components/MainContent";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Button, CardFooter } from "@nextui-org/react";

const HomePage = () => {
  const authState = useSelector((state) => state.auth);
  console.log(authState);
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    if (!authState.isAuthenticated) {
      // alert("Please login to gain access to this page");
      navigate("/log-in");
      return;
    }
  });

  useEffect(() => {
    const fetchNotes = async () => {
      const response = await fetch("http://localhost:3000/notes", {
        credentials: "include",
      });
      const data = await response.json();
      console.log(data);

      if (response.status === 404) return;
      setNotes(data.notes);
      setIsLoading(false);
    };
    fetchNotes();
  }, []);

  const handleViewNote = async (id) => {
    const response = await fetch(`http://localhost:3000/notes/${id}`, {
      credentials: "include",
    });
    const data = await response.json();
    console.log(data);
    navigate(`/notes/${id}`, { state: { note: notes.find((note) => note._id === id) } });
  };
  const handleDeleteNote = async (id) => {
    const response = await fetch(`http://localhost:3000/notes/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    // const data = await response.json();
    // console.log(data);
    if (response.status !== 204) return;
    setNotes((notes) => {
      // const newNotes = [...notes];
      // newNotes.splice(
      //   newNotes.findIndex((note) => note._id === id),
      //   1
      // );
      // return newNotes;
      return notes.filter((note) => note._id !== id);
    });
  };

  return (
    <MainContent title={notes.length === 0 ? "You have no notes" : "All Your Notes Here"}>
      {isLoading && <h1 className="mt-10 text-center">Loading your notes...</h1>}
      <div className="mt-10 grid md:grid-cols-[repeat(3,30%)] sm:grid-cols-[repeat(2,45%)] grid-cols-1 justify-center gap-8">
        {notes.length > 0 &&
          notes.map((note) => (
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
                <Button
                  className={""}
                  color="primary"
                  radius="full"
                  size="sm"
                  variant="solid"
                  onClick={() => handleViewNote(note._id)}
                >
                  View
                </Button>
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
