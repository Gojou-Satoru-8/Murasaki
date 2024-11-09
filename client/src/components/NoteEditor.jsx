import { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Skeleton } from "@nextui-org/react";
// import { Button } from "@nextui-org/react";
export default function NoteEditor({ noteContent, setNoteContent }) {
  const handleNoteChange = (value) => {
    // console.log(editorRef.current.getContent());
    setNoteContent(value); // Or: setNoteContent(editorRef.current.getContent());
  };
  const editorRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    const fetchApiKey = async () => {
      const response = await fetch("http://localhost:3000/api/tinymce-key", {
        credentials: "include",
      });
      console.log(response);
      const data = await response.json();
      console.log("API KEY:", data.apiKey);

      setLoading(false);
      if (!response.ok || data.status !== "success") {
        console.error("Missing API Key for TinyMCE");
        return;
      }

      setApiKey(data.apiKey);
    };
    fetchApiKey();
  }, []);
  console.log(apiKey);

  return (
    <>
      {loading ? (
        <Skeleton className="rounded-lg">
          <div className="h-24 rounded-lg bg-default-300"></div>
        </Skeleton>
      ) : (
        <Editor
          apiKey={apiKey}
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
      )}
    </>
  );
}
