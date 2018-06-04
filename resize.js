$(document).ready(function() {
    $(".zPanel").css({
        "width" : $(window).width()
        ,"height" : $(window).height()
    });
    
    $("#resize1").zResize();
});


zsi.__zResize = {
    "resize" : false
    ,"self" : null
    ,"selfStyle" : null
    ,"resizeLimit" : null
};

$.fn.zResize = function(option) {
    if (this.length) {
        // Default initialization
		var _default = {
		    "position" : "absolute" // "absolute" || "fixed"
			,"resizeLimit" : 100
		};
		
		// Merge the default options and user options
		var _settings   = $.extend( true , _default , option );
        
        var _$self      = this
            ,_self      = _$self[0]
            ,_selfStyle = _self.style
            
            ,_noResize  = false
            ,_zResize   = zsi.__zResize
        ;
        
        _$self.append(
            '<div class="resizer resizer-h top" resize="top"></div>'
            + '<div class="resizer resizer-h bottom" resize="bottom"></div>'
            + '<div class="resizer resizer-w left" resize="left"></div>'
            + '<div class="resizer resizer-w right" resize="right"></div>'
            + '<div class="resizer resizer-wha top right" resize="top-right"></div>'
            + '<div class="resizer resizer-wha bottom left" resize="bottom-left"></div>'
            + '<div class="resizer resizer-whb top left" resize="top-left"></div>'
            + '<div class="resizer resizer-whb bottom right" resize="bottom-right"></div>'
        );
        
        _selfStyle.position = _settings.position;
        _self.setAttribute("zresize", true);
        
        // RESIZE SECTION
        _$self.find(".resizer").mousedown(function(e) {
            if (_noResize) return false;
            
            _zResize.self        = _self;
            _zResize.selfStyle   = _selfStyle;
            _zResize.resizeLimit = _settings.resizeLimit;
            
            _zResize.resizer     = e.target.attributes.resize.value;
            _zResize.pageX       = e.pageX;
            _zResize.pageY       = e.pageY;
            _zResize.top         = _self.offsetTop;
            _zResize.left        = _self.offsetLeft;
            _zResize.width       = _self.offsetWidth;
            _zResize.height      = _self.offsetHeight;
            
            _zResize.resize = true;
            _self.className += " active";
            
            if (typeof _self.onResizeStart === "function") {
                _self.onResizeStart();
            }
            
            // Prevent browser mouse down/up bug
            e.preventDefault();
            e.stopPropagation();
            return false;
        });
    }
};

window.onmousemove = function(e) {
    var _obj = zsi.__zResize;
    
    if (_obj.resize) {
        var _self           = _obj.self
            ,_selfStyle     = _obj.selfStyle
            ,_resizeLimit   = _obj.resizeLimit
            
            ,_resizer       = _obj.resizer
            ,_lastPageX     = _obj.pageX
            ,_lastPageY     = _obj.pageY
            ,_lastTop       = _obj.top
            ,_lastLeft      = _obj.left
            ,_lastWidth     = _obj.width
            ,_lastHeight    = _obj.height
            
            ,_pageX         = e.pageX
            ,_pageY         = e.pageY
            ,_newWidth      = 0
            ,_newHeight     = 0
            ,_pageXA        = _lastPageX - _pageX
            ,_pageXB        = _pageX - _lastPageX
            ,_pageYA        = _lastPageY - _pageY
            ,_pageYB        = _pageY - _lastPageY
        ;
        
        if (_resizer === "left" || _resizer === "top-left" || _resizer === "bottom-left")
        {
            _newWidth = (_pageX > _lastPageX ? _lastWidth + _pageXA : _lastWidth - _pageXB);
            
            if (_newWidth > _resizeLimit) {
                _selfStyle.width = _newWidth + "px";
                _selfStyle.left = (_lastLeft - _pageXA) + "px";
            } else {
                _selfStyle.width = _resizeLimit + "px";
                _selfStyle.left = ((_lastLeft + _lastWidth) - _resizeLimit) + "px";
            }
        }
        
        if (_resizer === "right" || _resizer === "bottom-right" || _resizer === "top-right")
        {
            _newWidth = (_pageX > _lastPageX ? _lastWidth + _pageXB : _lastWidth - _pageXA);
            _selfStyle.width = (_newWidth > _resizeLimit ? _newWidth : _resizeLimit) + "px";
        }
        
        if (_resizer === "top" || _resizer === "top-left" || _resizer === "top-right")
        {
            _newHeight = (_pageY > _lastPageY ? _lastHeight + _pageYA : _lastHeight - _pageYB);
            
            if (_newHeight > _resizeLimit) {
                _selfStyle.height = _newHeight + "px";
                _selfStyle.top = (_lastTop - _pageYA) + "px";
            } else {
                _selfStyle.height = _resizeLimit + "px";
                _selfStyle.top = ((_lastTop + _lastHeight) - _resizeLimit) + "px";
            }
        }
        
        if (_resizer === "bottom" || _resizer === "bottom-left" || _resizer === "bottom-right")
        {
            _newHeight = (_pageY > _lastPageY ? _lastHeight + _pageYB : _lastHeight - _pageYA);
            _selfStyle.height = (_newHeight > _resizeLimit ? _newHeight : _resizeLimit) + "px";
        }
        
        if (typeof _self.onResize === "function") {
            _self.onResize();
        }
        
        e.stopPropagation();
        return false;
    }
};

window.onmouseup = function(e) {
    var _obj      = zsi.__zResize
        ,_resize = _obj.resize
    ;
    
    if (_resize) {
        var _self = _obj.self;
        
        $(".last-active").removeClass("last-active");
        _self.className = _self.className.replace(/ active/gi,"") + " last-active";
        
        if (typeof _self.onResizeEnd === "function") {
            _self.onResizeEnd();
        }
        
        _obj.resize = false;
        
        e.stopPropagation();
        return false;
    }
};