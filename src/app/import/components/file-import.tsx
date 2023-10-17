import React, { useState } from "react";

export interface FileImporterProps {
  onFileImport: (files: string[]) => void;
}

const FileImporter: React.FC<FileImporterProps> = (
  props: FileImporterProps
) => {
  const { onFileImport } = props;
  const [fileContents, setFileContents] = useState<string[]>([]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const contents: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      if (!file) continue;

      const content = await readFileContent(file);
      contents.push(content);
    }

    setFileContents(contents);
    onFileImport(contents);
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        resolve(event.target?.result as string);
      };

      reader.onerror = (error) => {
        reject(new Error("Error reading file: " + error));
      };

      reader.readAsText(file);
    });
  };

  return (
    <div>
      <input type="file" multiple onChange={handleFileChange} />
      {/* <ul>
        {fileContents.map((content, index) => (
          <li key={index}>
            <pre>{content}</pre>
          </li>
        ))}
      </ul> */}
    </div>
  );
};

export default FileImporter;
