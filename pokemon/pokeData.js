function p(id         ,Name              ,Type1             ,Type2             ,Total       ,HP ,Attack,Defense,SpAtk,SpDef,Speed,Generation,Legendary,Evolved , Rarity, Moves){
	this.id = id;
	this.name = Name;
	this.type = [Type1, Type2];
	this.total = Total;
	this.stats = [HP  , Attack           , Defense          , SpAtk            , SpDef      , Speed];
	this.gen = Generation;
	this.legendary = Legendary;
	this.evolution = Evolved;
	this.rarity = Rarity;
	this.moves = Moves;

	this.hasType = function(){
		var final = false;
		if(arguments[0] == "" || arguments[1] == ""){
			return true;
		}
		for(var i = 0; i < arguments.length; i++){
			if(arguments[i] == ""){
				continue;
			}
			if(this.type[0] == arguments[i] || this.type[1] == arguments[i]){
				final =  true;
			}
		}
		return final;
	}
}

var T = {
	"Normal": 0       , 0: "Normal"      ,
	"Fire": 1         , 1: "Fire"        ,
	"Water": 2        , 2: "Water"       ,
	"Electric": 3     , 3: "Electric"    ,
	"Grass": 4        , 4: "Grass"       ,
	"Ice": 5          , 5: "Ice"         ,
	"Fighting": 6     , 6: "Fighting"    ,
	"Poison": 7       , 7: "Poison"      ,
	"Ground": 8       , 8: "Ground"      ,
	"Flying": 9       , 9: "Flying"      ,
	"Psychic": 10     , 10: "Psychic"    ,
	"Bug": 11         , 11: "Bug"        ,
	"Rock": 12        , 12: "Rock"       ,
	"Ghost": 13       , 13: "Ghost"      ,
	"Dragon": 14      , 14: "Dragon"     ,
	"Dark": 15        , 15: "Dark"       ,
	"Steel": 16       , 16: "Steel"      ,
	"Fairy": 17       , 17: "Fairy"      ,
	"None": 18        , 18: "None"
};

