(function () {
    if (window.location.host !== "dazi.kukuw.com") {
        return
    }
    console.log("content-script.js loaded", window.location.href);

    // 向页面注入JS 

    function injectChromeJs(jsPath) {
        if (!jsPath) {
            return false;
        }
        var node = document.createElement('script');
        node.setAttribute('type', 'text/javascript');
        // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
        node.src = chrome.extension.getURL(jsPath);
        node.onload = function () {
            // 放在页面不好看，执行完后移除掉
            this.parentNode.removeChild(this);
        };
        document.head.appendChild(node);
        return true
    }
    injectChromeJs('js/inject-script.js');

})()