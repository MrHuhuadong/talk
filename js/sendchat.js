(() => {
  // 获取要使用到的dom
  const txtMsg = document.querySelector("#txtMsg"); //输入的信息
  const chatContainer = document.querySelector(".chat-container"); //消息界面
  const meMsg = document.querySelector(".me"); //消息界面中我的消息
  const replyMsg = document.querySelectorAll(".chat-item"); //所有消息
  const sendMsgBtn = document.querySelector("button"); //发送按钮
  const containerBox = document.querySelector(".container"); //发送按钮
  const asideName = document.querySelector(".aside-name");
  const asideAcount = document.querySelector(".aside-account");
  //   console.log(Date());
  //   (async () => {
  //     const resp = await API.post("/api/user/login", loginUser);
  //     const result = await resp.json();
  //   })();
  //点击关闭按钮，聊天窗口关闭，退出登录，回到登录页
  const closeBtn = document.querySelector(".icon-close"); //关闭按钮
  closeBtn.addEventListener("click", () => {
    API.loginOut();
    window.open("./login.html", "_blank");
  });
  //获取用户信息，将获取到的用户信息加到指定位置
  async function getUser() {
    const resp = await API.get("/api/user/profile");
    const userInformation = await resp.json();
    asideName.innerText = "账号：" + userInformation.data.loginId;
    asideAcount.innerText = "昵称：" + userInformation.data.nickname;
  }
  getUser();

  //开始先获取聊天历史记录，插入到页面
  async function getHistoryMessage() {
    const resp = await API.get("/api/chat/history");
    const historyMessage = await resp.json();
    console.log(historyMessage.data);
    for (let i = 0; i < historyMessage.data.length; i++) {
      //判断from是否有值，有的话则是用户的消息，反之
      if (historyMessage.data[i].from) {
        console.log(historyMessage.data[i].createdAt);
        let contentMesages = document.createElement("div"); // 创建一个消息框
        contentMesages.classList.add("chat-item", "me"); //给消息框添加类，方便应用CSS样式
        contentMesages.innerHTML = `<img class="chat-avatar" src="./asset/avatar.png" />
    <div class="chat-content">${historyMessage.data[i].content}</div>
    <div class="chat-date">${formatTime(historyMessage.data[i].createdAt)}</div>`; //将消息内容放到消息框内
        // txtMsg.value = "";
        chatContainer.append(contentMesages); //将消息框插入到页面
      } else {
        let contentMesages1 = document.createElement("div"); // 创建一个消息框
        contentMesages1.classList.add("chat-item"); //给消息框添加类，方便应用CSS样式
        contentMesages1.innerHTML = `<img class="chat-avatar" src="./asset/robot-avatar.jpg"  />
    <div class="chat-content">${historyMessage.data[i].content}</div>
    <div class="chat-date">${formatTime(historyMessage.data[i].createdAt)}</div>`; //将消息内容放到消息框内
        chatContainer.append(contentMesages1); //将消息框插入到页面
      }
    }
  }

  getHistoryMessage().then(() => {
    //当消息更新到页面中后，事滚动条到最后
    let chatContainerScroll = document.querySelector(".chat-container");
    chatContainerScroll.scrollTop = chatContainerScroll.scrollHeight; //
  });

  //格式化时间
  function formatTime(timer) {
    let date = new Date();
    date.setTime(timer);
    const year = date.getFullYear();
    const mounth = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
    const day = date.getDate() >= 10 ? date.getDate() : "0" + date.getDate();
    const hours = date.getHours() >= 10 ? date.getHours() : "0" + date.getHours();
    const minutes = date.getMinutes() >= 10 ? date.getMinutes() : "0" + date.getMinutes();
    const seconds = date.getSeconds() >= 10 ? date.getSeconds() : "0" + date.getSeconds();
    return `${year}-${mounth}-${day} ${hours}:${minutes}:${seconds}`;
  }

  //点击按钮发送消息
  sendMsgBtn.addEventListener("click", (e) => {
    e.preventDefault(); //阻止按钮的默认事件
    const mesagesTime = Date.now();
    const userTimes = formatTime(mesagesTime); //用户发消息时间
    const content = txtMsg.value; //获取输入框的信息
    const contentObj = { content }; //把获取的信息放入对象，为后面ajax上传数据准备
    let contentMesages = document.createElement("div"); // 创建一个消息框
    contentMesages.classList.add("chat-item", "me"); //给消息框添加类，方便应用CSS样式
    contentMesages.innerHTML = `<img class="chat-avatar" src="./asset/avatar.png" />
    <div class="chat-content">${content}</div>
    <div class="chat-date">${userTimes}</div>`; //将消息内容放到消息框内
    txtMsg.value = "";
    chatContainer.append(contentMesages); //将消息框插入到页面

    let chatContainerScroll = document.querySelector(".chat-container");
    chatContainerScroll.scrollTop = chatContainerScroll.scrollHeight; //使滚动条距离上，等于滚动条总高度

    //向聊天接口发送POST请求
    async function postMesage() {
      // ajax 将获取到的文本数据，再接口
      if (contentObj === "") {
        return;
      }
      const mesages = await API.post("/api/chat", contentObj);
      const allMessages = await mesages.json();
      const robotTimes = formatTime(allMessages.data.createdAt); //机器人回复时间
      let contentMesages1 = document.createElement("div"); // 创建一个消息框
      contentMesages1.classList.add("chat-item"); //给消息框添加类，方便应用CSS样式
      contentMesages1.innerHTML = `<img class="chat-avatar" src="./asset/robot-avatar.jpg"  />
    <div class="chat-content">${allMessages.data.content}</div>
    <div class="chat-date">${robotTimes}</div>`; //将消息内容放到消息框内
      chatContainer.append(contentMesages1); //将消息框插入到页面
    }

    //执行完POST请求后，使滚动条距离上，等于滚动条总高度
    postMesage().then(() => {
      let chatContainerScroll = document.querySelector(".chat-container");
      chatContainerScroll.scrollTop = chatContainerScroll.scrollHeight;
    });
  });

  //
})();