var types = [{
	title: "Normal"   , color1: "#A8A878", color2: "#6D6D4E", color3: "#C6C6A7", against: [1,1  ,1     ,1      ,1    ,1    ,1    ,1         ,1        ,1       ,1   ,1  ,0.5,0  ,1  ,1  ,0.5,1  ,1]},{
	title: "Fire"     , color1: "#F08030", color2: "#9C531F", color3: "#F5AC78", against: [1,0.5,0.5   ,1      ,2    ,2    ,1    ,1         ,1        ,1       ,1   ,2  ,0.5,1  ,0.5,1  ,2  ,1  ,1]},{
	title: "Water"    , color1: "#6890F0", color2: "#445E9C", color3: "#9DB7F5", against: [1,2  ,0.5   ,1      ,0.5  ,1    ,1    ,1         ,2        ,1       ,1   ,1  ,2  ,1  ,0.5,1  ,1  ,1  ,1]},{
	title: "Electric" , color1: "#F8D030", color2: "#A1871F", color3: "#FAE078", against: [1,1  ,2     ,0.5    ,0.5  ,1    ,1    ,1         ,0        ,2       ,1   ,1  ,1  ,1  ,0.5,1  ,1  ,1  ,1]},{
	title: "Grass"    , color1: "#78C850", color2: "#4E8234", color3: "#A7DB8D", against: [1,0.5,2     ,1      ,0.5  ,1    ,1    ,0.5       ,2        ,0.5     ,1   ,0.5,2  ,1  ,0.5,1  ,0.5,1  ,1]},{
	title: "Ice"      , color1: "#98D8D8", color2: "#638D8D", color3: "#BCE6E6", against: [1,0.5,0.5   ,1      ,2    ,0.5  ,1    ,1         ,2        ,2       ,1   ,1  ,1  ,1  ,2  ,1  ,0.5,1  ,1]},{
	title: "Fighting" , color1: "#C03028", color2: "#7D1F1A", color3: "#D67873", against: [2,1  ,1     ,1      ,1    ,2    ,1    ,0.5       ,1        ,0.5     ,0.5 ,0.5,2  ,0  ,1  ,2  ,2  ,0.5,1]},{
	title: "Poison"   , color1: "#A040A0", color2: "#682A68", color3: "#C183C1", against: [1,1  ,1     ,1      ,2    ,1    ,1    ,0.5       ,0.5      ,1       ,1   ,1  ,0.5,0.5,1  ,1  ,0  ,2  ,1]},{
	title: "Ground"   , color1: "#E0C068", color2: "#927D44", color3: "#EBD69D", against: [1,2  ,1     ,2      ,0.5  ,1    ,1    ,2         ,1        ,0       ,1   ,0.5,2  ,1  ,1  ,1  ,2  ,1  ,1]},{
	title: "Flying"   , color1: "#A890F0", color2: "#6D5E9C", color3: "#C6B7F5", against: [1,1  ,1     ,0.5    ,2    ,1    ,2    ,1         ,1        ,1       ,1   ,2  ,0.5,1  ,1  ,1  ,0.5,1  ,1]},{
	title: "Psychic"  , color1: "#F85888", color2: "#A13959", color3: "#FA92B2", against: [1,1  ,1     ,1      ,1    ,1    ,2    ,2         ,1        ,1       ,0.5 ,1  ,1  ,1  ,1  ,0  ,0.5,1  ,1]},{
	title: "Bug"      , color1: "#A8B820", color2: "#6D7815", color3: "#C6D16E", against: [1,0.5,1     ,1      ,2    ,1    ,0.5  ,0.5       ,1        ,0.5     ,2   ,1  ,1  ,0.5,1  ,2  ,0.5,0.5,1]},{
	title: "Rock"     , color1: "#B8A038", color2: "#786824", color3: "#D1C17D", against: [1,2  ,1     ,1      ,1    ,2    ,0.5  ,1         ,0.5      ,2       ,1   ,2  ,1  ,1  ,1  ,1  ,0.5,1  ,1]},{
	title: "Ghost"    , color1: "#705898", color2: "#493963", color3: "#A292BC", against: [0,1  ,1     ,1      ,1    ,1    ,1    ,1         ,1        ,1       ,2   ,1  ,1  ,2  ,1  ,0.5,1  ,1  ,1]},{
	title: "Dragon"   , color1: "#7038F8", color2: "#4924A1", color3: "#A27DFA", against: [1,1  ,1     ,1      ,1    ,1    ,1    ,1         ,1        ,1       ,1   ,1  ,1  ,1  ,2  ,1  ,0.5,0  ,1]},{
	title: "Dark"     , color1: "#705848", color2: "#49392F", color3: "#A29288", against: [1,1  ,1     ,1      ,1    ,1    ,0.5  ,1         ,1        ,1       ,2   ,1  ,1  ,2  ,1  ,0.5,1  ,0.5,1]},{
	title: "Steel"    , color1: "#B8B8D0", color2: "#787887", color3: "#D1D1E0", against: [1,0.5,0.5   ,0.5    ,1    ,2    ,1    ,1         ,1        ,1       ,1   ,1  ,2  ,1  ,1  ,1  ,0.5,2  ,1]},{
	title: "Fairy"    , color1: "#EE99AC", color2: "#9B6470", color3: "#F4BDC9", against: [1,0.5,1     ,1      ,1    ,1    ,2    ,0.5       ,1        ,1       ,1   ,1  ,1  ,1  ,2  ,2  ,0.5,1  ,1]},{
	title: "None"     , color1: "#A9A998", color2: "#6E6E5A", color3: "#C6C6A7", against: [1,1  ,1     ,1      ,1    ,1    ,1    ,1.1       ,1        ,1       ,1   ,1  ,1  ,1  ,1  ,1  ,1  ,1  ,1]
	}]

	var moves=[{}
		,{id:1 ,name:"pound"         ,type:"None"    ,power:40 ,accuracy:100,pp:35}
		,{id:2 ,name:"karate-chop"   ,type:"Fighting",power:50 ,accuracy:100,pp:25}
		,{id:3 ,name:"double-slap"   ,type:"Normal"  ,power:15 ,accuracy:85 ,pp:10}
		,{id:4 ,name:"mega-punch"    ,type:"Normal"  ,power:80 ,accuracy:85 ,pp:20}
		,{id:5 ,name:"fire-punch"    ,type:"Fire"    ,power:75 ,accuracy:100,pp:15}
		,{id:6 ,name:"ice-punch"     ,type:"Ice"     ,power:75 ,accuracy:100,pp:15}
		,{id:7 ,name:"thunder-punch" ,type:"Electric",power:75 ,accuracy:100,pp:15}
		,{id:8 ,name:"scratch"       ,type:"None"    ,power:40 ,accuracy:100,pp:35}
		,{id:9 ,name:"vice-grip"     ,type:"Normal"  ,power:55 ,accuracy:100,pp:30}
		,{id:10,name:"razor-wind"    ,type:"Normal"  ,power:80 ,accuracy:100,pp:10}
		,{id:11,name:"cut"           ,type:"None"    ,power:50 ,accuracy:95 ,pp:30}
		,{id:12,name:"gust"          ,type:"Flying"  ,power:40 ,accuracy:100,pp:35}
		,{id:13,name:"wing-attack"   ,type:"Flying"  ,power:60 ,accuracy:100,pp:35}
		,{id:14,name:"fly"           ,type:"Flying"  ,power:90 ,accuracy:95 ,pp:15}
		,{id:15,name:"bind"          ,type:"None"    ,power:15 ,accuracy:85 ,pp:20}
		,{id:16,name:"slam"          ,type:"None"    ,power:40 ,accuracy:75 ,pp:20}
		,{id:17,name:"vine-whip"     ,type:"Grass"   ,power:45 ,accuracy:100,pp:25}
		,{id:18,name:"stomp"         ,type:"None"    ,power:50 ,accuracy:100,pp:20}
		,{id:19,name:"double-kick"   ,type:"Fighting",power:30 ,accuracy:100,pp:30}
		,{id:20,name:"mega-kick"     ,type:"Normal"  ,power:120,accuracy:75 ,pp:5}
		,{id:21,name:"jump-kick"     ,type:"Fighting",power:100,accuracy:95 ,pp:10}
		,{id:22,name:"rolling-kick"  ,type:"Fighting",power:60 ,accuracy:85 ,pp:15}
		,{id:23,name:"headbutt"      ,type:"None"    ,power:45 ,accuracy:100,pp:15}
		,{id:24,name:"horn-attack"   ,type:"Normal"  ,power:65 ,accuracy:100,pp:25}
		,{id:25,name:"fury-attack"   ,type:"Normal"  ,power:15 ,accuracy:85 ,pp:20}
		,{id:26,name:"tackle"        ,type:"None"    ,power:40 ,accuracy:100,pp:35}
		,{id:27,name:"body-slam"     ,type:"None"    ,power:55 ,accuracy:100,pp:15}
		,{id:28,name:"wrap"          ,type:"None"    ,power:25 ,accuracy:90 ,pp:20}
		,{id:29,name:"take-down"     ,type:"None"    ,power:90 ,accuracy:50 ,pp:20}
		,{id:30,name:"thrash"        ,type:"None"    ,power:120,accuracy:20,pp:10}
		,{id:31,name:"double-edge"   ,type:"Normal"  ,power:120,accuracy:100,pp:15}
		,{id:32,name:"poison-sting"  ,type:"Poison"  ,power:15 ,accuracy:100,pp:35}
		,{id:33,name:"twineedle"     ,type:"Bug"     ,power:25 ,accuracy:100,pp:20}
		,{id:34,name:"pin-missile"   ,type:"Bug"     ,power:25 ,accuracy:95 ,pp:20}
		,{id:35,name:"bite"          ,type:"Dark"    ,power:60 ,accuracy:100,pp:25}
		,{id:36,name:"acid"          ,type:"Poison"  ,power:40 ,accuracy:100,pp:30}
		,{id:37,name:"ember"         ,type:"Fire"    ,power:40 ,accuracy:100,pp:25}
		,{id:38,name:"flamethrower"  ,type:"Fire"    ,power:90 ,accuracy:100,pp:15}
		,{id:39,name:"water-gun"     ,type:"Water"   ,power:40 ,accuracy:100,pp:25}
		,{id:40,name:"hydro-pump"    ,type:"Water"   ,power:110,accuracy:80 ,pp:5}
		,{id:41,name:"surf"          ,type:"Water"   ,power:90 ,accuracy:100,pp:15}
		,{id:42,name:"ice-beam"      ,type:"Ice"     ,power:90 ,accuracy:100,pp:10}
		,{id:43,name:"blizzard"      ,type:"Ice"     ,power:110,accuracy:70 ,pp:5}
		,{id:44,name:"psybeam"       ,type:"Psychic" ,power:65 ,accuracy:100,pp:20}
		,{id:45,name:"bubble-beam"   ,type:"Water"   ,power:65 ,accuracy:100,pp:20}
		,{id:46,name:"aurora-beam"   ,type:"Ice"     ,power:65 ,accuracy:100,pp:20}
		,{id:47,name:"hyper-beam"    ,type:"Normal"  ,power:150,accuracy:90 ,pp:5}
		,{id:48,name:"peck"          ,type:"Flying"  ,power:35 ,accuracy:100,pp:35}
		,{id:49,name:"drill-peck"    ,type:"Flying"  ,power:80 ,accuracy:100,pp:20}
		,{id:50,name:"submission"    ,type:"Fighting",power:80 ,accuracy:80 ,pp:20}
		,{id:51,name:"strength"      ,type:"Normal"  ,power:80 ,accuracy:100,pp:15}
		,{id:52,name:"absorb"        ,type:"Grass"   ,power:20 ,accuracy:100,pp:25}
		,{id:53,name:"mega-drain"    ,type:"Grass"   ,power:40 ,accuracy:100,pp:15}
		,{id:54,name:"razor-leaf"    ,type:"Grass"   ,power:55 ,accuracy:95 ,pp:25}
		,{id:55,name:"solar-beam"    ,type:"Grass"   ,power:120,accuracy:100,pp:10}
		,{id:56,name:"petal-dance"   ,type:"Grass"   ,power:120,accuracy:100,pp:10}
		,{id:57,name:"fire-spin"     ,type:"Fire"    ,power:35 ,accuracy:85 ,pp:15}
		,{id:58,name:"thunder-shock" ,type:"Electric",power:40 ,accuracy:100,pp:30}
		,{id:59,name:"thunderbolt"   ,type:"Electric",power:90 ,accuracy:100,pp:15}
		,{id:60,name:"thunder"       ,type:"Electric",power:110,accuracy:70 ,pp:10}
		,{id:61,name:"rock-throw"    ,type:"Rock"    ,power:50 ,accuracy:90 ,pp:15}
		,{id:62,name:"earthquake"    ,type:"Ground"  ,power:100,accuracy:100,pp:10}
		,{id:63,name:"dig"           ,type:"Ground"  ,power:80 ,accuracy:100,pp:10}
		,{id:64,name:"confusion"     ,type:"Psychic" ,power:50 ,accuracy:100,pp:25}
		,{id:65,name:"psychic"       ,type:"Psychic" ,power:90 ,accuracy:100,pp:10}
		,{id:66,name:"quick-attack"  ,type:"None"    ,power:40 ,accuracy:100,pp:30}
		,{id:67,name:"rage"          ,type:"None"    ,power:30 ,accuracy:100,pp:20}
		,{id:68,name:"self-destruct" ,type:"Normal"    ,power:200,accuracy:100,pp:5}
		,{id:69,name:"egg-bomb"      ,type:"Normal"  ,power:100,accuracy:75 ,pp:10}
		,{id:70,name:"lick"          ,type:"Ghost"   ,power:30 ,accuracy:100,pp:30}
		,{id:71,name:"smog"          ,type:"Poison"  ,power:30 ,accuracy:70 ,pp:20}
		,{id:72,name:"sludge"        ,type:"Poison"  ,power:65 ,accuracy:100,pp:20}
		,{id:73,name:"bone-club"     ,type:"Ground"  ,power:65 ,accuracy:85 ,pp:20}
		,{id:74,name:"fire-blast"    ,type:"Fire"    ,power:110,accuracy:85 ,pp:5}
		,{id:75,name:"waterfall"     ,type:"Water"   ,power:80 ,accuracy:100,pp:15}
		,{id:76,name:"clamp"         ,type:"Water"   ,power:35 ,accuracy:85 ,pp:15}
		,{id:77,name:"swift"         ,type:"None"    ,power:50 ,accuracy:100  ,pp:20}
		,{id:78,name:"skull-bash"    ,type:"Normal"  ,power:130,accuracy:100,pp:10}
		,{id:79,name:"spike-cannon"  ,type:"Normal"  ,power:20 ,accuracy:100,pp:15}
		,{id:80,name:"constrict"     ,type:"None"    ,power:20 ,accuracy:100,pp:35}
		,{id:81,name:"high-jump-kick",type:"Fighting",power:130,accuracy:90 ,pp:10}
		,{id:82,name:"dream-eater"   ,type:"Psychic" ,power:100,accuracy:100,pp:15}
		,{id:83,name:"barrage"       ,type:"None"    ,power:15 ,accuracy:85 ,pp:20}
		,{id:84,name:"leech-life"    ,type:"Bug"     ,power:80 ,accuracy:100,pp:10}
		,{id:85,name:"sky-attack"    ,type:"Flying"  ,power:140,accuracy:90 ,pp:5}
		,{id:86,name:"bubble"        ,type:"Water"   ,power:40 ,accuracy:100,pp:30}
		,{id:87,name:"dizzy-punch"   ,type:"Normal"  ,power:70 ,accuracy:100,pp:10}
		,{id:88,name:"crabhammer"    ,type:"Water"   ,power:100,accuracy:90 ,pp:10}
		,{id:89,name:"explosion"     ,type:"Normal"    ,power:250,accuracy:100,pp:5}
		,{id:90,name:"fury-swipes"   ,type:"None"    ,power:18 ,accuracy:80 ,pp:15}
		,{id:91,name:"bonemerang"    ,type:"Ground"  ,power:50 ,accuracy:90 ,pp:10}
		,{id:92,name:"rock-slide"    ,type:"Rock"    ,power:75 ,accuracy:90 ,pp:10}
		,{id:93,name:"hyper-fang"    ,type:"Normal"  ,power:80 ,accuracy:90 ,pp:15}
		,{id:94,name:"tri-attack"    ,type:"Normal"  ,power:80 ,accuracy:100,pp:10}
		,{id:95,name:"slash"         ,type:"None"    ,power:50 ,accuracy:100,pp:20}
		,{id:96,name:"flail"         ,type:"None"    ,power:0 ,accuracy:100,pp:20}
		,{id:97,name:"splash"         ,type:"Water"    ,power:0 ,accuracy:100,pp:20}
		,{id:98,name:"outrage"         ,type:"Dragon"    ,power:200 ,accuracy:100,pp:20}]


	var z = Array.apply(null, {length: moves.length}).map(Number.call, Number).splice(1);
	var pD = [0, new p (
		1      ,"Bulbasaur" ,"Grass"   ,"Poison"  ,318,45 ,49 ,49 ,65 ,65 ,45 ,1,false,0       ,.05   , [1 ,15,56,36]), new p(
		2      ,"Ivysaur"   ,"Grass"   ,"Poison"  ,405,60 ,62 ,63 ,80 ,80 ,60 ,1,false,1       ,0     , [1 ,15,56,36,17]), new p(
		3      ,"Venusaur"  ,"Grass"   ,"Poison"  ,525,80 ,82 ,83 ,100,100,80 ,1,false,2       ,0     , [1 ,15,56,36,17,32]), new p(
		4      ,"Charmander","Fire"    ,"None"    ,309,39 ,52 ,43 ,60 ,50 ,65 ,1,false,0       ,.05   , [8 ,95,37]), new p(
		5      ,"Charmeleon","Fire"    ,"None"    ,405,58 ,64 ,58 ,80 ,65 ,80 ,1,false,4       ,0     , [8 ,95,37,38]), new p(
		6      ,"Charizard" ,"Fire"    ,"Flying"  ,534,78 ,84 ,78 ,109,85 ,100,1,false,5       ,0     , [18,95,37,38,14,85]), new p(
		7      ,"Squirtle"  ,"Water"   ,"None"    ,314,44 ,48 ,65 ,50 ,64 ,43 ,1,false,0       ,.05   , [26,18,39,78]), new p(
		8      ,"Wartortle" ,"Water"   ,"None"    ,405,59 ,63 ,80 ,65 ,80 ,58 ,1,false,7       ,0     , [28,18,39,78,45]), new p(
		9      ,"Blastoise" ,"Water"   ,"None"    ,530,79 ,83 ,100,85 ,105,78 ,1,false,8       ,0     , [28,18,39,78,45,40]), new p(
		10     ,"Caterpie"  ,"Bug"     ,"None"    ,195,45 ,30 ,35 ,20 ,20 ,45 ,1,false,0       ,.9    , [1 ,11,34]), new p(
		11     ,"Metapod"   ,"Bug"     ,"None"    ,205,50 ,20 ,55 ,25 ,25 ,30 ,1,false,10      ,0     , [1 ,11,34]), new p(
		12     ,"Butterfree","Bug"     ,"Flying"  ,395,60 ,45 ,50 ,90 ,80 ,70 ,1,false,11      ,0     , [1 ,11,34,13]), new p(
		13     ,"Weedle"    ,"Bug"     ,"Poison"  ,195,40 ,35 ,30 ,20 ,20 ,50 ,1,false,0       ,.9    , [1 ,11]), new p(
		14     ,"Kakuna"    ,"Bug"     ,"Poison"  ,205,45 ,25 ,50 ,25 ,25 ,35 ,1,false,13      ,0     , [1 ,11,33]), new p(
		15     ,"Beedrill"  ,"Bug"     ,"Poison"  ,395,65 ,90 ,40 ,45 ,80 ,75 ,1,false,14      ,0     , [1 ,11,33,85]), new p(
		16     ,"Pidgey"    ,"Normal"  ,"Flying"  ,251,40 ,45 ,40 ,35 ,35 ,56 ,1,false,0       ,.7    , [8 ,16,48]), new p(
		17     ,"Pidgeotto" ,"Normal"  ,"Flying"  ,349,63 ,60 ,55 ,50 ,50 ,71 ,1,false,16      ,0     , [8 ,16,48]), new p(
		18     ,"Pidgeot"   ,"Normal"  ,"Flying"  ,479,83 ,80 ,75 ,70 ,70 ,101,1,false,17      ,0     , [8 ,16,48,49]), new p(
		19     ,"Rattata"   ,"Normal"  ,"None"    ,253,30 ,56 ,35 ,25 ,35 ,72 ,1,false,0       ,.9    , [8 ,11,25]), new p(
		20     ,"Raticate"  ,"Normal"  ,"None"    ,413,55 ,81 ,60 ,50 ,70 ,97 ,1,false,19      ,0     , [8 ,11,25,93]), new p(
		21     ,"Spearow"   ,"Normal"  ,"Flying"  ,262,40 ,60 ,30 ,31 ,31 ,70 ,1,false,0       ,.7    , [90,95,13]), new p(
		22     ,"Fearow"    ,"Normal"  ,"Flying"  ,442,65 ,90 ,65 ,61 ,61 ,100,1,false,21      ,0     , [90,95,13,14]), new p(
		23     ,"Ekans"     ,"Poison"  ,"None"    ,288,35 ,60 ,44 ,40 ,54 ,55 ,1,false,0       ,.5    , [80,28,36]), new p(
		24     ,"Arbok"     ,"Poison"  ,"None"    ,438,60 ,85 ,69 ,65 ,79 ,80 ,1,false,23      ,0     , [80,28,36,35]), new p(
		25     ,"Pikachu"   ,"Electric","None"    ,320,35 ,55 ,40 ,50 ,50 ,90 ,1,false,172     ,.1    , [26,77,58]), new p(
		26     ,"Raichu"    ,"Electric","None"    ,485,60 ,90 ,55 ,90 ,80 ,110,1,false,25      ,0     , [26,77,58,59]), new p(
		27     ,"Sandshrew" ,"Ground"  ,"None"    ,300,50 ,75 ,85 ,20 ,30 ,40 ,1,false,0       ,.5    , [11,95,51]), new p(
		28     ,"Sandslash" ,"Ground"  ,"None"    ,450,75 ,100,110,45 ,55 ,65 ,1,false,27      ,0     , [11,95,51,63]), new p(
		29     ,"Nidoran♀"  ,"Poison"  ,"None"    ,275,55 ,47 ,52 ,40 ,40 ,41 ,1,false,0       ,.45   , [11,95,32]), new p(
		30     ,"Nidorina"  ,"Poison"  ,"None"    ,365,70 ,62 ,67 ,55 ,55 ,56 ,1,false,29      ,0     , [11,95,32]), new p(
		31     ,"Nidoqueen" ,"Poison"  ,"Ground"  ,505,90 ,92 ,87 ,75 ,85 ,76 ,1,false,30      ,0     , [11,95,32,62]), new p(
		32     ,"Nidoran♂"  ,"Poison"  ,"None"    ,273,46 ,57 ,40 ,40 ,40 ,50 ,1,false,0       ,.45   , [11,95,32]), new p(
		33     ,"Nidorino"  ,"Poison"  ,"None"    ,365,61 ,72 ,57 ,55 ,55 ,65 ,1,false,32      ,0     , [11,95,32]), new p(
		34     ,"Nidoking"  ,"Poison"  ,"Ground"  ,505,81 ,102,77 ,85 ,75 ,85 ,1,false,33      ,0     , [11,95,32,62]), new p(
		35     ,"Clefairy"  ,"Fairy"   ,"None"    ,323,70 ,45 ,48 ,60 ,65 ,35 ,1,false,173     ,.1    , [1 ,16,15]), new p(
		36     ,"Clefable"  ,"Fairy"   ,"None"    ,483,95 ,70 ,73 ,95 ,90 ,60 ,1,false,35      ,0     , [1 ,16,15]), new p(
		37     ,"Vulpix"    ,"Fire"    ,"None"    ,299,38 ,41 ,40 ,50 ,65 ,65 ,1,false,0       ,.3    , [66,90,37]), new p(
		38     ,"Ninetales" ,"Fire"    ,"None"    ,505,73 ,76 ,75 ,81 ,100,100,1,false,37      ,0     , [66,90,37,57]), new p(
		39     ,"Jigglypuff","Normal"  ,"Fairy"   ,270,115,45 ,20 ,45 ,25 ,20 ,1,false,174     ,.1    , [1 ,16,15]), new p(
		40     ,"Wigglytuff","Normal"  ,"Fairy"   ,435,140,70 ,45 ,85 ,50 ,45 ,1,false,39      ,0     , [1 ,16,15]), new p(
		41     ,"Zubat"     ,"Poison"  ,"Flying"  ,245,40 ,45 ,35 ,30 ,40 ,55 ,1,false,0       ,.85   , [11,8,12]), new p(
		42     ,"Golbat"    ,"Poison"  ,"Flying"  ,455,75 ,80 ,70 ,65 ,75 ,90 ,1,false,41      ,0     , [11,8,12,36]), new p(
		43     ,"Oddish"    ,"Grass"   ,"Poison"  ,320,45 ,50 ,55 ,75 ,65 ,30 ,1,false,0       ,.7    , [1 ,16,52]), new p(
		44     ,"Gloom"     ,"Grass"   ,"Poison"  ,395,60 ,65 ,70 ,85 ,75 ,40 ,1,false,43      ,0     , [1 ,16,52,72]), new p(
		45     ,"Vileplume" ,"Grass"   ,"Poison"  ,490,75 ,80 ,85 ,110,90 ,50 ,1,false,44      ,0     , [1 ,16,52,72,55]), new p(
		46     ,"Paras"     ,"Bug"     ,"Grass"   ,285,35 ,70 ,55 ,45 ,55 ,25 ,1,false,0       ,.5    , [30,27,84]), new p(
		47     ,"Parasect"  ,"Bug"     ,"Grass"   ,405,60 ,95 ,80 ,60 ,80 ,30 ,1,false,46      ,0     , [30,27,84,53]), new p(
		48     ,"Venonat"   ,"Bug"     ,"Poison"  ,305,60 ,55 ,50 ,40 ,55 ,45 ,1,false,0       ,.6    , [16,27,32]), new p(
		49     ,"Venomoth"  ,"Bug"     ,"Poison"  ,450,70 ,65 ,60 ,90 ,75 ,90 ,1,false,48      ,0     , [16,27,32]), new p(
		50     ,"Diglett"   ,"Ground"  ,"None"    ,265,10 ,55 ,25 ,35 ,45 ,95 ,1,false,0       ,.65   , [23,30,63]), new p(
		51     ,"Dugtrio"   ,"Ground"  ,"None"    ,405,35 ,80 ,50 ,50 ,70 ,120,1,false,50      ,0     , [23,30,63,62]), new p(
		52     ,"Meowth"    ,"Normal"  ,"None"    ,290,40 ,45 ,35 ,40 ,40 ,90 ,1,false,0       ,.6    , [90,95,25]), new p(
		53     ,"Persian"   ,"Normal"  ,"None"    ,440,65 ,70 ,60 ,65 ,65 ,115,1,false,52      ,0     , [90,95,25]), new p(
		54     ,"Psyduck"   ,"Water"   ,"None"    ,320,50 ,52 ,48 ,65 ,50 ,55 ,1,false,0       ,.6    , [1,16,86]), new p(
		55     ,"Golduck"   ,"Water"   ,"None"    ,500,80 ,82 ,78 ,95 ,80 ,85 ,1,false,54      ,0     , [1,16,86,41]), new p(
		56     ,"Mankey"    ,"Fighting","None"    ,305,40 ,80 ,35 ,35 ,45 ,70 ,1,false,0       ,.5    , [67,29,19]), new p(
		57     ,"Primeape"  ,"Fighting","None"    ,455,65 ,105,60 ,60 ,70 ,95 ,1,false,56      ,0     , [67,29,19,50]), new p(
		58     ,"Growlithe" ,"Fire"    ,"None"    ,350,55 ,70 ,45 ,70 ,50 ,60 ,1,false,0       ,.3    , [27,16,37]), new p(
		59     ,"Arcanine"  ,"Fire"    ,"None"    ,555,90 ,110,80 ,100,80 ,95 ,1,false,58      ,0     , [27,16,37,74]), new p(
		60     ,"Poliwag"   ,"Water"   ,"None"    ,300,40 ,50 ,40 ,40 ,40 ,90 ,1,false,0       ,.65   , [18,16,45]), new p(
		61     ,"Poliwhirl" ,"Water"   ,"None"    ,385,65 ,65 ,65 ,50 ,50 ,90 ,1,false,60      ,0     , [18,16,45]), new p(
		62     ,"Poliwrath" ,"Water"   ,"Fighting",510,90 ,95 ,95 ,70 ,90 ,70 ,1,false,61      ,0     , [18,16,45,50]), new p(
		63     ,"Abra"      ,"Psychic" ,"None"    ,310,25 ,20 ,15 ,105,55 ,90 ,1,false,0       ,.4    , [15,64]), new p(
		64     ,"Kadabra"   ,"Psychic" ,"None"    ,400,40 ,35 ,30 ,120,70 ,105,1,false,63      ,0     , [15,64,44]), new p(
		65     ,"Alakazam"  ,"Psychic" ,"None"    ,500,55 ,50 ,45 ,135,95 ,120,1,false,64      ,0     , [15,64,44,65]), new p(
		66     ,"Machop"    ,"Fighting","None"    ,305,70 ,80 ,50 ,35 ,35 ,35 ,1,false,0       ,.6    , [29,2]), new p(
		67     ,"Machoke"   ,"Fighting","None"    ,405,80 ,100,70 ,50 ,60 ,45 ,1,false,66      ,0     , [29,2]), new p(
		68     ,"Machamp"   ,"Fighting","None"    ,505,90 ,130,80 ,65 ,85 ,55 ,1,false,67      ,0     , [29,2,4]), new p(
		69     ,"Bellsprout","Grass"   ,"Poison"  ,300,50 ,75 ,35 ,70 ,30 ,40 ,1,false,0       ,.7    , [28,8,53]), new p(
		70     ,"Weepinbell","Grass"   ,"Poison"  ,390,65 ,90 ,50 ,85 ,45 ,55 ,1,false,69      ,0     , [28,8,53,17]), new p(
		71     ,"Victreebel","Grass"   ,"Poison"  ,490,80 ,105,65 ,100,70 ,70 ,1,false,70      ,0     , [28,8,53,17,72]), new p(
		72     ,"Tentacool" ,"Water"   ,"Poison"  ,335,40 ,40 ,35 ,50 ,100,70 ,1,false,0       ,.9    , [28,16,32,76]), new p(
		73     ,"Tentacruel","Water"   ,"Poison"  ,515,80 ,70 ,65 ,80 ,120,100,1,false,72      ,0     , [28,16,32,76]), new p(
		74     ,"Geodude"   ,"Rock"    ,"Ground"  ,300,40 ,80 ,100,30 ,30 ,20 ,1,false,0       ,.7    , [16,83,61,87]), new p(
		75     ,"Graveler"  ,"Rock"    ,"Ground"  ,390,55 ,95 ,115,45 ,45 ,35 ,1,false,74      ,0     , [16,83,61,87]), new p(
		76     ,"Golem"     ,"Rock"    ,"Ground"  ,495,80 ,120,130,55 ,65 ,45 ,1,false,75      ,0     , [16,83,61,87,62]), new p(
		77     ,"Ponyta"    ,"Fire"    ,"None"    ,410,50 ,85 ,55 ,65 ,65 ,90 ,1,false,0       ,.6    , [66,77,37]), new p(
		78     ,"Rapidash"  ,"Fire"    ,"None"    ,500,65 ,100,70 ,80 ,80 ,105,1,false,77      ,0     , [66,77,37,38]), new p(
		79     ,"Slowpoke"  ,"Water"   ,"Psychic" ,315,90 ,65 ,65 ,40 ,40 ,15 ,1,false,0       ,.5    , [1 ,26,39,64]), new p(
		80     ,"Slowbro"   ,"Water"   ,"Psychic" ,490,95 ,75 ,110,100,80 ,30 ,1,false,79      ,0     , [1 ,26,39,64,65]), new p(
		81     ,"Magnemite" ,"Electric","Steel"   ,325,25 ,35 ,70 ,95 ,55 ,45 ,1,false,0       ,.3    , [16,83,58]), new p(
		82     ,"Magneton"  ,"Electric","Steel"   ,465,50 ,60 , 95,120,70 ,70 ,1,false,81      ,0     , [16,83,58,94]), new p(
		83     ,"Farfetch'd","Normal"  ,"Flying"  ,352,52 ,65 ,55 ,58 ,62 ,60 ,1,false,0       ,.6    , [8 ,95,13]), new p(
		84     ,"Doduo"     ,"Normal"  ,"Flying"  ,310,35 ,85 ,45 ,35 ,35 ,75 ,1,false,0       ,.6    , [23,66,40]), new p(
		85     ,"Dodrio"    ,"Normal"  ,"Flying"  ,460,60 ,110,70 ,60 ,60 ,100,1,false,84      ,0     , [23,66,40,49]), new p(
		86     ,"Seel"      ,"Water"   ,"None"    ,325,65 ,45 ,55 ,45 ,70 ,45 ,1,false,0       ,.5    , [26,16,41]), new p(
		87     ,"Dewgong"   ,"Water"   ,"Ice"     ,475,90 ,70 ,80 ,70 ,95 ,70 ,1,false,86      ,0     , [26,16,41,46]), new p(
		88     ,"Grimer"    ,"Poison"  ,"None"    ,325,80 ,80 ,50 ,40 ,50 ,25 ,1,false,0       ,.8    , [15,72]), new p(
		89     ,"Muk"       ,"Poison"  ,"None"    ,500,105,105,75 ,65 ,100,50 ,1,false,88      ,0     , [15,72,71]), new p(
		90     ,"Shellder"  ,"Water"   ,"None"    ,305,30 ,65 ,100,45 ,25 ,40 ,1,false,0       ,.4    , [1 ,15,39]), new p(
		91     ,"Cloyster"  ,"Water"   ,"Ice"     ,525,50 ,95 ,180,85 ,45 ,70 ,1,false,90      ,0     , [1 ,15,39,40,42]), new p(
		92     ,"Gastly"    ,"Ghost"   ,"Poison"  ,310,30 ,35 ,30 ,100,35 ,80 ,1,false,0       ,.25   , [18,23,70]), new p(
		93     ,"Haunter"   ,"Ghost"   ,"Poison"  ,405,45 ,50 ,45 ,115,55 ,95 ,1,false,92      ,0     , [18,23,70,82]), new p(
		94     ,"Gengar"    ,"Ghost"   ,"Poison"  ,500,60 ,65 ,60 ,130,75 ,110,1,false,93      ,0     , [18,23,70,82,47]), new p(
		95     ,"Onix"      ,"Rock"    ,"Ground"  ,385,35 ,45 ,160,30 ,45 ,70 ,1,false,0       ,.5    , [16,23,61,92]), new p(
		96     ,"Drowzee"   ,"Psychic" ,"None"    ,328,60 ,48 ,45 ,43 ,90 ,42 ,1,false,0       ,.4    , [26,64]), new p(
		97     ,"Hypno"     ,"Psychic" ,"None"    ,483,85 ,73 ,70 ,73 ,115,67 ,1,false,96      ,0     , [26,64,82]), new p(
		98     ,"Krabby"    ,"Water"   ,"None"    ,325,30 ,105,90 ,25 ,25 ,50 ,1,false,0       ,.65   , [8 ,15,9]), new p(
		99     ,"Kingler"   ,"Water"   ,"None"    ,475,55 ,130,115,50 ,50 ,75 ,1,false,98      ,0     , [8 ,15,9,88]), new p(
		100    ,"Voltorb"   ,"Electric","None"    ,330,40 ,30 ,50 ,55 ,55 ,100,1,false,0       ,.5    , [1 ,68]), new p(
		101    ,"Electrode" ,"Electric","None"    ,480,60 ,50 ,70 ,80 ,80 ,140,1,false,100     ,0     , [1 ,68,89]), new p(
		102    ,"Exeggcute" ,"Grass"   ,"Psychic" ,325,60 ,40 ,80 ,60 ,45 ,40 ,1,false,0       ,.4    , [23,52,44]), new p(
		103    ,"Exeggutor" ,"Grass"   ,"Psychic" ,520,95 ,95 ,85 ,125,65 ,55 ,1,false,102     ,0     , [23,52,44,69]), new p(
		104    ,"Cubone"    ,"Ground"  ,"None"    ,320,50 ,50 ,95 ,40 ,50 ,35 ,1,false,0       ,.3    , [26,95,91]), new p(
		105    ,"Marowak"   ,"Ground"  ,"None"    ,425,60 ,80 ,110,50 ,80 ,45 ,1,false,104     ,0     , [26,95,91,73]), new p(
		106    ,"Hitmonlee" ,"Fighting","None"    ,455,50 ,120,53 ,35 ,110,87 ,1,false,236     ,.1    , [23,16,19,21,81]), new p(
		107    ,"Hitmonchan","Fighting","None"    ,455,50 ,105,79 ,35 ,110,76 ,1,false,236     ,.1    , [23,16,50,4 ,87]), new p(
		108    ,"Lickitung" ,"Normal"  ,"None"    ,385,90 ,55 ,75 ,60 ,75 ,30 ,1,false,0       ,.4    , [1 ,27,70,51]), new p(
		109    ,"Koffing"   ,"Poison"  ,"None"    ,340,40 ,65 ,95 ,60 ,45 ,35 ,1,false,0       ,.5    , [16,15,71]), new p(
		110    ,"Weezing"   ,"Poison"  ,"None"    ,490,65 ,90 ,120,85 ,70 ,60 ,1,false,109     ,0     , [16,15,71,89]), new p(
		111    ,"Rhyhorn"   ,"Ground"  ,"Rock"    ,345,80 ,85 ,95 ,30 ,30 ,25 ,1,false,0       ,.4    , [26,29,61,24]), new p(
		112    ,"Rhydon"    ,"Ground"  ,"Rock"    ,485,105,130,120,45 ,45 ,40 ,1,false,112     ,0     , [26,29,61,24,78]), new p(
		113    ,"Chansey"   ,"Normal"  ,"None"    ,450,250,5  ,5  ,35 ,105,50 ,1,false,/*440*/0,.1    , [1 ,26,69,51]), new p(
		114    ,"Tangela"   ,"Grass"   ,"None"    ,435,65 ,55 ,115,100,40 ,60 ,1,false,0       ,.6    , [28,15,80,17,53]), new p(
		115    ,"Kangaskhan","Normal"  ,"None"    ,490,105,95 ,80 ,40 ,80 ,90 ,1,false,0       ,.4    , [23,27,20,31]), new p(
		116    ,"Horsea"    ,"Water"   ,"None"    ,295,30 ,40 ,70 ,70 ,25 ,60 ,1,false,0       ,.4    , [26,30,39]), new p(
		117    ,"Seadra"    ,"Water"   ,"None"    ,440,55 ,65 ,95 ,95 ,45 ,85 ,1,false,116     ,0     , [26,30,39,40]), new p(
		118    ,"Goldeen"   ,"Water"   ,"None"    ,320,45 ,67 ,60 ,35 ,50 ,63 ,1,false,0       ,.8    , [1 ,96,97]), new p(
		119    ,"Seaking"   ,"Water"   ,"None"    ,450,80 ,92 ,65 ,65 ,80 ,68 ,1,false,118     ,0     , [1 ,96,97,24]), new p(
		120    ,"Staryu"    ,"Water"   ,"None"    ,340,30 ,45 ,55 ,70 ,55 ,85 ,1,false,0       ,.5    , [1 ,26,86,64]), new p(
		121    ,"Starmie"   ,"Water"   ,"Psychic" ,520,60 ,75 ,85 ,100,85 ,115,1,false,120     ,0     , [1 ,26,86,40,64,65]), new p(
		122    ,"Mr. Mime"  ,"Psychic" ,"Fairy"   ,460,40 ,45 ,65 ,100,120,90 ,1,false,/*439*/0,.1    , [15,1 ,44,3 ]), new p(
		123    ,"Scyther"   ,"Bug"     ,"Flying"  ,500,70 ,110,80 ,55 ,80 ,105,1,false,0       ,.5    , [66,95,85,33]), new p(
		124    ,"Jynx"      ,"Ice"     ,"Psychic" ,455,65 ,50 ,35 ,115,95 ,95 ,1,false,238     ,.1    , [1 ,26,43,44]), new p(
		125    ,"Electabuzz","Electric","None"    ,490,65 ,83 ,57 ,95 ,85 ,105,1,false,239     ,.1    , [1 ,26,7 ,59]), new p(
		126    ,"Magmar"    ,"Fire"    ,"None"    ,495,65 ,95 ,57 ,100,85 ,93 ,1,false,240     ,.1    , [1 ,26,5 ,38]), new p(
		127    ,"Pinsir"    ,"Bug"     ,"None"    ,500,65 ,125,100,55 ,70 ,85 ,1,false,0       ,.3    , [15,29,34,81]), new p(
		128    ,"Tauros"    ,"Normal"  ,"None"    ,490,75 ,100,95 ,40 ,70 ,110,1,false,0       ,.4    , [27,26,20,51]), new p(
		129    ,"Magikarp"  ,"Water"   ,"None"    ,200,20 ,10 ,55 ,15 ,20 ,80 ,1,false,0       ,.9    , [96,97]), new p(
		130    ,"Gyarados"  ,"Water"   ,"Flying"  ,540,95 ,125,79 ,60 ,100,81 ,1,false,129     ,0     , [30,23,35,40,14]), new p(
		131    ,"Lapras"    ,"Water"   ,"Ice"     ,535,130,85 ,80 ,85 ,95 ,60 ,1,false,0       ,.1    , [27,23,75,41,46]), new p(
		132    ,"Ditto"     ,"Normal"  ,"None"    ,288,48 ,48 ,48 ,48 ,48 ,48 ,1,false,0       ,.05   , [96,94]), new p(
		133    ,"Eevee"     ,"Normal"  ,"None"    ,325,55 ,55 ,50 ,45 ,65 ,55 ,1,false,0       ,.3    , [26,66,25]), new p(
		134    ,"Vaporeon"  ,"Water"   ,"None"    ,525,130,65 ,60 ,110,95 ,65 ,1,false,134     ,0     , [16,40,75]), new p(
		135    ,"Jolteon"   ,"Electric","None"    ,525,65 ,65 ,60 ,110,95 ,130,1,false,134     ,0     , [16,60,47]), new p(
		136    ,"Flareon"   ,"Fire"    ,"None"    ,525,65 ,130,60 ,95 ,110,65 ,1,false,134     ,0     , [16,74,57]), new p(
		137    ,"Porygon"   ,"Normal"  ,"None"    ,395,65 ,60 ,70 ,85 ,75 ,40 ,1,false,0       ,.05   , [83,77,68,47,94]), new p(
		138    ,"Omanyte"   ,"Rock"    ,"Water"   ,355,35 ,40 ,100,90 ,55 ,35 ,1,false,-1      ,0     , [1 ,10]), new p(
		139    ,"Omastar"   ,"Rock"    ,"Water"   ,495,70 ,60 ,125,115,70 ,55 ,1,false,138     ,0     , [1 ,10]), new p(
		140    ,"Kabuto"    ,"Rock"    ,"Water"   ,355,30 ,80 ,90 ,55 ,45 ,55 ,1,false,-1      ,0     , [1 ,10]), new p(
		141    ,"Kabutops"  ,"Rock"    ,"Water"   ,495,60 ,115,105,65 ,70 ,80 ,1,false,140     ,0     , [1 ,10]), new p(
		142    ,"Aerodactyl","Rock"    ,"Flying"  ,515,80 ,105,65 ,60 ,75 ,130,1,false,-1      ,0     , [1 ,10]), new p(
		143    ,"Snorlax"   ,"Normal"  ,"None"    ,540,160,110,65 ,65 ,110,30 ,1,false,/*446*/0,.1    , [27,29,87,51]), new p(
		144    ,"Articuno"  ,"Ice"     ,"Flying"  ,580,90 ,85 ,100,95 ,125,85 ,1,true ,0       ,.05   , [95,67,43,42,85]), new p(
		145    ,"Zapdos"    ,"Electric","Flying"  ,580,90 ,90 ,85 ,125,90 ,100,1,true ,0       ,.05   , [95,67,59,60,85]), new p(
		146    ,"Moltres"   ,"Fire"    ,"Flying"  ,580,90 ,100,90 ,125,85 ,90 ,1,true ,0       ,.05   , [95,67,74,38,85]), new p(
		147    ,"Dratini"   ,"Dragon"  ,"None"    ,300,41 ,64 ,45 ,50 ,50 ,50 ,1,false,0       ,.1    , [1 ,86,97]), new p(
		148    ,"Dragonair" ,"Dragon"  ,"None"    ,420,61 ,84 ,65 ,70 ,70 ,70 ,1,false,147     ,0     , [1 ,93,47]), new p(
		149    ,"Dragonite" ,"Dragon"  ,"Flying"  ,600,91 ,134,95 ,100,100,80 ,1,false,148     ,0     , [67,30,85,93,98]), new p(
		150    ,"Mewtwo"    ,"Psychic" ,"None"    ,680,106,110,90 ,154,90 ,130,1,true ,0       ,.05   , [77,29,82,65,21]), new p(
		151    ,"Mew"       ,"Psychic" ,"None"    ,600,100,100,100,100,100,100,1,true ,0       ,.05   , z)/*, new p(
		152    ,"Chikorita" ,"Grass"   ,"None"    ,318,45 ,49 ,65 ,49 ,65 ,45 ,2,false,0       ,0     , [1,10]), new p(
		153    ,"Bayleef"   ,"Grass"   ,"None"    ,405,60 ,62 ,80 ,63 ,80 ,60 ,2,false,152     ,0     , [1,10]), new p(
		154    ,"Meganium"  ,"Grass"   ,"None"    ,525,80 ,82 ,100,83 ,100,80 ,2,false,153     ,0     , [1,10]), new p(
		155    ,"Cyndaquil" ,"Fire"    ,"None"    ,309,39 ,52 ,43 ,60 ,50 ,65 ,2,false,0       ,0     , [1,10]), new p(
		156    ,"Quilava"   ,"Fire"    ,"None"    ,405,58 ,64 ,58 ,80 ,65 ,80 ,2,false,155     ,0     , [1,10]), new p(
		157    ,"Typhlosion","Fire"    ,"None"    ,534,78 ,84 ,78 ,109,85 ,100,2,false,156     ,0     , [1,10]), new p(
		158    ,"Totodile"  ,"Water"   ,"None"    ,314,50 ,65 ,64 ,44 ,48 ,43 ,2,false,0       ,0     , [1,10]), new p(
		159    ,"Croconaw"  ,"Water"   ,"None"    ,405,65 ,80 ,80 ,59 ,63 ,58 ,2,false,158     ,0     , [1,10]), new p(
		160    ,"Feraligatr","Water"   ,"None"    ,530,85 ,105,100,79 ,83 ,78 ,2,false,159     ,0     , [1,10]), new p(
		161    ,"Sentret"   ,"Normal"  ,"None"    ,215,35 ,46 ,34 ,35 ,45 ,20 ,2,false,0       ,0     , [1,10]), new p(
		162    ,"Furret"    ,"Normal"  ,"None"    ,415,85 ,76 ,64 ,45 ,55 ,90 ,2,false,161     ,0     , [1,10]), new p(
		163    ,"Hoothoot"  ,"Normal"  ,"Flying"  ,262,60 ,30 ,30 ,36 ,56 ,50 ,2,false,0       ,0     , [1,10]), new p(
		164    ,"Noctowl"   ,"Normal"  ,"Flying"  ,442,100,50 ,50 ,76 ,96 ,70 ,2,false,163     ,0     , [1,10]), new p(
		165    ,"Ledyba"    ,"Bug"     ,"Flying"  ,265,40 ,20 ,30 ,40 ,80 ,55 ,2,false,0       ,0     , [1,10]), new p(
		166    ,"Ledian"    ,"Bug"     ,"Flying"  ,390,55 ,35 ,50 ,55 ,110,85 ,2,false,165     ,0     , [1,10]), new p(
		167    ,"Spinarak"  ,"Bug"     ,"Poison"  ,250,40 ,60 ,40 ,40 ,40 ,30 ,2,false,0       ,0     , [1,10]), new p(
		168    ,"Ariados"   ,"Bug"     ,"Poison"  ,390,70 ,90 ,70 ,60 ,60 ,40 ,2,false,167     ,0     , [1,10]), new p(
		169    ,"Crobat"    ,"Poison"  ,"Flying"  ,535,85 ,90 ,80 ,70 ,80 ,130,2,false,42      ,0     , [1,10]), new p(
		170    ,"Chinchou"  ,"Water"   ,"Electric",330,75 ,38 ,38 ,56 ,56 ,67 ,2,false,0       ,0     , [1,10]), new p(
		171    ,"Lanturn"   ,"Water"   ,"Electric",460,125,58 ,58 ,76 ,76 ,67 ,2,false,170     ,0     , [1,10]), new p(
		172    ,"Pichu"     ,"Electric","None"    ,205,20 ,40 ,15 ,35 ,35 ,60 ,2,false,0       ,0     , [1,10]), new p(
		173    ,"Cleffa"    ,"Fairy"   ,"None"    ,218,50 ,25 ,28 ,45 ,55 ,15 ,2,false,0       ,0     , [1,10]), new p(
		174    ,"Igglybuff" ,"Normal"  ,"Fairy"   ,210,90 ,30 ,15 ,40 ,20 ,15 ,2,false,0       ,0     , [1,10]), new p(
		175    ,"Togepi"    ,"Fairy"   ,"None"    ,245,35 ,20 ,65 ,40 ,65 ,20 ,2,false,0       ,0     , [1,10]), new p(
		176    ,"Togetic"   ,"Fairy"   ,"Flying"  ,405,55 ,40 ,85 ,80 ,105,40 ,2,false,175     ,0     , [1,10]), new p(
		177    ,"Natu"      ,"Psychic" ,"Flying"  ,320,40 ,50 ,45 ,70 ,45 ,70 ,2,false,0       ,0     , [1,10]), new p(
		178    ,"Xatu"      ,"Psychic" ,"Flying"  ,470,65 ,75 ,70 ,95 ,70 ,95 ,2,false,177     ,0     , [1,10]), new p(
		179    ,"Mareep"    ,"Electric","None"    ,280,55 ,40 ,40 ,65 ,45 ,35 ,2,false,0       ,0     , [1,10]), new p(
		180    ,"Flaaffy"   ,"Electric","None"    ,365,70 ,55 ,55 ,80 ,60 ,45 ,2,false,179     ,0     , [1,10]), new p(
		181    ,"Ampharos"  ,"Electric","None"    ,510,90 ,75 ,85 ,115,90 ,55 ,2,false,180     ,0     , [1,10]), new p(
		182    ,"Bellossom" ,"Grass"   ,"None"    ,490,75 ,80 ,95 ,90 ,100,50 ,2,false,44      ,0     , [1,10]), new p(
		183    ,"Marill"    ,"Water"   ,"Fairy"   ,250,70 ,20 ,50 ,20 ,50 ,40 ,2,false,298     ,0     , [1,10]), new p(
		184    ,"Azumarill" ,"Water"   ,"Fairy"   ,420,100,50 ,80 ,60 ,80 ,50 ,2,false,183     ,0     , [1,10]), new p(
		185    ,"Sudowoodo" ,"Rock"    ,"None"    ,410,70 ,100,115,30 ,65 ,30 ,2,false,438     ,0     , [1,10]), new p(
		186    ,"Politoed"  ,"Water"   ,"None"    ,500,90 ,75 ,75 ,90 ,100,70 ,2,false,61      ,0     , [1,10]), new p(
		187    ,"Hoppip"    ,"Grass"   ,"Flying"  ,250,35 ,35 ,40 ,35 ,55 ,50 ,2,false,0       ,0     , [1,10]), new p(
		188    ,"Skiploom"  ,"Grass"   ,"Flying"  ,340,55 ,45 ,50 ,45 ,65 ,80 ,2,false,187     ,0     , [1,10]), new p(
		189    ,"Jumpluff"  ,"Grass"   ,"Flying"  ,460,75 ,55 ,70 ,55 ,95 ,110,2,false,188     ,0     , [1,10]), new p(
		190    ,"Aipom"     ,"Normal"  ,"None"    ,360,55 ,70 ,55 ,40 ,55 ,85 ,2,false,0       ,0     , [1,10]), new p(
		191    ,"Sunkern"   ,"Grass"   ,"None"    ,180,30 ,30 ,30 ,30 ,30 ,30 ,2,false,0       ,0     , [1,10]), new p(
		192    ,"Sunflora"  ,"Grass"   ,"None"    ,425,75 ,75 ,55 ,105,85 ,30 ,2,false,191     ,0     , [1,10]), new p(
		193    ,"Yanma"     ,"Bug"     ,"Flying"  ,390,65 ,65 ,45 ,75 ,45 ,95 ,2,false,0       ,0     , [1,10]), new p(
		194    ,"Wooper"    ,"Water"   ,"Ground"  ,210,55 ,45 ,45 ,25 ,25 ,15 ,2,false,0       ,0     , [1,10]), new p(
		195    ,"Quagsire"  ,"Water"   ,"Ground"  ,430,95 ,85 ,85 ,65 ,65 ,35 ,2,false,194     ,0     , [1,10]), new p(
		196    ,"Espeon"    ,"Psychic" ,"None"    ,525,65 ,65 ,60 ,130,95 ,110,2,false,133     ,0     , [1,10]), new p(
		197    ,"Umbreon"   ,"Dark"    ,"None"    ,525,95 ,65 ,110,60 ,130,65 ,2,false,133     ,0     , [1,10]), new p(
		198    ,"Murkrow"   ,"Dark"    ,"Flying"  ,405,60 ,85 ,42 ,85 ,42 ,91 ,2,false,0       ,0     , [1,10]), new p(
		199    ,"Slowking"  ,"Water"   ,"Psychic" ,490,95 ,75 ,80 ,100,110,30 ,2,false,79      ,0     , [1,10]), new p(
		200    ,"Misdreavus","Ghost"   ,"None"    ,435,60 ,60 ,60 ,85 ,85 ,85 ,2,false,0       ,0     , [1,10]), new p(
		201    ,"Unown"     ,"Psychic" ,"None"    ,336,48 ,72 ,48 ,72 ,48 ,48 ,2,false,0       ,0     , [1,10]), new p(
		202    ,"Wobbuffet" ,"Psychic" ,"None"    ,405,190,33 ,58 ,33 ,58 ,33 ,2,false,360     ,0     , [1,10]), new p(
		203    ,"Girafarig" ,"Normal"  ,"Psychic" ,455,70 ,80 ,65 ,90 ,65 ,85 ,2,false,0       ,0     , [1,10]), new p(
		204    ,"Pineco"    ,"Bug"     ,"None"    ,290,50 ,65 ,90 ,35 ,35 ,15 ,2,false,0       ,0     , [1,10]), new p(
		205    ,"Forretress","Bug"     ,"Steel"   ,465,75 ,90 ,140,60 ,60 ,40 ,2,false,204     ,0     , [1,10]), new p(
		206    ,"Dunsparce" ,"Normal"  ,"None"    ,415,100,70 ,70 ,65 ,65 ,45 ,2,false,0       ,0     , [1,10]), new p(
		207    ,"Gligar"    ,"Ground"  ,"Flying"  ,430,65 ,75 ,105,35 ,65 ,85 ,2,false,0       ,0     , [1,10]), new p(
		208    ,"Steelix"   ,"Steel"   ,"Ground"  ,510,75 ,85 ,200,55 ,65 ,30 ,2,false,95      ,0     , [1,10]), new p(
		209    ,"Snubbull"  ,"Fairy"   ,"None"    ,300,60 ,80 ,50 ,40 ,40 ,30 ,2,false,0       ,0     , [1,10]), new p(
		210    ,"Granbull"  ,"Fairy"   ,"None"    ,450,90 ,120,75 ,60 ,60 ,45 ,2,false,209     ,0     , [1,10]), new p(
		211    ,"Qwilfish"  ,"Water"   ,"Poison"  ,430,65 ,95 ,75 ,55 ,55 ,85 ,2,false,0       ,0     , [1,10]), new p(
		212    ,"Scizor"    ,"Bug"     ,"Steel"   ,500,70 ,130,100,55 ,80 ,65 ,2,false,123     ,0     , [1,10]), new p(
		213    ,"Shuckle"   ,"Bug"     ,"Rock"    ,505,20 ,10 ,230,10 ,230,5  ,2,false,0       ,0     , [1,10]), new p(
		214    ,"Heracross" ,"Bug"     ,"Fighting",500,80 ,125,75 ,40 ,95 ,85 ,2,false,0       ,0     , [1,10]), new p(
		215    ,"Sneasel"   ,"Dark"    ,"Ice"     ,430,55 ,95 ,55 ,35 ,75 ,115,2,false,0       ,0     , [1,10]), new p(
		216    ,"Teddiursa" ,"Normal"  ,"None"    ,330,60 ,80 ,50 ,50 ,50 ,40 ,2,false,0       ,0     , [1,10]), new p(
		217    ,"Ursaring"  ,"Normal"  ,"None"    ,500,90 ,130,75 ,75 ,75 ,55 ,2,false,216     ,0     , [1,10]), new p(
		218    ,"Slugma"    ,"Fire"    ,"None"    ,250,40 ,40 ,40 ,70 ,40 ,20 ,2,false,0       ,0     , [1,10]), new p(
		219    ,"Magcargo"  ,"Fire"    ,"Rock"    ,410,50 ,50 ,120,80 ,80 ,30 ,2,false,218     ,0     , [1,10]), new p(
		220    ,"Swinub"    ,"Ice"     ,"Ground"  ,250,50 ,50 ,40 ,30 ,30 ,50 ,2,false,0       ,0     , [1,10]), new p(
		221    ,"Piloswine" ,"Ice"     ,"Ground"  ,450,100,100,80 ,60 ,60 ,50 ,2,false,220     ,0     , [1,10]), new p(
		222    ,"Corsola"   ,"Water"   ,"Rock"    ,380,55 ,55 ,85 ,65 ,85 ,35 ,2,false,0       ,0     , [1,10]), new p(
		223    ,"Remoraid"  ,"Water"   ,"None"    ,300,35 ,65 ,35 ,65 ,35 ,65 ,2,false,0       ,0     , [1,10]), new p(
		224    ,"Octillery" ,"Water"   ,"None"    ,480,75 ,105,75 ,105,75 ,45 ,2,false,223     ,0     , [1,10]), new p(
		225    ,"Delibird"  ,"Ice"     ,"Flying"  ,330,45 ,55 ,45 ,65 ,45 ,75 ,2,false,0       ,0     , [1,10]), new p(
		226    ,"Mantine"   ,"Water"   ,"Flying"  ,465,65 ,40 ,70 ,80 ,140,70 ,2,false,0       ,0     , [1,10]), new p(
		227    ,"Skarmory"  ,"Steel"   ,"Flying"  ,465,65 ,80 ,140,40 ,70 ,70 ,2,false,0       ,0     , [1,10]), new p(
		228    ,"Houndour"  ,"Dark"    ,"Fire"    ,330,45 ,60 ,30 ,80 ,50 ,65 ,2,false,0       ,0     , [1,10]), new p(
		229    ,"Houndoom"  ,"Dark"    ,"Fire"    ,500,75 ,90 ,50 ,110,80 ,95 ,2,false,228     ,0     , [1,10]), new p(
		230    ,"Kingdra"   ,"Water"   ,"Dragon"  ,540,75 ,95 ,95 ,95 ,95 ,85 ,2,false,117     ,0     , [1,10]), new p(
		231    ,"Phanpy"    ,"Ground"  ,"None"    ,330,90 ,60 ,60 ,40 ,40 ,40 ,2,false,0       ,0     , [1,10]), new p(
		232    ,"Donphan"   ,"Ground"  ,"None"    ,500,90 ,120,120,60 ,60 ,50 ,2,false,231     ,0     , [1,10]), new p(
		233    ,"Porygon2"  ,"Normal"  ,"None"    ,515,85 ,80 ,90 ,105,95 ,60 ,2,false,137     ,0     , [1,10]), new p(
		234    ,"Stantler"  ,"Normal"  ,"None"    ,465,73 ,95 ,62 ,85 ,65 ,85 ,2,false,0       ,0     , [1,10]), new p(
		235    ,"Smeargle"  ,"Normal"  ,"None"    ,250,55 ,20 ,35 ,20 ,45 ,75 ,2,false,0       ,0     , [1,10]), new p(
		236    ,"Tyrogue"   ,"Fighting","None"    ,210,35 ,35 ,35 ,35 ,35 ,35 ,2,false,0       ,0     , [1,10]), new p(
		237    ,"Hitmontop" ,"Fighting","None"    ,455,50 ,95 ,95 ,35 ,110,70 ,2,false,236     ,0     , [1,10]), new p(
		238    ,"Smoochum"  ,"Ice"     ,"Psychic" ,305,45 ,30 ,15 ,85 ,65 ,65 ,2,false,0       ,0     , [1,10]), new p(
		239    ,"Elekid"    ,"Electric","None"    ,360,45 ,63 ,37 ,65 ,55 ,95 ,2,false,0       ,0     , [1,10]), new p(
		240    ,"Magby"     ,"Fire"    ,"None"    ,365,45 ,75 ,37 ,70 ,55 ,83 ,2,false,0       ,0     , [1,10]), new p(
		241    ,"Miltank"   ,"Normal"  ,"None"    ,490,95 ,80 ,105,40 ,70 ,100,2,false,0       ,0     , [1,10]), new p(
		242    ,"Blissey"   ,"Normal"  ,"None"    ,540,255,10 ,10 ,75 ,135,55 ,2,false,113     ,0     , [1,10]), new p(
		243    ,"Raikou"    ,"Electric","None"    ,580,90 ,85 ,75 ,115,100,115,2,true ,0       ,0     , [1,10]), new p(
		244    ,"Entei"     ,"Fire"    ,"None"    ,580,115,115,85 ,90 ,75 ,100,2,true ,0       ,0     , [1,10]), new p(
		245    ,"Suicune"   ,"Water"   ,"None"    ,580,100,75 ,115,90 ,115,85 ,2,true ,0       ,0     , [1,10]), new p(
		246    ,"Larvitar"  ,"Rock"    ,"Ground"  ,300,50 ,64 ,50 ,45 ,50 ,41 ,2,false,0       ,0     , [1,10]), new p(
		247    ,"Pupitar"   ,"Rock"    ,"Ground"  ,410,70 ,84 ,70 ,65 ,70 ,51 ,2,false,246     ,0     , [1,10]), new p(
		248    ,"Tyranitar" ,"Rock"    ,"Dark"    ,600,100,134,110,95 ,100,61 ,2,false,247     ,0     , [1,10]), new p(
		249    ,"Lugia"     ,"Psychic" ,"Flying"  ,680,106,90 ,130,90 ,154,110,2,true ,0       ,0     , [1,10]), new p(
		250    ,"Ho-oh"     ,"Fire"    ,"Flying"  ,680,106,130,90 ,110,154,90 ,2,true ,0       ,0     , [1,10]), new p(
		251    ,"Celebi"    ,"Psychic" ,"Grass"   ,600,100,100,100,100,100,100,2,false,0       ,0     , [1,10]), new p(
		252    ,"Treecko"   ,"Grass"   ,"None"    ,310,40 ,45 ,35 ,65 ,55 ,70 ,3,false,0       ,.1    , [1,10]), new p(
		253    ,"Grovyle"   ,"Grass"   ,"None"    ,405,50 ,65 ,45 ,85 ,65 ,95 ,3,false,252     ,0     , [1,10]), new p(
		254    ,"Sceptile"  ,"Grass"   ,"None"    ,530,70 ,85 ,65 ,105,85 ,120,3,false,253     ,0     , [1,10]), new p(
		255    ,"Torchic"   ,"Fire"    ,"None"    ,310,45 ,60 ,40 ,70 ,50 ,45 ,3,false,0       ,.1    , [1,10]), new p(
		256    ,"Combusken" ,"Fire"    ,"Fighting",405,60 ,85 ,60 ,85 ,60 ,55 ,3,false,255     ,0     , [1,10]), new p(
		257    ,"Blaziken"  ,"Fire"    ,"Fighting",530,80 ,120,70 ,110,70 ,80 ,3,false,256     ,0     , [1,10]), new p(
		258    ,"Mudkip"    ,"Water"   ,"None"    ,310,50 ,70 ,50 ,50 ,50 ,40 ,3,false,0       ,.1    , [1,10]), new p(
		259    ,"Marshtomp" ,"Water"   ,"Ground"  ,405,70 ,85 ,70 ,60 ,70 ,50 ,3,false,258     ,0     , [1,10]), new p(
		260    ,"Swampert"  ,"Water"   ,"Ground"  ,535,100,110,90 ,85 ,90 ,60 ,3,false,259     ,0     , [1,10]), new p(
		261    ,"Poochyena" ,"Dark"    ,"None"    ,220,35 ,55 ,35 ,30 ,30 ,35 ,3,false,0       ,.8    , [1,10]), new p(
		262    ,"Mightyena" ,"Dark"    ,"None"    ,420,70 ,90 ,70 ,60 ,60 ,70 ,3,false,261     ,0     , [1,10]), new p(
		263    ,"Zigzagoon" ,"Normal"  ,"None"    ,240,38 ,30 ,41 ,30 ,41 ,60 ,3,false,0       ,.8    , [1,10]), new p(
		264    ,"Linoone"   ,"Normal"  ,"None"    ,420,78 ,70 ,61 ,50 ,61 ,100,3,false,263     ,0     , [1,10]), new p(
		265    ,"Wurmple"   ,"Bug"     ,"None"    ,195,45 ,45 ,35 ,20 ,30 ,20 ,3,false,0       ,.8    , [1,10]), new p(
		266    ,"Silcoon"   ,"Bug"     ,"None"    ,205,50 ,35 ,55 ,25 ,25 ,15 ,3,false,265     ,0     , [1,10]), new p(
		267    ,"Beautifly" ,"Bug"     ,"Flying"  ,395,60 ,70 ,50 ,100,50 ,65 ,3,false,266     ,0     , [1,10]), new p(
		268    ,"Cascoon"   ,"Bug"     ,"None"    ,205,50 ,35 ,55 ,25 ,25 ,15 ,3,false,265     ,0     , [1,10]), new p(
		269    ,"Dustox"    ,"Bug"     ,"Poison"  ,385,60 ,50 ,70 ,50 ,90 ,65 ,3,false,268     ,0     , [1,10]), new p(
		270    ,"Lotad"     ,"Water"   ,"Grass"   ,220,40 ,30 ,30 ,40 ,50 ,30 ,3,false,0       ,.6    , [1,10]), new p(
		271    ,"Lombre"    ,"Water"   ,"Grass"   ,340,60 ,50 ,50 ,60 ,70 ,50 ,3,false,270     ,0     , [1,10]), new p(
		272    ,"Ludicolo"  ,"Water"   ,"Grass"   ,480,80 ,70 ,70 ,90 ,100,70 ,3,false,271     ,0     , [1,10]), new p(
		273    ,"Seedot"    ,"Grass"   ,"None"    ,220,40 ,40 ,50 ,30 ,30 ,30 ,3,false,0       ,.6    , [1,10]), new p(
		274    ,"Nuzleaf"   ,"Grass"   ,"Dark"    ,340,70 ,70 ,40 ,60 ,40 ,60 ,3,false,273     ,0     , [1,10]), new p(
		275    ,"Shiftry"   ,"Grass"   ,"Dark"    ,480,90 ,100,60 ,90 ,60 ,80 ,3,false,274     ,0     , [1,10]), new p(
		276    ,"Taillow"   ,"Normal"  ,"Flying"  ,270,40 ,55 ,30 ,30 ,30 ,85 ,3,false,0       ,.7    , [1,10]), new p(
		277    ,"Swellow"   ,"Normal"  ,"Flying"  ,430,60 ,85 ,60 ,50 ,50 ,125,3,false,276     ,0     , [1,10]), new p(
		278    ,"Wingull"   ,"Water"   ,"Flying"  ,270,40 ,30 ,30 ,55 ,30 ,85 ,3,false,0       ,.8    , [1,10]), new p(
		279    ,"Pelipper"  ,"Water"   ,"Flying"  ,430,60 ,50 ,100,85 ,70 ,65 ,3,false,278     ,0     , [1,10]), new p(
		280    ,"Ralts"     ,"Psychic" ,"Fairy"   ,198,28 ,25 ,25 ,45 ,35 ,40 ,3,false,0       ,.4    , [1,10]), new p(
		281    ,"Kirlia"    ,"Psychic" ,"Fairy"   ,278,38 ,35 ,35 ,65 ,55 ,50 ,3,false,280     ,0     , [1,10]), new p(
		282    ,"Gardevoir" ,"Psychic" ,"Fairy"   ,518,68 ,65 ,65 ,125,115,80 ,3,false,281     ,0     , [1,10]), new p(
		283    ,"Surskit"   ,"Bug"     ,"Water"   ,269,40 ,30 ,32 ,50 ,52 ,65 ,3,false,0       ,.8    , [1,10]), new p(
		284    ,"Masquerain","Bug"     ,"Flying"  ,414,70 ,60 ,62 ,80 ,82 ,60 ,3,false,283     ,0     , [1,10]), new p(
		285    ,"Shroomish" ,"Grass"   ,"None"    ,295,60 ,40 ,60 ,40 ,60 ,35 ,3,false,0       ,.7    , [1,10]), new p(
		286    ,"Breloom"   ,"Grass"   ,"Fighting",460,60 ,130,80 ,60 ,60 ,70 ,3,false,285     ,0     , [1,10]), new p(
		287    ,"Slakoth"   ,"Normal"  ,"None"    ,280,60 ,60 ,60 ,35 ,35 ,30 ,3,false,0       ,.5    , [1,10]), new p(
		288    ,"Vigoroth"  ,"Normal"  ,"None"    ,440,80 ,80 ,80 ,55 ,55 ,90 ,3,false,287     ,0     , [1,10]), new p(
		289    ,"Slaking"   ,"Normal"  ,"None"    ,670,150,160,100,95 ,65 ,100,3,false,288     ,0     , [1,10]), new p(
		290    ,"Nincada"   ,"Bug"     ,"Ground"  ,266,31 ,45 ,90 ,30 ,30 ,40 ,3,false,0       ,.6    , [1,10]), new p(
		291    ,"Ninjask"   ,"Bug"     ,"Flying"  ,456,61 ,90 ,45 ,50 ,50 ,160,3,false,290     ,0     , [1,10]), new p(
		292    ,"Shedinja"  ,"Bug"     ,"Ghost"   ,236,1  ,90 ,45 ,30 ,30 ,40 ,3,false,290     ,0     , [1,10]), new p(
		293    ,"Whismur"   ,"Normal"  ,"None"    ,240,64 ,51 ,23 ,51 ,23 ,28 ,3,false,0       ,.5    , [1,10]), new p(
		294    ,"Loudred"   ,"Normal"  ,"None"    ,360,84 ,71 ,43 ,71 ,43 ,48 ,3,false,293     ,0     , [1,10]), new p(
		295    ,"Exploud"   ,"Normal"  ,"None"    ,490,104,91 ,63 ,91 ,73 ,68 ,3,false,294     ,0     , [1,10]), new p(
		296    ,"Makuhita"  ,"Fighting","None"    ,237,72 ,60 ,30 ,20 ,30 ,25 ,3,false,0       ,.6    , [1,10]), new p(
		297    ,"Hariyama"  ,"Fighting","None"    ,474,144,120,60 ,40 ,60 ,50 ,3,false,296     ,0     , [1,10]), new p(
		298    ,"Azurill"   ,"Normal"  ,"Fairy"   ,190,50 ,20 ,40 ,20 ,40 ,20 ,3,false,0       ,0     , [1,10]), new p(
		299    ,"Nosepass"  ,"Rock"    ,"None"    ,375,30 ,45 ,135,45 ,90 ,30 ,3,false,0       ,.3    , [1,10]), new p(
		300    ,"Skitty"    ,"Normal"  ,"None"    ,260,50 ,45 ,45 ,35 ,35 ,50 ,3,false,0       ,.6    , [1,10]), new p(
		301    ,"Delcatty"  ,"Normal"  ,"None"    ,380,70 ,65 ,65 ,55 ,55 ,70 ,3,false,300     ,0     , [1,10]), new p(
		302    ,"Sableye"   ,"Dark"    ,"Ghost"   ,380,50 ,75 ,75 ,65 ,65 ,50 ,3,false,0       ,.2    , [1,10]), new p(
		303    ,"Mawile"    ,"Steel"   ,"Fairy"   ,380,50 ,85 ,85 ,55 ,55 ,50 ,3,false,0       ,.2    , [1,10]), new p(
		304    ,"Aron"      ,"Steel"   ,"Rock"    ,330,50 ,70 ,100,40 ,40 ,30 ,3,false,0       ,.4    , [1,10]), new p(
		305    ,"Lairon"    ,"Steel"   ,"Rock"    ,430,60 ,90 ,140,50 ,50 ,40 ,3,false,304     ,0     , [1,10]), new p(
		306    ,"Aggron"    ,"Steel"   ,"Rock"    ,530,70 ,110,180,60 ,60 ,50 ,3,false,305     ,0     , [1,10]), new p(
		307    ,"Meditite"  ,"Fighting","Psychic" ,280,30 ,40 ,55 ,40 ,55 ,60 ,3,false,0       ,.5    , [1,10]), new p(
		308    ,"Medicham"  ,"Fighting","Psychic" ,410,60 ,60 ,75 ,60 ,75 ,80 ,3,false,307     ,0     , [1,10]), new p(
		309    ,"Electrike" ,"Electric","None"    ,295,40 ,45 ,40 ,65 ,40 ,65 ,3,false,0       ,.4    , [1,10]), new p(
		310    ,"Manectric" ,"Electric","None"    ,475,70 ,75 ,60 ,105,60 ,105,3,false,309     ,0     , [1,10]), new p(
		311    ,"Plusle"    ,"Electric","None"    ,405,60 ,50 ,40 ,85 ,75 ,95 ,3,false,0       ,.65   , [1,10]), new p(
		312    ,"Minun"     ,"Electric","None"    ,405,60 ,40 ,50 ,75 ,85 ,95 ,3,false,0       ,.65   , [1,10]), new p(
		313    ,"Volbeat"   ,"Bug"     ,"None"    ,400,65 ,73 ,55 ,47 ,75 ,85 ,3,false,0       ,.7    , [1,10]), new p(
		314    ,"Illumise"  ,"Bug"     ,"None"    ,400,65 ,47 ,55 ,73 ,75 ,85 ,3,false,0       ,.7    , [1,10]), new p(
		315    ,"Roselia"   ,"Grass"   ,"Poison"  ,400,50 ,60 ,45 ,100,80 ,65 ,3,false,0       ,.4    , [1,10]), new p(
		316    ,"Gulpin"    ,"Poison"  ,"None"    ,302,70 ,43 ,53 ,43 ,53 ,40 ,3,false,0       ,.5    , [1,10]), new p(
		317    ,"Swalot"    ,"Poison"  ,"None"    ,467,100,73 ,83 ,73 ,83 ,55 ,3,false,316     ,0     , [1,10]), new p(
		318    ,"Carvanha"  ,"Water"   ,"Dark"    ,305,45 ,90 ,20 ,65 ,20 ,65 ,3,false,0       ,.6    , [1,10]), new p(
		319    ,"Sharpedo"  ,"Water"   ,"Dark"    ,460,70 ,120,40 ,95 ,40 ,95 ,3,false,318     ,0     , [1,10]), new p(
		320    ,"Wailmer"   ,"Water"   ,"None"    ,400,130,70 ,35 ,70 ,35 ,60 ,3,false,0       ,.5    , [1,10]), new p(
		321    ,"Wailord"   ,"Water"   ,"None"    ,500,170,90 ,45 ,90 ,45 ,60 ,3,false,320     ,0     , [1,10]), new p(
		322    ,"Numel"     ,"Fire"    ,"Ground"  ,305,60 ,60 ,40 ,65 ,45 ,35 ,3,false,0       ,.5    , [1,10]), new p(
		323    ,"Camerupt"  ,"Fire"    ,"Ground"  ,460,70 ,100,70 ,105,75 ,40 ,3,false,322     ,0     , [1,10]), new p(
		324    ,"Torkoal"   ,"Fire"    ,"None"    ,470,70 ,85 ,140,85 ,70 ,20 ,3,false,0       ,.3    , [1,10]), new p(
		325    ,"Spoink"    ,"Psychic" ,"None"    ,330,60 ,25 ,35 ,70 ,80 ,60 ,3,false,0       ,.5    , [1,10]), new p(
		326    ,"Grumpig"   ,"Psychic" ,"None"    ,470,80 ,45 ,65 ,90 ,110,80 ,3,false,325     ,0     , [1,10]), new p(
		327    ,"Spinda"    ,"Normal"  ,"None"    ,360,60 ,60 ,60 ,60 ,60 ,60 ,3,false,0       ,.4    , [1,10]), new p(
		328    ,"Trapinch"  ,"Ground"  ,"None"    ,290,45 ,100,45 ,45 ,45 ,10 ,3,false,0       ,.3    , [1,10]), new p(
		329    ,"Vibrava"   ,"Ground"  ,"Dragon"  ,340,50 ,70 ,50 ,50 ,50 ,70 ,3,false,328     ,0     , [1,10]), new p(
		330    ,"Flygon"    ,"Ground"  ,"Dragon"  ,520,80 ,100,80 ,80 ,80 ,100,3,false,329     ,0     , [1,10]), new p(
		331    ,"Cacnea"    ,"Grass"   ,"None"    ,335,50 ,85 ,40 ,85 ,40 ,35 ,3,false,0       ,.6    , [1,10]), new p(
		332    ,"Cacturne"  ,"Grass"   ,"Dark"    ,475,70 ,115,60 ,115,60 ,55 ,3,false,331     ,0     , [1,10]), new p(
		333    ,"Swablu"    ,"Normal"  ,"Flying"  ,310,45 ,40 ,60 ,40 ,75 ,50 ,3,false,0       ,.4    , [1,10]), new p(
		334    ,"Altaria"   ,"Dragon"  ,"Flying"  ,490,75 ,70 ,90 ,70 ,105,80 ,3,false,333     ,0     , [1,10]), new p(
		335    ,"Zangoose"  ,"Normal"  ,"None"    ,458,73 ,115,60 ,60 ,60 ,90 ,3,false,0       ,.3    , [1,10]), new p(
		336    ,"Seviper"   ,"Poison"  ,"None"    ,458,73 ,100,60 ,100,60 ,65 ,3,false,0       ,.3    , [1,10]), new p(
		337    ,"Lunatone"  ,"Rock"    ,"Psychic" ,440,70 ,55 ,65 ,95 ,85 ,70 ,3,false,0       ,.2    , [1,10]), new p(
		338    ,"Solrock"   ,"Rock"    ,"Psychic" ,440,70 ,95 ,85 ,55 ,65 ,70 ,3,false,0       ,.2    , [1,10]), new p(
		339    ,"Barboach"  ,"Water"   ,"Ground"  ,288,50 ,48 ,43 ,46 ,41 ,60 ,3,false,0       ,.5    , [1,10]), new p(
		340    ,"Whiscash"  ,"Water"   ,"Ground"  ,468,110,78 ,73 ,76 ,71 ,60 ,3,false,339     ,0     , [1,10]), new p(
		341    ,"Corphish"  ,"Water"   ,"None"    ,308,43 ,80 ,65 ,50 ,35 ,35 ,3,false,0       ,.5    , [1,10]), new p(
		342    ,"Crawdaunt" ,"Water"   ,"Dark"    ,468,63 ,120,85 ,90 ,55 ,55 ,3,false,341     ,0     , [1,10]), new p(
		343    ,"Baltoy"    ,"Ground"  ,"Psychic" ,300,40 ,40 ,55 ,40 ,70 ,55 ,3,false,0       ,.4    , [1,10]), new p(
		344    ,"Claydol"   ,"Ground"  ,"Psychic" ,500,60 ,70 ,105,70 ,120,75 ,3,false,343     ,0     , [1,10]), new p(
		345    ,"Lileep"    ,"Rock"    ,"Grass"   ,355,66 ,41 ,77 ,61 ,87 ,23 ,3,false,-1      ,0     , [1,10]), new p(
		346    ,"Cradily"   ,"Rock"    ,"Grass"   ,495,86 ,81 ,97 ,81 ,107,43 ,3,false,345     ,0     , [1,10]), new p(
		347    ,"Anorith"   ,"Rock"    ,"Bug"     ,355,45 ,95 ,50 ,40 ,50 ,75 ,3,false,-1      ,0     , [1,10]), new p(
		348    ,"Armaldo"   ,"Rock"    ,"Bug"     ,495,75 ,125,100,70 ,80 ,45 ,3,false,347     ,0     , [1,10]), new p(
		349    ,"Feebas"    ,"Water"   ,"None"    ,200,20 ,15 ,20 ,10 ,55 ,80 ,3,false,0       ,.4    , [1,10]), new p(
		350    ,"Milotic"   ,"Water"   ,"None"    ,540,95 ,60 ,79 ,100,125,81 ,3,false,349     ,0     , [1,10]), new p(
		351    ,"Castform"  ,"Normal"  ,"None"    ,420,70 ,70 ,70 ,70 ,70 ,70 ,3,false,0       ,.1    , [1,10]), new p(
		352    ,"Kecleon"   ,"Normal"  ,"None"    ,440,60 ,90 ,70 ,60 ,120,40 ,3,false,0       ,.1    , [1,10]), new p(
		353    ,"Shuppet"   ,"Ghost"   ,"None"    ,295,44 ,75 ,35 ,63 ,33 ,45 ,3,false,0       ,.2    , [1,10]), new p(
		354    ,"Banette"   ,"Ghost"   ,"None"    ,455,64 ,115,65 ,83 ,63 ,65 ,3,false,354     ,0     , [1,10]), new p(
		355    ,"Duskull"   ,"Ghost"   ,"None"    ,295,20 ,40 ,90 ,30 ,90 ,25 ,3,false,0       ,.2    , [1,10]), new p(
		356    ,"Dusclops"  ,"Ghost"   ,"None"    ,455,40 ,70 ,130,60 ,130,25 ,3,false,355     ,0     , [1,10]), new p(
		357    ,"Tropius"   ,"Grass"   ,"Flying"  ,460,99 ,68 ,83 ,72 ,87 ,51 ,3,false,0       ,.2    , [1,10]), new p(
		358    ,"Chimecho"  ,"Psychic" ,"None"    ,425,65 ,50 ,70 ,95 ,80 ,65 ,3,false,0       ,.3    , [1,10]), new p(
		359    ,"Absol"     ,"Dark"    ,"None"    ,465,65 ,130,60 ,75 ,60 ,75 ,3,false,0       ,.1    , [1,10]), new p(
		360    ,"Wynaut"    ,"Psychic" ,"None"    ,260,95 ,23 ,48 ,23 ,48 ,23 ,3,false,0       ,0     , [1,10]), new p(
		361    ,"Snorunt"   ,"Ice"     ,"None"    ,300,50 ,50 ,50 ,50 ,50 ,50 ,3,false,0       ,.5    , [1,10]), new p(
		362    ,"Glalie"    ,"Ice"     ,"None"    ,480,80 ,80 ,80 ,80 ,80 ,80 ,3,false,361     ,0     , [1,10]), new p(
		363    ,"Spheal"    ,"Ice"     ,"Water"   ,290,70 ,40 ,50 ,55 ,50 ,25 ,3,false,0       ,.4    , [1,10]), new p(
		364    ,"Sealeo"    ,"Ice"     ,"Water"   ,410,90 ,60 ,70 ,75 ,70 ,45 ,3,false,363     ,0     , [1,10]), new p(
		365    ,"Walrein"   ,"Ice"     ,"Water"   ,530,110,80 ,90 ,95 ,90 ,65 ,3,false,364     ,0     , [1,10]), new p(
		366    ,"Clamperl"  ,"Water"   ,"None"    ,345,35 ,64 ,85 ,74 ,55 ,32 ,3,false,0       ,.4    , [1,10]), new p(
		367    ,"Huntail"   ,"Water"   ,"None"    ,485,55 ,104,105,94 ,75 ,52 ,3,false,366     ,0     , [1,10]), new p(
		368    ,"Gorebyss"  ,"Water"   ,"None"    ,485,55 ,84 ,105,114,75 ,52 ,3,false,366     ,0     , [1,10]), new p(
		369    ,"Relicanth" ,"Water"   ,"Rock"    ,485,100,90 ,130,45 ,65 ,55 ,3,false,0       ,.1    , [1,10]), new p(
		370    ,"Luvdisc"   ,"Water"   ,"None"    ,330,43 ,30 ,55 ,40 ,65 ,97 ,3,false,0       ,.8    , [1,10]), new p(
		371    ,"Bagon"     ,"Dragon"  ,"None"    ,300,45 ,75 ,60 ,40 ,30 ,50 ,3,false,0       ,.05   , [1,10]), new p(
		372    ,"Shelgon"   ,"Dragon"  ,"None"    ,420,65 ,95 ,100,60 ,50 ,50 ,3,false,371     ,0     , [1,10]), new p(
		373    ,"Salamence" ,"Dragon"  ,"Flying"  ,600,95 ,135,80 ,110,80 ,100,3,false,372     ,0     , [1,10]), new p(
		374    ,"Beldum"    ,"Steel"   ,"Psychic" ,300,40 ,55 ,80 ,35 ,60 ,30 ,3,false,0       ,.05   , [1,10]), new p(
		375    ,"Metang"    ,"Steel"   ,"Psychic" ,420,60 ,75 ,100,55 ,80 ,50 ,3,false,374     ,0     , [1,10]), new p(
		376    ,"Metagross" ,"Steel"   ,"Psychic" ,600,80 ,135,130,95 ,90 ,70 ,3,false,375     ,0     , [1,10]), new p(
		377    ,"Regirock"  ,"Rock"    ,"None"    ,580,80 ,100,200,50 ,100,50 ,3,true ,0       ,0     , [1,10]), new p(
		378    ,"Regice"    ,"Ice"     ,"None"    ,580,80 ,50 ,100,100,200,50 ,3,true ,0       ,0     , [1,10]), new p(
		379    ,"Registeel" ,"Steel"   ,"None"    ,580,80 ,75 ,150,75 ,150,50 ,3,true ,0       ,0     , [1,10]), new p(
		380    ,"Latias"    ,"Dragon"  ,"Psychic" ,600,80 ,80 ,90 ,110,130,110,3,true ,0       ,0     , [1,10]), new p(
		381    ,"Latios"    ,"Dragon"  ,"Psychic" ,600,80 ,90 ,80 ,130,110,110,3,true ,0       ,0     , [1,10]), new p(
		382    ,"Kyogre"    ,"Water"   ,"None"    ,670,100,100,90 ,150,140,90 ,3,true ,0       ,0     , [1,10]), new p(
		383    ,"Groudon"   ,"Ground"  ,"None"    ,670,100,150,140,100,90 ,90 ,3,true ,0       ,0     , [1,10]), new p(
		384    ,"Rayquaza"  ,"Dragon"  ,"Flying"  ,680,105,150,90 ,150,90 ,95 ,3,true ,0       ,0     , [1,10]), new p(
		385    ,"Jirachi"   ,"Steel"   ,"Psychic" ,600,100,100,100,100,100,100,3,true ,0       ,0     , [1,10]), new p(
		386    ,"Deoxys"    ,"Psychic" ,"None"    ,600,50 ,150,50 ,150,50 ,150,3,true ,0       ,0)*//*, new p(
		387    ,"Turtwig"   ,"Grass"   ,"None"    ,318,55 ,68 ,64 ,45 ,55 ,31 ,4,false,        ,0     , [1,10]), new p(
		388    ,"Grotle"    ,"Grass"   ,"None"    ,405,75 ,89 ,85 ,55 ,65 ,36 ,4,false,        ,0     , [1,10]), new p(
		389    ,"Torterra"  ,"Grass"   ,"Ground"  ,525,95 ,109,105,75 ,85 ,56 ,4,false,        ,0     , [1,10]), new p(
		390    ,"Chimchar"  ,"Fire"    ,"None"    ,309,44 ,58 ,44 ,58 ,44 ,61 ,4,false,        ,0     , [1,10]), new p(
		391    ,"Monferno"  ,"Fire"    ,"Fighting",405,64 ,78 ,52 ,78 ,52 ,81 ,4,false,        ,0     , [1,10]), new p(
		392    ,"Infernape" ,"Fire"    ,"Fighting",534,76 ,104,71 ,104,71 ,108,4,false,        ,0     , [1,10]), new p(
		393    ,"Piplup"    ,"Water"   ,"None"    ,314,53 ,51 ,53 ,61 ,56 ,40 ,4,false,        ,0     , [1,10]), new p(
		394    ,"Prinplup"  ,"Water"   ,"None"    ,405,64 ,66 ,68 ,81 ,76 ,50 ,4,false,        ,0     , [1,10]), new p(
		395    ,"Empoleon"  ,"Water"   ,"Steel"   ,530,84 ,86 ,88 ,111,101,60 ,4,false,        ,0     , [1,10]), new p(
		396    ,"Starly"    ,"Normal"  ,"Flying"  ,245,40 ,55 ,30 ,30 ,30 ,60 ,4,false,        ,0     , [1,10]), new p(
		397    ,"Staravia"  ,"Normal"  ,"Flying"  ,340,55 ,75 ,50 ,40 ,40 ,80 ,4,false,        ,0     , [1,10]), new p(
		398    ,"Staraptor" ,"Normal"  ,"Flying"  ,485,85 ,120,70 ,50 ,60 ,100,4,false,        ,0     , [1,10]), new p(
		399    ,"Bidoof"    ,"Normal"  ,"None"    ,250,59 ,45 ,40 ,35 ,40 ,31 ,4,false,        ,0     , [1,10]), new p(
		400    ,"Bibarel"   ,"Normal"  ,"Water"   ,410,79 ,85 ,60 ,55 ,60 ,71 ,4,false,        ,0     , [1,10]), new p(
		401    ,"Kricketot" ,"Bug"     ,"None"    ,194,37 ,25 ,41 ,25 ,41 ,25 ,4,false,        ,0     , [1,10]), new p(
		402    ,"Kricketune","Bug"     ,"None"    ,384,77 ,85 ,51 ,55 ,51 ,65 ,4,false,        ,0     , [1,10]), new p(
		403    ,"Shinx"     ,"Electric","None"    ,263,45 ,65 ,34 ,40 ,34 ,45 ,4,false,        ,0     , [1,10]), new p(
		404    ,"Luxio"     ,"Electric","None"    ,363,60 ,85 ,49 ,60 ,49 ,60 ,4,false,        ,0     , [1,10]), new p(
		405    ,"Luxray"    ,"Electric","None"    ,523,80 ,120,79 ,95 ,79 ,70 ,4,false,        ,0     , [1,10]), new p(
		406    ,"Budew"     ,"Grass"   ,"Poison"  ,280,40 ,30 ,35 ,50 ,70 ,55 ,4,false,        ,0     , [1,10]), new p(
		407    ,"Roserade"  ,"Grass"   ,"Poison"  ,515,60 ,70 ,65 ,125,105,90 ,4,false,        ,0     , [1,10]), new p(
		408    ,"Cranidos"  ,"Rock"    ,"None"    ,350,67 ,125,40 ,30 ,30 ,58 ,4,false,        ,0     , [1,10]), new p(
		409    ,"Rampardos" ,"Rock"    ,"None"    ,495,97 ,165,60 ,65 ,50 ,58 ,4,false,        ,0     , [1,10]), new p(
		410    ,"Shieldon"  ,"Rock"    ,"Steel"   ,350,30 ,42 ,118,42 ,88 ,30 ,4,false,        ,0     , [1,10]), new p(
		411    ,"Bastiodon" ,"Rock"    ,"Steel"   ,495,60 ,52 ,168,47 ,138,30 ,4,false,        ,0     , [1,10]), new p(
		412    ,"Burmy"     ,"Bug"     ,"None"    ,224,40 ,29 ,45 ,29 ,45 ,36 ,4,false,        ,0     , [1,10]), new p(
		413    ,"Wormadam"  ,"Bug"     ,"Grass"   ,424,60 ,59 ,85 ,79 ,105,36 ,4,false,        ,0     , [1,10]), new p(
		414    ,"Mothim"    ,"Bug"     ,"Flying"  ,424,70 ,94 ,50 ,94 ,50 ,66 ,4,false,        ,0     , [1,10]), new p(
		415    ,"Combee"    ,"Bug"     ,"Flying"  ,244,30 ,30 ,42 ,30 ,42 ,70 ,4,false,        ,0     , [1,10]), new p(
		416    ,"Vespiquen" ,"Bug"     ,"Flying"  ,474,70 ,80 ,102,80 ,102,40 ,4,false,        ,0     , [1,10]), new p(
		417    ,"Pachirisu" ,"Electric","None"    ,405,60 ,45 ,70 ,45 ,90 ,95 ,4,false,        ,0     , [1,10]), new p(
		418    ,"Buizel"    ,"Water"   ,"None"    ,330,55 ,65 ,35 ,60 ,30 ,85 ,4,false,        ,0     , [1,10]), new p(
		419    ,"Floatzel"  ,"Water"   ,"None"    ,495,85 ,105,55 ,85 ,50 ,115,4,false,        ,0     , [1,10]), new p(
		420    ,"Cherubi"   ,"Grass"   ,"None"    ,275,45 ,35 ,45 ,62 ,53 ,35 ,4,false,        ,0     , [1,10]), new p(
		421    ,"Cherrim"   ,"Grass"   ,"None"    ,450,70 ,60 ,70 ,87 ,78 ,85 ,4,false,        ,0     , [1,10]), new p(
		422    ,"Shellos"   ,"Water"   ,"None"    ,325,76 ,48 ,48 ,57 ,62 ,34 ,4,false,        ,0     , [1,10]), new p(
		423    ,"Gastrodon" ,"Water"   ,"Ground"  ,475,111,83 ,68 ,92 ,82 ,39 ,4,false,        ,0     , [1,10]), new p(
		424    ,"Ambipom"   ,"Normal"  ,"None"    ,482,75 ,100,66 ,60 ,66 ,115,4,false,        ,0     , [1,10]), new p(
		425    ,"Drifloon"  ,"Ghost"   ,"Flying"  ,348,90 ,50 ,34 ,60 ,44 ,70 ,4,false,        ,0     , [1,10]), new p(
		426    ,"Drifblim"  ,"Ghost"   ,"Flying"  ,498,150,80 ,44 ,90 ,54 ,80 ,4,false,        ,0     , [1,10]), new p(
		427    ,"Buneary"   ,"Normal"  ,"None"    ,350,55 ,66 ,44 ,44 ,56 ,85 ,4,false,        ,0     , [1,10]), new p(
		428    ,"Lopunny"   ,"Normal"  ,"None"    ,480,65 ,76 ,84 ,54 ,96 ,105,4,false,        ,0     , [1,10]), new p(
		429    ,"Mismagius" ,"Ghost"   ,"None"    ,495,60 ,60 ,60 ,105,105,105,4,false,        ,0     , [1,10]), new p(
		430    ,"Honchkrow" ,"Dark"    ,"Flying"  ,505,100,125,52 ,105,52 ,71 ,4,false,        ,0     , [1,10]), new p(
		431    ,"Glameow"   ,"Normal"  ,"None"    ,310,49 ,55 ,42 ,42 ,37 ,85 ,4,false,        ,0     , [1,10]), new p(
		432    ,"Purugly"   ,"Normal"  ,"None"    ,452,71 ,82 ,64 ,64 ,59 ,112,4,false,        ,0     , [1,10]), new p(
		433    ,"Chingling" ,"Psychic" ,"None"    ,285,45 ,30 ,50 ,65 ,50 ,45 ,4,false,        ,0     , [1,10]), new p(
		434    ,"Stunky"    ,"Poison"  ,"Dark"    ,329,63 ,63 ,47 ,41 ,41 ,74 ,4,false,        ,0     , [1,10]), new p(
		435    ,"Skuntank"  ,"Poison"  ,"Dark"    ,479,103,93 ,67 ,71 ,61 ,84 ,4,false,        ,0     , [1,10]), new p(
		436    ,"Bronzor"   ,"Steel"   ,"Psychic" ,300,57 ,24 ,86 ,24 ,86 ,23 ,4,false,        ,0     , [1,10]), new p(
		437    ,"Bronzong"  ,"Steel"   ,"Psychic" ,500,67 ,89 ,116,79 ,116,33 ,4,false,        ,0     , [1,10]), new p(
		438    ,"Bonsly"    ,"Rock"    ,"None"    ,290,50 ,80 ,95 ,10 ,45 ,10 ,4,false,        ,0     , [1,10]), new p(
		439    , "Mime Jr." ,"Psychic" ,"Fairy"   ,310,20 ,25 ,45 ,70 ,90 ,60 ,4,false,        ,0     , [1,10]), new p(
		440    ,"Happiny"   ,"Normal"  ,"None"    ,220,100,5  ,5  ,15 ,65 ,30 ,4,false,        ,0     , [1,10]), new p(
		441    ,"Chatot"    ,"Normal"  ,"Flying"  ,411,76 ,65 ,45 ,92 ,42 ,91 ,4,false,        ,0     , [1,10]), new p(
		442    ,"Spiritomb" ,"Ghost"   ,"Dark"    ,485,50 ,92 ,108,92 ,108,35 ,4,false,        ,0     , [1,10]), new p(
		443    ,"Gible"     ,"Dragon"  ,"Ground"  ,300,58 ,70 ,45 ,40 ,45 ,42 ,4,false,        ,0     , [1,10]), new p(
		444    ,"Gabite"    ,"Dragon"  ,"Ground"  ,410,68 ,90 ,65 ,50 ,55 ,82 ,4,false,        ,0     , [1,10]), new p(
		445    ,"Garchomp"  ,"Dragon"  ,"Ground"  ,600,108,130,95 ,80 ,85 ,102,4,false,        ,0     , [1,10]), new p(
		446    ,"Munchlax"  ,"Normal"  ,"None"    ,390,135,85 ,40 ,40 ,85 ,5  ,4,false,        ,0     , [1,10]), new p(
		447    ,"Riolu"     ,"Fighting","None"    ,285,40 ,70 ,40 ,35 ,40 ,60 ,4,false,        ,0     , [1,10]), new p(
		448    ,"Lucario"   ,"Fighting","Steel"   ,525,70 ,110,70 ,115,70 ,90 ,4,false,        ,0     , [1,10]), new p(
		449    ,"Hippopotas","Ground"  ,"None"    ,330,68 ,72 ,78 ,38 ,42 ,32 ,4,false,        ,0     , [1,10]), new p(
		450    ,"Hippowdon" ,"Ground"  ,"None"    ,525,108,112,118,68 ,72 ,47 ,4,false,        ,0     , [1,10]), new p(
		451    ,"Skorupi"   ,"Poison"  ,"Bug"     ,330,40 ,50 ,90 ,30 ,55 ,65 ,4,false,        ,0     , [1,10]), new p(
		452    ,"Drapion"   ,"Poison"  ,"Dark"    ,500,70 ,90 ,110,60 ,75 ,95 ,4,false,        ,0     , [1,10]), new p(
		453    ,"Croagunk"  ,"Poison"  ,"Fighting",300,48 ,61 ,40 ,61 ,40 ,50 ,4,false,        ,0     , [1,10]), new p(
		454    ,"Toxicroak" ,"Poison"  ,"Fighting",490,83 ,106,65 ,86 ,65 ,85 ,4,false,        ,0     , [1,10]), new p(
		455    ,"Carnivine" ,"Grass"   ,"None"    ,454,74 ,100,72 ,90 ,72 ,46 ,4,false,        ,0     , [1,10]), new p(
		456    ,"Finneon"   ,"Water"   ,"None"    ,330,49 ,49 ,56 ,49 ,61 ,66 ,4,false,        ,0     , [1,10]), new p(
		457    ,"Lumineon"  ,"Water"   ,"None"    ,460,69 ,69 ,76 ,69 ,86 ,91 ,4,false,        ,0     , [1,10]), new p(
		458    ,"Mantyke"   ,"Water"   ,"Flying"  ,345,45 ,20 ,50 ,60 ,120,50 ,4,false,        ,0     , [1,10]), new p(
		459    ,"Snover"    ,"Grass"   ,"Ice"     ,334,60 ,62 ,50 ,62 ,60 ,40 ,4,false,        ,0     , [1,10]), new p(
		460    ,"Abomasnow" ,"Grass"   ,"Ice"     ,494,90 ,92 ,75 ,92 ,85 ,60 ,4,false,        ,0     , [1,10]), new p(
		461    ,"Weavile"   ,"Dark"    ,"Ice"     ,510,70 ,120,65 ,45 ,85 ,125,4,false,        ,0     , [1,10]), new p(
		462    ,"Magnezone" ,"Electric","Steel"   ,535,70 ,70 ,115,130,90 ,60 ,4,false,        ,0     , [1,10]), new p(
		463    ,"Lickilicky","Normal"  ,"None"    ,515,110,85 ,95 ,80 ,95 ,50 ,4,false,        ,0     , [1,10]), new p(
		464    ,"Rhyperior" ,"Ground"  ,"Rock"    ,535,115,140,130,55 ,55 ,40 ,4,false,        ,0     , [1,10]), new p(
		465    ,"Tangrowth" ,"Grass"   ,"None"    ,535,100,100,125,110,50 ,50 ,4,false,        ,0     , [1,10]), new p(
		466    ,"Electivire","Electric","None"    ,540,75 ,123,67 ,95 ,85 ,95 ,4,false,        ,0     , [1,10]), new p(
		467    ,"Magmortar" ,"Fire"    ,"None"    ,540,75 ,95 ,67 ,125,95 ,83 ,4,false,        ,0     , [1,10]), new p(
		468    ,"Togekiss"  ,"Fairy"   ,"Flying"  ,545,85 ,50 ,95 ,120,115,80 ,4,false,        ,0     , [1,10]), new p(
		469    ,"Yanmega"   ,"Bug"     ,"Flying"  ,515,86 ,76 ,86 ,116,56 ,95 ,4,false,        ,0     , [1,10]), new p(
		470    ,"Leafeon"   ,"Grass"   ,"None"    ,525,65 ,110,130,60 ,65 ,95 ,4,false,        ,0     , [1,10]), new p(
		471    ,"Glaceon"   ,"Ice"     ,"None"    ,525,65 ,60 ,110,130,95 ,65 ,4,false,        ,0     , [1,10]), new p(
		472    ,"Gliscor"   ,"Ground"  ,"Flying"  ,510,75 ,95 ,125,45 ,75 ,95 ,4,false,        ,0     , [1,10]), new p(
		473    ,"Mamoswine" ,"Ice"     ,"Ground"  ,530,110,130,80 ,70 ,60 ,80 ,4,false,        ,0     , [1,10]), new p(
		474    ,"Porygon-Z" ,"Normal"  ,"None"    ,535,85 ,80 ,70 ,135,75 ,90 ,4,false,        ,0     , [1,10]), new p(
		475    ,"Gallade"   ,"Psychic" ,"Fighting",518,68 ,125,65 ,65 ,115,80 ,4,false,        ,0     , [1,10]), new p(
		476    ,"Probopass" ,"Rock"    ,"Steel"   ,525,60 ,55 ,145,75 ,150,40 ,4,false,        ,0     , [1,10]), new p(
		477    ,"Dusknoir"  ,"Ghost"   ,"None"    ,525,45 ,100,135,65 ,135,45 ,4,false,        ,0     , [1,10]), new p(
		478    ,"Froslass"  ,"Ice"     ,"Ghost"   ,480,70 ,80 ,70 ,80 ,70 ,110,4,false,        ,0     , [1,10]), new p(
		479    ,"Rotom"     ,"Electric","Ghost"   ,440,50 ,50 ,77 ,95 ,77 ,91 ,4,false,        ,0     , [1,10]), new p(
		480    ,"Uxie"      ,"Psychic" ,"None"    ,580,75 ,75 ,130,75 ,130,95 ,4,true ,        ,0     , [1,10]), new p(
		481    ,"Mesprit"   ,"Psychic" ,"None"    ,580,80 ,105,105,105,105,80 ,4,true ,        ,0     , [1,10]), new p(
		482    ,"Azelf"     ,"Psychic" ,"None"    ,580,75 ,125,70 ,125,70 ,115,4,true ,        ,0     , [1,10]), new p(
		483    ,"Dialga"    ,"Steel"   ,"Dragon"  ,680,100,120,120,150,100,90 ,4,true ,        ,0     , [1,10]), new p(
		484    ,"Palkia"    ,"Water"   ,"Dragon"  ,680,90 ,120,100,150,120,100,4,true ,        ,0     , [1,10]), new p(
		485    ,"Heatran"   ,"Fire"    ,"Steel"   ,600,91 ,90 ,106,130,106,77 ,4,true ,        ,0     , [1,10]), new p(
		486    ,"Regigigas" ,"Normal"  ,"None"    ,670,110,160,110,80 ,110,100,4,true ,        ,0     , [1,10]), new p(
		487    ,"Giratina"  ,"Ghost"   ,"Dragon"  ,680,150,100,120,100,120,90 ,4,true ,        ,0     , [1,10]), new p(
		488    ,"Cresselia" ,"Psychic" ,"None"    ,600,120,70 ,120,75 ,130,85 ,4,false,        ,0     , [1,10]), new p(
		489    ,"Phione"    ,"Water"   ,"None"    ,480,80 ,80 ,80 ,80 ,80 ,80 ,4,false,        ,0     , [1,10]), new p(
		490    ,"Manaphy"   ,"Water"   ,"None"    ,600,100,100,100,100,100,100,4,false,        ,0     , [1,10]), new p(
		491    ,"Darkrai"   ,"Dark"    ,"None"    ,600,70 ,90 ,90 ,135,90 ,125,4,true ,        ,0     , [1,10]), new p(
		492    ,"Shaymin"   ,"Grass"   ,"None"    ,600,100,100,100,100,100,100,4,true ,        ,0     , [1,10]), new p(
		493    ,"Arceus"    ,"Normal"  ,"None"    ,720,120,120,120,120,120,120,4,true ,        ,0     , [1,10]), new p(
		494    ,"Victini"   ,"Psychic" ,"Fire"    ,600,100,100,100,100,100,100,5,true ,        ,0     , [1,10]), new p(
		495    ,"Snivy"     ,"Grass"   ,"None"    ,308,45 ,45 ,55 ,45 ,55 ,63 ,5,false,        ,0     , [1,10]), new p(
		496    ,"Servine"   ,"Grass"   ,"None"    ,413,60 ,60 ,75 ,60 ,75 ,83 ,5,false,        ,0     , [1,10]), new p(
		497    ,"Serperior" ,"Grass"   ,"None"    ,528,75 ,75 ,95 ,75 ,95 ,113,5,false,        ,0     , [1,10]), new p(
		498    ,"Tepig"     ,"Fire"    ,"None"    ,308,65 ,63 ,45 ,45 ,45 ,45 ,5,false,        ,0     , [1,10]), new p(
		499    ,"Pignite"   ,"Fire"    ,"Fighting",418,90 ,93 ,55 ,70 ,55 ,55 ,5,false,        ,0     , [1,10]), new p(
		500    ,"Emboar"    ,"Fire"    ,"Fighting",528,110,123,65 ,100,65 ,65 ,5,false,        ,0     , [1,10]), new p(
		501    ,"Oshawott"  ,"Water"   ,"None"    ,308,55 ,55 ,45 ,63 ,45 ,45 ,5,false,        ,0     , [1,10]), new p(
		502    ,"Dewott"    ,"Water"   ,"None"    ,413,75 ,75 ,60 ,83 ,60 ,60 ,5,false,        ,0     , [1,10]), new p(
		503    ,"Samurott"  ,"Water"   ,"None"    ,528,95 ,100,85 ,108,70 ,70 ,5,false,        ,0     , [1,10]), new p(
		504    ,"Patrat"    ,"Normal"  ,"None"    ,255,45 ,55 ,39 ,35 ,39 ,42 ,5,false,        ,0     , [1,10]), new p(
		505    ,"Watchog"   ,"Normal"  ,"None"    ,420,60 ,85 ,69 ,60 ,69 ,77 ,5,false,        ,0     , [1,10]), new p(
		506    ,"Lillipup"  ,"Normal"  ,"None"    ,275,45 ,60 ,45 ,25 ,45 ,55 ,5,false,        ,0     , [1,10]), new p(
		507    ,"Herdier"   ,"Normal"  ,"None"    ,370,65 ,80 ,65 ,35 ,65 ,60 ,5,false,        ,0     , [1,10]), new p(
		508    ,"Stoutland" ,"Normal"  ,"None"    ,500,85 ,110,90 ,45 ,90 ,80 ,5,false,        ,0     , [1,10]), new p(
		509    ,"Purrloin"  ,"Dark"    ,"None"    ,281,41 ,50 ,37 ,50 ,37 ,66 ,5,false,        ,0     , [1,10]), new p(
		510    ,"Liepard"   ,"Dark"    ,"None"    ,446,64 ,88 ,50 ,88 ,50 ,106,5,false,        ,0     , [1,10]), new p(
		511    ,"Pansage"   ,"Grass"   ,"None"    ,316,50 ,53 ,48 ,53 ,48 ,64 ,5,false,        ,0     , [1,10]), new p(
		512    ,"Simisage"  ,"Grass"   ,"None"    ,498,75 ,98 ,63 ,98 ,63 ,101,5,false,        ,0     , [1,10]), new p(
		513    ,"Pansear"   ,"Fire"    ,"None"    ,316,50 ,53 ,48 ,53 ,48 ,64 ,5,false,        ,0     , [1,10]), new p(
		514    ,"Simisear"  ,"Fire"    ,"None"    ,498,75 ,98 ,63 ,98 ,63 ,101,5,false,        ,0     , [1,10]), new p(
		515    ,"Panpour"   ,"Water"   ,"None"    ,316,50 ,53 ,48 ,53 ,48 ,64 ,5,false,        ,0     , [1,10]), new p(
		516    ,"Simipour"  ,"Water"   ,"None"    ,498,75 ,98 ,63 ,98 ,63 ,101,5,false,        ,0     , [1,10]), new p(
		517    ,"Munna"     ,"Psychic" ,"None"    ,292,76 ,25 ,45 ,67 ,55 ,24 ,5,false,        ,0     , [1,10]), new p(
		518    ,"Musharna"  ,"Psychic" ,"None"    ,487,116,55 ,85 ,107,95 ,29 ,5,false,        ,0     , [1,10]), new p(
		519    ,"Pidove"    ,"Normal"  ,"Flying"  ,264,50 ,55 ,50 ,36 ,30 ,43 ,5,false,        ,0     , [1,10]), new p(
		520    ,"Tranquill" ,"Normal"  ,"Flying"  ,358,62 ,77 ,62 ,50 ,42 ,65 ,5,false,        ,0     , [1,10]), new p(
		521    ,"Unfezant"  ,"Normal"  ,"Flying"  ,488,80 ,115,80 ,65 ,55 ,93 ,5,false,        ,0     , [1,10]), new p(
		522    ,"Blitzle"   ,"Electric","None"    ,295,45 ,60 ,32 ,50 ,32 ,76 ,5,false,        ,0     , [1,10]), new p(
		523    ,"Zebstrika" ,"Electric","None"    ,497,75 ,100,63 ,80 ,63 ,116,5,false,        ,0     , [1,10]), new p(
		524    ,"Roggenrola","Rock"    ,"None"    ,280,55 ,75 ,85 ,25 ,25 ,15 ,5,false,        ,0     , [1,10]), new p(
		525    ,"Boldore"   ,"Rock"    ,"None"    ,390,70 ,105,105,50 ,40 ,20 ,5,false,        ,0     , [1,10]), new p(
		526    ,"Gigalith"  ,"Rock"    ,"None"    ,515,85 ,135,130,60 ,80 ,25 ,5,false,        ,0     , [1,10]), new p(
		527    ,"Woobat"    ,"Psychic" ,"Flying"  ,313,55 ,45 ,43 ,55 ,43 ,72 ,5,false,        ,0     , [1,10]), new p(
		528    ,"Swoobat"   ,"Psychic" ,"Flying"  ,425,67 ,57 ,55 ,77 ,55 ,114,5,false,        ,0     , [1,10]), new p(
		529    ,"Drilbur"   ,"Ground"  ,"None"    ,328,60 ,85 ,40 ,30 ,45 ,68 ,5,false,        ,0     , [1,10]), new p(
		530    ,"Excadrill" ,"Ground"  ,"Steel"   ,508,110,135,60 ,50 ,65 ,88 ,5,false,        ,0     , [1,10]), new p(
		531    ,"Audino"    ,"Normal"  ,"None"    ,445,103,60 ,86 ,60 ,86 ,50 ,5,false,        ,0     , [1,10]), new p(
		532    ,"Timburr"   ,"Fighting","None"    ,305,75 ,80 ,55 ,25 ,35 ,35 ,5,false,        ,0     , [1,10]), new p(
		533    ,"Gurdurr"   ,"Fighting","None"    ,405,85 ,105,85 ,40 ,50 ,40 ,5,false,        ,0     , [1,10]), new p(
		534    ,"Conkeldurr","Fighting","None"    ,505,105,140,95 ,55 ,65 ,45 ,5,false,        ,0     , [1,10]), new p(
		535    ,"Tympole"   ,"Water"   ,"None"    ,294,50 ,50 ,40 ,50 ,40 ,64 ,5,false,        ,0     , [1,10]), new p(
		536    ,"Palpitoad" ,"Water"   ,"Ground"  ,384,75 ,65 ,55 ,65 ,55 ,69 ,5,false,        ,0     , [1,10]), new p(
		537    ,"Seismitoad","Water"   ,"Ground"  ,509,105,95 ,75 ,85 ,75 ,74 ,5,false,        ,0     , [1,10]), new p(
		538    ,"Throh"     ,"Fighting","None"    ,465,120,100,85 ,30 ,85 ,45 ,5,false,        ,0     , [1,10]), new p(
		539    ,"Sawk"      ,"Fighting","None"    ,465,75 ,125,75 ,30 ,75 ,85 ,5,false,        ,0     , [1,10]), new p(
		540    ,"Sewaddle"  ,"Bug"     ,"Grass"   ,310,45 ,53 ,70 ,40 ,60 ,42 ,5,false,        ,0     , [1,10]), new p(
		541    ,"Swadloon"  ,"Bug"     ,"Grass"   ,380,55 ,63 ,90 ,50 ,80 ,42 ,5,false,        ,0     , [1,10]), new p(
		542    ,"Leavanny"  ,"Bug"     ,"Grass"   ,500,75 ,103,80 ,70 ,80 ,92 ,5,false,        ,0     , [1,10]), new p(
		543    ,"Venipede"  ,"Bug"     ,"Poison"  ,260,30 ,45 ,59 ,30 ,39 ,57 ,5,false,        ,0     , [1,10]), new p(
		544    ,"Whirlipede","Bug"     ,"Poison"  ,360,40 ,55 ,99 ,40 ,79 ,47 ,5,false,        ,0     , [1,10]), new p(
		545    ,"Scolipede" ,"Bug"     ,"Poison"  ,485,60 ,100,89 ,55 ,69 ,112,5,false,        ,0     , [1,10]), new p(
		546    ,"Cottonee"  ,"Grass"   ,"Fairy"   ,280,40 ,27 ,60 ,37 ,50 ,66 ,5,false,        ,0     , [1,10]), new p(
		547    ,"Whimsicott","Grass"   ,"Fairy"   ,480,60 ,67 ,85 ,77 ,75 ,116,5,false,        ,0     , [1,10]), new p(
		548    ,"Petilil"   ,"Grass"   ,"None"    ,280,45 ,35 ,50 ,70 ,50 ,30 ,5,false,        ,0     , [1,10]), new p(
		549    ,"Lilligant" ,"Grass"   ,"None"    ,480,70 ,60 ,75 ,110,75 ,90 ,5,false,        ,0     , [1,10]), new p(
		550    ,"Basculin"  ,"Water"   ,"None"    ,460,70 ,92 ,65 ,80 ,55 ,98 ,5,false,        ,0     , [1,10]), new p(
		551    ,"Sandile"   ,"Ground"  ,"Dark"    ,292,50 ,72 ,35 ,35 ,35 ,65 ,5,false,        ,0     , [1,10]), new p(
		552    ,"Krokorok"  ,"Ground"  ,"Dark"    ,351,60 ,82 ,45 ,45 ,45 ,74 ,5,false,        ,0     , [1,10]), new p(
		553    ,"Krookodile","Ground"  ,"Dark"    ,519,95 ,117,80 ,65 ,70 ,92 ,5,false,        ,0     , [1,10]), new p(
		554    ,"Darumaka"  ,"Fire"    ,"None"    ,315,70 ,90 ,45 ,15 ,45 ,50 ,5,false,        ,0     , [1,10]), new p(
		555    ,"Darmanitan","Fire"    ,"None"    ,480,105,140,55 ,30 ,55 ,95 ,5,false,        ,0     , [1,10]), new p(
		556    ,"Maractus"  ,"Grass"   ,"None"    ,461,75 ,86 ,67 ,106,67 ,60 ,5,false,        ,0     , [1,10]), new p(
		557    ,"Dwebble"   ,"Bug"     ,"Rock"    ,325,50 ,65 ,85 ,35 ,35 ,55 ,5,false,        ,0     , [1,10]), new p(
		558    ,"Crustle"   ,"Bug"     ,"Rock"    ,475,70 ,95 ,125,65 ,75 ,45 ,5,false,        ,0     , [1,10]), new p(
		559    ,"Scraggy"   ,"Dark"    ,"Fighting",348,50 ,75 ,70 ,35 ,70 ,48 ,5,false,        ,0     , [1,10]), new p(
		560    ,"Scrafty"   ,"Dark"    ,"Fighting",488,65 ,90 ,115,45 ,115,58 ,5,false,        ,0     , [1,10]), new p(
		561    ,"Sigilyph"  ,"Psychic" ,"Flying"  ,490,72 ,58 ,80 ,103,80 ,97 ,5,false,        ,0     , [1,10]), new p(
		562    ,"Yamask"    ,"Ghost"   ,"None"    ,303,38 ,30 ,85 ,55 ,65 ,30 ,5,false,        ,0     , [1,10]), new p(
		563    ,"Cofagrigus","Ghost"   ,"None"    ,483,58 ,50 ,145,95 ,105,30 ,5,false,        ,0     , [1,10]), new p(
		564    ,"Tirtouga"  ,"Water"   ,"Rock"    ,355,54 ,78 ,103,53 ,45 ,22 ,5,false,        ,0     , [1,10]), new p(
		565    ,"Carracosta","Water"   ,"Rock"    ,495,74 ,108,133,83 ,65 ,32 ,5,false,        ,0     , [1,10]), new p(
		566    ,"Archen"    ,"Rock"    ,"Flying"  ,401,55 ,112,45 ,74 ,45 ,70 ,5,false,        ,0     , [1,10]), new p(
		567    ,"Archeops"  ,"Rock"    ,"Flying"  ,567,75 ,140,65 ,112,65 ,110,5,false,        ,0     , [1,10]), new p(
		568    ,"Trubbish"  ,"Poison"  ,"None"    ,329,50 ,50 ,62 ,40 ,62 ,65 ,5,false,        ,0     , [1,10]), new p(
		569    ,"Garbodor"  ,"Poison"  ,"None"    ,474,80 ,95 ,82 ,60 ,82 ,75 ,5,false,        ,0     , [1,10]), new p(
		570    ,"Zorua"     ,"Dark"    ,"None"    ,330,40 ,65 ,40 ,80 ,40 ,65 ,5,false,        ,0     , [1,10]), new p(
		571    ,"Zoroark"   ,"Dark"    ,"None"    ,510,60 ,105,60 ,120,60 ,105,5,false,        ,0     , [1,10]), new p(
		572    ,"Minccino"  ,"Normal"  ,"None"    ,300,55 ,50 ,40 ,40 ,40 ,75 ,5,false,        ,0     , [1,10]), new p(
		573    ,"Cinccino"  ,"Normal"  ,"None"    ,470,75 ,95 ,60 ,65 ,60 ,115,5,false,        ,0     , [1,10]), new p(
		574    ,"Gothita"   ,"Psychic" ,"None"    ,290,45 ,30 ,50 ,55 ,65 ,45 ,5,false,        ,0     , [1,10]), new p(
		575    ,"Gothorita" ,"Psychic" ,"None"    ,390,60 ,45 ,70 ,75 ,85 ,55 ,5,false,        ,0     , [1,10]), new p(
		576    ,"Gothitelle","Psychic" ,"None"    ,490,70 ,55 ,95 ,95 ,110,65 ,5,false,        ,0     , [1,10]), new p(
		577    ,"Solosis"   ,"Psychic" ,"None"    ,290,45 ,30 ,40 ,105,50 ,20 ,5,false,        ,0     , [1,10]), new p(
		578    ,"Duosion"   ,"Psychic" ,"None"    ,370,65 ,40 ,50 ,125,60 ,30 ,5,false,        ,0     , [1,10]), new p(
		579    ,"Reuniclus" ,"Psychic" ,"None"    ,490,110,65 ,75 ,125,85 ,30 ,5,false,        ,0     , [1,10]), new p(
		580    ,"Ducklett"  ,"Water"   ,"Flying"  ,305,62 ,44 ,50 ,44 ,50 ,55 ,5,false,        ,0     , [1,10]), new p(
		581    ,"Swanna"    ,"Water"   ,"Flying"  ,473,75 ,87 ,63 ,87 ,63 ,98 ,5,false,        ,0     , [1,10]), new p(
		582    ,"Vanillite" ,"Ice"     ,"None"    ,305,36 ,50 ,50 ,65 ,60 ,44 ,5,false,        ,0     , [1,10]), new p(
		583    ,"Vanillish" ,"Ice"     ,"None"    ,395,51 ,65 ,65 ,80 ,75 ,59 ,5,false,        ,0     , [1,10]), new p(
		584    ,"Vanilluxe" ,"Ice"     ,"None"    ,535,71 ,95 ,85 ,110,95 ,79 ,5,false,        ,0     , [1,10]), new p(
		585    ,"Deerling"  ,"Normal"  ,"Grass"   ,335,60 ,60 ,50 ,40 ,50 ,75 ,5,false,        ,0     , [1,10]), new p(
		586    ,"Sawsbuck"  ,"Normal"  ,"Grass"   ,475,80 ,100,70 ,60 ,70 ,95 ,5,false,        ,0     , [1,10]), new p(
		587    ,"Emolga"    ,"Electric","Flying"  ,428,55 ,75 ,60 ,75 ,60 ,103,5,false,        ,0     , [1,10]), new p(
		588    ,"Karrablast","Bug"     ,"None"    ,315,50 ,75 ,45 ,40 ,45 ,60 ,5,false,        ,0     , [1,10]), new p(
		589    ,"Escavalier","Bug"     ,"Steel"   ,495,70 ,135,105,60 ,105,20 ,5,false,        ,0     , [1,10]), new p(
		590    ,"Foongus"   ,"Grass"   ,"Poison"  ,294,69 ,55 ,45 ,55 ,55 ,15 ,5,false,        ,0     , [1,10]), new p(
		591    ,"Amoonguss" ,"Grass"   ,"Poison"  ,464,114,85 ,70 ,85 ,80 ,30 ,5,false,        ,0     , [1,10]), new p(
		592    ,"Frillish"  ,"Water"   ,"Ghost"   ,335,55 ,40 ,50 ,65 ,85 ,40 ,5,false,        ,0     , [1,10]), new p(
		593    ,"Jellicent" ,"Water"   ,"Ghost"   ,480,100,60 ,70 ,85 ,105,60 ,5,false,        ,0     , [1,10]), new p(
		594    ,"Alomomola" ,"Water"   ,"None"    ,470,165,75 ,80 ,40 ,45 ,65 ,5,false,        ,0     , [1,10]), new p(
		595    ,"Joltik"    ,"Bug"     ,"Electric",319,50 ,47 ,50 ,57 ,50 ,65 ,5,false,        ,0     , [1,10]), new p(
		596    ,"Galvantula","Bug"     ,"Electric",472,70 ,77 ,60 ,97 ,60 ,108,5,false,        ,0     , [1,10]), new p(
		597    ,"Ferroseed" ,"Grass"   ,"Steel"   ,305,44 ,50 ,91 ,24 ,86 ,10 ,5,false,        ,0     , [1,10]), new p(
		598    ,"Ferrothorn","Grass"   ,"Steel"   ,489,74 ,94 ,131,54 ,116,20 ,5,false,        ,0     , [1,10]), new p(
		599    ,"Klink"     ,"Steel"   ,"None"    ,300,40 ,55 ,70 ,45 ,60 ,30 ,5,false,        ,0     , [1,10]), new p(
		600    ,"Klang"     ,"Steel"   ,"None"    ,440,60 ,80 ,95 ,70 ,85 ,50 ,5,false,        ,0     , [1,10]), new p(
		601    ,"Klinklang" ,"Steel"   ,"None"    ,520,60 ,100,115,70 ,85 ,90 ,5,false,        ,0     , [1,10]), new p(
		602    ,"Tynamo"    ,"Electric","None"    ,275,35 ,55 ,40 ,45 ,40 ,60 ,5,false,        ,0     , [1,10]), new p(
		603    ,"Eelektrik" ,"Electric","None"    ,405,65 ,85 ,70 ,75 ,70 ,40 ,5,false,        ,0     , [1,10]), new p(
		604    ,"Eelektross","Electric","None"    ,515,85 ,115,80 ,105,80 ,50 ,5,false,        ,0     , [1,10]), new p(
		605    ,"Elgyem"    ,"Psychic" ,"None"    ,335,55 ,55 ,55 ,85 ,55 ,30 ,5,false,        ,0     , [1,10]), new p(
		606    ,"Beheeyem"  ,"Psychic" ,"None"    ,485,75 ,75 ,75 ,125,95 ,40 ,5,false,        ,0     , [1,10]), new p(
		607    ,"Litwick"   ,"Ghost"   ,"Fire"    ,275,50 ,30 ,55 ,65 ,55 ,20 ,5,false,        ,0     , [1,10]), new p(
		608    ,"Lampent"   ,"Ghost"   ,"Fire"    ,370,60 ,40 ,60 ,95 ,60 ,55 ,5,false,        ,0     , [1,10]), new p(
		609    ,"Chandelure","Ghost"   ,"Fire"    ,520,60 ,55 ,90 ,145,90 ,80 ,5,false,        ,0     , [1,10]), new p(
		610    ,"Axew"      ,"Dragon"  ,"None"    ,320,46 ,87 ,60 ,30 ,40 ,57 ,5,false,        ,0     , [1,10]), new p(
		611    ,"Fraxure"   ,"Dragon"  ,"None"    ,410,66 ,117,70 ,40 ,50 ,67 ,5,false,        ,0     , [1,10]), new p(
		612    ,"Haxorus"   ,"Dragon"  ,"None"    ,540,76 ,147,90 ,60 ,70 ,97 ,5,false,        ,0     , [1,10]), new p(
		613    ,"Cubchoo"   ,"Ice"     ,"None"    ,305,55 ,70 ,40 ,60 ,40 ,40 ,5,false,        ,0     , [1,10]), new p(
		614    ,"Beartic"   ,"Ice"     ,"None"    ,485,95 ,110,80 ,70 ,80 ,50 ,5,false,        ,0     , [1,10]), new p(
		615    ,"Cryogonal" ,"Ice"     ,"None"    ,485,70 ,50 ,30 ,95 ,135,105,5,false,        ,0     , [1,10]), new p(
		616    ,"Shelmet"   ,"Bug"     ,"None"    ,305,50 ,40 ,85 ,40 ,65 ,25 ,5,false,        ,0     , [1,10]), new p(
		617    ,"Accelgor"  ,"Bug"     ,"None"    ,495,80 ,70 ,40 ,100,60 ,145,5,false,        ,0     , [1,10]), new p(
		618    ,"Stunfisk"  ,"Ground"  ,"Electric",471,109,66 ,84 ,81 ,99 ,32 ,5,false,        ,0     , [1,10]), new p(
		619    ,"Mienfoo"   ,"Fighting","None"    ,350,45 ,85 ,50 ,55 ,50 ,65 ,5,false,        ,0     , [1,10]), new p(
		620    ,"Mienshao"  ,"Fighting","None"    ,510,65 ,125,60 ,95 ,60 ,105,5,false,        ,0     , [1,10]), new p(
		621    ,"Druddigon" ,"Dragon"  ,"None"    ,485,77 ,120,90 ,60 ,90 ,48 ,5,false,        ,0     , [1,10]), new p(
		622    ,"Golett"    ,"Ground"  ,"Ghost"   ,303,59 ,74 ,50 ,35 ,50 ,35 ,5,false,        ,0     , [1,10]), new p(
		623    ,"Golurk"    ,"Ground"  ,"Ghost"   ,483,89 ,124,80 ,55 ,80 ,55 ,5,false,        ,0     , [1,10]), new p(
		624    ,"Pawniard"  ,"Dark"    ,"Steel"   ,340,45 ,85 ,70 ,40 ,40 ,60 ,5,false,        ,0     , [1,10]), new p(
		625    ,"Bisharp"   ,"Dark"    ,"Steel"   ,490,65 ,125,100,60 ,70 ,70 ,5,false,        ,0     , [1,10]), new p(
		626    ,"Bouffalant","Normal"  ,"None"    ,490,95 ,110,95 ,40 ,95 ,55 ,5,false,        ,0     , [1,10]), new p(
		627    ,"Rufflet"   ,"Normal"  ,"Flying"  ,350,70 ,83 ,50 ,37 ,50 ,60 ,5,false,        ,0     , [1,10]), new p(
		628    ,"Braviary"  ,"Normal"  ,"Flying"  ,510,100,123,75 ,57 ,75 ,80 ,5,false,        ,0     , [1,10]), new p(
		629    ,"Vullaby"   ,"Dark"    ,"Flying"  ,370,70 ,55 ,75 ,45 ,65 ,60 ,5,false,        ,0     , [1,10]), new p(
		630    ,"Mandibuzz" ,"Dark"    ,"Flying"  ,510,110,65 ,105,55 ,95 ,80 ,5,false,        ,0     , [1,10]), new p(
		631    ,"Heatmor"   ,"Fire"    ,"None"    ,484,85 ,97 ,66 ,105,66 ,65 ,5,false,        ,0     , [1,10]), new p(
		632    ,"Durant"    ,"Bug"     ,"Steel"   ,484,58 ,109,112,48 ,48 ,109,5,false,        ,0     , [1,10]), new p(
		633    ,"Deino"     ,"Dark"    ,"Dragon"  ,300,52 ,65 ,50 ,45 ,50 ,38 ,5,false,        ,0     , [1,10]), new p(
		634    ,"Zweilous"  ,"Dark"    ,"Dragon"  ,420,72 ,85 ,70 ,65 ,70 ,58 ,5,false,        ,0     , [1,10]), new p(
		635    ,"Hydreigon" ,"Dark"    ,"Dragon"  ,600,92 ,105,90 ,125,90 ,98 ,5,false,        ,0     , [1,10]), new p(
		636    ,"Larvesta"  ,"Bug"     ,"Fire"    ,360,55 ,85 ,55 ,50 ,55 ,60 ,5,false,        ,0     , [1,10]), new p(
		637    ,"Volcarona" ,"Bug"     ,"Fire"    ,550,85 ,60 ,65 ,135,105,100,5,false,        ,0     , [1,10]), new p(
		638    ,"Cobalion"  ,"Steel"   ,"Fighting",580,91 ,90 ,129,90 ,72 ,108,5,true ,        ,0     , [1,10]), new p(
		639    ,"Terrakion" ,"Rock"    ,"Fighting",580,91 ,129,90 ,72 ,90 ,108,5,true ,        ,0     , [1,10]), new p(
		640    ,"Virizion"  ,"Grass"   ,"Fighting",580,91 ,90 ,72 ,90 ,129,108,5,true ,        ,0     , [1,10]), new p(
		641    ,"Tornadus"  ,"Flying"  ,"None"    ,580,79 ,115,70 ,125,80 ,111,5,true ,        ,0     , [1,10]), new p(
		642    ,"Thundurus" ,"Electric","Flying"  ,580,79 ,115,70 ,125,80 ,111,5,true ,        ,0     , [1,10]), new p(
		643    ,"Reshiram"  ,"Dragon"  ,"Fire"    ,680,100,120,100,150,120,90 ,5,true ,        ,0     , [1,10]), new p(
		644    ,"Zekrom"    ,"Dragon"  ,"Electric",680,100,150,120,120,100,90 ,5,true ,        ,0     , [1,10]), new p(
		645    ,"Landorus"  ,"Ground"  ,"Flying"  ,600,89 ,125,90 ,115,80 ,101,5,true ,        ,0     , [1,10]), new p(
		646    ,"Kyurem"    ,"Dragon"  ,"Ice"     ,660,125,130,90 ,130,90 ,95 ,5,true ,        ,0     , [1,10]), new p(
		647    ,"Keldeo"    ,"Water"   ,"Fighting",580,91 ,72 ,90 ,129,90 ,108,5,false,        ,0     , [1,10]), new p(
		648    ,"Meloetta"  ,"Normal"  ,"Psychic" ,600,100,77 ,77 ,128,128,90 ,5,false,        ,0     , [1,10]), new p(
		649    ,"Genesect"  ,"Bug"     ,"Steel"   ,600,71 ,120,95 ,120,95 ,99 ,5,false,        ,0)*/
	]