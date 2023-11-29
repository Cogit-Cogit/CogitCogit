async function uploadCode(
  codeContent,
  codeSolved,
  algorithmQuestPlatform,
  codeLanguage,
  codeRunningTime,
  algorithmQuestNumber,
  codeFileExtension,
  algorithmName
) {
  chrome.storage.local.get('cogit_token').then((data) => {
    const token = data.cogit_token;
    chrome.storage.local.get('cogit_repo').then(async (data) => {
      const hook = data.cogit_repo;

      if (token === undefined || hook === undefined) {
        console.log('업로드 할 수 없습니다.');
        return;
      }

      const git = new GitHub(hook, token);

      const { refSHA, ref } = await git.getReference();
      const source = await git.createBlob(
        codeContent,
        `${algorithmQuestPlatform}/${algorithmName}.${codeFileExtension}`
      );
      const treeSha = await git.createTree(refSHA, [source]);
      const commitSha = await git.createCommit(
        `${codeLanguage} / ${codeRunningTime}`,
        treeSha,
        refSHA
      );
      await git.updateHead(ref, commitSha);
      const beakjoonCnt = await git.getFileList('BAEKJOON');
      const programmersCnt = await git.getFileList('PROGRAMMERS');
      console.log('백준: ', beakjoonCnt, ' 프로그래머스: ', programmersCnt);
      createModal(true);
    });
  });
}
