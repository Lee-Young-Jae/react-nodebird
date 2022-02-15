import { Form, Input, Modal, message } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CHANGE_NICKNAME_REQUEST } from "../reducers/user";
import useInput from "../hooks/useInput";
// import PropTypes from "prop-types";
//{ data }

const NicknameEditForm = () => {
  const style = useMemo(
    () => ({
      marginBottom: "20px",
      border: "1px solid #d9d9d9",
      padding: "20px",
    }),
    []
  );
  const { me } = useSelector((state) => {
    return state.user;
  });

  const changeNicknameDone = useSelector(
    (state) => state.user.changeNicknameDone
  );
  const [nickname, onChangeNickname] = useInput(me?.nickname || "");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isChangedNickname, setIsChangedNickname] = useState(false);
  const dispatch = useDispatch();
  const onSubmit = useCallback(() => {
    setIsModalVisible(true);
  }, [nickname]);

  const handleOk = useCallback(() => {
    dispatch({
      type: CHANGE_NICKNAME_REQUEST,
      data: nickname,
    });
    setIsModalVisible(false);
    setIsChangedNickname(true);
  }, [nickname]);

  useEffect(() => {
    if (changeNicknameDone && isChangedNickname) {
      message.success("닉네임이 성공적으로 변경되었습니다.");
      setIsChangedNickname(false);
    }
  }, [changeNicknameDone]);

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Form style={style}>
        <Input.Search
          onChange={onChangeNickname}
          addonBefore="닉네임"
          enterButton="수정"
          onSearch={onSubmit}
        ></Input.Search>
      </Form>

      <Modal
        title="정말 닉네임을 수정하시겠습니까?"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>기존 닉네임: {me.nickname}</p>
        <p>바꿀 닉네임: {nickname}</p>
      </Modal>
    </>
  );
};

// NicknameEditForm.propTypes = {
//   data: PropTypes.array.isRequired,
// };

export default NicknameEditForm;
