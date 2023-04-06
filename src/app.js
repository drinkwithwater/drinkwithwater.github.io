
var initDone = false
initFunction = function(){
	if(initDone) {
		return;
	}
	if(initWasm && initDocument) {
		initDone = true;
	} else {
		return;
	}
	var luaState = new Module.CallInstance(THLUA_SCRIPT);
	var monaco = webpackModule.monaco
	var thlua_syntax = webpackModule.thlua_syntax
	var app = new Vue({
		el:"#app",
		data : {
			examples:THLUA_EXAMPLES,
		}
	});
	monaco.editor.setTheme("vs-dark")
	monaco.languages.register({id:'thlua'})
	monaco.languages.setLanguageConfiguration("thlua", thlua_syntax.conf)
	monaco.languages.setMonarchTokensProvider('thlua', thlua_syntax.language)

	var leftContent = "";
	leftContent = ['(@do', '\tprint("Hello in Hint Space")', 'end)', 'print("Hello in Lua Space")'].join('\n')
	var leftEditor = monaco.editor.create(document.getElementById('input'), {
		value: leftContent,
		language: 'thlua',
		fontSize: "20px",
		contextmenu:false,
	});
	var rightEditor = monaco.editor.create(document.getElementById('output'), {
		value: '',
		language: 'lua',
		fontSize: "20px",
		contextmenu:false,
		roundedSelection: false,
		scrollBeyondLastLine: false,
	});

	let update = function(triggerByEditor) {
		if(!triggerByEditor){
			leftEditor.setValue(leftContent);
		} else {
			leftContent = leftEditor.getValue();
		}
		let outputRaw = luaState.call("main", leftContent)
		let outputObj = JSON.parse(outputRaw)
		if(typeof(outputObj.err) == "string") {
			monaco.editor.setModelLanguage(rightEditor.getModel(), "plaintext")
			rightEditor.setValue(outputObj.err)
		} else if(typeof(outputObj.content) == "string"){
			monaco.editor.setModelLanguage(rightEditor.getModel(), "lua")
			rightEditor.setValue(outputObj.content)
		}
	}

	update(false);
	leftEditor.onDidChangeModelContent(function(e){
		update(true);
	});
}

