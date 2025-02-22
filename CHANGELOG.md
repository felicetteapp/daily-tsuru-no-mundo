# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)

## [Unreleased]

## [1.0.4] - 2025-02-22

### Added

- Neighbors section to the page to display neighbor sites
- `markdown-it` and `markdown-it-attrs` libs to parse the markdown content of the neighbors

### Changed

- Avoid the modal to be displayed when the user clicks on the image when the modal is already open
- There was an small bug when opening the first modal caused by a conflict between the css styling and the webAimation API.
- Improved the spacing of the images on the mobile version

## [1.0.3] - 2025-02-21

### Added

- A new modal to display the details of the tsuru. The modal is a work in progress and will be improved in the next versions

## [1.0.2] - 2025-02-21

### Changed

- The images now have an fixed aspect-ratio of 3/4 to display all items in the same size

## [1.0.1] - 2025-02-21

### Added

- A changelog file
- Font to display the changelog
- A section of the page to display the changelog publicly
- Filters to filter the tsurus by date, color and location
- `chroma-js` lib to analize the colors of the images and group then by color
- Groups utils script to extract and save the required data to filter the tsurus

### Changed

- The footer now displays the version of the `package.json` file and the last update date
