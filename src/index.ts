import { Editor } from 'grapesjs';
import { CodeEditor } from './code-editor';
import './styles.css';

export default function grapesjsCodeEditor(editor: Editor, options = {}) {
  let codeEditor: CodeEditor;

  editor.Commands.add('open-code', {

    run: function(editor: Editor) {
      codeEditor = new CodeEditor(editor, options);
      codeEditor?.buildCodePanel();
      codeEditor?.showCodePanel();
    },

    stop: function(_editor: Editor) {
      codeEditor?.hideCodePanel();
    },
  });
}
