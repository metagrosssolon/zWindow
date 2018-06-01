$(document).ready(function() {
    $(".zPanel").css({
        "width" : $(window).width()
        ,"height" : $(window).height()
    });
    
    $("#drag1").zDrag();
    $("#drag2").zDrag();
    $("#drag3").zDrag();
});


zsi.__zDrag = {
    "drag" : false
    
    ,"self" : null
    ,"selfStyle" : null
    ,"parentPosition" : ""
    ,"position" : ""
    
    ,"dragLimit" : {}
    ,"subtrahend" : {}
    ,"width" : 0
    ,"height" : 0
};

$.fn.zDrag = function(option) {
    if (this.length) {
        // Default initialization
    	var _default = [{
    		"width" : 100
    		,"height" : 100
    		,"position" : "absolute" // "absolute" || "fixed"
    		,"target" : this // "any jquery node"
    	}];
    	
    	// Merge the default options and user options
		var _settings = $.extend( true , _default , option )[0];
		
		var _self              = this[0]
            ,_selfStyle         = _self.style
            
            ,_parent            = this.parent()[0]
            ,_parentPosition    = window.getComputedStyle(_parent).position
            
            ,_noDrag            = false
            ,_zDrag             = zsi.__zDrag
        ;
        
        // DRAG SECTION
        _settings.target.mousedown(function(e) {
            if (_noDrag) return false;
            
            _zDrag.self             = _self;
            _zDrag.selfStyle        = _selfStyle;
            _zDrag.position         = _selfStyle.position;
            _zDrag.parentPosition   = _parentPosition;
            
            if (_zDrag.position === "absolute") {
                // zWindow is absolute
                
                _zDrag.dragLimit = {
                    "bottom" : _parent.offsetHeight
                    ,"right" : _parent.offsetWidth
                };
                
                if (_parentPosition === "initial" || _parentPosition === "static") {
                    _zDrag.subtrahend = { "y" : e.offsetY , "x" : e.offsetX };
                } else {
                    _zDrag.subtrahend = { 
                        "y" : e.pageY - _self.offsetTop 
                        , "x" : e.pageX - _self.offsetLeft
                    };
                    
                    _zDrag.width = _self.offsetWidth;
                    _zDrag.height = _self.offsetHeight;
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
            e.stopPropagation();
            return false;
        });
    }
};

window.onmousemove = function(e) {
    var _obj = zsi.__zDrag;
    
    if (_obj.drag) {
        var _self        = _obj.self
            ,_selfStyle  = _obj.selfStyle
            ,_subtrahend = _obj.subtrahend
        ;
        
        if (_obj.position === "absolute") {
            // self is absolute
            var _pageY = e.pageY
                ,_pageX = e.pageX
                ,_parentPosition = _obj.parentPosition
            ;
    
            if (_parentPosition === "initial" || _parentPosition === "static") {
                _selfStyle.top   = _pageY - _subtrahend.y + "px";
                _selfStyle.left  = _pageX - _subtrahend.x + "px";
            } else {
                var _dragLimit     = _obj.dragLimit
                    ,_dlBottom     = _dragLimit.bottom
                    ,_dlRight      = _dragLimit.right
                    ,_width        = _obj.width
                    ,_height       = _obj.height
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
        
        e.stopPropagation();
        return false;
    }
};

window.onmouseup = function(e) {
    var _obj    = zsi.__zDrag
        ,_drag = _obj.drag
    ;
    
    if (_drag) {
        var _self = _obj.self;
        
        $(".last-active").removeClass("last-active");
        _self.className = _self.className.replace(/ active/gi,"") + " last-active";
        
        if (typeof _self.onDragEnd === "function") {
            _self.onDragEnd();
        }
        
        _obj.drag = false;
        e.stopPropagation();
        return false;
    }
};