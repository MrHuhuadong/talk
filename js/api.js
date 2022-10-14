var API = (function () {
  // 封装get
  function get(path) {
    const headers = {};
    const token = localStorage.getItem("token");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return fetch(BASE_URL + path, { headers });
  }
  // 封装post
  function post(path, body) {
    const headers = {
      "Content-Type": "application/json",
    };
    const token = localStorage.getItem("token");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return fetch(BASE_URL + path, {
      headers,
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  // 注册函数
  const user = { loginId: "h", nickname: "兜", loginPwd: "123" }; //用户信息
  const BASE_URL = "https://study.duyiedu.com";
  async function reg(userInfo) {
    //
    const rspe = await post("/api/user/reg", userInfo);
    return await rspe.json();
  }
  // reg(user).then((rsp) => {
  //   if (!rsp.code) {
  //     console.log("注册成功");
  //     console.log(rsp);
  //   } else {
  //     console.log(rsp.msg);
  //   }
  // });
  // 登陆函数
  const loginUser = { loginId: "h", loginPwd: "123" }; //用户信息

  async function login(loginInfo) {
    const resp = await post("/api/user/login", loginInfo);
    const result = await resp.json();
    if (result.code === 0) {
      const token = resp.headers.get("authorization");
      if (token) {
        localStorage.setItem("token", token);
      }
      return result;
    }
  }
  //   login(loginUser).then((response) => console.log(response));
  // 验证账号是否存在
  async function exists(loginId) {
    const resp = await get("/api/user/exists?loginId=" + loginId);
    return await resp.json();
  }
  //   exists("ha1").then((response) => console.log(response));

  //查看当前登录用户信息
  async function profile() {
    const resp = await get("/api/user/profile");
    return resp.json();
  }
  //   profile().then((response) => console.log(response));
  // 发送消息函数
  async function sendChat(content) {
    const resp = await post("/api/chat", { content });
    return await resp.json();
  }
  //   sendChat("你挺牛逼啊").then((response) => console.log(response.data.content));
  // 获取历史消息
  async function getHistory() {
    const resp = await get("/api/chat/history");
    return await resp.json();
  }
  // getHistory().then((response) => {
  //   for (const item of response.data) {
  //     if (item.from === "h") {
  //       console.log("我:" + item.content);
  //     } else {
  //       console.log("机器人:" + item.content);
  //     }
  //   }
  // });
  //退出登录
  function loginOut() {
    localStorage.removeItem("token");
    //页面刷新跳转
    // window.location.reload();
  }
  //返回一个对象，把要使用的数据放进去
  return {
    get,
    post,
    reg,
    login,
    exists,
    profile,
    sendChat,
    getHistory,
    loginOut,
  };
})();
