if (window.ICE_SimulatorBridge) {

	var open = XMLHttpRequest.prototype.open;
	XMLHttpRequest.prototype.open = function() {

		if (arguments[1].indexOf("local:") !== -1) {
			arguments[1] = arguments[1].replace("local://", "http://");
		}

		open.apply(this, arguments);
	};

	var insertBefore = Node.prototype.insertBefore;
	Node.prototype.insertBefore = function() {
		Array.prototype.forEach.call(arguments, function (value) {
			if(value.src && value.src.indexOf("local://") !== -1 || value.src.indexOf("local://simulator/") !== -1) {
				value.src = value.src.replace("local://", "http://");
			}
		});

		insertBefore.apply(this, arguments);
	};
}