# frontend

Build status: [![Build Status](https://travis-ci.org/dsd-meetme/frontend.svg?branch=master)](https://travis-ci.org/dsd-meetme/frontend)
Code quality: [![Code Climate](https://codeclimate.com/github/dsd-meetme/frontend/badges/gpa.svg)](https://codeclimate.com/github/dsd-meetme/frontend)

This application uses angularJS

[Application example web server](http://admin.plunner.com). It is just an example, so we don't guarantee that everything works


# How to install
1. Clone the repository on your local machine
2. Install all dependencies via [npm](http://npmjs.org/) `npm install` ([nodejs.org](http://nodejs.org) required)
3. Bootstrap the application via `node_modules/.bin/gulp production`

or symply via npm 

**TODO**

and bootstrap the application via `gulp production`

# How to configure
1. Configure Plunner's frontend with your api domain in the `config.js` file
1. Plunner's frontend must be installed on the root of the virtual host
 
#How to test locally
You can run a local web server that bootstraps the application on port 3000 by typing on your terminal `gulp dev`;
this procedure will also fire a listener of changes so that all the sass files and the single js modules are
compiled and put together as soon as you make a changes

#Notes
* In real environment you should use apache2
 
#Credits
* [AngularJS](https://angularjs.org/)
* [Bootstrap](http://getbootstrap.com/)
* [FullCalendar](http://fullcalendar.io/)
* [jwt-decode](https://www.npmjs.com/package/jwt-decode)

