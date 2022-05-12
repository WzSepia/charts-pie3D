# charts-pie3D
3维饼图,环形图

```javascript
//数据模拟
const respond = {
  data: [
    {
      name: "1.我是测试一(10%)",
      value: 10,
      color: "red",
      style: {
        fontSize: 7,number
      },
    },
    ...
  ],
  num: number,
  total: number,
};
/*
 * 配置
 * @param id:容器id(保证唯一)
 * @param data:图形数据
 * @param width:dom,doElement的宽度
 * @param height:dom,doElement的h高度
 * @param callback:事件配置,事件联动 fun()
 * @param help:辅助线 false:不启用;true:启用
*/
var opts = {
  id: "pie",
  data: respond,
  width: "100%",
  height: "100%", //window.innerHeight,
  callback: function (params = {}) {
    console.log("绑定点击事件,事件联动", params);
  },
  help: false,
};

//执行
initPie3D(opts);
```