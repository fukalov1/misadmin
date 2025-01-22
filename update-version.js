const shell = require('shelljs');

if (!shell.which('git')) {
  shell.echo('This script requires git');
  shell.exit(1);
}

const postfixArg = process.argv[2]; // переданные аргументы во время запуска скрипта начинаются со второго индекса, ссылка: https://nodejs.org/docs/latest/api/process.html#process_process_argv
const tagPostfix = postfixArg ? `-${postfixArg}` : ''; // пример: x.y.z-dev, если нет аргумента - x.y.z

// ПОИСК ПОСЛЕДНЕГО ТЕГА ДЛЯ ТЕКУЩЕГО РЕЛИЗА

// const releaseNum = shell.head('version.txt'); // читаем содержимое файла чтобы получить версию (x.y) текущего релиза
let releaseNum = shell.sed('-i', '1,1p', '', './version.txt'); // читаем содержимое файла чтобы получить версию (x.y) текущего релиза

const oldReleaseNum = releaseNum;
releaseNum = releaseNum.replace('\n','');

shell.echo(` version: ${releaseNum} test`)

const tagsTemplateToSearch = `${releaseNum}.*${tagPostfix}`; // 'x.y.*-postfix' шаблон для поиска предыдущих тегов для текущего релиза
const releasedTags = shell
  .exec(`git tag -l ${tagsTemplateToSearch} --sort=-v:refname`)
  .split('\n')
  .filter(Boolean);

const lastReleaseTag = releasedTags.length > 0 ? releasedTags[0] : '';

shell.echo(`The last tag for ${releaseNum}: ${lastReleaseTag || '-'}`);

// ПОЛУЧЕНИЕ НОВОЙ ВЕРСИИ

let patchVersion = 1;
if (lastReleaseTag) {
  // если для данного релиза уже были теги, получить версию последнего патча и увеличить
  const lastReleaseVersion = lastReleaseTag.split('-')[0]; // получаем 'x.y.z' из 'x.y.z-postfix'
  patchVersion = +lastReleaseVersion.split('.').pop() + 1; // получаем патч версию z из x.y.z и увеличиваем на 1
}

const newVersionTag = `${releaseNum}.${patchVersion}${tagPostfix}`;

shell.echo(`New version tag: ${newVersionTag}`);
shell.echo(`Replace str ${lastReleaseTag} on ${newVersionTag}`);

// СОХРАНЯЕМ ВЕРСИЮ СБОРКИ В app-version.js

shell.cd('src/environments');
shell.sed('-i', lastReleaseTag, newVersionTag, 'app-version.js');
shell.cd('../../');

// КОММИТИМ НОВЫЙ ТЕГ

shell.exec(`git tag ${newVersionTag}`);
