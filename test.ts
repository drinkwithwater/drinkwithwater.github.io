
import * from "monaco-editor/monaco"

let editor = monaco.editor.create()


editor.onDidChangeModelContent(function(e){
})
let model = editor.getModel()

model?.onDidChangeContent(function(e){
})

monaco.editor.setTheme("vs-dark")