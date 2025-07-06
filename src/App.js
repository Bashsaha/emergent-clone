import React, { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [fileToUpload, setFileToUpload] = useState(null);

  const BACKEND_URL = "https://9241eec3-4bce-4949-bf31-ec4bfc064a12-00-3j81thkd6sbgi.spock.replit.dev";

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    const res = await axios.get(`${BACKEND_URL}/files`);
    setFiles(res.data);
  };

  const loadFile = async (filename) => {
    setSelectedFile(filename);
    const res = await axios.get(`${BACKEND_URL}/files/${filename}`);
    setFileContent(res.data);
  };

  const handlePromptSubmit = async () => {
    const res = await axios.post(`${BACKEND_URL}/gpt`, {
      prompt,
      context: fileContent,
    });
    setResponse(res.data.response);
  };

  const handleFileChange = (e) => {
    setFileToUpload(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", fileToUpload);
    await axios.post(`${BACKEND_URL}/upload`, formData);
    fetchFiles();
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Emergent AI Clone</h1>

      <div className="mb-4">
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload} className="ml-2 px-4 py-1 bg-blue-500 text-white rounded">
          Upload File
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <h2 className="font-semibold">Files</h2>
          <ul>
            {files.map((file) => (
              <li key={file}>
                <button onClick={() => loadFile(file)} className="text-blue-600">
                  {file}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-2">
          <h2 className="font-semibold">Prompt</h2>
          <textarea
            className="w-full border p-2 mb-2"
            rows="4"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to change or fix..."
          ></textarea>
          <button onClick={handlePromptSubmit} className="px-4 py-2 bg-green-500 text-white rounded">
            Send to GPT
          </button>

          <h3 className="mt-4 font-semibold">GPT Response</h3>
          <pre className="bg-gray-100 p-2 whitespace-pre-wrap">{response}</pre>
        </div>
      </div>
    </div>
  );
}
