(function () {
    if (window.location.host !== "dazi.kukuw.com") {
        return
    }
    console.log("inject-script.js loaded", window.location.href);

    document.addEventListener('DOMContentLoaded', function () {
        console.log('DOMContentLoaded 被执行了！');
    });

    function getRandom(start, end, fixed = 0) {
        let differ = end - start
        let random = Math.random()
        return Number((start + differ * random).toFixed(fixed))
    }

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    function initJQ() {
        const jqScript = document.createElement('script');
        jqScript.id = "jqNode"
        jqScript.src = "//code.jquery.com/jquery-3.4.1.min.js"
        document.head.appendChild(jqScript);
    }

    var defaultLongTypeTime = 5; // 默认当局时长度 分钟

    function genRandomResult(id, accuracy) {
        var randSpeed = 0;
        while ((randSpeed = getRandom(210, 254)) === 250);
        return {
            id: id,
            longTypeTime: defaultLongTypeTime, //时间长度
            speed: randSpeed, //速度
            accuracy: accuracy ? accuracy : getRandom(96, 99), //正确率
            backTimes: getRandom(70, 154), //退格数量
            fastSpeed: randSpeed + getRandom(10, 30),
            result: "优秀，成绩不错哟！" //结果
        };
    }
    (function () { //init
        initJQ();
        var kpsResultsKey = "___ds_storage__kpsResultsKey"
        var kpsResultsData = window.localStorage.getItem(kpsResultsKey);
        var kpsResults = {} // 从缓存中加载数据
        if (kpsResultsData) {
            try {
                kpsResults = JSON.parse(kpsResultsData)
            } catch {
                kpsResults = {};
            }
        }
        if (window.location.pathname.indexOf("typing") > 0) {
            console.log(window.location.pathname)
        } else if (window.location.pathname.indexOf("list_") > 0) {
            var trItems = document.querySelectorAll("#content table tbody tr:not(.title)");

            var typingTotalSpeed = 0;
            var typingTotalTimes = 0;
            var typingTotalTime = 0;

            trItems.forEach(function (el) {
                var tds = el.querySelectorAll("td");
                var dateTimeTd = tds[0]; //时间
                var longTypeTimeTd = tds[4]; //时间长度
                var speedTd = tds[5]; //速度
                var accuracyTd = tds[6]; // 正确率
                var backTimesTd = tds[7]; //退格数量
                var resultTd = tds[8]; //结果
                var viewTd = tds[10]; //结果
                let viewUrl = viewTd.querySelector("a").href;
                let id = getParameterByName("id", viewUrl);

                let kpsItem = kpsResults[id];
                if (!kpsItem) {
                    kpsItem = genRandomResult(id);
                    kpsResults[id] = kpsItem
                }
                typingTotalTimes++; //记录总次数
                typingTotalSpeed += Number(kpsItem.speed) //记录总速度和

                var timeLongTypeA = longTypeTimeTd.querySelector("a"); //获取A标签
                if (timeLongTypeA) {
                    timeLongTypeA.href = "https://dazi.kukuw.com/list___4_" + kpsItem.longTypeTime + "_.html"
                    timeLongTypeA.innerText = kpsItem.longTypeTime + " 分钟";
                    //累计总时间
                    typingTotalTime += Number(kpsItem.longTypeTime);
                }
                speedTd.innerHTML = kpsItem.speed + ' <span class="small">KPS</span>'
                accuracyTd.innerHTML = kpsItem.accuracy + ' <span class="small">%</span>'
                backTimesTd.innerHTML = kpsItem.backTimes

                resultTd.innerText = kpsItem.result
                resultTd.style.color = "red";

            });
            window.localStorage.setItem(kpsResultsKey, JSON.stringify(kpsResults));

            var typingTotalLables = document.querySelectorAll(".info_total .typing_total strong");
            var typingTotalTimeLable = typingTotalLables[1];
            if (typingTotalTimeLable) {
                typingTotalTimeLable.innerHTML = "<strong>" + typingTotalTime + " <span>分钟</span></strong>"
            }

            var typingTotalSpeedLable = typingTotalLables[3];
            if (typingTotalSpeedLable) {
                typingTotalSpeedLable.innerHTML = "<strong>" + Math.floor(typingTotalSpeed / typingTotalTimes) + " <span>字/分</span></strong>"
            }
        } else if (window.location.pathname.indexOf("info_") > 0) {
            let id = getParameterByName("id", window.location.href);
            let kpsItem = kpsResults[id];
            if (!kpsItem) {
                kpsItem = kpsItem = genRandomResult(id, 100);
                kpsResults[id] = kpsItem
            }
            window.localStorage.setItem(kpsResultsKey, JSON.stringify(kpsResults));

            var longTypeTime = kpsItem.longTypeTime; //时间长度
            var speed = Number(kpsItem.speed); //速度
            var accuracy = kpsItem.accuracy; //正确率
            var backTimes = kpsItem.backTimes; // 退格数量
            var result = kpsItem.result; //结果
            var fastSpeed = kpsItem.fastSpeed;

            //获取我的成绩容器
            var myContentElms = document.querySelectorAll(".info_total_my>.my_content");
            if (myContentElms.length > 0) {
                var cjDetileElm = myContentElms[0];
                var strongElms = cjDetileElm.querySelectorAll("strong");
                if (strongElms.length > 0) {
                    //更新本次成绩
                    var longTypeTimeElm = strongElms[1];
                    var speedElm = strongElms[2];
                    var accuracyElm = strongElms[3];
                    var backTimesElm = strongElms[4];
                    if (longTypeTimeElm) {
                        longTypeTimeElm.innerHTML = longTypeTime + '<span class="dw">分钟</span>'
                    }
                    if (speedElm) {
                        speedElm.innerHTML = speed + '<span class="dw">字/分</span>'
                    }
                    if (accuracyElm) {
                        accuracyElm.innerHTML = accuracy + '<span class="dw">%</span>'
                    }
                    if (backTimesElm) {
                        backTimesElm.innerHTML = backTimes + '<span class="dw">次</span>'
                    }
                }
            }

            //获取成绩统计容器
            var cjInfoTopTrElms = document.querySelectorAll(".info_dazi_top table tr");
            if (cjInfoTopTrElms.length > 0) {
                var curTimesTrElm = cjInfoTopTrElms[1];
                var tds = curTimesTrElm.querySelectorAll("td")
                if (tds.length > 0) {
                    var totalWordTd = tds[1]; //总字数
                    var averageSpeedTd = tds[2]; //本次平均速度
                    var fastSpeedTd = tds[3]; //本次平均速度
                    if (totalWordTd) {
                        let html = totalWordTd.innerHTML;
                        let val = Number(html.substr(0, html.indexOf(" ")));
                        if (val < speed) {
                            totalWordTd.innerHTML = speed + ' <span class="dw">字</span>'
                        }
                    }
                    if (averageSpeedTd) {
                        averageSpeedTd.innerHTML = speed + ' <span class="dw">字/分</span>';
                    }
                    if (fastSpeedTd) {
                        fastSpeedTd.innerHTML = fastSpeed + ' <span class="dw">字/分</span>';
                    }
                }
            }
            var cjResultElm = document.querySelector(".cj span");
            if (cjResultElm) {
                cjResultElm.innerText = result
            }
        }

        // const theScript = document.createElement('script');
        // theScript.innerHTML = `alert('hellow word !!');`;
        // document.body.appendChild(theScript);
        // $("#content table tbody tr:not(.title)") 
    })()
})()