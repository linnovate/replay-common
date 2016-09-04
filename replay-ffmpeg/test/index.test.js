var sinon = require('sinon');
var ffmpeg = require('../index.js');
var fs = require('fs'),
	path = require('path');

function test() {
	describe('FFmpeg Wrapper Testing', testMethods);
}

function testMethods() {
	testrecordMethod();
	testconvertAndExtractMethod();
	testconvertToMp4Method();
	testextractDataMethod();
	testdurationMethod();
}

function testconvertAndExtractMethod() {
	describe('\nmethod : convertAndExtract', function() {
		describe('\ntest inputs:', function() {
			inputTestForconvertAndExtractMethod();
		});
		describe('\nfail Tests: ', function() {
			errorTestsForconvertAndExtract();
		});
		describe('\nSuccess Tests: ', function() {
			successTestsForconvertAndExtract();
		});
	});
}

function testconvertToMp4Method() {
	describe('\nmethod : convertToMp4', function() {
		describe('\ninput Tests: ', function() {
			inputTestsForconvertToMp4Method();
		});
		describe('\nerror Tests:', function() {
			errorTestsForconvertToMp4Method();
		});
		describe('\nsuccess Tests:', function() {
			successTestsForconvertToMp4Method();
		});
	});
}

function testextractDataMethod() {
	describe('\nmethod : extractData', function() {
		describe('\ntest inputs:', function() {
			inputTestsForextractDataMethod();
		});
		describe('\nerror tests: ', function() {
			errorTestsForextractDataMethod();
		});
		describe('\nSuccess tests: ', function() {
			successTestsForextractDataMethod();
		});
	});
}

function testdurationMethod() {
	describe('\nMethod: duration', function() {
		describe('\ninput Tests: ', function() {
			inputTestsFordurationMethod();
		});
		describe('\nerror Tests: ', function() {
			errorTestsFordurationMethod();
		});
		describe('\nSuccess Tests: ', function() {
			successTestsFordurationMethod();
		});
	});
}

function testrecordMethod() {
	describe('\nMethod: record', function() {
		describe('\ninput Tests: ', function() {
			inputTestsForrecordMethod();
		});
		describe('\nerror Tests: ', function() {
			errorTestsForrecordMethod();
		});
		describe('\nSuccess Tests: ', function() {
			successTestsForrecordMethod();
		});
	});
}

function inputTestForconvertAndExtractMethod() {
	it('should reject when there is no input path', function(done) {
		ffmpeg.convertAndExtract()
			.then(function() {
				done(new Error('fail'));
			})
			.catch(function() {
				done();
			});
	});
	it('should reject when there is no input path', function(done) {
		ffmpeg.convertAndExtract({})
			.then(function() {
				done(new Error('fail'));
			})
			.catch(function() {
				done();
			});
	});
	it('should reject when there is no input path', function(done) {
		ffmpeg.convertAndExtract({ inputPath: null })
			.then(function() {
				done(new Error('fail'));
			})
			.catch(function() {
				done();
			});
	});
	it('should reject when there is no input path', function(done) {
		ffmpeg.convertAndExtract({ inputPath: undefined })
			.then(function() {
				done(new Error('fail'));
			})
			.catch(function() {
				done();
			});
	});
	it('should reject when the input path is number', function(done) {
		ffmpeg.convertAndExtract({ inputPath: 3 })
			.then(function() {
				done(new Error('fail'));
			})
			.catch(function() {
				done();
			});
	});
}

function errorTestsForconvertAndExtract() {
	it('should emit error event when the input path is not exist/not valid', function(done) {
		this.timeout(4000);
		var spy = sinon.spy();
		ffmpeg.on('FFmpeg_errorOnConvertAndExtract', spy);
		ffmpeg.convertAndExtract({ inputPath: '/bla.ts' })
			.then(function() {
				setTimeout(function() {
					if (spy.called) {
						done();
					} else {
						done(new Error('the event didnt emited'));
					}
				}, 3500);
			})
			.catch(function(err) {
				done(err);
			});
	});
	it('should emit error event when the input path is not exist/not valid', function(done) {
		this.timeout(4000);
		var spy = sinon.spy();
		ffmpeg.on('FFmpeg_errorOnConvertAndExtract', spy);
		ffmpeg.convertAndExtract({ inputPath: '/////bla.ts' })
			.then(function() {
				setTimeout(function() {
					if (spy.called) {
						done();
					} else {
						done(new Error('the event didnt emited'));
					}
				}, 3500);
			})
			.catch(function(err) {
				done(err);
			});
	});
	it('should emit error event when the input have missing streams like video or data', function(done) {
		this.timeout(4000);
		var spy = sinon.spy();
		ffmpeg.on('FFmpeg_errorOnConvertAndExtract', spy);
		ffmpeg.convertAndExtract({ inputPath: './assets/Sample_Ts_File_For_Testing.ts' })
			.then(function() {
				setTimeout(function() {
					if (spy.called) {
						done();
					} else {
						done(new Error('the event didnt emited'));
					}
				}, 3500);
			})
			.catch(function(err) {
				done(err);
			});
	});
}

