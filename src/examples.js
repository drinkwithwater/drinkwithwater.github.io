var THLUA_EXAMPLES={'0_helloworld':(function(){/* 
-- 0. TypeHintLua is a library or a language for type hinting and static checking of lua

-- define a const variable, syntax error will be thrown if const variable is modified
const constHello = "hello world"

-- you can hint a variable with a type, and type will check when this variable is used
local oneInt:Integer = 321

oneInt = "fds" -- error, assign "fds" to Integer

-- you can hint function with type
const function takeString(a:String):Ret(Integer)
	return 321
end

takeString(oneInt) -- error, call param not match

-- you can write something in hint space
(@do
	print("Hello World in hint space")
	-- $ for get type in lua space
	print($oneInt)
end)

-- @ for type cast
local k = 231 @ Number
 */}).toString().slice(14, -3),'1_1_syntax_hint':(function(){/* 
-- 1.1 The syntaxes of TypeHintLua consist of two parts, one is lua syntax, and the other is also lua syntax.

-- 1) use ':' to hint for symbol variable
---- hint one value
const sth:Integer = 321

---- hint multi value
const a:Integer, b:String = 321,"rew"


-- 2) use .xxx & :xxx() for long hint in some case
---- use .open to define an open function
const function.open dosth()
end

---- use :Ret(xxx) for hinting function return
const function dosth():Ret(Integer)
	return 321
end


-- 3) use '(@' ')' to wrap statement for hint space, statement must be assign-statement or apply-statement or do-statement
---- assign-statement in hint space, let is a default namespace in function level
(@let.Hello = Number)

---- apply-statement in hint space
(@print(321))

---- do-statement in hint space
(@do
	-- define a struct, let is a default namespace in function level
	let.A = Struct {
		fds=Integer,
		rew=String,
		-- namespace can be used for recursive define
		recurField=OrNil(let.A),
	}

	-- create a new namespace
	let.name = namespace()

	name.Node = Struct {
		left=name.Node,
		right=name.Node,
	}

	-- 4) use '$' to get in hint space type
	---- get type of variable sth, just like decltype in c++
	print($sth)

	---- (@SuffixedExpr) can be used after $
	print($(@A).fds)
end)

 */}).toString().slice(14, -3),'1_2_syntax_cast':(function(){/* 
-- 1.2 use @ for type cast

-- 1) use '@' for covariance cast, this is safe
local castToA = 321 @ Integer

-- 2) use '@!' for ignore nil cast, this is unsafe
castToA = nil @! Integer

-- 3) use '@>' for contravariance cast, this is unsafe
const contraCast:Union(1,2) = castToA @> Literal(1)

-- 4) use '@?' for force cast, this is very unsafe
const forceCast:Union(1,2) = "fdsfs" @? Literal(1)

-- 5) use '@<' '>' for poly function
const function dosth@<T>(a:T):Ret(T)
	return a
end

const t:Integer = dosth@<Integer>(321)

-- 6) use '!' to ignore symbol or index's nil case
const i2s:Dict(Integer,String) = {}
const s:String = i2s[1]!


-- define an auto table, and cast it to a struct
const dataA:Struct {fds=123, rew="fds"} = {
	fds=123,
	rew="fds",
}

-- define a class function
const function:class(let.Hello) make(a:Integer, b:String)
	-- declare self table with .class
	return {.class
		a=a,
		b=b,
	}
end
 */}).toString().slice(14, -3),'2_1_type_basic':(function(){/* 

-- primitive types
const a:Boolean = true

const a:Number = 321

const a:String = "fdsfds"

-- literal type
const a:False = false

const a:Literal(321) = 321

const a:Literal("fds") = "fds"

-- thread
const a:Thread = coroutine.create(function()
end)

-- Truth
const a:Truth = math.random() > 0.5 and 321 or {}

-- Any
const a:Any = math.random() > 0.5 and 321 or false

 */}).toString().slice(14, -3),'2_2_type_union':(function(){/* 
-- define union
const t:Union(Integer, String) = 321

-- assign when t is table
if type(t) == "number" then
	const i:Integer = t
else
	const i:String = t
end


 */}).toString().slice(14, -3),'2_3_type_object':(function(){/* 

(@do

-- define a struct
let.Point = Struct {
	x=Number,
	y=Number,
}

-- define an interface
let.IPoint = Interface {
	x=Number,
	y=Number,
}

end)

-- union object with other type
const t:Union(Point, String) = {
	x=321,
	y=123,
}

-- assign when t is table
if type(t) == "table" then
	t.x = 321
end


 */}).toString().slice(14, -3),'2_4_type_table':(function(){/* 
-- define a class function
const function:class(let.Hello) make(a:Integer, b:String)
	-- declare self table with .class
	return {.class
		a=a,
		b=b,
	}
end

const t = make(321,"fdsfs")

(@print($t.a))

-- auto table
const c = {}
 */}).toString().slice(14, -3),'2_5_type_function':(function(){/* 
-- class function
const function:class(let.Hello) make(a:Integer, b:String)
	-- declare self table with .class
	return {.class
		a=a,
		b=b,
	}
end

-- guard function
const function.open isHello(v):isguard(Hello)
end

const t:Any = 321

if isHello(t) then
	t.a = 321
end

-- open function
const function.open justReturn(a,b,c)
	return a,b,c
end


-- define a function with multi return type
const function multiReturn(a:Integer):Ret(True, Integer):Ret(False, String)
	if math.random() > 0.5 then
		return true, a
	else
		return false, "fdsfsd"
	end
end

const ok, data = multiReturn(321321)

if ok then
	(@print($data))
else
	(@print($data))
end
 */}).toString().slice(14, -3),'2_6_type_opentype':(function(){/* 
(@let.name=namespace())

-- define an open function, open function will expand stack for each apply
-- open function is useful sometimes, but not very safe, completion sometimes not work in open function
const function.open make(clsName)
	-- define a open table, open table is regard as singleton type
	const meta = {.open}
	meta.__index = meta
	function:class(name[$clsName]) meta.new()
		return setmetatable({.class
		}, meta)
	end
	function meta:getData()
		return clsName
	end
	if clsName == "class1" then
		-- open table can modify field
		function meta:getData()
			return "not clsName"
		end
	end
	return meta
end

const cls1 = make("class1")
const obj1 = cls1.new()

const cls2 = make("class2")
const obj2 = cls2.new()

(@print($obj1:getData()))
(@print($obj2:getData()))
 */}).toString().slice(14, -3),'3_template':(function(){/* 
-- use builtin template
const l:List(Integer) = {}

l[#l+1] = 123

(@

-- define a template
let.Pair = Template(function(First,Second)
	return Struct {
		first=First,
		second=Second,
	}
end)

)

-- use template
const t:Pair(Integer, String) = {
	first=321,
	second='fdsfs',
}

-- use template type to check symbol init
const t:Pair(Integer, String) = {
	first="jfkdlsfjsfs",
	second='fdsfs',
}
 */}).toString().slice(14, -3),'4_1_oo_class':(function(){/* 
(@do

let.IDosth = Interface {
	dosth=Mfn(Struct {fds=321})
}

end)

const A = {.open}
A.__index = A

function:class(let.A) A.new():implements(IDosth)
	const self = setmetatable({.class
		fds=321,
	}, A)
	return self
end

function A:dosth(s)
	print(self.fds)
end

const B = {.open}
B.__index = B

function:class(let.B) B.new():extends(A)
	const self = setmetatable({.class
		fds=321,
	}, B)
	return self
end

B.dosth = A.dosth
 */}).toString().slice(14, -3),'4_2_oo_more':(function(){/* 
const class2meta={}
const meta2class={}

(@do
	let.clazz = namespace()
	let.open2type = namespace()
end)

const function.open class@<C, I>(super)
	const class_type={.open}
	(@open2type[$class_type] = C)
	class_type.ctor=false
	class_type.super=super
	class_type.new=function:class(C) (...):extends(Cond($super, open2type[$super], False)):implements(I)
			const obj={.class}
			do
				const function.open create(c,...)
					if c.super then
						create(c.super,...)
					end
					if c.ctor then
						c.ctor(obj,...)
					end
				end

				create(class_type,...)
			end
			setmetatable(obj, class_type.meta)
			return obj
		end
	const vtbl={.open}
	const meta={.open
		__index=vtbl
	}
	class_type.isDict = setmetatable({}, {
		__index=function.pass(type2is:Dict(Truth, Boolean), if_type:Truth):Ret(Boolean)
			local cur_type = class_type
			while cur_type do
				if cur_type == if_type then
					type2is[if_type] = true
					return true
				else
					cur_type = cur_type.super
				end
			end
			type2is[if_type] = false
			return false
		end
	}) @? Dict(Truth, Boolean)
	class_type.is=function.open(v):isguard(C)
		const nClassType = meta2class[getmetatable(v) or 1]
		const nIsDict = nClassType and nClassType.isDict
		return nIsDict and nIsDict[class_type] or false
	end
	class_type.meta=meta
	class2meta[class_type]=meta
	meta2class[meta]=class_type

	setmetatable(class_type,{__newindex=
		function.open(t,k,v)
			vtbl[k]=v
		end
	})

	if super then
		const super_meta = class2meta[super]
		for k,v in pairs(super_meta.__index) do
			vtbl[k] = v
		end
		for k,v in pairs(super_meta) do
			if k ~= "__index" then
				meta[k] = v
			end
		end
	end

	return class_type
end

const Base = class@<clazz.Base, false>()

function.open Base:ctor(a:Integer)
	self._data = 321
end

const Extend = class@<clazz.Extend, false>(Base)

function.open Extend:ctor(...)
end

function Extend:hello()
	(@print($self._data))
end

const e = Extend.new(321)
 */}).toString().slice(14, -3)}