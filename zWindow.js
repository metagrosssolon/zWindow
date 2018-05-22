zsi.__zWindow = {
    drag : false
    ,resize : false
    ,subtrahend : {}
    ,onMouseDownObj : {}
    ,body : document.querySelector("body")
    ,zWindow : null
    ,zWindowStyle : null
    ,zWindowCompStyle : null
    ,selfCompStyle : null
    ,settings : {}
};


$(document).ready(function() {
    $(".zPanel").css({
        "width" : $(window).width()
        ,"height" : $(window).height()
    });
    
    $(".zPanel").zWindow({
        "id" : "window1"
        ,"width" : 200
        ,"height" : 200
        ,"position" : "absolute"
        ,"resizeLimit" : 50
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
    
    /*$(".zPanel").zWindow({
        "id" : "window2"
        ,"width" : 200
        ,"height" : 200
        ,"position" : "fixed"
    });*/
});

$.fn.zWindow = function(option) {
    if (this.length) {
        // Default initialization
		var _default = {
			width : 200
			,height : 200
			,position : "absolute"
			,resizeLimit : 200
		};
		
		// Merge the default options and user options
		var _settings = $.extend( true , _default, option );
        
        var _zWindowObj         = zsi.__zWindow
            ,_$self             = this
            ,_self              = this[0]
            ,_selfStyle         = _self.style
            ,_selfCompStyle     = window.getComputedStyle(_self)
            ,_$zWindow
            ,_zWindow
            ,_zWindowStyle
            ,_zWindowCompStyle
        ;
        
        _$self.append(
            '<div id="' + _settings.id + '" class="zWindow">'
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
        
        _$zWindow.mousedown(function(e) {
            var __target = e.target;
            
            _zWindowObj.zWindow          = _zWindow;
            _zWindowObj.zWindowStyle     = _zWindowStyle;
            _zWindowObj.zWindowCompStyle = _zWindowCompStyle;
            _zWindowObj.selfCompStyle    = _selfCompStyle;
            _zWindowObj.settings         = _settings;
            
            _zWindow.className += " active";
            
            if (__target.id === _settings.id) {
                // DRAG SECTION
                // __subtrahend - used for getting the difference of mouse position
                var __subtrahend = _zWindowObj.subtrahend;
                
                _zWindowObj.drag = true;
                
                if (_zWindowCompStyle.position === "absolute") {
                    // zWindow is absolute
                    var __selfPosition = _selfCompStyle.position
                        ,__bodyScroll  = {
                            top : (__selfPosition === "fixed" ? _zWindowObj.body.scrollTop : 0)
                            ,left : (__selfPosition === "fixed" ? _zWindowObj.body.scrollLeft : 0)
                        }
                        ,__selfOffsetTop = _self.offsetTop
                        ,__selfOffsetLeft = _self.offsetLeft
                    ;
                    
                    if (__selfPosition === "initial" || __selfPosition === "static") {
                        __subtrahend.y = e.offsetY;
                        __subtrahend.x = e.offsetX;
                    } else {
                        __subtrahend.y = e.offsetY + __selfOffsetTop + __bodyScroll.top;
                        __subtrahend.x = e.offsetX + __selfOffsetLeft + __bodyScroll.left;
                    }
                    
                    _zWindowObj.dragLimit = {
                        top : __selfOffsetTop + __bodyScroll.top
                        ,left : __selfOffsetLeft + __bodyScroll.left
                        ,bottom : __selfOffsetTop + _self.offsetHeight + __bodyScroll.top
                        ,right : __selfOffsetLeft + _self.offsetWidth + __bodyScroll.left
                    };
                } else {
                    // zWindow is fixed
                    __subtrahend.y = e.offsetY;
                    __subtrahend.x = e.offsetX;
                }
                
                if (typeof _zWindow.onDragStart === "function") {
                    _zWindow.onDragStart({
                        x : _zWindow.offsetTop
                        ,y : _zWindow.offsetLeft
                        ,width : _zWindow.offsetWidth
                        ,height : _zWindow.offsetHeight
                    });
                }
            } else if (__target.classList[0] === "resizer") {
                // RESIZE SECTION
                var __onMouseDownObj          = _zWindowObj.onMouseDownObj;
                _zWindowObj.resize            = true;
                
                __onMouseDownObj.resizer      = __target.attributes.resize.value;
                __onMouseDownObj.pageX        = e.pageX;
                __onMouseDownObj.pageY        = e.pageY;
                __onMouseDownObj.width        = _zWindow.offsetWidth;
                __onMouseDownObj.height       = _zWindow.offsetHeight;
                __onMouseDownObj.offsetTop    = _zWindow.offsetTop;
                __onMouseDownObj.offsetLeft   = _zWindow.offsetLeft;
                
                if (typeof _zWindow.onResizeStart === "function") {
                    _zWindow.onResizeStart({
                        x : _zWindow.offsetTop
                        ,y : _zWindow.offsetLeft
                        ,width : _zWindow.offsetWidth
                        ,height : _zWindow.offsetHeight
                    });
                }
            }
            
            // Prevent browser mouse down/up bug
            e.preventDefault();
        });
        
        if (typeof _zWindowObj.isBodyEventOn === "undefined" || _zWindowObj.isBodyEventOn === false) {
            $("body").mousemove(function(e) {
                var __zWindowObj = zsi.__zWindow;
                
                if (__zWindowObj.drag) {
                    var __zWStyle       = __zWindowObj.zWindowStyle
                        ,__zWSubtrahend = __zWindowObj.subtrahend
                        ,__zWindow      = __zWindowObj.zWindow
                    ;
                    
                    if (__zWindowObj.zWindowCompStyle.position === "absolute") {
                        // zWindow is absolute
                        var __pageY = e.pageY
                            ,__pageX = e.pageX
                            ,__selfPosition = __zWindowObj.selfCompStyle.position
                        ;
                        
                        if (__selfPosition === "relative" || __selfPosition === "absolute" || __selfPosition === "fixed") {
                            // __dragLimit - to freeze the zWindow if the mouse leaves the parent target
                            var __dragLimit = __zWindowObj.dragLimit;
                            
                            if (__pageY >= __dragLimit.top && __pageY <= __dragLimit.bottom
                            && __pageX >= __dragLimit.left && __pageX <= __dragLimit.right) {
                                __zWStyle.top   = __pageY - __zWSubtrahend.y + "px";
                                __zWStyle.left  = __pageX - __zWSubtrahend.x + "px";
                            }
                        } else {
                            __zWStyle.top   = __pageY - __zWSubtrahend.y + "px";
                            __zWStyle.left  = __pageX - __zWSubtrahend.x + "px";
                        }
                    } else {
                        // zWindow is fixed
                        __zWStyle.top   = e.clientY - __zWSubtrahend.y + "px";
                        __zWStyle.left  = e.clientX - __zWSubtrahend.x + "px";
                    }
                    
                    if (typeof __zWindow.onDrag === "function") {
                        __zWindow.onDrag({
                            x : __zWindow.offsetTop
                            ,y : __zWindow.offsetLeft
                            ,width : __zWindow.offsetWidth
                            ,height : __zWindow.offsetHeight
                        });
                    }
                    
                    return false;
                }
                
                if (__zWindowObj.resize) {
                    var __onMouseDownObj    = __zWindowObj.onMouseDownObj
                        ,__resizer          = __onMouseDownObj.resizer
                        ,__lastPageX        = __onMouseDownObj.pageX
                        ,__lastPageY        = __onMouseDownObj.pageY
                        ,__lastWidth        = __onMouseDownObj.width
                        ,__lastHeight       = __onMouseDownObj.height
                        ,__lastOffsetTop    = __onMouseDownObj.offsetTop
                        ,__lastOffsetLeft   = __onMouseDownObj.offsetLeft
                        
                        ,__pageX            = e.pageX
                        ,__pageY            = e.pageY
                        ,__newWidth         = 0
                        ,__newHeight        = 0
                        ,__pageXA           = __lastPageX - __pageX
                        ,__pageXB           = __pageX - __lastPageX
                        ,__pageYA           = __lastPageY - __pageY
                        ,__pageYB           = __pageY - __lastPageY
                        
                        ,__zWStyle          = __zWindowObj.zWindowStyle
                        ,__resizeLimit      = __zWindowObj.settings.resizeLimit
                        ,__zWindow          = __zWindowObj.zWindow
                    ;
                    
                    if (__resizer === "left" || __resizer === "top-left" || __resizer === "bottom-left")
                    {
                        __newWidth = (__pageX > __lastPageX ? __lastWidth + __pageXA : __lastWidth - __pageXB);
                        
                        if (__newWidth > __resizeLimit) {
                            __zWStyle.width = __newWidth + "px";
                            __zWStyle.left = (__lastOffsetLeft - __pageXA) + "px";
                        } else {
                            __zWStyle.width = __resizeLimit + "px";
                            __zWStyle.left = ((__lastOffsetLeft + __lastWidth) - __resizeLimit) + "px";
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
                            __zWStyle.top = (__lastOffsetTop - __pageYA) + "px";
                        } else {
                            __zWStyle.height = __resizeLimit + "px";
                            __zWStyle.top = ((__lastOffsetTop + __lastHeight) - __resizeLimit) + "px";
                        }
                    }
                    
                    if (__resizer === "bottom" || __resizer === "bottom-left" || __resizer === "bottom-right")
                    {
                        __newHeight = (__pageY > __lastPageY ? __lastHeight + __pageYB : __lastHeight - __pageYA);
                        __zWStyle.height = (__newHeight > __resizeLimit ? __newHeight : __resizeLimit) + "px";
                    }
                    
                    if (typeof __zWindow.onResize === "function") {
                        __zWindow.onResize({
                            x : __zWindow.offsetTop
                            ,y : __zWindow.offsetLeft
                            ,width : __zWindow.offsetWidth
                            ,height : __zWindow.offsetHeight
                        });
                    }
                    
                    return false;
                }
            }).mouseup(function() {
                var __zWindowObj = zsi.__zWindow;

                if (__zWindowObj.drag || __zWindowObj.resize) {
                    var __zWindow = __zWindowObj.zWindow;
                    
                    $(".zWindow.last-active").removeClass("last-active");
                    __zWindow.className  = __zWindow.className.replace(/ active/gi,"") + " last-active";
                    
                    if (__zWindowObj.drag && typeof __zWindow.onDragEnd === "function") {
                        __zWindow.onDragEnd({
                            x : __zWindow.offsetTop
                            ,y : __zWindow.offsetLeft
                            ,width : __zWindow.offsetWidth
                            ,height : __zWindow.offsetHeight
                        });
                    }
                    
                    if (__zWindowObj.resize && typeof __zWindow.onResizeEnd === "function") {
                        __zWindow.onResizeEnd({
                            x : __zWindow.offsetTop
                            ,y : __zWindow.offsetLeft
                            ,width : __zWindow.offsetWidth
                            ,height : __zWindow.offsetHeight
                        });
                    }
                    
                    __zWindowObj.drag = false;
                    __zWindowObj.resize = false;
                    return false;
                }
            });
            
            _zWindowObj.isBodyEventOn = true;
        }
    }
};