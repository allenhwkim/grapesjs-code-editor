import { Editor } from 'grapesjs';
import commands from './commands';
import './styles.css';

export default function (editor: Editor, opts = {}) {
  const options = {
    ...{
      openState: { cv: '65%', pn: '35%' }, //State when open
      closedState: { cv: '85%', pn: '15%' }, //State when closed
    },
    ...opts
  };

  // Load commands
  commands(editor, options);
};