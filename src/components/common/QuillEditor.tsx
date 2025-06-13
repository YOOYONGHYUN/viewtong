import { mediaFileControllerInitializeUpload } from "@/queries";
import { useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const QuillEditor = ({ value, onChange }: QuillEditorProps) => {
  const quillRef = useRef<ReactQuill | null>(null);
  const cloudFrontUrl = process.env.REACT_APP_NEW_CLOUDFRONT_URL;

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("image", file);

      try {
        // 서버에 이미지 업로드
        const response = await mediaFileControllerInitializeUpload({
          entityType: "product",
          fileName: file.name,
          mimeType: file.type,
          size: file.size,
        });

        await uploadFileToS3(file, response.data?.uploadUrl || "");

        const editor = quillRef.current?.getEditor();
        const range = editor?.getSelection();
        if (range && response.data?.imgSrc) {
          editor?.insertEmbed(
            range.index,
            "image",
            cloudFrontUrl + response.data.imgSrc
          );
          editor?.setSelection(range.index + 1);
          editor?.insertText(range.index + 1, "\n");
        }

        // const reader = new FileReader();
        // reader.onload = () => {
        //   const result = reader.result as string;
        //   const editor = quillRef.current?.getEditor();
        //   const range = editor?.getSelection();
        //   if (range && result) {
        //     editor?.insertEmbed(range.index, "image", result);
        //     editor?.setSelection(range.index + 1);
        //     editor?.insertText(range.index + 1, "\n");
        //   }
        // };
        // reader.readAsDataURL(file);
      } catch (error) {
        toast.error("이미지 업로드 중 오류가 발생했습니다.");
      }
    };
  };

  console.log(value);

  const uploadFileToS3 = async (file: File, uploadUrl: string) => {
    try {
      const res = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      return true;
    } catch (error) {
      toast.error("파일 업로드에 실패했습니다.");
      return false;
    }
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ size: [] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ script: "super" }, { script: "sub" }],
          [{ header: [!1, 1, 2, 3, 4, 5, 6] }, "blockquote"],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["direction", { align: [] }],
          ["image"],
          ["code-block"],
          ["clean"],
        ],
        handlers: {
          image: handleImageUpload,
        },
      },
    }),
    []
  );

  const formats = [
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "header",
    "blockquote",
    "list",
    "indent",
    "image",
    "code-block",
    "script",
    "align",
  ];

  return (
    <ReactQuill
      ref={quillRef}
      value={value}
      onChange={onChange}
      theme="snow"
      modules={modules}
      formats={formats}
      style={{
        width: "100%",
      }}
    />
  );
};

export default QuillEditor;
