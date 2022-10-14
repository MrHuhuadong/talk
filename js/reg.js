(function () {
  const loginIdE = document.querySelector("#txtLoginId"); //用户名
  const nickNameE = document.querySelector("#txtNickname"); //昵称
  const loginPwdE = document.querySelector("#txtLoginPwd"); //密码
  const regBtnE = document.querySelector(".submit"); //注册
  const loginPwd1E = document.querySelector("#txtLoginPwdConfirm");
  console.log(loginIdE.innerText);

  //防抖函数
  function debounce(fn, ms) {
    let timer = null;
    return function (...args) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, ms);
    };
  }
  //账号输入框变化时触发的事件
  async function prin() {
    if (!loginIdE.value) {
      return;
    }
    const resp = await API.get("/api/user/exists?loginId=" + loginIdE.value);
    const result = await resp.json();
    if (result.data) {
      loginIdE.nextElementSibling.innerText = "该账号已被注册！！";
    } else {
      loginIdE.nextElementSibling.innerText = "";
    }
    console.log(result);
  }
  loginIdE.addEventListener("input", debounce(prin, 700));

  //第二次确认密码事件
  function pwdAgain() {
    if (loginPwd1E.value !== loginPwdE.value) {
      loginPwd1E.nextElementSibling.innerText = "密码不一致！";
    } else {
      loginPwd1E.nextElementSibling.innerText = "";
    }
  }
  loginPwd1E.addEventListener("input", debounce(pwdAgain, 700));

  //阻止注册按钮a标签的默认行为
  // let loginObj = {};
  regBtnE.addEventListener("click", function (e) {
    e.preventDefault();
    if (!loginIdE.value) {
      loginIdE.nextElementSibling.innerText = "账号不能为空";
    } else {
      loginIdE.nextElementSibling.innerText = "";
    }
    if (!nickNameE.value) {
      nickNameE.nextElementSibling.innerText = "昵称不能为空";
    } else {
      nickNameE.nextElementSibling.innerText = "";
    }
    if (!loginPwdE.value) {
      loginPwdE.nextElementSibling.innerText = "密码不能为空";
    } else {
      loginPwdE.nextElementSibling.innerText = "";
    }
    if (!loginPwd1E.value) {
      loginPwd1E.nextElementSibling.innerText = "密码不能为空";
    } else {
      loginPwd1E.nextElementSibling.innerText = "";
    }
    var aa = debounce(prin, 700);
    // aa();

    const errs = document.querySelectorAll(".err");
    let active = false;
    async function te() {
      const resp = await API.post("/api/user/reg", {
        loginId: loginIdE.value,
        nickname: nickNameE.value,
        loginPwd: loginPwdE.value,
      });
      resulr = await resp.json();
      if (resulr.msg === "") {
        active = true;
        open("./login.html", "_self");

        console.log(" no Error");
      } else {
        active = false;
        console.log(resulr.msg);
      }
    }

    var msgs = te();
    if (active) {
      // open("./login.html");
      console.log(" open");
    }
    //   console.log(msgs);
    //   if (te().msg === "") {
    //     console.log("没有错误");
    //   } else {
    //     console.log(te().msg);
    //   }
    //   console.log(resp);
    //   let nickName = nickNameE.value;
    //   let loginId = loginIdE.value;
    //   let loginPwd = loginPwdE.value;
    //   const loginObj = { loginId, nickName, loginPwd };
    //   console.log(loginObj);
  });
  // console.log()
})();
