import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import pluginTable from './src';

declare var window: any;

window.editor = grapesjs.init({
  height: '100%',
  container: '#gjs',
  storageManager: false,
  fromElement: true,
  plugins: [pluginTable],
});