zsi.__zWindow = {
    "drag" : false
    ,"resize" : false
    ,"onMouseDownObj" : {}
    
    ,"zWindow" : null
    ,"zWindowStyle" : null
    ,"zWindowCompStyle" : null
    ,"self" : null
    ,"selfCompStyle" : null
    ,"settings" : {}
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
        ,"header" : "Header ni"
        ,"body" : "<h1>Body ni HAHAHAHAHHAHAHAHA</h1>"
    });
    
    $("#window1 .zw-body").zWindow({
        "id" : "window2"
        ,"width" : 100
        ,"height" : 100
        ,"position" : "absolute"
        ,"resizeLimit" : 100
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
			,"position" : "absolute"
			,"resizeLimit" : 200
			,"header" : ""
			,"body" : ""
		};
		
		// Merge the default options and user options
		var _settings = $.extend( true , _default , option );
        
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
            + '<div class="zw-content">'
            +   '<div class="zw-header">'
            +       '<div class="zw-title">' + _settings.header + '</div>'
            +       '<div class="zw-toolbar">'
            +           '<div class="zw-button">Pin</div>'
            +           '<div class="zw-button"><svg version="1.1" x="0px" y="0px" width="18px" height="18px" viewBox="0 0 24 24" enable-background="new 0 0 24 24" xml:space="preserve"><g id="Bounding_Boxes"><path fill="none" d="M0,0h24v24H0V0z"/></g><g id="Rounded"><path d="M18,19H6c-0.55,0-1-0.45-1-1V6c0-0.55,0.45-1,1-1h12c0.55,0,1,0.45,1,1v12C19,18.55,18.55,19,18,19z M19,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3L19,3z"/></g></svg></div>'
            +           '<div class="zw-button"><svg version="1.1" x="0px" y="0px" width="18px"height="18px" viewBox="0 0 24 24" enable-background="new 0 0 24 24" xml:space="preserve"><g id="Bounding_Boxes"><path fill="none" d="M0,0h24v24H0V0z"/></g><g id="Rounded"><path d="M18.3,5.71L18.3,5.71c-0.39-0.39-1.02-0.39-1.41,0L12,10.59L7.11,5.7c-0.39-0.39-1.02-0.39-1.41,0l0,0c-0.39,0.39-0.39,1.02,0,1.41L10.59,12L5.7,16.89c-0.39,0.39-0.39,1.02,0,1.41h0c0.39,0.39,1.02,0.39,1.41,0L12,13.41l4.89,4.89c0.39,0.39,1.02,0.39,1.41,0l0,0c0.39-0.39,0.39-1.02,0-1.41L13.41,12l4.89-4.89C18.68,6.73,18.68,6.09,18.3,5.71z"/></g></svg></div>'
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
            var __target = e.target;
            
            _zWindowObj.zWindow             = _zWindow;
            _zWindowObj.zWindowStyle        = _zWindowStyle;
            _zWindowObj.zWindowCompStyle    = _zWindowCompStyle;
            _zWindowObj.self                = _self;
            _zWindowObj.selfCompStyle       = _selfCompStyle;
            _zWindowObj.settings            = _settings;
            
            if (__target.className === "zw-title" || __target.parentNode.className === "zw-title") {
                var __onMouseDownObj  = _zWindowObj.onMouseDownObj
                    ,__zWoffsetTop    = _zWindow.offsetTop
                    ,__zWoffsetLeft   = _zWindow.offsetLeft
                    ,__zWoffsetWidth  = _zWindow.offsetWidth
                    ,__zWoffsetHeight = _zWindow.offsetHeight
                ;
                
                _zWindowObj.drag    = true;
                _zWindow.className += " active";
                
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
            }
            
            // Prevent browser mouse down/up bug
            e.preventDefault();
        });
        
        // RESIZE SECTION
        _$zWindow.find(".resizer").mousedown(function(e) {
            console.log(this);
            var __target          = e.target
                ,__zWoffsetTop    = _zWindow.offsetTop
                ,__zWoffsetLeft   = _zWindow.offsetLeft
                ,__zWoffsetWidth  = _zWindow.offsetWidth
                ,__zWoffsetHeight = _zWindow.offsetHeight
            ;
            
            _zWindowObj.resize = true;
            _zWindow.className += " active";
            
            _zWindowObj.onMouseDownObj = {
                "resizer"   : __target.attributes.resize.value
                ,"pageX"    : e.pageX
                ,"pageY"    : e.pageY
                ,"top"      : __zWoffsetTop
                ,"left"     : __zWoffsetLeft
                ,"width"    : __zWoffsetLeft
                ,"height"   : __zWoffsetHeight
            };
            
            if (typeof _zWindow.onResizeStart === "function") {
                _zWindow.onResizeStart({
                    "top"       : __zWoffsetTop
                    ,"left"     : __zWoffsetLeft
                    ,"width"    : __zWoffsetWidth
                    ,"height"   : __zWoffsetHeight
                });
            }
            
            // Prevent browser mouse down/up bug
            e.preventDefault();
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