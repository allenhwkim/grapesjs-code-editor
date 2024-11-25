import { Component, Editor, Panel } from 'grapesjs';
import split from 'split.js';

export class CodeEditor {
  editor: Editor;
  opts = {
    openState: { cv: '55%', pn: '45%' }, //State when open
    closedState: { cv: '85%', pn: '15%' }, //State when closed
  };
  canvas: HTMLElement;
  panelViews: HTMLElement;
  isVisible = false;

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
      readOnly: 0
    });
  }

  // add html/css code editor views-container, along with style, traits, components
  buildCodePanel() {
    const buildCodeEditorSection = (type: string, codeViewer) => {
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
    const htmlCodeSection = buildCodeEditorSection('html', this.htmlCodeEditor);
    const cssCodeSection = buildCodeEditorSection('css', this.cssCodeEditor);

    this.codePanel = document.createElement('div');
    this.codePanel.classList.add('code-panel');
    this.codePanel.append(htmlCodeSection, cssCodeSection);

    const viewsContainer = this.editor.Panels.getPanel('views-container') as Panel;
    viewsContainer.view.el.appendChild(this.codePanel);
    viewsContainer.trigger('change:appendContent');
    this.updateEditorContents();

    split([htmlCodeSection, cssCodeSection], {
      direction: 'vertical',
      sizes: [50, 50],
      minSize: 100,
      gutterSize: 1
    });

    this.editor.on('component:update', 
      () => this.updateEditorContents());
    this.editor.on('stop:preview', 
      () => this.isVisible && (this.canvas.style.width = this.opts.openState.cv) );
  }

  showCodePanel() {
    this.updateEditorContents();
    this.isVisible = true;

    this.panelViews.style.width = this.opts.openState.pn;
    this.canvas.style.width = this.opts.openState.cv;
  }

  hideCodePanel() {
    this.codePanel.remove();
    this.isVisible = false;

    this.panelViews.style.width = this.opts.closedState.pn;
    this.canvas.style.width = this.opts.closedState.cv;
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