import React from "react";
import { Button, Card } from "antd";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { REMOVE_WEIGHT_REQUEST, removeWeightLoading } from "../reducers/user";

const HealthCard = ({ healthData }) => {
  const dispatch = useDispatch();

  const onClickRemoveBtn = () => {
    dispatch({
      type: REMOVE_WEIGHT_REQUEST,
      data: healthData.id,
    });
  };

  return (
    <>
      <Card title={healthData.referencedate} style={{ marginTop: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p>{healthData.weight + " kg"}</p>
          <Button loading={removeWeightLoading} onClick={onClickRemoveBtn}>
            삭제
          </Button>
        </div>
      </Card>
    </>
  );
};

HealthCard.propTypes = {
  healthData: PropTypes.object,
};

export default HealthCard;