function successTestsForconvertAndExtract() {
	it('should work', function(done) {
		this.timeout(10000);
		var spy = sinon.spy();
		ffmpeg.on('FFmpeg_finishConvertAndExtract', spy);
		ffmpeg.on('FFmpeg_errorOnConvertAndExtract', function(err) {
			console.log(err);
		});
		ffmpeg
			.convertAndExtract({
				inputPath: path.join(__dirname, './assets/MuxedVideo.ts'),
				outputPath: path.join(__dirname, './testOutput/ConvertAndExtract')
			})
			.then(function() {
				setTimeout(function() {
					if (spy.called) {
						done();
					} else {
						done(new Error('the event didnt emited'));
					}
				}, 8000);
			})
			.catch(function(err) {
				done(err);
			});
	});
	it('should work with resolutions', function(done) {
		this.timeout(50000);
		var spy = sinon.spy();
		ffmpeg.on('FFmpeg_finishConvertAndExtract', spy);
		ffmpeg.on('FFmpeg_errorOnConvertAndExtract', function(err) {
			console.log(err);
		});
		ffmpeg
			.convertAndExtract({
				inputPath: './test/assets/MuxedVideo.ts',
				outputPath: path.join(__dirname, './testOutput/convertAndExtract'),
				divideToResolutions: true
			})
			.then(function(paths) {
				setTimeout(function() {
					if (spy.called) {
						done();
					} else {
						done('fail');
					}
				}, 49950);
			})
			.catch(function(err) {
				done(err);
			});
	});
}

function inputTestsForconvertToMp4Method() {
	it('should reject when there is no input path', function(done) {
		ffmpeg.convertToMp4()
			.then(function() {
				done(new Error('fail'));
			})
			.catch(function() {
				done();
			});
	});
	it('should reject when there is no input path', function(done) {
		ffmpeg.convertToMp4({})
			.then(function() {
				done(new Error('fail'));
			})
			.catch(function() {
				done();
			});
	});
	it('should reject when there is no input path', function(done) {
		ffmpeg.convertToMp4({ inputPath: null })
			.then(function() {
				done(new Error('fail'));
			})
			.catch(function() {
				done();
			});
	});
	it('should reject when there is no input path', function(done) {
		ffmpeg.convertToMp4({ inputPath: undefined })
			.then(function() {
				done(new Error('fail'));
			})
			.catch(function() {
				done();
			});
	});
	it('should reject when the input path is number', function(done) {
		ffmpeg.convertToMp4({ inputPath: 3 })
			.then(function() {
				done(new Error('fail'));
			})
			.catch(function() {
				done();
			});
	});
}

function errorTestsForconvertToMp4Method() {
	it('should emit error event when the input path is not exist/not valid', function(done) {
		this.timeout(4000);
		var spy = sinon.spy();
		ffmpeg.on('FFmpeg_errorOnConverting', spy);
		ffmpeg.convertToMp4({ inputPath: '/bla.ts' })
			.then(function() {
				setTimeout(function() {
					if (spy.called) {
						done();
					} else {
						done(new Error('the event didnt emited'));
					}
				}, 3500);
			})
			.catch(function(err) {
				done(err);
			});
	});
	it('should emit error event when the input path is not exist/not valid', function(done) {
		this.timeout(4000);
		var spy = sinon.spy();
		ffmpeg.on('FFmpeg_errorOnConverting', spy);
		ffmpeg.convertToMp4({ inputPath: '/////bla.ts' })
			.then(function() {
				setTimeout(function() {
					if (spy.called) {
						done();
					} else {
						done(new Error('the event didnt emited'));
					}
				}, 3500);
			})
			.catch(function(err) {
				done(err);
			});
	});
	it('should emit error event when the input have missing streams like video or data', function(done) {
		this.timeout(4000);
		var spy = sinon.spy();
		ffmpeg.on('FFmpeg_errorOnConverting', spy);
		ffmpeg.convertToMp4({ inputPath: './assets/Sample_Ts_File_For_Testing.ts' })
			.then(function() {
				setTimeout(function() {
					if (spy.called) {
						done();
					} else {
						done(new Error('the event didnt emited'));
					}
				}, 3500);
			})
			.catch(function(err) {
				done(err);
			});
	});
}

