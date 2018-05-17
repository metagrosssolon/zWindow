zsi.__zWindow;


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
    });
    
    $(".zPanel").zWindow({
        "id" : "window2"
        ,"width" : 200
        ,"height" : 200
        ,"position" : "absolute"
    });
});

$.fn.zWindow = function(param) {
    if (this.length) {
        // Parameters
        // - id
        // - width
        // - height
        // - position
        
        var _$self              = this
            ,_self              = this[0]
            ,_selfStyle         = _self.style
            ,_selfCompStyle     = window.getComputedStyle(_self)
            ,_$zWindow
            ,_zWindow
            ,_zWindowStyle
            ,_zWindowCompStyle
            
            ,_drag
            ,_resize
            ,_subtrahend        = {}
            ,_onMouseDownObj    = {}
        ;
        
        _$self.append(
            '<div id="' + param.id + '" class="zWindow">'
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
        
        _$zWindow = $("#" + param.id)
        .css({
            "width" : param.width
            ,"height" : param.height
            ,"position" : param.position
        });
        
        _zWindow = _$zWindow[0];
        _zWindowStyle = _zWindow.style;
        _zWindowCompStyle = window.getComputedStyle(_zWindow);
        
        
        
        
        _$zWindow.mousedown(function(e) {
            var __target = e.target;
            
            if (__target.id === param.id) {
                _drag = true;
                
                if (_zWindowCompStyle.position === "absolute") {
                    // zWindow is absolute
                    if (_selfCompStyle.position === "relative") {
                        _subtrahend.y = _self.offsetTop + e.offsetY;
                        _subtrahend.x = _self.offsetLeft + e.offsetX;
                    } else {
                        _subtrahend.y = e.offsetY;
                        _subtrahend.x = e.offsetX;
                    }
                } else {
                    // zWindow is fixed
                    _subtrahend.y = e.offsetY;
                    _subtrahend.x = e.offsetX;
                }
                
                _zWindow.className += " active";
            } else if (__target.classList[0] === "resizer") {
                _resize = true;
                
                _onMouseDownObj.resizer      = __target.attributes.resize.value;
                _onMouseDownObj.pageX        = e.pageX;
                _onMouseDownObj.pageY        = e.pageY;
                _onMouseDownObj.width        = _zWindow.offsetWidth;
                _onMouseDownObj.height       = _zWindow.offsetHeight;
                _onMouseDownObj.offsetTop    = _zWindow.offsetTop;
                _onMouseDownObj.offsetLeft   = _zWindow.offsetLeft;
            }
            
            // Prevent browser mouse down/up bug
            e.preventDefault();
        });
        
        
        _$self.mousemove(function(e) {
            if (_drag) {
                if (_zWindowCompStyle.position === "absolute") {
                    // zWindow is absolute
                    _zWindowStyle.top = e.pageY - _subtrahend.y + "px";
                    _zWindowStyle.left = e.pageX - _subtrahend.x + "px";
                } else {
                    // zWindow is fixed
                    _zWindowStyle.top = e.clientY - _subtrahend.y + "px";
                    _zWindowStyle.left = e.clientX - _subtrahend.x + "px";
                }
                
                return false;
            }
            
            if (_resize) {
                var __resizer           = _onMouseDownObj.resizer
                    ,__pageX            = e.pageX
                    ,__pageY            = e.pageY
                    ,__lastPageX        = _onMouseDownObj.pageX
                    ,__lastPageY        = _onMouseDownObj.pageY
                    ,__lastWidth        = _onMouseDownObj.width
                    ,__lastHeight       = _onMouseDownObj.height
                    ,__lastOffsetTop    = _onMouseDownObj.offsetTop
                    ,__lastOffsetLeft   = _onMouseDownObj.offsetLeft
                    ,__newWidth         = 0
                    ,__newHeight        = 0
                    
                    ,__pageXA         = __lastPageX - __pageX
                    ,__pageXB         = __pageX - __lastPageX
                    ,__pageYA         = __lastPageY - __pageY
                    ,__pageYB         = __pageY - __lastPageY
                ;
                
                if (__resizer === "left" || __resizer === "top-left" || __resizer === "bottom-left")
                {
                    __newWidth = (__pageX > __lastPageX ? __lastWidth + __pageXA : __lastWidth - __pageXB);
                    
                    if (__newWidth > 200) {
                        _zWindowStyle.width = __newWidth + "px";
                        _zWindowStyle.left = (__lastOffsetLeft - __pageXA) + "px";
                    } else {
                        _zWindowStyle.width = "200px";
                        _zWindowStyle.left = ((__lastOffsetLeft + __lastWidth) - 200) + "px";
                    }
                }
                
                if (__resizer === "right" || __resizer === "bottom-right" || __resizer === "top-right")
                {
                    __newWidth = (__pageX > __lastPageX ? __lastWidth + __pageXB : __lastWidth - __pageXA);
                    _zWindowStyle.width = (__newWidth > 200 ? __newWidth : 200) + "px";
                }
                
                if (__resizer === "top" || __resizer === "top-left" || __resizer === "top-right")
                {
                    __newHeight = (__pageY > __lastPageY ? __lastHeight + __pageYA : __lastHeight - __pageYB);
                    
                    if (__newHeight > 200) {
                        _zWindowStyle.height = __newHeight + "px";
                        _zWindowStyle.top = (__lastOffsetTop - __pageYA) + "px";
                    } else {
                        _zWindowStyle.height = "200px";
                        _zWindowStyle.top = ((__lastOffsetTop + __lastHeight) - 200) + "px";
                    }
                }
                
                if (__resizer === "bottom" || __resizer === "bottom-left" || __resizer === "bottom-right")
                {
                    __newHeight = (__pageY > __lastPageY ? __lastHeight + __pageYB : __lastHeight - __pageYA);
                    _zWindowStyle.height = (__newHeight > 200 ? __newHeight : 200) + "px";
                }
                
                return false;
            }
        }).mouseup(function() {
            _zWindow.className = _zWindow.className.replace(/ active/i,"");
            _drag = false;
            _resize = false;
        }).mouseleave(function() {
            if (_resize) {
                if (_zWindowCompStyle.position === "absolute") {
                    _resize = false;
                    return false;
                }
            }
        });
    }
};