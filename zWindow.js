zsi.ready(function() {
    $(".zPanel").css({
        "width" : $(window).width()
        ,"height" : $(window).height()
    });
    
    $(".zPanel").zWindow({
        "id" : "window1"
        ,"width" : 100
        ,"height" : 100
    });
    
    /*$(".zPanel").zWindow({
        "id" : "window2"
        ,"width" : 100
        ,"height" : 100
    });*/
});

$.fn.zWindow = function(param) {
    if (this.length) {
        // Parameters
        // - id
        // - width
        // - height
        
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
        });
        
        zWindow = $zWindow[0];
        zWindowStyle = zWindow.style;
        
        $zWindow.mousedown(function(e) {
            var _target = e.target;
            
            if (_target.id === param.id) {
                drag = true;
                
                if (selfStyle.position === "relative") {
                    subtrahend.y = self.offsetTop + e.offsetY;
                    subtrahend.x = self.offsetLeft + e.offsetX;
                } else {
                    subtrahend.y = e.offsetY;
                    subtrahend.x = e.offsetX;
                }
                
                zWindow.className += " active";
            } else if (_target.classList[0] === "resizer") {
                resize = true;
                
                onMouseDownObj.pageX = e.pageX;
                onMouseDownObj.pageY = e.pageY;
                onMouseDownObj.resizer = _target.attributes.resize.value;
            }
            
            // Prevent browser mouse down/up bug
            e.preventDefault();
        });
        
        $self.mousemove(function(e) {
            if (drag) {
                zWindowStyle.top = e.pageY - subtrahend.y + "px";
                zWindowStyle.left = e.pageX - subtrahend.x + "px";
            }
        }).mouseup(function(e) {
            if (drag) {
                drag = false;
                zWindow.className = zWindow.className.replace(/ active/i,"");
                
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
                
                resize = false;
                
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
                
                return false;
            }
        });
    }
}; 