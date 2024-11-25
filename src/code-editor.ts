import { Component, Editor, Panel } from 'grapesjs';
import split from 'split.js';

export class CodeEditor {
  editor: Editor;
  opts = {
    openState: { cv: '65%', pn: '35%' }, //State when open
    closedState: { cv: '85%', pn: '15%' }, //State when closed
  };
  canvas: HTMLElement;
  panelViews: HTMLElement;
  isActive = false;

  component: Component | undefined;
  codePanel: HTMLElement;
  htmlCodeEditor: any;
  cssCodeEditor: any;
  previousHtmlCode: string;
  previousCssCode: string;

  constructor(editor: Editor, opts: any) {
    this.editor = editor;
    this.opts = {...this.opts, ...opts};
    this.canvas = this.editor.getEl()?.querySelector(`.gjs-cv-canvas`) as HTMLElement;
    this.panelViews = this.editor.getEl()?.querySelector(`.gjs-pn-views-container`) as HTMLElement;
  }

  buildCodeEditor(type: string) {
    return this.editor.CodeManager.createViewer({
      codeName: type === 'html' ? 'htmlmixed' : 'css',
      // theme: 'hopscotch',
      readOnly: 0,
      // autoBeautify: 1,
      // autoCloseTags: 1,
      // autoCloseBrackets: 1,
      // styleActiveLine: 1,
      // smartIndent: 1
    });
  }

  // add html/css code editor views-container, along with style, traits, components
  buildCodePanel() {
    const buildSection = (type: string, codeViewer) => {
      const section = document.createElement('section');
      section.insertAdjacentHTML('beforeend', `
        <div class="codepanel-separator">
          <div class="codepanel-label">${type}</div>
          <button class="apply-btn gjs-btn-prim">Apply</button>
        </div>`);
      const codeViewerEl = codeViewer.getElement();
      codeViewerEl.style.height = 'calc(100% - 30px)';
      section.appendChild(codeViewerEl);

      const applyHandler = 
        type === 'html' ? this.updateHtml :
          type === 'css' ? this.updateCss : () => alert('apply handler error');
      const applyBtn = section.querySelector('.apply-btn') as HTMLButtonElement;
      applyBtn.addEventListener('click', applyHandler.bind(this));

      return section;
    }

    this.htmlCodeEditor = this.buildCodeEditor('html');
    this.cssCodeEditor = this.buildCodeEditor('css');
    const htmlCodeSection = buildSection('html', this.htmlCodeEditor);
    const cssCodeSection = buildSection('css', this.cssCodeEditor);

    this.codePanel = document.createElement('div');
    this.codePanel.classList.add('code-panel');
    this.codePanel.append(htmlCodeSection, cssCodeSection);

    const viewsContainer = this.editor.Panels.getPanel('views-container') as Panel;
    viewsContainer
      .set('appendContent', this.codePanel)
      .trigger('change:appendContent');
    this.updateEditorContents();

    split([htmlCodeSection, cssCodeSection], {
      direction: 'vertical',
      sizes: [50, 50],
      minSize: 100,
      gutterSize: 1,
      onDragEnd: this.refreshEditors.bind(this),
    });

    this.editor.on('component:update', model => this.updateEditorContents());
    this.editor.on('stop:preview', () => {
      // const viewsContainerPanel = this.editor.Panels.getPanel('views-container');
      // if (viewsContainerPanel?.view.className === '')
      // console.log('>>>>>>..', this.editor.Panels.getPanel('views-container'));
      if (this.isActive) {
        this.canvas.style.width = this.opts.openState.cv;
      }
    });
  }

  showCodePanel() {
    this.updateEditorContents();
    this.isActive = true;
    // make sure editor is aware of width change after the 300ms effect ends
    setTimeout(this.refreshEditors.bind(this), 320);

    this.panelViews.style.width = this.opts.openState.pn;
    this.canvas.style.width = this.opts.openState.cv;
  }

  hideCodePanel() {
    this.codePanel.remove();
    this.isActive = false;

    this.panelViews.style.width = this.opts.closedState.pn;
    this.canvas.style.width = this.opts.closedState.cv;
  }

  refreshEditors() {
    this.htmlCodeEditor.refresh();
    this.cssCodeEditor.refresh();
  }

  updateHtml(event) {
    event.preventDefault();
    let htmlCode = this.htmlCodeEditor.getContent().trim();
    if (!htmlCode || htmlCode === this.previousHtmlCode) return;

    this.previousHtmlCode = htmlCode;
    this.editor.select(this.component?.replaceWith(htmlCode));
  }

  updateCss(event) {
    event.preventDefault();
    const cssCode = this.cssCodeEditor.getContent().trim();
    if (!cssCode || cssCode === this.previousCssCode) return;

    this.previousCssCode = cssCode;
    this.editor.Css.addRules(cssCode);
  }

  updateEditorContents() {
    if (!this.editor.getSelected()) return;

    this.component = this.editor.getSelected() as Component;
    this.htmlCodeEditor.setContent(this.component.toHTML());

    const css = this.editor.CodeManager.getCode(this.component, 'css', {
      cssc: this.editor.Css
    });
    this.cssCodeEditor.setContent(css);
  }
}