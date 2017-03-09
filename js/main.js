window.onload = function() {
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext('2d');
	var canW = canvas.width;
	var canH = canvas.height;
	
	//设置画布大小
//	resize();
//	window.onresize = resize;
//	
//	function resize() {
//		canvas.width = document.documentElement.clientWidth;
//		canvas.height = document.documentElement.clientHeight;
//	}
	
	//获取鼠标位置
	//初始化
	var mouse = {
		x: null,
		y: null,
		max: 20000
	}
	
	window.onmousemove = function(e) {
		e = e || window.event;
		mouse.x = e.clientX;
		mouse.y = e.clientY;
	}
	window.onmouseout = function() {
		mouse.x = null;
		mouse.y = null;
	}
	
	//点
	// x,y 为坐标
	// xa,ya 为加速度
	// max 为最大连线距离
	var dots = [];
	for (var i=0; i<300; i++) {
		var x = Math.random() * canW;
		var y = Math.random() * canH;
		var xa = Math.random() * 2 - 1;
		var ya = Math.random() * 2 - 1; //[-1,1)
		
		dots.push({
			x: x,
			y: y,
			xa: xa,
			ya: ya,
			max: 6000
		});
	}
	
	
	
	//延迟100毫秒开始执行
	setTimeout(animate(), 100);
	
	// 每一帧循环
	function animate() {
		ctx.clearRect(0, 0, canW, canH);
		
		//加入鼠标监听，产生一个用于比对距离的点数组
		var ndots = [mouse].concat(dots);
		
		dots.forEach(function(dot) {
			//点位移
			dot.x += dot.xa;
			dot.y += dot.ya;
			
			//遇到边界加速度反向
			dot.xa *= (dot.x > canW || dot.x < 0) ? -1 : 1;
			dot.ya *= (dot.y > canH || dot.y < 0) ? -1 : 1;
			
			//绘制点
			ctx.fillRect(dot.x - 0.5, dot.y - 0.5, 1, 1);
			
			//对比点之间距离，小于一定距离则连线
			for (var i=0; i<ndots.length; i++) {
				var d2 = ndots[i];
				
				if (dot === d2 || d2.x === null || d2.y === null) {
					continue;
				}
				
				var xc = dot.x - d2.x;
				var yc = dot.y - d2.y;
				//对比距离
				var dis = xc * xc + yc * yc;
				//距离比
				var ratio;
				
				//如果两个点之间的距离小于max，则连线
				if (dis < d2.max) {
					//如果是鼠标，则让点向鼠标位置移动
					if (d2 === mouse && dis > (d2.max / 2)) {
						dot.x -= xc * 0.03;
						dot.y -= yc * 0.03;
					}
					//计算距离比
					ratio = (d2.max - dis) / d2.max;
					
					//画线
					ctx.beginPath();
					ctx.lineWidth = ratio / 2;
					ctx.strokeStyle = 'rhba(0, 0, 0' + (ratio + 0.2) + ')';
					ctx.moveTo(dot.x, dot.y);
					ctx.lineTo(d2.x, d2.y);
					ctx.stroke();
					ctx.closePath();
				}
			}
			
			//将已经计算过的点从数组中删除
			ndots.splice(ndots.indexOf(dot), 1);
		});
		
		var RAF = (function() {
			return window.requestAnimationFrame || 
					window.webkitRequestAnimationFrame || 
					window.mozRequestAnimationFrame || 
					window.oRequestAnimationFrame || 
					window.msRequestAnimationFrame || 
					function(callback) {
						window.setTimeout(callback, 1000 / 60)
					}
		})();
		
		RAF(animate);
	}
}

