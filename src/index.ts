import { Editor } from 'grapesjs';
import commands from './commands';
import './styles.css';

export default function (editor: Editor, opts = {}) {
  const options = {
    ...{
      //State when open
      openState: {
        cv: '65%',
        pn: '35%'
      },
      //State when closed
      closedState: {
        cv: '85%',
        pn: '15%'
      },
      //Save HTML button text
      htmlBtnText: 'Apply',
      //Save CSS button text
      cssBtnText: 'Apply',
    },
    ...opts
  };

  // Load commands
  commands(editor, options);
};