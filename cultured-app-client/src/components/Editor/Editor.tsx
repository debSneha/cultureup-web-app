import { useEffect, useRef, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import * as Emoji from "quill-emoji";

import "react-quill/dist/quill.snow.css";
import "quill-emoji/dist/quill-emoji.css";

Quill.register("modules/emoji", Emoji);

export interface EditorProps {
  valueState: {
    value: string
    setValue: React.Dispatch<React.SetStateAction<string>>
  }
}

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike", "blockquote", "link"],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ indent: "-1" }, { indent: "+1" }],
  ["emoji"],
  ["clean"]
];

export default function Editor({valueState}: EditorProps) {
  const {value, setValue} = valueState
  const reactQuillRef = useRef<ReactQuill>(null);

  return (
    <ReactQuill
      ref={reactQuillRef}
      theme="snow"
      placeholder="Start writing..."
      modules={{
        toolbar: {
          container: TOOLBAR_OPTIONS
        },
        "emoji-toolbar": true,
        "emoji-textarea": false,
        "emoji-shortname": true,
      }}
      value={value}
      onChange={(newContent) => setValue(newContent)}
    />
  );
}
