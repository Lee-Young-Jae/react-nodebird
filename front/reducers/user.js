import produce from "immer";

export const initialState = {
  loadMyInfoLoading: false, // 내 유저 정보 가져오기 시도중
  loadMyInfoDone: false,
  loadMyInfoError: null,
  loadUserLoading: false, // 다른 유저 정보 가져오기 시도중
  loadUserDone: false,
  loadUserError: null,
  followLoading: false, // 팔로우 시도중
  followDone: false,
  followError: null,
  followLoadingUserId: null,
  unfollowLoading: false, // 언팔로우 시도중
  unfollowDone: false,
  unfollowError: null,
  removeFollowerLoading: false, // 팔로우 차단 시도중 (프로필 페이지)
  removeFollowerDone: false,
  removeFollowerError: null,
  unfollowLoadingUserId: null,
  loadfollowersLoading: false, // 팔로워 가져오기 시도중
  loadfollowersDone: false,
  loadfollowersError: null,
  loadfollowingsLoading: false, // 팔로윙 가져오기 시도중
  loadfollowingsDone: false,
  loadfollowingsError: null,
  logInLoading: false, // 로그인 시도중
  logInDone: false,
  logInError: null,
  logOutLoading: false, // 로그아웃 시도중
  logOutDone: false, // 로그아웃 완료
  logOutError: null,
  signUpLoading: false, // 회원가입 시도중
  signUpDone: false,
  signUpError: null,
  changeNicknameLoading: false, // 닉네임 변경 시도중
  changeNicknameDone: false,
  changeNicknameError: null,
  addWeightLoading: false, // 몸무게 입력중
  addWeightDone: false,
  addWeightError: null,
  removeWeightLoading: false, // 몸무게 삭제중
  removeWeightDone: false,
  removeWeightError: null,
  me: null,
  userInfo: null,
  // signUpData: {},
  // loginData: {},
};

// export const loginAction = (data) => {
//   return (dispatch, getState) => {
//     const state = getState();
//     dispatch(loginRequestAction());

//     dispatch(loginRequestAction());
//     axios
//       .post("/api/login")
//       .then((res) => {
//         dispatch(loginSuccessAction(res.data));
//       })
//       .catch((err) => {
//         dispatch(loginFailureAction(err));
//       });
//   };
// };

export const ADD_WEIGHT_REQUEST = "ADD_WEIGHT_REQUEST";
export const ADD_WEIGHT_SUCCESS = "ADD_WEIGHT_SUCCESS";
export const ADD_WEIGHT_FAILURE = "ADD_WEIGHT_FAILURE";

export const REMOVE_WEIGHT_REQUEST = "REMOVE_WEIGHT_REQUEST";
export const REMOVE_WEIGHT_SUCCESS = "REMOVE_WEIGHT_SUCCESS";
export const REMOVE_WEIGHT_FAILURE = "REMOVE_WEIGHT_FAILURE";

export const LOAD_MY_INFO_REQUEST = "LOAD_MY_INFO_REQUEST";
export const LOAD_MY_INFO_SUCCESS = "LOAD_MY_INFO_SUCCESS";
export const LOAD_MY_INFO_FAILURE = "LOAD_MY_INFO_FAILURE";

export const LOAD_USER_REQUEST = "LOAD_USER_REQUEST";
export const LOAD_USER_SUCCESS = "LOAD_USER_SUCCESS";
export const LOAD_USER_FAILURE = "LOAD_USER_FAILURE";

export const LOG_IN_REQUEST = "LOG_IN_REQUEST";
export const LOG_IN_SUCCESS = "LOG_IN_SUCCESS";
export const LOG_IN_FAILURE = "LOG_IN_FAILURE";

export const LOG_OUT_REQUEST = "LOG_OUT_REQUEST";
export const LOG_OUT_SUCCESS = "LOG_OUT_SUCCESS";
export const LOG_OUT_FAILURE = "LOG_OUT_FAILURE";

export const SIGN_UP_REQUEST = "SIGN_UP_REQUEST";
export const SIGN_UP_SUCCESS = "SIGN_UP_SUCCESS";
export const SIGN_UP_FAILURE = "SIGN_UP_FAILURE";

export const CHANGE_NICKNAME_REQUEST = "CHANGE_NICKNAME_REQUEST";
export const CHANGE_NICKNAME_SUCCESS = "CHANGE_NICKNAME_SUCCESS";
export const CHANGE_NICKNAME_FAILURE = "CHANGE_NICKNAME_FAILURE";

export const FOLLOW_REQUEST = "FOLLOW_REQUEST";
export const FOLLOW_SUCCESS = "FOLLOW_SUCCESS";
export const FOLLOW_FAILURE = "FOLLOW_FAILURE";

export const UNFOLLOW_REQUEST = "UNFOLLOW_REQUEST";
export const UNFOLLOW_SUCCESS = "UNFOLLOW_SUCCESS";
export const UNFOLLOW_FAILURE = "UNFOLLOW_FAILURE";

