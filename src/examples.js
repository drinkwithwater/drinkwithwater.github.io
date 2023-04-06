var THLUA_EXAMPLES=[{name:'class_function',content:(function(){/* ,
-- define a class function
const function:class(let.Hello) make(a:Integer, b:String)
	-- declare self table with .class
	return {.class
		a=a,
		b=b,
	}
end

const function.open isHello(v):isguard(Hello)
end

const t:Any = 321

if isHello(t) then
	(@print($t.a))
end
, */}).toString().slice(14, -3)},{name:'hello',content:(function(){/* ,
-- define a const variable
const constHello = "hello world"

-- define a local value, literal type auto cast to primitive type in local statement
local localBoolean = true
localBoolean = false

-- print in hint space
(@print($constHello))

-- print in lua space
print(constHello)

-- hint at symbol
const i:Integer = 321

-- type cast
const i = 321 @ Integer

, */}).toString().slice(14, -3)},{name:'hint_space',content:(function(){/* ,


const dosth = 321

-- use (@ ) to wrap statement for hint space, statement must be assign-statement or apply-statement or do-statement
(@let.HelloType = Number)

(@print(321))

(@do

-- define a struct, let is a default namespace in function level
let.A = Struct {
	fds=Integer,
	rew=String,
	-- namespace can be used for recursive define
	dosth=OrNil(let.A),
}

-- create a new namespace
let.name = namespace()

name.Node = Struct {
	left=name.Node,
	right=name.Node,
}

-- use $ to get a type of a lua variable, just like decltype in c++
print($dosth)

-- (@SuffixedExpr) can be used after $
print($(@A).fds)

end)
, */}).toString().slice(14, -3)},{name:'multi_ret',content:(function(){/* ,
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
, */}).toString().slice(14, -3)},{name:'object_oriented',content:(function(){/* ,
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
, */}).toString().slice(14, -3)},{name:'open_type',content:(function(){/* ,
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
, */}).toString().slice(14, -3)},{name:'type_cast',content:(function(){/* ,
-- use @ for covariance cast, this is safe
local castToA = 321 @ Integer

-- use @! for ignore nil cast, this is unsafe
castToA = nil @! Integer

-- use @> for contravariance cast, this is unsafe
const contraCast:Union(1,2) = castToA @> Literal(1)

-- use @? for force cast, this is very unsafe
const forceCast:Union(1,2) = "fdsfs" @? Literal(1)

-- use @<> for poly function
const function dosth@<T>(a:T):Ret(T)
	return a
end

const t:Integer = dosth@<Integer>(321)


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
, */}).toString().slice(14, -3)}]