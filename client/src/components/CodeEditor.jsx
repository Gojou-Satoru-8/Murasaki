import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
// Language packs
import { langs, langNames, loadLanguage } from "@uiw/codemirror-extensions-langs";
// Themes
import { materialLight, materialDark, materialInit } from "@uiw/codemirror-theme-material";
import { githubLight, githubDark } from "@uiw/codemirror-theme-github";
import { atomone } from "@uiw/codemirror-theme-atomone";
import { dracula } from "@uiw/codemirror-theme-dracula";

const languageToEditorLang = {
  Python3: "python",
  Java: "java",
  C: "c",
  "C++": "cpp",
};

const editorStyle = {
  fontSize: "15px", // Adjust this value as needed
};

console.log("Lang Names:", langNames, langNames.length);

const CodeEditor = ({ codeContent, setCodeContent, language, editorOptions }) => {
  // const [codeContents, setCodeContents] = useState("// Your code here");
  const editorLang = languageToEditorLang[language];
  // When no language is passed, ie when running code, markdown is a safe option.
  const handleChangeContent = (val, viewUpdate) => {
    // console.log("val:", val);
    // console.log(viewUpdate);
    setCodeContent(val);
  };

  return (
    <CodeMirror
      value={codeContent}
      height="300px"
      theme={atomone}
      //   readOnly={true}
      // extensions={[langs.python()]}
      extensions={editorLang ? [loadLanguage(editorLang)] : []}
      onChange={handleChangeContent}
      style={editorStyle}
      {...editorOptions}
    />
  );
};

export default CodeEditor;
