# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [UNRELEASED]

## 1.1.0 - 2017-9-19
### Added
- Timed tracking for asynchronous anchors

### Fixed
- Issues surrounding Vue Router import order
- @click vs @click.native issue when Vue Router (not) present

## 1.0.1 - 2017-9-14
### Added
- .npmignore

### Fixed
- Missing main file in npm package

## 1.0.0 - 2017-9-14
### Added
- Vue Scouter Link component that
- Looks to see whether it should be used as a Vue Router Link
- Looks to see whether route and anchor match
- Tries to use Vue-ScrollTo if route and anchor match
- Otherwise uses native behavior
 