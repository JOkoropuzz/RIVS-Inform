# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