function successTestsForconvertToMp4Method() {
	it('should work', function(done) {
		this.timeout(10000);
		var spy = sinon.spy();
		ffmpeg.on('FFmpeg_finishConverting', spy);
		ffmpeg.on('FFmpeg_errorOnConverting', function(err) {
			console.log(err);
		});
		ffmpeg
			.convertToMp4({
				inputPath: path.join(__dirname, './assets/MuxedVideo.ts'),
				outputPath: path.join(__dirname, './testOutput/ConvertToMp4')
			})
			.then(function() {
				setTimeout(function() {
					if (spy.called) {
						done();
					} else {
						done(new Error('the event didnt emited'));
					}
				}, 8000);
			})
			.catch(function(err) {
				done(err);
			});
	});
	it('should emit finish event + checking there is new file the convert', function(done) {
		this.timeout(11000);
		var spyOnSuccess = sinon.spy();
		var spyOnFailure = sinon.spy();

		ffmpeg.on('FFmpeg_errorOnConverting', spyOnFailure);
		ffmpeg.on('FFmpeg_finishConverting', spyOnSuccess);

		var handleConverting = function(command) {
			setTimeout(function() {
				if (spyOnFailure.called) {
					return done('FFmpegWrapper_errorOnConverting event was called');
				} else
				if (spyOnSuccess.called) {
					fs.stat('./test/assets/Sample_Ts_File_For_Testing.mp4', function(err, stat) {
						if (err) {
							return done(err);
						} else
						if (stat.size > 0) {
							return done();
						}
					});
				} else {
					done('no events was called');
				}
			}, 10000);
		};

		ffmpeg
			.convertToMp4({
				inputPath: './test/assets/Sample_Ts_File_For_Testing.ts',
				outputPath: path.join(__dirname, './testOutput/ConvertToMp4')
			})
			.then(handleConverting)
			.catch(function(err) {
				done(err);
			});
	});
	it('should work with resolutions', function(done) {
		this.timeout(15000);
		var spy = sinon.spy();
		ffmpeg.on('FFmpeg_finishConverting', spy);
		ffmpeg
			.convertToMp4({
				inputPath: './test/assets/Sample_Ts_File_For_Testing.ts',
				outputPath: path.join(__dirname, './testOutput/ConvertToMp4'),
				divideToResolutions: true
			})
			.then(function(paths) {
				setTimeout(function() {
					if (spy.called) {
						done();
					} else {
						done('fail');
					}
				}, 14500);
			})
			.catch(function(err) {
				done(err);
			});
	});
}

function inputTestsForextractDataMethod() {
	it('should reject when there is no input path', function(done) {
		ffmpeg.extractData()
			.then(function() {
				done(new Error('fail'));
			})
			.catch(function() {
				done();
			});
	});
	it('should reject when there is no input path', function(done) {
		ffmpeg.extractData({})
			.then(function() {
				done(new Error('fail'));
			})
			.catch(function() {
				done();
			});
	});
	it('should reject when there is no input path', function(done) {
		ffmpeg.extractData({ inputPath: null })
			.then(function() {
				done(new Error('fail'));
			})
			.catch(function() {
				done();
			});
	});
	it('should reject when there is no input path', function(done) {
		ffmpeg.extractData({ inputPath: undefined })
			.then(function() {
				done(new Error('fail'));
			})
			.catch(function() {
				done();
			});
	});
	it('should reject when the input path is number', function(done) {
		ffmpeg.extractData({ inputPath: 3 })
			.then(function() {
				done(new Error('fail'));
			})
			.catch(function() {
				done();
			});
	});
}

