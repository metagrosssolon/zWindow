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
    
    $("body").zWindow({
        "id" : "window2"
        ,"width" : 200
        ,"height" : 200
        ,"position" : "fixed"
    });
});

$.fn.zWindow = function(param) {
    if (this.length) {
        // Parameters
        // - id
        // - width
        // - height
        // - position
        
        var _$self = this
            ,_self = this[0]
            ,_selfStyle = _self.style
            ,_$zWindow
            ,_zWindow
            ,_zWindowStyle
            
            ,_drag
            ,_resize
            ,_subtrahend = {}
            ,_onMouseDownObj = {}
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
        
        _$zWindow.mousedown(function(e) {
            var __target = e.target;
            
            if (__target.id === param.id) {
                _drag = true;
                
                if (_zWindowStyle.position === "absolute") {
                    // zWindow is absolute
                    if (_selfStyle.position === "relative") {
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
                if (_zWindowStyle.position === "absolute") {
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
                var __resizer = _onMouseDownObj.resizer
                    ,__pageX = e.pageX
                    ,__pageY = e.pageY
                    ,__lastPageX = _onMouseDownObj.pageX
                    ,__lastPageY = _onMouseDownObj.pageY
                    ,__lastWidth = _onMouseDownObj.width
                    ,__lastHeight = _onMouseDownObj.height
                    ,__lastOffsetTop = _onMouseDownObj.offsetTop
                    ,__lastOffsetLeft = _onMouseDownObj.offsetLeft
                    ,__newWidth = 0
                    ,__newHeight = 0
                    
                    ,__pageXPos = __lastPageX - __pageX
                    ,__pageXNeg = __pageX - __lastPageX
                    ,__pageYPos = __lastPageY - __pageY
                    ,__pageYNeg = __pageY - __lastPageY
                ;
                
                if (__resizer === "left" || __resizer === "top-left" || __resizer === "bottom-left")
                {
                    __newWidth = (__pageX > __lastPageX ? __lastWidth + __pageXPos : __lastWidth - __pageXNeg);
                    
                    if (__newWidth > 200) {
                        _zWindowStyle.width = __newWidth + "px";
                        _zWindowStyle.left = (__lastOffsetLeft - __pageXPos) + "px";
                    } else {
                        _zWindowStyle.width = "200px";
                        _zWindowStyle.left = ((__lastOffsetLeft + __lastWidth) - 200) + "px";
                    }
                }
                
                if (__resizer === "right" || __resizer === "bottom-right" || __resizer === "top-right")
                {
                    __newWidth = (__pageX > __lastPageX ? __lastWidth + __pageXNeg : __lastWidth - __pageXPos);
                    _zWindowStyle.width = (__newWidth > 200 ? __newWidth : 200) + "px";
                }
                
                if (__resizer === "top" || __resizer === "top-left" || __resizer === "top-right")
                {
                    __newHeight = (__pageY > __lastPageY ? __lastHeight + __pageYPos : __lastHeight - __pageYNeg);
                    
                    if (__newHeight > 200) {
                        _zWindowStyle.height = __newHeight + "px";
                        _zWindowStyle.top = (__lastOffsetTop - __pageYPos) + "px";
                    } else {
                        _zWindowStyle.height = "200px";
                        _zWindowStyle.top = ((__lastOffsetTop + __lastHeight) - 200) + "px";
                    }
                }
                
                if (__resizer === "bottom" || __resizer === "bottom-left" || __resizer === "bottom-right")
                {
                    __newHeight = (__pageY > __lastPageY ? __lastHeight + __pageYNeg : __lastHeight - __pageYPos);
                    _zWindowStyle.height = (__newHeight > 200? __newHeight : 200) + "px";
                }
                
                return false;
            }
        }).mouseup(function(e) {
            if (_drag) {
                _zWindow.className = _zWindow.className.replace(/ active/i,"");
                
                _drag = false;
                return false;
            }
            
            if (_resize) {
                
                _resize = false;   
                return false;
            }
        });
    }
};