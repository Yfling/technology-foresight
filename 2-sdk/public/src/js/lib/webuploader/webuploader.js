/* WebUploader 0.1.0 */
(function( window, undefined ) {
    /**
     * @fileOverview è®©å†…éƒ¨å„ä¸ªéƒ¨ä»¶çš„ä»£ç å¯ä»¥ç”¨[amd](https://github.com/amdjs/amdjs-api/wiki/AMD)æ¨¡å—å®šä¹‰æ–¹å¼ç»„ç»‡èµ·æ¥ã€‚
     *
     * AMD API å†…éƒ¨çš„ç®€å•ä¸å®Œå…¨å®žçŽ°ï¼Œè¯·å¿½ç•¥ã€‚åªæœ‰å½“WebUploaderè¢«åˆå¹¶æˆä¸€ä¸ªæ–‡ä»¶çš„æ—¶å€™æ‰ä¼šå¼•å…¥ã€‚
     */
    var internalAmd = (function( global, undefined ) {
            var modules = {},
    
                // ç®€å•ä¸å®Œå…¨å®žçŽ°https://github.com/amdjs/amdjs-api/wiki/require
                require = function( deps, callback ) {
                    var args, len, i;
    
                    // å¦‚æžœdepsä¸æ˜¯æ•°ç»„ï¼Œåˆ™ç›´æŽ¥è¿”å›žæŒ‡å®šmodule
                    if ( typeof deps === 'string' ) {
                        return getModule( deps );
                    } else {
                        args = [];
                        for( len = deps.length, i = 0; i < len; i++ ) {
                            args.push( getModule( deps[ i ] ) );
                        }
    
                        return callback.apply( null, args );
                    }
                },
    
                // å†…éƒ¨çš„defineï¼Œæš‚æ—¶ä¸æ”¯æŒä¸æŒ‡å®šid.
                define = function( id, deps, factory ) {
                    if ( arguments.length === 2 ) {
                        factory = deps;
                        deps = null;
                    }
    
                    if ( typeof id !== 'string' || !factory ) {
                        throw new Error('Define Error');
                    }
    
                    require( deps || [], function() {
                        setModule( id, factory, arguments );
                    });
                },
    
                // è®¾ç½®module, å…¼å®¹CommonJså†™æ³•ã€‚
                setModule = function( id, factory, args ) {
                    var module = {
                            exports: factory
                        },
                        returned;
    
                    if ( typeof factory === 'function' ) {
                        args.length || (args = [ require, module.exports, module ]);
                        returned = factory.apply( null, args );
                        returned !== undefined && (module.exports = returned);
                    }
    
                    modules[ id ] = module.exports;
                },
    
                // æ ¹æ®idèŽ·å–module
                getModule = function( id ) {
                    var module = modules[ id ] || global[ id ];
    
                    if ( !module ) {
                        throw new Error( '`' + id + '` is undefined' );
                    }
    
                    return module;
                };
    
            return {
                define: define,
                require: require,
    
                // æš´éœ²æ‰€æœ‰çš„æ¨¡å—ã€‚
                modules: modules
            };
        })( window ),
    
        /* jshint unused: false */
        require = internalAmd.require,
        define = internalAmd.define;

    /**
     * @fileOverview åŸºç¡€ç±»æ–¹æ³•ã€‚
     */
    
    /**
     * Web Uploaderå†…éƒ¨ç±»çš„è¯¦ç»†è¯´æ˜Žï¼Œä»¥ä¸‹æåŠçš„åŠŸèƒ½ç±»ï¼Œéƒ½å¯ä»¥åœ¨`WebUploader`è¿™ä¸ªå˜é‡ä¸­è®¿é—®åˆ°ã€‚
     *
     * As you know, Web Uploaderçš„æ¯ä¸ªæ–‡ä»¶éƒ½æ˜¯ç”¨è¿‡[AMD](https://github.com/amdjs/amdjs-api/wiki/AMD)è§„èŒƒä¸­çš„`define`ç»„ç»‡èµ·æ¥çš„, æ¯ä¸ªModuleéƒ½ä¼šæœ‰ä¸ªmodule id.
     * é»˜è®¤module idè¯¥æ–‡ä»¶çš„è·¯å¾„ï¼Œè€Œæ­¤è·¯å¾„å°†ä¼šè½¬åŒ–æˆåå­—ç©ºé—´å­˜æ”¾åœ¨WebUploaderä¸­ã€‚å¦‚ï¼š
     *
     * * module `base`ï¼šWebUploader.Base
     * * module `file`: WebUploader.File
     * * module `lib/dnd`: WebUploader.Lib.Dnd
     * * module `runtime/html5/dnd`: WebUploader.Runtime.Html5.Dnd
     *
     *
     * ä»¥ä¸‹æ–‡æ¡£å°†å¯èƒ½çœç•¥`WebUploader`å‰ç¼€ã€‚
     * @module WebUploader
     * @title WebUploader APIæ–‡æ¡£
     */
    define( 'base', [
        'jQuery'
    ], function( $ ) {
    
        var noop = function() {},
            call = Function.call;
    
        // http://jsperf.com/uncurrythis
        // åç§‘é‡ŒåŒ–
        function uncurryThis( fn ) {
            return function() {
                return call.apply( fn, arguments );
            };
        }
    
        function bindFn( fn, context ) {
            return Function.prototype.bind ? fn.bind( context ) : function() {
                return fn.apply( context, arguments );
            };
        }
    
        function createObject( proto ) {
            var f;
    
            if ( Object.create ) {
                return Object.create( proto );
            } else {
                f = function() {};
                f.prototype = proto;
                return new f();
            }
        }
    
    
        /**
         * åŸºç¡€ç±»ï¼Œæä¾›ä¸€äº›ç®€å•å¸¸ç”¨çš„æ–¹æ³•ã€‚
         * @class Base
         */
        return {
    
            /**
             * @property {String} version å½“å‰ç‰ˆæœ¬å·ã€‚
             */
            version: '0.1.0',
    
            /**
             * @property {jQuery|Zepto} $ å¼•ç”¨ä¾èµ–çš„jQueryæˆ–è€…Zeptoå¯¹è±¡ã€‚
             */
            $: $,
    
            /**
             * åˆ›å»ºä¸€ä¸ª[Deferred](http://api.jquery.com/category/deferred-object/)å¯¹è±¡ã€‚
             * è¯¦ç»†çš„Deferredç”¨æ³•è¯´æ˜Žï¼Œè¯·å‚ç…§jQueryçš„APIæ–‡æ¡£ã€‚
             *
             * Deferredå¯¹è±¡åœ¨é’©å­å›žæŽ‰å‡½æ•°ä¸­ç»å¸¸è¦ç”¨åˆ°ï¼Œç”¨æ¥å¤„ç†éœ€è¦ç­‰å¾…çš„å¼‚æ­¥æ“ä½œã€‚
             *
             *
             * @method Deferred
             * @grammar Base.Deferred() => Deferred
             * @example
             * // åœ¨æ–‡ä»¶å¼€å§‹å‘é€å‰åšäº›å¼‚æ­¥æ“ä½œã€‚
             * // WebUploaderä¼šç­‰å¾…æ­¤å¼‚æ­¥æ“ä½œå®ŒæˆåŽï¼Œå¼€å§‹å‘é€æ–‡ä»¶ã€‚
             * Uploader.register({
             *     'before-send-file': 'doSomthingAsync'
             * }, {
             *
             *     doSomthingAsync: function() {
             *         var deferred = Base.Deferred();
             *
             *         // æ¨¡æ‹Ÿä¸€æ¬¡å¼‚æ­¥æ“ä½œã€‚
             *         setTimeout(deferred.resolve, 2000);
             *
             *         return deferred.promise();
             *     }
             * });
             */
            Deferred: $.Deferred,
    
            /**
             * åˆ¤æ–­ä¼ å…¥çš„å‚æ•°æ˜¯å¦ä¸ºä¸€ä¸ªpromiseå¯¹è±¡ã€‚
             * @method isPromise
             * @grammar Base.isPromise( anything ) => Boolean
             * @param  {*}  anything æ£€æµ‹å¯¹è±¡ã€‚
             * @return {Boolean}
             * @example
             * console.log( Base.isPromise() );    // => false
             * console.log( Base.isPromise({ key: '123' }) );    // => false
             * console.log( Base.isPromise( Base.Deferred().promise() ) );    // => true
             *
             * // Deferredä¹Ÿæ˜¯ä¸€ä¸ªPromise
             * console.log( Base.isPromise( Base.Deferred() ) );    // => true
             */
            isPromise: function( anything ) {
                return anything && typeof anything.then === 'function';
            },
    
    
            /**
             * è¿”å›žä¸€ä¸ªpromiseï¼Œæ­¤promiseåœ¨æ‰€æœ‰ä¼ å…¥çš„promiseéƒ½å®Œæˆäº†åŽå®Œæˆã€‚
             * è¯¦ç»†è¯·æŸ¥çœ‹[è¿™é‡Œ](http://api.jquery.com/jQuery.when/)ã€‚
             *
             * @method when
             * @grammar Base.when( promise1[, promise2[, promise3...]] ) => Promise
             */
            when: $.when,
    
            /**
             * @description  ç®€å•çš„æµè§ˆå™¨æ£€æŸ¥ç»“æžœã€‚
             *
             * * `webkit`  webkitç‰ˆæœ¬å·ï¼Œå¦‚æžœæµè§ˆå™¨ä¸ºéžwebkitå†…æ ¸ï¼Œæ­¤å±žæ€§ä¸º`undefined`ã€‚
             * * `chrome`  chromeæµè§ˆå™¨ç‰ˆæœ¬å·ï¼Œå¦‚æžœæµè§ˆå™¨ä¸ºchromeï¼Œæ­¤å±žæ€§ä¸º`undefined`ã€‚
             * * `ie`  ieæµè§ˆå™¨ç‰ˆæœ¬å·ï¼Œå¦‚æžœæµè§ˆå™¨ä¸ºéžieï¼Œæ­¤å±žæ€§ä¸º`undefined`ã€‚**æš‚ä¸æ”¯æŒie10+**
             * * `firefox`  firefoxæµè§ˆå™¨ç‰ˆæœ¬å·ï¼Œå¦‚æžœæµè§ˆå™¨ä¸ºéžfirefoxï¼Œæ­¤å±žæ€§ä¸º`undefined`ã€‚
             * * `safari`  safariæµè§ˆå™¨ç‰ˆæœ¬å·ï¼Œå¦‚æžœæµè§ˆå™¨ä¸ºéžsafariï¼Œæ­¤å±žæ€§ä¸º`undefined`ã€‚
             * * `opera`  operaæµè§ˆå™¨ç‰ˆæœ¬å·ï¼Œå¦‚æžœæµè§ˆå™¨ä¸ºéžoperaï¼Œæ­¤å±žæ€§ä¸º`undefined`ã€‚
             *
             * @property {Object} [browser]
             */
            browser: (function( ua ) {
                var ret = {},
                    webkit = ua.match( /WebKit\/([\d.]+)/ ),
                    chrome = ua.match( /Chrome\/([\d.]+)/ ) ||
                        ua.match( /CriOS\/([\d.]+)/ ),
    
                    ie = ua.match( /MSIE\s([\d.]+)/ ),
                    firefox = ua.match( /Firefox\/([\d.]+)/ ),
                    safari = ua.match( /Safari\/([\d.]+)/ ),
                    opera = ua.match( /OPR\/([\d.]+)/ );
    
                webkit && (ret.webkit = parseFloat( webkit[ 1 ] ));
                chrome && (ret.chrome = parseFloat( chrome[ 1 ] ));
                ie && (ret.ie = parseFloat( ie[ 1 ] ));
                firefox && (ret.firefox = parseFloat( firefox[ 1 ] ));
                safari && (ret.safari = parseFloat( safari[ 1 ] ));
                opera && (ret.opera = parseFloat( opera[ 1 ] ));
    
                return ret;
            })( navigator.userAgent ),
    
            /**
             * å®žçŽ°ç±»ä¸Žç±»ä¹‹é—´çš„ç»§æ‰¿ã€‚
             * @method inherits
             * @grammar Base.inherits( super ) => child
             * @grammar Base.inherits( super, protos ) => child
             * @grammar Base.inherits( super, protos, statics ) => child
             * @param  {Class} super çˆ¶ç±»
             * @param  {Object | Function} [protos] å­ç±»æˆ–è€…å¯¹è±¡ã€‚å¦‚æžœå¯¹è±¡ä¸­åŒ…å«constructorï¼Œå­ç±»å°†æ˜¯ç”¨æ­¤å±žæ€§å€¼ã€‚
             * @param  {Function} [protos.constructor] å­ç±»æž„é€ å™¨ï¼Œä¸æŒ‡å®šçš„è¯å°†åˆ›å»ºä¸ªä¸´æ—¶çš„ç›´æŽ¥æ‰§è¡Œçˆ¶ç±»æž„é€ å™¨çš„æ–¹æ³•ã€‚
             * @param  {Object} [statics] é™æ€å±žæ€§æˆ–æ–¹æ³•ã€‚
             * @return {Class} è¿”å›žå­ç±»ã€‚
             * @example
             * function Person() {
             *     console.log( 'Super' );
             * }
             * Person.prototype.hello = function() {
             *     console.log( 'hello' );
             * };
             *
             * var Manager = Base.inherits( Person, {
             *     world: function() {
             *         console.log( 'World' );
             *     }
             * });
             *
             * // å› ä¸ºæ²¡æœ‰æŒ‡å®šæž„é€ å™¨ï¼Œçˆ¶ç±»çš„æž„é€ å™¨å°†ä¼šæ‰§è¡Œã€‚
             * var instance = new Manager();    // => Super
             *
             * // ç»§æ‰¿å­çˆ¶ç±»çš„æ–¹æ³•
             * instance.hello();    // => hello
             * instance.world();    // => World
             *
             * // å­ç±»çš„__super__å±žæ€§æŒ‡å‘çˆ¶ç±»
             * console.log( Manager.__super__ === Person );    // => true
             */
            inherits: function( Super, protos, staticProtos ) {
                var child;
    
                if ( typeof protos === 'function' ) {
                    child = protos;
                    protos = null;
                } else if ( protos && protos.hasOwnProperty('constructor') ) {
                    child = protos.constructor;
                } else {
                    child = function() {
                        return Super.apply( this, arguments );
                    };
                }
    
                // å¤åˆ¶é™æ€æ–¹æ³•
                $.extend( true, child, Super, staticProtos || {} );
    
                /* jshint camelcase: false */
    
                // è®©å­ç±»çš„__super__å±žæ€§æŒ‡å‘çˆ¶ç±»ã€‚
                child.__super__ = Super.prototype;
    
                // æž„å»ºåŽŸåž‹ï¼Œæ·»åŠ åŽŸåž‹æ–¹æ³•æˆ–å±žæ€§ã€‚
                // æš‚æ—¶ç”¨Object.createå®žçŽ°ã€‚
                child.prototype = createObject( Super.prototype );
                protos && $.extend( true, child.prototype, protos );
    
                return child;
            },
    
            /**
             * ä¸€ä¸ªä¸åšä»»ä½•äº‹æƒ…çš„æ–¹æ³•ã€‚å¯ä»¥ç”¨æ¥èµ‹å€¼ç»™é»˜è®¤çš„callback.
             * @method noop
             */
            noop: noop,
    
            /**
             * è¿”å›žä¸€ä¸ªæ–°çš„æ–¹æ³•ï¼Œæ­¤æ–¹æ³•å°†å·²æŒ‡å®šçš„`context`æ¥æ‰§è¡Œã€‚
             * @grammar Base.bindFn( fn, context ) => Function
             * @method bindFn
             * @example
             * var doSomething = function() {
             *         console.log( this.name );
             *     },
             *     obj = {
             *         name: 'Object Name'
             *     },
             *     aliasFn = Base.bind( doSomething, obj );
             *
             *  aliasFn();    // => Object Name
             *
             */
            bindFn: bindFn,
    
            /**
             * å¼•ç”¨Console.logå¦‚æžœå­˜åœ¨çš„è¯ï¼Œå¦åˆ™å¼•ç”¨ä¸€ä¸ª[ç©ºå‡½æ•°loop](#WebUploader:Base.log)ã€‚
             * @grammar Base.log( args... ) => undefined
             * @method log
             */
            log: (function() {
                if ( window.console ) {
                    return bindFn( console.log, console );
                }
                return noop;
            })(),
    
            nextTick: (function() {
    
                return function( cb ) {
                    setTimeout( cb, 1 );
                };
    
                // @bug å½“æµè§ˆå™¨ä¸åœ¨å½“å‰çª—å£æ—¶å°±åœäº†ã€‚
                // var next = window.requestAnimationFrame ||
                //     window.webkitRequestAnimationFrame ||
                //     window.mozRequestAnimationFrame ||
                //     function( cb ) {
                //         window.setTimeout( cb, 1000 / 60 );
                //     };
    
                // // fix: Uncaught TypeError: Illegal invocation
                // return bindFn( next, window );
            })(),
    
            /**
             * è¢«[uncurrythis](http://www.2ality.com/2011/11/uncurrying-this.html)çš„æ•°ç»„sliceæ–¹æ³•ã€‚
             * å°†ç”¨æ¥å°†éžæ•°ç»„å¯¹è±¡è½¬åŒ–æˆæ•°ç»„å¯¹è±¡ã€‚
             * @grammar Base.slice( target, start[, end] ) => Array
             * @method slice
             * @example
             * function doSomthing() {
             *     var args = Base.slice( arguments, 1 );
             *     console.log( args );
             * }
             *
             * doSomthing( 'ignored', 'arg2', 'arg3' );    // => Array ["arg2", "arg3"]
             */
            slice: uncurryThis( [].slice ),
    
            /**
             * ç”Ÿæˆå”¯ä¸€çš„ID
             * @method guid
             * @grammar Base.guid() => String
             * @grammar Base.guid( prefx ) => String
             */
            guid: (function() {
                var counter = 0;
    
                return function( prefix ) {
                    var guid = (+new Date()).toString( 32 ),
                        i = 0;
    
                    for ( ; i < 5; i++ ) {
                        guid += Math.floor( Math.random() * 65535 ).toString( 32 );
                    }
    
                    return (prefix || 'wu_') + guid + (counter++).toString( 32 );
                };
            })(),
    
            /**
             * æ ¼å¼åŒ–æ–‡ä»¶å¤§å°, è¾“å‡ºæˆå¸¦å•ä½çš„å­—ç¬¦ä¸²
             * @method formatSize
             * @grammar Base.formatSize( size ) => String
             * @grammar Base.formatSize( size, pointLength ) => String
             * @grammar Base.formatSize( size, pointLength, units ) => String
             * @param {Number} size æ–‡ä»¶å¤§å°
             * @param {Number} [pointLength=2] ç²¾ç¡®åˆ°çš„å°æ•°ç‚¹æ•°ã€‚
             * @param {Array} [units=[ 'B', 'K', 'M', 'G', 'TB' ]] å•ä½æ•°ç»„ã€‚ä»Žå­—èŠ‚ï¼Œåˆ°åƒå­—èŠ‚ï¼Œä¸€ç›´å¾€ä¸ŠæŒ‡å®šã€‚å¦‚æžœå•ä½æ•°ç»„é‡Œé¢åªæŒ‡å®šäº†åˆ°äº†K(åƒå­—èŠ‚)ï¼ŒåŒæ—¶æ–‡ä»¶å¤§å°å¤§äºŽM, æ­¤æ–¹æ³•çš„è¾“å‡ºå°†è¿˜æ˜¯æ˜¾ç¤ºæˆå¤šå°‘K.
             * @example
             * console.log( Base.formatSize( 100 ) );    // => 100B
             * console.log( Base.formatSize( 1024 ) );    // => 1.00K
             * console.log( Base.formatSize( 1024, 0 ) );    // => 1K
             * console.log( Base.formatSize( 1024 * 1024 ) );    // => 1.00M
             * console.log( Base.formatSize( 1024 * 1024 * 1024 ) );    // => 1.00G
             * console.log( Base.formatSize( 1024 * 1024 * 1024, 0, ['B', 'KB', 'MB'] ) );    // => 1024MB
             */
            formatSize: function( size, pointLength, units ) {
                var unit;
    
                units = units || [ 'B', 'K', 'M', 'G', 'TB' ];
    
                while ( (unit = units.shift()) && size > 1024 ) {
                    size = size / 1024;
                }
    
                return (unit === 'B' ? size : size.toFixed( pointLength || 2 )) +
                        unit;
            }
        };
    });

    /**
     * @fileOverview Mediator
     */
    define( 'mediator', [
        'base'
    ], function( Base ) {
        var $ = Base.$,
            slice = [].slice,
            separator = /\s+/,
            protos;
    
        // æ ¹æ®æ¡ä»¶è¿‡æ»¤å‡ºäº‹ä»¶handlers.
        function findHandlers( arr, name, callback, context ) {
            return $.grep( arr, function( handler ) {
                return handler &&
                        (!name || handler.e === name) &&
                        (!callback || handler.cb === callback ||
                        handler.cb._cb === callback) &&
                        (!context || handler.ctx === context);
            });
        }
    
        function eachEvent( events, callback, iterator ) {
            // ä¸æ”¯æŒå¯¹è±¡ï¼Œåªæ”¯æŒå¤šä¸ªeventç”¨ç©ºæ ¼éš”å¼€
            $.each( (events || '').split( separator ), function( _, key ) {
                iterator( key, callback );
            });
        }
    
        function triggerHanders( events, args ) {
            var stoped = false,
                i = -1,
                len = events.length,
                handler;
    
            while ( ++i < len ) {
                handler = events[ i ];
    
                if ( handler.cb.apply( handler.ctx2, args ) === false ) {
                    stoped = true;
                    break;
                }
            }
    
            return !stoped;
        }
    
        protos = {
    
            /**
             * ç»‘å®šäº‹ä»¶ã€‚
             *
             * `callback`æ–¹æ³•åœ¨æ‰§è¡Œæ—¶ï¼Œargumentså°†ä¼šæ¥æºäºŽtriggerçš„æ—¶å€™æºå¸¦çš„å‚æ•°ã€‚å¦‚
             * ```javascript
             * var obj = {};
             *
             * // ä½¿å¾—objæœ‰äº‹ä»¶è¡Œä¸º
             * Mediator.installTo( obj );
             *
             * obj.on( 'testa', function( arg1, arg2 ) {
             *     console.log( arg1, arg2 ); // => 'arg1', 'arg2'
             * });
             *
             * obj.trigger( 'testa', 'arg1', 'arg2' );
             * ```
             *
             * å¦‚æžœ`callback`ä¸­ï¼ŒæŸä¸€ä¸ªæ–¹æ³•`return false`äº†ï¼Œåˆ™åŽç»­çš„å…¶ä»–`callback`éƒ½ä¸ä¼šè¢«æ‰§è¡Œåˆ°ã€‚
             * åˆ‡ä¼šå½±å“åˆ°`trigger`æ–¹æ³•çš„è¿”å›žå€¼ï¼Œä¸º`false`ã€‚
             *
             * `on`è¿˜å¯ä»¥ç”¨æ¥æ·»åŠ ä¸€ä¸ªç‰¹æ®Šäº‹ä»¶`all`, è¿™æ ·æ‰€æœ‰çš„äº‹ä»¶è§¦å‘éƒ½ä¼šå“åº”åˆ°ã€‚åŒæ—¶æ­¤ç±»`callback`ä¸­çš„argumentsæœ‰ä¸€ä¸ªä¸åŒå¤„ï¼Œ
             * å°±æ˜¯ç¬¬ä¸€ä¸ªå‚æ•°ä¸º`type`ï¼Œè®°å½•å½“å‰æ˜¯ä»€ä¹ˆäº‹ä»¶åœ¨è§¦å‘ã€‚æ­¤ç±»`callback`çš„ä¼˜å…ˆçº§æ¯”è„šä½Žï¼Œä¼šå†æ­£å¸¸`callback`æ‰§è¡Œå®ŒåŽè§¦å‘ã€‚
             * ```javascript
             * obj.on( 'all', function( type, arg1, arg2 ) {
             *     console.log( type, arg1, arg2 ); // => 'testa', 'arg1', 'arg2'
             * });
             * ```
             *
             * @method on
             * @grammar on( name, callback[, context] ) => self
             * @param  {String}   name     äº‹ä»¶åï¼Œæ”¯æŒå¤šä¸ªäº‹ä»¶ç”¨ç©ºæ ¼éš”å¼€
             * @param  {Function} callback äº‹ä»¶å¤„ç†å™¨
             * @param  {Object}   [context]  äº‹ä»¶å¤„ç†å™¨çš„ä¸Šä¸‹æ–‡ã€‚
             * @return {self} è¿”å›žè‡ªèº«ï¼Œæ–¹ä¾¿é“¾å¼
             * @chainable
             * @class Mediator
             */
            on: function( name, callback, context ) {
                var me = this,
                    set;
    
                if ( !callback ) {
                    return this;
                }
    
                set = this._events || (this._events = []);
    
                eachEvent( name, callback, function( name, callback ) {
                    var handler = { e: name };
    
                    handler.cb = callback;
                    handler.ctx = context;
                    handler.ctx2 = context || me;
                    handler.id = set.length;
    
                    set.push( handler );
                });
    
                return this;
            },
    
            /**
             * ç»‘å®šäº‹ä»¶ï¼Œä¸”å½“handleræ‰§è¡Œå®ŒåŽï¼Œè‡ªåŠ¨è§£é™¤ç»‘å®šã€‚
             * @method once
             * @grammar once( name, callback[, context] ) => self
             * @param  {String}   name     äº‹ä»¶å
             * @param  {Function} callback äº‹ä»¶å¤„ç†å™¨
             * @param  {Object}   [context]  äº‹ä»¶å¤„ç†å™¨çš„ä¸Šä¸‹æ–‡ã€‚
             * @return {self} è¿”å›žè‡ªèº«ï¼Œæ–¹ä¾¿é“¾å¼
             * @chainable
             */
            once: function( name, callback, context ) {
                var me = this;
    
                if ( !callback ) {
                    return me;
                }
    
                eachEvent( name, callback, function( name, callback ) {
                    var once = function() {
                            me.off( name, once );
                            return callback.apply( context || me, arguments );
                        };
    
                    once._cb = callback;
                    me.on( name, once, context );
                });
    
                return me;
            },
    
            /**
             * è§£é™¤äº‹ä»¶ç»‘å®š
             * @method off
             * @grammar off( [name[, callback[, context] ] ] ) => self
             * @param  {String}   [name]     äº‹ä»¶å
             * @param  {Function} [callback] äº‹ä»¶å¤„ç†å™¨
             * @param  {Object}   [context]  äº‹ä»¶å¤„ç†å™¨çš„ä¸Šä¸‹æ–‡ã€‚
             * @return {self} è¿”å›žè‡ªèº«ï¼Œæ–¹ä¾¿é“¾å¼
             * @chainable
             */
            off: function( name, cb, ctx ) {
                var events = this._events;
    
                if ( !events ) {
                    return this;
                }
    
                if ( !name && !cb && !ctx ) {
                    this._events = [];
                    return this;
                }
    
                eachEvent( name, cb, function( name, cb ) {
                    $.each( findHandlers( events, name, cb, ctx ), function() {
                        delete events[ this.id ];
                    });
                });
    
                return this;
            },
    
            /**
             * è§¦å‘äº‹ä»¶
             * @method trigger
             * @grammar trigger( name[, args...] ) => self
             * @param  {String}   type     äº‹ä»¶å
             * @param  {*} [...] ä»»æ„å‚æ•°
             * @return {Boolean} å¦‚æžœhandlerä¸­return falseäº†ï¼Œåˆ™è¿”å›žfalse, å¦åˆ™è¿”å›žtrue
             */
            trigger: function( type ) {
                var args, events, allEvents;
    
                if ( !this._events || !type ) {
                    return this;
                }
    
                args = slice.call( arguments, 1 );
                events = findHandlers( this._events, type );
                allEvents = findHandlers( this._events, 'all' );
    
                return triggerHanders( events, args ) &&
                        triggerHanders( allEvents, arguments );
            }
        };
    
        /**
         * ä¸­ä»‹è€…ï¼Œå®ƒæœ¬èº«æ˜¯ä¸ªå•ä¾‹ï¼Œä½†å¯ä»¥é€šè¿‡[installTo](#WebUploader:Mediator:installTo)æ–¹æ³•ï¼Œä½¿ä»»ä½•å¯¹è±¡å…·å¤‡äº‹ä»¶è¡Œä¸ºã€‚
         * ä¸»è¦ç›®çš„æ˜¯è´Ÿè´£æ¨¡å—ä¸Žæ¨¡å—ä¹‹é—´çš„åˆä½œï¼Œé™ä½Žè€¦åˆåº¦ã€‚
         *
         * @class Mediator
         */
        return $.extend({
    
            /**
             * å¯ä»¥é€šè¿‡è¿™ä¸ªæŽ¥å£ï¼Œä½¿ä»»ä½•å¯¹è±¡å…·å¤‡äº‹ä»¶åŠŸèƒ½ã€‚
             * @method installTo
             * @param  {Object} obj éœ€è¦å…·å¤‡äº‹ä»¶è¡Œä¸ºçš„å¯¹è±¡ã€‚
             * @return {Object} è¿”å›žobj.
             */
            installTo: function( obj ) {
                return $.extend( obj, protos );
            }
    
        }, protos );
    });

    /**
     * @fileOverview Uploaderä¸Šä¼ ç±»
     */
    define( 'uploader', [
        'base',
        'mediator'
    ], function( Base, Mediator ) {
    
        var $ = Base.$;
    
        /**
         * ä¸Šä¼ å…¥å£ç±»ã€‚
         * @class Uploader
         * @constructor
         * @grammar new Uploader( opts ) => Uploader
         * @example
         * var uploader = WebUploader.Uploader({
         *     swf: 'path_of_swf/Uploader.swf',
         *
         *     // å¼€èµ·åˆ†ç‰‡ä¸Šä¼ ã€‚
         *     chunked: true
         * });
         */
        function Uploader( opts ) {
            this.options = $.extend( true, {}, Uploader.options, opts );
            this._init( this.options );
        }
    
        // default Options
        // widgetsä¸­æœ‰ç›¸åº”æ‰©å±•
        Uploader.options = {};
        Mediator.installTo( Uploader.prototype );
    
        // æ‰¹é‡æ·»åŠ çº¯å‘½ä»¤å¼æ–¹æ³•ã€‚
        $.each({
            upload: 'start-upload',
            stop: 'stop-upload',
            getFile: 'get-file',
            getFiles: 'get-files',
            // addFile: 'add-file',
            // addFiles: 'add-file',
            removeFile: 'remove-file',
            skipFile: 'skip-file',
            retry: 'retry',
            isInProgress: 'is-in-progress',
            makeThumb: 'make-thumb',
            getDimension: 'get-dimension',
            addButton: 'add-btn',
            getRuntimeType: 'get-runtime-type',
            refresh: 'refresh',
            disable: 'disable',
            enable: 'enable'
        }, function( fn, command ) {
            Uploader.prototype[ fn ] = function() {
                return this.request( command, arguments );
            };
        });
    
        $.extend( Uploader.prototype, {
            state: 'pending',
    
            _init: function( opts ) {
                var me = this;
    
                me.request( 'init', opts, function() {
                    me.state = 'ready';
                    me.trigger('ready');
                });
            },
    
            /**
             * èŽ·å–æˆ–è€…è®¾ç½®Uploaderé…ç½®é¡¹ã€‚
             * @method option
             * @grammar option( key ) => *
             * @grammar option( key, val ) => self
             * @example
             *
             * // åˆå§‹çŠ¶æ€å›¾ç‰‡ä¸Šä¼ å‰ä¸ä¼šåŽ‹ç¼©
             * var uploader = new WebUploader.Uploader({
             *     resize: null;
             * });
             *
             * // ä¿®æ”¹åŽå›¾ç‰‡ä¸Šä¼ å‰ï¼Œå°è¯•å°†å›¾ç‰‡åŽ‹ç¼©åˆ°1600 * 1600
             * uploader.options( 'resize', {
             *     width: 1600,
             *     height: 1600
             * });
             */
            option: function( key, val ) {
                var opts = this.options;
    
                // setter
                if ( arguments.length > 1 ) {
    
                    if ( $.isPlainObject( val ) &&
                            $.isPlainObject( opts[ key ] ) ) {
                        $.extend( opts[ key ], val );
                    } else {
                        opts[ key ] = val;
                    }
    
                } else {    // getter
                    return key ? opts[ key ] : opts;
                }
            },
    
            /**
             * èŽ·å–æ–‡ä»¶ç»Ÿè®¡ä¿¡æ¯ã€‚è¿”å›žä¸€ä¸ªåŒ…å«ä¸€ä¸‹ä¿¡æ¯çš„å¯¹è±¡ã€‚
             * * `successNum` ä¸Šä¼ æˆåŠŸçš„æ–‡ä»¶æ•°
             * * `uploadFailNum` ä¸Šä¼ å¤±è´¥çš„æ–‡ä»¶æ•°
             * * `cancelNum` è¢«åˆ é™¤çš„æ–‡ä»¶æ•°
             * * `invalidNum` æ— æ•ˆçš„æ–‡ä»¶æ•°
             * * `queueNum` è¿˜åœ¨é˜Ÿåˆ—ä¸­çš„æ–‡ä»¶æ•°
             * @method getStats
             * @grammar getStats() => Object
             */
            getStats: function() {
                // return this._mgr.getStats.apply( this._mgr, arguments );
                var stats = this.request('get-stats');
    
                return {
                    successNum: stats.numOfSuccess,
    
                    // who care?
                    // queueFailNum: 0,
                    cancelNum: stats.numOfCancel,
                    invalidNum: stats.numOfInvalid,
                    uploadFailNum: stats.numOfUploadFailed,
                    queueNum: stats.numOfQueue
                };
            },
    
            // éœ€è¦é‡å†™æ­¤æ–¹æ³•æ¥æ¥æ”¯æŒopts.onEventå’Œinstance.onEventçš„å¤„ç†å™¨
            trigger: function( type/*, args...*/ ) {
                var args = [].slice.call( arguments, 1 ),
                    opts = this.options,
                    name = 'on' + type.substring( 0, 1 ).toUpperCase() +
                        type.substring( 1 );
    
                if ( Mediator.trigger.apply( this, arguments ) === false ) {
                    return false;
                }
    
                if ( $.isFunction( opts[ name ] ) &&
                        opts[ name ].apply( this, args ) === false ) {
                    return false;
                }
    
                if ( $.isFunction( this[ name ] ) &&
                        this[ name ].apply( this, args ) === false ) {
                    return false;
                }
    
                return true;
            },
    
            // widgets/widget.jså°†è¡¥å……æ­¤æ–¹æ³•çš„è¯¦ç»†æ–‡æ¡£ã€‚
            request: Base.noop,
    
            reset: function() {
                // @todo
            }
        });
    
        /**
         * åˆ›å»ºUploaderå®žä¾‹ï¼Œç­‰åŒäºŽnew Uploader( opts );
         * @method create
         * @class Base
         * @static
         * @grammar Base.create( opts ) => Uploader
         */
        Base.create = function( opts ) {
            return new Uploader( opts );
        };
    
        // æš´éœ²Uploaderï¼Œå¯ä»¥é€šè¿‡å®ƒæ¥æ‰©å±•ä¸šåŠ¡é€»è¾‘ã€‚
        Base.Uploader = Uploader;
    
        return Uploader;
    });

    /**
     * @fileOverview Runtimeç®¡ç†å™¨ï¼Œè´Ÿè´£Runtimeçš„é€‰æ‹©, è¿žæŽ¥
     */
    define( 'runtime/runtime', [
        'base',
        'mediator'
    ], function( Base, Mediator ) {
    
        var $ = Base.$,
            factories = {},
    
            // èŽ·å–å¯¹è±¡çš„ç¬¬ä¸€ä¸ªkey
            getFirstKey = function( obj ) {
                for ( var key in obj ) {
                    if ( obj.hasOwnProperty( key ) ) {
                        return key;
                    }
                }
                return null;
            };
    
        // æŽ¥å£ç±»ã€‚
        function Runtime( options ) {
            this.options = $.extend({
                container: document.body
            }, options );
            this.uid = Base.guid('rt_');
        }
    
        $.extend( Runtime.prototype, {
    
            getContainer: function() {
                var opts = this.options,
                    parent, container;
    
                if ( this._container ) {
                    return this._container;
                }
    
                parent = opts.container || $( document.body );
                container = $( document.createElement('div') );
    
                container.attr( 'id', 'rt_' + this.uid );
                container.css({
                    position: 'absolute',
                    top: '0px',
                    left: '0px',
                    width: '1px',
                    height: '1px',
                    overflow: 'hidden'
                });
    
                parent.append( container );
                parent.addClass( 'webuploader-container' );
                this._container = container;
                return container;
            },
    
            init: Base.noop,
            exec: Base.noop,
    
            destroy: function() {
                if ( this._container ) {
                    this._container.parentNode.removeChild( this.__container );
                }
    
                this.off();
            }
        });
    
        Runtime.orders = 'html5,flash';
    
    
        /**
         * æ·»åŠ Runtimeå®žçŽ°ã€‚
         * @param {String} type    ç±»åž‹
         * @param {Runtime} factory å…·ä½“Runtimeå®žçŽ°ã€‚
         */
        Runtime.addRuntime = function( type, factory ) {
            factories[ type ] = factory;
        };
    
        Runtime.hasRuntime = function( type ) {
            return !!(type ? factories[ type ] : getFirstKey( factories ));
        };
    
        Runtime.create = function( opts, orders ) {
            var type, runtime;
    
            orders = orders || Runtime.orders;
            $.each( orders.split( /\s*,\s*/g ), function() {
                if ( factories[ this ] ) {
                    type = this;
                    return false;
                }
            });
    
            type = type || getFirstKey( factories );
    
            if ( !type ) {
                throw new Error('Runtime Error');
            }
    
            runtime = new factories[ type ]( opts );
            return runtime;
        };
    
        Mediator.installTo( Runtime.prototype );
        return Runtime;
    });

    /**
     * @fileOverview Runtimeç®¡ç†å™¨ï¼Œè´Ÿè´£Runtimeçš„é€‰æ‹©, è¿žæŽ¥
     */
    define( 'runtime/client', [
        'base',
        'mediator',
        'runtime/runtime'
    ], function( Base, Mediator, Runtime ) {
    
        var cache = (function() {
                var obj = {};
    
                return {
                    add: function( runtime ) {
                        obj[ runtime.uid ] = runtime;
                    },
    
                    get: function( ruid ) {
                        var i;
    
                        if ( ruid ) {
                            return obj[ ruid ];
                        }
    
                        for ( i in obj ) {
                            return obj[ i ];
                        }
    
                        return null;
                    },
    
                    remove: function( runtime ) {
                        delete obj[ runtime.uid ];
                    },
    
                    has: function() {
                        return !!this.get.apply( this, arguments );
                    }
                };
            })();
    
        function RuntimeClient( component, standalone ) {
            var deferred = Base.Deferred(),
                runtime;
    
            this.uid = Base.guid('client_');
    
            this.runtimeReady = function( cb ) {
                return deferred.done( cb );
            };
    
            this.connectRuntime = function( opts, cb ) {
                if ( runtime ) {
                    return;
                }
    
                deferred.done( cb );
    
                if ( typeof opts === 'string' && cache.get( opts ) ) {
                    runtime = cache.get( opts );
    
                // åƒfilePickeråªèƒ½ç‹¬ç«‹å­˜åœ¨ï¼Œä¸èƒ½å…¬ç”¨ã€‚
                } else if ( !standalone && cache.has() ) {
                    runtime = cache.get();
                }
    
                if ( !runtime ) {
                    runtime = Runtime.create( opts, opts.runtimeOrder );
                    cache.add( runtime );
                    runtime.promise = deferred.promise();
                    runtime.once( 'ready', deferred.resolve );
                    runtime.init();
                    runtime.client = 1;
                    return runtime;
                }
    
                runtime.promise.then( deferred.resolve );
                runtime.client++;
                return runtime;
            };
    
            this.getRuntime = function() {
                return runtime;
            };
    
            this.disconnectRuntime = function() {
                if ( !runtime ) {
                    return;
                }
    
                runtime.client--;
    
                if ( runtime.client <= 0 ) {
                    cache.remove( runtime );
                    delete runtime.promise;
                    runtime.destroy();
                }
    
                runtime = null;
            };
    
            this.exec = function() {
                if ( !runtime ) {
                    return;
                }
    
                var args = Base.slice( arguments );
                component && args.unshift( component );
    
                return runtime.exec.apply( this, args );
            };
    
            this.getRuid = function() {
                return runtime && runtime.uid;
            };
    
            this.destroy = (function( destroy ) {
                return function() {
                    destroy && destroy.apply( this, arguments );
                    this.trigger('destroy');
                    this.off();
                    this.exec( 'destroy' );
                    this.disconnectRuntime();
                };
            })( this.destroy );
        }
    
        Mediator.installTo( RuntimeClient.prototype );
        return RuntimeClient;
    });

    /**
     * @fileOverview Blob
     */
    define( 'lib/blob', [
        'base',
        'runtime/client'
    ], function( Base, RuntimeClient ) {
    
        function Blob( ruid, source ) {
            var me = this;
    
            me.source = source;
            me.ruid = ruid;
    
            RuntimeClient.call( me, 'Blob' );
    
            this.uid = source.uid || this.uid;
            this.type = source.type || '';
            this.size = source.size || 0;
    
            if ( ruid ) {
                me.connectRuntime( ruid );
            }
        }
    
        Base.inherits( RuntimeClient, {
            constructor: Blob,
    
            slice: function( start, end ) {
                return this.exec( 'slice', start, end );
            },
    
            getSource: function() {
                return this.source;
            }
        });
    
        return Blob;
    });

    /**
     * @fileOverview File
     */
    define( 'lib/file', [
        'base',
        'lib/blob'
    ], function( Base, Blob ) {
    
        var uid = 0,
            rExt = /\.([^.]+)$/;
    
        function File( ruid, file ) {
            var ext;
    
            Blob.apply( this, arguments );
            this.name = file.name || ('untitled' + uid++);
            ext = rExt.exec( file.name ) ? RegExp.$1.toLowerCase() : '';
    
            if ( !this.type &&  ~'jpg,jpeg,png,gif,bmp'.indexOf( ext ) ) {
                this.type = 'image/' + ext;
            }
    
            this.ext = ext;
            this.lastModifiedDate = file.lastModifiedDate ||
                    (new Date()).toLocaleString();
        }
    
        return Base.inherits( Blob, File );
    });

    /**
     * @fileOverview é”™è¯¯ä¿¡æ¯
     */
    define( 'lib/filepicker', [
        'base',
        'runtime/client',
        'lib/file'
    ], function( Base, RuntimeClent, File ) {
    
        var $ = Base.$;
    
        function FilePicker( opts ) {
    
            opts = this.options = $.extend({}, FilePicker.options, opts );
            opts.container = $( opts.id );
    
            if ( !opts.container.length ) {
                throw new Error('æŒ‰é’®æŒ‡å®šé”™è¯¯');
            }
    
            opts.label = opts.label || opts.container.text() || 'é€‰æ‹©æ–‡ä»¶';
            opts.button = $( opts.button || document.createElement('div') );
            opts.button.text( opts.label );
            opts.container.html( opts.button );
    
            RuntimeClent.call( this, 'FilePicker', true );
        }
    
        FilePicker.options = {
            button: null,
            container: null,
            label: null,
            multiple: true,
            accept: null
        };
    
        Base.inherits( RuntimeClent, {
            constructor: FilePicker,
    
            init: function() {
                var me = this,
                    opts = me.options,
                    button = opts.button;
    
                button.addClass('webuploader-pick');
    
                me.on( 'all', function( type ) {
                    var files;
    
                    switch ( type ) {
                        case 'mouseenter':
                            button.addClass('webuploader-pick-hover');
                            break;
    
                        case 'mouseleave':
                            button.removeClass('webuploader-pick-hover');
                            break;
    
                        case 'change':
                            files = me.exec('getFiles');
                            me.trigger( 'select', $.map( files, function( file ) {
                                return new File( me.getRuid(), file );
                            }) );
                            break;
                    }
                });
    
                me.connectRuntime( opts, function() {
                    me.refresh();
                    me.exec( 'init', opts );
                });
    
                $( window ).on( 'resize', function() {
                    me.refresh();
                });
            },
    
            refresh: function() {
                var shimContainer = this.getRuntime().getContainer(),
                    button = this.options.button,
                    width = button.outerWidth(),
                    height = button.outerHeight(),
                    pos = button.offset();
    
                width && shimContainer.css({
                    width: width + 'px',
                    height: height + 'px'
                }).offset( pos );
            },
    
            destroy: function() {
                if ( this.runtime ) {
                    this.exec('destroy');
                    this.disconnectRuntime();
                }
            }
        });
    
        return FilePicker;
    });

    /**
     * @fileOverview ç»„ä»¶åŸºç±»ã€‚
     */
    define( 'widgets/widget', [
        'base',
        'uploader'
    ], function( Base, Uploader ) {
    
        var $ = Base.$,
            _init = Uploader.prototype._init,
            IGNORE = {},
            widgetClass = [];
    
        function isArrayLike( obj ) {
            if ( !obj ) {
                return false;
            }
    
            var length = obj.length,
                type = $.type( obj );
    
            if ( obj.nodeType === 1 && length ) {
                return true;
            }
    
            return type === 'array' || type !== 'function' && type !== 'string' &&
                    (length === 0 || typeof length === 'number' && length > 0 &&
                    (length - 1) in obj);
        }
    
        function Widget( uploader ) {
            this.owner = uploader;
            this.options = uploader.options;
        }
    
        $.extend( Widget.prototype, {
    
            init: Base.noop,
    
            // ç±»Backboneçš„äº‹ä»¶ç›‘å¬å£°æ˜Žï¼Œç›‘å¬uploaderå®žä¾‹ä¸Šçš„äº‹ä»¶
            // widgetç›´æŽ¥æ— æ³•ç›‘å¬äº‹ä»¶ï¼Œäº‹ä»¶åªèƒ½é€šè¿‡uploaderæ¥ä¼ é€’
            invoke: function( apiName, args ) {
    
                /*
                    {
                        'make-thumb': 'makeThumb'
                    }
                 */
                var map = this.responseMap;
    
                // å¦‚æžœæ— APIå“åº”å£°æ˜Žåˆ™å¿½ç•¥
                if ( !map || !(apiName in map) || !(map[ apiName ] in this) ||
                        !$.isFunction( this[ map[ apiName ] ] ) ) {
    
                    return IGNORE;
                }
    
                return this[ map[ apiName ] ].apply( this, args );
    
            },
    
            /**
             * å‘é€å‘½ä»¤ã€‚å½“ä¼ å…¥`callback`æˆ–è€…`handler`ä¸­è¿”å›ž`promise`æ—¶ã€‚è¿”å›žä¸€ä¸ªå½“æ‰€æœ‰`handler`ä¸­çš„promiseéƒ½å®ŒæˆåŽå®Œæˆçš„æ–°`promise`ã€‚
             * @method request
             * @grammar request( command, args ) => * | Promise
             * @grammar request( command, args, callback ) => Promise
             * @for  Uploader
             */
            request: function() {
                return this.owner.request.apply( this.owner, arguments );
            }
        });
    
        // æ‰©å±•Uploader.
        $.extend( Uploader.prototype, {
    
            // è¦†å†™_initç”¨æ¥åˆå§‹åŒ–widgets
            _init: function() {
                var me = this,
                    widgets = me._widgets = [];
    
                $.each( widgetClass, function( _, klass ) {
                    widgets.push( new klass( me ) );
                });
    
                return _init.apply( me, arguments );
            },
    
            request: function( apiName, args, callback ) {
                var i = 0,
                    widgets = this._widgets,
                    len = widgets.length,
                    rlts = [],
                    dfds = [],
                    widget, rlt;
    
                args = isArrayLike( args ) ? args : [ args ];
    
                for ( ; i < len; i++ ) {
                    widget = widgets[ i ];
                    rlt = widget.invoke( apiName, args );
    
                    if ( rlt !== IGNORE ) {
    
                        // Deferredå¯¹è±¡
                        if ( Base.isPromise( rlt ) ) {
                            dfds.push( rlt );
                        } else {
                            rlts.push( rlt );
                        }
                    }
                }
    
                // å¦‚æžœæœ‰callbackï¼Œåˆ™ç”¨å¼‚æ­¥æ–¹å¼ã€‚
                if ( callback || dfds.length ) {
                    return Base.when.apply( Base, dfds )
    
                            // å¾ˆé‡è¦ä¸èƒ½åˆ é™¤ã€‚åˆ é™¤äº†ä¼šæ­»å¾ªçŽ¯ã€‚
                            // ä¿è¯æ‰§è¡Œé¡ºåºã€‚è®©callbackæ€»æ˜¯åœ¨ä¸‹ä¸€ä¸ªtickä¸­æ‰§è¡Œã€‚
                            .then(function() {
                                var deferred = Base.Deferred(),
                                    args = arguments;
    
                                setTimeout(function() {
                                    deferred.resolve.apply( deferred, args );
                                }, 1 );
    
                                return deferred.promise();
                            })
                            .then( callback || Base.noop );
                } else {
                    return rlts[ 0 ];
                }
            }
        });
    
        /**
         * æ·»åŠ ç»„ä»¶
         * @param  {object} widgetProto ç»„ä»¶åŽŸåž‹ï¼Œæž„é€ å‡½æ•°é€šè¿‡constructorå±žæ€§å®šä¹‰
         * @param  {object} responseMap APIåç§°ä¸Žå‡½æ•°å®žçŽ°çš„æ˜ å°„
         * @example
         *     Uploader.register( {
         *         init: function( options ) {},
         *         makeThumb: function() {}
         *     }, {
         *         'make-thumb': 'makeThumb'
         *     } );
         */
        Uploader.register = Widget.register = function( responseMap, widgetProto ) {
            var map = { init: 'init' },
                klass;
    
            if ( arguments.length === 1 ) {
                widgetProto = responseMap;
                widgetProto.responseMap = map;
            } else {
                widgetProto.responseMap = $.extend( map, responseMap );
            }
    
            klass = Base.inherits( Widget, widgetProto );
            widgetClass.push( klass );
    
            return klass;
        };
    
        return Widget;
    });

    /**
     * @fileOverview æ–‡ä»¶é€‰æ‹©ç›¸å…³
     */
    define( 'widgets/filepicker', [
        'base',
        'uploader',
        'lib/filepicker',
        'widgets/widget'
    ], function( Base, Uploader, FilePicker ) {
    
        Base.$.extend( Uploader.options, {
    
            /**
             * @property {Selector | Object} [pick=undefined]
             * @namespace options
             * @for Uploader
             * @description æŒ‡å®šé€‰æ‹©æ–‡ä»¶çš„æŒ‰é’®å®¹å™¨ï¼Œä¸æŒ‡å®šåˆ™ä¸åˆ›å»ºæŒ‰é’®ã€‚
             *
             * * `id` {Seletor} æŒ‡å®šé€‰æ‹©æ–‡ä»¶çš„æŒ‰é’®å®¹å™¨ï¼Œä¸æŒ‡å®šåˆ™ä¸åˆ›å»ºæŒ‰é’®ã€‚
             * * `label` {String} æŒ‡å®šæŒ‰é’®æ–‡å­—ã€‚ä¸æŒ‡å®šæ—¶ä¼˜å…ˆä»ŽæŒ‡å®šçš„å®¹å™¨ä¸­çœ‹æ˜¯å¦è‡ªå¸¦æ–‡å­—ã€‚
             * * `multiple` {Boolean} æ˜¯å¦å¼€èµ·åŒæ—¶é€‰æ‹©å¤šä¸ªæ–‡ä»¶èƒ½åŠ›ã€‚
             */
            pick: null,
    
            /**
             * @property {Arroy} [accept=null]
             * @namespace options
             * @for Uploader
             * @description æŒ‡å®šæŽ¥å—å“ªäº›ç±»åž‹çš„æ–‡ä»¶ã€‚ ç”±äºŽç›®å‰è¿˜æœ‰extè½¬mimeTypeè¡¨ï¼Œæ‰€ä»¥è¿™é‡Œéœ€è¦åˆ†å¼€æŒ‡å®šã€‚
             *
             * * `title` {String} æ–‡å­—æè¿°
             * * `extensions` {String} å…è®¸çš„æ–‡ä»¶åŽç¼€ï¼Œä¸å¸¦ç‚¹ï¼Œå¤šä¸ªç”¨é€—å·åˆ†å‰²ã€‚
             * * `mimeTypes` {String} å¤šä¸ªç”¨é€—å·åˆ†å‰²ã€‚
             *
             * å¦‚ï¼š
             *
             * ```
             * {
             *     title: 'Images',
             *     extensions: 'gif,jpg,jpeg,bmp,png',
             *     mimeTypes: 'image/*'
             * }
             * ```
             */
            accept: null/*{
                title: 'Images',
                extensions: 'gif,jpg,jpeg,bmp,png',
                mimeTypes: 'image/*'
            }*/
        });
    
        return Uploader.register({
            'add-btn': 'addButton',
            'refresh': 'refresh'
        }, {
    
            init: function( opts ) {
                this.pickers = [];
                return opts.pick && this.addButton( opts.pick );
            },
    
            refresh: function() {
                $.each( this.pickers, function() {
                    this.refresh();
                });
            },
    
            /**
             * @method addButton
             * @for Uploader
             * @grammar addButton( pick ) => Promise
             * @description
             * æ·»åŠ æ–‡ä»¶é€‰æ‹©æŒ‰é’®ï¼Œå¦‚æžœä¸€ä¸ªæŒ‰é’®ä¸å¤Ÿï¼Œéœ€è¦è°ƒç”¨æ­¤æ–¹æ³•æ¥æ·»åŠ ã€‚å‚æ•°è·Ÿ[options.pick](#WebUploader:Uploader:options)ä¸€è‡´ã€‚
             * @example
             * uploader.addButton({
             *     id: '#btnContainer',
             *     label: 'é€‰æ‹©æ–‡ä»¶'
             * });
             */
            addButton: function( pick ) {
                var me = this,
                    opts = me.options,
                    accept = opts.accept,
                    options, picker, deferred;
    
                if ( !pick ) {
                    return;
                }
    
                deferred = Base.Deferred();
    
                if ( typeof pick === 'string' ) {
                    pick = {
                        id: pick
                    };
                }
    
                options = $.extend({}, pick, {
                    accept: $.isPlainObject( accept ) ? [ accept ] : accept,
                    swf: opts.swf,
                    runtimeOrder: opts.runtimeOrder
                });
    
                picker = new FilePicker( options );
    
                picker.once( 'ready', deferred.resolve );
                picker.on( 'select', function( files ) {
                    me.owner.request( 'add-file', [ files ]);
                });
                picker.init();
    
                this.pickers.push( picker );
    
                return deferred.promise();
            }
        });
    });

    /**
     * @fileOverview æ–‡ä»¶å±žæ€§å°è£…
     */
    define( 'file', [
        'base',
        'mediator'
    ], function( Base, Mediator ) {
    
        var $ = Base.$,
            idPrefix = 'WU_FILE_',
            idSuffix = 0,
            rExt = /\.([^.]+)$/,
            statusMap = {};
    
        function gid() {
            return idPrefix + idSuffix++;
        }
    
        /**
         * æ–‡ä»¶ç±»
         * @class File
         * @constructor æž„é€ å‡½æ•°
         * @grammar new File( source ) => File
         * @param {Lib.File} source [lib.File](#Lib.File)å®žä¾‹, æ­¤sourceå¯¹è±¡æ˜¯å¸¦æœ‰Runtimeä¿¡æ¯çš„ã€‚
         */
        function WUFile( source ) {
    
            /**
             * æ–‡ä»¶åï¼ŒåŒ…æ‹¬æ‰©å±•åï¼ˆåŽç¼€ï¼‰
             * @property name
             * @type {string}
             */
            this.name = source.name || 'Untitled';
    
            /**
             * æ–‡ä»¶ä½“ç§¯ï¼ˆå­—èŠ‚ï¼‰
             * @property size
             * @type {uint}
             * @default 0
             */
            this.size = source.size || 0;
    
            /**
             * æ–‡ä»¶MIMETYPEç±»åž‹ï¼Œä¸Žæ–‡ä»¶ç±»åž‹çš„å¯¹åº”å…³ç³»è¯·å‚è€ƒ[http://t.cn/z8ZnFny](http://t.cn/z8ZnFny)
             * @property type
             * @type {string}
             * @default 'image/png'
             */
            this.type = source.type || 'image/png';
    
            /**
             * æ–‡ä»¶æœ€åŽä¿®æ”¹æ—¥æœŸ
             * @property lastModifiedDate
             * @type {int}
             * @default å½“å‰æ—¶é—´æˆ³
             */
            this.lastModifiedDate = source.lastModifiedDate || (new Date() * 1);
    
            /**
             * æ–‡ä»¶IDï¼Œæ¯ä¸ªå¯¹è±¡å…·æœ‰å”¯ä¸€IDï¼Œä¸Žæ–‡ä»¶åæ— å…³
             * @property id
             * @type {string}
             */
            this.id = gid();
    
            /**
             * æ–‡ä»¶æ‰©å±•åï¼Œé€šè¿‡æ–‡ä»¶åèŽ·å–ï¼Œä¾‹å¦‚test.pngçš„æ‰©å±•åä¸ºpng
             * @property ext
             * @type {string}
             */
            this.ext = rExt.exec( this.name ) ? RegExp.$1 : '';
    
    
            /**
             * çŠ¶æ€æ–‡å­—è¯´æ˜Žã€‚åœ¨ä¸åŒçš„statusè¯­å¢ƒä¸‹æœ‰ä¸åŒçš„ç”¨é€”ã€‚
             * @property statusText
             * @type {string}
             */
            this.statusText = '';
    
            // å­˜å‚¨æ–‡ä»¶çŠ¶æ€ï¼Œé˜²æ­¢é€šè¿‡å±žæ€§ç›´æŽ¥ä¿®æ”¹
            statusMap[ this.id ] = WUFile.Status.INITED;
    
            this.source = source;
            this.loaded = 0;
    
            this.on( 'error', function( msg ) {
                this.setStatus( WUFile.Status.ERROR, msg );
            });
        }
    
        $.extend( WUFile.prototype, {
    
            /**
             * è®¾ç½®çŠ¶æ€ï¼ŒçŠ¶æ€å˜åŒ–æ—¶ä¼šè§¦å‘`change`äº‹ä»¶ã€‚
             * @method setStatus
             * @grammar setStatus( status[, statusText] );
             * @param {File.Status|String} status [æ–‡ä»¶çŠ¶æ€å€¼](#WebUploader:File:File.Status)
             * @param {String} [statusText=''] çŠ¶æ€è¯´æ˜Žï¼Œå¸¸åœ¨erroræ—¶ä½¿ç”¨ï¼Œç”¨http, abort,serverç­‰æ¥æ ‡è®°æ˜¯ç”±äºŽä»€ä¹ˆåŽŸå› å¯¼è‡´æ–‡ä»¶é”™è¯¯ã€‚
             */
            setStatus: function( status, text ) {
    
                var prevStatus = statusMap[ this.id ];
    
                typeof text !== 'undefined' && (this.statusText = text);
    
                if ( status !== prevStatus ) {
                    statusMap[ this.id ] = status;
                    /**
                     * æ–‡ä»¶çŠ¶æ€å˜åŒ–
                     * @event statuschange
                     */
                    this.trigger( 'statuschange', status, prevStatus );
                }
    
            },
    
            /**
             * èŽ·å–æ–‡ä»¶çŠ¶æ€
             * @return {File.Status}
             * @example
                     æ–‡ä»¶çŠ¶æ€å…·ä½“åŒ…æ‹¬ä»¥ä¸‹å‡ ç§ç±»åž‹ï¼š
                     {
                         // åˆå§‹åŒ–
                        INITED:     0,
                        // å·²å…¥é˜Ÿåˆ—
                        QUEUED:     1,
                        // æ­£åœ¨ä¸Šä¼ 
                        PROGRESS:     2,
                        // ä¸Šä¼ å‡ºé”™
                        ERROR:         3,
                        // ä¸Šä¼ æˆåŠŸ
                        COMPLETE:     4,
                        // ä¸Šä¼ å–æ¶ˆ
                        CANCELLED:     5
                    }
             */
            getStatus: function() {
                return statusMap[ this.id ];
            },
    
            /**
             * èŽ·å–æ–‡ä»¶åŽŸå§‹ä¿¡æ¯ã€‚
             * @return {*}
             */
            getSource: function() {
                return this.source;
            },
    
            destory: function() {
                delete statusMap[ this.id ];
            }
        });
    
        Mediator.installTo( WUFile.prototype );
    
        /**
         * æ–‡ä»¶çŠ¶æ€å€¼ï¼Œå…·ä½“åŒ…æ‹¬ä»¥ä¸‹å‡ ç§ç±»åž‹ï¼š
         * * `inited` åˆå§‹çŠ¶æ€
         * * `queued` å·²ç»è¿›å…¥é˜Ÿåˆ—, ç­‰å¾…ä¸Šä¼ 
         * * `progress` ä¸Šä¼ ä¸­
         * * `complete` ä¸Šä¼ å®Œæˆã€‚
         * * `error` ä¸Šä¼ å‡ºé”™ï¼Œå¯é‡è¯•
         * * `interrupt` ä¸Šä¼ ä¸­æ–­ï¼Œå¯ç»­ä¼ ã€‚
         * * `invalid` æ–‡ä»¶ä¸åˆæ ¼ï¼Œä¸èƒ½é‡è¯•ä¸Šä¼ ã€‚ä¼šè‡ªåŠ¨ä»Žé˜Ÿåˆ—ä¸­ç§»é™¤ã€‚
         * * `cancelled` æ–‡ä»¶è¢«ç§»é™¤ã€‚
         * @property {Object} Status
         * @namespace File
         * @class File
         * @static
         */
        WUFile.Status = {
            INITED:     'inited',    // åˆå§‹çŠ¶æ€
            QUEUED:     'queued',    // å·²ç»è¿›å…¥é˜Ÿåˆ—, ç­‰å¾…ä¸Šä¼ 
            PROGRESS:   'progress',    // ä¸Šä¼ ä¸­
            ERROR:      'error',    // ä¸Šä¼ å‡ºé”™ï¼Œå¯é‡è¯•
            COMPLETE:   'complete',    // ä¸Šä¼ å®Œæˆã€‚
            CANCELLED:  'cancelled',    // ä¸Šä¼ å–æ¶ˆã€‚
            INTERRUPT:  'interrupt',    // ä¸Šä¼ ä¸­æ–­ï¼Œå¯ç»­ä¼ ã€‚
            INVALID:    'invalid'    // æ–‡ä»¶ä¸åˆæ ¼ï¼Œä¸èƒ½é‡è¯•ä¸Šä¼ ã€‚
        };
    
        return WUFile;
    });

    /**
     * @fileOverview é”™è¯¯ä¿¡æ¯
     */
    define( 'lib/dnd', [
        'base',
        'mediator',
        'runtime/client'
    ], function( Base, Mediator, RuntimeClent ) {
    
        var $ = Base.$;
    
        function DragAndDrop( opts ) {
            opts = this.options = $.extend({}, DragAndDrop.options, opts );
    
            opts.container = $( opts.container );
    
            if ( !opts.container.length ) {
                return;
            }
    
            RuntimeClent.call( this, 'DragAndDrop' );
        }
    
        DragAndDrop.options = {
            accept: null,
            disableGlobalDnd: true
        };
    
        Base.inherits( RuntimeClent, {
            constructor: DragAndDrop,
    
            init: function() {
                var me = this;
    
                me.connectRuntime( me.options, function() {
                    me.exec('init');
                });
            },
    
            destroy: function() {
                this.disconnectRuntime();
            }
        });
    
        Mediator.installTo( DragAndDrop.prototype );
    
        return DragAndDrop;
    });

    /**
     * @fileOverview é”™è¯¯ä¿¡æ¯
     */
    define( 'lib/filepaste', [
        'base',
        'mediator',
        'runtime/client'
    ], function( Base, Mediator, RuntimeClent ) {
    
        var $ = Base.$;
    
        function FilePaste( opts ) {
            opts = this.options = $.extend({}, opts );
            opts.container = $( opts.container || document.body );
            RuntimeClent.call( this, 'FilePaste' );
        }
    
        Base.inherits( RuntimeClent, {
            constructor: FilePaste,
    
            init: function() {
                var me = this;
    
                me.connectRuntime( me.options, function() {
                    me.exec('init');
                });
            },
    
            destroy: function() {
                this.exec('destroy');
                this.disconnectRuntime();
                this.off();
            }
        });
    
        Mediator.installTo( FilePaste.prototype );
    
        return FilePaste;
    });

    /**
     * @fileOverview Image
     */
    define( 'lib/image', [
        'base',
        'runtime/client',
        'lib/blob'
    ], function( Base, RuntimeClient, Blob ) {
        var $ = Base.$;
    
        // æž„é€ å™¨ã€‚
        function Image( opts ) {
            this.options = $.extend({}, Image.options, opts );
            RuntimeClient.call( this, 'Image' );
    
            this.on( 'load', function() {
                this._info = this.exec( 'info' );
                this._meta = this.exec( 'meta' );
            });
        }
    
        // é»˜è®¤é€‰é¡¹ã€‚
        Image.options = {
    
            // é»˜è®¤çš„å›¾ç‰‡å¤„ç†è´¨é‡
            quality: 90,
    
            // æ˜¯å¦è£å‰ª
            crop: false,
    
            // æ˜¯å¦ä¿ç•™å¤´éƒ¨ä¿¡æ¯
            preserveHeaders: true,
    
            // æ˜¯å¦å…è®¸æ”¾å¤§ã€‚
            allowMagnify: true
        };
    
        // ç»§æ‰¿RuntimeClient.
        Base.inherits( RuntimeClient, {
            constructor: Image,
    
            info: function( val ) {
    
                // setter
                if ( val ) {
                    this._info = val;
                    return this;
                }
    
                // getter
                return this._info;
            },
    
            meta: function( val ) {
    
                // setter
                if ( val ) {
                    this._meta = val;
                    return this;
                }
    
                // getter
                return this._meta;
            },
    
            loadFromBlob: function( blob ) {
                var me = this,
                    ruid = blob.getRuid();
    
                this.connectRuntime( ruid, function() {
                    me.exec( 'init', me.options );
                    me.exec( 'loadFromBlob', blob );
                });
            },
    
            resize: function() {
                var args = Base.slice( arguments );
                return this.exec.apply( this, [ 'resize' ].concat( args ) );
            },
    
            getAsDataUrl: function( type ) {
                return this.exec( 'getAsDataUrl', type );
            },
    
            getAsBlob: function( type ) {
                var blob = this.exec( 'getAsBlob', type );
    
                return new Blob( this.getRuid(), blob );
            }
        });
    
        return Image;
    });

    /**
     * @fileOverview Transport
     */
    define( 'lib/transport', [
        'base',
        'runtime/client',
        'mediator'
    ], function( Base, RuntimeClient, Mediator ) {
    
        var $ = Base.$;
    
        function Transport( opts ) {
            var me = this;
    
            opts = me.options = $.extend( true, {}, Transport.options, opts || {} );
            RuntimeClient.call( this, 'Transport' );
    
            this._blob = null;
            this._formData = opts.formData || {};
            this._headers = opts.headers || {};
    
            this.on( 'progress', this._timeout );
            this.on( 'load error', function() {
                me.trigger( 'progress', 1 );
                clearTimeout( me._timer );
            });
        }
    
        Transport.options = {
            server: '',
            method: 'POST',
    
            // è·¨åŸŸæ—¶ï¼Œæ˜¯å¦å…è®¸æºå¸¦cookie, åªæœ‰html5 runtimeæ‰æœ‰æ•ˆ
            withCredentials: false,
            fileVar: 'file',
            timeout: 2 * 60 * 1000,    // 2åˆ†é’Ÿ
            formData: {},
            headers: {},
            sendAsBinary: false
        };
    
        $.extend( Transport.prototype, {
    
            // æ·»åŠ Blob, åªèƒ½æ·»åŠ ä¸€æ¬¡ï¼Œæœ€åŽä¸€æ¬¡æœ‰æ•ˆã€‚
            appendBlob: function( key, blob, filename ) {
                var me = this,
                    opts = me.options;
    
                if ( me.getRuid() ) {
                    me.disconnectRuntime();
                }
    
                // è¿žæŽ¥åˆ°blobå½’å±žçš„åŒä¸€ä¸ªruntime.
                me.connectRuntime( blob.ruid, function() {
                    me.exec('init');
                });
    
                me._blob = blob;
                opts.fileVar = key || opts.fileVar;
                opts.filename = filename || opts.filename;
            },
    
            // æ·»åŠ å…¶ä»–å­—æ®µ
            append: function( key, value ) {
                if ( typeof key === 'object' ) {
                    $.extend( this._formData, key );
                } else {
                    this._formData[ key ] = value;
                }
            },
    
            setRequestHeader: function( key, value ) {
                if ( typeof key === 'object' ) {
                    $.extend( this._headers, key );
                } else {
                    this._headers[ key ] = value;
                }
            },
    
            send: function( method ) {
                this.exec( 'send', method );
                this._timeout();
            },
    
            abort: function() {
                clearTimeout( this._timer );
                return this.exec('abort');
            },
    
            destroy: function() {
                this.trigger('destroy');
                this.off();
                this.exec('destroy');
                this.disconnectRuntime();
            },
    
            getResponse: function() {
                return this.exec('getResponse');
            },
    
            getResponseAsJson: function() {
                return this.exec('getResponseAsJson');
            },
    
            getStatus: function() {
                return this.exec('getStatus');
            },
    
            _timeout: function() {
                var me = this,
                    duration = me.options.timeout;
    
                if ( !duration ) {
                    return;
                }
    
                clearTimeout( me._timer );
                me._timer = setTimeout(function() {
                    me.abort();
                    me.trigger( 'error', 'timeout' );
                }, duration );
            }
    
        });
    
        // è®©Transportå…·å¤‡äº‹ä»¶åŠŸèƒ½ã€‚
        Mediator.installTo( Transport.prototype );
    
        return Transport;
    });

    /**
     * @fileOverview æ–‡ä»¶é˜Ÿåˆ—
     */
    define( 'queue', [
        'base',
        'mediator',
        'file'
    ], function( Base, Mediator, WUFile ) {
    
        var $ = Base.$,
            STATUS = WUFile.Status;
    
        /**
         * æ–‡ä»¶é˜Ÿåˆ—, ç”¨æ¥å­˜å‚¨å„ä¸ªçŠ¶æ€ä¸­çš„æ–‡ä»¶ã€‚
         * @class Queue
         * @extends Mediator
         */
        function Queue() {
    
            /**
             * ç»Ÿè®¡æ–‡ä»¶æ•°ã€‚
             * * `numOfQueue` é˜Ÿåˆ—ä¸­çš„æ–‡ä»¶æ•°ã€‚
             * * `numOfSuccess` ä¸Šä¼ æˆåŠŸçš„æ–‡ä»¶æ•°
             * * `numOfCancel` è¢«ç§»é™¤çš„æ–‡ä»¶æ•°
             * * `numOfProgress` æ­£åœ¨ä¸Šä¼ ä¸­çš„æ–‡ä»¶æ•°
             * * `numOfUploadFailed` ä¸Šä¼ é”™è¯¯çš„æ–‡ä»¶æ•°ã€‚
             * * `numOfInvalid` æ— æ•ˆçš„æ–‡ä»¶æ•°ã€‚
             * @property {Object} stats
             */
            this.stats = {
                numOfQueue: 0,
                numOfSuccess: 0,
                numOfCancel: 0,
                numOfProgress: 0,
                numOfUploadFailed: 0,
                numOfInvalid: 0
            };
    
            // ä¸Šä¼ é˜Ÿåˆ—ï¼Œä»…åŒ…æ‹¬ç­‰å¾…ä¸Šä¼ çš„æ–‡ä»¶
            this._queue = [];
    
            // å­˜å‚¨æ‰€æœ‰æ–‡ä»¶
            this._map = {};
        }
    
        $.extend( Queue.prototype, {
    
            /**
             * å°†æ–°æ–‡ä»¶åŠ å…¥å¯¹é˜Ÿåˆ—å°¾éƒ¨
             *
             * @method append
             * @param  {File} file   æ–‡ä»¶å¯¹è±¡
             */
            append: function( file ) {
                this._queue.push( file );
                this._fileAdded( file );
                return this;
            },
    
            /**
             * å°†æ–°æ–‡ä»¶åŠ å…¥å¯¹é˜Ÿåˆ—å¤´éƒ¨
             *
             * @method prepend
             * @param  {File} file   æ–‡ä»¶å¯¹è±¡
             */
            prepend: function( file ) {
                this._queue.unshift( file );
                this._fileAdded( file );
                return this;
            },
    
            /**
             * èŽ·å–æ–‡ä»¶å¯¹è±¡
             *
             * @method getFile
             * @param  {String} fileId   æ–‡ä»¶ID
             * @return {File}
             */
            getFile: function( fileId ) {
                if ( typeof fileId !== 'string' ) {
                    return fileId;
                }
                return this._map[ fileId ];
            },
    
            /**
             * ä»Žé˜Ÿåˆ—ä¸­å–å‡ºä¸€ä¸ªæŒ‡å®šçŠ¶æ€çš„æ–‡ä»¶ã€‚
             * @grammar fetch( status ) => File
             * @method fetch
             * @param {String} status [æ–‡ä»¶çŠ¶æ€å€¼](#WebUploader:File:File.Status)
             * @return {File} [File](#WebUploader:File)
             */
            fetch: function( status ) {
                var len = this._queue.length,
                    i, file;
    
                status = status || STATUS.QUEUED;
    
                for ( i = 0; i < len; i++ ) {
                    file = this._queue[ i ];
    
                    if ( status === file.getStatus() ) {
                        return file;
                    }
                }
    
                return null;
            },
    
            /**
             * èŽ·å–æŒ‡å®šç±»åž‹çš„æ–‡ä»¶åˆ—è¡¨, åˆ—è¡¨ä¸­æ¯ä¸€ä¸ªæˆå‘˜ä¸º[File](#WebUploader:File)å¯¹è±¡ã€‚
             * @grammar getFiles( [status1[, status2 ...]] ) => Array
             * @method getFiles
             * @param {String} [status] [æ–‡ä»¶çŠ¶æ€å€¼](#WebUploader:File:File.Status)
             */
            getFiles: function() {
                var sts = [].slice.call( arguments, 0 ),
                    ret = [],
                    i = 0,
                    len = this._queue.length,
                    file;
    
                for ( ; i < len; i++ ) {
                    file = this._queue[ i ];
    
                    if ( sts.length && !~$.inArray( file.getStatus(), sts ) ) {
                        continue;
                    }
    
                    ret.push( file );
                }
    
                return ret;
            },
    
            _fileAdded: function( file ) {
                var me = this,
                    existing = this._map[ file.id ];
    
                if ( !existing ) {
                    this._map[ file.id ] = file;
    
                    file.on( 'statuschange', function( cur, pre ) {
                        me._onFileStatusChange( cur, pre );
                    });
                }
    
                file.setStatus( STATUS.QUEUED );
            },
    
            _onFileStatusChange: function( curStatus, preStatus ) {
                var stats = this.stats;
    
                switch ( preStatus ) {
                    case STATUS.PROGRESS:
                        stats.numOfProgress--;
                        break;
    
                    case STATUS.QUEUED:
                        stats.numOfQueue --;
                        break;
    
                    case STATUS.ERROR:
                        stats.numOfUploadFailed--;
                        break;
    
                    case STATUS.INVALID:
                        stats.numOfInvalid--;
                        break;
                }
    
                switch ( curStatus ) {
                    case STATUS.QUEUED:
                        stats.numOfQueue++;
                        break;
    
                    case STATUS.PROGRESS:
                        stats.numOfProgress++;
                        break;
    
                    case STATUS.ERROR:
                        stats.numOfUploadFailed++;
                        break;
    
                    case STATUS.COMPLETE:
                        stats.numOfSuccess++;
                        break;
    
                    case STATUS.CANCELLED:
                        stats.numOfCancel++;
                        break;
    
                    case STATUS.INVALID:
                        stats.numOfInvalid++;
                        break;
                }
            }
    
        });
    
        Mediator.installTo( Queue.prototype );
    
        return Queue;
    });

    /**
     * @fileOverview Runtimeç®¡ç†å™¨ï¼Œè´Ÿè´£Runtimeçš„é€‰æ‹©, è¿žæŽ¥
     */
    define( 'runtime/compbase', function() {
    
        function CompBase( owner, runtime ) {
    
            this.owner = owner;
            this.options = owner.options;
    
            this.getRuntime = function() {
                return runtime;
            };
    
            this.getRuid = function() {
                return runtime.uid;
            };
    
            this.trigger = function() {
                return owner.trigger.apply( owner, arguments );
            };
        }
    
        return CompBase;
    });

    /**
     * @fileOverview Html5Runtime
     */
    define( 'runtime/html5/runtime', [
        'base',
        'runtime/runtime',
        'runtime/compbase'
    ], function( Base, Runtime, CompBase ) {
    
        var type = 'html5',
            components = {};
    
        function Html5Runtime() {
            var pool = {},
                me = this,
                destory = this.destory;
    
            Runtime.apply( me, arguments );
            me.type = type;
    
    
            // è¿™ä¸ªæ–¹æ³•çš„è°ƒç”¨è€…ï¼Œå®žé™…ä¸Šæ˜¯RuntimeClient
            me.exec = function( comp, fn/*, args...*/) {
                var client = this,
                    uid = client.uid,
                    args = Base.slice( arguments, 2 ),
                    instance;
    
                if ( components[ comp ] ) {
                    instance = pool[ uid ] = pool[ uid ] ||
                            new components[ comp ]( client, me );
    
                    if ( instance[ fn ] ) {
                        return instance[ fn ].apply( instance, args );
                    }
                }
            };
    
            me.destory = function() {
                // @todo åˆ é™¤æ± å­ä¸­çš„æ‰€æœ‰å®žä¾‹
                return destory && destory.apply( this, arguments );
            };
        }
    
        Base.inherits( Runtime, {
            constructor: Html5Runtime,
    
            // ä¸éœ€è¦è¿žæŽ¥å…¶ä»–ç¨‹åºï¼Œç›´æŽ¥æ‰§è¡Œcallback
            init: function() {
                var me = this;
                setTimeout(function() {
                    me.trigger('ready');
                }, 1 );
            }
    
        });
    
        Html5Runtime.register = function( name, component ) {
            var klass = components[ name ] = Base.inherits( CompBase, component );
            return klass;
        };
    
        // æ³¨å†Œhtml5è¿è¡Œæ—¶ã€‚
        if ( window.Blob && window.FileReader && window.DataView ) {
            Runtime.addRuntime( type, Html5Runtime );
        }
    
        return Html5Runtime;
    });

    /**
     * @fileOverview Blob Htmlå®žçŽ°
     */
    define( 'runtime/html5/blob', [
        'runtime/html5/runtime',
        'lib/blob'
    ], function( Html5Runtime, Blob ) {
    
        return Html5Runtime.register( 'Blob', {
            slice: function( start, end ) {
                var blob = this.owner.source,
                    slice = blob.slice || blob.webkitSlice || blob.mozSlice;
    
                blob = slice.call( blob, start, end );
    
                return new Blob( this.getRuid(), blob );
            }
        });
    });

    /**
     * @fileOverview FilePaste
     */
    define( 'runtime/html5/dnd', [
        'base',
        'runtime/html5/runtime',
        'lib/file'
    ], function( Base, Html5Runtime, File ) {
    
        var $ = Base.$;
    
        return Html5Runtime.register( 'DragAndDrop', {
            init: function() {
                var elem = this.elem = this.options.container;
    
                this.dragEnterHandler = Base.bindFn( this._dragEnterHandler, this );
                this.dragOverHandler = Base.bindFn( this._dragOverHandler, this );
                this.dragLeaveHandler = Base.bindFn( this._dragLeaveHandler, this );
                this.dropHandler = Base.bindFn( this._dropHandler, this );
    
                elem.on( 'dragenter', this.dragEnterHandler );
                elem.on( 'dragover', this.dragOverHandler );
                elem.on( 'dragleave', this.dragLeaveHandler );
                elem.on( 'drop', this.dropHandler );
    
                if ( this.options.disableGlobalDnd ) {
                    $( document ).on( 'dragover', this.dragOverHandler );
                    $( document ).on( 'drop', this.dropHandler );
                }
            },
    
            _dragEnterHandler: function( e ) {
                this.elem.addClass('webuploader-dnd-over');
    
                e = e.originalEvent || e;
                e.dataTransfer.dropEffect = 'copy';
    
                return false;
            },
    
            _dragOverHandler: function( e ) {
                // åªå¤„ç†æ¡†å†…çš„ã€‚
                if ( !$.contains( this.elem.parent().get( 0 ), e.target ) ) {
                    return false;
                }
    
                this._dragEnterHandler.call( this, e );
    
                return false;
            },
    
            _dragLeaveHandler: function() {
                this.elem.removeClass('webuploader-dnd-over');
                return false;
            },
    
            _dropHandler: function( e ) {
                var results  = [],
                    promises = [],
                    me = this,
                    ruid = me.getRuid(),
                    items, files, dataTransfer, file, i, len, canAccessFolder;
    
                // åªå¤„ç†æ¡†å†…çš„ã€‚
                if ( !$.contains( me.elem.parent().get( 0 ), e.target ) ) {
                    return false;
                }
    
                e = e.originalEvent || e;
                dataTransfer = e.dataTransfer;
                items = dataTransfer.items;
                files = dataTransfer.files;
    
                canAccessFolder = !!(items && items[ 0 ].webkitGetAsEntry);
    
                for ( i = 0, len = files.length; i < len; i++ ) {
                    file = files[ i ];
                    if ( file.type ) {
                        results.push( file );
                    } else if ( !file.type && canAccessFolder ) {
                        promises.push( this._traverseDirectoryTree(
                                items[ i ].webkitGetAsEntry(), results ) );
                    }
                }
    
                Base.when.apply( Base, promises ).done(function() {
                    me.trigger( 'drop', $.map( results, function( file ) {
                        return new File( ruid, file );
                    }) );
                });
    
                this.elem.removeClass('webuploader-dnd-over');
                return false;
            },
    
            _traverseDirectoryTree: function( entry, results ) {
                var deferred = Base.Deferred(),
                    me = this;
    
                if ( entry.isFile ) {
                    entry.file(function( file ) {
                        file.type && results.push( file );
                        deferred.resolve( true );
                    });
                } else if ( entry.isDirectory ) {
                    entry.createReader().readEntries(function( entries ) {
                        var len = entries.length,
                            promises = [],
                            arr = [],    // ä¸ºäº†ä¿è¯é¡ºåºã€‚
                            i;
    
                        for ( i = 0; i < len; i++ ) {
                            promises.push( me._traverseDirectoryTree(
                                    entries[ i ], arr ) );
                        }
    
                        Base.when.apply( Base, promises ).then(function() {
                            results.push.apply( results, arr );
                            deferred.resolve( true );
                        }, deferred.reject );
                    });
                }
    
                return deferred.promise();
            },
    
            destroy: function() {
                var elem = this.elem;
    
                elem.off( 'dragenter', this.dragEnterHandler );
                elem.off( 'dragover', this.dragEnterHandler );
                elem.off( 'dragleave', this.dragLeaveHandler );
                elem.off( 'drop', this.dropHandler );
    
                if ( this.options.disableGlobalDnd ) {
                    $( document ).off( 'dragover', this.dragOverHandler );
                    $( document ).off( 'drop', this.dropHandler );
                }
            }
        });
    });

    /**
     * @fileOverview FilePaste
     */
    define( 'runtime/html5/filepaste', [
        'base',
        'runtime/html5/runtime',
        'lib/file'
    ], function( Base, Html5Runtime, File ) {
    
        return Html5Runtime.register( 'FilePaste', {
            init: function() {
                var opts = this.options,
                    elem = this.elem = opts.container,
                    accept = '.*',
                    arr, i, len, item;
    
                // accetpçš„mimeTypesä¸­ç”ŸæˆåŒ¹é…æ­£åˆ™ã€‚
                if ( opts.accept ) {
                    arr = [];
    
                    for ( i = 0, len = opts.accept.length; i < len; i++ ) {
                        item = opts.accept[ i ].mimeTypes;
                        item && arr.push( item );
                    }
    
                    if ( arr.length ) {
                        accept = arr.join(',');
                        accept = accept.replace( /,/g, '|' ).replace( /\*/g, '.*' );
                    }
                }
                this.accept = accept = new RegExp( accept, 'i' );
                this.hander = Base.bindFn( this._pasteHander, this );
                elem.on( 'paste', this.hander );
            },
    
            _pasteHander: function( e ) {
                var allowed = [],
                    ruid = this.getRuid(),
                    files, file, blob, i, len;
    
                e = e.originalEvent || e;
                e.preventDefault();
                e.stopPropagation();
    
                files = e.clipboardData.items;
    
                for ( i = 0, len = files.length; i < len; i++ ) {
                    file = files[ i ];
    
                    if ( !file.type || !(blob = file.getAsFile()) ||
                            blob.size < 6 ) {
                        continue;
                    }
    
                    allowed.push( new File( ruid, blob ) );
                }
    
                allowed.length && this.trigger( 'paste', allowed );
            },
    
            destroy: function() {
                this.elem.off( 'paste', this.hander );
            }
        });
    });

    /**
     * @fileOverview FilePicker
     */
    define( 'runtime/html5/filepicker', [
        'base',
        'runtime/html5/runtime'
    ], function( Base, Html5Runtime ) {
    
        var $ = Base.$;
    
        return Html5Runtime.register( 'FilePicker', {
            init: function() {
                var container = this.getRuntime().getContainer(),
                    me = this,
                    owner = me.owner,
                    opts = me.options,
                    lable = $( document.createElement('label') ),
                    input = $( document.createElement('input') ),
                    arr, i, len, mouseHandler;
    
                input.attr( 'type', 'file' );
    
                input.css({
                    position: 'absolute',
                    clip: 'rect(1px,1px,1px,1px)'
                });
    
                lable.on( 'click', function() {
                    input.trigger('click');
                });
    
                lable.css({
                    opacity: 0,
                    width: '100%',
                    height: '100%',
                    display: 'block',
                    cursor: 'pointer',
                    background: '#ffffff'
                });
    
                if ( opts.multiple ) {
                    input.attr( 'multiple', 'multiple' );
                }
    
                // @todo Firefoxä¸æ”¯æŒå•ç‹¬æŒ‡å®šåŽç¼€
                if ( opts.accept && opts.accept.length > 0 ) {
                    arr = [];
    
                    for ( i = 0, len = opts.accept.length; i < len; i++ ) {
                        arr.push( opts.accept[ i ].mimeTypes );
                    }
    
                    input.attr( 'accept', arr.join(',') );
                }
    
                container.append( input );
                container.append( lable );
    
                mouseHandler = function( e ) {
                    owner.trigger( e.type );
                };
    
                input.on( 'change', function( e ) {
                    var fn = arguments.callee,
                        clone;
    
                    me.files = e.target.files;
    
                    // reset input
                    clone = this.cloneNode( true );
                    this.parentNode.replaceChild( clone, this );
    
                    input.off();
                    input = $( clone ).on( 'change', fn )
                            .on( 'mouseenter mouseleave', mouseHandler );
    
                    owner.trigger('change');
                });
    
                lable.on( 'mouseenter mouseleave', mouseHandler );
    
            },
    
    
            getFiles: function() {
                return this.files;
            },
    
            destroy: function() {
                // todo
            }
        });
    });

    /**
     * Terms:
     *
     * Uint8Array, FileReader, BlobBuilder, atob, ArrayBuffer
     * @fileOverview ImageæŽ§ä»¶
     */
    define( 'runtime/html5/util', function() {
    
        var urlAPI = window.createObjectURL && window ||
                window.URL && URL.revokeObjectURL && URL ||
                window.webkitURL;
    
        return {
            createObjectURL: urlAPI && urlAPI.createObjectURL,
            revokeObjectURL: urlAPI && urlAPI.revokeObjectURL,
    
            dataURL2Blob: function( dataURI ) {
                var byteStr, intArray, ab, i, mimetype, parts;
    
                parts = dataURI.split(',');
    
                if ( ~parts[ 0 ].indexOf('base64') ) {
                    byteStr = atob( parts[ 1 ] );
                } else {
                    byteStr = decodeURIComponent( parts[ 1 ] );
                }
    
                ab = new ArrayBuffer( byteStr.length );
                intArray = new Uint8Array( ab );
    
                for ( i = 0; i < byteStr.length; i++ ) {
                    intArray[ i ] = byteStr.charCodeAt( i );
                }
    
                mimetype = parts[ 0 ].split(':')[ 1 ].split(';')[ 0 ];
    
                return new Blob([ ab ], {
                    type: mimetype
                });
            },
    
            dataURL2ArrayBuffer: function( dataURI ) {
                var byteStr, intArray, i, parts;
    
                parts = dataURI.split(',');
    
                if ( ~parts[ 0 ].indexOf('base64') ) {
                    byteStr = atob( parts[ 1 ] );
                } else {
                    byteStr = decodeURIComponent( parts[ 1 ] );
                }
    
                intArray = new Uint8Array( byteStr.length );
    
                for ( i = 0; i < byteStr.length; i++ ) {
                    intArray[ i ] = byteStr.charCodeAt( i );
                }
    
                return intArray.buffer;
            },
    
            arrayBufferToBlob: function( buffer, type ) {
                return new Blob([ buffer ], type ? { type: type } : {} );
            }
        };
    });

    /**
     * Terms:
     *
     * Uint8Array, FileReader, BlobBuilder, atob, ArrayBuffer
     * @fileOverview ImageæŽ§ä»¶
     */
    define( 'runtime/html5/imagemeta', [
        'runtime/html5/util'
    ], function( Util ) {
    
        var api;
    
        api = {
            parsers: {
                0xffe1: []
            },
    
            maxMetaDataSize: 262144,
    
            parse: function( blob, cb ) {
                var me = this,
                    fr = new FileReader();
    
                fr.onload = function() {
                    cb( false, me._parse( this.result ) );
                    fr = fr.onload = fr.onerror = null;
                };
    
                fr.onerror = function( e ) {
                    cb( e.message );
                    fr = fr.onload = fr.onerror = null;
                };
    
                blob = blob.slice( 0, me.maxMetaDataSize );
                fr.readAsArrayBuffer( blob.getSource() );
            },
    
            _parse: function( buffer, noParse ) {
                if ( buffer.byteLength < 6 ) {
                    return;
                }
    
                var dataview = new DataView( buffer ),
                    offset = 2,
                    maxOffset = dataview.byteLength - 4,
                    headLength = offset,
                    ret = {},
                    markerBytes, markerLength, parsers, i;
    
                if ( dataview.getUint16( 0 ) === 0xffd8 ) {
    
                    while ( offset < maxOffset ) {
                        markerBytes = dataview.getUint16( offset );
    
                        if ( markerBytes >= 0xffe0 && markerBytes <= 0xffef ||
                                markerBytes === 0xfffe ) {
    
                            markerLength = dataview.getUint16( offset + 2 ) + 2;
    
                            if ( offset + markerLength > dataview.byteLength ) {
                                break;
                            }
    
                            parsers = api.parsers[ markerBytes ];
    
                            if ( !noParse && parsers ) {
                                for ( i = 0; i < parsers.length; i += 1 ) {
                                    parsers[ i ].call( api, dataview, offset,
                                            markerLength, ret );
                                }
                            }
    
                            offset += markerLength;
                            headLength = offset;
                        } else {
                            break;
                        }
                    }
    
                    if ( headLength > 6 ) {
                        if ( buffer.slice ) {
                            ret.imageHead = buffer.slice( 2, headLength );
                        } else {
                            // Workaround for IE10, which does not yet
                            // support ArrayBuffer.slice:
                            ret.imageHead = new Uint8Array( buffer )
                                    .subarray( 2, headLength );
                        }
                    }
                }
    
                return ret;
            },
    
            updateImageHead: function( buffer, head ) {
                var data = this._parse( buffer, true ),
                    buf1, buf2, bodyoffset;
    
    
                bodyoffset = 2;
                if ( data.imageHead ) {
                    bodyoffset = 2 + data.imageHead.byteLength;
                }
    
                if ( buffer.slice ) {
                    buf2 = buffer.slice( bodyoffset );
                } else {
                    buf2 = new Uint8Array( buffer ).subarray( bodyoffset );
                }
    
                buf1 = new Uint8Array( head.byteLength + 2 + buf2.byteLength );
    
                buf1[ 0 ] = 0xFF;
                buf1[ 1 ] = 0xD8;
                buf1.set( new Uint8Array( head ), 2 );
                buf1.set( new Uint8Array( buf2 ), head.byteLength + 2 );
    
                return buf1.buffer;
            }
        };
    
        return api;
    });

    /**
     * @fileOverview Image
     */
    define( 'runtime/html5/image', [
        'runtime/html5/runtime',
        'runtime/html5/util',
        'runtime/html5/imagemeta'
    ], function( Html5Runtime, Util, ImageMeta ) {
    
        var BLANK = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D';
    
        return Html5Runtime.register( 'Image', {
    
            // flag: æ ‡è®°æ˜¯å¦è¢«ä¿®æ”¹è¿‡ã€‚
            modified: false,
    
            init: function( opts ) {
                var me = this,
                    img = new Image();
    
                img.onload = function() {
    
                    me._info = {
                        type: me.type,
                        width: this.width,
                        height: this.height
                    };
    
                    // è¯»å–metaä¿¡æ¯ã€‚
                    if ( !me._metas && ~'image/jpegimage/jpg'.indexOf( me.type ) ) {
                        ImageMeta.parse( me._blob, function( error, ret ) {
                            me._metas = ret;
                            me.owner.trigger('load');
                        });
                    } else {
                        me.owner.trigger('load');
                    }
                };
    
                img.onerror = function() {
                    me.owner.trigger('error');
                };
    
                me._img = img;
            },
    
            loadFromBlob: function( blob ) {
                var me = this,
                    img = me._img;
    
                me._blob = blob;
                me.type = blob.type;
                img.src = Util.createObjectURL( blob.getSource() );
                me.owner.once( 'load', function() {
                    Util.revokeObjectURL( img.src );
                });
            },
    
            resize: function( width, height ) {
                var canvas = this._canvas ||
                        (this._canvas = document.createElement('canvas'));
    
                this._resize( this._img, canvas, width, height );
                this._blob = null;    // æ²¡ç”¨äº†ï¼Œå¯ä»¥åˆ æŽ‰äº†ã€‚
                this.modified = true;
                this.owner.trigger('complete');
            },
    
            getAsBlob: function( type ) {
                var blob = this._blob,
                    opts = this.options,
                    canvas;
    
                type = type || this.type;
    
                // blobéœ€è¦é‡æ–°ç”Ÿæˆã€‚
                if ( this.modified || this.type !== type ) {
                    canvas = this._canvas;
    
                    if ( type === 'image/jpeg' ) {
                        blob = canvas.toDataURL( 'image/jpeg', opts.quality / 100 );
    
                        if ( opts.preserveHeaders && this._metas &&
                                this._metas.imageHead ) {
    
                            blob = Util.dataURL2ArrayBuffer( blob );
                            blob = ImageMeta.updateImageHead( blob,
                                    this._metas.imageHead );
                            blob = Util.arrayBufferToBlob( blob, type );
                            return blob;
                        }
                    } else {
                        blob = canvas.toDataURL( type );
                    }
    
                    blob = Util.dataURL2Blob( blob );
                }
    
                return blob;
            },
    
            getAsDataUrl: function( type ) {
                var opts = this.options;
    
                type = type || this.type;
    
                if ( type === 'image/jpeg' ) {
                    return this._canvas.toDataURL( type, opts.quality / 100 );
                } else {
                    return this._canvas.toDataURL( type );
                }
            },
    
            getOrientation: function() {
                return this._metas && this._metas.exif &&
                        this._metas.exif.get('Orientation') || 1;
            },
    
            info: function( val ) {
    
                // setter
                if ( val ) {
                    this._info = val;
                    return this;
                }
    
                // getter
                return this._info;
            },
    
            meta: function( val ) {
    
                // setter
                if ( val ) {
                    this._meta = val;
                    return this;
                }
    
                // getter
                return this._meta;
            },
    
            destroy: function() {
                var canvas = this._canvas;
                this._img.onload = null;
    
                if ( canvas ) {
                    canvas.getContext('2d')
                            .clearRect( 0, 0, canvas.width, canvas.height );
                    canvas.width = canvas.height = 0;
                    this._canvas = null;
                }
    
                // é‡Šæ”¾å†…å­˜ã€‚éžå¸¸é‡è¦ï¼Œå¦åˆ™é‡Šæ”¾ä¸äº†imageçš„å†…å­˜ã€‚
                this._img.src = BLANK;
                this._img = this._blob = null;
            },
    
            _resize: function( img, cvs, width, height ) {
                var opts = this.options,
                    naturalWidth = img.width,
                    naturalHeight = img.height,
                    orientation = this.getOrientation(),
                    scale, w, h, x, y;
    
                // values that require 90 degree rotation
                if ( ~[ 5, 6, 7, 8 ].indexOf( orientation ) ) {
    
                    // äº¤æ¢width, heightçš„å€¼ã€‚
                    width ^= height;
                    height ^= width;
                    width ^= height;
                }
    
                scale = Math[ opts.crop ? 'max' : 'min' ]( width / naturalWidth,
                        height / naturalHeight );
    
                // ä¸å…è®¸æ”¾å¤§ã€‚
                opts.allowMagnify || (scale = Math.min( 1, scale ));
    
                w = naturalWidth * scale;
                h = naturalHeight * scale;
    
                if ( opts.crop ) {
                    cvs.width = width;
                    cvs.height = height;
                } else {
                    cvs.width = w;
                    cvs.height = h;
                }
    
                x = (cvs.width - w) / 2;
                y = (cvs.height - h) / 2;
    
                opts.preserveHeaders || this._rotateToOrientaion( cvs, orientation );
    
                this._renderImageToCanvas( cvs, img, x, y, w, h );
            },
    
            _rotateToOrientaion: function( canvas, orientation ) {
                var width = canvas.width,
                    height = canvas.height,
                    ctx = canvas.getContext('2d');
    
                switch ( orientation ) {
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                        canvas.width = height;
                        canvas.height = width;
                        break;
                }
    
                switch ( orientation ) {
                    case 2:    // horizontal flip
                        ctx.translate( width, 0 );
                        ctx.scale( -1, 1 );
                        break;
    
                    case 3:    // 180 rotate left
                        ctx.translate( width, height );
                        ctx.rotate( Math.PI );
                        break;
    
                    case 4:    // vertical flip
                        ctx.translate( 0, height );
                        ctx.scale( 1, -1 );
                        break;
    
                    case 5:    // vertical flip + 90 rotate right
                        ctx.rotate( 0.5 * Math.PI );
                        ctx.scale( 1, -1 );
                        break;
    
                    case 6:    // 90 rotate right
                        ctx.rotate( 0.5 * Math.PI );
                        ctx.translate( 0, -height );
                        break;
    
                    case 7:    // horizontal flip + 90 rotate right
                        ctx.rotate( 0.5 * Math.PI );
                        ctx.translate( width, -height );
                        ctx.scale( -1, 1 );
                        break;
    
                    case 8:    // 90 rotate left
                        ctx.rotate( -0.5 * Math.PI );
                        ctx.translate( -width, 0 );
                        break;
                }
            },
    
            _renderImageToCanvas: function( canvas, img, x, y, w, h ) {
                canvas.getContext('2d').drawImage( img, x, y, w, h );
            }
    
            /*_renderImageToCanvas: (function() {
                var subsampled, vertSquashRatio;
    
                // Detect subsampling in loaded image.
                // In iOS, larger images than 2M pixels may be subsampled in rendering.
                function detectSubsampling(img) {
                    var iw = img.naturalWidth,
                        ih = img.naturalHeight;
                    if (iw * ih > 1024 * 1024) { // subsampling may happen over megapixel image
                        var canvas = document.createElement('canvas');
                        canvas.width = canvas.height = 1;
                        var ctx = canvas.getContext('2d');
                        ctx.drawImage(img, -iw + 1, 0);
                        // subsampled image becomes half smaller in rendering size.
                        // check alpha channel value to confirm image is covering edge pixel or not.
                        // if alpha value is 0 image is not covering, hence subsampled.
                        return ctx.getImageData(0, 0, 1, 1).data[3] === 0;
                    } else {
                        return false;
                    }
                }
    
    
                // Detecting vertical squash in loaded image.
                // Fixes a bug which squash image vertically while drawing into canvas for some images.
                function detectVerticalSquash(img, iw, ih) {
                    var canvas = document.createElement('canvas');
                    canvas.width = 1;
                    canvas.height = ih;
                    var ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    var data = ctx.getImageData(0, 0, 1, ih).data;
                    // search image edge pixel position in case it is squashed vertically.
                    var sy = 0;
                    var ey = ih;
                    var py = ih;
                    while (py > sy) {
                        var alpha = data[(py - 1) * 4 + 3];
                        if (alpha === 0) {
                            ey = py;
                        } else {
                            sy = py;
                        }
                        py = (ey + sy) >> 1;
                    }
                    var ratio = (py / ih);
                    return (ratio === 0) ? 1 : ratio;
                }
    
                return function( canvas, img, x, y, w, h ) {
    
    
                    var iw = img.naturalWidth, ih = img.naturalHeight;
                    var width = w, height = h;
                    var ctx = canvas.getContext('2d');
                    ctx.save();
    
                    subsampled = typeof subsampled === 'undefined' ? detectSubsampling( img ) : subsampled;
                    if ( subsampled ) {
                        iw /= 2;
                        ih /= 2;
                    }
    
                    var d = 1024; // size of tiling canvas
                    var tmpCanvas = document.createElement('canvas');
                    tmpCanvas.width = tmpCanvas.height = d;
                    var tmpCtx = tmpCanvas.getContext('2d');
    
                    vertSquashRatio = vertSquashRatio || detectVerticalSquash(img, iw, ih);
                    console.log( vertSquashRatio );
    
                    var dw = Math.ceil(d * width / iw);
                    var dh = Math.ceil(d * height / ih / vertSquashRatio);
                    var sy = 0;
                    var dy = 0;
                    while (sy < ih) {
                      var sx = 0;
                      var dx = 0;
                      while (sx < iw) {
                        tmpCtx.clearRect(0, 0, d, d);
                        tmpCtx.drawImage(img, x - sx, y - sy );
                        ctx.drawImage(tmpCanvas, 0, 0, d, d, dx, dy, dw, dh);
                        sx += d;
                        dx += dw;
                      }
                      sy += d;
                      dy += dh;
                    }
                    ctx.restore();
                    tmpCanvas = tmpCtx = null;
                };
            })()*/
        });
    });

    /**
     * ä»£ç æ¥è‡ªäºŽï¼šhttps://github.com/blueimp/JavaScript-Load-Image
     * æš‚æ—¶é¡¹ç›®ä¸­åªç”¨äº†orientation.
     *
     * åŽ»é™¤äº† Exif Sub IFD Pointer, GPS Info IFD Pointer, Exif Thumbnail.
     * @fileOverview EXIFè§£æž
     */
    
    // Sample
    // ====================================
    // Make : Apple
    // Model : iPhone 4S
    // Orientation : 1
    // XResolution : 72 [72/1]
    // YResolution : 72 [72/1]
    // ResolutionUnit : 2
    // Software : QuickTime 7.7.1
    // DateTime : 2013:09:01 22:53:55
    // ExifIFDPointer : 190
    // ExposureTime : 0.058823529411764705 [1/17]
    // FNumber : 2.4 [12/5]
    // ExposureProgram : Normal program
    // ISOSpeedRatings : 800
    // ExifVersion : 0220
    // DateTimeOriginal : 2013:09:01 22:52:51
    // DateTimeDigitized : 2013:09:01 22:52:51
    // ComponentsConfiguration : YCbCr
    // ShutterSpeedValue : 4.058893515764426
    // ApertureValue : 2.5260688216892597 [4845/1918]
    // BrightnessValue : -0.3126686601998395
    // MeteringMode : Pattern
    // Flash : Flash did not fire, compulsory flash mode
    // FocalLength : 4.28 [107/25]
    // SubjectArea : [4 values]
    // FlashpixVersion : 0100
    // ColorSpace : 1
    // PixelXDimension : 2448
    // PixelYDimension : 3264
    // SensingMethod : One-chip color area sensor
    // ExposureMode : 0
    // WhiteBalance : Auto white balance
    // FocalLengthIn35mmFilm : 35
    // SceneCaptureType : Standard
    define( 'runtime/html5/imagemeta/exif', [
        'base',
        'runtime/html5/imagemeta'
    ], function( Base, ImageMeta ) {
    
        var EXIF = {};
    
        EXIF.ExifMap = function() {
            return this;
        };
    
        EXIF.ExifMap.prototype.map = {
            'Orientation': 0x0112
        };
    
        EXIF.ExifMap.prototype.get = function( id ) {
            return this[ id ] || this[ this.map[ id ] ];
        };
    
        EXIF.exifTagTypes = {
            // byte, 8-bit unsigned int:
            1: {
                getValue: function( dataView, dataOffset ) {
                    return dataView.getUint8( dataOffset );
                },
                size: 1
            },
    
            // ascii, 8-bit byte:
            2: {
                getValue: function( dataView, dataOffset ) {
                    return String.fromCharCode( dataView.getUint8( dataOffset ) );
                },
                size: 1,
                ascii: true
            },
    
            // short, 16 bit int:
            3: {
                getValue: function( dataView, dataOffset, littleEndian ) {
                    return dataView.getUint16( dataOffset, littleEndian );
                },
                size: 2
            },
    
            // long, 32 bit int:
            4: {
                getValue: function( dataView, dataOffset, littleEndian ) {
                    return dataView.getUint32( dataOffset, littleEndian );
                },
                size: 4
            },
    
            // rational = two long values,
            // first is numerator, second is denominator:
            5: {
                getValue: function( dataView, dataOffset, littleEndian ) {
                    return dataView.getUint32( dataOffset, littleEndian ) /
                        dataView.getUint32( dataOffset + 4, littleEndian );
                },
                size: 8
            },
    
            // slong, 32 bit signed int:
            9: {
                getValue: function( dataView, dataOffset, littleEndian ) {
                    return dataView.getInt32( dataOffset, littleEndian );
                },
                size: 4
            },
    
            // srational, two slongs, first is numerator, second is denominator:
            10: {
                getValue: function( dataView, dataOffset, littleEndian ) {
                    return dataView.getInt32( dataOffset, littleEndian ) /
                        dataView.getInt32( dataOffset + 4, littleEndian );
                },
                size: 8
            }
        };
    
        // undefined, 8-bit byte, value depending on field:
        EXIF.exifTagTypes[ 7 ] = EXIF.exifTagTypes[ 1 ];
    
        EXIF.getExifValue = function( dataView, tiffOffset, offset, type, length,
                littleEndian ) {
    
            var tagType = EXIF.exifTagTypes[ type ],
                tagSize, dataOffset, values, i, str, c;
    
            if ( !tagType ) {
                Base.log('Invalid Exif data: Invalid tag type.');
                return;
            }
    
            tagSize = tagType.size * length;
    
            // Determine if the value is contained in the dataOffset bytes,
            // or if the value at the dataOffset is a pointer to the actual data:
            dataOffset = tagSize > 4 ? tiffOffset + dataView.getUint32( offset + 8,
                    littleEndian ) : (offset + 8);
    
            if ( dataOffset + tagSize > dataView.byteLength ) {
                Base.log('Invalid Exif data: Invalid data offset.');
                return;
            }
    
            if ( length === 1 ) {
                return tagType.getValue( dataView, dataOffset, littleEndian );
            }
    
            values = [];
    
            for ( i = 0; i < length; i += 1 ) {
                values[ i ] = tagType.getValue( dataView,
                        dataOffset + i * tagType.size, littleEndian );
            }
    
            if ( tagType.ascii ) {
                str = '';
    
                // Concatenate the chars:
                for ( i = 0; i < values.length; i += 1 ) {
                    c = values[ i ];
    
                    // Ignore the terminating NULL byte(s):
                    if ( c === '\u0000' ) {
                        break;
                    }
                    str += c;
                }
    
                return str;
            }
            return values;
        };
    
        EXIF.parseExifTag = function( dataView, tiffOffset, offset, littleEndian,
                data ) {
    
            var tag = dataView.getUint16( offset, littleEndian );
            data.exif[ tag ] = EXIF.getExifValue( dataView, tiffOffset, offset,
                    dataView.getUint16( offset + 2, littleEndian ),    // tag type
                    dataView.getUint32( offset + 4, littleEndian ),    // tag length
                    littleEndian );
        };
    
        EXIF.parseExifTags = function( dataView, tiffOffset, dirOffset,
                littleEndian, data ) {
    
            var tagsNumber, dirEndOffset, i;
    
            if ( dirOffset + 6 > dataView.byteLength ) {
                Base.log('Invalid Exif data: Invalid directory offset.');
                return;
            }
    
            tagsNumber = dataView.getUint16( dirOffset, littleEndian );
            dirEndOffset = dirOffset + 2 + 12 * tagsNumber;
    
            if ( dirEndOffset + 4 > dataView.byteLength ) {
                Base.log('Invalid Exif data: Invalid directory size.');
                return;
            }
    
            for ( i = 0; i < tagsNumber; i += 1 ) {
                this.parseExifTag( dataView, tiffOffset,
                        dirOffset + 2 + 12 * i,    // tag offset
                        littleEndian, data );
            }
    
            // Return the offset to the next directory:
            return dataView.getUint32( dirEndOffset, littleEndian );
        };
    
        // EXIF.getExifThumbnail = function(dataView, offset, length) {
        //     var hexData,
        //         i,
        //         b;
        //     if (!length || offset + length > dataView.byteLength) {
        //         Base.log('Invalid Exif data: Invalid thumbnail data.');
        //         return;
        //     }
        //     hexData = [];
        //     for (i = 0; i < length; i += 1) {
        //         b = dataView.getUint8(offset + i);
        //         hexData.push((b < 16 ? '0' : '') + b.toString(16));
        //     }
        //     return 'data:image/jpeg,%' + hexData.join('%');
        // };
    
        EXIF.parseExifData = function( dataView, offset, length, data ) {
    
            var tiffOffset = offset + 10,
                littleEndian, dirOffset;
    
            // Check for the ASCII code for "Exif" (0x45786966):
            if ( dataView.getUint32( offset + 4 ) !== 0x45786966 ) {
                // No Exif data, might be XMP data instead
                return;
            }
            if ( tiffOffset + 8 > dataView.byteLength ) {
                Base.log('Invalid Exif data: Invalid segment size.');
                return;
            }
    
            // Check for the two null bytes:
            if ( dataView.getUint16( offset + 8 ) !== 0x0000 ) {
                Base.log('Invalid Exif data: Missing byte alignment offset.');
                return;
            }
    
            // Check the byte alignment:
            switch ( dataView.getUint16( tiffOffset ) ) {
                case 0x4949:
                    littleEndian = true;
                    break;
    
                case 0x4D4D:
                    littleEndian = false;
                    break;
    
                default:
                    Base.log('Invalid Exif data: Invalid byte alignment marker.');
                    return;
            }
    
            // Check for the TIFF tag marker (0x002A):
            if ( dataView.getUint16( tiffOffset + 2, littleEndian ) !== 0x002A ) {
                Base.log('Invalid Exif data: Missing TIFF marker.');
                return;
            }
    
            // Retrieve the directory offset bytes, usually 0x00000008 or 8 decimal:
            dirOffset = dataView.getUint32( tiffOffset + 4, littleEndian );
            // Create the exif object to store the tags:
            data.exif = new EXIF.ExifMap();
            // Parse the tags of the main image directory and retrieve the
            // offset to the next directory, usually the thumbnail directory:
            dirOffset = EXIF.parseExifTags( dataView, tiffOffset,
                    tiffOffset + dirOffset, littleEndian, data );
    
            // å°è¯•è¯»å–ç¼©ç•¥å›¾
            // if ( dirOffset ) {
            //     thumbnailData = {exif: {}};
            //     dirOffset = EXIF.parseExifTags(
            //         dataView,
            //         tiffOffset,
            //         tiffOffset + dirOffset,
            //         littleEndian,
            //         thumbnailData
            //     );
    
            //     // Check for JPEG Thumbnail offset:
            //     if (thumbnailData.exif[0x0201]) {
            //         data.exif.Thumbnail = EXIF.getExifThumbnail(
            //             dataView,
            //             tiffOffset + thumbnailData.exif[0x0201],
            //             thumbnailData.exif[0x0202] // Thumbnail data length
            //         );
            //     }
            // }
        };
    
        ImageMeta.parsers[ 0xffe1 ].push( EXIF.parseExifData );
        return EXIF;
    });

    /**
     * @fileOverview Transport
     * @todo æ”¯æŒchunkedä¼ è¾“ï¼Œä¼˜åŠ¿ï¼š
     * å¯ä»¥å°†å¤§æ–‡ä»¶åˆ†æˆå°å—ï¼ŒæŒ¨ä¸ªä¼ è¾“ï¼Œå¯ä»¥æé«˜å¤§æ–‡ä»¶æˆåŠŸçŽ‡ï¼Œå½“å¤±è´¥çš„æ—¶å€™ï¼Œä¹Ÿåªéœ€è¦é‡ä¼ é‚£å°éƒ¨åˆ†ï¼Œ
     * è€Œä¸éœ€è¦é‡å¤´å†ä¼ ä¸€æ¬¡ã€‚å¦å¤–æ–­ç‚¹ç»­ä¼ ä¹Ÿéœ€è¦ç”¨chunkedæ–¹å¼ã€‚
     */
    define( 'runtime/html5/transport', [
        'base',
        'runtime/html5/runtime'
    ], function( Base, Html5Runtime ) {
    
        var noop = Base.noop,
            $ = Base.$;
    
        return Html5Runtime.register( 'Transport', {
            init: function() {
                this._status = 0;
                this._response = null;
            },
    
            send: function() {
                var owner = this.owner,
                    opts = this.options,
                    xhr = this._initAjax(),
                    blob = owner._blob,
                    server = opts.server,
                    formData, binary;
    
                if ( opts.sendAsBinary ) {
                    server += (/\?/.test( server ) ? '&' : '?') +
                            $.param( owner._formData );
    
                    binary = blob.getSource();
                } else {
                    formData = new FormData();
                    $.each( owner._formData, function( k, v ) {
                        formData.append( k, v );
                    });
    
                    formData.append( opts.fileVar, blob.getSource(),
                            opts.filename || owner._formData.name || '' );
                }
    
                if ( opts.withCredentials && 'withCredentials' in xhr ) {
                    xhr.open( opts.method, server, true );
                    xhr.withCredentials = true;
                } else {
                    xhr.open( opts.method, server );
                }
    
                this._setRequestHeader( xhr, opts.headers );
                binary && xhr.overrideMimeType('application/octet-stream');
                xhr.send( binary || formData );
            },
    
            getResponse: function() {
                return this._response;
            },
    
            getResponseAsJson: function() {
                return this._parseJson( this._response );
            },
    
            getStatus: function() {
                return this._status;
            },
    
            abort: function() {
                var xhr = this._xhr;
    
                if ( xhr ) {
                    xhr.upload.onprogress = noop;
                    xhr.onreadystatechange = noop;
                    xhr.abort();
    
                    this._xhr = xhr = null;
                }
            },
    
            destroy: function() {
                this.abort();
            },
    
            _initAjax: function() {
                var me = this,
                    xhr = new XMLHttpRequest(),
                    opts = this.options;
    
                if ( opts.withCredentials && !('withCredentials' in xhr) &&
                        typeof XDomainRequest !== 'undefined' ) {
                    xhr = new XDomainRequest();
                }
    
                xhr.upload.onprogress = function( e ) {
                    var percentage = 0;
    
                    if ( e.lengthComputable ) {
                        percentage = e.loaded / e.total;
                    }
    
                    return me.trigger( 'progress', percentage );
                };
    
                xhr.onreadystatechange = function() {
    
                    if ( xhr.readyState !== 4 ) {
                        return;
                    }
    
                    xhr.upload.onprogress = noop;
                    xhr.onreadystatechange = noop;
                    me._xhr = null;
    
                    // åªè€ƒè™‘200çš„æƒ…å†µ
                    if ( xhr.status === 200 ) {
                        me._response = xhr.responseText;
                        return me.trigger('load');
                    }
    
                    me._status = xhr.status;
                    xhr = null;
    
                    return me.trigger( 'error', me._status ? 'http' : 'abort' );
                };
    
                me._xhr = xhr;
                return xhr;
            },
    
            _setRequestHeader: function( xhr, headers ) {
                $.each( headers, function( key, val ) {
                    xhr.setRequestHeader( key, val );
                });
            },
    
            _parseJson: function( str ) {
                var json;
    
                try {
                    json = JSON.parse( str );
                } catch ( ex ) {
                    json = {};
                }
    
                return json;
            }
        });
    });

    /**
     * @fileOverview DragAndDrop Widgetã€‚
     */
    define( 'widgets/filednd', [
        'base',
        'uploader',
        'lib/dnd',
        'widgets/widget'
    ], function( Base, Uploader, Dnd ) {
    
        Uploader.options.dnd = '';
    
        /**
         * @property {Selector} [dnd=undefined]  æŒ‡å®šDrag And Dropæ‹–æ‹½çš„å®¹å™¨ï¼Œå¦‚æžœä¸æŒ‡å®šï¼Œåˆ™ä¸å¯åŠ¨ã€‚
         * @namespace options
         * @for Uploader
         */
        return Uploader.register({
            init: function( opts ) {
    
                if ( !opts.dnd || this.request('predict-runtime-type') !== 'html5' ) {
                    return;
                }
    
                var me = this,
                    deferred = Base.Deferred(),
                    options = $.extend({}, {
                        container: opts.dnd,
                        accept: opts.accept
                    }),
                    dnd;
    
                dnd = new Dnd( options );
    
                dnd.once( 'ready', deferred.resolve );
                dnd.on( 'drop', function( files ) {
                    me.request( 'add-file', [ files ]);
                });
                dnd.init();
    
                return deferred.promise();
            }
        });
    });

    /**
     * @fileOverview ç»„ä»¶åŸºç±»ã€‚
     */
    define( 'widgets/filepaste', [
        'base',
        'uploader',
        'lib/filepaste',
        'widgets/widget'
    ], function( Base, Uploader, FilePaste ) {
    
        /**
         * @property {Selector} [paste=undefined]  æŒ‡å®šç›‘å¬pasteäº‹ä»¶çš„å®¹å™¨ï¼Œå¦‚æžœä¸æŒ‡å®šï¼Œä¸å¯ç”¨æ­¤åŠŸèƒ½ã€‚æ­¤åŠŸèƒ½ä¸ºé€šè¿‡ç²˜è´´æ¥æ·»åŠ æˆªå±çš„å›¾ç‰‡ã€‚å»ºè®®è®¾ç½®ä¸º`document.body`.
         * @namespace options
         * @for Uploader
         */
        return Uploader.register({
            init: function( opts ) {
    
                if ( !opts.paste || this.request('predict-runtime-type') !== 'html5' ) {
                    return;
                }
    
                var me = this,
                    deferred = Base.Deferred(),
                    options = $.extend({}, {
                        container: opts.paste,
                        accept: opts.accept
                    }),
                    paste;
    
                paste = new FilePaste( options );
    
                paste.once( 'ready', deferred.resolve );
                paste.on( 'paste', function( files ) {
                    me.owner.request( 'add-file', [ files ]);
                });
                paste.init();
    
                return deferred.promise();
            }
        });
    });

    /**
     * @fileOverview å›¾ç‰‡æ“ä½œ, è´Ÿè´£é¢„è§ˆå›¾ç‰‡å’Œä¸Šä¼ å‰åŽ‹ç¼©å›¾ç‰‡
     */
    define( 'widgets/image', [
        'base',
        'uploader',
        'lib/image',
        'widgets/widget'
    ], function( Base, Uploader, Image ) {
    
        var $ = Base.$,
            throttle;
    
        // æ ¹æ®è¦å¤„ç†çš„æ–‡ä»¶å¤§å°æ¥èŠ‚æµï¼Œä¸€æ¬¡ä¸èƒ½å¤„ç†å¤ªå¤šï¼Œä¼šå¡ã€‚
        throttle = (function( max ) {
            var occupied = 0,
                waiting = [],
                tick = function() {
                    var item;
    
                    while( waiting.length && occupied < max ) {
                        item = waiting.shift();
                        occupied += item[ 0 ];
                        item[ 1 ]();
                    }
                };
    
            return function( emiter, size, cb ) {
                waiting.push( [ size, cb ] );
                emiter.once( 'destroy', function() {
                    occupied -= size;
                    setTimeout( tick, 1 );
                } );
                setTimeout( tick, 1 );
            }
        })( 5 * 1024 * 1024 );
    
        $.extend( Uploader.options, {
    
            /**
             * @property {Object} [thumb]
             * @namespace options
             * @for Uploader
             * @description é…ç½®ç”Ÿæˆç¼©ç•¥å›¾çš„é€‰é¡¹ã€‚
             *
             * é»˜è®¤ä¸ºï¼š
             *
             * ```javascript
             * {
             *     width: 110,
             *     height: 110,
             *
             *     // å›¾ç‰‡è´¨é‡ï¼Œåªæœ‰typeä¸º`image/jpeg`çš„æ—¶å€™æ‰æœ‰æ•ˆã€‚
             *     quality: 70,
             *
             *     // æ˜¯å¦å…è®¸æ”¾å¤§ï¼Œå¦‚æžœæƒ³è¦ç”Ÿæˆå°å›¾çš„æ—¶å€™ä¸å¤±çœŸï¼Œæ­¤é€‰é¡¹åº”è¯¥è®¾ç½®ä¸ºfalse.
             *     allowMagnify: true,
             *
             *     // æ˜¯å¦å…è®¸è£å‰ªã€‚
             *     crop: true,
             *
             *     // æ˜¯å¦ä¿ç•™å¤´éƒ¨metaä¿¡æ¯ã€‚
             *     preserveHeaders: false,
             *
             *     // ä¸ºç©ºçš„è¯åˆ™ä¿ç•™åŽŸæœ‰å›¾ç‰‡æ ¼å¼ã€‚
             *     // å¦åˆ™å¼ºåˆ¶è½¬æ¢æˆæŒ‡å®šçš„ç±»åž‹ã€‚
             *     type: 'image/jpeg'
             * }
             * ```
             */
            thumb: {
                width: 110,
                height: 110,
                quality: 70,
                allowMagnify: true,
                crop: true,
                preserveHeaders: false,
    
                // ä¸ºç©ºçš„è¯åˆ™ä¿ç•™åŽŸæœ‰å›¾ç‰‡æ ¼å¼ã€‚
                // å¦åˆ™å¼ºåˆ¶è½¬æ¢æˆæŒ‡å®šçš„ç±»åž‹ã€‚
                type: 'image/jpeg'
            },
    
            /**
             * @property {Object} [compress]
             * @namespace options
             * @for Uploader
             * @description é…ç½®åŽ‹ç¼©çš„å›¾ç‰‡çš„é€‰é¡¹ã€‚å¦‚æžœæ­¤é€‰é¡¹ä¸º`false`, åˆ™å›¾ç‰‡åœ¨ä¸Šä¼ å‰ä¸è¿›è¡ŒåŽ‹ç¼©ã€‚
             *
             * é»˜è®¤ä¸ºï¼š
             *
             * ```javascript
             * {
             *     width: 1600,
             *     height: 1600,
             *
             *     // å›¾ç‰‡è´¨é‡ï¼Œåªæœ‰typeä¸º`image/jpeg`çš„æ—¶å€™æ‰æœ‰æ•ˆã€‚
             *     quality: 90,
             *
             *     // æ˜¯å¦å…è®¸æ”¾å¤§ï¼Œå¦‚æžœæƒ³è¦ç”Ÿæˆå°å›¾çš„æ—¶å€™ä¸å¤±çœŸï¼Œæ­¤é€‰é¡¹åº”è¯¥è®¾ç½®ä¸ºfalse.
             *     allowMagnify: false,
             *
             *     // æ˜¯å¦å…è®¸è£å‰ªã€‚
             *     crop: false,
             *
             *     // æ˜¯å¦ä¿ç•™å¤´éƒ¨metaä¿¡æ¯ã€‚
             *     preserveHeaders: true
             * }
             * ```
             */
            compress: {
                width: 1600,
                height: 1600,
                quality: 90,
                allowMagnify: false,
                crop: false,
                preserveHeaders: true
            }
        });
    
        return Uploader.register({
            'make-thumb': 'makeThumb',
            'before-send-file': 'compressImage'
        }, {
    
    
            /**
             * ç”Ÿæˆç¼©ç•¥å›¾ï¼Œæ­¤è¿‡ç¨‹ä¸ºå¼‚æ­¥ï¼Œæ‰€ä»¥éœ€è¦ä¼ å…¥`callback`ã€‚
             * é€šå¸¸æƒ…å†µåœ¨å›¾ç‰‡åŠ å…¥é˜Ÿé‡ŒåŽè°ƒç”¨æ­¤æ–¹æ³•æ¥ç”Ÿæˆé¢„è§ˆå›¾ä»¥å¢žå¼ºäº¤äº’æ•ˆæžœã€‚
             * @method makeThumb
             * @grammar makeThumb( file, cb ) => undefined
             * @grammar makeThumb( file, cb, width, height ) => undefined
             * @for Uploader
             * @example
             *
             * uploader.on( 'fileQueued', function( file ) {
             *     var $li = ...;
             *
             *     uploader.makeThumb( file, function( error, ret ) {
             *         if ( error ) {
             *             $li.text('é¢„è§ˆé”™è¯¯');
             *         } else {
             *             $li.append('<img alt="" src="' + ret + '" />');
             *         }
             *     });
             *
             * });
             */
            makeThumb: function( file, cb, width, height ) {
                var opts, image;
    
                file = this.request( 'get-file', file );
    
                // åªé¢„è§ˆå›¾ç‰‡æ ¼å¼ã€‚
                if ( !file.type.match( /^image/ ) ) {
                    cb( true );
                    return;
                }
    
                opts = $.extend( {}, this.options.thumb );
    
                // å¦‚æžœä¼ å…¥çš„æ˜¯object.
                if ( $.isPlainObject( width ) ) {
                    opts = $.extend( opts, width );
                    width = null;
                }
    
                width = width || opts.width;
                height = height || opts.height;
    
                image = new Image( opts );
    
                image.once( 'load', function() {
                    file._info = file._info || image.info();
                    file._meta = file._meta || image.meta();
                    image.resize( width, height );
                });
    
                image.once( 'complete', function() {
                    cb( false, image.getAsDataUrl( opts.type ) );
                    image.destroy();
                });
    
                image.once( 'error', function() {
                    cb( true );
                    image.destroy();
                });
    
                throttle( image, file.source.size, function() {
                    file._info && image.info( file._info );
                    file._meta && image.meta( file._meta );
                    image.loadFromBlob( file.source );
                });
            },
    
            compressImage: function( file ) {
                var opts = this.options.compress || this.options.resize,
                    compressSize = opts && opts.compressSize || 300 * 1024,
                    image, deferred;
    
                file = this.request( 'get-file', file );
    
                // åªé¢„è§ˆå›¾ç‰‡æ ¼å¼ã€‚
                if ( !opts || !~'image/jpeg,image/jpg'.indexOf( file.type ) ||
                        file.size < compressSize ||
                        file._compressed ) {
                    return;
                }
    
                opts = $.extend( {}, opts );
                deferred = Base.Deferred();
    
                image = new Image( opts );
    
                deferred.always(function() {
                    image.destroy();
                    image = null;
                });
                image.once( 'error', deferred.reject );
                image.once( 'load', function() {
                    file._info = file._info || image.info();
                    file._meta = file._meta || image.meta();
                    image.resize( opts.width, opts.height );
                });
    
                image.once( 'complete', function() {
                    var blob, size;
    
                    blob = image.getAsBlob( opts.type );
                    size = file.size;
    
                    // å¦‚æžœåŽ‹ç¼©åŽï¼Œæ¯”åŽŸæ¥è¿˜å¤§åˆ™ä¸ç”¨åŽ‹ç¼©åŽçš„ã€‚
                    if ( blob.size < size ) {
                        // file.source.destroy && file.source.destroy();
                        file.source = blob;
                        file.size = blob.size;
    
                        file.trigger( 'resize', blob.size, size );
                    }
    
                    // æ ‡è®°ï¼Œé¿å…é‡å¤åŽ‹ç¼©ã€‚
                    file._compressed = true;
                    deferred.resolve( true );
                });
    
                file._info && image.info( file._info );
                file._meta && image.meta( file._meta );
    
                image.loadFromBlob( file.source );
                return deferred.promise();
            }
        });
    });

    /**
     * @fileOverview é˜Ÿåˆ—
     */
    define( 'widgets/queue', [
        'base',
        'uploader',
        'queue',
        'file',
        'widgets/widget'
    ], function( Base, Uploader, Queue, WUFile ) {
    
        var $ = Base.$,
            Status = WUFile.Status;
    
        return Uploader.register({
            'add-file': 'addFiles',
            'get-file': 'getFile',
            'fetch-file': 'fetchFile',
            'get-stats': 'getStats',
            'get-files': 'getFiles',
            'remove-file': 'removeFile',
            'retry': 'retry'
        }, {
    
            init: function( opts ) {
                var len, i, item, arr, accept;
    
                if ( $.isPlainObject( opts.accept ) ) {
                    opts.accept = [ opts.accept ];
                }
    
                // acceptä¸­çš„ä¸­ç”ŸæˆåŒ¹é…æ­£åˆ™ã€‚
                if ( opts.accept ) {
                    arr = [];
    
                    for ( i = 0, len = opts.accept.length; i < len; i++ ) {
                        item = opts.accept[ i ].extensions;
                        item && arr.push( item );
                    }
    
                    if ( arr.length ) {
                        accept = arr.join(',')
                                .replace( /,/g, '$|' )
                                .replace( /\*/g, '.*' );
                    }
    
                    this.accept = new RegExp( accept, 'i' );
                }
    
                this.queue = new Queue();
                this.stats = this.queue.stats;
            },
    
            /**
             * @event beforeFileQueued
             * @param {File} file Fileå¯¹è±¡
             * @description å½“æ–‡ä»¶è¢«åŠ å…¥é˜Ÿåˆ—ä¹‹å‰è§¦å‘ï¼Œæ­¤äº‹ä»¶çš„handlerè¿”å›žå€¼ä¸º`false`ï¼Œåˆ™æ­¤æ–‡ä»¶ä¸ä¼šè¢«æ·»åŠ è¿›å…¥é˜Ÿåˆ—ã€‚
             * @for  Uploader
             */
    
            /**
             * @event fileQueued
             * @param {File} file Fileå¯¹è±¡
             * @description å½“æ–‡ä»¶è¢«åŠ å…¥é˜Ÿåˆ—ä»¥åŽè§¦å‘ã€‚
             * @for  Uploader
             */
    
    
            _addFile: function( file ) {
                var me = this;
    
                if ( !file || file.size < 6 || me.accept &&
                        !me.accept.test( file.name ) ) {
                    return;
                }
    
                if ( !(file instanceof WUFile) ) {
                    file = new WUFile( file );
                }
    
                if ( !me.owner.trigger( 'beforeFileQueued', file ) ) {
                    return;
                }
    
                me.queue.append( file );
                me.owner.trigger( 'fileQueued', file );
                return file;
            },
    
            getFile: function( fileId ) {
                return this.queue.getFile( fileId );
            },
    
            /**
             * @event filesQueued
             * @param {File} files æ•°ç»„ï¼Œå†…å®¹ä¸ºåŽŸå§‹File(lib/Fileï¼‰å¯¹è±¡ã€‚
             * @description å½“ä¸€æ‰¹æ–‡ä»¶æ·»åŠ è¿›é˜Ÿåˆ—ä»¥åŽè§¦å‘ã€‚
             * @for  Uploader
             */
            addFiles: function( files ) {
                var me = this;
    
                if ( !files.length ) {
                    files = [ files ];
                }
    
                files = $.map( files, function( file ) {
                    return me._addFile( file );
                });
    
                me.owner.trigger( 'filesQueued', files );
    
                if ( me.options.auto ) {
                    me.request('start-upload');
                }
            },
    
            getStats: function() {
                return this.stats;
            },
    
            /**
             * @event fileDequeued
             * @param {File} file Fileå¯¹è±¡
             * @description å½“æ–‡ä»¶è¢«ç§»é™¤é˜Ÿåˆ—åŽè§¦å‘ã€‚
             * @for  Uploader
             */
    
            /**
             * @method removeFile
             * @grammar removeFile( file ) => undefined
             * @grammar removeFile( id ) => undefined
             * @param {File|id} file Fileå¯¹è±¡æˆ–è¿™Fileå¯¹è±¡çš„id
             * @description ç§»é™¤æŸä¸€æ–‡ä»¶ã€‚
             * @for  Uploader
             * @example
             *
             * $li.on('click', '.remove-this', function() {
             *     uploader.removeFile( file );
             * })
             */
            removeFile: function( file ) {
                var me = this;
    
                file = file.id ? file : me.queue.getFile( file );
    
                file.setStatus( Status.CANCELLED );
                me.owner.trigger( 'fileDequeued', file );
            },
    
            /**
             * @method getFiles
             * @grammar getFiles() => Array
             * @grammar getFiles( status1, status2, status... ) => Array
             * @description è¿”å›žæŒ‡å®šçŠ¶æ€çš„æ–‡ä»¶é›†åˆï¼Œä¸ä¼ å‚æ•°å°†è¿”å›žæ‰€æœ‰çŠ¶æ€çš„æ–‡ä»¶ã€‚
             * @for  Uploader
             * @example
             * console.log( uploader.getFiles() );    // => all files
             * console.log( uploader.getFiles('error') )    // => all error files.
             */
            getFiles: function() {
                return this.queue.getFiles.apply( this.queue, arguments );
            },
    
            fetchFile: function() {
                return this.queue.fetch.apply( this.queue, arguments );
            },
    
            /**
             * @method retry
             * @grammar retry() => undefined
             * @grammar retry( file ) => undefined
             * @description é‡è¯•ä¸Šä¼ ï¼Œé‡è¯•æŒ‡å®šæ–‡ä»¶ï¼Œæˆ–è€…ä»Žå‡ºé”™çš„æ–‡ä»¶å¼€å§‹é‡æ–°ä¸Šä¼ ã€‚
             * @for  Uploader
             * @example
             * function retry() {
             *     uploader.retry();
             * }
             */
            retry: function( file, noForceStart ) {
                var me = this,
                    files, i, len;
    
                if ( file ) {
                    file = file.id ? file : me.queue.getFile( file );
                    file.setStatus( Status.QUEUED );
                    noForceStart || me.request('start-upload');
                    return;
                }
    
                files = me.queue.getFiles( Status.ERROR );
                i = 0;
                len = files.length;
    
                for ( ; i < len; i++ ) {
                    file = files[ i ];
                    file.setStatus( Status.QUEUED );
                }
    
                me.request('start-upload');
            }
        });
    
    });

    /**
     * @fileOverview æ·»åŠ èŽ·å–Runtimeç›¸å…³ä¿¡æ¯çš„æ–¹æ³•ã€‚
     */
    define( 'widgets/runtime', [
        'uploader',
        'runtime/runtime',
        'widgets/widget'
    ], function( Uploader, Runtime ) {
    
        Uploader.support = function() {
            return Runtime.hasRuntime.apply( Runtime, arguments );
        };
    
        return Uploader.register({
            'predict-runtime-type': 'predictRuntmeType'
        }, {
    
            init: function() {
                if ( !this.predictRuntmeType() ) {
                    throw Error('Runtime Error');
                }
            },
    
            /**
             * é¢„æµ‹Uploaderå°†é‡‡ç”¨å“ªä¸ª`Runtime`
             * @grammar predictRuntmeType() => String
             * @method predictRuntmeType
             * @for  Uploader
             */
            predictRuntmeType: function() {
                var orders = this.options.runtimeOrder || Runtime.orders,
                    type = this.type,
                    i, len;
    
                if ( !type ) {
                    orders = orders.split( /\s*,\s*/g );
    
                    for ( i = 0, len = orders.length; i < len; i++ ) {
                        if ( Runtime.hasRuntime( orders[ i ] ) ) {
                            this.type = type = orders[ i ];
                            break;
                        }
                    }
                }
    
                return type;
            }
        });
    });

    /**
     * @fileOverview è´Ÿè´£æ–‡ä»¶ä¸Šä¼ ç›¸å…³ã€‚
     */
    define( 'widgets/upload', [
        'base',
        'uploader',
        'file',
        'lib/transport',
        'widgets/widget'
    ], function( Base, Uploader, WUFile, Transport ) {
    
        var $ = Base.$,
            isPromise = Base.isPromise,
            Status = WUFile.Status;
    
        // æ·»åŠ é»˜è®¤é…ç½®é¡¹
        $.extend( Uploader.options, {
    
    
            /**
             * @property {Boolean} [prepareNextFile=false]
             * @namespace options
             * @for Uploader
             * @description æ˜¯å¦å…è®¸åœ¨æ–‡ä»¶ä¼ è¾“æ—¶æå‰æŠŠä¸‹ä¸€ä¸ªæ–‡ä»¶å‡†å¤‡å¥½ã€‚
             * å¯¹äºŽä¸€ä¸ªæ–‡ä»¶çš„å‡†å¤‡å·¥ä½œæ¯”è¾ƒè€—æ—¶ï¼Œæ¯”å¦‚å›¾ç‰‡åŽ‹ç¼©ï¼Œmd5åºåˆ—åŒ–ã€‚
             * å¦‚æžœèƒ½æå‰åœ¨å½“å‰æ–‡ä»¶ä¼ è¾“æœŸå¤„ç†ï¼Œå¯ä»¥èŠ‚çœæ€»ä½“è€—æ—¶ã€‚
             */
            prepareNextFile: false,
    
            /**
             * @property {Boolean} [chunked=false]
             * @namespace options
             * @for Uploader
             * @description æ˜¯å¦è¦åˆ†ç‰‡å¤„ç†å¤§æ–‡ä»¶ä¸Šä¼ ã€‚
             */
            chunked: false,
    
            /**
             * @property {Boolean} [chunkSize=5242880]
             * @namespace options
             * @for Uploader
             * @description å¦‚æžœè¦åˆ†ç‰‡ï¼Œåˆ†å¤šå¤§ä¸€ç‰‡ï¼Ÿ é»˜è®¤å¤§å°ä¸º5M.
             */
            chunkSize: 5 * 1024 * 1024,
    
            /**
             * @property {Boolean} [chunkRetry=2]
             * @namespace options
             * @for Uploader
             * @description å¦‚æžœæŸä¸ªåˆ†ç‰‡ç”±äºŽç½‘ç»œé—®é¢˜å‡ºé”™ï¼Œå…è®¸è‡ªåŠ¨é‡ä¼ å¤šå°‘æ¬¡ï¼Ÿ
             */
            chunkRetry: 2,
    
            /**
             * @property {Boolean} [threads=3]
             * @namespace options
             * @for Uploader
             * @description ä¸Šä¼ å¹¶å‘æ•°ã€‚å…è®¸åŒæ—¶æœ€å¤§ä¸Šä¼ è¿›ç¨‹æ•°ã€‚
             */
            threads: 3
        });
    
        // è´Ÿè´£å°†æ–‡ä»¶åˆ‡ç‰‡ã€‚
        function CuteFile( file, chunkSize ) {
            var pending = [],
                blob = file.source,
                total = blob.size,
                chunks = chunkSize ? Math.ceil( total / chunkSize ) : 1,
                start = 0,
                index = 0,
                len;
    
            while ( index < chunks ) {
                len = Math.min( chunkSize, total - start );
                pending.push({
                    file: file,
                    start: start,
                    end: start + len,
                    total: total,
                    chunks: chunks,
                    chunk: index++
                });
                start += len;
            }
    
            file.blocks = pending.concat();
            file.remaning = pending.length;
    
            return {
                file: file,
    
                has: function() {
                    return !!pending.length;
                },
    
                fetch: function() {
                    return pending.shift();
                }
            };
        }
    
        Uploader.register({
            'start-upload': 'start',
            'stop-upload': 'stop',
            'skip-file': 'skipFile',
            'is-in-progress': 'isInProgress'
        }, {
    
            init: function() {
                var owner = this.owner;
    
                this.runing = false;
    
                // è®°å½•å½“å‰æ­£åœ¨ä¼ çš„æ•°æ®ï¼Œè·Ÿthreadsç›¸å…³
                this.pool = [];
    
                // ç¼“å­˜å³å°†ä¸Šä¼ çš„æ–‡ä»¶ã€‚
                this.pending = [];
    
                // è·Ÿè¸ªè¿˜æœ‰å¤šå°‘åˆ†ç‰‡æ²¡æœ‰å®Œæˆä¸Šä¼ ã€‚
                this.remaning = 0;
                this.__tick = Base.bindFn( this._tick, this );
    
                owner.on( 'uploadComplete', function( file ) {
                    // æŠŠå…¶ä»–å—å–æ¶ˆäº†ã€‚
                    file.blocks && $.each( file.blocks, function( _, v ) {
                        v.transport && (v.transport.abort(), v.transport.destroy());
                        delete v.transport;
                    });
    
                    delete file.blocks;
                    delete file.remaning;
                });
            },
    
            /**
             * @event startUpload
             * @description å½“å¼€å§‹ä¸Šä¼ æµç¨‹æ—¶è§¦å‘ã€‚
             * @for  Uploader
             */
    
            /**
             * å¼€å§‹ä¸Šä¼ ã€‚æ­¤æ–¹æ³•å¯ä»¥ä»Žåˆå§‹çŠ¶æ€è°ƒç”¨å¼€å§‹ä¸Šä¼ æµç¨‹ï¼Œä¹Ÿå¯ä»¥ä»Žæš‚åœçŠ¶æ€è°ƒç”¨ï¼Œç»§ç»­ä¸Šä¼ æµç¨‹ã€‚
             * @grammar upload() => undefined
             * @method upload
             * @for  Uploader
             */
            start: function() {
                var me = this;
    
                // ç§»å‡ºinvalidçš„æ–‡ä»¶
                $.each( me.request( 'get-files', Status.INVALID ), function() {
                    me.request( 'remove-file', this );
                });
    
                if ( me.runing ) {
                    return;
                }
    
                me.runing = true;
    
                // å¦‚æžœæœ‰æš‚åœçš„ï¼Œåˆ™ç»­ä¼ 
                $.each( me.pool, function( _, v ) {
                    var file = v.file;
    
                    if ( file.getStatus() === Status.INTERRUPT ) {
                        file.setStatus( Status.PROGRESS );
                        me._trigged = false;
                        v.transport && v.transport.send();
                    }
                });
    
                me._trigged = false;
                me.owner.trigger('startUpload');
                Base.nextTick( me.__tick );
            },
    
            /**
             * @event stopUpload
             * @description å½“å¼€å§‹ä¸Šä¼ æµç¨‹æš‚åœæ—¶è§¦å‘ã€‚
             * @for  Uploader
             */
    
            /**
             * æš‚åœä¸Šä¼ ã€‚ç¬¬ä¸€ä¸ªå‚æ•°ä¸ºæ˜¯å¦ä¸­æ–­ä¸Šä¼ å½“å‰æ­£åœ¨ä¸Šä¼ çš„æ–‡ä»¶ã€‚
             * @grammar stop() => undefined
             * @grammar stop( true ) => undefined
             * @method stop
             * @for  Uploader
             */
            stop: function( interrupt ) {
                var me = this;
    
                if ( me.runing === false ) {
                    return;
                }
    
                me.runing = false;
    
                interrupt && $.each( me.pool, function( _, v ) {
                    v.transport && v.transport.abort();
                    v.file.setStatus( Status.INTERRUPT );
                });
    
                me.owner.trigger('stopUpload');
            },
    
            /**
             * åˆ¤æ–­`Uplaode`ræ˜¯å¦æ­£åœ¨ä¸Šä¼ ä¸­ã€‚
             * @grammar isInProgress() => Boolean
             * @method isInProgress
             * @for  Uploader
             */
            isInProgress: function() {
                return !!this.runing;
            },
    
            getStats: function() {
                return this.request('get-stats');
            },
    
            /**
             * æŽ‰è¿‡ä¸€ä¸ªæ–‡ä»¶ä¸Šä¼ ï¼Œç›´æŽ¥æ ‡è®°æŒ‡å®šæ–‡ä»¶ä¸ºå·²ä¸Šä¼ çŠ¶æ€ã€‚
             * @grammar skipFile( file ) => undefined
             * @method skipFile
             * @for  Uploader
             */
            skipFile: function( file, status ) {
                file = this.request( 'get-file', file );
    
                file.setStatus( status || Status.COMPLETE );
                file.skipped = true;
    
                // å¦‚æžœæ­£åœ¨ä¸Šä¼ ã€‚
                file.blocks && $.each( file.blocks, function( _, v ) {
                    var _tr = v.transport;
    
                    if ( _tr ) {
                        _tr.abort();
                        _tr.destroy();
                        delete v.transport;
                    }
                });
    
                this.owner.trigger( 'uploadSkip', file );
            },
    
            /**
             * @event uploadFinished
             * @description å½“æ–‡ä»¶ä¸Šä¼ ç»“æŸæ—¶è§¦å‘ã€‚
             * @for  Uploader
             */
            _tick: function() {
                var me = this,
                    opts = me.options,
                    fn, val;
    
                // ä¸Šä¸€ä¸ªpromiseè¿˜æ²¡æœ‰ç»“æŸï¼Œåˆ™ç­‰å¾…å®ŒæˆåŽå†æ‰§è¡Œã€‚
                if ( me._promise ) {
                    return me._promise.always( me.__tick );
                }
    
                // è¿˜æœ‰ä½ç½®ï¼Œä¸”è¿˜æœ‰æ–‡ä»¶è¦å¤„ç†çš„è¯ã€‚
                if ( me.pool.length < opts.threads && (val = me._nextBlock()) ) {
                    me._trigged = false;
    
                    fn = function( val ) {
                        me._promise = null;
    
                        // æœ‰å¯èƒ½æ˜¯rejectè¿‡æ¥çš„ï¼Œæ‰€ä»¥è¦æ£€æµ‹valçš„ç±»åž‹ã€‚
                        val && val.file && me._startSend( val );
                        Base.nextTick( me.__tick );
                    };
    
                    me._promise = isPromise( val ) ? val.always( fn ) : fn( val );
    
                // æ²¡æœ‰è¦ä¸Šä¼ çš„äº†ï¼Œä¸”æ²¡æœ‰æ­£åœ¨ä¼ è¾“çš„äº†ã€‚
                } else if ( !me.remaning && !me.getStats().numOfQueue ) {
                    me.runing = false;
    
                    me._trigged || Base.nextTick(function() {
                        me.owner.trigger('uploadFinished');
                    });
                    me._trigged = true;
                }
            },
    
            _nextBlock: function() {
                var me = this,
                    act = me._act,
                    opts = me.options,
                    next, done;
    
                // å¦‚æžœå½“å‰æ–‡ä»¶è¿˜æœ‰æ²¡æœ‰éœ€è¦ä¼ è¾“çš„ï¼Œåˆ™ç›´æŽ¥è¿”å›žå‰©ä¸‹çš„ã€‚
                if ( act && act.has() &&
                        act.file.getStatus() === Status.PROGRESS ) {
    
                    // æ˜¯å¦æå‰å‡†å¤‡ä¸‹ä¸€ä¸ªæ–‡ä»¶
                    if ( opts.prepareNextFile && !me.pending.length ) {
                        me._prepareNextFile();
                    }
    
                    return act.fetch();
    
                // å¦åˆ™ï¼Œå¦‚æžœæ­£åœ¨è¿è¡Œï¼Œåˆ™å‡†å¤‡ä¸‹ä¸€ä¸ªæ–‡ä»¶ï¼Œå¹¶ç­‰å¾…å®ŒæˆåŽè¿”å›žä¸‹ä¸ªåˆ†ç‰‡ã€‚
                } else if ( me.runing ) {
    
                    // å¦‚æžœç¼“å­˜ä¸­æœ‰ï¼Œåˆ™ç›´æŽ¥åœ¨ç¼“å­˜ä¸­å–ï¼Œæ²¡æœ‰åˆ™åŽ»queueä¸­å–ã€‚
                    if ( !me.pending.length && me.getStats().numOfQueue ) {
                        me._prepareNextFile();
                    }
    
                    next = me.pending.shift();
                    done = function( file ) {
                        if ( !file ) {
                            return null;
                        }
    
                        act = CuteFile( file, opts.chunked ? opts.chunkSize : 0 );
                        me._act = act;
                        return act.fetch();
                    };
    
                    // æ–‡ä»¶å¯èƒ½è¿˜åœ¨prepareä¸­ï¼Œä¹Ÿæœ‰å¯èƒ½å·²ç»å®Œå…¨å‡†å¤‡å¥½äº†ã€‚
                    return isPromise( next ) ? next.then( done ) : done( next );
                }
            },
    
            _prepareNextFile: function() {
                var me = this,
                    file = me.request('fetch-file'),
                    pending = me.pending,
                    promise;
    
                if ( file ) {
    
                    promise = me.request( 'before-send-file', file, function() {
    
                        // æœ‰å¯èƒ½æ–‡ä»¶è¢«skipæŽ‰äº†ã€‚æ–‡ä»¶è¢«skipæŽ‰åŽï¼ŒçŠ¶æ€å‘å®šä¸æ˜¯Queued.
                        if ( file.getStatus() === Status.QUEUED ) {
                            me.owner.trigger( 'uploadStart', file );
                            file.setStatus( Status.PROGRESS );
                            return file;
                        }
    
                        return me._finishFile( file );
                    });
    
                    // å¦‚æžœè¿˜åœ¨pendingä¸­ï¼Œåˆ™æ›¿æ¢æˆæ–‡ä»¶æœ¬èº«ã€‚
                    promise.done(function() {
                        var idx = $.inArray( promise, pending );
    
                        ~idx && pending.splice( idx, 1, file );
                    });
    
                    // befeore-send-fileçš„é’©å­å°±æœ‰é”™è¯¯å‘ç”Ÿã€‚
                    promise.fail( function( reason ) {
                        file.setStatus( Status.ERROR, reason );
                        me.owner.trigger( 'uploadError', file, type );
                        me.owner.trigger( 'uploadComplete', file );
                    });
    
                    pending.push( promise );
                }
            },
    
            // è®©å‡ºä½ç½®äº†ï¼Œå¯ä»¥è®©å…¶ä»–åˆ†ç‰‡å¼€å§‹ä¸Šä¼ 
            _popBlock: function( block ) {
                var idx = $.inArray( block, this.pool );
    
                this.pool.splice( idx, 1 );
                block.file.remaning--;
                this.remaning--;
            },
    
            // å¼€å§‹ä¸Šä¼ ï¼Œå¯ä»¥è¢«æŽ‰è¿‡ã€‚å¦‚æžœpromiseè¢«rejectäº†ï¼Œåˆ™è¡¨ç¤ºè·³è¿‡æ­¤åˆ†ç‰‡ã€‚
            _startSend: function( block ) {
                var me = this,
                    file = block.file,
                    promise;
    
                me.pool.push( block );
                me.remaning++;
    
                // å¦‚æžœæ²¡æœ‰åˆ†ç‰‡ï¼Œåˆ™ç›´æŽ¥ä½¿ç”¨åŽŸå§‹çš„ã€‚
                // ä¸ä¼šä¸¢å¤±content-typeä¿¡æ¯ã€‚
                block.blob = block.chunks === 1 ? file.source :
                        file.source.slice( block.start, block.end );
    
                // hook, æ¯ä¸ªåˆ†ç‰‡å‘é€ä¹‹å‰å¯èƒ½è¦åšäº›å¼‚æ­¥çš„äº‹æƒ…ã€‚
                promise = me.request( 'before-send', block, function() {
    
                    // æœ‰å¯èƒ½æ–‡ä»¶å·²ç»ä¸Šä¼ å‡ºé”™äº†ï¼Œæ‰€ä»¥ä¸éœ€è¦å†ä¼ è¾“äº†ã€‚
                    if ( file.getStatus() === Status.PROGRESS ) {
                        me._doSend( block );
                    } else {
                        me._popBlock( block );
                        Base.nextTick( me.__tick );
                    }
                });
    
                // å¦‚æžœä¸ºfailäº†ï¼Œåˆ™è·³è¿‡æ­¤åˆ†ç‰‡ã€‚
                promise.fail(function() {
                    if ( file.remaning === 1 ) {
                        me._finishFile( file ).always(function() {
                            block.percentage = 1;
                            me._popBlock( block );
                            me.owner.trigger( 'uploadComplete', file );
                            Base.nextTick( me.__tick );
                        });
                    } else {
                        block.percentage = 1;
                        me._popBlock( block );
                        Base.nextTick( me.__tick );
                    }
                });
            },
    
            /**
             * @event uploadProgress
             * @param {File} file Fileå¯¹è±¡
             * @param {Number} percentage ä¸Šä¼ è¿›åº¦
             * @description ä¸Šä¼ è¿‡ç¨‹ä¸­è§¦å‘ï¼Œæºå¸¦ä¸Šä¼ è¿›åº¦ã€‚
             * @for  Uploader
             */
    
            /**
             * @event uploadError
             * @param {File} file Fileå¯¹è±¡
             * @param {String} reason å‡ºé”™çš„code
             * @description å½“æ–‡ä»¶ä¸Šä¼ å‡ºé”™æ—¶è§¦å‘ã€‚
             * @for  Uploader
             */
    
            /**
             * @event uploadSuccess
             * @param {File} file Fileå¯¹è±¡
             * @description å½“æ–‡ä»¶ä¸Šä¼ æˆåŠŸæ—¶è§¦å‘ã€‚
             * @for  Uploader
             */
    
            /**
             * @event uploadComplete
             * @param {File} [file] Fileå¯¹è±¡
             * @description ä¸ç®¡æˆåŠŸæˆ–è€…å¤±è´¥ï¼Œæ–‡ä»¶ä¸Šä¼ å®Œæˆæ—¶è§¦å‘ã€‚
             * @for  Uploader
             */
    
            // åšä¸Šä¼ æ“ä½œã€‚
            _doSend: function( block ) {
                var me = this,
                    owner = me.owner,
                    opts = me.options,
                    file = block.file,
                    tr = new Transport( opts ),
                    data = $.extend({}, opts.formData ),
                    headers = $.extend({}, opts.headers );
    
                block.transport = tr;
    
                tr.on( 'destroy', function() {
                    delete block.transport;
                    me._popBlock( block );
                    Base.nextTick( me.__tick );
                });
    
                // å¹¿æ’­ä¸Šä¼ è¿›åº¦ã€‚ä»¥æ–‡ä»¶ä¸ºå•ä½ã€‚
                tr.on( 'progress', function( percentage ) {
                    var totalPercent = 0,
                        uploaded = 0;
    
                    // å¯èƒ½æ²¡æœ‰abortæŽ‰ï¼Œprogressè¿˜æ˜¯æ‰§è¡Œè¿›æ¥äº†ã€‚
                    // if ( !file.blocks ) {
                    //     return;
                    // }
    
                    totalPercent = block.percentage = percentage;
    
                    if ( block.chunks > 1 ) {    // è®¡ç®—æ–‡ä»¶çš„æ•´ä½“é€Ÿåº¦ã€‚
                        $.each( file.blocks, function( _, v ) {
                            uploaded += (v.percentage || 0) * (v.end - v.start);
                        });
    
                        totalPercent = uploaded / file.size;
                    }
    
                    owner.trigger( 'uploadProgress', file, totalPercent || 0 );
                });
    
                // å°è¯•é‡è¯•ï¼Œç„¶åŽå¹¿æ’­æ–‡ä»¶ä¸Šä¼ å‡ºé”™ã€‚
                tr.on( 'error', function( type ) {
                    block.retried = block.retried || 0;
    
                    // è‡ªåŠ¨é‡è¯•
                    if ( block.chunks > 1 && ~'http,abort'.indexOf( type ) &&
                            block.retried < opts.chunkRetry ) {
    
                        block.retried++;
                        tr.send();
    
                    } else {
                        file.setStatus( Status.ERROR, type );
                        owner.trigger( 'uploadError', file, type );
                        owner.trigger( 'uploadComplete', file );
                    }
                });
    
                // ä¸Šä¼ æˆåŠŸ
                tr.on( 'load', function() {
                    var ret = tr.getResponseAsJson() || {},
                        reject, fn;
    
                    ret._raw = tr.getResponse();
                    fn = function( value ) {
                        reject = value;
                    };
    
                    // æœåŠ¡ç«¯å“åº”äº†ï¼Œä¸ä»£è¡¨æˆåŠŸäº†ï¼Œè¯¢é—®æ˜¯å¦å“åº”æ­£ç¡®ã€‚
                    if ( !owner.trigger( 'uploadAccept', block, ret, fn ) ) {
                        reject = reject || 'server';
                    }
    
                    // å¦‚æžœéžé¢„æœŸï¼Œè½¬å‘ä¸Šä¼ å‡ºé”™ã€‚
                    if ( reject ) {
                        tr.trigger( 'error', reject );
                        return;
                    }
    
                    // å…¨éƒ¨ä¸Šä¼ å®Œæˆã€‚
                    if ( file.remaning === 1 ) {
                        me._finishFile( file, ret );
                    } else {
                        tr.destroy();
                    }
                });
    
                // é…ç½®é»˜è®¤çš„ä¸Šä¼ å­—æ®µã€‚
                data = $.extend( data, {
                    id: file.id,
                    name: file.name,
                    type: file.type,
                    lastModifiedDate: file.lastModifiedDate,
                    size: file.size
                });
    
                block.chunks > 1 && $.extend( data, {
                    chunks: block.chunks,
                    chunk: block.chunk
                });
    
                // åœ¨å‘é€ä¹‹é—´å¯ä»¥æ·»åŠ å­—æ®µä»€ä¹ˆçš„ã€‚ã€‚ã€‚
                // å¦‚æžœé»˜è®¤çš„å­—æ®µä¸å¤Ÿä½¿ç”¨ï¼Œå¯ä»¥é€šè¿‡ç›‘å¬æ­¤äº‹ä»¶æ¥æ‰©å±•
                owner.trigger( 'uploadBeforeSend', block, data, headers );
    
                // å¼€å§‹å‘é€ã€‚
                tr.appendBlob( opts.fileVal, block.blob, file.name );
                tr.append( data );
                tr.setRequestHeader( headers );
                tr.send();
            },
    
            // å®Œæˆä¸Šä¼ ã€‚
            _finishFile: function( file, ret, hds ) {
                var owner = this.owner;
    
                return owner
                        .request( 'after-send-file', arguments, function() {
                            file.setStatus( Status.COMPLETE );
                            owner.trigger( 'uploadSuccess', file, ret, hds );
                        })
                        .fail(function( reason ) {
    
                            // å¦‚æžœå¤–éƒ¨å·²ç»æ ‡è®°ä¸ºinvalidä»€ä¹ˆçš„ï¼Œä¸å†æ”¹çŠ¶æ€ã€‚
                            if ( file.getStatus() === Status.PROGRESS ) {
                                file.setStatus( Status.ERROR, reason );
                            }
    
                            owner.trigger( 'uploadError', file, reason );
                        })
                        .always(function() {
                            owner.trigger( 'uploadComplete', file );
                        });
            }
    
        });
    });

    /**
     * @fileOverview å„ç§éªŒè¯ï¼ŒåŒ…æ‹¬æ–‡ä»¶æ€»å¤§å°æ˜¯å¦è¶…å‡ºã€å•æ–‡ä»¶æ˜¯å¦è¶…å‡ºå’Œæ–‡ä»¶æ˜¯å¦é‡å¤ã€‚
     */
    
    define( 'widgets/validator', [
        'base',
        'uploader',
        'file',
        'widgets/widget'
    ], function( Base, Uploader, WUFile ) {
    
        var $ = Base.$,
            validators = {},
            api;
    
        // æš´éœ²ç»™å¤–é¢çš„api
        api = {
    
            // æ·»åŠ éªŒè¯å™¨
            addValidator: function( type, cb ) {
                validators[ type ] = cb;
            },
    
            // ç§»é™¤éªŒè¯å™¨
            removeValidator: function( type ) {
                delete validators[ type ];
            }
        };
    
        // åœ¨Uploaderåˆå§‹åŒ–çš„æ—¶å€™å¯åŠ¨Validatorsçš„åˆå§‹åŒ–
        Uploader.register({
            init: function() {
                var me = this;
                $.each( validators, function() {
                    this.call( me.owner );
                });
            }
        });
    
        /**
         * @property {int} [fileNumLimit=undefined]
         * @namespace options
         * @for Uploader
         * @description éªŒè¯æ–‡ä»¶æ€»æ•°é‡, è¶…å‡ºåˆ™ä¸å…è®¸åŠ å…¥é˜Ÿåˆ—ã€‚
         */
        api.addValidator( 'fileNumLimit', function() {
            var uploader = this,
                opts = uploader.options,
                count = 0,
                max = opts.fileNumLimit >> 0,
                flag = true;
    
            if ( !max ) {
                return;
            }
    
            uploader.on( 'beforeFileQueued', function() {
    
                if ( count >= max && flag ) {
                    flag = false;
                    this.trigger( 'error', 'Q_EXCEED_NUM_LIMIT', max );
                    setTimeout(function() {
                        flag = true;
                    }, 1 );
                }
    
                return count >= max ? false : true;
            });
    
            uploader.on( 'fileQueued', function() {
                count++;
            });
    
            uploader.on( 'fileDequeued', function() {
                count--;
            });
        });
    
    
        /**
         * @property {int} [fileSizeLimit=undefined]
         * @namespace options
         * @for Uploader
         * @description éªŒè¯æ–‡ä»¶æ€»å¤§å°æ˜¯å¦è¶…å‡ºé™åˆ¶, è¶…å‡ºåˆ™ä¸å…è®¸åŠ å…¥é˜Ÿåˆ—ã€‚
         */
        api.addValidator( 'fileSizeLimit', function() {
            var uploader = this,
                opts = uploader.options,
                count = 0,
                max = opts.fileSizeLimit >> 0,
                flag = true;
    
            if ( !max ) {
                return;
            }
    
            uploader.on( 'beforeFileQueued', function( file ) {
                var invalid = count + file.size > max;
    
                if ( invalid && flag ) {
                    flag = false;
                    this.trigger( 'error', 'Q_EXCEED_SIZE_LIMIT', max );
                    setTimeout(function() {
                        flag = true;
                    }, 1 );
                }
    
                return invalid ? false : true;
            });
    
            uploader.on( 'fileQueued', function( file ) {
                count += file.size;
            });
    
            uploader.on( 'fileDequeued', function( file ) {
                count -= file.size;
            });
        });
    
        /**
         * @property {int} [fileSingleSizeLimit=undefined]
         * @namespace options
         * @for Uploader
         * @description éªŒè¯å•ä¸ªæ–‡ä»¶å¤§å°æ˜¯å¦è¶…å‡ºé™åˆ¶, è¶…å‡ºåˆ™ä¸å…è®¸åŠ å…¥é˜Ÿåˆ—ã€‚
         */
        api.addValidator( 'fileSingleSizeLimit', function() {
            var uploader = this,
                opts = uploader.options,
                max = opts.fileSingleSizeLimit;
    
            if ( !max ) {
                return;
            }
    
            uploader.on( 'fileQueued', function( file ) {
                if ( file.size > max ) {
                    file.setStatus( WUFile.Status.INVALID, 'exceed_size' );
                }
            });
        });
    
        /**
         * @property {int} [duplicate=undefined]
         * @namespace options
         * @for Uploader
         * @description åŽ»é‡ï¼Œ æ ¹æ®æ–‡ä»¶åå­—ã€æ–‡ä»¶å¤§å°å’Œæœ€åŽä¿®æ”¹æ—¶é—´æ¥ç”Ÿæˆhash Key.
         */
        api.addValidator( 'duplicate', function() {
            var uploader = this,
                opts = uploader.options,
                mapping = {};
    
            if ( opts.duplicate ) {
                return;
            }
    
            function hashString( str ) {
                var hash = 0,
                    i = 0,
                    len = str.length,
                    _char;
    
                for ( ; i < len; i++ ) {
                    _char = str.charCodeAt( i );
                    hash = _char + (hash << 6) + (hash << 16) - hash;
                }
    
                return hash;
            }
    
            uploader.on( 'beforeFileQueued', function( file ) {
                var hash = hashString( file.name + file.size +
                        file.lastModifiedDate );
    
                // å·²ç»é‡å¤äº†
                if ( mapping[ hash ] ) {
                    return false;
                }
            });
    
            uploader.on( 'fileQueued', function( file ) {
                var hash = hashString( file.name + file.size +
                        file.lastModifiedDate );
    
                mapping[ hash ] = true;
            });
    
            uploader.on( 'fileDequeued', function( file ) {
                var hash = hashString( file.name + file.size +
                        file.lastModifiedDate );
    
                delete mapping[ hash ];
            });
        });
    
        return api;
    });

    /**
     * @file æš´éœ²å˜é‡ç»™å¤–éƒ¨ä½¿ç”¨ã€‚
     * æ­¤æ–‡ä»¶ä¹Ÿåªæœ‰åœ¨æŠŠwebuploadåˆå¹¶æˆä¸€ä¸ªæ–‡ä»¶ä½¿ç”¨çš„æ—¶å€™æ‰ä¼šå¼•å…¥ã€‚
     *
     * å°†æ‰€æœ‰modulesï¼Œå°†è·¯å¾„idsè£…æ¢æˆå¯¹è±¡ã€‚
     */
    (function( modules ) {
        var
            // è®©é¦–å†™å­—æ¯å¤§å†™ã€‚
            ucFirst = function( str ) {
                return str && (str.charAt( 0 ).toUpperCase() + str.substr( 1 ));
            },
    
            // æš´éœ²å‡ºåŽ»çš„key
            exportName = 'WebUploader',
            exports = modules.base,
            key, host, parts, part, last, origin;
    
        for ( key in modules ) {
            host = exports;
    
            if ( !modules.hasOwnProperty( key ) ) {
                continue;
            }
    
            parts = key.split('/');
            last = ucFirst( parts.pop() );
    
            while( (part = ucFirst( parts.shift() )) ) {
                host[ part ] = host[ part ] || {};
                host = host[ part ];
            }
    
            host[ last ] = modules[ key ];
        }
    
        if ( typeof module === 'object' && typeof module.exports === 'object' ) {
            module.exports = exports;
        } else if ( window.define && window.define.amd ) {
            window.define( '../build/outro',  exportName, exports );
        } else {
            origin = window[ exportName ];
            window[ exportName ] = exports;
            window[ exportName ].noConflict = function() {
                window[ exportName ] = origin;
            };
        }
    })( internalAmd.modules );
})( this );