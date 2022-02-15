import React, { useCallback, useState } from "react";
import { Button, DatePicker, Form, InputNumber, message, Slider } from "antd";
import { useDispatch } from "react-redux";
import { ADD_WEIGHT_REQUEST } from "../reducers/user";

// const marks = {
//   20: "20 kg",
//   200: "200kg",
// };

const HealthForm = () => {
  const dispatch = useDispatch();
  const [pickedDay, setPickedDay] = useState(null);
  const [weight, setWeight] = useState(20);

  const onChangeDay = useCallback((date, dateString) => {
    setPickedDay(dateString);
  }, []);
  const onChangeWeight = useCallback((value) => {
    setWeight(value);
  }, []);

  const onFinish = useCallback(() => {
    // console.log(pickedDay, weight);
    if (pickedDay && weight) {
      // console.log(pickedDay, weight);
      message.success("분석중입니다. 잠시만 기다려주세요!");
      dispatch({
        type: ADD_WEIGHT_REQUEST,
        data: { dateString: pickedDay, weight: weight },
      });
      return;
    }
  }, [pickedDay, weight]);

  return (
    <Form
      onFinish={onFinish}
      style={{
        border: "1px solid #f0f0f0",
        padding: "5px",
      }}
    >
      <Form.Item
        name="dayPicker"
        label="날짜"
        rules={[
          {
            required: true,
            message: "날짜를 선택해 주세요!",
          },
        ]}
      >
        <DatePicker onChange={onChangeDay} placeholder="날짜 선택" />
      </Form.Item>
      <div style={{ display: "flex", height: "40px" }}>
        <Form.Item label="몸무게" name="weight" style={{ flex: "1 0 auto" }}>
          <Slider
            value={weight}
            min={20}
            max={200}
            onChange={onChangeWeight}
            // tooltipVisible
            step={0.01}
            // marks={marks}
          />
        </Form.Item>

        <InputNumber
          min={20}
          max={200}
          style={{ margin: "0 16px", height: "30px" }}
          value={weight}
          onChange={onChangeWeight}
        />
        <div>kg</div>
      </div>
      <div
        style={{ borderBottom: "1px solid #f0f0f0", marginBottom: "7px" }}
      ></div>
      <Button htmlType="submit" style={{ magin: "0 auto" }}>
        제출
      </Button>
    </Form>
  );
};

export default HealthForm;
