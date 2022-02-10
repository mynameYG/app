var ErisApi = ErisApi || {
	baseUrl: "http://app.sxsbed.cn",
	Ajax: function(option) {
		var opt = {
			cache: false,
			dataType: option.dataType || "json",
			timeout: 60000,
			type: option.type || "GET"
		};
		if(option.complete) {
			opt.complete = option.complete;
		}
		if(option.data) {
			opt.data = option.data;
		}
		if(option.error) {
			opt.error = option.error;
		}
		opt.headers = {};
		if(option.headers) {
			opt.headers = option.headers;
		}
		var token = plus.storage.getItem("token");
		if(token) {
			opt.headers.token = token;
		}
		if(option.success) {
			opt.success = option.success;
		}
		if(option.username) {
			opt.username = option.username;
		}
		$.ajax(option.url, opt);
	},
	Default: function(url, data, success, error) {
		this.Ajax({
			url: this.baseUrl + url,
			data: data,
			success: function(data, textStatus, jqXHR) {
				if(data.code === 1) {
					if(success) {
						success({
							code: 1,
							msg: null,
							data: data.data
						});
					}
				} else {
					if(error) {
						error({
							code: 0,
							msg: data.msg,
							data: null
						});
					}
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				if(error) {
					error({
						code: 0,
						msg: textStatus,
						data: null
					});
				}
			}
		});
	},
	Login: function(success, error, username, password) {
		this.Default("/api/User/login", { 
			"account": username,
			"password": password
		}, success, error);
	},
	GetBaseTrain: function (success, error) {
		var that = this;
		that.Default("/api/Basetrain/getQuestion", null, function(r) {
			r.data = r.data.list;
			for(var i=0; i<r.data.length; i++) {
				var o = r.data[i];
				o.tx = o.x1 + ((o.x2 - o.x1) / 2);
				o.ty = o.y1 + ((o.y2 - o.y1) / 2);
				o.imgurl = that.baseUrl + o.imgurl;
			}
			success(r);
		}, error);
	},
	SetBaseTrain: function (data, success, error) {
		var that = this;
		that.Default("/api/Basetrain/setQuestion", data, success, error);
	},
	UpImage: function(path, keepPath, newPath, keepNewPath, targetWidth, targetHeight, keepRatio, callback) {
		var that = this;
		plus.io.getImageInfo({
			src: path,
			success: function(info) {
				var width = targetWidth;
				var height = targetHeight;
				if (keepRatio) {
					if (info.width / info.height > targetWidth / targetHeight) {
						height = Math.floor((targetWidth / info.width) * info.height);
					} else {
						width = Math.floor((targetHeight / info.height) * info.width);
					}
				}
				plus.zip.compressImage({
						src: path,
						dst: newPath,
						overwrite: true,
						format: "jpg",
						quality: 80,
						width: width + "px",
						height: height + "px"
					}, function(event) {
						if (!keepPath) {
							plus.io.resolveLocalFileSystemURL(path, function(entry) {
								entry.remove();
							});
						}
						var task = plus.uploader.createUpload(that.baseUrl + "/api/Common/upload", {
							method: "POST",
							timeout: 300
						}, function(upload, status) {
							if (!keepNewPath) {
								plus.io.resolveLocalFileSystemURL(newPath, function(entry) {
									entry.remove();
								});
							}
							if (status == 200) {
								var result = null;
								try {
									result = JSON.parse(upload.responseText);
								} catch(error) {
									showTip(true, "解析JSON时出现异常", 2000);
								}
								if (result) {
									if (result.code) {
										if (callback) {
											callback(result.data.url, width, height);
										}
									} else {
										showTip(true, result.msg, 2000);
									}
								}
							} else {
								showTip(true, "上传时发生异常：" + status, 2000);
							}
						});
						task.addFile(newPath, {
							key: "file"
						});
						var token = plus.storage.getItem("token");
						if(token) {
							task.setRequestHeader("token", token);
						}
						task.start();
					}, function(error) {
						showTip(true, error.message, 2000);
				});
			},
			fail: function(error) {
				showTip(true, error.message, 2000);
			}
		});
	},
	UpPhoto: function(path, callback) {
		var that = this;
		var newPath = path.substring(0, path.lastIndexOf(".")) + "_s.jpg";
		that.UpImage(path, false, newPath, false, 1920, 1080, true, callback);
	},
	getExamQuestion: function(job, success, error) {
		var that = this;
		that.Default("/api/Examquestion/getQuestion", {
			job: job
		}, function(r) {
			r.data = r.data.list;
			success(r);
		}, error);
	},
	getExamQuestionNoExam: function(job, type, success, error) {
		var that = this;
		that.Default("/api/Examquestion/getQuestionNoExam", {
			job: job,
			type: type
		}, function(r) {
			r.data = r.data.list;
			success(r);
		}, error);
	},
	UpAvatar: function(path, callback) {
		var that = this;
		var newPath = plus.io.PRIVATE_DOC + "/" + (new Date()).getTime() + ".jpg";
		that.UpImage(path, true, newPath, true, 320, 320, false, callback);
	},
	ModifyUserInfo: function(avatarPath, uinfoNickname, uinfoJobNumber, uinfoMobile, uinfoIdNumber, uinfoProjectName, uinfoWorkingAddress, success, error) {
		var that = this;
		var up = function() {
			that.Default("/api/User/modifyUserInfo", {
				avatarPath: avatarPath, 
				uinfo_nickname: uinfoNickname, 
				uinfo_job_number: uinfoJobNumber, 
				uinfo_mobile: uinfoMobile, 
				uinfo_id_number: uinfoIdNumber, 
				uinfo_project_name: uinfoProjectName, 
				uinfo_working_address: uinfoWorkingAddress
			}, function(r) {
				success(r, avatarPath);
			}, error);
		};
		if (avatarPath) {
			that.UpAvatar(avatarPath, function(url) {
				avatarPath = url;
				up();
			});
		} else {
			up();
		}
	},
	ModifyPassword: function(password, success, error) {
		var that = this;
		that.Default("/api/User/modifyPassword", {
			password: password
		}, success, error);
	},
	GetSkillArticle: function(success, error) {
		var that = this;
		that.Default("/api/Skillarticle/getAll", { }, success, error);
	},
	CreateFight: function(success, error) {
		var that = this;
		that.Default("/api/Fight/createFight", { }, success, error);
	},
	GetAccepter: function(roomId, success, error) {
		var that = this;
		that.Default("/api/Fight/getAccepter", { 
			roomId: roomId
		}, success, error);
	},
	StartFight: function(roomId, success, error) {
		var that = this;
		that.Default("/api/Fight/startFight", { 
			roomId: roomId
		}, function(r) {
			for(var i=0; i<r.data.questions.length; i++) {
				var o = r.data.questions[i];
				o.tx = o.x1 + ((o.x2 - o.x1) / 2);
				o.ty = o.y1 + ((o.y2 - o.y1) / 2);
				o.imgurl = that.baseUrl + o.imgurl;
			}
			success(r);
		}, error);
	},
	AcceptFight: function(roomId, success, error) {
		var that = this;
		that.Default("/api/Fight/acceptFight", { 
			roomId: roomId
		}, success, error);
	},
	GetStartSign: function(roomId, success, error) {
		var that = this;
		that.Default("/api/Fight/getStartSign", { 
			roomId: roomId
		}, function(r) {
			for(var i=0; i<r.data.questions.length; i++) {
				var o = r.data.questions[i];
				o.tx = o.x1 + ((o.x2 - o.x1) / 2);
				o.ty = o.y1 + ((o.y2 - o.y1) / 2);
				o.imgurl = that.baseUrl + o.imgurl;
			}
			success(r);
		}, error);
	},
	GetQuestionStatus: function(roomId, questionIndex, success, error) {
		var that = this;
		that.Default("/api/Fight/getQuestionStatus", { 
			roomId: roomId,
			questionIndex: questionIndex
		}, success, error);
	},
	SetQuestionStatus: function(roomId, questionIndex, isFighter1, isRight, success, error) {
		var that = this;
		that.Default("/api/Fight/setQuestionStatus", { 
			roomId: roomId,
			questionIndex: questionIndex,
			isFighter1: isFighter1,
			isRight: isRight
		}, success, error);
	},
	CountScore: function(roomId, success, error) {
		var that = this;
		that.Default("/api/Fight/countScore", { 
			roomId: roomId
		}, success, error);
	},
	SetExamScore: function(score, success, error) {
		var that = this;
		that.Default("/api/Score/setExamScore", { 
			score: score
		}, success, error);
	},
	SetBasetrainScore: function(score, success, error) {
		var that = this;
		that.Default("/api/Score/setBasetrainScore", { 
			score: score
		}, success, error);
	},
	SetAdvtrainScore: function(score, success, error) {
		var that = this;
		that.Default("/api/Score/setAdvtrainScore", { 
			score: score
		}, success, error);
	},
	GetScoreInfo: function(success, error) {
		var that = this;
		that.Default("/api/Score/getScoreInfo", { }, success, error);
	},
	GetScoreRank: function(success, error) {
		var that = this;
		that.Default("/api/Score/getScoreRank", { }, success, error);
	}
};