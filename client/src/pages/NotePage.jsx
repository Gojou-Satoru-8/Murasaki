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
  const [uiElements, setUIElements] = useState({
    loading: false,
    error: "",
    message: "",
  });
  // console.log(summary);
  console.log(language);
  // console.log("Note Content: ", noteContent);
  // console.log("Code Content: ", codeContent);

  // const authState = useSelector((state) => state.auth);
  // console.log(authState);

  // useEffect(() => {
  //   if (!authState.isAuthenticated) {
  //     // alert("Please login to gain access to this page");
  //     navigate("/login");
  //     return;
  //   }
  // }, [authState.isAuthenticated, navigate]);

  // useEffect(() => {
  //   const fetchNoteDetails = async () => {
  //     const response = await fetch(`http://localhost:3000/api/notes/${params.id}`, {
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
  //       navigate("/login", { state: { message: "Time Out! Please login again" } });
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

  const setTimeNotification = ({ message = "", error = "" }, seconds = 3) => {
    setTimeout(() => {
      setUIElements({ loading: false, message, error });
    }, seconds * 1000);
  };
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleSummaryChange = (e) => setSummary(e.target.value);
  const handleLanguageChange = (e) => setLanguage(e.target.value);
  const handleNoteSave = async () => {
    // Send http POST request if isNew, else PATCH request for updating existing note:
    // setSaveText(`${isNew ? "Saving" : "Updating"}! Please wait :)`);
    // setLoading(true);

    if (!title) {
      setTimeNotification({ error: "Please provide a title" }, 0);
      return;
    }
    if (!language) {
      setTimeNotification({ error: "Please choose a language" }, 0);
      return;
    }
    setUIElements({ loading: true, message: "", error: "" }), 0;
    try {
      let URL = "http://localhost:3000/api/notes/";
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
        navigate("/login", { state: { message: "Time Out! Please login again" } });
        return;
      }

      if (!response.ok || data.status === "fail" || data.status === "error") {
        setTimeNotification({ error: data.message }, 2);
        return;
      }
      // Saving the created note to redux, to prevent additional fetch for reflecting the added note in homepage:
      dispatch(notesActions.updateNote({ note: data.note }));
      setTimeNotification({ message: data.message }, 2);
      // In case the note is updated by removing a selected tag, this may cause UI inconsistency
      if (!isNew) dispatch(notesActions.clearSelectedTags());
      if (isNew) {
        // setTimeout(() => {
        setUIElements((prev) => ({ ...prev, message: "", error: "" }));
        navigate(`/notes/${data.note._id}`);
        // }, 1000);
      }
    } catch (err) {
      console.log(err.message);
      setTimeNotification({ error: "No Internet Connection" }, 3);
    }
  };
  useEffect(() => {
    setTimeout(() => {
      if (uiElements.message || uiElements.error)
        setUIElements({ loading: false, message: "", error: "" });
    }, 4000);
  }, [uiElements]);
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
        {uiElements.loading && (
          <div className="bg-primary rounded py-2 px-4 w-2/3 m-auto text-center">
            <p>Processing Changes! Please wait</p>
          </div>
        )}
        {uiElements.message && (
          <div className="bg-success rounded py-2 px-4 w-2/3 m-auto text-center">
            <p>{uiElements.message}</p>
          </div>
        )}
        {uiElements.error && (
          <div className="bg-danger rounded py-2 px-4 w-2/3 m-auto text-center">
            <p>{uiElements.error}</p>
          </div>
        )}
        <div className="flex flex-col gap-4 justify-center">
          <Input
            size="lg"
            classNames={{ base: "w-3/5 m-auto", input: "text-3xl text-center" }}
            type="text"
            value={title}
            onChange={handleTitleChange}
            label="Title"
            // labelPlacement="outside"
            variant="underlined"
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
            required
            name="lang"
            label="Programming Language"
            labelPlacement="outside-left"
            className="max-w-sm"
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
