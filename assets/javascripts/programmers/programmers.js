async function saveCode(isActive) {
  if (!isActive) return;

  let codeLanguage = document.getElementById('tour7').querySelector('button').textContent.trim();
  let codeFileExtension = programmersExtension[codeLanguage];
  codeLanguage = programmersLanguages[codeLanguage];
  const codeContent = document.querySelector('textarea#code').value;

  let codeResult = document.querySelector('.modal-title');
  if (codeResult) {
    codeResult.textContent = '로딩중';
  }

  let funcButtons = document.querySelector('.func-buttons');
  let loadingImg = document.createElement('img');
  loadingImg.src = chrome.runtime.getURL('assets/images/loading.gif');
  loadingImg.style = 'width:30px';
  funcButtons.prepend(loadingImg);

  const intervalId = setInterval(async function () {
    let modalTitle = document.querySelector('.modal-title');
    if (modalTitle) {
      codeResult = modalTitle.textContent;
    }
    var codeRunningTime = 0;
    var algorithmQuestId = document.querySelector('.lesson-content').getAttribute('data-lesson-id');

    var algorithmName = document.querySelector('.challenge-title').textContent;

    if (codeResult && !codeResult.includes('로딩중')) {
      clearInterval(intervalId);

      let cogitImg = document.createElement('img');

      if (codeResult.includes('정답')) {
        const timeElements = document.querySelectorAll('.console-test-group td.result.passed');
        const runTimes = [];

        for (var timeElement of timeElements) {
          var runTime = timeElement.innerText.match(/(\d+\.\d+)ms/);
          if (runTime) {
            runTimes.push(parseFloat(runTime[1]));
          }
        }
        codeRunningTime = runTimes.reduce((acc, value) => acc + value, 0) / runTimes.length + 'ms';

        await uploadCode(
          codeContent,
          'PROGRAMMERS',
          codeLanguage,
          codeRunningTime,
          algorithmQuestId,
          codeFileExtension,
          algorithmName
        );

        loadingImg.remove();
        cogitImg.src = chrome.runtime.getURL('assets/images/cogit.png');
        cogitImg.style = 'width:30px; margin-left:10px';
        modalTitle.appendChild(cogitImg);
      } else {
        loadingImg.remove();
        cogitImg.src = chrome.runtime.getURL('assets/images/cogit_gray.png');
        cogitImg.style = 'width:30px; margin-left:10px';
        modalTitle.appendChild(cogitImg);
      }
    }
  }, 1000);
}

const submitButton = document.getElementById('submit-code');
if (submitButton != null) {
  submitButton.addEventListener('click', function () {
    checkActive(saveCode);
  });
}
