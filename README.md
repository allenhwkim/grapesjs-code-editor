# Grapesjs Code Editor

When a component is selected, this plugin allows you to edit the HTML code and 
CSS code, and save them.

![alt text](image.png)

## Usage

### HTML
```html
<html>
  <head>
    <link href="https://unpkg.com/grapesjs/dist/css/grapes.min.css" rel="stylesheet">
    <script src="https://unpkg.com/grapesjs"></script>
    <script src="https://unpkg.com/grapesjs-parser-postcss"></script>
    <script src="https://unpkg.com/grapesjs-code-editor"></script>
  </head>
  <body>
    <div id="gjs"></div>
    <script>
      const editor = grapesjs.init({
        height: '100%',
        container: '#gjs',
        fromElement: true,
        storageManager: false,
        plugins: [grapesjsCodeEditor, grapesjsParserPostcss],
      });

      const pn = window.editor.Panels;
      const panelViews = pn.addPanel({id: 'views'});
      panelViews.get('buttons').add([{
        attributes: { title: 'Open Code' },
        className: 'fa fa-file-code-o',
        command: 'open-code',
        togglable: false, //do not close when button is clicked again
        id: 'open-code'
      }]);
    </script>
  </body>
</html>
```

### JS
```javascript
import grapesjs from 'grapesjs';
import grapesjsParserPostcss from 'grapesjs-parser-postcss';
import 'grapesjs/dist/css/grapes.min.css';
import grapesjsCodeEditor from 'grapesjs-code-editor';

window.editor = grapesjs.init({
  height: '100%',
  container: '#gjs',
  fromElement: true,
  storageManager: false,
  plugins: [grapesjsCodeEditor, grapesjsParserPostcss],
});

const pn = window.editor.Panels;
const panelViews = pn.addPanel({id: 'views'});
panelViews.get('buttons').add([{
  attributes: { title: 'Open Code' },
  className: 'fa fa-file-code-o',
  command: 'open-code',
  togglable: false, //do not close when button is clicked again
  id: 'open-code'
}]);
```

## Development

```sh
$ git clone https://github.com/allenhwkim/grapesjs-code-editor.git
$ cd grapesjs-code-editor
$ npm i
$ npm start
```

## License
MIT