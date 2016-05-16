mirror-mirror
=============

Magic mirror in my hand, tell me if my website will look ugly in production **before** deploying to production.

![img](https://raw.githubusercontent.com/matteofigus/mirror-mirror/master/img/mirror.gif)

This is a wrapper around the wonderful [Nightmare.js](https://github.com/segmentio/nightmare) for:

* Opening a matrix of urls with Chrome
* Specify a set of operations to perform
* Take a screenshot
* Make some changes (like swapping a CSS file, changing Js or HTML)
* Take another screenshot
* Compare the screenshots and save a diff file with the highighted differences

Most important features: 
* Crazy quick compare to Selenium with Phantom
* Able to hide/show Browser
* Works with any OS
* Able to use DevTools and do debugging with Chrome

# Requirements

Node version: min: **0.10.40**, recommended: **>=4.2.X**

Build status: Unix: [![Build Status](https://secure.travis-ci.org/matteofigus/mirror-mirror.png?branch=master)](http://travis-ci.org/matteofigus/mirror-mirror)

# Install it

```sh
$ npm install mirror-mirror
```

# Use it

```js
var mirror = require('mirror-mirror');

var runner = new mirror();

runner.setup({
  urls: {
    home: 'https://www.amazon.com'
  },

  selector: '#nav-search',
  transform: function(){
    // Replace Amazon search with Google widget. Because it is funny.
    return '<form name="cse" id="searchbox_demo" action="https://www.google.com/cse">' +
            '<input type="hidden" name="cref" value="" />' +
            '<input type="hidden" name="ie" value="utf-8" />' +
            '<input type="hidden" name="hl" value="" />' +
            '<input name="q" type="text" size="40" />' +
            '<input type="submit" name="sa" value="Search" />' +
            '</form>' +
            '<script type="text/javascript" src="https%3A%2F%2Fcse.google.com%2Fcse/tools/onthefly?form=searchbox_demo&lang="></script>';
  },
  screenshotsPath: './screenshots'
});

runner.run(function(err, result){
  console.log(result);
  /*
  {
    home: {
      after: '/Users/mfigus/Documents/os/mirror-mirror/screenshots/home-after.png',
      before: '/Users/mfigus/Documents/os/mirror-mirror/screenshots/home-before.png',
      diff: '/Users/mfigus/Documents/os/mirror-mirror/screenshots/home-diff.png',
      isDifferent: true
    }
  }
  */
});

```

# API

1. [Set up an instance](#set-up-an-instance)
2. [Configure the runner](#configure-the-runner)
  * [action examples](#nightmare-actions-example)
3. [Start the runner](#start-the-runner)

### Set up an instance

`var mirror = new Mirror([NighmareOptions]);`

Look at [Nighmare.js options](https://github.com/segmentio/nightmare#nightmareoptions).

### Configure the runner

`mirror.setup(mirrorOptions);`

This is an object with the following structure:

|name|type|mandatory|description|
|====|====|=========|===========|
|after|`array of functions`|no|An array of nightmareJs actions to perform after the transformation and before the second screenshots. [Look at the example below](#nightmare-actions-example)|
|before|`array of functions`|no|An array of nightmareJs actions to perform before the first screenshots. [Look at the example below](#nightmare-actions-example)|
|cookies|`object`|no|Allows to specify cookies to be used for each request|
|debug|`boolean`|no|When true, shows stuff in the console|
|headers|`object`|no|Allows to specify headers to be used for each request|
|screenshotsPath|`string`|yes|The path where to save the screenshots|
|selector|`string`|yes|The css selector for the DOM tree you want to transform. It can be anything [`document.querySelector`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector) can understand|
|transform|`string` or `function`|true|The transformation to apply to the selector. If `string`, element will be replaced with the markup provided in the string. When `function`, it needs to transform a string to be replaced in the selected DOM tree. The function will have an [element](https://developer.mozilla.org/en-US/docs/Web/API/element) as parameter - the result of previous selection|
|urls|`object`|yes|The urls to test. Key is used to generate screenshots file name so keep it simple and without spaces and stuff|

#### Nightmare actions example

This example shows how to make a screenshot with a menu opened, assuming the transformation replaces the menu and then needs to run another javascript initialisation and then wait to complete before performing the same action again.

```js
mirror.setup({
  ...
  before: [
    function(nightmare){
      return nightmare.evaluate(function(){
        // Assuming jQuery is in the page
        $('#navbar-button').click();
      });
    }
  ],
  after: [
    function(nightmare){
      return nightmare.evaluate(function(){
        window.menusReady = false;
        window.menus.initialise(function(){
          window.menusReady = true;
        });
      });
    },
    function(nightmare){
      return nightmare.wait(function(){
        return window.menusReady === true;
      });
    },
    function(nightmare){
      return nightmare.evaluate(function(){
        $('#navbar-button').click();
      });
    }
  ]
});
```

### Start the runner

`mirror.run(callback);`

Where callback is going to have an error and/or a response with the results. If any of the requests fails, the callback will include both an error + the response with succeeding screenshot links.

# Contributing

Yes please. Open an issue first.

# License

MIT
