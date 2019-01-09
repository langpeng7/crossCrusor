$(function(){
var avg = [680, 680, 660, 670, 670];
var xser = ["2018/10/17", "2018/10/24", "2018/10/30", "2018/11/06", "2018/11/13"];
var avgNames = "全国物流数据";
var xseries = ["2018/10/17", "2018/10/24", "2018/10/30", "2018/11/06", "2018/11/13"];
var lastYearPeriods = [-2.86, -2.86, -4.35, -1.47, -1.47];
var lastTimePeriods = [1.49, 0, -2.94, 1.52, 0]
var myChart = echarts.init(document.getElementById('maini'));

charts(avg, xser, avgNames, xseries ,lastYearPeriods, lastTimePeriods)

function charts(avg, xser, avgNames, xseries ,lastYearPeriods, lastTimePeriods) {
	var seriesData = [
		{
			name : avgNames+'(左轴)',
			data : avg,
			type : 'line',
			symbolSize : 0,
			itemStyle: {normal: {color:'#0074C1'}}
		},
		{
			name : '环比(右轴)',
			type : 'bar',
			yAxisIndex : 1,
			stack : '环比',
			barMinWidth:1,
			barMaxWidth:20,//最大宽度
			data : lastTimePeriods,
			itemStyle : {
				normal : {
					color : '#F8CF1C '
				}
			},
		},
		{
			name : '同比(右轴)',
			type : 'bar',
			stack : '同比',
			yAxisIndex : 1,
			barMinWidth:1,
			barMaxWidth:20,//最大宽度
			data : lastYearPeriods,
			itemStyle : {
				normal : {
					color : '#76C1F2'
				}
			},
		}
	]
	var option = {
		color : [ '#0074C1' ],
		legend : {
			data : avgNames,
			x : 'center', // 'center' | 'left' | {number},
			y : '390',
		},
		grid : {
			top : 40, // 距离容器上边界40像素
			bottom:100
		},
		tooltip : {
			enterable : true,
			trigger : 'axis',
			formatter:function(data){
		        var result=data[0].axisValue+'<br>';
		            for(var i=0;i<data.length;i++){
						var  name = data[i].seriesName
                        if(data[i].seriesType=="bar"){
							if(data[i].value){
                           		result+=data[i].marker + name.substr(0,name.length-4)+":"+data[i].value+"%"+'<br>';
							}
                        }else{
							if(data[i].value){
								 result+=data[i].marker + name.substr(0,name.length-4)+":"+data[i].value+'<br>';
							}
	                    }
		             } 
				     return result;
				}
		},
		xAxis : {
			type : 'category',
			data : xseries,
			axisLine : {
				lineStyle : {
					color : '#eee',
					width : 1
				// 粗细
				}
			},
			axisLabel : {
				textStyle : {
					color : '#333',// 坐标值得具体的颜色
					fontSize : 14
				},
				interval : function(i, e) {
					if (xser.length <= 8) {
						return true
					} else {
						if (xser.length % 2 == 0) {
							if (i == 0 || i == xser.length - 1
									|| i == xser.length / 2) {
								return true

							} else {
								return false
							}
						} else {
							if (i == 0 || i == xser.length - 1
									|| i == (xser.length - 1) / 2) {
								return true
							} else {
								return false
							}
						}
					}
				}
			},
			offset : 20
		},
		yAxis : [ {
			type : 'value',
			axisLabel : {
				textStyle : {
					color : '#333',
					fontSize : 14
				}
			},
			axisLine : {
				lineStyle : {
					color : '#fff',
					width : 1
				// 粗细
				}
			},
			splitLine :'none',
			splitNumber : 5,
			scale : true
		}, 
		{
			type : 'value',
			axisLabel : {
				textStyle : {
					color : '#333',
					fontSize : 14
				},
				formatter : '{value} %'
			},
			axisLine : {
				lineStyle : {
					color : '#fff',
					width : 1
				// 粗细
				}
			},
	        splitNumber : 5,
			splitLine : {
				lineStyle : {
					color : [ '#E3E3E3' ]
				}
			},
		} 
		],
		series : seriesData
	};
	
	myChart.setOption(option);
	// //图表后的canvas
	var canvasWidth = 884;
	var canvasHeight = 348;
	var chartsTop = 20;
	// 获取画布 初始化
	var pic = document.getElementById("myCanvas");
	pic.width = canvasWidth;
	pic.height = canvasHeight;
	var ctx = pic.getContext("2d");

	// 配置canvas 线段 宽度 和颜色
	ctx.lineWidth = 1;
	ctx.strokeStyle = "#FF9500";
	// 这里是c点击 屏幕任何点的事件
	myChart.getZr().on('mousemove', function(e) {
		var pointInPixel = [ e.offsetX, e.offsetY ];
		$('#myCanvas').attr('width', canvasWidth);
		$('#myCanvas').attr('height', canvasHeight);
		if (myChart.containPixel('grid', pointInPixel)) {
			// 获取折线上最近一个端点的x轴索引
			var xIndex = myChart.convertFromPixel({
				seriesIndex : 0
			}, [ e.offsetX, e.offsetY ]);
			// 通过索引 获取val中此端点对应的y轴逻辑坐标值 同时转换为 像素坐标值
			var yCo = myChart.convertToPixel({
				seriesIndex : 0
			}, [ xIndex[0], avg[xIndex[0]] ]);
			// 配置canvas 线段 宽度 和颜色
			ctx.fillStyle = '#0074C1'
			ctx.fill()
			ctx.globalAlpha = 0.15;
			// 十字坐标中心圆
			ctx.beginPath();
			// 像407这种值 是demo根据位置调整的参数 你需要根据自己的实际情况看 可能用不上
			// arc 中5个参数 分别为 圆心x轴坐标、圆心y轴坐标、圆心半径 、圆弧起始点、圆弧终止点
			ctx.arc(yCo[0] + 16, yCo[1], 7, 0 * Math.PI, 2 * Math.PI)
			ctx.closePath();
			ctx.stroke();
			// 配置canvas 线段 宽度 和颜色
			ctx.fillStyle = '#0074C1'
			ctx.fill()
			ctx.globalAlpha = 0.3;

			// 十字坐标中心圆
			ctx.beginPath();
			// 像407这种值 是demo根据位置调整的参数 你需要根据自己的实际情况看 可能用不上
			// arc 中5个参数 分别为 圆心x轴坐标、圆心y轴坐标、圆心半径 、圆弧起始点、圆弧终止点
			ctx.arc(yCo[0] + 16, yCo[1], 5, 0 * Math.PI, 2 * Math.PI)
			ctx.closePath();
			ctx.stroke();

			// 配置canvas 线段 宽度 和颜色
			ctx.fillStyle = '#E6F1F9'
			ctx.fill()
			ctx.globalAlpha = 1;

			// 十字坐标中心圆
			ctx.beginPath();
			// 像407这种值 是demo根据位置调整的参数 你需要根据自己的实际情况看 可能用不上
			// arc 中5个参数 分别为 圆心x轴坐标、圆心y轴坐标、圆心半径 、圆弧起始点、圆弧终止点
			ctx.arc(yCo[0] + 16, yCo[1], 3, 0 * Math.PI, 2 * Math.PI)
			ctx.closePath();
			ctx.stroke();

			ctx.lineWidth = 1;
			ctx.strokeStyle = "#FF9500";

			// 圆左边的横线
			ctx.beginPath();
			ctx.moveTo(105, yCo[1]);
			ctx.lineTo(yCo[0] + 10, yCo[1]);
			ctx.closePath();
			ctx.stroke();

			// 圆右边的横线
			ctx.beginPath();
			ctx.moveTo(yCo[0] + 24, yCo[1]);
			ctx.lineTo(810, yCo[1]);
			ctx.closePath();
			ctx.stroke();

			// 圆上边的纵线
			ctx.beginPath();
			ctx.moveTo(yCo[0] + 16, 0);
			ctx.lineTo(yCo[0] + 16, yCo[1] - 7);
			ctx.closePath();
			ctx.stroke();

			// 圆下边的纵线
			ctx.beginPath();
			ctx.moveTo(yCo[0] + 16, yCo[1] + 7);
			ctx.lineTo(yCo[0] + 16, 800);
			ctx.closePath();
			ctx.stroke();
/*
			// 画圆
			// 圆左边的横线
			ctx.beginPath();
			ctx.moveTo(0, yCo[1]);
			ctx.lineTo(yCo[0] - 5, yCo[1]);
			ctx.closePath();
			ctx.stroke();*/

		}
	})

	// 松手清除画布
	myChart.getZr().on('mouseup', function(e) {
		$('#myCanvas').attr('width', canvasWidth);
		$('#myCanvas').attr('height', canvasHeight);
	})
}
})
