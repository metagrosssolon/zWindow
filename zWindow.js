zsi.__zWindow = {
    "drag" : false
    ,"resize" : false
    ,"onMouseDownObj" : {}
    
    ,"zWindow" : null
    ,"zWindowStyle" : null
    ,"zWindowCompStyle" : null
    ,"selfCompStyle" : null
    ,"settings" : {}
    ,"dragLimit" : {}
    ,"body" : document.querySelector("body")
};

$(document).ready(function() {
    $(".zPanel").css({
        "width" : $(window).width()
        ,"height" : $(window).height()
    });
    
    $(".zPanel").zWindow({
        "id" : "window1"
        ,"width" : 500
        ,"height" : 500
        ,"resizeLimit" : 100
        ,"position" : "absolute"
        ,"header" : "<span>Header ni</span>"
        ,"body" : "<h1>Body ni HAHAHAHAHHAHAHAHA</h1>"
    });
    
    $("#window1 .zw-body").zWindow({
        "id" : "window2"
        ,"width" : 300
        ,"height" : 300
        ,"position" : "absolute"
        ,"resizeLimit" : 300
        ,"header" : "<span>Header sad ni</span>"
        ,"maximize" : "parent"
        /*,"onDragStart" : function(o) {
            console.log(this,o);
        }
        ,"onResizeStart" : function(o) {
            console.log(this,o);
        }
        ,"onDrag" : function(o) {
            console.log(this,o);
        }
        ,"onResize" : function(o) {
            console.log(this,o);
        }
        ,"onDragEnd" : function(o) {
            console.log(this,o);
        }
        ,"onResizeEnd" : function(o) {
            console.log(this,o);
        }*/
    });
});

