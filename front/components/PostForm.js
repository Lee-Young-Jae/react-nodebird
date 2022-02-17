import { Form, Input, Button, Modal } from "antd";
import React, { useCallback, useState, useRef, useEffect } from "react";
import {
  // DownloadOutlined,
  EditOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  UPLOAD_IMAGES_REQUEST,
  REMOVE_IMAGE,
  ADD_POST_REQUEST,
} from "../reducers/post";

function warning(title, content) {
  Modal.warning({
    title: title,
    content: content,
  });
}

const PostForm = () => {
  const imagePaths = useSelector((state) => state.post.imagePaths);
  const { addPostDone, addPostLoading } = useSelector((state) => state.post);
  // const id = useSelector((state) => state.user.user.id);

  const [text, setText] = useState("");
  const dispatch = useDispatch();

  const onSubmit = useCallback(() => {
    if (!text || !text.trim()) {
      warning("아무 내용도 입력하지 않았습니다.", "");
      return;
    }

    const formData = new FormData();
    imagePaths.forEach((path) => {
      formData.append("image", path); //key image  backend 에서는 req.body.image
    });
    formData.append("content", text); // key content backend 에서는 req.body.content //multer가 file인 경우엔 배열이면 req.files 싱글이면 req.file에 넣어주지만 img나 file이 아닐 경우 req.body에 넣어준다.
    // dispatch(addPost(text));
    dispatch({
      type: ADD_POST_REQUEST,
      data: formData, //사실 이미지가 없기 때문에 FormData 안써도 된다... json으로 보내도 됨
    });
  }, [text, imagePaths]);

  useEffect(() => {
    if (addPostDone) {
      setText("");
    }
  }, [addPostDone]);

  const onChangeText = useCallback((e) => {
    setText(e.target.value);
  }, []);

  const imageInput = useRef();
  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  const onChangeImages = useCallback((e) => {
    console.log("PostForm||onChangeImages||images", e.target.files);
    const imageFormData = new FormData();
    [].forEach.call(e.target.files, (f) => {
      imageFormData.append("image", f); //back의 upload.array("image") 키워드가 같아야한다.
    });
    dispatch({
      type: UPLOAD_IMAGES_REQUEST,
      data: imageFormData,
    });
  }, []);

  const onRemoveImage = useCallback(
    (index) => () => {
      dispatch({
        type: REMOVE_IMAGE,
        data: index,
      });
    },
    []
  );

  return (
    <Form
      style={{ margin: "10px 0 20px" }}
      //encType 폼 데이터(form data)가 서버로 제출될 때 해당 데이터가 인코딩되는 방법을 명시
      //multipart/form-data 모든 문자를 인코딩하지 않음을 명시. 이 방식은 <form> 요소가 파일이나 이미지를 서버로 전송할 때 주로 사용함.
      encType="multipart/form-data"
      onFinish={onSubmit}
    >
      <Input.TextArea
        value={text}
        onChange={onChangeText}
        maxLength={140}
        placeholder="어떠한 일이 있으셨나요?"
      ></Input.TextArea>
      <div>
        <input
          type="file"
          name="image"
          multiple
          hidden
          ref={imageInput}
          onChange={onChangeImages}
        ></input>
        <Button onClick={onClickImageUpload} icon={<FileImageOutlined />}>
          이미지 업로드
        </Button>
        <Button
          icon={<EditOutlined />}
          type="primary"
          style={{ float: "right" }}
          htmlType="submit"
          loading={addPostLoading}
        >
          짹짹
        </Button>
      </div>
      <div>
        {imagePaths.map((item, index) => {
          return (
            <div key={item} style={{ display: "inline-block" }}>
              <img
                src={item.replace(/\/thumb\//gi, "/original/")}
                style={{ width: "200px" }}
                alt={item.replace(/\/thumb\//gi, "/original/")}
              ></img>
              <div>
                <Button onClick={onRemoveImage(index)}>제거</Button>
              </div>
            </div>
          );
        })}
      </div>
    </Form>
  );
};

export default PostForm;
