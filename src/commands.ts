import { Editor } from 'grapesjs';
import { CodeEditor } from './code-editor';

export default (editor: Editor, opts) => {
  let codeEditor: CodeEditor | null = null;

  editor.Commands.add('open-code', {
    run: editor => {
      !codeEditor && (codeEditor = new CodeEditor(editor, opts)) && codeEditor.buildCodePanel();
      codeEditor.showCodePanel();
    },
    stop: editor => {
      codeEditor && codeEditor.hideCodePanel();
    },
  });
}