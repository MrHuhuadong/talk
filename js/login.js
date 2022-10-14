(function () {
  const loginIdE = document.querySelector("#txtLoginId");
  const loginPwdE = document.querySelector("#txtLoginPwd");
  const loginBtn = document.querySelector(".submit");
  //阻止登录按钮的默认事件
  loginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const loginId = loginIdE.value;
    const loginPwd = loginPwdE.value;
    const loginUser = { loginId, loginPwd };
    // 以下if语句用来判断用户名和密码是否为空
    let ok = true;
    if (!loginIdE.value) {
      loginIdE.nextElementSibling.innerText = "账号不能为空";
      ok = false;
    } else {
      loginIdE.nextElementSibling.innerText = "";
    }
    if (!loginPwdE.value) {
      ok = false;
      loginPwdE.nextElementSibling.innerText = "密码不能为空";
    } else {
      loginPwdE.nextElementSibling.innerText = "";
    }
    if (ok) {
      (async () => {
        const resp = await API.post("/api/user/login", loginUser);
        const result = await resp.json();
        const token = resp.headers.get("authorization");
        if (token) {
          localStorage.setItem("token", token);
        }
        // console.log(resp.headers.get("authorization"));
        if (result.msg) {
          loginIdE.nextElementSibling.innerText = result.msg;
          loginPwdE.nextElementSibling.innerText = result.msg;
        } else {
          window.open("./login.html");
          // console.log(loginUser);
        }
      })();
    }
  });
  // console.log(loginIdE);
})();
