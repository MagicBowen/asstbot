# Asstbot

## msg from client

```js

const loginMsg = {
    from : {
        id : 'xxxxx'
    },
    type : 'login',
    data : {
		code : '12345', // optional
		isNew: true   // optional, 是否新注册用户
    }
};

const dialogStartMsg = {
    from : {
        id : 'xxxxx'
    },
    type : 'dialog-start',
    data : {
		scene : '',     // test | publish | other...
		surveyId : ''
    }
};

const textMsg = {
    from : {
        id : 'xxxxx'
    },
    type : 'text',
    data : {
		query : 'hello',
    }
};

const speechMsg = {
    from : {
        id : 'xxxxx'
    },
    type : 'speech',
    data : {
		url : 'http://localhost:8000/audio/hello.mp3',
		asr : 'hello'
    }
};

const radioReply = {
    from : {
        id : 'xxxxx'
    },
    type : 'radio-reply',
    data : {
		value : '白羊座',
		indicator : 'index-0', // optional
		event : 'deal-radio-reply' // optional
    }	
};

const eventReply = {
    from : {
        id : 'xxxxx'
    },
    type : 'event',
    data : {
		name : 'eventName'
    }	
}

const checkboxReply = {
    from : {
        id : 'xxxxx'
    },
    type : 'checkbox-reply',
    data : {
		items : [
			{
				value : '凉面',
				indicator : 'index-0' // optional
			},
			{
				value : '米饭',
				indicator : 'index-1' // optional
			}			
		],
		event : 'deal-checkbox-reply' // optional
    }	
};

const imageMsg = {
    from : {
        id : 'xxxxx'
    },
    type : 'image',
    data : {
        url : 'http://localhost:8000/test.jpg',
        indicator : 'profile' // optional
    }
};

const audioMsg = {
    from : {
        id : 'xxxxx'
    },
    type : 'audio',
    data : {
		url : 'http://localhost:8000/audio/test.mp3',
		indicator : 'music' // optional
    }
};

const vedioMsg = {
    from : {
        id : 'xxxxx'
    },
    type : 'vedio',
    data : {
		url : 'http://localhost:8000/audio/test.mp4',
		indicator : 'film' // optional
    }
};

const dateMsg = {
	from : {
		id : 'xxxxx'
	},
	type : 'date',
	data : {
		year : "2018",
		month: "7",
		day: "23",
		indicator : 'birthday',  // optional
	}
};
```

### msg to client

```js
const reply = {
    to : {
        id : userId
    },
    msgs : [
        // msg defined in below
    ]    
}
```

