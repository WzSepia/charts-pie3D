/**
 * 数据模拟
*/

const respond = {
  data: [
    {
      name: "1.啊啊大",
      value: 10,
      color: "red",
      style: {
        fontSize: 7,
      },
    },
    {
      name: "2.特有的风格",
      value: 20,
      color: "green",
      style: {
        fontSize: 7,
      },
    },
    {
      name: "3.神工鬼斧",
      value: 10,
      color: "yellow",
      style: {
        fontSize: null,
      },
    },
    {
      name: "4.巴马回家",
      value: 55,
      color: "blue",
      style: {
        fontSize: 9,
      },
    },
    {
      name: "5.电风扇(100%)",
      value: 5,
      color: "#f60",
      style: {
        fontSize: null,
      },
    },
  ],
  num: 5,
  total: 100,
};

window.data = respond;

module.exports = respond; 