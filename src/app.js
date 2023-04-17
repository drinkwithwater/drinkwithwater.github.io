
var initDone = false
var leftEditor = null;
var initFunction = function(){
	if(initDone) {
		return;
	}
	if(initWasm && initDocument) {
		initDone = true;
	} else {
		return;
	}

	// editor logic
	var luaState = new Module.CallInstance(THLUA_SCRIPT);
	var monaco = webpackModule.monaco
	var thlua_syntax = webpackModule.thlua_syntax
	monaco.editor.setTheme("vs-dark")
	monaco.languages.register({id:'thlua'})
	monaco.languages.setLanguageConfiguration("thlua", thlua_syntax.conf)
	monaco.languages.setMonarchTokensProvider('thlua', thlua_syntax.language)

	var leftContent = "";
	leftContent = ['(@do', '\tprint("Hello in Hint Space")', 'end)', 'print("Hello in Lua Space")'].join('\n')
	leftEditor = monaco.editor.create(document.getElementById('inputBody'), {
		value: leftContent,
		language: 'thlua',
		fontSize: "20px",
		contextmenu:false,
		minimap: { enabled: false },
	});
	var rightEditor = monaco.editor.create(document.getElementById('outputBody'), {
		value: '',
		language: 'lua',
		fontSize: "20px",
		readOnly:true,
		contextmenu:false,
		minimap: { enabled: false },
	});

	var rightHeader = new Vue({
		el:"#outputHead",
		data : {
			showLua:true,
			syntaxErr:false,
			luaContent:"",
			diaContent:"",
		},
		methods: {
			showLuaOrNot:function(v){
				if(v) {
					this.showLua = true;
				} else {
					this.showLua = false;
				}
				this.update();
			},
			update:function(){
				if(!this.showLua) {
					if (rightEditor.getModel().getLanguageId() != "plaintext") {
						monaco.editor.setModelLanguage(rightEditor.getModel(), "plaintext");
					}
					rightEditor.setValue(this.diaContent)
				} else {
					let lang = "lua";
					if(this.syntaxErr){
						lang="plaintext";
					}
					if (rightEditor.getModel().getLanguageId() != lang) {
						monaco.editor.setModelLanguage(rightEditor.getModel(), lang);
					}
					rightEditor.setValue(this.luaContent)
				}
			}
		}
	});

	let luaCall = function(selectName, triggerByEditor) {
		let position = false
		if(!triggerByEditor){
			leftEditor.setValue(leftContent);
		} else {
			position = {
				l:leftEditor.getPosition().lineNumber + 1,
				c:leftEditor.getPosition().column,
			}
			leftContent = leftEditor.getValue();
		}
		let inputRaw = JSON.stringify({
			position:position,
			content:leftContent
		})
		// console.log(inputRaw)
		let outputRaw = luaState.call(selectName, inputRaw)
		let outputObj = JSON.parse(outputRaw)
		let markerList = []
		let diaContent = ""
		for(var i=0;i<outputObj.diaList.length;i++) {
			let dia = outputObj.diaList[i];
			let markerSeverity = 1;
			switch(dia.severity){
				case 1:{
					diaContent += "[ERROR]";
					markerSeverity = 8;
					break;
				}
				case 2:{
					diaContent += "[WARN]"
					markerSeverity = 4;
					break;
				}
				default:{
					diaContent += "[INFO]"
					markerSeverity = 2;
					break;
				}
			}
			diaContent += dia.node.path+":"+dia.node.l+","+dia.node.c+":"
			diaContent += dia.msg;
			diaContent += "\n";
			markerList[i] = {
				severity: markerSeverity,
				message: dia.msg,
				startLineNumber: dia.node.l,
				startColumn: dia.node.c,
				endLineNumber: dia.node.l,
				endColumn: dia.node.c + 10,
			}
		}
		rightHeader.syntaxErr = outputObj.syntaxErr;
		rightHeader.diaContent = diaContent;
		rightHeader.luaContent = outputObj.luaContent;
		monaco.editor.setModelMarkers(leftEditor.getModel(), "thlua", markerList);
		rightHeader.update();
	}

	let exampleKeys = [];
	for(let k in THLUA_EXAMPLES) {
		exampleKeys.push(k);
	}
	exampleKeys.sort(function(a,b){
		return a.localeCompare(b);
	});

	var leftHeader = new Vue({
		el:"#inputHead",
		data : {
			examples:exampleKeys,
			selected:"0_hello"
		},
		methods: {
			useExample:function(name){
				let content = THLUA_EXAMPLES[name]
				leftContent = content;
				this.selected = name;
				luaCall(this.selected, false);
			}
		}
	});

	luaCall(leftHeader.selected, false);
	leftEditor.onDidChangeModelContent(function(e){
		luaCall(leftHeader.selected, true);
	});
}

