/**
 * Cancelable promises extend base promises and provide a cancel functionality than can be used to cancel the execution or task of the promise.
 * 
 * These type of promises can be used to prevent additional processing when the data is not longer required (e.g. HTTP request for data that is not longer necessary)
 * 
 * @class CancelablePromise
 */
function CancelablePromise(executor) 
{
	let onResolve;
	let onReject;
	let onCancel;

	let fulfilled = false;
	let rejected = false;
	let called = false;
	let value;

	function resolve(v) 
	{
		fulfilled = true;
		value = v;

		if (typeof onResolve === "function") 
		{
			onResolve(value);
			called = true;
		}
	}

	function reject(reason) 
	{
		rejected = true;
		value = reason;

		if (typeof onReject === "function") 
		{
			onReject(value);
			called = true;
		}
	}

	/**
	 * Request to cancel the promise execution.
	 */
	this.cancel = function()
	{
		// TODO <ADD CODE HERE>
		return false;
	};

	this.then = function(callback) 
	{
		onResolve = callback;

		if (fulfilled && !called) 
		{
			called = true;
			onResolve(value);
		}
		return this;
	};

	this.catch = function(callback) 
	{
		onReject = callback;

		if (rejected && !called) 
		{
			called = true;
			onReject(value);
		}
		return this;
	};

	try 
	{
		executor(resolve, reject, cancel);
	}
	catch (error) 
	{
		reject(error);
	}
}
  
CancelablePromise.resolve = (val) => 
{
	return new CancelablePromise(function executor(resolve, _reject) 
	{
		resolve(val);
	});
};
  
CancelablePromise.reject = (reason) => 
{
	return new CancelablePromise(function executor(resolve, reject) 
	{
		reject(reason);
	});
};
  
CancelablePromise.all = (promises) => 
{
	let fulfilledPromises = [];
	let result = [];

	function executor(resolve, reject) 
	{
		promises.forEach((promise, index) => 
		{
			return promise
				.then((val) => 
				{
					fulfilledPromises.push(true);
					result[index] = val;

					if (fulfilledPromises.length === promises.length) 
					{
						return resolve(result);
					}
				})
				.catch((error) => {return reject(error);});
		}
		);
	}
	return new CancelablePromise(executor);
};

export {CancelablePromise};
