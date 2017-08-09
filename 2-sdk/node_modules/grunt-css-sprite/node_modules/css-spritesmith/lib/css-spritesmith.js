// Deps
var fs = require('fs');
var path = require('path');
var async = require('async');
var assert = require('assert');
var spritesmith = require('spritesmith');
var imageSetSpriteCreator = require('./imageSetSpriteCreator');

var CSS_DATA_TMPL = '\n\n/* {imgDest} */\n{selectors}{\n{cssProps}\n}\n';
var MEDIA_QUERY_CSS_TMPL = '\n\n/* {imgDest} */\n@media only screen and (-o-min-device-pixel-ratio: 3/2), only screen and (min--moz-device-pixel-ratio: 1.5), only screen and (-webkit-min-device-pixel-ratio: 1.5), only screen and (min-resolution: 240dpi), only screen and (min-resolution: 2dppx) {\n{cssText} \n}\n';
var IMAGE_SET_CSS_TMPL = 'background-image: -webkit-image-set(url({spriteImg}) 1x, url({retinaSpriteImg}) 2x); background-image: -moz-image-set(url({spriteImg}) 1x, url({retinaSpriteImg}) 2x); background-image: -ms-image-set(url({spriteImg}) 1x, url({retinaSpriteImg}) 2x); background-image: image-set(url({spriteImg}) 1x, url({retinaSpriteImg}) 2x);';

var defaultOptions = {
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
};


function fixPath(path) {
    return String(path).replace(/\\/g, '/').replace(/\/$/, '');
}

function fill(tmpl, data) {
    for(var k in data) {
        tmpl = tmpl.replace(new RegExp('\\{'+ k +'\\}', 'g'), data[k]);
    }

    return tmpl;
}

function escapeRegExp(str) {
    var rreEscape = /[-\/\\^$*+?.()|[\]{}]/g;

    return str.replace(rreEscape, '\\$&');
}

function createPlace() {
    if(!createPlace.id) {
        createPlace.id = 0;
    }

    var id = createPlace.id++;
    id = '!$sprite_place_'+ id +'$!';

    var pattern = new RegExp(escapeRegExp(id), 'g');
    return {
        id: id,
        pattern: pattern
    };
}

function filterNullFn(v) {
    return !!v;
}

function uniqueCssSelectors(selectors) {
    var str = selectors.filter(filterNullFn)
        .join(',');

    var selectorHash = {};
    var retSelectors = [];

    str.split(',').forEach(function(s) {
        s = s.trim();
        if(s && !selectorHash[s]) {
            selectorHash[s] = true;
            retSelectors.push(s);
        }
    });

    return retSelectors;
}

function getBgPosCss(x, y, ratio) {
    if(ratio && ratio > 1) {
        x /= ratio;
        y /= ratio;
    }

    var bgPos = ['-'+ x +'px', '-'+ y +'px'];
    if(x === 0) {
        bgPos[0] = 0;
    }
    if(y === 0) {
        bgPos[1] = 0;
    }

    return 'background-position: '+ bgPos.join(' ') +';';
}

function padNum(str, len) {
    var s = new Array(len + 1).join('0');

    return (s + str).slice(-len);
}

function getTimeStamp(date) {
    date = date || new Date();

    return [
        date.getFullYear(),
        padNum(date.getMonth() + 1, 2),
        padNum(date.getDate(), 2),
        padNum(date.getHours(), 2),
        padNum(date.getMinutes(), 2),
        padNum(date.getSeconds(), 2)
    ].join('');
}