```js
// msgs

{
    type   : 'text',
	reply  : '你好，主人',
	tts    : 'tts/i7fb23rftc09234mphklf89.mp3'
}

{
	type   : 'tts',
	tts    : 'tts/i7fb23rftc09234mphklf89.mp3'
}

{
    type   : 'html',
	body   : '<h4>语文</h4><li>时间：9：00 ~ 10：00</li><li>地点：文津楼</li><li>老师：王文</li>',
	style  : 'h4 {color:red; font-size:14px;} li {color:black; font-size:12px;}'
}

{
    type   : 'page-list',
	pages  : [
		{
			type   : 'html',
            body  : '<h4>语文</h4><li>时间：9：00 ~ 10：00</li><li>地点：文津楼</li><li>老师：王文</li>'
		},
		{
			type   : 'html',
            body  : '<h4>数学</h4><li>时间：10：00 ~ 11：00</li><li>地点：科苑楼</li><li>老师：张锋</li>'
		}
	]
}

{
	type   : 'event-reply',
	action : '', // mute | update
	data   : {
	}
}

{
	type   : 'button-list',
	once   : true, // optional
	reflex : false, // optional
	title  : '', // optional
	imageUrl: '', // optional
	items  : [
		{
			caption : '👍',
			value   : '赞',
			event   : 'right',
			data    : {
			}
		},
		{
			caption : '👎',
			value   : '批',
			event   : 'wrong',
			data    : {
			}
		}
	]
}

{
	type  : 'exhibition',
	items : [
		{
			caption : '选项1',
			imageUrl: 'http://localhost/image/item1.png',
			indicator: 'abcdef1'
		},
		{
			caption : '选项2',
			imageUrl: 'http://localhost/image/item2.png',
			indicator: 'abcdef2'
		}
	],
	actions : [
		{
			caption : '编辑',
			event   : 'edit-item',
			data    : {
			}
		},
		{
			caption : '显示',
			event   : 'show-item',
			data    : {
			}
		},
		{
			caption : '删除',
			event   : 'delete-item',
			data    : {
			}
		}
	]
}

{
    type : 'radio',
	title : '请选择：',  // optional
    items : [
		{ caption  : '男', 
		  value    : '我是男的', // optional
		  imageUrl : 'http://localhost/image/icon1.png', // optional
		  indicator: 'index-0', // optional
		  event    : 'deal-male-selection' // optional
        },
		{ caption  : '女',
		  value    : '我是女的', // optional
		  imageUrl : 'http://localhost/image/icon2.png', // optional
		  indicator: 'index-1', // optional
		  event    : 'deal-female-selection' // optional
		},
		{ caption  : '分享到群',
		  value    : '分享到群', // optional
		  imageUrl : 'http://localhost/image/icon3.png', // optional
		  indicator: 'index-2', // optional
		  event    : 'share-to-group', // optional
		  type     : 'share' // optional
        }		
    ]
}

{
    type  : 'checkbox',
	title : '请选择：',  // optional
	event : 'deal-food-selection', // optional
    items : [
		{ caption : '水饺',
		  imageUrl : 'http://localhost/image/icon0.png', // optional
		  indicator: 'index-0' // optional		
		},
		{ caption : '牛排',
		  imageUrl : 'http://localhost/image/icon1.png', // optional
		  indicator: 'index-1' // optional		
		},
		{ caption : '沙拉',
		  imageUrl : 'http://localhost/image/icon2.png', // optional
		  indicator: 'index-2' // optional		
		},
		{ caption : '披萨',
		  imageUrl : 'http://localhost/image/icon3.png', // optional
		  indicator: 'index-3' // optional		
		},
		{ caption : '凉皮',
		  imageUrl : 'http://localhost/image/icon4.png', // optional
		  indicator: 'index-4' // optional		
		}
    ]
}

{
    type : 'image',
    title : '头像', // optional
    url : 'http://localhost:8000/test.jpg',
    width : 150, // optional
    height: 100 // optional
}

{
    type : 'image-uploader',
    title: '请上传您的背景图', // optional
    indicator : 'profile',
	 once  : false  : false // optional
	 : false,
}

{
    type : 'audio-uploader',
    title: '请上传您的音乐', // optional
    indicator : 'music',
    explicit  : false // optional
}

{
    type : 'vedio-uploader',
    title: '请上传您的视频', // optional
    indicator : 'film',
    explicit  : false // optional
}

{
    type : 'number-list',
    title : '请选择名次：',  // optional
    min   : 0,
    max   : 100,
    prefix: '第',  // optional
    postfix: '名',  // optional
    chinese: true, // optional
}

{
	type : 'date-picker',
	indicator : 'birthday',
	explicit  : false // optional
}

{
	type : 'redirect',
	url  : 'pages/index/index',  // self defined protocal
	option : {
		id : 'xxxxx'
	},
	explicit : false
}

{
	type : 'input-prompt',
	prompt   : '请输入简介',
	keyboard : 'text', // text | number
	length   : 100     // optional
	explicit : true // optional
}

{
	type : 'divider',
	style: 'timer'
}

{
	type : 'dialog-end'
}
```

## Survey

目前支持配置以下类型机器人：

- inquiry ： 调查问卷机器人
- poll ： 投票机器人
- exam ： 答卷机器人
- quiz ： 跳转测验机器人

survey中的`type`字段为上述其一；

### exam

