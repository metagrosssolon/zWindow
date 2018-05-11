zsi.ready(function() {
    $(".zPanel").css({
        "width" : $(window).width()
        ,"height" : $(window).height()
    });
    
    $("body").zWindow({
        "id" : "window1"
        ,"width" : 200
        ,"height" : 200
        ,"position" : "fixed"
    });
    
    $("body").zWindow({
        "id" : "window2"
        ,"width" : 100
        ,"height" : 100
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
        
        var $self = this
            ,self = this[0]
            ,selfStyle = self.style
            ,$zWindow
            ,zWindow
            ,zWindowStyle
            
            ,drag
            ,resize
            ,subtrahend = {}
            ,onMouseDownObj = {}
            
            ,__zWindow = zsi.__zWindow
        ;
        
        $self.append(
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
        
        $zWindow = $("#" + param.id)
        .css({
            "width" : param.width
            ,"height" : param.height
            ,"position" : param.position
        });
        
        zWindow = $zWindow[0];
        zWindowStyle = zWindow.style;
        
        $zWindow.mousedown(function(e) {
            var _target = e.target;
            
            if (_target.id === param.id) {
                drag = true;
                
                if (zWindowStyle.position === "absolute") {
                    // zWindow is absolute
                    if (selfStyle.position === "relative") {
                        subtrahend.y = self.offsetTop + e.offsetY;
                        subtrahend.x = self.offsetLeft + e.offsetX;
                    } else {
                        subtrahend.y = e.offsetY;
                        subtrahend.x = e.offsetX;
                    }
                } else {
                    // zWindow is fixed
                    subtrahend.y = e.offsetY;
                    subtrahend.x = e.offsetX;
                }
                
                zWindow.className += " active";
            } else if (_target.classList[0] === "resizer") {
                resize = true;
                
                onMouseDownObj.resizer      = _target.attributes.resize.value;
                onMouseDownObj.pageX        = e.pageX;
                onMouseDownObj.pageY        = e.pageY;
                onMouseDownObj.width        = zWindow.offsetWidth;
                onMouseDownObj.height       = zWindow.offsetHeight;
                onMouseDownObj.offsetTop    = zWindow.offsetTop;
                onMouseDownObj.offsetLeft   = zWindow.offsetLeft;
            }
            
            // Prevent browser mouse down/up bug
            e.preventDefault();
        });
        
        /*$self.mousemove(function(e) {
            console.log(param.id);
            if (drag) {
                if (zWindowStyle.position === "absolute") {
                    // zWindow is absolute
                    zWindowStyle.top = e.pageY - subtrahend.y + "px";
                    zWindowStyle.left = e.pageX - subtrahend.x + "px";
                } else {
                    // zWindow is fixed
                    zWindowStyle.top = e.clientY - subtrahend.y + "px";
                    zWindowStyle.left = e.clientX - subtrahend.x + "px";
                }
                
                return false;
            }
            
            if (resize) {
                var _resizer = onMouseDownObj.resizer
                    ,_pageX = e.pageX
                    ,_pageY = e.pageY
                    ,_lastPageX = onMouseDownObj.pageX
                    ,_lastPageY = onMouseDownObj.pageY
                    ,_lastWidth = onMouseDownObj.width
                    ,_lastHeight = onMouseDownObj.height
                    ,_lastOffsetTop = onMouseDownObj.offsetTop
                    ,_lastOffsetLeft = onMouseDownObj.offsetLeft
                    ,_newWidth = 0
                    ,_newHeight = 0
                    
                    ,_pageXPos = _lastPageX - _pageX
                    ,_pageXNeg = _pageX - _lastPageX
                    ,_pageYPos = _lastPageY - _pageY
                    ,_pageYNeg = _pageY - _lastPageY
                ;
                
                if (_resizer === "left" || _resizer === "top-left" || _resizer === "bottom-left")
                {
                    _newWidth = (_pageX > _lastPageX ? _lastWidth + _pageXPos : _lastWidth - _pageXNeg);
                    
                    if (_newWidth > 200) {
                        zWindowStyle.width = _newWidth + "px";
                        zWindowStyle.left = (_lastOffsetLeft - _pageXPos) + "px";
                    } else {
                        zWindowStyle.width = "200px";
                        zWindowStyle.left = ((_lastOffsetLeft + _lastWidth) - 200) + "px";
                    }
                }
                
                if (_resizer === "right" || _resizer === "bottom-right" || _resizer === "top-right")
                {
                    _newWidth = (_pageX > _lastPageX ? _lastWidth + _pageXNeg : _lastWidth - _pageXPos);
                    zWindowStyle.width = (_newWidth > 200 ? _newWidth : 200) + "px";
                }
                
                if (_resizer === "top" || _resizer === "top-left" || _resizer === "top-right")
                {
                    _newHeight = (_pageY > _lastPageY ? _lastHeight + _pageYPos : _lastHeight - _pageYNeg);
                    
                    if (_newHeight > 200) {
                        zWindowStyle.height = _newHeight + "px";
                        zWindowStyle.top = (_lastOffsetTop - _pageYPos) + "px";
                    } else {
                        zWindowStyle.height = "200px";
                        zWindowStyle.top = ((_lastOffsetTop + _lastHeight) - 200) + "px";
                    }
                }
                
                if (_resizer === "bottom" || _resizer === "bottom-left" || _resizer === "bottom-right")
                {
                    _newHeight = (_pageY > _lastPageY ? _lastHeight + _pageYNeg : _lastHeight - _pageYPos);
                    zWindowStyle.height = (_newHeight > 200? _newHeight : 200) + "px";
                }
                
                return false;
            }
        }).mouseup(function(e) {
            if (drag) {
                zWindow.className = zWindow.className.replace(/ active/i,"");
                
                drag = false;
                return false;
            }
            
            if (resize) {
                var _resizer = onMouseDownObj.resizer
                    ,_pageX = e.pageX
                    ,_pageY = e.pageY
                    ,_lastPageX = onMouseDownObj.pageX
                    ,_lastPageY = onMouseDownObj.pageY
                    ,_newWidth
                    ,_newHeight
                ;
                
                if (_resizer === "left" || _resizer === "top-left" || _resizer === "bottom-left")
                {
                    _newWidth = (_pageX > _lastPageX ? zWindow.offsetWidth + (_lastPageX - _pageX) : zWindow.offsetWidth - (_pageX - _lastPageX));
                    zWindowStyle.width = (_newWidth > 15 ? _newWidth : 15) + "px";
                    zWindowStyle.left = (zWindow.offsetLeft - (_lastPageX - _pageX)) + "px";
                }
                
                if (_resizer === "right" || _resizer === "bottom-right" || _resizer === "top-right")
                {
                    _newWidth = (_pageX > _lastPageX ? zWindow.offsetWidth + (_pageX - _lastPageX) : zWindow.offsetWidth - (_lastPageX - _pageX));
                    zWindowStyle.width = (_newWidth > 15 ? _newWidth : 15) + "px";
                }
                
                if (_resizer === "top" || _resizer === "top-left" || _resizer === "top-right")
                {
                    _newHeight = (_pageY > _lastPageY ? zWindow.offsetHeight + (_lastPageY - _pageY) : zWindow.offsetHeight - (_pageY - _lastPageY));
                    zWindowStyle.height = (_newHeight > 15? _newHeight : 15) + "px";
                    zWindowStyle.top = (zWindow.offsetTop - (_lastPageY - _pageY)) + "px";
                }
                
                if (_resizer === "bottom" || _resizer === "bottom-left" || _resizer === "bottom-right")
                {
                    _newHeight = (_pageY > _lastPageY ? zWindow.offsetHeight + (_pageY - _lastPageY) : zWindow.offsetHeight - (_lastPageY - _pageY));
                    zWindowStyle.height = (_newHeight > 15? _newHeight : 15) + "px";
                }
                
                resize = false;   
                return false;
            }
        });*/
        
        
        if (typeof zsi.__zWindow.mouseMoveOn === "undefined") {
            
            $(window).mousemove(function(e) {
                console.log(param.id);
                if (drag) {
                    if (zWindowStyle.position === "absolute") {
                        // zWindow is absolute
                        zWindowStyle.top = e.pageY - subtrahend.y + "px";
                        zWindowStyle.left = e.pageX - subtrahend.x + "px";
                    } else {
                        // zWindow is fixed
                        zWindowStyle.top = e.clientY - subtrahend.y + "px";
                        zWindowStyle.left = e.clientX - subtrahend.x + "px";
                    }
                    
                    return false;
                }
                
                if (resize) {
                    var _resizer = onMouseDownObj.resizer
                        ,_pageX = e.pageX
                        ,_pageY = e.pageY
                        ,_lastPageX = onMouseDownObj.pageX
                        ,_lastPageY = onMouseDownObj.pageY
                        ,_lastWidth = onMouseDownObj.width
                        ,_lastHeight = onMouseDownObj.height
                        ,_lastOffsetTop = onMouseDownObj.offsetTop
                        ,_lastOffsetLeft = onMouseDownObj.offsetLeft
                        ,_newWidth = 0
                        ,_newHeight = 0
                        
                        ,_pageXPos = _lastPageX - _pageX
                        ,_pageXNeg = _pageX - _lastPageX
                        ,_pageYPos = _lastPageY - _pageY
                        ,_pageYNeg = _pageY - _lastPageY
                    ;
                    
                    if (_resizer === "left" || _resizer === "top-left" || _resizer === "bottom-left")
                    {
                        _newWidth = (_pageX > _lastPageX ? _lastWidth + _pageXPos : _lastWidth - _pageXNeg);
                        
                        if (_newWidth > 200) {
                            zWindowStyle.width = _newWidth + "px";
                            zWindowStyle.left = (_lastOffsetLeft - _pageXPos) + "px";
                        } else {
                            zWindowStyle.width = "200px";
                            zWindowStyle.left = ((_lastOffsetLeft + _lastWidth) - 200) + "px";
                        }
                    }
                    
                    if (_resizer === "right" || _resizer === "bottom-right" || _resizer === "top-right")
                    {
                        _newWidth = (_pageX > _lastPageX ? _lastWidth + _pageXNeg : _lastWidth - _pageXPos);
                        zWindowStyle.width = (_newWidth > 200 ? _newWidth : 200) + "px";
                    }
                    
                    if (_resizer === "top" || _resizer === "top-left" || _resizer === "top-right")
                    {
                        _newHeight = (_pageY > _lastPageY ? _lastHeight + _pageYPos : _lastHeight - _pageYNeg);
                        
                        if (_newHeight > 200) {
                            zWindowStyle.height = _newHeight + "px";
                            zWindowStyle.top = (_lastOffsetTop - _pageYPos) + "px";
                        } else {
                            zWindowStyle.height = "200px";
                            zWindowStyle.top = ((_lastOffsetTop + _lastHeight) - 200) + "px";
                        }
                    }
                    
                    if (_resizer === "bottom" || _resizer === "bottom-left" || _resizer === "bottom-right")
                    {
                        _newHeight = (_pageY > _lastPageY ? _lastHeight + _pageYNeg : _lastHeight - _pageYPos);
                        zWindowStyle.height = (_newHeight > 200? _newHeight : 200) + "px";
                    }
                    
                    return false;
                }
            });
            
            
            zsi.__zWindow.mouseMoveOn = true;
        }
    }
};  