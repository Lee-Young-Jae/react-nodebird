import { createWrapper } from "next-redux-wrapper";
import { applyMiddleware, compose, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga"; // saga import (saga1)

import reducer from "../reducers";
import rootSaga from "../sagas";

const loggerMiddleware = (/*{ dispatch, getState }*/) => (next) => (action) => {
  console.log(action);
  return next(action);
};

const configureStore = () => {
  const sagaMiddleware = createSagaMiddleware(); //saga미들웨어 생성 (saga2)
  // 미들웨어와 리덕스 데브툴즈
  const middlewares = [sagaMiddleware, loggerMiddleware];
  const enhancer =
    process.env.NODE_ENV === "production"
      ? compose(applyMiddleware(...middlewares)) // 배포용일때 미들웨어
      : composeWithDevTools(applyMiddleware(...middlewares)); //개발용일때 미들웨어
  // npm i redux-devtools-extension  이게 있어야 브라우저 devtools와 연동이 된다.

  const store = createStore(reducer, enhancer);
  // store.dispatch({
  //   type: "CHANGE_NICKNAME",
  //   data: "test",
  // });
  store.sagaTask = sagaMiddleware.run(rootSaga); //saga 미들웨어 실행(saga3)
  return store;
};

//기존 getServerSideProps, getStaticProps같은 next의 라이프사이클에 redux를 결합시키는 역할
// wrapper.withRedux로 페이지를 감싸게 되면 redux가 결합된 라이프사이클을 사용할 수 있게 된다.
const wrapper = createWrapper(configureStore, {
  debug: process.env.NODE_ENV === "development",
});

export default wrapper;
