import { createContext, useContext, useState } from "react";
import { UserContext } from "../App";
import { Navigate } from "react-router-dom";
import BlogEditor from "./blog-editor-component";
import PublishForm from "./publish-form";
import EditorJS, { OutputData } from "@editorjs/editorjs";

const blogStructure = {
  topic: "",
  banner: "",
  content: {} as OutputData,
  tags: [] as string[],
  des: "",
  author: {},
};

interface EditorContextType {
  blog: typeof blogStructure;
  setBlog: React.Dispatch<React.SetStateAction<typeof blogStructure>>;
  editorState: string;
  setEditorState: React.Dispatch<React.SetStateAction<string>>;
  textEditor: EditorJS | null;
  setTextEditor: React.Dispatch<React.SetStateAction<EditorJS | null>>;
}

export const EditorContext = createContext<EditorContextType | undefined>(
  undefined
);

const Editor = () => {
  const [blog, setBlog] = useState(blogStructure);
  const {
    userAuth: { access_token },
  } = useContext(UserContext);
  const [editorState, setEditorState] = useState("editor");
  const [textEditor, setTextEditor] = useState<EditorJS | null>(null);

  // เช็คว่ามี access_token หรือไม่
  if (access_token === null) {
    return <Navigate to="/signin" />;
  }

  return (
    <EditorContext.Provider
      value={{
        blog,
        setBlog,
        editorState,
        setEditorState,
        textEditor,
        setTextEditor,
      }}
    >
      {editorState === "editor" ? <BlogEditor /> : <PublishForm />}
    </EditorContext.Provider>
  );
};

export default Editor;
