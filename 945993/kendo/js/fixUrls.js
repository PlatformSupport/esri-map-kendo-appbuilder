if (window.ICE_SimulatorBridge) {
	var send = XMLHttpRequest.prototype.send;
	XMLHttpRequest.prototype.send = function() {
		send.apply(this, arguments);
	}
	
	// fix for some styles using the remote resources
	var f = Element.prototype.appendChild;
	Element.prototype.appendChild = function(){
		var element = arguments[0];
		if (element && element.style && element.style.backgroundImage && element.style.backgroundImage.indexOf("local://js.arcgis.com") !== -1) {
			element.style.backgroundImage = element.style.backgroundImage.replace("local://", "http://");
			arguments[0] =  element;
		}

		return f.apply(this, arguments);
	};
	
	var open = XMLHttpRequest.prototype.open;
	XMLHttpRequest.prototype.open = function() {
		if (arguments[1].indexOf("local://simulator/local://") !== -1) {
			arguments[1] = arguments[1].replace("local://simulator/local://", "http://");
		}
		open.apply(this, arguments);
	};

	var insertBefore = Node.prototype.insertBefore;
	Node.prototype.insertBefore = function() {
		Array.prototype.forEach.call(arguments, function (value) {
			if (value.src && value.src.indexOf("local://") !== -1 && value.src.indexOf("local://simulator/") === -1) {
				value.src = value.src.replace("local://", "http://");
			}
		});

		return insertBefore.apply(this, arguments);
	};
}