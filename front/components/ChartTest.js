import React from "react";
import ReactEcharts from "echarts-for-react";
import { useSelector } from "react-redux";

const chartTest = () => {
  const { me } = useSelector((state) => state.user);

  let recentSevenDays;
  let recentMyWeight;
  if (me.Health) {
    recentSevenDays = me.Health.map((e, i) => {
      if (i >= 7) {
        return;
      }
      return e.referencedate;
    });
    recentSevenDays = recentSevenDays.reverse().filter((e) => {
      return e !== undefined;
    });

    recentMyWeight = me.Health.map((e, i) => {
      if (i >= 7) {
        return;
      }
      return e.weight;
    });

    recentMyWeight = recentMyWeight.reverse().filter((e) => {
      return e !== undefined;
    });
  }

  return (
    <>
      <ReactEcharts
        option={{
          title: {
            text: "최근 몸무게 비교",
          },
          tooltip: {
            trigger: "axis",
          },
          legend: {
            data: ["나", "유저평균"],
          },
          grid: {
            left: "3%",
            right: "8%",
            bottom: "3%",
            containLabel: true,
          },
          toolbox: {
            feature: {
              saveAsImage: {},
            },
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
            data: recentSevenDays,
          },
          yAxis: {
            type: "value",
          },
          series: [
            {
              name: "나",
              type: "line",
              // stack: "Total",
              data: recentMyWeight,
            },
            {
              name: "유저평균",
              type: "line",
              // stack: "Total",
              data: [61, 88, 52, 77, 76, 55, 40],
            },
          ],
        }}
      />
    </>
  );
};

// class chartTest extends Component {
//   render() {
//     return (
//       <ReactEcharts
//         option={{
//           title: {
//             text: "데이터 비교",
//           },
//           tooltip: {
//             trigger: "axis",
//           },
//           legend: {
//             data: [null, "Union Ads", "Video Ads"],
//           },
//           grid: {
//             left: "3%",
//             right: "4%",
//             bottom: "3%",
//             containLabel: true,
//           },
//           toolbox: {
//             feature: {
//               saveAsImage: {},
//             },
//           },
//           xAxis: {
//             type: "category",
//             boundaryGap: false,
//             data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
//           },
//           yAxis: {
//             type: "value",
//           },
//           series: [
//             {
//               name: "Email",
//               type: "line",
//               stack: "Total",
//               data: [120, 132, 101, 134, 90, 230, 210],
//             },
//             {
//               name: "Union Ads",
//               type: "line",
//               stack: "Total",
//               data: [220, 182, 191, 234, 290, 330, 310],
//             },
//             {
//               name: "Video Ads",
//               type: "line",
//               stack: "Total",
//               data: [150, 232, 201, 154, 190, 330, 410],
//             },
//           ],
//         }}
//       />
//     );
//   }
// }
export default chartTest;
