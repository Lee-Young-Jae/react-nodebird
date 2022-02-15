import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Form, Button, Input, Modal } from "antd"; // message,
import Link from "next/link";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { loginRequestAction } from "../reducers/user";
// import { LoadingOutlined } from "@ant-design/icons";

const ButtonWrapper = styled.div`
  margin-top: 10px;
`;

const FormWrapper = styled(Form)`
  padding: 10px;
  position: sticky;
  top: 4px;
`;

function warning(title, content) {
  Modal.warning({
    title: title,
    content: content,
  });
}

const LoginForm = () => {
  const dispatch = useDispatch();

  const logInLoading = useSelector((state) => state.user.logInLoading);
  const logInError = useSelector((state) => state.user.logInError);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    if (logInError) {
      // alert(logInError);
      // message.warning(logInError);
      warning("로그인 오류", logInError);
    }
  }, [logInError]);

  const ErrorStyle = useMemo(
    () => ({
      color: "red",
    }),
    []
  );

  const onChangeEmail = useCallback((e) => {
    setEmail(e.target.value);
    setPopupMessage("");
  }, []);

  const onChangePassword = useCallback((e) => {
    setPopupMessage("");
    setPassword(e.target.value);
  }, []);

  const onSubmitForm = useCallback(() => {
    if (email.trim().length < 1 || password.trim().length < 1) {
      setPopupMessage("공백은 입력 할 수 없습니다.");
      return;
    }
    dispatch(loginRequestAction({ email, password }));
  }, [email, password]);

  return (
    <FormWrapper onFinish={onSubmitForm}>
      <div>
        <label htmlFor="user-id">이메일</label>
        <br />
        <Input
          name="user-email"
          value={email}
          type={email}
          onChange={onChangeEmail}
          required
        ></Input>
      </div>
      <div>
        <label htmlFor="user-password">비밀번호</label>
        <br />
        <Input
          name="user-password"
          type="password"
          value={password}
          onChange={onChangePassword}
          required
        ></Input>
        {popupMessage ? <p style={ErrorStyle}>{popupMessage}</p> : null}
      </div>
      <ButtonWrapper>
        <Button type="primary" htmlType="submit" loading={logInLoading}>
          로그인
        </Button>
        <Link href="/signup">
          <Button>
            <a>회원가입</a>
          </Button>
        </Link>
      </ButtonWrapper>
    </FormWrapper>
  );
};

export default LoginForm;