$.fn.zWindow = function(option) {
    if (this.length) {
        // Default initialization
		var _default = {
			"width" : 200
			,"height" : 200
			,"position" : "absolute" // "absolute" || "fixed"
			,"resizeLimit" : 200
			,"header" : ""
			,"body" : ""
			,"maximize" : "body" // "window" || "parent"
		};
		
		// Merge the default options and user options
		var _settings = $.extend( true , _default , option );
        
        var _zWindowObj         = zsi.__zWindow
            ,_$self             = this.eq(0)
            ,_self              = _$self[0]
            ,_selfStyle         = _self.style
            ,_selfCompStyle     = window.getComputedStyle(_self)
            ,_$zWindow
            ,_zWindow
            ,_zWindowStyle
            ,_zWindowCompStyle
            
            ,_storage           = {}
        ;
        
        _$self.append(
            '<div id="' + _settings.id + '" class="zWindow">'
            + '<div class="zw-content">'
            +   '<div class="zw-header">'
            +       '<div class="zw-title">' + _settings.header + '</div>'
            +       '<div class="zw-toolbar">'
            +           '<div class="zw-button zw-pin"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M298.028 214.267L285.793 96H328c13.255 0 24-10.745 24-24V24c0-13.255-10.745-24-24-24H56C42.745 0 32 10.745 32 24v48c0 13.255 10.745 24 24 24h42.207L85.972 214.267C37.465 236.82 0 277.261 0 328c0 13.255 10.745 24 24 24h136v104.007c0 1.242.289 2.467.845 3.578l24 48c2.941 5.882 11.364 5.893 14.311 0l24-48a8.008 8.008 0 0 0 .845-3.578V352h136c13.255 0 24-10.745 24-24-.001-51.183-37.983-91.42-85.973-113.733z"/></svg></div>'
            +           '<div class="zw-button zw-max"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M464 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm0 394c0 3.3-2.7 6-6 6H54c-3.3 0-6-2.7-6-6V192h416v234z"/></svg></div>'
            +           '<div class="zw-button zw-restore" style="display:none;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M464 0H144c-26.5 0-48 21.5-48 48v48H48c-26.5 0-48 21.5-48 48v320c0 26.5 21.5 48 48 48h320c26.5 0 48-21.5 48-48v-48h48c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48zm-96 464H48V256h320v208zm96-96h-48V144c0-26.5-21.5-48-48-48H144V48h320v320z"/></svg></div>'
            +           '<div class="zw-button zw-close"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"><path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"/></svg></div>'
            +       '</div>'
            +   '</div>'
            +   '<div class="zw-body">' + _settings.body + '</div>'
            + '</div>'
            + '<div class="resizer resizer-h top" resize="top"></div>'
            + '<div class="resizer resizer-h bottom" resize="bottom"></div>'
            + '<div class="resizer resizer-w left" resize="left"></div>'
            + '<div class="resizer resizer-w right" resize="right"></div>'
            + '<div class="resizer resizer-wha top right" resize="top-right"></div>'
            + '<div class="resizer resizer-wha bottom left" resize="bottom-left"></div>'
            + '<div class="resizer resizer-whb top left" resize="top-left"></div>'
            + '<div class="resizer resizer-whb bottom right" resize="bottom-right"></div>'
            + '</div>'
        );
        
        _$zWindow = $("#" + _settings.id)
        .css({
            "width" : _settings.width
            ,"height" : _settings.height
            ,"position" : _settings.position
        });
        
        _zWindow            = _$zWindow[0];
        _zWindowStyle       = _zWindow.style;
        _zWindowCompStyle   = window.getComputedStyle(_zWindow);
        
        // Drag Events
        _zWindow.onDragStart = _settings.onDragStart;
        _zWindow.onDrag      = _settings.onDrag;
        _zWindow.onDragEnd   = _settings.onDragEnd;
        
        // Resize Events
        _zWindow.onResizeStart  = _settings.onResizeStart;
        _zWindow.onResize       = _settings.onResize;
        _zWindow.onResizeEnd    = _settings.onResizeEnd;
        
        // DRAG SECTION
        _$zWindow.find(".zw-title").mousedown(function(e) {
            var __onMouseDownObj  = _zWindowObj.onMouseDownObj
                ,__zWoffsetTop    = _zWindow.offsetTop
                ,__zWoffsetLeft   = _zWindow.offsetLeft
                ,__zWoffsetWidth  = _zWindow.offsetWidth
                ,__zWoffsetHeight = _zWindow.offsetHeight
            ;
            
            _zWindowObj.zWindow             = _zWindow;
            _zWindowObj.zWindowStyle        = _zWindowStyle;
            _zWindowObj.zWindowCompStyle    = _zWindowCompStyle;
            _zWindowObj.selfCompStyle       = _selfCompStyle;
            
            if (_zWindowCompStyle.position === "absolute") {
                // zWindow is absolute
                var __selfPosition = _selfCompStyle.position;
                
                _zWindowObj.dragLimit = {
                    "bottom" : _self.offsetHeight
                    ,"right" : _self.offsetWidth
                };
                
                if (__selfPosition === "initial" || __selfPosition === "static") {
                    __onMouseDownObj.subtrahend = { "y" : e.offsetY , "x" : e.offsetX };
                } else {
                    var _rootOffset = getRootOffset(_self);
                    
                    __onMouseDownObj.subtrahend = { 
                        "y" : e.pageY - __zWoffsetTop 
                        , "x" : e.pageX - __zWoffsetLeft
                    };
                    __onMouseDownObj.selfOffset = {
                        "top"   : _rootOffset.top + e.offsetY
                        ,"left" : _rootOffset.left + e.offsetX
                    };
                    __onMouseDownObj.width = __zWoffsetWidth;
                    __onMouseDownObj.height = __zWoffsetHeight;
                }
            } else {
                // zWindow is fixed
                __onMouseDownObj.subtrahend = { "y" : e.offsetY , "x" : e.offsetX };
            }
            
            if (typeof _zWindow.onDragStart === "function") {
                _zWindow.onDragStart({
                    "top" : __zWoffsetTop
                    ,"left" : __zWoffsetLeft
                    ,"width" : __zWoffsetWidth
                    ,"height" : __zWoffsetHeight
                });
            }
            
            _zWindowObj.drag    = true;
            _zWindow.className += " active";
            
            // Prevent browser mouse down/up bug
            e.preventDefault();
        });
        
        // RESIZE SECTION
        _$zWindow.find(".resizer").mousedown(function(e) {
            var __onMouseDownObj  = _zWindowObj.onMouseDownObj
                ,__zWoffsetTop    = _zWindow.offsetTop
                ,__zWoffsetLeft   = _zWindow.offsetLeft
                ,__zWoffsetWidth  = _zWindow.offsetWidth
                ,__zWoffsetHeight = _zWindow.offsetHeight
            ;
            
            _zWindowObj.zWindow             = _zWindow;
            _zWindowObj.zWindowStyle        = _zWindowStyle;
            _zWindowObj.settings            = _settings;
            
            __onMouseDownObj.resizer  = e.target.attributes.resize.value;
            __onMouseDownObj.pageX    = e.pageX;
            __onMouseDownObj.pageY    = e.pageY;
            __onMouseDownObj.top      = __zWoffsetTop;
            __onMouseDownObj.left     = __zWoffsetLeft;
            __onMouseDownObj.width    = __zWoffsetWidth;
            __onMouseDownObj.height   = __zWoffsetHeight;
            
            if (typeof _zWindow.onResizeStart === "function") {
                _zWindow.onResizeStart({
                    "top"       : __zWoffsetTop
                    ,"left"     : __zWoffsetLeft
                    ,"width"    : __zWoffsetWidth
                    ,"height"   : __zWoffsetHeight
                });
            }
            
            _zWindowObj.resize = true;
            _zWindow.className += " active";
            
            // Prevent browser mouse down/up bug
            e.preventDefault();
        });
        
        _$zWindow.find(".zw-button").click(function(e) {
            var __self = this;
            var __$self = $(__self);
            var __btnType  = __self.className.replace(/zw-button /gi,"");
            
            switch (__btnType) {
                case "zw-pin" : {
                    
                    break;
                }
                case "zw-max" : {
                    _storage = {
                        "top" : _zWindowCompStyle.top
                        ,"left" : _zWindowCompStyle.left
                        ,"width" : _zWindowCompStyle.width
                        ,"height" : _zWindowCompStyle.height
                        ,"position" : _zWindowStyle.position
                    };
                    
                    _zWindowStyle.top = "0px";
                    _zWindowStyle.left = "0px";
                        
                    if (_settings.maximize === "body") {
                        var __body = _zWindowObj.body;
                        
                        _zWindowStyle.position = "fixed";
                        _zWindowStyle.width = __body.offsetWidth + "px";
                        _zWindowStyle.height = __body.offsetHeight + "px";
                    } else {
                        _zWindowStyle.width = _selfCompStyle.width;
                        _zWindowStyle.height = _selfCompStyle.height;
                    }
                    
                    __self.style.display = "none";
                    __$self.next()[0].style.display = "block";
                    break;
                }
                case "zw-restore" : {
                    _zWindowStyle.top = _storage.top;
                    _zWindowStyle.left = _storage.left;
                    _zWindowStyle.width = _storage.width;
                    _zWindowStyle.height = _storage.height;
                    _zWindowStyle.position = _storage.position;
                    
                    __self.style.display = "none";
                    __$self.prev()[0].style.display = "block";
                    break;
                }
                case "zw-close" : {
                    _$zWindow.remove();   
                    break;
                }
            }
        });
        
        if (typeof _zWindowObj.isBodyEventOn === "undefined" || _zWindowObj.isBodyEventOn === false) {
            $("body").mousemove(function(e) {
                var __zWindowObj = zsi.__zWindow
                    ,__zWindow = __zWindowObj.zWindow
                    ,__zWStyle = __zWindowObj.zWindowStyle
                    ,__onMouseDownObj = __zWindowObj.onMouseDownObj
                ;
                
                if (__zWindowObj.drag) {
                    var __subtrahend = __onMouseDownObj.subtrahend;
                    
                    if (__zWindowObj.zWindowCompStyle.position === "absolute") {
                        // zWindow is absolute
                        var __pageY = e.pageY
                            ,__pageX = e.pageX
                            ,__selfPosition = __zWindowObj.selfCompStyle.position
                        ;
                
                        if (__selfPosition === "initial" || __selfPosition === "static") {
                            __zWStyle.top   = __pageY - __subtrahend.y + "px";
                            __zWStyle.left  = __pageX - __subtrahend.x + "px";
                        } else {
                            var __dragLimit     = __zWindowObj.dragLimit
                                ,__dlBottom     = __dragLimit.bottom
                                ,__dlRight      = __dragLimit.right
                                ,__selfOffset   = __onMouseDownObj.selfOffset
                                ,__zWWidth      = __onMouseDownObj.width
                                ,__zWHeight     = __onMouseDownObj.height
                                ,__currentY     = __pageY - __selfOffset.top
                                ,__currentX     = __pageX - __selfOffset.left
                                ,__newY         = 0
                                ,__newX         = 0
                            ;
                            
                            if (__currentY < 0) { __newY = 0; } 
                            else if (__currentY + __zWHeight > __dlBottom) { __newY = (__dlBottom - __zWHeight); }
                            else { __newY = __pageY - __subtrahend.y; }
                            
                            if (__currentX < 0) { __newX = 0; } 
                            else if (__currentX + __zWWidth > __dlRight) { __newX = (__dlRight - __zWWidth); }
                            else { __newX = __pageX - __subtrahend.x; }
                            
                            __zWStyle.top = __newY + "px";
                            __zWStyle.left = __newX + "px";
                        }
                    } else {
                        // zWindow is fixed
                        __zWStyle.top   = e.clientY - __subtrahend.y + "px";
                        __zWStyle.left  = e.clientX - __subtrahend.x + "px";
                    }
                    
                    if (typeof __zWindow.onDrag === "function") {
                        __zWindow.onDrag({
                            "top"       : __zWindow.offsetTop
                            ,"left"     : __zWindow.offsetLeft
                            ,"width"    : __zWindow.offsetWidth
                            ,"height"   : __zWindow.offsetHeight
                        });
                    }
                    
                    return false;
                }
                
                if (__zWindowObj.resize) {
                    var __resizer           = __onMouseDownObj.resizer
                        ,__lastPageX        = __onMouseDownObj.pageX
                        ,__lastPageY        = __onMouseDownObj.pageY
                        ,__lastTop          = __onMouseDownObj.top
                        ,__lastLeft         = __onMouseDownObj.left
                        ,__lastWidth        = __onMouseDownObj.width
                        ,__lastHeight       = __onMouseDownObj.height
                        
                        ,__pageX            = e.pageX
                        ,__pageY            = e.pageY
                        ,__newWidth         = 0
                        ,__newHeight        = 0
                        ,__pageXA           = __lastPageX - __pageX
                        ,__pageXB           = __pageX - __lastPageX
                        ,__pageYA           = __lastPageY - __pageY
                        ,__pageYB           = __pageY - __lastPageY
                        
                        ,__resizeLimit      = __zWindowObj.settings.resizeLimit
                    ;
                    
                    if (__resizer === "left" || __resizer === "top-left" || __resizer === "bottom-left")
                    {
                        __newWidth = (__pageX > __lastPageX ? __lastWidth + __pageXA : __lastWidth - __pageXB);
                        
                        if (__newWidth > __resizeLimit) {
                            __zWStyle.width = __newWidth + "px";
                            __zWStyle.left = (__lastLeft - __pageXA) + "px";
                        } else {
                            __zWStyle.width = __resizeLimit + "px";
                            __zWStyle.left = ((__lastLeft + __lastWidth) - __resizeLimit) + "px";
                        }
                    }
                    
                    if (__resizer === "right" || __resizer === "bottom-right" || __resizer === "top-right")
                    {
                        __newWidth = (__pageX > __lastPageX ? __lastWidth + __pageXB : __lastWidth - __pageXA);
                        __zWStyle.width = (__newWidth > __resizeLimit ? __newWidth : __resizeLimit) + "px";
                    }
                    
                    if (__resizer === "top" || __resizer === "top-left" || __resizer === "top-right")
                    {
                        __newHeight = (__pageY > __lastPageY ? __lastHeight + __pageYA : __lastHeight - __pageYB);
                        
                        if (__newHeight > __resizeLimit) {
                            __zWStyle.height = __newHeight + "px";
                            __zWStyle.top = (__lastTop - __pageYA) + "px";
                        } else {
                            __zWStyle.height = __resizeLimit + "px";
                            __zWStyle.top = ((__lastTop + __lastHeight) - __resizeLimit) + "px";
                        }
                    }
                    
                    if (__resizer === "bottom" || __resizer === "bottom-left" || __resizer === "bottom-right")
                    {
                        __newHeight = (__pageY > __lastPageY ? __lastHeight + __pageYB : __lastHeight - __pageYA);
                        __zWStyle.height = (__newHeight > __resizeLimit ? __newHeight : __resizeLimit) + "px";
                    }
                    
                    if (typeof __zWindow.onResize === "function") {
                        __zWindow.onResize({
                            "top" : __zWindow.offsetTop
                            ,"left" : __zWindow.offsetLeft
                            ,"width" : __zWindow.offsetWidth
                            ,"height" : __zWindow.offsetHeight
                        });
                    }
                    
                    return false;
                }
            }).mouseup(function() {
                var __zWindowObj = zsi.__zWindow
                    ,__drag      = __zWindowObj.drag
                    ,__resize    = __zWindowObj.resize
                ;
                
                if (__drag || __resize) {
                    var __zWindow = __zWindowObj.zWindow;
                    
                    $(".zWindow.last-active").removeClass("last-active");
                    __zWindow.className  = __zWindow.className.replace(/ active/gi,"") + " last-active";
                    
                    if (__drag && typeof __zWindow.onDragEnd === "function") {
                        __zWindow.onDragEnd({
                            "top"       : __zWindow.offsetTop
                            ,"left"     : __zWindow.offsetLeft
                            ,"width"    : __zWindow.offsetWidth
                            ,"height"   : __zWindow.offsetHeight
                        });
                    }
                    
                    if (__resize && typeof __zWindow.onResizeEnd === "function") {
                        __zWindow.onResizeEnd({
                            "top"       : __zWindow.offsetTop
                            ,"left"     : __zWindow.offsetLeft
                            ,"width"    : __zWindow.offsetWidth
                            ,"height"   : __zWindow.offsetHeight
                        });
                    }
                    
                    __zWindowObj.drag   = false;
                    __zWindowObj.resize = false;
                    return false;
                }
            });
            
            _zWindowObj.isBodyEventOn = true;
        }
    }
};

function getRootOffset(el) {
    var top = 0;
    var left = 0;
    var element = el;
    
    // Loop through the DOM tree
    // and add it's parent's offset to get page offset
    do {
        top += element.offsetTop || 0;
        left += element.offsetLeft || 0;
        element = element.offsetParent;
    } while (element);
    
    return { top, left };
}    