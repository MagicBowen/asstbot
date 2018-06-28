# Asstbot

## msg from client

```js
const textMsg = {
    from : {
        id : 'xxxxx'
    },
    type : 'text',
    data : {
        query : 'hello'
    }
};

const imageMsg = {
    from : {
        id : 'xxxxx'
    },
    type : 'image',
    data : {
        url : 'http://localhost:8000/test.jpg',
        indicator : 'profile'
    }
};

const loginMsg = {
    from : {
        id : 'xxxxx'
    },
    type : 'login',
    data : {
        code : '12345'
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
    type : 'text',
    reply: '你好，主人'
}

{
    type : 'radio',
    title : '您是男的还是女的呢？',  // optional
    items : [
        { caption : '男', 
          value : '我是男的'  // optional
        },
        { caption : '女', 
          value : '我是女的' // optional
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
    type : 'imageUploader',
    title: '请上传您的背景图', // optional
    indicator : 'profile',
    explicit  : false // optional
}

{
    type : 'numberList',
    title : '请选择名次：',  // optional
    min   : 0,
    max   : 100,
    prefix: '第',  // optional
    postfix: '名',  // optional
    chinese: true, // optional
}

```

## Survey

```json
{
    "survey" : {
    	"userId" : "bowen",
    	"type"   : "exam",
    	"title"  : "看看你有多了解我？",
    	"subjects" : [
    		{ 
    			"id" : 1,
    			"type" : "single-choice",
    			"question" : "我是哪个星座的？",
    			"answers" : [
    				{
    					"value" : "白羊座",
    					"correct" : true
    				},
    				{
    					"value" : "金牛座"
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
    			"type" : "multiple-choice",
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
    			"question" : "用一个词语形容以下我吧"
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
    			"text" : "你对我的了解让我吃惊，你绝对是我的好基友！"
    		}
    	]
    }
}
```