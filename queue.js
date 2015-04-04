/**
 * [Queue, a simple queue structure i wrote to queue messages in.]
 * @param {[type]} obj [object to enqueue]
 */
function Queue(obj) {
	this.queuedObj = obj;
	this.nextObj = null;

	// adds an object to the queue
	this.enqueue = function(obj) {
		var next = this.nextObj;
		var last = this;
		while (next) {
			last = next;
			next = this.nextObj;
		}

		last.nextObj = new Queue(obj);
	};

	// removes and returns the next object
	this.dequeue = function() {
		var next = this.nextObj;
		this.nextObj = this.nextObj.nextObj;

		return next.queuedObj;
	};

	// true if there is another object in the queue, otherwise false
	this.hasNext = function() {
		if (this.nextObj) {
			return true;
		}

		return false;
	};
}

exports.Queue = Queue;