export const LOAD_FOLLOWERS_REQUEST = "LOAD_FOLLOWERS_REQUEST";
export const LOAD_FOLLOWERS_SUCCESS = "LOAD_FOLLOWERS_SUCCESS";
export const LOAD_FOLLOWERS_FAILURE = "LOAD_FOLLOWERS_FAILURE";

export const LOAD_FOLLOWINGS_REQUEST = "LOAD_FOLLOWINGS_REQUEST";
export const LOAD_FOLLOWINGS_SUCCESS = "LOAD_FOLLOWINGS_SUCCESS";
export const LOAD_FOLLOWINGS_FAILURE = "LOAD_FOLLOWINGS_FAILURE";

export const REMOVE_FOLLOWER_REQUEST = "REMOVE_FOLLOWER_REQUEST";
export const REMOVE_FOLLOWER_SUCCESS = "REMOVE_FOLLOWER_SUCCESS";
export const REMOVE_FOLLOWER_FAILURE = "REMOVE_FOLLOWER_FAILURE";

export const ADD_POST_TO_ME = "ADD_POST_TO_ME";
export const REMOVE_POST_OF_ME = "REMOVE_POST_OF_ME";

// const dummyUser = (data) => ({
//   ...data,
//   id: 1,
//   nickname: "오리",
//   Posts: [{ id: 1 }], //시퀄라이즈에서 합쳐주기 때문에 대문자
//   Followings: [{ nickname: "test" }],
//   Followers: [],
// });

export const loginRequestAction = (data) => {
  return {
    type: LOG_IN_REQUEST,
    data,
  };
};
// ################ 사가에서 호출해 주기 때문에 필요 없다. #######
// export const loginSuccessAction = (data) => {
//   return {
//     type: "LOG_IN_SUCCESS",
//     data,
//   };
// };

// export const loginFailureAction = (data) => {
//   return {
//     type: "LOG_IN_FAILURE",
//     data,
//   };
// };
// ###############################################################
export const logoutRequestAction = () => {
  return {
    type: LOG_OUT_REQUEST,
  };
};

export const logoutSuccessAction = () => {
  return {
    type: LOG_OUT_SUCCESS,
  };
};

export const logoutFailureAction = () => {
  return {
    type: LOG_OUT_FAILURE,
  };
};

const reducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case ADD_WEIGHT_REQUEST:
        draft.addWeightLoading = true;
        draft.addWeightError = null;
        draft.addWeightDone = false;
        break;
      case ADD_WEIGHT_SUCCESS:
        draft.addWeightLoading = false;
        draft.addWeightDone = true;
        draft.me.Health = action.data;
        break;
      case ADD_WEIGHT_FAILURE:
        draft.addWeightLoading = false;
        draft.addWeightError = action.error;
        break;
      case REMOVE_WEIGHT_REQUEST:
        draft.removeWeightLoading = true;
        draft.removeWeightError = null;
        draft.removeWeightDone = false;
        break;
      case REMOVE_WEIGHT_SUCCESS:
        draft.removeWeightLoading = false;
        draft.removeWeightDone = true;
        draft.me.Health = action.data;
        break;
      case REMOVE_WEIGHT_FAILURE:
        draft.removeWeightLoading = false;
        draft.removeWeightError = action.error;
        break;
      case LOAD_MY_INFO_REQUEST:
        draft.loadMyInfoLoading = true;
        draft.loadMyInfoError = null;
        draft.loadMyInfoDone = false;
        break;
      case LOAD_MY_INFO_SUCCESS:
        draft.loadMyInfoLoading = false;
        draft.loadMyInfoDone = true;
        draft.me = action.data;
        break;
      case LOAD_MY_INFO_FAILURE:
        draft.loadMyInfoLoading = false;
        draft.loadMyInfoError = action.error;
        break;
      case LOAD_USER_REQUEST:
        draft.loadUserLoading = true;
        draft.loadUserError = null;
        draft.loadUserDone = false;
        break;
      case LOAD_USER_SUCCESS:
        draft.loadUserLoading = false;
        draft.userInfo = action.data;
        draft.loadUserDone = true;
        break;
      case LOAD_USER_FAILURE:
        draft.loadUserLoading = false;
        draft.loadUserError = action.error;
        break;
      case LOG_IN_REQUEST:
        draft.logInLoading = true;
        draft.logInError = null;
        draft.logInDone = false;
        break;
      case LOG_IN_SUCCESS:
        draft.logInLoading = false;
        draft.logInDone = true;
        draft.me = action.data;
        break;
      case LOG_IN_FAILURE:
        draft.logInLoading = false;
        draft.logInError = action.error;
        break;
      case LOG_OUT_REQUEST:
        draft.logOutLoading = true;
        draft.logOutDone = false;
        draft.logOutError = null;
        break;
      case LOG_OUT_SUCCESS:
        draft.logOutLoading = false;
        draft.logOutDone = true;
        draft.me = null;
        draft.signUpDone = false;
        break;
      case LOG_OUT_FAILURE:
        draft.logOutLoading = false;
        draft.logOutError = action.error;
        break;
      case SIGN_UP_REQUEST:
        draft.signUpLoading = true;
        draft.signUpDone = false;
        draft.signUpError = null;
        break;
      case SIGN_UP_SUCCESS:
        draft.signUpLoading = false;
        draft.signUpDone = true;
        draft.signUpError = null;
        break;
      case SIGN_UP_FAILURE:
        draft.signUpLoading = false;
        draft.signUpError = action.error;
        break;
      case CHANGE_NICKNAME_REQUEST:
        draft.changeNicknameLoading = true;
        draft.changeNicknameDone = false;
        draft.changeNicknameError = null;
        break;
      case CHANGE_NICKNAME_SUCCESS:
        draft.changeNicknameLoading = false;
        draft.changeNicknameDone = true;
        draft.me.nickname = action.data.nickname;
        break;
      case CHANGE_NICKNAME_FAILURE:
        draft.changeNicknameLoading = false;
        draft.changeNicknameError = action.error;
        break;
      case ADD_POST_TO_ME:
        draft.me.Posts.unshift({ id: action.data });
        break;
      // return {
      //   ...state,
      //   me: {
      //     ...state.me,
      //     Posts: [{ id: action.data }, ...state.me.Posts],
      //   },
      // };
      case REMOVE_POST_OF_ME:
        draft.me.Posts = draft.me.Posts.filter((e) => e.id !== action.data);
        break;
      // return {
      //   ...state,
      //   me: {
      //     ...state.me,
      //     Posts: state.me.Posts.filter((e) => e.id !== action.data),
      //   },
      // };
      case FOLLOW_REQUEST:
        draft.followLoading = true;
        draft.followLoadingUserId = action.data;
        draft.followDone = false;
        draft.followError = null;
        break;
      case FOLLOW_SUCCESS:
        draft.followLoading = false;
        draft.followDone = true;
        draft.me.Followings.push({ id: action.data.UserId });
        draft.followLoadingUserId = null;
        break;
      case FOLLOW_FAILURE:
        draft.followLoading = false;
        draft.followError = action.error;
        draft.followLoadingUserId = null;
        break;
      case UNFOLLOW_REQUEST:
        draft.unfollowLoading = true;
        draft.unfollowDone = false;
        draft.unfollowError = null;
        draft.unfollowLoadingUserId = action.data;
        break;
      case UNFOLLOW_SUCCESS:
        draft.unfollowLoading = false;
        draft.unfollowDone = true;
        draft.me.Followings = draft.me.Followings.filter(
          (e) => e.id !== action.data.UserId
        );
        draft.unfollowLoadingUserId = null;
        break;
      case UNFOLLOW_FAILURE:
        draft.unfollowLoading = false;
        draft.unfollowError = action.error;
        draft.unfollowLoadingUserId = null;
        break;
      case REMOVE_FOLLOWER_REQUEST:
        draft.removeFollowerLoading = true;
        draft.removeFollowerDone = false;
        draft.removeFollowerError = null;
        break;
      case REMOVE_FOLLOWER_SUCCESS:
        draft.removeFollowerLoading = false;
        draft.removeFollowerDone = true;
        draft.me.Followers = draft.me.Followers.filter(
          (e) => e.id !== action.data.UserId
        );
        break;
      case REMOVE_FOLLOWER_FAILURE:
        draft.removeFollowerLoading = false;
        draft.removeFollowerError = action.error;
        break;

      case LOAD_FOLLOWERS_REQUEST:
        draft.loadfollowersLoading = true;
        draft.loadfollowersDone = false;
        draft.loadfollowersError = null;
        break;
      case LOAD_FOLLOWERS_SUCCESS:
        draft.loadfollowersLoading = false;
        draft.loadfollowersDone = true;
        draft.me.Followers = action.data;
        break;
      case LOAD_FOLLOWERS_FAILURE:
        draft.loadfollowersLoading = false;
        draft.loadfollowersError = action.error;
        break;
      case LOAD_FOLLOWINGS_REQUEST:
        draft.loadfollowingsLoading = true;
        draft.loadfollowingsDone = false;
        draft.loadfollowingsError = null;
        break;
      case LOAD_FOLLOWINGS_SUCCESS:
        draft.loadfollowingsLoading = false;
        draft.loadfollowingsDone = true;
        draft.me.Followings = action.data;
        break;
      case LOAD_FOLLOWINGS_FAILURE:
        draft.loadfollowingsLoading = false;
        draft.loadfollowingsError = action.error;
        break;
      default:
        break;
    }
  });
};
export default reducer;
