// document.addEventListener('plusready', function() {
// 			var width = window.innerWidth;
// 			var height = window.innerHeight;
// 			var content = $("#content");
// 			var page_bottom = $("#page_bottom");
// 			var page_top = $("#page_top");
// 			var rubric_1 = $("#rubric_1");
// 			var indexes = $("#indexes");
// 			var a = $("#a1");
// 			var b = $("#b1");
// 			var c = $("#c1");
// 			var d = $("#d1");
// 			var abcd = $("#a,#b,#c,#d");
// 			var result_2 = $("#result_2");
// 			var myradio = $('input:radio[type="radio"]');
// 			var score_1 = $("#score_1");
// 			var score_2 = $("#score_2");
// 			var score_3 = $("#score_3");
// 			var option_success = $("#option_success");
// 			var option_error = $("#option_error");
// 			var tip_number = $("#tip_number");
// 			var pentagon = $("#pentagon");
// 			var nextpage = $("#nextpage");
// 			var backtrack = $("#backtrack");
// 			var preIndex = [];
// 			var checked = [];
// 			var sum = $("#sum");
// 			var page = $("#page");
// 			var mold = $("#mold");
// 			content.css({
// 				"width": width,
// 				"height": height
// 			});
// 			var number = myQuestions.length;
// 			sum.html("/" + number);
// 			var err = 0;
// 			var ok = 0;
// 			var hint = 3;
// 			//加载题目
// 			var sn = 1;
// 			var onoff = true;
// 			var exchange = true;
// 			function mytitle(url, index, aa, bb, cc, dd) {
// 				if (!(preIndex && sn && preIndex[sn])) {
// 					onoff = true;
// 				}
// 				rubric_1.html(url);
// 				indexes.html(index);
// 				a.html(aa);
// 				b.html(bb);
// 				c.html(cc);
// 				d.html(dd);
// 				checked = [];
// 				$('input').prop('checked', false);
// 				$('input').prop('disabled', false);
// 				if (myQuestions[sn - 1].type == "radio") {
// 					mold.html("单选题");
// 					for (var i = 0; i < $('input').length; i++) {
// 						$($('input')[i]).attr('type', 'radio');
// 					}
// 					$(".judeg").css("display", "block");
// 				} else if (myQuestions[sn - 1].type == "checkbox") {
// 					mold.html("多选题");
// 					if (!preIndex[sn]) {
// 						$('input').prop('disabled', false);
// 					}
// 					for (var i = 0; i < $('input').length; i++) {
// 						$($('input')[i]).attr('type', 'radio');
// 					}
// 					$(".judeg").css("display", "block");
// 				} else if (myQuestions[sn - 1].type == "judeg") {
// 					mold.html("判断题");
// 					for (var i = 0; i < $('input').length; i++) {
// 						$($('input')[i]).attr('type', 'radio');
// 					}
// 					$(".judeg").css("display", "none");
// 				}
// 			};
// 			//序号
// 			var info = null;
// 			function choice(sn) {
// 				if (sn < 1 || sn > myQuestions.length) {
// 					return;
// 				};
// 				for (var i = 0; i < myQuestions.length; i++) {
// 					if (myQuestions[i].id === sn) {
// 						info = myQuestions[i];
// 					}
// 				}
// 				mytitle(info.question, info.id, info.answers.A, info.answers.B, info.answers.C, info.answers.D);
// 			};
// 			choice(sn);
// 			var list = $('input:radio[type="radio"]:checked').val();
// 			myradio.on('change', function() {
// 				if (myQuestions[sn - 1].type == "checkbox") {
// 					if (!preIndex[sn]) {
// 						preIndex[sn] = [];
// 					}
// 					preIndex[sn].push($(this).attr("indexNum"));
// 				} else {
// 					preIndex[sn] = $(this).attr("indexNum");
// 				}
// 				if (myQuestions[sn - 1].type != "checkbox") {
// 					myradio.attr("disabled", true);
// 				}
// 				if (myQuestions[sn - 1].type != 'checkbox') { //单选或者判断题
// 					if ($('input:radio[type="radio"]:checked').val() == myQuestions[sn - 1].correctAnswer) {
// 						setTimeout(function() {
// 							page_bottom.trigger('click');
// 						}, 500);
// 						ok++;
// 						score_1.html(ok);
// 						option_success.html(ok);
// 					} else {
// 						err++;
// 						score_2.html(err);
// 						option_error.html(err);
// 						result_2.css({
// 							"display": "block",
// 							"color": "red"
// 						});
// 						result_2.html(myQuestions[sn - 1].correctAnswer);
// 						$("#pentagon").css("width", (number - err) / number * 100 + "%");
// 					}
// 				} else { //多选
// 					var answer = myQuestions[sn - 1].correctAnswer;
// 					if (answer.length > 1) {
// 						answer = answer.split(',');
// 					}
// 					var length = answer.length //正确答案的个数
// 					var checkAnswer = $(this).val();
// 					checked.push($(this).val());
// 					var flag = false
// 					for (var j = 0; j < length; j++) { //遍历正确答案数组    
// 						if (checkAnswer == answer[j]) { //当前选择为正确答案
// 							flag = true;
// 						}
// 					}
// 					if (!flag) { //如果标志位为false 则表示当前用户选择的答案无法和正确的答案集匹配,停止答题
// 						$('input').attr('disabled', true);
// 						err++;
// 						score_2.html(err);
// 						option_error.html(err);
// 						result_2.css({
// 							"display": "block",
// 							"color": "red"
// 						});
// 						result_2.html(myQuestions[sn - 1].correctAnswer);
// 						$("#pentagon").css("width", (number - err) / number * 100 + "%")
// 						return;
// 					}
// 					if (checked.length == length) { //用户全部命中答案
// 						$('input').attr('disabled', true); //禁止操作
// 						setTimeout(function() {
// 							page_bottom.trigger('click');
// 						}, 500);
// 						ok++;
// 						score_1.html(ok);
// 						option_success.html(ok);
// 					}
// 				}
// 			});
// 			//上一页
// 			page_top.click(function() {
// 				if (sn > 1) {
// 					sn--;
// 				}
// 				// page.html('<span class="page_bottom" onclick="HtmlLoad()">下一页</span>');
// 				choice(sn);
// 				if (myQuestions[sn - 1].type != 'checkbox') {
// 					if (preIndex && sn) { //还原
// 						var checkedAnswer = preIndex[sn]; //获取preIndex对应题下的下标
// 						$(myradio[checkedAnswer]).prop('checked', true);
// 						myradio.attr("disabled", true);
// 						result_2.css('display', 'block');
// 						result_2.html(myQuestions[sn - 1].correctAnswer);
// 					}
// 				} else {
// 					if (preIndex && sn && preIndex[sn]) {
// 						var answer = preIndex[sn];
// 						if (answer.length) {
// 							for (var i = 0; i < answer.length; i++) {
// 								$(myradio[answer[i]]).prop('checked', true);
// 								myradio.attr('disabled', true);
// 							}
// 						}
// 						result_2.css({
// 							'display': 'block',
// 							'color': 'red'
// 						});
// 						result_2.html(myQuestions[sn - 1].correctAnswer);
// 					}
// 				}
// 			});
// 			//下一页
// 			page_bottom.on('click', function() {
// 				if (sn == number) {
// 					page.html('<span class="page_bottom" onclick="HtmlLoad()">完成</span>');
// 				}
// 				result_2.css('display', 'none');
// 				if (myQuestions[sn - 1].type != 'checkbox') {
// 					var list = $('input:radio[type="radio"]:checked').val();
// 					if (list) {
// 						if (sn < myQuestions.length) {
// 							sn++;
// 							choice(sn);
// 						}
// 					}
// 					if (myQuestions[sn - 1].type != 'checkbox') {
// 						if (preIndex && sn && preIndex[sn]) {
// 							var checkedAnswer = preIndex[sn];
// 							$(myradio[checkedAnswer]).prop('checked', true);
// 							myradio.attr('disabled', true);
// 							result_2.css('display', 'block');
// 							result_2.html(myQuestions[sn - 1].correctAnswer);
// 						} else {
// 							// var list = $('input:radio[type="radio"]:checked').val(); 
// 							// $('input:radio[value = '+list+']').prop('checked',false);
// 							myradio.attr('disabled', false);
// 							myradio.prop('checked', false);
// 						}
// 					} else {
// 						if (preIndex && sn && preIndex[sn]) {
// 							var answer = preIndex[sn];
// 							if (answer.length) {
// 								for (var i = 0; i < answer.length; i++) {
// 									$(myradio[answer[i]]).prop('checked', true);
// 									checked.push(answer[i]);
// 									myradio.attr('disabled', true);
// 								}
// 								result_2.css({
// 									'display': 'block',
// 									'color': 'red'
// 								});
// 								result_2.html(myQuestions[sn - 1].correctAnswer);
// 							}
// 						}
// 					}
// 				} else { //多选
// 					var list = $('input:radio[type="radio"]:checked').val();
// 					if (list) {
// 						if (checked) {
// 							if (sn < myQuestions.length) {
// 								sn++;
// 								choice(sn);
// 							}
// 						}
// 					}
					
