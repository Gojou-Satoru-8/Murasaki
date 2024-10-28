import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams, json } from "react-router-dom";
import { Button, Input } from "@nextui-org/react";
import MainContent from "../components/MainContent";
import NoteEditor from "../components/NoteEditor";
import CodeEditor from "../components/CodeEditor";
import Tags from "../components/Tags";
import EvalModal from "../components/EvalModal";
import { authActions, notesActions } from "../store";

const NotePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  // console.log(params);

  // const location = useLocation();
  // console.log(location.state);
  // const note = location.state?.note;

  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [noteContent, setNoteContent] = useState("");
  const [codeContent, setCodeContent] = useState("// Your code here");
  const [saveText, setSaveText] = useState("");
  console.log("Note Content: ", noteContent);
  console.log("Code Content: ", codeContent);

  // const authState = useSelector((state) => state.auth);
  // console.log(authState);

  // useEffect(() => {
  //   if (!authState.isAuthenticated) {
  //     // alert("Please login to gain access to this page");
  //     navigate("/log-in");
  //     return;
  //   }
  // }, [authState.isAuthenticated, navigate]);

  useEffect(() => {
    const fetchNoteDetails = async () => {
      const response = await fetch(`http://localhost:3000/notes/${params.id}`, {
        credentials: "include",
      });
      console.log(response);
      const data = await response.json();
      console.log(data);

      // For unauthorized error:
      if (response.status === 401) {
        dispatch(authActions.unsetUser());
        dispatch(notesActions.setNotes({ notes: [] }));
        navigate("/log-in", { state: { message: "Time Out! Please log-in again" } });
        return;
      } else if (!response.ok) alert(`Could not populate current note with id ${params.id}`); // For all other errors:

      const { note } = data;
      setTitle(note.title);
      setTags(note.tags);
      setNoteContent(note.noteContent.at(0));
      setCodeContent(note.codeContent);
    };
    fetchNoteDetails();
  }, [dispatch, navigate, params.id]);

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleNoteSave = async () => {
    // Send http POST request:
    setSaveText("Saving! Please wait :)");
    try {
      const response = await fetch(`http://localhost:3000/notes/${params.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          tags,
          noteContent,
          codeContent,
        }),
      });

      if (!response.ok) console.log("Request sent but unfavourable response");
      const data = await response.json();
      console.log(data);
      // Response is either 401 with message User not logged in, or 200 with Note successfully created
      if (response.status === 401) {
        navigate("/log-in", { state: { message: "Time Out! Please log-in again" } });
        return;
      }
      setSaveText(data.message);
      // Saving the created note to redux, to prevent additional fetch for reflecting the added note in homepage:
      dispatch(notesActions.updateNote({ note: data.note }));

      setTimeout(() => {
        setSaveText("");
        navigate("/");
      }, 3000);
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <MainContent>
      {saveText && (
        <div className="bg-primary rounded py-2 px-4 w-2/3 m-auto text-center">
          <p>{saveText}</p>
        </div>
      )}
      <div className="flex flex-col gap-4 justify-center">
        <Input
          size="lg"
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Note Title"
          required
        ></Input>

        <Tags tags={tags} setTags={setTags}></Tags>

        <NoteEditor noteContent={noteContent} setNoteContent={setNoteContent} />
        <CodeEditor codeContent={codeContent} setCodeContent={setCodeContent} />
        <div className="action-buttons flex justify-center gap-4">
          <Button color="primary" onClick={handleNoteSave}>
            Save
          </Button>
          <Button
            color="danger"
            onClick={() => {
              navigate("/");
            }}
          >
            Go Back
          </Button>
          <EvalModal />
        </div>
      </div>
    </MainContent>
  );
};

export default NotePage;
