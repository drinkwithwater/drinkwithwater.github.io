
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
		let diaContent = ""
		for(var i=0;i<outputObj.diaList.length;i++) {
			let dia = outputObj.diaList[i];
			switch(dia.severity){
				case 1:{
					diaContent += "[ERROR]"
					break;
				}
				case 2:{
					diaContent += "[WARN]"
					break;
				}
				default:{
					diaContent += "[INFO]"
					break;
				}
			}
			diaContent += dia.node.path+":"+dia.node.l+","+dia.node.c+":"
			diaContent += dia.msg;
			diaContent += "\n";
		}
		rightHeader.syntaxErr = outputObj.syntaxErr;
		rightHeader.diaContent = diaContent;
		rightHeader.luaContent = outputObj.luaContent;
		rightHeader.update();
	}

	var leftHeader = new Vue({
		el:"#inputHead",
		data : {
			examples:[
				"hello",
				"hint_space",
				"multi_ret",
				"open_type",
				"type_cast",
				"class_function",
				"object_oriented",
			],
			selected:"hello"
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

