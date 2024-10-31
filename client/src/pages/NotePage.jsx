import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams, json, useNavigation } from "react-router-dom";
import { Button, Input, Textarea, Select, SelectItem } from "@nextui-org/react";
import MainLayout from "../components/MainLayout";
import SidebarNote from "../components/SidebarNote";
import Content from "../components/Content";
import NoteEditor from "../components/NoteEditor";
import CodeEditor from "../components/CodeEditor";
import Tags from "../components/Tags";
import EvalModalButton from "../components/EvalModalButton";
import { authActions, notesActions } from "../store";
import { current } from "@reduxjs/toolkit";

const languages = ["Python3", "Java", "C", "C++"];
const NotePage = ({ isNew }) => {
  console.log("New Note:", isNew);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const currentNote = useSelector((state) => {
    const { notes } = state.notes; // state.notes gives the notesState object, which has a key called notes
    // console.log("notes inside useSelector:", notes);
    return notes.find((note) => note._id === params.id);
    // params.id is undefined so it will return undefined for currentNote
  });
  // console.log(params);
  console.log("Current note: ", currentNote);

  // const location = useLocation();
  // console.log(location.state);
  // const note = location.state?.note;

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState([]);
  const [language, setLanguage] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [codeContent, setCodeContent] = useState("// Your code here");
  const [saveText, setSaveText] = useState("");
  // console.log(summary);
  // console.log(language);
  // console.log("Note Content: ", noteContent);
  // console.log("Code Content: ", codeContent);

  // const authState = useSelector((state) => state.auth);
  // console.log(authState);

  // useEffect(() => {
  //   if (!authState.isAuthenticated) {
  //     // alert("Please login to gain access to this page");
  //     navigate("/log-in");
  //     return;
  //   }
  // }, [authState.isAuthenticated, navigate]);

  // useEffect(() => {
  //   const fetchNoteDetails = async () => {
  //     const response = await fetch(`http://localhost:3000/notes/${params.id}`, {
  //       credentials: "include",
  //     });
  //     console.log(response);
  //     const data = await response.json();
  //     console.log(data);

  //     // For unauthorized error:
  //     if (response.status === 401) {
  //       dispatch(authActions.unsetUser());
  //       // dispatch(notesActions.setNotes({ notes: [] }));
  //       dispatch(notesActions.clearAll());
  //       navigate("/log-in", { state: { message: "Time Out! Please log-in again" } });
  //       return;
  //     } else if (!response.ok) alert(`Could not populate current note with id ${params.id}`); // For all other errors:

  //     const { note } = data;
  //     setTitle(note.title);
  //     setSummary(note.summary ?? "");
  //     setTags(note.tags);
  //     setNoteContent(note.noteContent.at(0));
  //     setCodeContent(note.codeContent);
  //   };
  //   if (!isNew) fetchNoteDetails();
  // }, [dispatch, navigate, params.id, isNew]);

  useEffect(() => {
    if (!isNew && currentNote) {
      setTitle(currentNote.title);
      setSummary(currentNote.summary);
      setTags(currentNote.tags);
      setLanguage(currentNote.language);
      setNoteContent(currentNote.noteContent.at(0));
      setCodeContent(currentNote.codeContent);
    }
  }, [isNew, currentNote]);

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleSummaryChange = (e) => setSummary(e.target.value);
  const handleLanguageChange = (e) => setLanguage(e.target.value);
  const handleNoteSave = async () => {
    // Send http POST request if isNew, else PATCH request for updating existing note:

    setSaveText(`${isNew ? "Saving" : "Updating"}! Please wait :)`);
    try {
      let URL = "http://localhost:3000/notes/";
      if (!isNew) URL += params.id;
      const response = await fetch(URL, {
        method: isNew ? "POST" : "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          summary,
          tags,
          language,
          noteContent,
          codeContent,
        }),
      });

      if (!response.ok) console.log("Request sent but unfavourable response");
      const data = await response.json();
      console.log(data);
      // Response is either 401 with message User not logged in, or 200 with Note successfully edited
      if (response.status === 401) {
        dispatch(authActions.unsetUser());
        // dispatch(notesActions.setNotes({ notes: [] }));
        dispatch(notesActions.clearAll());
        navigate("/log-in", { state: { message: "Time Out! Please log-in again" } });
        return;
      }
      setSaveText(data.message);
      // Saving the created note to redux, to prevent additional fetch for reflecting the added note in homepage:
      dispatch(notesActions.updateNote({ note: data.note }));
      // In case the note is updated by removing a selected tag, this may cause UI inconsistency
      if (!isNew) dispatch(notesActions.clearSelectedTags());
      if (isNew) {
        // setTimeout(() => {
        setSaveText("");
        navigate(`/notes/${data.note._id}`);
        // }, 1000);
      } else setTimeout(() => setSaveText(""), 2000);
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <MainLayout>
      <SidebarNote styles={"default"}>
        <div className="action-buttons w-[95%] md:w-1/2 mx-auto my-10 flex flex-col justify-center gap-4">
          <Button color="primary" variant="flat" onClick={handleNoteSave}>
            Save
          </Button>
          <Button
            color="danger"
            variant="flat"
            onClick={() => {
              navigate("/");
            }}
          >
            {isNew ? "Cancel" : "Go Back"}
          </Button>
          <EvalModalButton codeContent={codeContent} language={language} />
        </div>
      </SidebarNote>
      <Content>
        {saveText && (
          <div className="bg-primary rounded py-2 px-4 w-2/3 m-auto text-center">
            <p>{saveText}</p>
          </div>
        )}
        <div className="flex flex-col gap-4 justify-center">
          <Input
            size="lg"
            classNames={{ input: "text-center text-3xl" }}
            type="text"
            value={title}
            onChange={handleTitleChange}
            label="Title"
            labelPlacement="outside"
            // variant="underlined"
            required
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
          <Select
            classNames={{ base: "m-auto" }}
            isRequired
            name="lang"
            label="Programming Language"
            labelPlacement="outside"
            className="max-w-xs"
            selectedKeys={[language]}
            onChange={handleLanguageChange}
          >
            {languages.map((lang) => (
              <SelectItem
                key={lang}
                // value={lang.name}  // key is taken as the value
              >
                {lang}
              </SelectItem>
            ))}
          </Select>
          {language === "Java" && <p>Name the class {"'program'"} to run correctly</p>}
          <CodeEditor
            codeContent={codeContent}
            setCodeContent={setCodeContent}
            language={language}
          />
        </div>
      </Content>
    </MainLayout>
  );
};

export default NotePage;
