/**
 * Github 레포지토리 생성 함수
 * @param {string} name - 생성할 레포 이름
 * @param {string} token - github access token
 * @param {string} private - 생성할 레포 private 여부
 */
async function createRepo(name, token, private) {
  return fetch(`https://api.github.com/user/repos`, {
    method: 'POST',
    body: JSON.stringify({
      name: name,
      description: 'CogitCogit Repository',
      private: private, // 리포지토리를 비공개로 만들려면 true로 설정
      auto_init: true, // 레포지토리 초기화 스크립트를 사용하려면 true로 설정 (선택 사항)
    }),
    headers: {
      Authorization: `Bearer ${token}`, // Bearer or Token?
      Accept: 'application/vnd.github.v3+json',
      'Content-type': 'application/json',
    },
  }).then((res) => {
    console.log(res);
    return true;
  });
}

/**
 * Github 레포지토리 요청 함수
 * @param {string} name - 확인할 user repo
 * @param {string} token - github access token
 */
async function getRepo(hook, token) {
  return fetch(`https://api.github.com/repos/${hook}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`, // Bearer or Token?
      Accept: 'application/vnd.github.v3+json',
      'content-type': 'application/json',
    },
  }).then((res) => {
    console.log(res.status);
    if (res.status === 200) {
      return true;
    } else return false;
  });
}

async function createHook(event) {
  event.preventDefault();
  const repoName = document.getElementById('name').value;

  // TODO: name이 영어로만 이루어져있는지 확인
  if (repoName === '') {
    return;
  }

  chrome.storage.local.get('cogit_token').then(async (data) => {
    const token = data.cogit_token;

    chrome.storage.local.get('cogit_id').then(async (data) => {
      const userName = data.cogit_id;
      const existRepo = await getRepo(`${userName}/${repoName}`, token);

      if (token === undefined || userName === undefined) {
        alert('로그인이 필요합니다.');
        return;
      }

      if (!existRepo) {
        await createRepo(repoName, token, true);
        alert('Repository가 생성되었습니다.');
      } else alert('repository가 연결되었습니다.');
      chrome.storage.sync.set({ cogit_repo: `${userName}/${repoName}` }, function () {
        currentRepo();
      });
    });
  });
}

async function currentRepo() {
  chrome.storage.sync.get('cogit_repo').then(async (data) => {
    if (!data.cogit_repo) {
      document.getElementById('repo').innerHTML =
        '연결된 Repository가 없습니다.';
    } else {
      document.getElementById('repo').innerHTML =
        '현재 Repository : ' + data.cogit_repo;
    }
  });
}

async function removeHook() {
  event.preventDefault();
  if (!confirm('현재 연결된 레포지토리를 해제하시겠습니까?')) return;
  chrome.storage.sync.remove('cogit_repo', function () {
    alert('연결이 해제 되었습니다.');
    currentRepo();
  });
}

currentRepo();

const syncForm = document.getElementById('syncForm');
syncForm.addEventListener('submit', createHook);

const unsyncButton = document.getElementById('unsync-button');
unsyncButton.addEventListener('click', removeHook);
