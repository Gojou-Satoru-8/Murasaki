import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import CodeEditor from "./CodeEditor";
import { io } from "socket.io-client";
import { useState, useRef, useEffect } from "react";

const SOCKET_URL = "http://localhost:4000";
const languageToExt = {
  Python3: "py",
  Java: "java",
  "C++": "cpp",
  C: "c",
};

export default function EvalModalButton({ codeContent, language }) {
  console.log("Eval Modal rendered");
  const socketRef = useRef(null);

  const [evalContent, setEvalContent] = useState("");
  // const [userInput, setUserInput] = useState("");

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  // console.log(process.env.NODE_ENV);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, { autoConnect: false, withCredentials: true });

    socketRef.current.on("connect", () => {
      console.log("Connection established with server");
    });
    socketRef.current.on("program-stdout", (message) => {
      console.log("Program STDOUT:", message);
      setEvalContent((prev) => prev + message);
    });
    socketRef.current.on("program-stderr", (message) => {
      console.log("PROGRAM STDERR:", message);
      setEvalContent((prev) => prev + message);
      socketRef.current.disconnect(); // Not necessary but better
    });

    socketRef.current.on("program-end", (message) => {
      console.log("PROGRAM END:", message);
      setEvalContent((prev) => prev + message);
      socketRef.current.disconnect();
    });

    socketRef.current.on("input-error", (message) => {
      console.log("Input Error:", message);
    });

    socketRef.current.on("connect_error", (err) => {
      console.log("Error in connection", err.message);
      console.log(err);
    });

    socketRef.current.on("disconnect", (message) => {
      console.log(message); // Default message
    });
    // Cleanup function to remove event listeners and disconnect
    return () => {
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
      }
    };
  }, []);

  const handleOpenCodeModal = (e) => {
    if (!language) {
      alert("Please select a language");
      return;
    }
    onOpen(); // In-built function to open the modal
    // if (socketRef.current)
    socketRef.current.connect();
    const fileExt = languageToExt[language];
    // console.log(languageToExt[language]);
    socketRef.current.emit("run-code", JSON.stringify([fileExt, codeContent]));
  };

  const cleanupOnCloseModal = () => {
    setEvalContent("");
    socketRef.current.disconnect();
  };

  // const handleUserInputChange = (e) => setUserInput(e.target.value);
  const handleSendInput = (e) => {
    // console.log(e);  // type: keydown, key: "Enter"
    if (e.key === "Enter") {
      // console.log(socketRef.current);
      if (socketRef.current.connected) {
        const input = e.target.value + "\n";
        setEvalContent((prev) => prev + input);
        socketRef.current.emit("program-stdin", input);
        console.log("Signal sent", input);
        e.target.value = "";
      } else {
        console.log("Connection disconnected");
      }
    }
  };
  return (
    <>
      {/* <Button onPress={onOpen}>Run Code</Button> */}
      <Button color="success" variant="flat" onPress={handleOpenCodeModal}>
        Run Code
      </Button>
      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={cleanupOnCloseModal}
        size="2xl"
        classNames={{
          backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        }}
      >
        <ModalContent>
          {(closeModal) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Running Your Code</ModalHeader>
              <ModalBody>
                <CodeEditor codeContent={evalContent} editorOptions={{ readOnly: true }} />
                <Input
                  name={"stdin"}
                  // value={userInput}
                  label="User Input"
                  radius="none"
                  variant="faded"
                  // onChange={handleUserInputChange}
                  onKeyDown={handleSendInput}
                ></Input>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={(e) => {
                    closeModal();
                    cleanupOnCloseModal();
                    e.target.value = "";
                  }}
                >
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
