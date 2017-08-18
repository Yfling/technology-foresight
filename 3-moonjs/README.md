# 总结
---
为什么要写moon:在开发中注意到程序的性能问题
![为什么写Moon](https://github.com/Yfling/technology-foresight/blob/master/3-moonjs/img/DingTalk20170818150023.png?raw=true)

## 特性预览：
- ⚡️它使用虚拟DOM的版本，但是智能地标记静态节点并跳过它们，并且只更新已更改的DOM部分。
- 💎它提供了一个简单好用的API，非常类似于 Vue。完成指令，反应性DOM更新，计算属性等。
- 🎉只有6kb！
- 🔨它具有内置的组件系统，可以让您从不同的组件中组合UI。

## 文件大小
- Moon - 6kb
- Mithril - 8kb
- Vue - 25.86kb
- React + React DOM - 43kb
- Angular 2 - 111kb

## Benchmarks
Here are the DBMonster results (higher is better):
- Moon — 102 rerenders/second
- Preact — 85 rerenders/second
- Vue — 50 rerenders/second
- React — 50 rerenders/second
以下是TodoMVC实现的基准测试结果：
![](https://cdn-images-1.medium.com/max/1600/1*8jLYPzSkjd43BrCmTrYizA.png)

## Another library?(另一种框架)
Yes, there have been a lot of front end libraries released, and many people prefer different aspects about each of these libraries. For example, React provides the ability to use JSX and uses a virtual DOM, Angular provides easy to use directives, and Ember provides a nice templating engine built in.

Moon aims to combine all of the good features of these libraries into a single, lightweight package, while providing improved performance.

已经出现了很多前端库，许多人喜欢这些库的不同方面。
例如，React提供了使用JSX并使用虚拟DOM的能力，Angular提供了易于使用的指令，Ember提供了一个内置的优秀模板引擎。
Moon旨在将这些前端库的所有好的功能组合成一个单一的轻量级包，同时提供更好的性能。

## Reactive Data（响应式数据）
With Moon, all of your data is kept in sync with the DOM, while in React or JQuery, this was a tedious task that had to be done manually.

Moon, on the other hand, has a lightweight templating engine built in, it lets you interpolate data with a simple `{{mustache}}` template. You can uses these templates anywhere in your app, including attributes!

通过使用Moon，所有的数据与DOM保持同步，而在React或JQuery中，这是一个繁琐的工作，必须手动完成。
另一方面，Moon拥有内置的轻量级模板引擎，可以让您使用简单的{{mustache}}模板来插入数据。您可以在应用程序的任何位置使用这些模板，包括属性！
```
<div id="app1">
  <p style="color: {{color}}">Change my Color!</p>
</div>
```
```
const app1 = new Moon({
  el: "#app1",
  data: {
    color: "blue"
  }
});
```

## Async Queue（异步队列）

与vue的区别：

1. 数据的读写:
instance.get('dataName');
instance.set('dataName', 'newData'), newData可以是函数，也可以是固定的数据

2. 函数方法的调用

适用对象：
![适用对象](https://github.com/Yfling/technology-foresight/blob/master/3-moonjs/img/DingTalk20170818145704.png?raw=true)
