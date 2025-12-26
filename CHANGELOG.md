# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)

## [Unreleased]

## [1.2.0] - 2025-12-26
### Changed
- Visual improvements to the entire site. The grid of tsurus now fill the entire width of the screen

## [1.1.2] - 2025-09-08

### Changed
- Adjusted the scroll behavior when the filter menu is open

## [1.1.1] - 2025-06-13

### Added
- Lenis library to improve the scroll experience on the site

## [1.1.0] - 2025-06-08

### Added
- Typescript support to the project

### Changed
- Improved animation performance on the modals

## [1.0.14] - 2025-06-07

### Changed

- Small visual adjustments on the tsuru list section

## [1.0.13] - 2025-05-04

### Added

- New neighbors to the page

### Changed

- Small visual adjustments on the neighbor section

## [1.0.12] - 2025-02-25

### Added

- A script to generate animated gifs from the tsurus
- A new section at each tsuru to display the gifs

## [1.0.11] - 2025-02-25

### Added

- A new page to show information about the building process of the site
- A basic sitemap to help the user navigate through the site

## [1.0.10] - 2025-02-25

### Added

- A new option to add my site button to yours

## [1.0.9] - 2025-02-24

### Added

- Some new links to the neighbors section
- New layout to wider screens (above 2230px)

## [1.0.8] - 2025-02-24

### Added

- A separate file to store the neighbors data
- `markdown-it-container` lib to add more customization to the markdown content
- `highlight.js` lib to highlight the code blocks on the markdown content

### Changed

- Small visual adjustments on the neighbor section

## [1.0.7] - 2025-02-23

### Added

- Neighbors page to show all the information regarding the neighbors
- A GIF to link to this site

### Changed

- The neighbors section on the main page now links to the neighbors page

## [1.0.6] - 2025-02-23

### Added

- Animations to show places where the tsurus were photographed
- Animations to show the title translated

## [1.0.5] - 2025-02-22

### Added

- An helper text to explain the user how to close the modal

### Changed

- Small visuals ajustments on the neighbor section for mobile

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
