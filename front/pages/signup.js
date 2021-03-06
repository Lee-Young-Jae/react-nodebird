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
        <title>???????????? | ?????????</title>
      </Head>
      <Form onFinish={onSubmit}>
        <div>
          <label htmlFor="user-email">?????????</label>
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
          <label htmlFor="user-nickname">?????????</label>
          <br />
          <Input
            name="user-nickname"
            value={nickname}
            required
            onChange={onChangeNickname}
          />
        </div>
        <div>
          <label htmlFor="user-password">????????????</label>
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
          <label htmlFor="user-password-check">???????????? ??????</label>
          <br />
          <Input
            name="user-password-check"
            type="password"
            value={passwordCheck}
            required
            onChange={onChangePasswordCheck}
          ></Input>
          {passwordError && (
            <div style={passwordErrorStyle}>??????????????? ???????????? ????????????.</div>
          )}
        </div>
        <div>
          <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>
            ????????? ???????????????.
          </Checkbox>
          {termError && (
            <div style={passwordErrorStyle}>????????? ????????????????????????.</div>
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
            ????????????
          </Button>
        </div>
      </Form>
    </AppLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    // ??????????????? ????????? ???????????? ?????? ??????. ??????????????? ???????????? context.req??? ????????????.
    const cookie = context.req ? context.req.headers.cookie : "";
    axios.defaults.headers.Cookie = ""; // ?????? ???????????? (*??????) ???????????? ????????? ??? ??????
    if (context.req && cookie) {
      //??????????????? ????????? ???????????? ????????? ??????
      axios.defaults.headers.Cookie = cookie;
    }
    // ??????????????? ????????? HOME??? ????????? ?????? ?????? ????????????. getStaticProps??? ??????
    //context ?????? store??? ????????????
    context.store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });

    context.store.dispatch({
      type: LOAD_POSTS_REQUEST,
    });
    context.store.dispatch(END); //REQUEST??? ????????? ??????????????? ??????
    await context.store.sagaTask.toPromise();
  }
);

export default Signup;
