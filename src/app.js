
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
						monaco.editor.setModelLanguage(rightEditor.getModel(), "plaintext")
					}
					rightEditor.setValue(this.diaContent)
				} else {
					if (rightEditor.getModel().getLanguageId() != "lua") {
						monaco.editor.setModelLanguage(rightEditor.getModel(), "lua")
					}
					rightEditor.setValue(this.luaContent)
				}
			}
		}
	});

	let update = function(triggerByEditor) {
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
		let outputRaw = luaState.call("main", inputRaw)
		let outputObj = JSON.parse(outputRaw)
		if(typeof(outputObj.err) == "string") {
			rightHeader.diaContent = outputObj.err;
		} else if(typeof(outputObj.content) == "string"){
			rightHeader.luaContent = outputObj.content;
		}
		rightHeader.update();
	}

	update(false);
	leftEditor.onDidChangeModelContent(function(e){
		update(true);
	});

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
				update(false);
			}
		}
	});
}

