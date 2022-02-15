import { HYDRATE } from "next-redux-wrapper";

import user from "./user.js";
import post from "./post.js";
import { combineReducers } from "redux";

// 초기화 할때 user와 post로 쪼갰다. user.js와 post.js를 생성
// const initialState = {
//   user: {},
//   post: {},
// };

//비동기 액션 creator

//동적 액션 생성 action creator
const ChangeNickname = (data) => {
  return {
    type: "CHANGE_NICKNAME",
    data,
  };
};

ChangeNickname("tester");

// action
// const changeNickname = {
//   type: "CHANGE_NICKNAME",
//   data: "Admin",
// };

// reducer
// (이전 상태, 액션) => {을 가지고 다음 상태를 만들어주는 함수}
// const rootReducer = (state = initialState, action) => { reducer 쪼개지 않을때의 파라미터
// const rootReducer = combineReducers({
//   // 리덕스 서버 사이드 렌더링을 위해 HYDRATE를 넣어주기 위해선
//   // index도 아래처럼 넣어줘야한다. HYDRATE를 위해 REDUCER을 추가
//   index: (state = {}, action) => {
//     switch (action.type) {
//       case HYDRATE:
//         // console.log("HYDRATE", action);
//         return { ...state, ...action.payload };
//       default:
//         return state;
//     }
//   },
//   user,
//   post,
// });
// 위의 rootReducer를 확장 가능할 수 있게 아래 함수로 변경 (HYDRATE를 바깥으로 꺼내오기 위함.)
const rootReducer = (state, action) => {
  switch (action.type) {
    case HYDRATE:
      console.log("HYDRATE", action);
      return action.payload;
    default: {
      const combinedReducer = combineReducers({
        user,
        post,
      });
      return combinedReducer(state, action);
    }
  }
};

export default rootReducer;
