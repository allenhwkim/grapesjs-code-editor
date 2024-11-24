import grapesjs from 'grapesjs';
import grapesjsParserPostcss from 'grapesjs-parser-postcss';
import 'grapesjs/dist/css/grapes.min.css';
import grapesjsCodeEditor from './src';

declare var window: any;

window.editor = grapesjs.init({
  height: '100%',
  container: '#gjs',
  showOffsets: true,
  fromElement: true,
  noticeOnUnload: false,
  storageManager: false,
  selectorManager: {
    componentFirst: true,
  },
  plugins: [grapesjsCodeEditor, grapesjsParserPostcss],
  pluginsOpts: {
    [grapesjsCodeEditor as any]: {}
  }
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