```json
{
    "survey" : {
    	"userId" : "bowen",
    	"type"   : "exam",
		"title"  : "看看你有多了解我？",
		"intro"  : "Hello, 好朋友们，回答下面的问题，来看看你们有多了解我吧",
		"avatarUrl" : "http://localhost:8000/profile.jpg",
    	"subjects" : [
    		{
    			"id" : 1,
    			"type" : "radio",
				"question" : "我是哪个星座的？",
				"imageUrl" : "http://www.xiaodamp.cn/image/constellation.png",
    			"answers" : [
    				{
    					"value" : "白羊座",
                        "imageUrl" : "http://www.xiaodamp.cn/image/baiyang.png",
    					"correct" : true
    				},
    				{
    					"value" : "金牛座",
                        "imageUrl" : "http://www.xiaodamp.cn/image/jinniu.png",
    				},
    				{
    					"value" : "处女座"
    				},
    				{
    					"value" : "射手座"
    				}     				
    			]
    		},
    		{
    			"id" : 2,
    			"type" : "checkbox",
    			"question" : "我喜欢吃以下哪些东西？",
    			"answers" : [
    				{
    					"value" : "油泼面",
    					"correct" : false
    				},
    				{
    					"value" : "牛排",
    					"correct" : true
    				},
    				{
    					"value" : "沙拉",
    					"correct" : true
    				},
    				{
    					"value" : "水饺",
    					"correct" : false
    				}     				
    			]
    		
    		},
    		{ 
    			"id" : 3,
    			"type" : "text",
				"question" : "用一个词语形容一下我吧",
    			"answers" : [
    				{
    					"value" : "天真"
					},
    				{
    					"value" : "幼稚"
					}
				]				
			},
			{
				"id" : 4,
				"type" : "date",
				"nlu" : true,
				"question" : "说说我的生日吧？",
				"answers" : [
					{
						"value" : "2018-07-10"   // yyyy-mm-dd
					}
				]
			}
    	],
    	"conclusions" : [
    		{
    			"scoreRange" : {
    				"min" : 0,
    				"max" : 2
    			},
    			"text" : "看来你对我还不是很了解啊，可能我是发错人了吧~"
    		},
    		{
    			"scoreRange" : {
    				"min" : 2,
    				"max" : 4
    			},
				"text" : "你对我的了解让我吃惊，你绝对是我的好基友！",
				"imageUrl" : "http://localhost:8000/praise.png"
    		}
    	]
    }
}
```

### exam result

```json
{
	"surveyResult" : {
		"surveyId" : "survey-652ea4d0-7dad-11e8-abe8-abb0bd666421",
		"responder": {
			"userId" : "xxxxxxx",
			"nickName" : "xiaowei",
			"avatarUrl": "http://localhost:8000/profile.png"
		},
		"answers"  : [
			{
				"id"    : 1,
				"result": [ {"value" : "白羊座", "correct" : true} ]
			},
			{
				"id"    : 2,
				"result": [ {"value" : "油泼面", "correct" : false}, {"value" : "牛排", "correct" : true} ]
			},
			{
				"id"    : 3,
				"result": [ {"value" : "天真", "correct" : true} ]
			},
			{
				"id"    : 4,
				"result": [ {"value" : "1983-1-27", "correct" : true} ]
			}		
		],
		"score"    : 3
	}
}
```

### inquiry

```json
{
    "survey" : {
    	"userId" : "bowen",
    	"type"   : "inquiry",
		"title"  : "你希望公司为员工提供哪些福利？",
		"intro"  : "公司为大家做福利计划，快来回答你希望公司提供的福利内容吧",
		"avatarUrl" : "http://localhost:8000/profile.jpg",
    	"subjects" : [
    		{ 
    			"id" : 1,
    			"type" : "radio",
    			"question" : "你来公司多久了？",
    			"answers" : [
    				{
    					"value" : "少于1年"
    				},
    				{
    					"value" : "1到3年"
    				},
    				{
    					"value" : "3到5年"
    				},
    				{
    					"value" : "5年以上"
    				}     				
    			]
    		
    		},
    		{ 
    			"id" : 2,
    			"type" : "checkbox",
    			"question" : "以下哪些方面的福利改进，你觉得会提升公司竞争力",
    			"answers" : [
    				{
    					"value" : "零食"
    				},
    				{
    					"value" : "活动"
    				},
    				{
    					"value" : "奖励"
    				},
    				{
    					"value" : "保险"
    				}     				
    			]
    		
    		},
    		{ 
    			"id" : 3,
    			"type" : "text",
				"question" : "说说你最希望公司提供的具体福利计划吧",
    			"answers" : []				
    		}
    	],
    	"conclusions" : [
    		{
				"text" : "感谢您的回复，我们会认真考虑您的建议！",
				"imageUrl" : "http://localhost:8000/result.png"
    		}
    	]
    }
}
```

