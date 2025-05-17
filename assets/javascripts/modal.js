const currentDate = new Date();

function countDay() { //연속 풀이 날

  return new Promise((resolve, reject) => {
    let stringCurrent = String(currentDate.getFullYear()) + String(currentDate.getMonth() + 1) + String(currentDate.getDate());
    let nextDateTimestamp = currentDate.getTime() + 24 * 60 * 60 * 1000;
    let nextDate = new Date(nextDateTimestamp);
    let stirngNext = String(nextDate.getFullYear()) + String(nextDate.getMonth() + 1) + String(nextDate.getDate());

    chrome.storage.sync.get(["nextday"], (result) => {
      if (result.nextday == stringCurrent) { //연속된다면
        chrome.storage.sync.set({ nextday: stirngNext });
        chrome.storage.sync.get(["combo"], (result) => {
          chrome.storage.sync.set({ combo: result.combo + 1 });
          resolve(result.combo + 1);
        });
      } else if (result.nextday == stirngNext) { //같은 날 푼 거
        chrome.storage.sync.get(["combo"], (result) => {
          chrome.storage.sync.set({ combo: result.combo});
          resolve(result.combo);
        });
      } else {
        chrome.storage.sync.set({ nextday: stirngNext });
        chrome.storage.sync.set({ combo: 1 });
        resolve(1);
      }
    });
  });
}


async function createModal(baekjoonCnt, programmersCnt) {
  let days = await countDay();
  
  // 모달 창을 생성할 요소들을 만듭니다.
  const modal = document.createElement('div');
  modal.id = 'cogit_modal';
  modal.classList.add('modal-overlay');

  const modalWindow = document.createElement('div');
  modalWindow.classList.add('modal-window');

  const closeArea = document.createElement('div');
  closeArea.classList.add('close-area');
  closeArea.textContent = 'X';

  const title = document.createElement('div');
  title.classList.add('title');
  // title.innerHTML = `<h2>${isCorrect ? '정답입니다' : '틀렸습니다'}</h2>`;
  title.innerHTML = `<h2>COMBO!</h2> <p class="onboarding"></p>`;

  const content = document.createElement('div');
  content.classList.add('content');
  //   content.innerHTML = `
  //     ${isCorrect ? '코드를 git에 업로드합니다.' : '안타깝습니다.'}
  // `;

  content.innerHTML = `<h2 class="days">${days}</h2> <p>days</p>`;

  const baekjoon = document.createElement('div');
  baekjoon.classList.add('baekjoon');
  var baekjoonImg = chrome.runtime.getURL('assets/images/baekjoon.png');
  baekjoon.innerHTML = `<img src="${baekjoonImg}" alt="baekjoon"/><p> + ${baekjoonCnt}</p>`;

  const programmers = document.createElement('div');
  programmers.classList.add('programmers');
  var programmersImg = chrome.runtime.getURL('assets/images/programmers.png');
  programmers.innerHTML = `<img src="${programmersImg}" alt="baekjoon"/> <p> + ${programmersCnt}</p>`;

  const cogit = document.createElement('div');
  cogit.classList.add('cogit');
  cogit.innerHTML = `<span style="color: #619fff">with</span> <span style="color: #c3d9fb">COGIT</span>`;

  // 요소들을 조립하여 모달 창에 추가합니다.
  modalWindow.appendChild(closeArea);
  modalWindow.appendChild(title);
  modalWindow.appendChild(content);
  modalWindow.appendChild(baekjoon);
  modalWindow.appendChild(programmers);
  modalWindow.appendChild(cogit);
  modal.appendChild(modalWindow);

  const closeBtn = modal.querySelector('.close-area');
  closeBtn.addEventListener('click', (e) => {
    modal.style.display = 'none';
  });

  modal.addEventListener('click', (e) => {
    const evTarget = e.target;
    if (evTarget.classList.contains('modal-overlay')) {
      modal.style.display = 'none';
    }
  });

  // body에 모달을 추가합니다.
  document.body.appendChild(modal);
  document.head.appendChild(style);
}

const style = document.createElement('style');
style.textContent = `
#cogit_modal.modal-overlay {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.25);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(1.5px);
  -webkit-backdrop-filter: blur(1.5px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
}
#cogit_modal .modal-window {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(13.5px);
  -webkit-backdrop-filter: blur(13.5px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  width: 500px;
  height: 500px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 10px;
}
#cogit_modal .title {
  // display: inline;
  text-align: center;
  padding: 20px 30px 10px;
}
#cogit_modal .title h2 {
  display: inline;
  text-shadow: 1px 1px 2px gray;
  color: #F79F5F;
  font-size: 40px;
  font-weight: 900;
}
#cogit_modal .close-area {
  display: inline;
  float: right;
  padding: 10px;
  cursor: pointer;
  color: #B3B3B3;
  font-size: 15px;
  font-weight: 900;
}

#cogit_modal .content {
  padding: 10px;
  margin: 10px;
}

#cogit_modal .content p {
  color: #B3B3B3;
  text-align: center;
  font-size: 20px;
  font-weight: 700;
}
#cogit_modal .days {
  padding: 0px;
  color: black;
  text-align: center;
  font-size: 80px;
  font-weight: 900;
}

#cogit_modal .onboarding {
  font-family: sans-serif;
  border-top: solid #f0eeee 3px;
  font-weight: 500;
  margin-top: 20px;
  font-size: small;
}


#cogit_modal .baekjoon{
  text-align: center;
  display: flex;
  padding: 20px;
  justify-content: center;
}
#cogit_modal .baekjoon img{
  margin-right: 100px;
  width: 40%;
}
#cogit_modal .baekjoon p{
  font-size: 20px;
  font-weight: 400;
  margin: 0px;
}


#cogit_modal .programmers{
  text-align: center;
  display: flex;
  padding: 20px;
  justify-content: center;
}
#cogit_modal .programmers img{
  margin-right: 100px;
  width: 40%;
}
#cogit_modal .programmers p{
  font-size: 20px;
  font-weight: 400;
  margin: 0px;
}

#cogit_modal .cogit{
  text-align: center;
  font-size: 15px;
  font-weight: 900;
}

`;
