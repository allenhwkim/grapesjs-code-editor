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
      //Allow editing of javascript, set allowScripts to true for this to work
      editJs: false,
      //Remove component data eg data-gjs-type="..."
      clearData: false,
      //Used to remove css from the Selector Manager
      cleanCssBtn: true,
      //Save HTML button text
      htmlBtnText: 'Apply',
      //Save CSS button text
      cssBtnText: 'Apply',
      //Clean CSS button text
      cleanCssBtnText: 'Delete'
    },
    ...opts
  };

  // Load commands
  commands(editor, options);
};