mirror-mirror
=============

Magic mirror in my hand, tell me if my website will look ugly in production **before** deploying to production.

![img](https://raw.githubusercontent.com/matteofigus/mirror-mirror/master/img/mirror.gif)

This is a wrapper around the wonderful [Nightmare.js](https://github.com/segmentio/nightmare) for:

* Opening a matrix of urls
* Specify a set of operations to perform
* Take a screenshot
* Make some changes (like swapping a CSS file, changing Js or HTML)
* Take another screenshot
* Compare the screenshots and save a diff file with the highighted differences

# Requirements

Node version: min: **0.10.35**, recommended: **>=4.2.X**

Build status: Unix: [![Build Status](https://secure.travis-ci.org/matteofigus/mirror-mirror.png?branch=master)](http://travis-ci.org/matteofigus/mirror-mirror)

# Install it

```shell
npm install mirror-mirror
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
      after: '',
      before: '',
      isDifferent: true,
      diff: ''
    }
  }
  */
});

```

# Contributing

Yes please. Open an issue first.

# License

MIT
