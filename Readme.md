Wiky.js - a javascript library to convert Wiki Markup language to HTML.
=======================
(It is buggy, please use with care)

Wiky.js is a javascript library that converts Wiki Markup language to HTML.

Release
-------------------
* youtube videos are rendered with the logic from Youtube-Lite-Embed (https://github.com/TjWallas/YouTube-Lite-Embed)

How to use it
-------------------
Include wiki.js into your HTML file. Wiky.js has only one function, which is wiky.process(wikitext).

Please see index.html for an example.

*wiky.js does not depend on jQuery, which is included for testing purpose.



Supported Syntax
-------------------
* == Heading ==
* === Subheading ===
* [http://www.url.com Name of URLs]
* [[File:http://www.url.com/image.png Alternative Text]]
* [[Video:http://www.youtube.com/watch?v=F8UFGu2M2gM]]
* -------------------- (Horizontal line)
* : (Indentation)
* # Ordered bullet point
* * Unordered bullet point



Original Contributors
-------------------
Tanin Na Nakorn
Tanun Niyomjit (Designer)
Dav Glass [davglass]




var wiky = require('wiky.js');

var html = wiky.process('<string of wiki code>', {});

var html = wiky.process('<string of wiki code>', { 'link-image': false });
```


Options
-------
It only supports one option at the moment: `link-image`

Setting this to `false` will tell `wiky.js` to not imbed CSS into the markup for link icons.


MIT License
---------
Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


