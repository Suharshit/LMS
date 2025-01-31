"use client";

// import dynamic from "next/dynamic";
// import { useMemo } from "react";
import ReactQuill from "react-quill-new";

import 'react-quill-new/dist/quill.snow.css';

interface EditorProps {
  onChange: (value: string) => void;
  value: string;
};

export const Editor = ({
  onChange,
  value,
}: EditorProps) => {
  return (
    <div >
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};