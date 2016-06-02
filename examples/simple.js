'use strict';

const Mirror = require('../index');
const mirror = Mirror();

mirror.setup({

  debug: true,

  urls: {
    home: 'https://www.amazon.com'
  },

  selector: '#nav-search',

  transform: function(){
    // Google Search widget
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

mirror.run((err, result) => {
  console.log(err);
  console.log(result);
  process.exit(err ? 1 : 0);
});