function errorTestsForextractDataMethod() {
	it('should emit error event when the input path is not exist/not valid', function(done) {
		this.timeout(4000);
		var spy = sinon.spy();
		ffmpeg.on('FFmpeg_errorOnExtractData', spy);
		ffmpeg.extractData({ inputPath: '/bla.ts' })
			.then(function() {
				setTimeout(function() {
					if (spy.called) {
						done();
					} else {
						done(new Error('the event didnt emited'));
					}
				}, 3500);
			})
			.catch(function(err) {
				done(err);
			});
	});
	it('should emit error event when the input path is not exist/not valid', function(done) {
		this.timeout(4000);
		var spy = sinon.spy();
		ffmpeg.on('FFmpeg_errorOnExtractData', spy);
		ffmpeg.extractData({ inputPath: '/////bla.ts' })
			.then(function() {
				setTimeout(function() {
					if (spy.called) {
						done();
					} else {
						done(new Error('the event didnt emited'));
					}
				}, 3500);
			})
			.catch(function(err) {
				done(err);
			});
	});
	it('should emit error event when the input have missing streams like video or data', function(done) {
		this.timeout(4000);
		var spy = sinon.spy();
		ffmpeg.on('FFmpeg_errorOnExtractData', spy);
		ffmpeg.extractData({ inputPath: './assets/Sample_Ts_File_For_Testing.ts' })
			.then(function() {
				setTimeout(function() {
					if (spy.called) {
						done();
					} else {
						done(new Error('the event didnt emited'));
					}
				}, 3500);
			})
			.catch(function(err) {
				done(err);
			});
	});
}

function successTestsForextractDataMethod() {
	it('should work', function(done) {
		this.timeout(10000);
		var spy = sinon.spy();
		ffmpeg.on('FFmpeg_finishExtractData', spy);
		ffmpeg.on('FFmpeg_errorOnExtractData', function(err) {
			console.log(err);
		});
		ffmpeg
			.extractData({
				inputPath: path.join(__dirname, './assets/MuxedVideo.ts'),
				outputPath: path.join(__dirname, './testOutput/ExtractData')
			})
			.then(function() {
				setTimeout(function() {
					if (spy.called) {
						done();
					} else {
						done(new Error('the event didnt emited'));
					}
				}, 8000);
			})
			.catch(function(err) {
				done(err);
			});
	});
}

function inputTestsFordurationMethod() {
	it('should return error in callback when params is null', function(done) {
		this.timeout(4000);
		ffmpeg.duration(null, function(err, data) {
			if (err) {
				done();
			} else {
				done('fail');
			}
		});
	});

	it('should should reject when the params is null', function(done) {
		this.timeout(3000);
		ffmpeg.duration(null)
			.then(function(data) {
				done('fail');
			})
			.catch(function() {
				done();
			});
	});

	it('should return error in callback when params is empty object', function(done) {
		this.timeout(4000);
		ffmpeg.duration({}, function(err, data) {
			if (err) {
				done();
			} else {
				done('fail');
			}
		});
	});

	it('should should reject when the params is empty object', function(done) {
		this.timeout(3000);
		ffmpeg.duration({})
			.then(function(data) {
				done('fail');
			})
			.catch(function() {
				done();
			});
	});

	it('should return error in callback when filePath is null', function(done) {
		this.timeout(4000);
		ffmpeg.duration({ filePath: null }, function(err, data) {
			if (err) {
				done();
			} else {
				done('fail');
			}
		});
	});

	it('should should reject when filePath is null', function(done) {
		this.timeout(3000);
		ffmpeg.duration({ filePath: null })
			.then(function(data) {
				done('fail');
			})
			.catch(function() {
				done();
			});
	});

	it('should return error in callback when filePath is not string', function(done) {
		this.timeout(4000);
		ffmpeg.duration({ filePath: 3 }, function(err, data) {
			if (err) {
				done();
			} else {
				done('fail');
			}
		});
	});

	it('should should reject when filePath is not string', function(done) {
		this.timeout(3000);
		ffmpeg.duration({ filePath: 3 })
			.then(function(data) {
				done('fail');
			})
			.catch(function() {
				done();
			});
	});
}

function errorTestsFordurationMethod() {
	it('should return error in callback when filePath is not exist', function(done) {
		this.timeout(4000);
		ffmpeg.duration({ filePath: 'bla.ts' }, function(err, data) {
			if (err) {
				done();
			} else {
				done('fail');
			}
		});
	});

	it('should should reject when filePath is not exist', function(done) {
		this.timeout(3000);
		ffmpeg.duration({ filePath: '/bla.ts' })
			.then(function(data) {
				done('fail');
			})
			.catch(function() {
				done();
			});
	});
}

