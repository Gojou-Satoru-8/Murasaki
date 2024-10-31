const os = require("os");
const fs = require("fs/promises");
const path = require("path");
const { spawn } = require("child_process");
const { Server } = require("socket.io");

// const fileExtMapping = {
//   py: "python3",
//   java: "javac",
//   c: "gcc",
//   cpp: "g++",
//   js: "node",
// };

const setupChildProcess = function (child_process, socket) {
  child_process.stdout.on("data", (chunk) => {
    console.log(chunk.toString());
    socket.emit("program-stdout", chunk.toString());
  });

  child_process.stdout.on("end", () => {
    console.log("------STDOUT END------");
    // socket.emit("program-stdout");
    child_process.kill();
  });

  child_process.stderr.on("data", (chunk) => {
    console.log("STDERR: ", chunk.toString());
    socket.emit("program-stderr", chunk.toString());
    child_process.kill();
  });

  child_process.on("close", (code) => {
    console.log(`Child Process closed with code: ${code}`);
    socket.emit("program-end", `\n\nProgram exited with code: ${code}`);
  });
  child_process.on("error", (err) => {
    console.log("Error in child-process", err);
  });
};

const io = new Server(4000, {
  cors: { origin: ["http://localhost:5173", "http://localhost:3000"], credentials: true },
});

let child_process;

io.on("connection", (socket) => {
  console.log("New connection from client with ID:", socket.id);

  socket.on("run-code", async (message) => {
    // Message to be in the form: ["py", "...code"]
    // console.log(message);

    // Kill existing child_process if any:
    if (child_process) child_process.kill();

    // Extract file-extension and code-content, and write to a file.
    const [fileExt, code] = JSON.parse(message.trim());
    // console.log(fileExt, code);

    const tempFolderPath = path.join(__dirname, "..", "temp");
    const filePath = path.join(tempFolderPath, `program.${fileExt}`); // absolute path
    const scriptPath = path.join(tempFolderPath, `script_${fileExt}.sh`);
    // console.log(filePath, scriptPath);
    await fs.writeFile(filePath, code);

    // Spawn the bash child-process and setup.
    child_process = spawn("bash", [scriptPath], { cwd: tempFolderPath });
    setupChildProcess(child_process, socket);
  });

  socket.on("program-stdin", (message) => {
    // If no child_process exists:
    if (!child_process) {
      socket.emit("input-error", "Please run a program first!");
      return;
    }
    console.log(message);
    // Write to child_process's STDIN:
    if (child_process.stdin.writable) {
      // NOTE: Usually the message from client will be appended with a "\n"
      if (!message.endsWith("\n")) message = message + "\n";
      child_process.stdin.write(message);
    } else {
      console.log("Cannot write to child-process STDIN");
      socket.emit("input-error", "Cannot write to child-process STDIN");
    }
  });

  socket.on("disconnect", (reason) => {
    console.log("REASON FOR DISCONNECTION:", reason); // Gives a default reason: client namespace disconnect
    if (child_process) {
      child_process.kill();
      child_process = null;
    }
  });
});
