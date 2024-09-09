import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
// Language packs
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { json } from "@codemirror/lang-json";
// Themes
import { materialLight, materialDark } from "@uiw/codemirror-theme-material";
import { githubLight, githubDark } from "@uiw/codemirror-theme-github";
import { atomone } from "@uiw/codemirror-theme-atomone";
import { dracula } from "@uiw/codemirror-theme-dracula";

const editorStyle = {
  fontSize: "14px", // Adjust this value as needed
};

const CodeEditor = () => {
  const [codeContents, setCodeContents] = useState("// Your code here");
  const handleChangeContent = (val, viewUpdate) => {
    console.log("val:", val);
    console.log(viewUpdate);

    setCodeContents(val);
  };

  return (
    <CodeMirror
      value={codeContents}
      height="300px"
      theme={atomone}
      //   readOnly={true}
      //   extensions={[javascript({ jsx: true })]}
      extensions={[python()]}
      onChange={handleChangeContent}
      style={editorStyle}
    />
  );
};

export default CodeEditor;
