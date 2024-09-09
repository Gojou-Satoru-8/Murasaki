import { useImperativeHandle, useState } from "react";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { Button } from "@nextui-org/react";

export default function NoteEditor() {
  // Creates a new editor instance.
  const editor = useCreateBlockNote();

  const [content, setContent] = useState("");
  const getContent = () => setContent(editor.document);

  console.log(content);

  // Renders the editor instance using a React component.
  return (
    <div className="border-2 rounded-lg min-h-[20vh]">
      <BlockNoteView editor={editor} theme={"light"} onChange={getContent} />
    </div>
  );
}
