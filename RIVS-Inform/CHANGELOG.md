# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.6.1](https://github.com/JOkoropuzz/RIVS-Inform/compare/v1.6.0...v1.6.1) (2026-02-17)


### Bug Fixes

* убраны отладочные строки, добавлены коментарии ([63ae8e3](https://github.com/JOkoropuzz/RIVS-Inform/commit/63ae8e32a39d8c69fa7b888bff0ffe65c6af8261))

## [1.6.0](https://github.com/JOkoropuzz/RIVS-Inform/compare/v1.5.2...v1.6.0) (2026-02-09)


### Features

* доработан механизм аутентификации ([4ab1a09](https://github.com/JOkoropuzz/RIVS-Inform/commit/4ab1a094e1502fcf1c3ae5ab34b509569532dc1f))

### [1.5.2](https://github.com/JOkoropuzz/RIVS-Inform/compare/v1.5.1...v1.5.2) (2026-02-05)


### Bug Fixes

* изменены маршруты запросов к api; исправлены надписи пагинатора ([e35e1b0](https://github.com/JOkoropuzz/RIVS-Inform/commit/e35e1b08450d2cec4482278e544215ed39950cd4))

### [1.5.1](https://github.com/JOkoropuzz/RIVS-Inform/compare/v1.5.0...v1.5.1) (2026-02-05)


### Bug Fixes

* убран неиспользуемый сервис навигации ([7b7918a](https://github.com/JOkoropuzz/RIVS-Inform/commit/7b7918a6c36ea705eff37447bd2074eed191f11a))

## [1.5.0](https://github.com/JOkoropuzz/RIVS-Inform/compare/v1.4.0...v1.5.0) (2026-01-30)


### Features

* добавлена логика получения имени файла с сервера, доделан обработчи и логика скачивания файла csv, правки имени переменной предприятия ([26c9a3a](https://github.com/JOkoropuzz/RIVS-Inform/commit/26c9a3ac6c84f3e52f6b808c8621ff7a69e3b85f))


### Bug Fixes

* изменено кол-во строк на стринце с 10 на 40, наименование изменено на АСАК-ИНФОРМ, кнопка выгрузки csv перемещена в левую нижнюю часть экрана ([d9c03ad](https://github.com/JOkoropuzz/RIVS-Inform/commit/d9c03adc208e43bd6207a2cc3aa496243d55ed9e))

## [1.4.0](https://github.com/JOkoropuzz/RIVS-Inform/compare/v1.3.0...v1.4.0) (2026-01-27)


### Features

* добавлена кнопка скачивания csv. изменена логика сервиса аутентификации, добавлена проверка администратора, сокрытие селектора предприятий для НЕ админской роли, изменен цвет кнопки обновления, добавлена логика парсинга jwt для определения параметров из токена, добавлен обработчик кнопки скачиваня csv и запрос к беку для него, убрано лого АЦ, изменено основной лого, добавлено название предприятия в меню навигации, изменена логика получения имени пользователя и предприятия в меню навигации ([0411dd5](https://github.com/JOkoropuzz/RIVS-Inform/commit/0411dd5cce724bb3935f5dc56466056039f68659))

## [1.3.0](https://github.com/JOkoropuzz/RIVS-Inform/compare/v1.1.0...v1.3.0) (2026-01-26)


### Features

* Изменено положение окна авторизации на странице, данные разбиты на отдельные запросы для таблицы и графиков, добавлена пагинация таблиц, mat-paginator создан класс для перевода на русский. тип графиков изменен на линию, кнопка скрытия и открытия навигации на узких экранах автоматически скрывается при нажатии на ссылку ([771794e](https://github.com/JOkoropuzz/RIVS-Inform/commit/771794e4c02e0efda2bed992916e32dfe7a520c9))

## 1.1.0 (2026-01-19)


### Features

* добавлена библиотека для автоматизации версионности ([2c75985](https://github.com/JOkoropuzz/RIVS-Inform/commit/2c7598519e25ff1d170e1109d24783bc7c8cf71c))

This file explains how Visual Studio created the project.

The following tools were used to generate this project:
- Angular CLI (ng)

The following steps were used to generate this project:
- Create Angular project with ng: `ng new RIVS-Inform --defaults --skip-install --skip-git --no-standalone `.
- Create project file (`RIVS-Inform.esproj`).
- Create `launch.json` to enable debugging.
- Create `nuget.config` to specify location of the JavaScript Project System SDK (which is used in the first line in `RIVS-Inform.esproj`).
- Update package.json to add `jest-editor-support`.
- Update `start` script in `package.json` to specify host.
- Add `karma.conf.js` for unit tests.
- Update `angular.json` to point to `karma.conf.js`.
- Add project to solution.
- Write this file.
