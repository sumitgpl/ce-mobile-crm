# Project Overview #
This project is created to allow mobile access to CRM information stored in SugarCRM. The client is a web based client requiring 0 installation on the mobile device, yet delivering the UI experience of a native application. It is designed to leverage jQuery Mobile and takes advantage of the REST API provided by SugarCRM. It is compatible with all editions of SugarCRM including Community Edition.

# Primary Goals #
  1. The primary goals of this project are to ensure a native mobile application experience with a 0 install required by mobile platforms.
  1. Provide access to as many platforms as possible so strategically selecting trade offs that will provide the best experience the the most devices
  1. Ensure compatibility with as many versions of the SugarCRM product as possible

# Screen Shots #
<img src='http://www.sugarforge.org/screenshots/screenshot.php/1095/2194/thumbnail/iOS_Main_Screen.jpg'>
<img src='http://www.sugarforge.org/screenshots/screenshot.php/1095/2195/thumbnail/Android_Accounts_List.jpg'> <img src='http://www.sugarforge.org/screenshots/screenshot.php/1095/2198/thumbnail/WebOS_Accounts_Info_Expanded.jpg'>

<h1>Development</h1>
To simplify and make development of the application easier and more consistent, we are preparing a VirtualBox ovf file that you can import to have a complete development and debugging environment setup in a very short period of time. The goal of this environment is to allow developers to contribute to the project without having to go through extensive configuration. The .iso will have Ubuntu as the operating system, Netbeans as the development IDE, and a link pre-configured to the google code repository. In addition you can use chrome to debug the JavaScript and Netbeans to debug into the core SugarCRM code if needed. This is helpful when trying to add new features and the documentation for the REST APIs is not complete or you're not clear on how to use them.