### inquiry result

```json
{
	"surveyResult" : {
		"surveyId" : "survey-652ea4d0-7dad-11e8-abe8-abb0bd666421",
		"responder": {
			"userId" : "xxxxxxx",
			"nickName" : "xiaowei",
			"avatarUrl": "http://localhost:8000/profile.png"
		},
		"answers"  : [
			{
				"id"    : 1,
				"result": [ {"value" : "少于1年"} ]
			},
			{
				"id"    : 2,
				"result": [ {"value" : "零食"}, {"value" : "保险"} ]
			},
			{
				"id"    : 3,
				"result": [ {"value" : "我最希望公司能够提供住宿补贴"} ]
			}			
		]
	}
}
```

### poll

```json
{
    "survey" : {
    	"userId" : "bowen",
    	"type"   : "poll",
		"title"  : "公司秋游目的地投票",
		"intro"  : "公司组织秋游，快来选选你最想去哪里吧",
		"avatarUrl" : "http://localhost:8000/profile.jpg",
    	"subjects" : [
    		{ 
    			"id" : 1,
    			"type" : "single-choice",
    			"question" : "以下目的地你最想去哪里呢？",
    			"answers" : [
    				{
    					"value" : "张家界",
    				},
    				{
    					"value" : "莫干山"
    				},
    				{
    					"value" : "壶口瀑布"
    				},
    				{
    					"value" : "东方明珠"
    				}     				
    			]
    		
    		}
    	]
    }
}
```

### poll result

```json
{
	"surveyResult" : {
		"surveyId" : "survey-652ea4d0-7dad-11e8-abe8-abb0bd666421",
		"responder": {
			"userId" : "xxxxxxx",
			"nickName" : "xiaowei",
			"avatarUrl": "http://localhost:8000/profile.png"
		},
		"answers"  : [
			{
				"id"    : 1,
				"result": [ {"value" : "东方明珠"} ]
			}			
		]
	}
}
```

### branch-quiz

```json
{
    "survey" : {
    	"userId" : "bowen",
    	"type"   : "branch-quiz",
		"title"  : "心理预言",
		"intro"  : "好朋友们，来让我猜猜你想的是什么吧！",
		"avatarUrl" : "http://localhost:8000/profile.jpg",
    	"subjects" : [
    		{ 
    			"id" : 1,
    			"type" : "radio",
				"question" : "一副牌有四种花色：黑桃，红桃，梅花，方块，脑海中快速想一个你喜欢的花色。",
    			"answers" : [
    				{
    					"value" : "想好了",
    					"next" : 2
    				},
    				{
    					"value" : "没想好",
                        "next"  : 6
					}					 				
    			]
    		},
    		{ 
    			"id" : 2,
    			"type" : "radio",
    			"question" : "在1 ~ 9之间快速想一个数字。",
    			"answers" : [
    				{
						"value" : "想好了",
						"next"  : 3
    				},
    				{
						"value" : "没想好",
						"next"  : 6
    				}    				
    			]
    		
			},
    		{ 
    			"id" : 3,
    			"type" : "radio",
    			"question" : "现在脑海里将你想的花色和数字合并在一起，想着这张牌。",
    			"answers" : [
    				{
						"value" : "想好了",
						"next"  : 4
    				},
    				{
						"value" : "没想好",
						"next"  : 6
    				}    				
    			]
    		
    		},			
    		{ 
    			"id" : 4,
    			"type" : "",
    			"question" : "哈哈，你想的牌是红心7，对不对？？？",
    			"answers" : [
    				{
						"value" : "对的",
						"end"   : 1
    				},
    				{
						"value" : "不对",
						"next"  : 5
    				}    				
    			]
    		
    		},			
    		{
    			"id" : 5,
    			"type" : "text",
				"question" : "囧，告诉我你想的什么牌，我下次会进步的！",
    			"answers" : [
    				{
						"end"   : 3
					}
				]
			},
    		{
    			"id" : 6,
    			"type" : "radio",
				"question" : "要重新开始吗？",
    			"answers" : [
    				{
						"value" : "要",
						"next"  : 1
    				},
    				{
						"value" : "不要",
						"end"   : 2
    				}    				
    			]
    		}			
		],
    	"conclusions" : [
    		{
				"id"   : 1,
				"text" : "下面这张图送给你作为奖励！",
				"imageUrl" : "http://localhost:8000/heart-7.png"
			},
    		{
				"id"   : 2,
				"text" : "下次再来试试，会给你惊喜的！"
			},
    		{
				"id"   : 3,
				"text" : "感谢提供您的答案，我会继续改进的！"
			}		
    	]		
    }
}
```

