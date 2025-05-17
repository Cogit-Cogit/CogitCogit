const AUTHORIZATION_URL = 'https://github.com/login/oauth/authorize';
const REDIRECT_URL = 'https://github.com'; // 변경 필요
const SCOPES = [
  'repo',
  'admin:repo_hook',
  'admin:org',
  'admin:public_key',
  'admin:org_hook',
  'user',
  'project',
];

document.addEventListener('DOMContentLoaded', function () {
  let imageLogo = document.getElementById('imageLogo');
  let text = document.querySelector('#active p');

  chrome.storage.local.get('active', function (result) {
    // 활성화 버튼 세팅
    if (result.active) {
      if (result.active == 'active') {
        imageLogo.src = './assets/images/pets.png';
        text.textContent = 'activated';
        text.style.color = '#F79F5F';
      } else {
        imageLogo.src = './assets/images/pets_grey.png';
        text.textContent = 'inactive';
        text.style.color = '#D9D9D9';
      }
    } else {
      chrome.storage.local.set({ active: 'active' }).then(() => {
        imageLogo.src = './assets/images/pets.png';
        text.textContent = 'activated';
        text.style.color = '#F79F5F';
      });
    }
  });

  const activeBtn = document.getElementById('active');
  activeBtn.addEventListener('click', function () {
    // 활성화 버튼을 눌렀을 때
    chrome.storage.local.get('active', function (result) {
      if (result.active == 'active') {
        imageLogo.src = './assets/images/pets_grey.png';
        text.textContent = 'inactive';
        text.style.color = '#D9D9D9';
        chrome.storage.local.set({ active: 'deactive' });
      } else {
        imageLogo.src = './assets/images/pets.png';
        text.textContent = 'activated';
        text.style.color = '#F79F5F';
        chrome.storage.local.set({ active: 'active' });
      }
    });
  });

  function login() {
    let url = `${AUTHORIZATION_URL}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}&scope=`;
    for (let i = 0; i < SCOPES.length; i++) {
      url += SCOPES[i] + ' ';
    }
    chrome.storage.local.set({ pipe_cogit: true }, () => {
      // opening pipe temporarily
      chrome.tabs.create({ url, selected: true }, function () {
        window.close();
      });
    });
  }

  const loginButton = document.getElementById('authenticate');
  loginButton.addEventListener('click', login);

  chrome.storage.local.get('cogit_id', function (data) {
    if (data.cogit_id) {
      // cogit 인증 데이터가 존재하면, 로그인 버튼 숨김
      var authModeElement = document.getElementById('auth_mode');
      if (authModeElement) {
        authModeElement.style.display = 'none';
        document.getElementById('cogitLink').style.display = 'block';
        var repoNoticeElement = document.getElementById('repo_notice');
        repoNoticeElement.style.display = 'block';
      }
    }
  });

  const cogitLink = document.getElementById('cogitLink');
  cogitLink.addEventListener('click', function () {
    chrome.storage.local.remove('cogit_token');
    chrome.storage.local.remove('cogit_id');
    window.close();
  });

  chrome.storage.sync.get('cogit_repo', (result) => {
    // 만약 연결된 repository가 있으면 그 주소로 반환
    const repo = result.cogit_repo;

    if (repo) {
      var github_link = document.getElementById('github_link');
      github_link.href = `https://github.com/${repo}`;
      var repoNoticeElement = document.getElementById('repo_notice');
      repoNoticeElement.style.display = 'none';
    }
  });
});
