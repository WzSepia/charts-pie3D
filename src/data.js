/**
 * 数据模拟
*/

const respond = {
  data: [
    {
      name: "1.啊啊大(10%)",
      value: 10,
      color: "red",
      style: {
        fontSize: 7,
      },
    },
    {
      name: "2.特有的风格(15%)",
      value: 15,
      color: "green",
      style: {
        fontSize: 7,
      },
    },
    {
      name: "3.神工鬼斧(20%)",
      value: 20,
      color: "yellow",
      style: {
        fontSize: 7,
      },
    },
    {
      name: "4.巴马回家(25%)",
      value: 25,
      color: "blue",
      style: {
        fontSize: 7,
      },
    },
    {
      name: "5.电风扇(30%)",
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