// 					if (myQuestions[sn - 1].type != 'checkbox') {
// 						if (preIndex && sn && preIndex[sn]) {
// 							var checkedAnswer = preIndex[sn];
// 							$(myradio[checkedAnswer]).prop('checked', true);
// 							myradio.attr('disabled', true);
// 							result_2.css('display', 'block');
// 							result_2.html(myQuestions[sn - 1].correctAnswer);
// 						} else {
// 							myradio.attr('disabled', false);
// 							myradio.prop('checked', false);
// 						}
// 					} else {
// 						if (preIndex && sn && preIndex[sn]) {
// 							var answer = preIndex[sn];
// 							if (answer.length) {
// 								for (var i = 0; i < answer.length; i++) {
// 									$(myradio[answer[i]]).prop('checked', true);
// 									checked.push(answer[i]);
// 									myradio.attr('disabled', true);
// 								}
// 								result_2.css({
// 									"display": "block",
// 									"color": "red"
// 								});
// 								result_2.html(myQuestions[sn - 1].correctAnswer);
// 							}
// 						}
// 					}
// 				}
// 			});
// 			// 点击答案提示正确答案
// 			$("#result_1").click(function() {
// 				if (onoff) {
// 					if (hint > 0) {
// 						result_2.css({
// 							'display': 'block',
// 							'color': 'red'
// 						});
// 						result_2.html(myQuestions[sn - 1].correctAnswer);
// 						hint--;
// 						score_3.html(hint);
// 						tip_number.html(3 - hint);
// 					}
// 				}
// 				onoff = false;
// 			});
			
