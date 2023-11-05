// not compiled. just a reminder

// register  ------------
this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
    console.log('click', evt);
});

// Add command ---------------------------------
this.addCommand({
    id: 'open-sample-modal-simple',
    name: 'Open sample modal (simple)',
    callback: () => {
        // new SampleModal(this.app).open();
    }
});

this.addCommand({
    id: 'sample-editor-command',
    name: 'Sample editor command',
    editorCallback: (editor: Editor, view: MarkdownView) => {
        console.log(editor.getSelection());
        editor.replaceSelection('Sample Editor Command');
    }
});

this.addCommand({
    id: 'open-sample-modal-complex',
    name: 'Open sample modal (complex)',
    checkCallback: (checking: boolean) => {
        // Conditions to check
        const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (markdownView) {
            if (!checking) {
                new SampleModal(this.app).open();
            }
            return true;
        }
    }
});