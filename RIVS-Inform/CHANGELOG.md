# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