### branch-quiz result

```json
{
	"surveyResult" : {
		"surveyId" : "survey-652ea4d0-7dad-11e8-abe8-abb0bd666421",
		"responder": {
			"userId" : "xxxxxxx",
			"nickName" : "xiaowei",
			"avatarUrl": "http://localhost:8000/profile.png"
		},
		"answers"  : [
			{
				"id"    : 1,
				"result": [ {"value" : "想好了"} ]
			},
			{
				"id"    : 2,
				"result": [ {"value" : "没想好"} ]
			},
			{
				"id"    : 6,
				"result": [ {"value" : "要"} ]
			},
			{
				"id"    : 1,
				"result": [ {"value" : "想好了"} ]
			},
			{
				"id"    : 2,
				"result": [ {"value" : "想好了"} ]
			},
			{
				"id"    : 3,
				"result": [ {"value" : "想好了"} ]
			},
			{
				"id"    : 4,
				"result": [ {"value" : "不对"} ]
			},
            {
				"id"    : 5,
				"result": [ {"value" : "黑桃2"} ]
			},			
		],
		"conclusion"    : 3
	}
}
```

### statistic

```js
{
	"surveyId" : "survey-652ea4d0-7dad-11e8-abe8-abb0bd666421",
	"subjects" : [
    		{ 
    			"id" : 1,
    			"answers" : [
    				{
						"value" : "少于1年",
						"count" : 5
    				},
    				{
						"value" : "1到3年",
						"count" : 10
    				},
    				{
						"value" : "3到5年",
						"count" : 0
    				},
    				{
						"value" : "5年以上",
						"count" : 2
    				}     				
    			]
    		
    		},
    		{ 
    			"id" : 2,
    			"answers" : [
    				{
						"value" : "零食",
						"count" : 0
    				},
    				{
						"value" : "活动",
						"count" : 1
    				},
    				{
						"value" : "奖励",
						"count" : 2
    				},
    				{
						"value" : "保险",
						"count" : 7
    				}     				
    			]
    		
    		}
    	]	
}
```

## qrcode

### node-canvas install

```bash
// ubuntu: 
sudo apt-get install libcairo2-dev libjpeg-dev libpango1.0-dev libgif-dev build-essential g++

// mac: 
brew install pkg-config cairo pango libpng jpeg giflib
```

```bash
npm install canvas
```

## ffmpeg

```bash
//mac
brew install ffmpeg

// ubuntu
sudo apt-get install ffmpeg
```

```bash
npm install fluent-ffmpeg
```

## restart mongodb

```bash
sudo mongod --dbpath /var/lib/mongodb/ --logpath /var/log/mongodb/mongod.log --logappend  -fork -port 27017
```


## 听写添加接口
### 添加词语列表
* 请求方式

``` post http://localhost/dictateWords```

* 参数

```json
{"openId"    : "oNijH5e8sdGfry-3tQWVN3SgskB0",
 "dictateWords": {
 	"title": "语文第二课",
	"active": false,
	"playWay" : "order", //disorder
	"playTimes" : 1,
	"intervel" : 5, //间隔
	"words": [
	{ "term": "波浪", "pinyin": "bolang"},
	{ "term": "浪花","pinyin": "langhua"},
	{ "term": "海浪","pinyin": "hailang"},
	{ "term": "灯光","pinyin": "dangguang"},
	{ "term": "电灯","pinyin": "diandeng"},
	{ "term": "作文","pinyin": "zuowen"},
	{ "term": "工作","pinyin": "gongzuo"}
	]
 }
}
```
* 返回值

```json
{
    "result": "success",
    "id": "52330249"
}
```

### 更新词语列表
* 请求方式

``` put http://localhost/dictateWords```

* 参数

