import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Input, Textarea } from "@nextui-org/react";
import MainLayout from "../components/MainLayout";
import NoteEditor from "../components/NoteEditor";
import CodeEditor from "../components/CodeEditor";
import Tags from "../components/Tags";
import EvalModalButton from "../components/EvalModalButton";
import { notesActions, authActions } from "../store";

const NewNotePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
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
  // });

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleSummaryChange = (e) => setSummary(e.target.value);
  const handleNoteSave = async () => {
    // Send http POST request:
    setSaveText("Saving! Please wait :)");
    try {
      const response = await fetch("http://localhost:3000/notes", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          summary,
          tags,
          noteContent,
          codeContent,
        }),
      });

      if (!response.ok) console.log("Request sent but unfavourable response");
      const data = await response.json();
      console.log(data);
      // Expected responses:
      // status 401: User not logged in, status 201: Note created, and status 500: Unable to save note
      // NOTE: response.ok is true for 201 Created also
      if (response.status === 401) {
        dispatch(authActions.unsetUser());
        // dispatch(notesActions.setNotes({ notes: [] }));
        dispatch(notesActions.clearAll());
        navigate("/log-in", { state: { message: "Time Out! Please log-in again" } });
        return;
      }
      setSaveText(data.message);
      // Saving the created note to redux, to prevent additional fetch for reflecting the added note in homepage:
      dispatch(notesActions.addNote({ note: data.note }));

      setTimeout(() => {
        setSaveText("");
        navigate("/");
      }, 3000);
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <MainLayout>
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
          label="Title"
          labelPlacement="outside"
          // variant="underlined"
          required
          classNames={{ input: "text-center" }}
        ></Input>
        <Textarea
          size=""
          type="text"
          value={summary}
          onChange={handleSummaryChange}
          label="Summary"
          labelPlacement="outside"
          variant="underlined"
          // required
        />
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
            Cancel
          </Button>
          <EvalModalButton codeContent={codeContent} />
        </div>
      </div>
    </MainLayout>
  );
};

export default NewNotePage;
