import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
// Language packs
import { langs, langNames, loadLanguage } from "@uiw/codemirror-extensions-langs";
// Themes
import { materialLight, materialDark } from "@uiw/codemirror-theme-material";
import { githubLight, githubDark } from "@uiw/codemirror-theme-github";
import { atomone } from "@uiw/codemirror-theme-atomone";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { useSelector } from "react-redux";

const languageToEditorLang = {
  Python3: "python",
  Java: "java",
  C: "c",
  "C++": "cpp",
};

// const editorStyle = {
//   fontSize: "15px", // Adjust this value as needed
// };

// console.log("Lang Names:", langNames, langNames.length);

const themeOptions = {
  Atomone: atomone,
  "Material Light": materialLight,
  "Material Dark": materialDark,
  "Github Light": githubLight,
  "Github Dark": githubDark,
  Dracula: dracula,
};

// Default Values:
let editorTheme = themeOptions["Atomone"];
let fontSize = 15;
let editorHeight = 500;
const CodeEditor = ({ codeContent, setCodeContent, language, editorOptions }) => {
  // const [codeContents, setCodeContents] = useState("// Your code here");
  const authState = useSelector((state) => state.auth);
  console.log("Code Editor Settings:", authState.user?.settings);

  if (authState.user?.settings) {
    editorTheme = themeOptions[authState.user.settings.codeEditorTheme] || editorTheme;
    fontSize = authState.user.settings.codeEditorFontSize || fontSize;
    editorHeight = authState.user.settings.codeEditorWindowSize || editorHeight;
  }
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
      height={`${editorHeight}px`}
      theme={editorTheme}
      //   readOnly={true}
      // extensions={[langs.python()]}
      extensions={editorLang ? [loadLanguage(editorLang)] : []}
      onChange={handleChangeContent}
      style={{ fontSize: `${fontSize}px` }}
      {...editorOptions}
    />
  );
};

export default CodeEditor;