```json
{"id"    : "52115059",
 "dictateWords": {
 	"title": "语文第二课",
	"active": false,
	"playWay" : "order", //disorder
	"playTimes" : 1,
	"intervel" : 5, //间隔
	"words": [
	{ "term": "波浪", "pinyin": "bolang"},
	{ "term": "浪花","pinyin": "langhua"},
	{ "term": "海浪","pinyin": "hailang"},
	{ "term": "灯光","pinyin": "dangguang"},
	{ "term": "电灯","pinyin": "diandeng"},
	{ "term": "作文","pinyin": "zuowen"},
	{ "term": "工作","pinyin": "gongzuo"}
	]
 }
}
```

* 返回值

```json
{
    "result": "success",
    "id": "52330249"
}
```

### 删除词语列表
* 请求方式

``` delete http://localhost/dictateWords?id=52115059```

* 返回值
```json
{
    "result": "success",
    "id": "52330249"
}
```

### 查询所有的词语列表
* 请求方式

``` get http://localhost/dictateWords?openId=oNijH5e8sdGfry-3tQWVN3SgskB0```

* 返回值
```json
{
    "result": "success",
    "data": [
        {
            "title": "语文第一课",
            "active": false,
            "words": [
                { "term": "波浪", "pinyin": "bolang"},
                { "term": "浪花","pinyin": "langhua"},
                { "term": "海浪","pinyin": "hailang"},
                { "term": "灯光","pinyin": "dangguang"},
                { "term": "电灯","pinyin": "diandeng"},
                { "term": "作文","pinyin": "zuowen"},
                { "term": "工作","pinyin": "gongzuo"}
            ],
            "darwinId": "weixin_oESUr5Arz8hmqlkTJjmrR_539Pz8",
            "createTime": "2018-10-23",
            "updateTime": "2018-10-23",
            "id": "52330249"
        },
        {
            "darwinId": "weixin_oESUr5Arz8hmqlkTJjmrR_539Pz8",
            "active": true,
            "words": [
                { "term": "波浪", "pinyin": "bolang"},
                { "term": "浪花","pinyin": "langhua"},
                { "term": "海浪","pinyin": "hailang"},
                { "term": "灯光","pinyin": "dangguang"},
                { "term": "电灯","pinyin": "diandeng"},
                { "term": "作文","pinyin": "zuowen"},
                { "term": "工作","pinyin": "gongzuo"}
            ],
            "id": "52086497"
        }
    ]
}
```


##绑定用户接口
### 绑定新用户

* 请求方式

``` post http://localhost/binding```

* 参数

```json
{"openId"    : "oNijH5e8sdGfry-3tQWVN3SgskB0",
 "bindingCode": 70364
}
```

* 返回值

```json
{
    "result": "success",
    "state": true
}
```

###查询绑定的设备

* 请求方式

``` get http://localhost/binding?openid=oNijH5e8sdGfry-3tQWVN3SgskB0```

* 返回值

```json
{
    "result": "success",
    "bindingTypes": [
        "小米",
        "百度"
    ]
}
```


###查询拼音

* 请求方式

```get http://localhost/pinyin?sentence=子弹```

* 返回值

```json
{
    "result": "success",
    "data": [
        [
            "zǐ"
        ],
        [
            "dàn",
            "tán"
        ]
    ]
}
```

###查询积分
* 请求方式

```get http://localHost/integral?id=oNijH5dOWOgyvX75lpVubHqWILOk```


* 返回值
```json
{
    "result": "success",
    "data": {
        "totalScore": 1000,
        "usedScore": 600,
        "remainScore": 400,
        "drawTimes": 2
    }
}
```

###抽奖接口
* 请求方式
```post http://localhost/lukydraw```

* 参数
```json
{
	"id"    : "oNijH5e8sdGfry-3tQWVN3SgskB0"
}
```

* 返回值
```json
{
    "result": "success",
    "data": {
        "grand": 2
    }
}
```

###保存中奖联系方式
* 请求方式
```post http://localhost/asst/prizeuser```

* 参数
```json
{"id"    : "oNijH5dOWOgyvX75lpVubHqWILOk",
 "grand" : 2,
 "phone" : "18629022031"
}
```

* 返回值
```json
{
    "result": "success",
    "data": "58600843"
}
```