function successTestsFordurationMethod() {
	it('should return the duration of the file in the callback', function(done) {
		this.timeout(4000);
		ffmpeg.duration({ filePath: path.join(__dirname, '/../test/assets/Sample_Ts_File_For_Testing.ts') },
			function(err, duration) {
				if (err) {
					done('fail');
				} else if (duration) {
					done();
				} else {
					done('fail');
				}
			});
	});

	it('should return the duration of the file given', function(done) {
		ffmpeg.duration({ filePath: path.join(__dirname, '/../test/assets/Sample_Ts_File_For_Testing.ts') })
			.then(function(duration) {
				if (duration) {
					done();
				} else {
					done('didnt get duration');
				}
			});
	});
}

function inputTestsForrecordMethod() {
	it('should reject when send null as parameter', function(done) {
		ffmpeg.record()
			.then(function() {
				done('fail');
			})
			.catch(function() {
				done();
			});
	});

	it('should reject when send empty object as parameter', function(done) {
		ffmpeg.record({})
			.then(function() {
				done('fail');
			})
			.catch(function() {
				done();
			});
	});

	it('should reject when send only duration as parameter', function(done) {
		ffmpeg.record({ duration: 20 })
			.then(function() {
				done('fail');
			})
			.catch(function() {
				done();
			});
	});

	it('should reject when send just input object as parameter', function(done) {
		ffmpeg.record({ input: '/bla' })
			.then(function() {
				done('fail');
			})
			.catch(function() {
				done();
			});
	});

	it('should reject when send just output object as parameter', function(done) {
		ffmpeg.record({ output: '/bla' })
			.then(function() {
				done('fail');
			})
			.catch(function() {
				done();
			});
	});

	it('should reject when send just input and duration object as parameter', function(done) {
		ffmpeg.record({ input: '/bla', duration: 20 })
			.then(function() {
				done('fail');
			})
			.catch(function() {
				done();
			});
	});

	it('should reject when send just output and duration object as parameter', function(done) {
		ffmpeg.record({ output: '/bla', duration: 20 })
			.then(function() {
				done('fail');
			})
			.catch(function() {
				done();
			});
	});

	it('should reject when send just output and duration object as parameter', function(done) {
		ffmpeg.record({ output: '/bla', duration: 20 })
			.then(function() {
				done('fail');
			})
			.catch(function() {
				done();
			});
	});
}

function errorTestsForrecordMethod() {

}

function successTestsForrecordMethod() {
	it('should work when duration isnt number', function(done) {
		ffmpeg.record({ output: '/bla', duration: 'asddsd', input: '/bla' })
			.then(function() {
				done();
			})
			.catch(function(err) {
				done(err);
			});
	});

	it('should work when duration is not valid as number e.g -1,0 etc', function(done) {
		ffmpeg.record({ output: '/bla', duration: 0, input: '/bla' })
			.then(function() {
				done();
			})
			.catch(function(err) {
				done(err);
			});
	});

	it('should work when duration is not valid as number e.g -1,0 etc', function(done) {
		ffmpeg.record({ output: '/bla', duration: -1, input: '/bla' })
			.then(function() {
				done();
			})
			.catch(function(err) {
				done(err);
			});
	});

	it('should work when there is no duration in the params object', function(done) {
		ffmpeg.record({ output: '/bla', input: '/bla' })
			.then(function() {
				done();
			})
			.catch(function(err) {
				done(err);
			});
	});

	it('should emit event when the input file does not exist', function(done) {
		var spy = sinon.spy();
		ffmpeg.on('ffmpegWrapper_error_while_recording', spy);
		ffmpeg.record({ output: '/bla', duration: -1, input: '/bla' })
			.then(function() {
				setTimeout(function() {
					if (spy.called) {
						done();
					} else {
						done('failed');
					}
				}, 1500);
			})
			.catch(function(err) {
				done(err);
			});
	});

	it('should emit event when it finish the work', function(done) {
		this.timeout(11000);
		var spyOnSuccess = sinon.spy();
		var spyOnFailure = sinon.spy(function(err) {
			console.log(err);
		});
		ffmpeg.on('ffmpegWrapper_error_while_recording', spyOnFailure);
		ffmpeg.on('ffmpegWrapper_finish_recording', spyOnSuccess);
		ffmpeg
			.record({
				output: path.join(__dirname, './testOutput/bla'),
				duration: 10,
				input: path.join(__dirname, './assets/Sample_Ts_File_For_Testing.ts')
			})
			.then(function() {
				setTimeout(function() {
					if (spyOnFailure.called) {
						done('ffmpegWrapper_error_while_recording');
					} else if (spyOnSuccess.called) {
						done();
					} else {
						done('nothing');
					}
				}, 10500);
			})
			.catch(function(err) {
				done(err);
			});
	});
}

test();
