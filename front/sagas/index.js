import { all, fork } from "redux-saga/effects";
// all fork, call, put, take == 사가의 이펙트
import postSaga from "./post";
import userSaga from "./user";
import axios from "axios";
import { backUrl } from "../config/config";

axios.defaults.baseURL = backUrl; //"http://localhost:3065"
axios.defaults.withCredentials = true; //사가에서 보내는 axios 요청들엔 withCredentials가 true로 공통적으로 들어간다. 서버와 쿠키 전달을 위함

// ============ 이벤트 등록 ============
export default function* rootSaga() {
  //보통 root saga를 하나 만들어 놓고
  yield all([
    fork(userSaga),
    fork(postSaga), //비동기 액션들을 추가해준다.
  ]);
}

// ====================================
