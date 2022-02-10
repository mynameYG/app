// 播放音乐
function startPlay(src, loop, func){
	var player = plus.audio.createPlayer({
		loop: loop ? true : false,
		src: src
	});
	player.play(function() { // 播放完成
		if(func) {
			func();
		}
	});
	return player;
}

function playWithBg(src) {
	if(bgPlayer) {
		startPlay(src, null, function() {
			bgPlayer.resume();
		});
	} else {
		startPlay(src);
	}
}

function playAction() {
	playWithBg("img/audio/action.mp3");
}

function playRight() {
	playWithBg("img/audio/right.mp3");
}

function playWrong() {
	playWithBg("img/audio/wrong.mp3");
}

function playRemind() {
	playWithBg("img/audio/remind.mp3");
}

var bgPlayer = null;
function playBg1(seek) {
	bgPlayer = startPlay("img/audio/bg1.mp3", true);
}

function playBg2(seek) {
	bgPlayer = startPlay("img/audio/bg2.mp3", true);
}

var tipAdded = false; // 是否已经添加过提示的样式
var quitApp = null; // 上一次点击返回按钮的时间
var canNavigateBack = false; // 当前页面点击回退按钮时是否返回上一页
document.addEventListener('plusready', function(){
	plus.screen.lockOrientation("landscape-primary");
	plus.key.addEventListener("backbutton", function() {
		if(!canNavigateBack) {
			if(!quitApp) {
				quitApp = new Date().getTime();
				showQuitTip(true);
				setTimeout(function() {
					showQuitTip(false);
					quitApp = null;
				}, 1000);
				return false;
			} else {
				plus.runtime.quit();
			}
		} else {
			quitApp = null;
			playAction();
			plus.webview.currentWebview().close("pop-out", 600);
		}
	});
});

// 显示提示
function showTip(flag, text, autohide) {
	var body = $("body");
	if(flag) {
		if(!tipAdded) {
			body.append(
				'<style>' + 
					'.bodytip { font-size: 1.5em; }' + 
					'.bodytip .tooltip-inner { background-color: rgba(0, 0, 0, 0.7); }' + 
				'</style>'
			).tooltip({
				placement: "bottom",
				template: '<div class="tooltip bodytip" role="tooltip"><div class="tooltip-inner"></div></div>',
				trigger: "manual",
				title: "content"
			}).on('shown.bs.tooltip', function () {
				var bodytip = $(".bodytip");
				bodytip.animate({"top": (bodytip.position().top - 80) + "px"}, 100, "swing");
			});
			tipAdded = true;
		}
		body.attr("title", text).tooltip("fixTitle").tooltip("show"); // fixTitle是用来动态改变内容的
		if(autohide) {
			setTimeout(function() {
				body.tooltip("hide");
			}, autohide);
		}
	} else {
		body.tooltip("hide");
	}
}

// 显示退出提示
function showQuitTip(flag) {
	showTip(flag, "再次点击返回按钮退出程序");
}

/**
 * 导航到页面
 * @param {String} url		页面地址，也用作窗口标识
 * @param {String} hasTitle	是否需要标题栏
 * @param {String} title	页面的标题
 * @param {String} datas	额外的数据，JSON格式
 */
function navigateTo(url, hasTitle, title, datas) {
	if(navigateTo.newWindow) { // 防止快速点击导致的重复加载
		return;
	}
	
	playAction();

	if(!navigateTo.mask) {
		navigateTo.mask = _makeMask();
	}
	$("body").append(navigateTo.mask);
	newWindow = plus.webview.create(url, url, {
		titleNView: hasTitle ? {
			autoBackButton: true,
			backgroundColor: "#00796A",
			padding: "10px",
			titleColor: "#FFFFFF",
			titleText: title,
			titleSize: "24px"
		} : null
	}, datas);
	navigateTo.newWindow = newWindow;
	
	newWindow.addEventListener("loaded", function(){
		// 页面加载完成时可能该页面已经被关闭，所以需要先检测当前缓存的页面是否是该页面
		if(navigateTo.newWindow === newWindow) {
			if(hasTitle) {
				newWindow.evalJS("canNavigateBack = true;"); // 使退回键起效
			}
			newWindow.show("pop-in", 600, function() {
				navigateTo.mask.remove();
			});
		}
	}, false);
	newWindow.addEventListener("show", function(){
		// 页面的show、hide虽然有动画，但相对loaded而言可以当做同步，
		// 因此多页面同时执行事件处理的可能性极小，不需要像loaded那样做检测
		navigateTo.newWindow = null;
	}, false);
	newWindow.addEventListener("hide", function(){
		navigateTo.newWindow = null;
	}, false);
	newWindow.addEventListener("close", function(){
		navigateTo.newWindow = null;
	}, false);
}

function navigateBack() {
	playAction();
	plus.webview.currentWebview().close("pop-out", 600);
}

function navigateBackMulti(count) {
	var all = plus.webview.all();
	var first = all.length - count;
	var tmp = [];
	playAction();
	for (var i = first; i < all.length; i++) {
		tmp.push(all[i]);
	}
	for (var i = 0; i < tmp.length; i++) {
		tmp[i].close("none");
	}
}

/**
 * 内部方法勿调用（创建遮罩）
 */
function _makeMask(alpha) {
	return $(
		'<div style="position:absolute;width:100%;height:100%;overflow:hidden;background:rgb(0,0,0,' + (alpha ? alpha : '0.6') + ');z-index:999;left:0px;top:0px;">' + 
			'<div style="width:100%;height:100%;overflow:hidden;background:center center no-repeat url(img/loadingx.gif);background-size:128px;">' + 
			'</div>' +
		'</div>'
	);
}

function createMask(flag, alpha) {
	if(flag) {
		if(!createMask.mask) {
			createMask.mask = _makeMask(alpha);
		}
		$("body").append(createMask.mask);
	} else {
		if(createMask.mask) {
			createMask.mask.remove();
		}
	}
}

var UrlHelper = {
	baseUrl: "http://app.sxsbed.cn",
	makeUrl: function(url) {
		if (!url || url.indexOf(":") >= 0 || url.substring(0, 2) === "//") {
			return url;
		}
		if (url.substring(0, 1) !== "/") {
			url = "/" + url;
		}
		return this.baseUrl + url;
	}
}; 