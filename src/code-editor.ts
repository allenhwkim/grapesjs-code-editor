//Original work Copyright (c) 2018, Duarte Henriques, https://github.com/portablemind/grapesjs-code-editor
//Modified work Copyright (c) 2020, Brendon Ngirazi,
//All rights reserved.

import { Component, Editor } from 'grapesjs';
import Split from 'split.js';

export class CodeEditor {
  editor: Editor;
  $: any;
  opts: any;
  canvas: any;
  panelViews: any;
  isShowing: boolean;

  component: Component | undefined;
  codePanel: any;
  htmlCodeEditor: any;
  cssCodeEditor: any;
  previousHtmlCode: string;
  previousCssCode: string;

  constructor(editor: Editor, opts) {
    this.editor = editor;
    this.$ = editor.$;
    this.opts = opts;
    this.canvas = this.findWithinEditor(`.gjs-cv-canvas`);
    console.log('canvas', this.canvas);
    this.panelViews = this.findWithinEditor(`.gjs-pn-views-container`);
    console.log('panelViews', this.panelViews);
    this.isShowing = true;
  }

  findPanel() {
    const pn = this.editor.Panels;
    return pn.getPanel('views-container') || pn.addPanel({ id: 'views-container' });
  }

  findWithinEditor(selector) {
    return this.$(selector, this.editor.getEl());
  }

  buildCodeEditor(type) {
    const { editor } = this;

    return editor.CodeManager.createViewer({
      codeName: type === 'html' ? 'htmlmixed' : 'css',
      theme: 'hopscotch',
      readOnly: 0,
      autoBeautify: 1,
      autoCloseTags: 1,
      autoCloseBrackets: 1,
      styleActiveLine: 1,
      smartIndent: 1
    });
  }

  buildSection(type, codeViewer) {
    const { $, opts } = this;
    const section = $('<section></section>');
    const btnText = type === 'html' ? opts.htmlBtnText : opts.cssBtnText;
    section.append($(`
      <div class="codepanel-separator">
        <div class="codepanel-label">${type}</div>
        <div class="cp-btn-container">
          <button class="cp-apply-${type} gjs-btn-prim">${btnText}</button>
        </div>
      </div>`));
    const codeViewerEl = codeViewer.getElement();
    codeViewerEl.style.height = 'calc(100% - 30px)';
    section.append(codeViewerEl);
    this.codePanel.append(section);
    return section.get(0);
  }

  buildCodePanel() {
    const { $, editor } = this;
    const panel = this.findPanel();
    this.codePanel = $('<div></div>');
    this.codePanel.addClass('code-panel');

    this.htmlCodeEditor = this.buildCodeEditor('html');
    this.cssCodeEditor = this.buildCodeEditor('css');

    const sections = [this.buildSection('html', this.htmlCodeEditor), this.buildSection('css', this.cssCodeEditor)];

    panel && panel.set('appendContent', this.codePanel).trigger('change:appendContent');
    this.updateEditorContents();

    this.codePanel.find('.cp-apply-html')
      .on('click', this.updateHtml.bind(this));

    this.codePanel.find('.cp-apply-css')
      .on('click', this.updateCss.bind(this));

    Split(sections, {
      direction: 'vertical',
      sizes: [50, 50],
      minSize: 100,
      gutterSize: 1,
      onDragEnd: this.refreshEditors.bind(this),
    });

    editor.on('component:update', model => this.updateEditorContents());
    editor.on('stop:preview', () => {
      if (this.isShowing) {
        this.canvas.css('width', this.opts.openState.cv);
      }
    });
  }

  showCodePanel() {
    this.isShowing = true;
    this.updateEditorContents();
    this.codePanel.css('display', 'block');
    // make sure editor is aware of width change after the 300ms effect ends
    setTimeout(this.refreshEditors.bind(this), 320);

    this.panelViews.css('width', this.opts.openState.pn);
    this.canvas.css('width', this.opts.openState.cv);
  }

  hideCodePanel() {
    if (this.codePanel) this.codePanel.css('display', 'none');
    this.isShowing = false;

    this.panelViews.css('width', this.opts.closedState.pn);
    this.canvas.css('width', this.opts.closedState.cv);
  }

  refreshEditors() {
    this.htmlCodeEditor.refresh();
    this.cssCodeEditor.refresh();
  }

  updateHtml(e) {
    e?.preventDefault();
    const { editor, component } = this;
    let htmlCode = this.htmlCodeEditor.getContent().trim();
    if (!htmlCode || htmlCode === this.previousHtmlCode) return;
    this.previousHtmlCode = htmlCode;

    let idStyles = '';
    this.cssCodeEditor
      .getContent()
      .split('}\n')
      .filter((el) => Boolean(el.trim()))
      .map((cssObjectRule) => {
        if (!(/}$/.test(cssObjectRule))) {
          //* Have to check closing bracket existence for every rule cause it can be missed after split and add it if it doesnt match
          return `${cssObjectRule}}`;
        }
      })
      .forEach(rule => {
        if (/^#/.test(rule))
          idStyles += rule;
      });

    htmlCode += `<style>${idStyles}</style>`;

    if (component?.attributes.type === 'wrapper') {
      editor.setComponents(htmlCode);
    } else {
      editor.select(component?.replaceWith(htmlCode));
    }
    return htmlCode;
  }

  updateCss(e) {
    e?.preventDefault();
    const cssCode = this.cssCodeEditor.getContent().trim();
    if (!cssCode || cssCode === this.previousCssCode) return;
    this.previousCssCode = cssCode;
    this.editor.Css.addRules(cssCode);
    return cssCode;
  }

  getRules(rules, opts: any = {}) {
    const { editor } = this;
    const sm = editor.Selectors;
    return rules.map((rule) => {
      const selector = sm.get(rule.selectors);
      const { state, selectorsAdd } = rule;
      const { atRuleType, atRuleParams } = opts;
      return (
        selector &&
        editor.Css.get(selector, state, atRuleParams, {
          selectorsAdd,
          atRule: atRuleType,
        } as any)
      );
    });
  }

  updateEditorContents() {
    if (!this.isShowing) return;

    this.component = this.editor.getSelected();
    if (this.component) {
      this.htmlCodeEditor.setContent(this.component.toHTML());
      this.cssCodeEditor.setContent(this.editor.CodeManager.getCode(this.component, 'css', {
        cssc: this.editor.Css
      }));
    }
  }
}