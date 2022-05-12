/**
 * 数据模拟
*/

const respond = {
  data: [
    {
      name: "1.我是测试一(10%)",
      value: 10,
      color: "red",
      style: {
        fontSize: 7,
      },
    },
    {
      name: "2.你是测试二(15%)",
      value: 15,
      color: "green",
      style: {
        fontSize: 7,
      },
    },
    {
      name: "3.他是测试三(20%)",
      value: 20,
      color: "yellow",
      style: {
        fontSize: 7,
      },
    },
    {
      name: "4.谁是测试四(25%)",
      value: 25,
      color: "blue",
      style: {
        fontSize: 7,
      },
    },
    {
      name: "5.没有测试五(30%)",
      value: 30,
      color: "#f60",
      style: {
        fontSize: 7,
      },
    },
  ],
  num: 5,
  total: 100,
};

window.data = respond;

module.exports = respond; 