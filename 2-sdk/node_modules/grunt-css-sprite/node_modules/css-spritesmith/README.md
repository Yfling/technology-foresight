# css-spritesmith

## 这是什么

这是一个帮助前端开发工程师将 css 代码中的切片合并成雪碧图的工具；
它的主要功能是：

1. 对 css 文件进行处理，收集切片序列，生成雪碧图
2. 在原css代码中为切片添加`background-position`属性
3. 生成用于高清设备的高清雪碧图，并在css文件末尾追加媒体查询代码
4. 生成高清设备雪碧图，使用 `image-set`
5. 支持选择器提取，进一步优化CSS文件大小
6. 在引用雪碧图的位置打上时间戳
7. 在样式末尾追加时间戳
8. 按照时间戳命名文件

## For Grunt & Gulp

[grunt-css-sprite](https://github.com/laoshu133/grunt-css-sprite)

[gulp-css-spritesmith](https://github.com/laoshu133/gulp-css-spritesmith)


## 基本用法

```
var cssSpriteSmith = require('css-spritesmith');

// use media query
var timeStamp = +new Date();
console.log('Start create sprite, with media query');

cssSpriteSmith({
    cssfile: 'css/icon.css',
    // sprite背景图源文件夹，只有匹配此路径才会处理，默认 images/slice/
    imagepath: 'slice/',
    // 替换后的背景路径，默认 ../images/
    spritepath: '../images/',
    // 各图片间间距，如果设置为奇数，会强制+1以保证生成的2x图片为偶数宽高，默认 0
    padding: 2,
    // 是否使用 image-set 作为2x图片实现，默认不使用
    useimageset: false,
    // 是否以时间戳为文件名生成新的雪碧图文件，如果启用请注意清理之前生成的文件，默认不生成新文件
    newsprite: false,
    // 给雪碧图追加时间戳，默认不追加
    spritestamp: true,
    // 在CSS文件末尾追加时间戳，默认不追加
    cssstamp: true,
    // 默认使用二叉树最优排列算法
    algorithm: 'binary-tree',
    // 默认使用`pixelsmith`图像处理引擎
    engine: 'pixelsmith'
}, function(err, data) {
    // write css file
    var cssFile = 'publish/css/icon.sprite.css';
    fs.writeFileSync(cssFile, data.cssData);
    console.log(cssFile, 'write success!');

    // sprite image
    var srpiteFile = 'publish/images/icon.png';
    fs.writeFileSync(srpiteFile, data.spriteData.image, {
        encoding: 'binary'
    });
    console.log(srpiteFile, 'write success!');

    // retina sprite image
    var retinaSrpiteFile = 'publish/images/icon@2x.png';
    fs.writeFileSync(retinaSrpiteFile, data.retinaSpriteData.image, {
        encoding: 'binary'
    });
    console.log(retinaSrpiteFile, 'write success!');

    // timeStamp
    console.log('Create sprite success, with media query');
    console.log('Elapsed ', (+new Date()) - timeStamp, 'ms\n');
});
```


## 配置说明

```
// 自动雪碧图
options: {
    // css file
    cssfile: null,
    // 编码，默认 String|Null default = 'utf8'
    encoding: null,
    // sprite背景图源文件夹，只有匹配此路径才会处理，默认 images/slice/
    imagepath: 'images/slice/',
    // 映射CSS中背景路径，支持函数和数组，默认为 null
    imagepath_map: null,
    // 雪碧图输出目录，注意，会覆盖之前文件！默认 images/
    spritedest: 'images/',
    // 替换后的背景路径，默认 ../images/
    spritepath: '../images/',
    // 各图片间间距，如果设置为奇数，会强制+1以保证生成的2x图片为偶数宽高，默认 0
    padding: 0,
    // 是否使用 image-set 作为2x图片实现，默认不使用
    useimageset: false,
    // 是否以时间戳为文件名生成新的雪碧图文件，如果启用请注意清理之前生成的文件，默认不生成新文件
    newsprite: false,
    // 给雪碧图追加时间戳，默认不追加
    spritestamp: false,
    // 在CSS文件末尾追加时间戳，默认不追加
    cssstamp: false,
    // 默认使用二叉树最优排列算法
    algorithm: 'binary-tree',
    // 默认使用`pixelsmith`图像处理引擎
    engine: 'pixelsmith',

    // 扩展参数，不建议修改，image-set 模板，占位文件
    IMAGE_SET_CSS_TMPL: IMAGE_SET_CSS_TMPL,

    // 扩展参数，不建议修改， 配置模板
    MEDIA_QUERY_CSS_TMPL: MEDIA_QUERY_CSS_TMPL,
    CSS_DATA_TMPL: CSS_DATA_TMPL
}
```


## 特别注意

1. 生成后的雪碧图将以源 css 文件名来命名
2. 仅当CSS中定义`url(xxxx)`的路径匹配参数`imagepath`才进行处理，和具体`background`，`background-image`CSS无关，这里有区别于`grunt-sprite`
3. 理论上高清切片都应该是源切片尺寸的2倍，所以所有高清切片的尺寸宽和高都必须是偶数
4. 理论上所有的切片都应该是 `.png` 格式，`png8` `png24` 和 `png32`不限
5. `spritesmith` 默认只支持png格式，如果有其他格式需要，请参考 *可选依赖*

## 可选依赖

`gulp-css-spritesmith` 使用 [spritesmith](https://github.com/Ensighten/spritesmith) 作为内部核心实现

如果需要将图片处理引擎切换为`gm`或者其他引擎，请手动安装对应的依赖包。
举例 [Graphics Magick(gm)](http://www.graphicsmagick.org/) 依赖的安装流程：

* **Graphics Magick(gm)**

    * Mac
        // 安装GM图形库
        ```
        brew install GraphicsMagick
        npm install gmsmith
        ```

    * Windows
        前往官方网站[下载安装GM图形库](http://www.graphicsmagick.org/download.html)
        然后命令行执行：
        ```
        npm install gmsmith
        ```

## 版本记录

`0.0.1` 从 `grunt-css-sprite` 分离，为支持 `gulp` 做准备

`0.0.3` 修正多个选择器并列时丢失选择器 BUG

`0.0.4` 修正 IE8 遇到不支持伪类时，导致整个选择器失效


## 致谢

感谢 [spritesmith](https://github.com/Ensighten/spritesmith)

感谢 [Meters](https://github.com/hellometers)
