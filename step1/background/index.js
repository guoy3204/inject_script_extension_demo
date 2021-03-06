//"permissions": ["declarativeContent"]
chrome.runtime.onInstalled.addListener(function () {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [
                // 只有打开百度才显示pageAction
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: {
                        urlContains: 'kukuw.com'
                    }
                })
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});

// {"permissions": ["contextMenus"]}
chrome.contextMenus.create({
    title: "测试右键菜单",
    onclick: function () {
        alert('您点击了右键菜单！');
    }
});

//{"permissions": ["contextMenus"， "tabs"]}
chrome.contextMenus.create({
    title: 'Use Baidu Search: %s', // %s表示选中的文字
    contexts: ['selection'], // 只有当选中文字时才会出现此右键菜单
    onclick: function (params) {
        // 注意不能使用location.href，因为location是属于background的window对象
        chrome.tabs.create({
            url: 'https://www.baidu.com/s?ie=utf-8&wd=' + encodeURI(params.selectionText)
        });
    }
});