//             backtrack.click(function(){
// 				navigateBack();
// 			});
			
// 			function HtmlLoad() {
// 				$('#myModal').modal('show');
// 			};
			
// 		})

				document.addEventListener('plusready', function() {
							var width = window.innerWidth;
							var height = window.innerHeight;
							var content = $("#content");
							var page_bottom = $("#page_bottom");
							var page_top = $("#page_top");
							var rubric_1 = $("#rubric_1");
							var indexes = $("#indexes");
							var a = $("#a1");
							var b = $("#b1");
							var c = $("#c1");
							var d = $("#d1");
							var abcd = $("#a,#b,#c,#d");
							var result_2 = $("#result_2");
							var myradio = $('input:radio[type="radio"]');
							var score_1 = $("#score_1");
							var score_2 = $("#score_2");
							var score_3 = $("#score_3");
							var option_success = $("#option_success");
							var option_error = $("#option_error");
							var tip_number = $("#tip_number");
							var pentagon = $("#pentagon");
							var nextpage = $("#nextpage");
							var backtrack = $("#backtrack");
							var preIndex = [];
							var checked = [];
							var sum = $("#sum");
							var page = $("#page");
							var mold = $("#mold");
							content.css({
								"width": width,
								"height": height
							});
							var number = myQuestions.length;
							sum.html("/" + number);
							var err = 0;
							var ok = 0;
							var hint = 3;
							//加载题目
							var sn = 1;
							var onoff = true;
							var exchange = true;
							function mytitle(url, index, aa, bb, cc, dd) {
								if (!(preIndex && sn && preIndex[sn])) {
									onoff = true;
								}
								rubric_1.html(url);
								indexes.html(index);
								a.html(aa);
								b.html(bb);
								c.html(cc);
								d.html(dd);
								checked = [];
								$('input').prop('checked', false);
								$('input').prop('disabled', false);
								if (myQuestions[sn - 1].type == "radio") {
									mold.html("单选题");
									for (var i = 0; i < $('input').length; i++) {
										$($('input')[i]).attr('type', 'radio');
									}
									$(".judeg").css("display", "block");
								} else if (myQuestions[sn - 1].type == "checkbox") {
									mold.html("多选题");
									if (!preIndex[sn]) {
										$('input').prop('disabled', false);
									}
									for (var i = 0; i < $('input').length; i++) {
										$($('input')[i]).attr('type', 'radio');
									}
									$(".judeg").css("display", "block");
								} else if (myQuestions[sn - 1].type == "judeg") {
									mold.html("判断题");
									for (var i = 0; i < $('input').length; i++) {
										$($('input')[i]).attr('type', 'radio');
									}
									$(".judeg").css("display", "none");
								}
							};
							//序号
							var info = null;
							function choice(sn) {
								if (sn < 1 || sn > myQuestions.length) {
									return;
								};
								for (var i = 0; i < myQuestions.length; i++) {
									if (myQuestions[i].id === sn) {
										info = myQuestions[i];
									}
								}
								mytitle(info.question, info.id, info.answers.A, info.answers.B, info.answers.C, info.answers.D);
							};
							choice(sn);
							var list = $('input:radio[type="radio"]:checked').val();
							myradio.on('change', function() {
								if (myQuestions[sn - 1].type == "checkbox") {
									if (!preIndex[sn]) {
										preIndex[sn] = [];
									}
									preIndex[sn].push($(this).attr("indexNum"));
								} else {
									preIndex[sn] = $(this).attr("indexNum");
								}
								if (myQuestions[sn - 1].type != "checkbox") {
									myradio.attr("disabled", true);
								}
								if (myQuestions[sn - 1].type != 'checkbox') { //单选或者判断题
									if ($('input:radio[type="radio"]:checked').val() == myQuestions[sn - 1].correctAnswer) {
										setTimeout(function() {
											page_bottom.trigger('click');
										}, 1000);
										ok++;
										score_1.html(ok);
										option_success.html(ok);
									} else {
										err++;
										score_2.html(err);
										option_error.html(err);
										result_2.css({
											"display": "block",
											"color": "red"
										});
										result_2.html(myQuestions[sn - 1].correctAnswer);
										$("#pentagon").css("width", (number - err) / number * 100 + "%");
									}
								} else { //多选
									var answer = myQuestions[sn - 1].correctAnswer;
									if (answer.length > 1) {
										answer = answer.split(',');
									}
									var length = answer.length //正确答案的个数
									var checkAnswer = $(this).val();
									checked.push($(this).val());
									var flag = false
									for (var j = 0; j < length; j++) { //遍历正确答案数组    
										if (checkAnswer == answer[j]) { //当前选择为正确答案
											flag = true;
										}
									}
									if (!flag) { //如果标志位为false 则表示当前用户选择的答案无法和正确的答案集匹配,停止答题
										$('input').attr('disabled', true);
										err++;
										score_2.html(err);
										option_error.html(err);
										result_2.css({
											"display": "block",
											"color": "red"
										});
										result_2.html(myQuestions[sn - 1].correctAnswer);
										$("#pentagon").css("width", (number - err) / number * 100 + "%")
										return;
									}
									if (checked.length == length) { //用户全部命中答案
										$('input').attr('disabled', true); //禁止操作
										setTimeout(function() {
											page_bottom.trigger('click');
										}, 1000);
										ok++;
										score_1.html(ok);
										option_success.html(ok);
									}
								}
							});
							//上一页
							page_top.click(function() {
								if (sn > 1) {
									sn--;
								}
								nextpage.html('<span class="page_bottom" id="page_bottom">下一页</span>');
								choice(sn);
								if (myQuestions[sn - 1].type != 'checkbox') {
									if (preIndex && sn) { //还原
										var checkedAnswer = preIndex[sn]; //获取preIndex对应题下的下标
										$(myradio[checkedAnswer]).prop('checked', true);
										myradio.attr("disabled", true);
										result_2.css('display', 'block');
										result_2.html(myQuestions[sn - 1].correctAnswer);
									}
								} else {
									if (preIndex && sn && preIndex[sn]) {
										var answer = preIndex[sn];
										if (answer.length) {
											for (var i = 0; i < answer.length; i++) {
												$(myradio[answer[i]]).prop('checked', true);
												myradio.attr('disabled', true);
											}
										}
										result_2.css({
											'display': 'block',
											'color': 'red'
										});
										result_2.html(myQuestions[sn - 1].correctAnswer);
									}
								}
							});
							//下一页
							page.on('click','#page_bottom', function() {
								if (sn == number) {
									nextpage.html('<span class="page_bottom" onclick="HtmlLoad()">完成</span>');
								}
								result_2.css('display', 'none');
								if (myQuestions[sn - 1].type != 'checkbox') {
									var list = $('input:radio[type="radio"]:checked').val();
									if (list) {
										if (sn < myQuestions.length) {
											sn++;
											choice(sn);
										}
									}
									if (myQuestions[sn - 1].type != 'checkbox') {
										if (preIndex && sn && preIndex[sn]) {
											var checkedAnswer = preIndex[sn];
											$(myradio[checkedAnswer]).prop('checked', true);
											myradio.attr('disabled', true);
											result_2.css('display', 'block');
											result_2.html(myQuestions[sn - 1].correctAnswer);
										} else {
											// var list = $('input:radio[type="radio"]:checked').val(); 
											// $('input:radio[value = '+list+']').prop('checked',false);
											myradio.attr('disabled', false);
											myradio.prop('checked', false);
										}
									} else {
										if (preIndex && sn && preIndex[sn]) {
											var answer = preIndex[sn];
											if (answer.length) {
												for (var i = 0; i < answer.length; i++) {
													$(myradio[answer[i]]).prop('checked', true);
													checked.push(answer[i]);
													myradio.attr('disabled', true);
												}
												result_2.css({
													'display': 'block',
													'color': 'red'
												});
												result_2.html(myQuestions[sn - 1].correctAnswer);
											}
										}
									}
								} else { //多选
									var list = $('input:radio[type="radio"]:checked').val();
									if (list) {
										if (checked) {
											if (sn < myQuestions.length) {
												sn++;
												choice(sn);
											}
										}
									}
									
									if (myQuestions[sn - 1].type != 'checkbox') {
										if (preIndex && sn && preIndex[sn]) {
											var checkedAnswer = preIndex[sn];
											$(myradio[checkedAnswer]).prop('checked', true);
											myradio.attr('disabled', true);
											result_2.css('display', 'block');
											result_2.html(myQuestions[sn - 1].correctAnswer);
										} else {
											myradio.attr('disabled', false);
											myradio.prop('checked', false);
										}
									} else {
										if (preIndex && sn && preIndex[sn]) {
											var answer = preIndex[sn];
											if (answer.length) {
												for (var i = 0; i < answer.length; i++) {
													$(myradio[answer[i]]).prop('checked', true);
													checked.push(answer[i]);
													myradio.attr('disabled', true);
												}
												result_2.css({
													"display": "block",
													"color": "red"
												});
												result_2.html(myQuestions[sn - 1].correctAnswer);
											}
										}
									}
								}
							});
							
							// 点击答案提示正确答案
							$("#result_1").click(function() {
								if (onoff) {
									if (hint > 0) {
										result_2.css({
											'display': 'block',
											'color': 'red'
										});
										result_2.html(myQuestions[sn - 1].correctAnswer);
										hint--;
										score_3.html(hint);
										tip_number.html(3 - hint);
									}
								}
								onoff = false;
							});
							
				            backtrack.click(function(){
								navigateBack();
							});
							
							function HtmlLoad() {
								$('#myModal').modal('show');
							};
							
			});