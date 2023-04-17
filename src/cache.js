
var CODE_CACHE = {
    getCache:function(){
        if (document.cookie.length > 0) {
            let c_start = document.cookie.indexOf("data=");
            if(c_start != -1) {
                c_start = c_start + 5;
                let c_end = document.cookie.indexOf(";", c_start);
                if (c_end == -1) {
                    c_end = document.cookie.length;
                }
                try {
                    let obj = JSON.parse(Base64.decode(document.cookie.substring(c_start, c_end)));
                    return {
                        selected:obj.selected.toString(),
                        content:obj.content.toString(),
                    }
                } catch(err){
                    return {
                        selected:"",
                        content:""
                    }
                }
            }
        }
        return {
            selected:"",
            content:""
        }
    },
    setCache:function(selected, content){
        let bcode = Base64.encodeURI(JSON.stringify({
            selected:selected,
            content:content
        }));
        document.cookie = "data="+bcode;
    },
}