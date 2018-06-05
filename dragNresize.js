$(document).ready(function() {
    $(".zPanel").css({
        "width" : $(window).width()
        ,"height" : $(window).height()
    });
    
    $("#resize1").zResize().zDrag();
    $("#resize2").zResize().zDrag();
    $("#resize3").zResize().zDrag();
});

zsi.__zDrag = {
    "drag"              : false
    ,"self"             : null
    ,"selfStyle"        : null
    ,"parentPosition"   : ""
    ,"dragLimit"        : {}
    ,"subtrahend"       : {}
    ,"width"            : 0
    ,"height"           : 0
};

zsi.__zResize = {
    "resize"        : false
    ,"self"         : null
    ,"selfStyle"    : null
    ,"resizeLimit"  : null
};

$.fn.zResize = function(option) {
    if (this.length) {
        if (this[0].zResizeInit) return this;
        
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
            '<div class="resizer resizer-h top left right" resize="top"></div>'
            + '<div class="resizer resizer-h bottom left right" resize="bottom"></div>'
            + '<div class="resizer resizer-w left top bottom" resize="left"></div>'
            + '<div class="resizer resizer-w right top bottom" resize="right"></div>'
            + '<div class="resizer resizer-wha top right" resize="top-right"></div>'
            + '<div class="resizer resizer-wha bottom left" resize="bottom-left"></div>'
            + '<div class="resizer resizer-whb top left" resize="top-left"></div>'
            + '<div class="resizer resizer-whb bottom right" resize="bottom-right"></div>'
        );
        
        _selfStyle.position = _settings.position;
        _self.setAttribute("zresize", true);
        
        // RESIZE SECTION
        _$self.find(".resizer").mousedown(function(e) {
            _noResize = (_$self.attr("zresize") === "true" ? false : true );
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
            return false;
        });
        
        _self.zResizeInit = true;
        return _$self;
    }
};

$.fn.zDrag = function(option) {
    if (this.length) {
        if (this[0].zDragInit) return this;
        
        // Default initialization
    	var _default = [{
    		"position" : "absolute" // "absolute" || "fixed"
    		,"target" : this // "any children jquery node"
    	}];
    	
    	// Merge the default options and user options
		var _settings = $.extend( true , _default , option )[0];
		
		var _$self              = this
		    ,_self              = _$self[0]
            ,_selfStyle         = _self.style
            
            ,_parent            = _$self.parent()[0]
            ,_parentPosition    = window.getComputedStyle(_parent).position
            
            ,_noDrag            = false
            ,_zDrag             = zsi.__zDrag
        ;
        
        _selfStyle.position = _settings.position;
        _self.setAttribute("zdrag", true);
        
        // DRAG SECTION
        _settings.target.mousedown(function(e) {
            _noDrag = (_$self.attr("zdrag") === "true" ? false : true );
            if (_noDrag) return false;
            
            _zDrag.self             = _self;
            _zDrag.selfStyle        = _selfStyle;
            _zDrag.parentPosition   = _parentPosition;
            
            if (_selfStyle.position === "absolute") {
                // zWindow is absolute
                if (_parentPosition === "initial" || _parentPosition === "static") {
                    _zDrag.subtrahend = { "y" : e.offsetY , "x" : e.offsetX };
                } else {
                    _zDrag.subtrahend = { 
                        "y" : e.pageY - _self.offsetTop 
                        , "x" : e.pageX - _self.offsetLeft
                    };
                    
                    _zDrag.dragLimit = {
                        "bottom" : _parent.offsetHeight
                        ,"right" : _parent.offsetWidth
                    };
                    
                    _zDrag.height = _self.offsetHeight;
                    _zDrag.width = _self.offsetWidth;
                }
            } else {
                // zWindow is fixed
                _zDrag.subtrahend = { "y" : e.offsetY , "x" : e.offsetX };
            }
            
            _zDrag.drag = true;
            _self.className += " active";
            
            if (typeof _self.onDragStart === "function") {
                _self.onDragStart();
            }
            
            // Prevent browser mouse down/up bug
            e.preventDefault();
            return false;
        });
        
        _self.zDragInit = true;
        return _$self;
    }
};

window.onmousemove = function(e) {
    var _objResize = zsi.__zResize;
    var _objDrag = zsi.__zDrag;
    
    if (_objResize.resize) {
        var _self           = _objResize.self
            ,_selfStyle     = _objResize.selfStyle
            ,_resizeLimit   = _objResize.resizeLimit
            
            ,_resizer       = _objResize.resizer
            ,_lastPageX     = _objResize.pageX
            ,_lastPageY     = _objResize.pageY
            ,_lastTop       = _objResize.top
            ,_lastLeft      = _objResize.left
            ,_lastWidth     = _objResize.width
            ,_lastHeight    = _objResize.height
            
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
        
        return false;
    }
    
    if (_objDrag.drag) {
        var _self        = _objDrag.self
            ,_selfStyle  = _objDrag.selfStyle
            ,_subtrahend = _objDrag.subtrahend
        ;
        
        if (_selfStyle.position === "absolute") {
            // self is absolute
            var _pageY = e.pageY
                ,_pageX = e.pageX
                ,_parentPosition = _objDrag.parentPosition
            ;
    
            if (_parentPosition === "initial" || _parentPosition === "static") {
                _selfStyle.top   = _pageY - _subtrahend.y + "px";
                _selfStyle.left  = _pageX - _subtrahend.x + "px";
            } else {
                var _dragLimit     = _objDrag.dragLimit
                    ,_dlBottom     = _dragLimit.bottom
                    ,_dlRight      = _dragLimit.right
                    ,_width        = _objDrag.width
                    ,_height       = _objDrag.height
                    ,_currentY     = _pageY - _subtrahend.y
                    ,_currentX     = _pageX - _subtrahend.x
                    ,_newY         = 0
                    ,_newX         = 0
                ;
                
                if (_currentY + _height > _dlBottom) { _newY = _dlBottom - _height; }
                else { _newY = _pageY - _subtrahend.y; }
                
                if (_currentX + _width > _dlRight) { _newX = _dlRight - _width; }
                else { _newX = _pageX - _subtrahend.x; }
                
                if (_currentY < 0 || _newY < 0) { _newY = 0; }
                if (_currentX < 0 || _newX < 0) { _newX = 0; }
                
                _selfStyle.top = _newY + "px";
                _selfStyle.left = _newX + "px";
            }
        } else {
            // self is fixed
            _selfStyle.top   = e.clientY - _subtrahend.y + "px";
            _selfStyle.left  = e.clientX - _subtrahend.x + "px";
        }
        
        if (typeof _self.onDrag === "function") {
            _self.onDrag();
        }
        
        return false;
    }
};

window.onmouseup = function(e) {
    var _objDrag    = zsi.__zDrag
        ,_objResize = zsi.__zResize
        ,_resize    = _objResize.resize
        ,_drag      = _objDrag.drag
    ;
    
    if (_drag || _resize) {
        var _self = (_drag ? _objDrag.self : _objResize.self);
        
        $(".last-active, .active").removeClass("last-active active");
        _self.className = _self.className.replace(/ active/gi,"") + " last-active";
        
        if (_drag && typeof _self.onDragEnd === "function") {
            _self.onDragEnd();
        }
        
        if (_resize && typeof _self.onResizeEnd === "function") {
            _self.onResizeEnd();
        }
        
        _objDrag.drag = false;
        _objResize.resize = false;
        return false;
    }
};