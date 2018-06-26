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
        url : 'http://localhost:8000/test.jpg'
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
const textMsg = {
    to : {
        id : userId
    },
    type : 'text',
    data : {
        replies : ['你好，主人', '感谢领养我哦']
    }
};
        
const radioMsg = {
    to : {
        id : userId
    },
    type : 'radio',
    data : {
        title : '请选择你的性别：',
        items : [
            {caption : '男', value : '我是男的'},
            {caption : '女', value : '我是女的'},
        ]
    }
};

const numberListMsg = {
    to : {
        id : userId
    },
    type : 'numberList',
    data : {
        title : '请选择你的名词',
        min : 1,
        max : 70,
        prefix : '第',
        postfix: '名',
        toChinese: true
    }    
}

const imageMsg = {
    to : {
        id : userId
    },
    type : 'image',
    data : {
        title : '图片',
        url : 'http://localhost:8000/test.jpg',
        width : 150,
        height: 100
    }
};
```