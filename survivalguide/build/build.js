var marked = require('marked');
var fs = require("fs");

var markdownString = fs.readFileSync("source.md", "utf-8");
var template = fs.readFileSync("template.html", "utf-8");
var started = Date.now();

// Async highlighting with pygmentize-bundled
marked.setOptions({
  highlight: function (code, lang, callback) {
    require('pygmentize-bundled')({ lang: lang, format: 'html' }, code, function (err, result) {
      callback(err, result.toString());
    });
  }
});

// Using async version of marked
marked(markdownString, function (err, content) {
  if (err) throw err;
  var html = template.replace("{{ content }}", content);
  fs.writeFile("out.html", html, function () {
    console.log("Finished in " + (Date.now() - started) + "ms")
  })
});