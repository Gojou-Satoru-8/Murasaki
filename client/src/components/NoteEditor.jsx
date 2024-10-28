import { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
// import { Button } from "@nextui-org/react";
export default function NoteEditor({ noteContent, setNoteContent }) {
  const handleNoteChange = (value) => {
    // console.log(editorRef.current.getContent());
    setNoteContent(value); // Or: setNoteContent(editorRef.current.getContent());
  };
  const editorRef = useRef(null);
  return (
    <>
      <Editor
        apiKey="nxd76ujztoydqvlx0i5dk8q76oedjp6zxp54tm72ak8fe19c"
        // ref={editorRef}  // Native method below:
        onInit={(_evt, editor) => {
          editorRef.current = editor;
        }}
        init={{
          plugins: [
            "preview",
            // "importcss",
            "searchreplace",
            "autolink",
            // "autosave",
            "save",
            // "directionality",
            "code",
            "visualblocks",
            "visualchars",
            "fullscreen",
            "image",
            "link",
            "media",
            "codesample",
            "table",
            "charmap",
            "pagebreak",
            // "nonbreaking",
            "anchor",
            "insertdatetime",
            // "advlist",
            "lists",
            "wordcount",
            "help",
            "quickbars",
            "emoticons",
            "accordion",
          ],
          toolbar:
            "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | align numlist bullist | accordion accordionremove| link image | table media | lineheight outdent indent| forecolor backcolor removeformat | charmap emoticons insertdatetime | fullscreen preview | save print | pagebreak anchor codesample",
          // advlist_bullet_styles: "square",
          help_tabs: ["shortcuts", "keyboardnav", "versions"],
          height: "500px",
          save_onsavecallback: () => {
            handleNoteChange(editorRef.current.getContent());
          },
        }}
        value={noteContent}
        onEditorChange={(value, editor) => {
          handleNoteChange(value);
          // console.log(value === editor.getContent());   // true;
        }}
      />
      {/* <Button onClick={handleNoteChange}>Save</Button> */}
    </>
  );
}
