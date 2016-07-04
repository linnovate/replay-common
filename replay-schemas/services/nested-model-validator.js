// executes the model validate function with the supplied object
module.exports = function(model, object) {
	var isValid;
	model.validate(object, function(err) {
		if (err) {
			isValid = false;
		} else {
			isValid = true;
		}
	});

	while (isValid == undefined) {
		require('deasync').runLoopOnce();
	}

	return isValid;

}
