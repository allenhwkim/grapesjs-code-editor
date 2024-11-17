import { Editor } from "grapesjs";

export default function(editor: Editor, options = {category: 'Table'}) {
  editor.BlockManager.add('table', {
    label: "Table",
    attributes: { class: "fa fa-table" },
    category: "Tables",
    activate: true,
    content: `<table>
      <tbody>
        <tr><th>h1</th><th>h2</th><th>h3</th></tr>
        <tr><td>d1</td><td>d2</td><td>d3</dh></tr>
        <tr><td>d1</td><td>d2</td><td>d3</dh></tr>
        <tr><td>d1</td><td>d2</td><td>d3</dh></tr>
      </tbody>
    </table>`,
  });

  editor.Components.addType('table', {
    isComponent: el => el.tagName == 'TABLE',

    model: {
      defaults: {
        tagName: 'table',
        traits: [],
      }
    },
    view: {
      init() {
        this.listenTo(this.model, "active", this.openModal);
      },

      openModal() {
        let setRows = '4';
        let setColumns = '3';
        const divContainer = document.createElement("div");
        divContainer.insertAdjacentHTML('beforeend', `
          Number of rows: <input id="rows" type="number" value="4" /> <br/>
          Number of cols: <input id="cols" type="number" value="3" /> <br/>
          <button>Create table</button>
        `);
        (divContainer.querySelector('button') as any).addEventListener('click', event => {
          this.model.set("rows", setRows);
          this.model.set("columns", setColumns);
          const rows = +(divContainer.querySelector('#rows') as any).value || 4;
          const cols = +(divContainer.querySelector('#cols') as any).value || 5;

          const components: any[] = [];
          for (var i=0; i<rows; i++) {
            const rowComp = {type: 'row', components: [] as any[]};
            for (var j=0; j<cols; j++) {
              const tagName = i === 0 ? 'th' : 'td';
              rowComp.components.push({type: 'cell', tagName,  content: `col${i+1}`})
            }
            components.push(rowComp);
          }
          this.model.components([
            {type: 'tbody', components}
          ]);

          editor.Modal.close();
        });

        editor.Modal
          .setTitle("Add a New Table")
          .setContent(divContainer)
          .open();
      },
    },
  });

};
