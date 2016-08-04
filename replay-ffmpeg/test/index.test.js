var assert = require('chai').assert,
	sinon = require('sinon');
var ffmpeg = require('../index.js');
var fs = require('fs'),
	path = require('path');

function test() {
	describe('FFmpeg Wrapper Testing', testMethods);
}

function testMethods() {
	testPublicMethods();
}

function testPublicMethods() {
	describe('Method: captureMuxedVideoTelemetry Testing', function() {
		this.timeout(5000);
		var params;
		beforeEach(function() {
			params = {
				inputs: ['./test/assets/Sample_Ts_File_For_Testing.ts'],
				duration: 10,
				dir: '/opt/239',
				file: 'now'
			};
		});
		describe('Inputs tests', function() {
			it('should reject on no duration suplied', function(done) {
				params.duration = undefined;
				ffmpeg.captureMuxedVideoTelemetry(params).then(
					function(command) {
						assert.isTrue(false);
						done();
					},
					function(error) {
						assert.equal(error, 'bad params suplied', 'got bad params..');
						done();
					});
			});
			it('should reject on no file suplied', function(done) {
				params.file = undefined;
				ffmpeg.captureMuxedVideoTelemetry(params).then(
					function(command) {
						assert.isTrue(false);
						done();
					},
					function(error) {
						assert.equal(error, 'bad params suplied', 'got bad params..');
						done();
					});
			});
			it('should reject on no directory suplied', function(done) {
				params.dir = undefined;
				ffmpeg.captureMuxedVideoTelemetry(params).then(
					function(command) {
						assert.isTrue(false);
						done();
					},
					function(error) {
						assert.equal(error, 'bad params suplied', 'got bad params..');
						done();
					});
			});
			it('should reject on no inputs suplied', function(done) {
				params.inputs = undefined;
				ffmpeg.captureMuxedVideoTelemetry(params).then(
					function(command) {
						assert.isTrue(false);
						done();
					},
					function(error) {
						assert.equal(error, 'bad params suplied', 'got bad params..');
						done();
					});
			});
			it('should reject on empty inputs suplied', function(done) {
				params.inputs = [];
				ffmpeg.captureMuxedVideoTelemetry(params).then(
					function(command) {
						assert.isTrue(false);
						done();
					},
					function(error) {
						assert.equal(error, 'bad params suplied', 'got bad params..');
						done();
					});
			});
		});
		describe('Normal behavior tests', function() {
			describe('Test capturing with basic params', function() {
				var spy;
				beforeEach(function() {
					spy = sinon.spy();
					ffmpeg.on('FFmpegBegin', spy);
					ffmpeg.captureMuxedVideoTelemetry(params);
				});
				it('should emit FFmpegBegin event', function(done) {
					setTimeout(function() {
						assert.isTrue(spy.calledOnce);
						done();
					}, 2000);
				});
			});
		});
		describe('Error handling tests', function() {
			describe('Testing non muxed media', function() {
				var spy;
				beforeEach(function() {
					spy = sinon.spy();
					ffmpeg.on('FFmpegError', spy);
					params.inputs = ['./test/assets/NoMuxedVideo.mp4'];
					ffmpeg.captureMuxedVideoTelemetry(params);
				});
				it('should emit FFmpegError event on no muxed media', function(done) {
					setTimeout(function() {
						assert.isTrue(spy.calledOnce);
						done();
					}, 2000);
				});
			});
			describe('Testing unreal input file source', function() {
				var spy;
				beforeEach(function() {
					spy = sinon.spy();
					ffmpeg.on('FFmpegError', spy);
					params.inputs = ['/not/real/input.ts'];
					ffmpeg.captureMuxedVideoTelemetry(params);
				});
				it('should emit FFmpegError event', function(done) {
					setTimeout(function() {
						assert.isTrue(spy.calledOnce);
						done();
					}, 2000);
				});
			});
		});
		describe('Edge cases tests', function() {
			describe('Test handling 2 inputs', function() {
				var spy;
				beforeEach(function() {
					spy = sinon.spy();
					ffmpeg.on('FFmpegBegin', spy);
					params.inputs = ['./test/assets/Sample_Ts_File_For_Testing.ts', './test/assets/NoMuxedVideo.mp4'];
					ffmpeg.captureMuxedVideoTelemetry(params);
				});
				it('should emit FFmpegBegin event', function(done) {
					setTimeout(function() {
						assert.isTrue(spy.calledOnce);
						done();
					}, 2000);
				});
			});
		});
	});
	describe('Method: captureVideoWithoutTelemetry Testing', function() {
		this.timeout(5000);
		var params;
		beforeEach(function() {
			params = {
				inputs: ['./test/assets/Sample_Ts_File_For_Testing.ts'],
				duration: 10,
				dir: '/opt/239',
				file: 'now'
			};
		});
		describe('Inputs tests', function() {
			it('should reject on no duration suplied', function(done) {
				params.duration = undefined;
				ffmpeg.captureVideoWithoutTelemetry(params).then(
					function(command) {
						assert.isTrue(false);
						done();
					},
					function(error) {
						assert.equal(error, 'bad params suplied', 'got bad params..');
						done();
					});
			});
			it('should reject on no file suplied', function(done) {
				params.file = undefined;
				ffmpeg.captureVideoWithoutTelemetry(params).then(
					function(command) {
						assert.isTrue(false);
						done();
					},
					function(error) {
						assert.equal(error, 'bad params suplied', 'got bad params..');
						done();
					});
			});
			it('should reject on no directory suplied', function(done) {
				params.dir = undefined;
				ffmpeg.captureVideoWithoutTelemetry(params).then(
					function(command) {
						assert.isTrue(false);
						done();
					},
					function(error) {
						assert.equal(error, 'bad params suplied', 'got bad params..');
						done();
					});
			});
			it('should reject on no inputs suplied', function(done) {
				params.inputs = undefined;
				ffmpeg.captureVideoWithoutTelemetry(params).then(
					function(command) {
						assert.isTrue(false);
						done();
					},
					function(error) {
						assert.equal(error, 'bad params suplied', 'got bad params..');
						done();
					});
			});
			it('should reject on empty inputs suplied', function(done) {
				params.inputs = [];
				ffmpeg.captureVideoWithoutTelemetry(params).then(
					function(command) {
						assert.isTrue(false);
						done();
					},
					function(error) {
						assert.equal(error, 'bad params suplied', 'got bad params..');
						done();
					});
			});
		});
		describe('Normal behavior tests', function() {
			describe('Test capturing with basic params', function() {
				var spy;
				beforeEach(function() {
					spy = sinon.spy();
					ffmpeg.on('FFmpegBegin', spy);
				});
				it('should emit FFmpegBegin event', function(done) {
					this.timeout(3000);
					ffmpeg.captureVideoWithoutTelemetry(params);
					setTimeout(function() {
						assert.isTrue(spy.called);
						done();
					}, 2500);
				});
			});
		});
		describe('Error handling tests', function() {
			describe('Testing unreal input file source', function() {
				var spy;
				beforeEach(function() {
					spy = sinon.spy();
					ffmpeg.on('FFmpegError', spy);
					params.inputs = ['/not/real/input.ts'];
					ffmpeg.captureVideoWithoutTelemetry(params);
				});
				it('should emit FFmpegError event', function(done) {
					setTimeout(function() {
						assert.isTrue(spy.calledOnce);
						done();
					}, 2000);
				});
			});
		});
		describe('Edge cases tests', function() {
			describe('Test handling 2 inputs', function() {
				var spy;
				beforeEach(function() {
					spy = sinon.spy();
					ffmpeg.on('FFmpegBegin', spy);
					params.inputs = ['./test/assets/Sample_Ts_File_For_Testing.ts', './test/assets/NoMuxedVideo.mp4'];
					ffmpeg.captureVideoWithoutTelemetry(params);
				});
				it('should emit FFmpegBegin event', function(done) {
					setTimeout(function() {
						assert.isTrue(spy.calledOnce);
						done();
					}, 2000);
				});
			});
		});
	});
	describe('Method: captureTelemetryWithoutVideo Testing', function() {
		this.timeout(5000);
		var params;
		beforeEach(function() {
			params = {
				inputs: ['./test/assets/Sample_Ts_File_For_Testing.ts'],
				duration: 10,
				dir: '/opt/239',
				file: 'now'
			};
		});
		describe('Inputs tests', function() {
			it('should reject on no duration suplied', function(done) {
				params.duration = undefined;
				ffmpeg.captureTelemetryWithoutVideo(params).then(
					function(command) {
						assert.isTrue(false);
						done();
					},
					function(error) {
						assert.equal(error, 'bad params suplied', 'got bad params..');
						done();
					});
			});
			it('should reject on no file suplied', function(done) {
				params.file = undefined;
				ffmpeg.captureTelemetryWithoutVideo(params).then(
					function(command) {
						assert.isTrue(false);
						done();
					},
					function(error) {
						assert.equal(error, 'bad params suplied', 'got bad params..');
						done();
					});
			});
			it('should reject on no directory suplied', function(done) {
				params.dir = undefined;
				ffmpeg.captureTelemetryWithoutVideo(params).then(
					function(command) {
						assert.isTrue(false);
						done();
					},
					function(error) {
						assert.equal(error, 'bad params suplied', 'got bad params..');
						done();
					});
			});
			it('should reject on no inputs suplied', function(done) {
				params.inputs = undefined;
				ffmpeg.captureTelemetryWithoutVideo(params).then(
					function(command) {
						assert.isTrue(false);
						done();
					},
					function(error) {
						assert.equal(error, 'bad params suplied', 'got bad params..');
						done();
					});
			});
			it('should reject on empty inputs suplied', function(done) {
				params.inputs = [];
				ffmpeg.captureTelemetryWithoutVideo(params).then(
					function(command) {
						assert.isTrue(false);
						done();
					},
					function(error) {
						assert.equal(error, 'bad params suplied', 'got bad params..');
						done();
					});
			});
		});
		describe('Normal behavior tests', function() {
			describe('Test capturing with basic params', function() {
				var spy;
				beforeEach(function() {
					spy = sinon.spy();
					ffmpeg.on('FFmpegBegin', spy);
					ffmpeg.captureTelemetryWithoutVideo(params);
				});
				it('should emit FFmpegBegin event', function(done) {
					setTimeout(function() {
						assert.isTrue(spy.calledOnce);
						done();
					}, 2000);
				});
			});
		});
		describe('Error handling tests', function() {
			describe('Testing unreal input file source', function() {
				var spy;
				beforeEach(function() {
					spy = sinon.spy();
					ffmpeg.on('FFmpegError', spy);
					params.inputs = ['/not/real/input.ts'];
					ffmpeg.captureTelemetryWithoutVideo(params);
				});
				it('should emit FFmpegError event', function(done) {
					setTimeout(function() {
						assert.isTrue(spy.calledOnce);
						done();
					}, 2000);
				});
			});
		});
		describe('Edge cases tests', function() {
			describe('Test handling 2 inputs', function() {
				var spy;
				beforeEach(function() {
					spy = sinon.spy();
					ffmpeg.on('FFmpegBegin', spy);
					params.inputs = ['./test/assets/Sample_Ts_File_For_Testing.ts', './test/assets/NoMuxedVideo.mp4'];
					ffmpeg.captureTelemetryWithoutVideo(params);
				});
				it('should emit FFmpegBegin event', function(done) {
					setTimeout(function() {
						assert.isTrue(spy.calledOnce);
						done();
					}, 2000);
				});
			});
		});
	});

	/* din Tests */

	describe('Method: convertMpegTsFormatToMp4', function() {
		it('should emit finish event + checking there is new file the convert', function(done) {
			this.timeout(11000);
			var spyOnSuccess = sinon.spy();
			var spyOnFailure = sinon.spy();

			ffmpeg.on('FFmpegWrapper_errorOnConverting', spyOnFailure);
			ffmpeg.on('FFmpegWrapper_finishConverting', spyOnSuccess);

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

			ffmpeg.convertMpegTsFormatToMp4({ filePath: './test/assets/Sample_Ts_File_For_Testing.ts' })
				.then(handleConverting)
				.catch(function(err) {
					done(err);
				});
		});
	});

	describe('Method: getDurationOfVideo', function() {
		it('should return the duration of the file given', function(done) {
			ffmpeg.getDurationOfVideo({ filePath: path.join(__dirname, '/../test/assets/Sample_Ts_File_For_Testing.ts') })
				.then(function(duration) {
					if (duration) {
						done();
					} else {
						done('didnt get duration');
					}
				});
		});
	});

	describe('Method: record', function() {
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
			ffmpeg.record({ output: path.join(__dirname, './testOutput/bla'), duration: 10, input: path.join(__dirname, './assets/Sample_Ts_File_For_Testing.ts') })
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
	});
}

test();
