# Developers Guide to CE Mobile CRM #

## Understanding the project structure ##
Before you get started developing, it's important to take a minute to familiarize yourself with the structure of the project. First of all **there is only one index file for the entire application**. Within this index file you will see multiple `<div>` tags with the attribute of data-role="page" this is how jQuery Mobile identifies seperate pages within a single index file. Although additional files could be added to the project having only 1 page means that the application is a 0 postback solution. So all HTML, CSS, and JavaScript is delivered to the client on the first request. After that all subsequent requests are AJAX calls to the SugarCRM REST API and JavaScript is used to make changes as needed to the UI elements.

## Minification ##
This project uses the same minification process as the core jQuery project. So it uses a versions file along with a makefile to specify which JavaScript files need to be combined and minified. This will then copy all of the files to a new directory with the version in the path. Once this is done the index file must be updated to reference the minified versions of the JavaScript files. This minification process helps keep the file size to a minimum and ensure the best performance.

## Globalization / Localization ##
**Work in progress**, see [issue 1](https://code.google.com/p/ce-mobile-crm/issues/detail?id=1).

The work was started to support multiple languages. There is a LanguageResources.js file that contains global JavaScript variables for each of the application titles and labels. Then on page loads these variables are used to modify the text values of buttons, title bars, etc... This will allow for new LanguageResources\_en.js or LanguageResources\_fr.js, etc... and allow non technical people to modify this one file for an additional language. This will not address multiple languages within a single installation, but it is a start.

## Why no local storage? ##
When this project started it was created to allow for offline interactions using an HTML5 database. However since not all devices support HTML5 database this was dropped so the project would continue to support the broadest range of devices possible. Next we tried some of the many cross-platform libraries to store smaller amounts of data like "preferences" in cookies. Again this was problematic trying to get it to work consistently across all of the platforms and mobile browsers we were trying to support.