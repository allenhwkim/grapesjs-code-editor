import { Editor } from 'grapesjs';
import { CodeEditor } from './code-editor';

export default (editor: Editor, opts) => {
  const cm = editor.Commands;
  let codeEditor: CodeEditor | null = null;

  cm.add('open-code', {
    run: editor => {
      !codeEditor && (codeEditor = new CodeEditor(editor, opts)) && codeEditor.buildCodePanel();
      codeEditor.showCodePanel();
    },
    stop: editor => {
      codeEditor && codeEditor.hideCodePanel();
    },
  });

  cm.add('code-editor-object', () => {
    return codeEditor;
  });

  cm.add('code-editor-constructor' , () => {
    return CodeEditor;
  });
}