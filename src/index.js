/**
 * Future
 *
 * Copyright (c) 2013 Samuel Giles

 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var Future = function() {
	this.mappers = [];
	this.success = [];
	this.error = [];
}

Future.prototype.onSuccess = function(onSuccess) {
	if (this.val) {
		onSuccess(this.val);
		return this;
	}

	this.success.push(onSuccess);
	return this;
}

Future.prototype.onError = function(onError) {
	this.error.push(onError);
	return this;
}

Future.prototype.value = function(val) {
	var successLength = this.succcess.length,
    	    errorLength = this.error.length,
	    that = this;

	this.success.map(function(callback) { callback(val); });
	this.mappers.map(function(mapper) {
		mapper['future'].value((mapper['map'](val)));
	});

	this.val = val;
	return this;
}

Future.prototype.map = function(map) {

	// Create a new Future to represent th result of this map operation.
	var future = new Future();

	if (!this.val) {

		// If no value exists for this Future, then push this map operation and it's future object on the mappers list.
		this.mappers.push({ 'future': future, 'map': map });
	} else {

		// This future already has a val so map instantly and assign the returning futures val.
		future.val = map(this.val);
	}

	return future;
}

module.exports = Future;
