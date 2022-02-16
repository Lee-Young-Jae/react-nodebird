import Head from "next/head";
import React, { useCallback, useState, useMemo, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import { Form, Input, Checkbox, Button, message } from "antd";
import useinput from "../hooks/useInput";
import { LOAD_MY_INFO_REQUEST, SIGN_UP_REQUEST } from "../reducers/user";
import { useDispatch, useSelector } from "react-redux";
import { LoadingOutlined } from "@ant-design/icons";
import Router from "next/router";
import wrapper from "../store/configureStore";
import axios from "axios";
import { LOAD_POSTS_REQUEST } from "../reducers/post";
import { END } from "redux-saga";

const Signup = () => {
  const dispatch = useDispatch();
  const { signUpLoading, signUpDone, signUpError, me } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (me && me.id) {
      Router.replace("/");
    }
  }, [me && me.id]);

  useEffect(() => {
    if (signUpDone) {
      Router.replace("/");
    }
  }, [signUpDone]);

  useEffect(() => {
    if (signUpError) {
      // alert(signUpError);
      message.warning(signUpError);
    }
  }, [signUpError]);

  const [email, onChangeEmail] = useinput("");
  const [nickname, onChangeNickname] = useinput("");
  const [password, onChangePassword] = useinput("");

  const [passwordCheck, setPasswordCheck] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const [term, setTerm] = useState("");
  const [termError, setTermError] = useState(false);

  const onChangeTerm = useCallback((e) => {
    setTermError(false);
    setTerm(e.target.checked);
  }, []);

  const onChangePasswordCheck = useCallback(
    (e) => {
      setPasswordCheck(e.target.value);
      setPasswordError(e.target.value !== password);
    },
    [password]
  );

  const onSubmit = useCallback(() => {
    if (password !== passwordCheck) {
      return setPasswordError(true);
    }
    if (!term) {
      return setTermError(true);
    }
    console.log(email, nickname, password);
    dispatch({
      type: SIGN_UP_REQUEST,
      data: { email, nickname, password },
    });
  }, [email, password, passwordCheck, term]);

  const passwordErrorStyle = useMemo(
    () => ({
      color: "red",
    }),
    []
  );

  const submitStyle = useMemo(
    () => ({
      marginTop: 10,
    }),
    []
  );

  return (
    <AppLayout>
      <Head>
        <title>회원가입 | 짹짹이</title>
      </Head>
      <Form onFinish={onSubmit}>
        <div>
          <label htmlFor="user-email">아이디</label>
          <br />
          <Input
            name="user-email"
            value={email}
            type={email}
            required
            onChange={onChangeEmail}
          />
        </div>
        <div>
          <label htmlFor="user-nickname">닉네임</label>
          <br />
          <Input
            name="user-nickname"
            value={nickname}
            required
            onChange={onChangeNickname}
          />
        </div>
        <div>
          <label htmlFor="user-password">비밀번호</label>
          <br />
          <Input
            name="user-password"
            value={password}
            required
            onChange={onChangePassword}
            type="password"
          />
        </div>
        <div>
          <label htmlFor="user-password-check">비밀번호 체크</label>
          <br />
          <Input
            name="user-password-check"
            type="password"
            value={passwordCheck}
            required
            onChange={onChangePasswordCheck}
          ></Input>
          {passwordError && (
            <div style={passwordErrorStyle}>비밀번호가 일치하지 않습니다.</div>
          )}
        </div>
        <div>
          <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>
            약관에 동의합니다.
          </Checkbox>
          {termError && (
            <div style={passwordErrorStyle}>약관에 동의하셔야합니다.</div>
          )}
        </div>
        <div style={submitStyle}>
          <Button
            type="primary"
            htmlType="submit"
            loading={
              signUpLoading && <LoadingOutlined style={{ fontSize: 24 }} spin />
            }
          >
            가입하기
          </Button>
        </div>
      </Form>
    </AppLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    // 서버쪽으로 쿠키를 전달하기 위한 코드. 서버쪽에서 실행되면 context.req가 존재한다.
    const cookie = context.req ? context.req.headers.cookie : "";
    axios.defaults.headers.Cookie = ""; // 쿠키 비워주기 (*중요) 로그인이 공유될 수 있음
    if (context.req && cookie) {
      //서버일때와 쿠키가 있을때만 쿠키를 전달
      axios.defaults.headers.Cookie = cookie;
    }
    // 서버사이드 렌더링 HOME이 렌더링 되기 전에 실행된다. getStaticProps도 비슷
    //context 안엔 store가 들어있음
    context.store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });

    context.store.dispatch({
      type: LOAD_POSTS_REQUEST,
    });
    context.store.dispatch(END); //REQUEST가 끝나길 기다려주는 역할
    await context.store.sagaTask.toPromise();
  }
);

export default Signup;
