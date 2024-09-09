import MainContent from "../components/MainContent";
import NoteEditor from "../components/NoteEditor";
import CodeEditor from "../components/CodeEditor";
import { Button } from "@nextui-org/react";
const NewNotePage = () => {
  return (
    <MainContent>
      <div className="flex flex-col gap-8 justify-center">
        <NoteEditor />
        <CodeEditor />
        <div className="action-buttons flex justify-center gap-4">
          <Button color="primary">Save</Button>
          <Button color="danger">Delete</Button>
        </div>
      </div>
    </MainContent>
  );
};

export default NewNotePage;
