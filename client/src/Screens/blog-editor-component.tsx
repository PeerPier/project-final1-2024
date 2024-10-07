import { Link } from "react-router-dom";
import logoKKU from "../pic/logo-head.jpg";
import "../misc/blogEdit.css";
import AnimationWrapper from "./page-animation";
import defaultBanner from "../pic/blog banner.png";
import { uploadImage } from "../common/b2";
import { useContext, useEffect, useRef } from "react";
import { Toaster, toast } from "react-hot-toast";
import { EditorContext } from "./editor-page";
import EditorJS from "@editorjs/editorjs";
import { tools } from "./tools.component";

const BlogEditor = () => {
  const editorContext = useContext(EditorContext);

  if (!editorContext) {
    throw new Error("EditorContext must be used within an EditorProvider");
  }
  let {
    blog,
    blog: { topic, banner, content, tags, des },
    setBlog,
    textEditor,
    setTextEditor,
    setEditorState,
  } = editorContext;

  useEffect(() => {
    setTextEditor(
      new EditorJS({
        holder: "textEditor",
        data: content,
        tools: tools,
        placeholder: "มาเขียนเรื่องราวสุดเจ๋งกันเถอะ!",
      })
    );
  }, []);

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const img = e.target.files?.[0];
    const loadingToast = toast.loading("Uploading...");
    if (img) {
      uploadImage(img) // ถ้ามีไฟล์เรียกใช้ uploadImage
        .then((url) => {
          if (url) {
            toast.dismiss(loadingToast);
            toast.success("Uploaded!");
            setBlog({ ...blog, banner: url }); // อัพเดต state ของ blog
          }
        })
        .catch((err) => {
          toast.dismiss(loadingToast);
          return toast.error(err.message || "Error uploading image."); // แสดงข้อความผิดพลาด
        });
    } else {
      toast.dismiss(loadingToast);
      toast.error("Please select an image."); // แจ้งเตือนถ้าไม่มีการเลือกไฟล์
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target;

    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";

    setBlog({ ...blog, topic: input.value });
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    let img = e.currentTarget;
    img.src = defaultBanner;
  };

  const handlePublishEvent = () => {
    if (textEditor) {
      // ตรวจสอบว่า textEditor ไม่เป็น null
      textEditor
        .save()
        .then((data) => {
          setBlog({ ...blog, content: data });
          setEditorState("เผยแพร่");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.error("Text editor is not initialized.");
    }
  };

  // const handlePublishEvent = () => {
  //   if (!banner.length) {
  //     return toast.error("upload a blog banner to publish it");
  //   }

  //   if (!topic.length) {
  //     return toast.error("write blog topic to publish it");
  //   }

  //   if (textEditor?.isReady) {
  //     textEditor
  //       .save()
  //       .then((data) => {
  //         if (data.blocks.length) {
  //           setBlog({ ...blog, content: data });
  //           setEditorState("เผยแพร่");
  //         } else {
  //           return toast.error("เขียนบางอย่างในบล็อกเพื่อเเผยแพร่");
  //         }
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }
  // };

  return (
    <>
      <nav className="navbar-navbar">
        <Link to="/" className="logo-link">
          <img src={logoKKU} alt="" className="logo-img" />
        </Link>

        <p className=" new-blog">{topic.length ? topic : "บล็อกใหม่"}</p>

        <div className="d-flex gap-4" style={{ marginLeft: "auto" }}>
          <button className="btn-dark py-2" onClick={handlePublishEvent}>
            เผยแพร่
          </button>
          <button className="btn-light py-2">บันทึกร่าง</button>
        </div>
      </nav>
      <Toaster />

      <AnimationWrapper>
        <section>
          <div className="Banner-divhost">
            <div className="Banner-div ">
              <label htmlFor="uploadBanner">
                <img
                  src={banner}
                  alt=""
                  style={{ zIndex: "20" }}
                  onError={handleError}
                />
                <input
                  id="uploadBanner"
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  hidden
                  onChange={handleBannerUpload}
                />
              </label>
            </div>

            <textarea
              defaultValue={topic}
              placeholder="Blog Title"
              className="custom-textarea"
              onKeyDown={handleTitleKeyDown}
              onChange={handleTitleChange}
            ></textarea>

            <hr className="w-100 my-5" style={{ opacity: "0.1" }} />

            <div id="textEditor"></div>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default BlogEditor;
