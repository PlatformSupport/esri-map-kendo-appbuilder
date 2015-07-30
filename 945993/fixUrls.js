(function () {
    if (window.ICE_SimulatorBridge) {
        var openOriginal = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function () {
            console.log(arguments[1]);
            if (arguments[1].indexOf("local://simulator/local://") !== -1) {
                arguments[1] = arguments[1].replace("local://simulator/local://", "http://");
            }

            openOriginal.apply(this, arguments);
        };

        var getProperUrl = function (urlProperty) {
            if (urlProperty && urlProperty.indexOf("local://") !== -1 && urlProperty.indexOf("local://simulator/") === -1) {
                urlProperty = urlProperty.replace("local://", "http://");
            }
            return urlProperty;
        };

        ["appendChild", "insertBefore"].forEach(function (methodName) {
            var originalMethod = Node.prototype[methodName];
            Node.prototype[methodName] = function () {
                Array.prototype.forEach.call(arguments, function (arg) {
                    arg.src = getProperUrl(arg.src);
                });

                return originalMethod.apply(this, arguments);
            };
        });

        setInterval(function () {
            var elements = document.getElementsByClassName("basemapBG");
            for (var i = 0; i < elements.length; i++) {
                var el = elements[i];
                if (el.style && el.style.backgroundImage) {
                    el.style.backgroundImage = getProperUrl(el.style.backgroundImage);
                }
            }
        }, 2000);

        function getAllElementsWithImageBackground() {
            var matchingElements = [];
            var allElements = document.getElementsByTagName('*');
            for (var i = 0, n = allElements.length; i < n; i++) {
                if (allElements[i].style && allElements[i].style.backgroundImage) {
                    matchingElements.push(allElements[i]);
                }
            }
            return matchingElements;
        }
    }
})();
