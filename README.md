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
        Indicator : 'profile'
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
    title : '头像',
    url : data.url,
    width : 150, // optional
    height: 100 // optional
}

{
    type : 'imageUploader',
    title: '请上传您的背景图', // optional
    Indicator : 'profile',
    explicit  : false // optional
}

{
    type : 'numberList',
    title : '你是第几名？',  // optional
    min   : 0,
    max   : 100,
    prefix: '第',  // optional
    prefix: '名',  // optional
    chinese: true, // optional
}

```