function getSliceData(src, options) {
    var cssPath = path.resolve(path.dirname(src));
    var cssData = fs.readFileSync(src, {
        encoding: options.encoding
    })
    .toString();

    var rurlParams = /\?.*$/;
    var rabsUrl = /^(?:\/|https?:|file:)/i;
    var rbgs = /\bbackground(?:-image)?\s*:[^;]*?url\((["\']?)([^\)]+)\1\)[^};]*;?/ig;

    // ignore comments
    var commentsData = {};
    var commentRe = /\/\*[\s\S]*?\*\//g;
    cssData = cssData.replace(commentRe, function(a) {
        var place = createPlace();

        commentsData[place.id] = {
            place: place,
            data: a
        };

        return place.id;
    });

    var slicePathMap = options.imagepath_map;
    var slicePath = path.resolve(fixPath(options.imagepath));

    // parse css data
    var cssList = [], cssHash = {}, cssInx = -1;
    var imgList = [], imgHash = {}, imgInx = -1;

    cssData = cssData.replace(rbgs, function(css, b, uri) {
        var imgUri = uri;
        if(typeof slicePathMap === 'function') {
            imgUri = slicePathMap(imgUri);
        }

        // absolute path
        if(rabsUrl.test(imgUri)) {
            return css;
        }

        var imgFullPath = imgUri.replace(rurlParams, '');
        imgFullPath = fixPath(path.join(cssPath, imgFullPath));
        imgFullPath = path.normalize(imgFullPath);

        if(
            // low call file.exists
            !imgHash[imgFullPath] &&
            // match path
            (imgFullPath.indexOf(slicePath) !== 0 || !fs.existsSync(imgFullPath))
        ) {
            return css;
        }

        var place = createPlace();

        cssList[++cssInx] = {
            place: place,
            imgFullPath: imgFullPath,
            imgPath: uri,
            css: css
        };

        if(!imgHash[imgFullPath]) {
            imgList[++imgInx] = imgFullPath;
            imgHash[imgFullPath] = true;
        }

        return place.id;
    });

    return {
        commentsData: commentsData,
        cssData: cssData,
        cssList: cssList,
        cssHash: cssHash,
        imgList: imgList,
        imgHash: imgHash
    };
}

function createSprite(list, options, callback) {
    spritesmith({
        algorithm: options.algorithm,
        padding: options.padding,
        engine: options.engine,
        src: list
    }, callback);
}

function cssSpriteSmith(options, callback) {
    options = options || {};
    for(var k in defaultOptions) {
        if(options[k] === undefined) {
            options[k] = defaultOptions[k];
        }
    }

    // src
    var src = options.cssfile;

    assert(src, 'An `cssfile` parameter was not provided');
    assert(options.imagepath, 'An `imagepath` parameter was not provided');

    if(!fs.existsSync(src)) {
        throw new Error(src + ' not exists');
    }

    // `padding` must be even
    if(options.padding % 2 !== 0){
        options.padding += 1;
    }

    // imagepath map
    var _imagepath_map = options.imagepath_map;
    if(Array.isArray(options.imagepath_map)) {
        options.imagepath_map = function(uri) {
            return String(uri).replace(_imagepath_map[0], _imagepath_map[1]);
        };
    }


    var sliceData = getSliceData(src, options);
    var cssList = sliceData.cssList;

    if(!cssList || !cssList.length) {
        return callback(null, {
            cssData: null
        });
    }

    async.waterfall([
        // base config
        function baseConfig(cb) {
            var cssFilename = path.basename(src, '.css');
            var timeNow = getTimeStamp();

            if(options.newsprite) {
                cssFilename += '-' + timeNow;
            }

            sliceData.timestamp = options.spritestamp ? timeNow : '';

            sliceData.timestamp = options.spritestamp ? ('?'+timeNow) : '';
            sliceData.imgDest = fixPath(path.join(options.spritedest, cssFilename + '.png'));
            sliceData.spriteImg = fixPath(path.join(options.spritepath, cssFilename + '.png')) +
                sliceData.timestamp;

            sliceData.retinaImgDest = fixPath(sliceData.imgDest.replace(/\.png$/, '@2x.png'));
            sliceData.retinaSpriteImg = fixPath(path.join(options.spritepath, cssFilename + '@2x.png')) +  sliceData.timestamp;

            cb(null);
        },
        // create sprite image
        function createSpriteImg(cb) {
            createSprite(sliceData.imgList, options, cb);
        },
        // process sprite data
        function processSpriteData(spriteData, cb) {
            sliceData.spriteData = spriteData;
            cb(null, spriteData.coordinates);
        },
        // set slice position
        function setSlicePosition(coordinates, cb) {
            var rspaces = /\s+/;
            var rsemicolon = /;\s*$/;
            var rbgUrl = /url\([^\)]+\)/i;
            var rbgEmpty = /background(?:-image)?\s*:\s*;/;

            sliceData.cssList.forEach(function(cssItem) {
                var coords = coordinates[cssItem.imgFullPath];

                var css = cssItem.css.replace(rbgUrl, '');

                // Add a semicolon if needed
                if(!rsemicolon.test(css)) {
                    css += ';';
                }

                if(!rbgEmpty.test(css)) {
                    css = css.replace(rspaces, ' ');
                }
                else {
                    css = '';
                }

                css += getBgPosCss(coords.x, coords.y);

                cssItem.newCss = css;
            });

            cb(null);
        },
        // get retina image & add image-set, css
        function getRetinaImg(cb) {
            var useimageset = options.useimageset;
            var retinaImgList = sliceData.retinaImgList = [];
            var retinaImgHash = sliceData.retinaImgHash = {};

            sliceData.cssList.forEach(function(cssItem, id) {
                var extName = path.extname(cssItem.imgFullPath);
                var filename = path.basename(cssItem.imgFullPath, extName);
                var retinaImgFullPath = path.join(path.dirname(cssItem.imgFullPath), filename + '@2x' + extName);

                if(fs.existsSync(retinaImgFullPath)) {
                    cssItem.retinaImgFullPath = retinaImgFullPath;

                    if(!retinaImgHash[retinaImgFullPath]) {
                        retinaImgList.push(retinaImgFullPath);
                    }
                    retinaImgHash[retinaImgFullPath] = true;
                }
            });

            if(!retinaImgList.length) {
                cb(null, null);

                return;
            }

            var oldAlgorithm = options.algorithm;
            if(useimageset) {
                var spriteData = sliceData.spriteData;
                var coordinates = spriteData.coordinates;

                imageSetSpriteCreator.set2xData({
                    height: spriteData.properties.height,
                    width: spriteData.properties.width,
                    coordinates: coordinates,
                    list: retinaImgList
                });

                options.algorithm = 'xy-2x';
            }

            createSprite(retinaImgList, options, function() {
                options.algorithm = oldAlgorithm;

                cb.apply(null, arguments);
            });
        },
        // process retina sprite data
        function processRetinaSpriteData(retinaSpriteData, cb) {
            if(retinaSpriteData) {
                sliceData.retinaSpriteData = retinaSpriteData;
            }

            cb(null);
        },
        // get selectors
        function getSelectors(cb) {
            var cssData = sliceData.cssData;

            // a[href*='}{']::after{ content:'}{';} 规避此类奇葩CSS
            var tmpCss = cssData.replace(/[:=]\s*([\'\"]).*?\1/g, function(a){
                return a.replace(/\}/g, '');
            });

            sliceData.cssList.forEach(function(cssItem) {
                var place = cssItem.place;
                var placeEscapeId = escapeRegExp(place.id);
                var rselector = new RegExp('([^}\\/!]+)\\{[^\\}]*?' + placeEscapeId);

                var selector;
                tmpCss = tmpCss.replace(rselector, function(a, b) {
                    selector = b.trim();

                    return b + '{';
                });

                if(!selector) {
                    return;
                }

                cssItem.selector = selector;
            });

            cb(null);
        },
        // processCss
        function processCss(cb) {
            var cssData = sliceData.cssData;
            var useImageSet = options.useimageset;
            var retinaSpriteData = sliceData.retinaSpriteData;
            var retinaCoordinates = retinaSpriteData ? retinaSpriteData.coordinates : {};

            var lastIndex = -1;
            var cssSelectors = [];
            var cssSelectorsHash = {};

            var retinaIndex = -1;
            var retinaCssProps = [];
            var retinaSelectors = [];
            var retinaSelectorsHash = {};

            sliceData.cssList.forEach(function(cssItem) {
                var place = cssItem.place;
                var selector = cssItem.selector;

                cssData = cssData.replace(place.pattern, cssItem.newCss);

                var inx = cssSelectorsHash[selector];
                if(inx !== undefined) {
                    cssSelectors[inx] = null;
                }

                inx = ++lastIndex;
                cssSelectors[inx] = selector;
                cssSelectorsHash[selector] = inx;

                // for media query
                var retinaCoords;
                var retinaImgFullPath = cssItem.retinaImgFullPath;
                if(!useImageSet && retinaImgFullPath) {
                    retinaCoords = retinaCoordinates[retinaImgFullPath];
                }

                if(!retinaCoords) {
                    return;
                }

                inx = retinaSelectorsHash[selector];
                if(inx !== undefined) {
                    retinaSelectors[inx] = null;
                    retinaCssProps[inx] = null;
                }

                inx = ++retinaIndex;
                retinaSelectors[inx] = selector;
                retinaSelectorsHash[selector] = inx;

                var css = selector + '{\n'+ getBgPosCss(retinaCoords.x, retinaCoords.y, 2) +'\n}';
                retinaCssProps[inx] = css;
            });

            sliceData.cssSelectors = uniqueCssSelectors(cssSelectors);

            if(!useImageSet && retinaSelectors.length) {
                sliceData.retinaCssProps = retinaCssProps.filter(filterNullFn);
                sliceData.retinaSelectors = uniqueCssSelectors(retinaSelectors);
            }

            cb(null, cssData);
        },
        // buildCss
        function buildCss(cssData, cb) {
            var useImageSet = options.useimageset;

            var spriteImg = sliceData.spriteImg;
            var cssSelectors = sliceData.cssSelectors;
            var retinaCssProps = sliceData.retinaCssProps;
            var retinaSelectors = sliceData.retinaSelectors;
            var retinaSpriteData = sliceData.retinaSpriteData;
            var retinaSpriteImg = sliceData.retinaSpriteImg;

            var css = 'background-image: url('+ spriteImg +');';

            // IE8 does not support unknow pseudo-element
            // and it will broken selectors
            var rNotSupportPseudo = /:(?:checked|disabled|empty)/i;

            var isolatedSelectors = [];
            for(var selector, i=cssSelectors.length-1; i>=0; --i) {
                selector = cssSelectors[i];

                if(rNotSupportPseudo.test(selector)) {
                    cssSelectors.splice(i, 1);

                    isolatedSelectors.unshift(selector);
                }
            }

            if(useImageSet) {
                css += '\n';
                css += fill(options.IMAGE_SET_CSS_TMPL, {
                    retinaSpriteImg: retinaSpriteImg,
                    spriteImg: spriteImg
                });
            }

            cssData += fill(options.CSS_DATA_TMPL, {
                selectors: cssSelectors.join(',\n'),
                imgDest: spriteImg,
                cssProps: css
            });

            // isolatedSelectors, for IE8
            if(isolatedSelectors.length) {
                cssData += fill(options.CSS_DATA_TMPL, {
                    selectors: isolatedSelectors.join(',\n'),
                    imgDest: spriteImg,
                    cssProps: css
                });
            }

            // media query css
            if(!useImageSet && retinaSelectors && retinaSelectors.length) {
                var retinaBgWidth = Math.floor(retinaSpriteData.properties.width / 2);

                css = retinaSelectors.join(',\n') + '{\n';
                css += 'background-image: url('+ retinaSpriteImg +');\n';
                css += 'background-size: '+ retinaBgWidth +'px auto;';
                css += '\n}\n';

                css += retinaCssProps.join('\n');

                cssData += fill(options.MEDIA_QUERY_CSS_TMPL, {
                    imgDest: retinaSpriteImg,
                    cssText: css
                });
            }

            cb(null, cssData);
        },
        // restore comments
        function restoreComments(cssData, cb) {
            var commentsData = sliceData.commentsData;

            Object.keys(commentsData).forEach(function(k) {
                var commentsItem = commentsData[k];
                var place = commentsItem.place;

                cssData = cssData.replace(place.pattern, commentsItem.data);
            });

            cb(null, cssData);
        },
        // process result
        function processResult(cssData, cb) {
            // timestamp
            if(options.cssstamp) {
                cssData += '\n.css_stamp{ content:"'+ sliceData.timestamp.slice(1) +'";}';
            }

            // path info
            var spriteData = sliceData.spriteData;
            var retinaSpriteData = sliceData.retinaSpriteData;

            spriteData.imagePath = sliceData.imgDest;

            if(retinaSpriteData) {
                retinaSpriteData.imagePath = sliceData.retinaImgDest;
            }

            cb(null, {
                cssData: cssData,
                spriteData: spriteData,
                retinaSpriteData: retinaSpriteData
            });
        }
    ], callback);
}

cssSpriteSmith.defaultOptions = defaultOptions;
module.exports = cssSpriteSmith;