window.db = jsonDb();

function showMessage(opts) {
	let el = $('<div/>').attr({
		class: 'NotyMessage'
	}).html(opts.text)
	$('body').append(el)
	setTimeout(() => {
		el.remove()
	}, opts.timeout || 2000);
}

function jsonDb() {
	var self = {
		push,
		getData
	}

	function getData(path) {
		return new Promise((resolve, reject) => {
			httpPost('/jsonDb', {
				method: 'getData',
				params: [path]
			}).then(r => {
				if (r.err) {
					reject(r.err);
				} else {
					resolve(r.result);
				}
			});
		})
	}

	function push(path, data, override) {
		return new Promise((resolve, reject) => {
			httpPost('/jsonDb', {
				method: 'push',
				params: [path, data, override]
			}).then(r => {
				if (r.err) {
					reject(r.err);
				} else {
					resolve(r.result);
				}
			});
		})
	}
	return self;
}

function httpPost(url, data, options = {}) {
	var withCredentials = options && options.withCredentials == false ? false : true
	return new Promise((resolve, reject) => {
		if (!data) {
			data = {};
		}
		data = JSON.stringify(data);
		try {
			var settings = {
				type: options.method || 'post',
				url: url,
				crossDomain: true,
				contentType: 'application/json; charset=utf-8',
				xhrFields: {
					withCredentials: withCredentials
				}
			};
			if (options.method !== 'get') {
				settings.data = data;
			}
			$.ajax(settings).always(function(response, status, xhr) {
				if (status == 'error') {
					reject({
						message: "error",
						detail: xhr
					});
				}
				if (!response) {
					return resolve(response)
				}
				if (response.err) {
					reject(response.err);
				} else {
					if (status === 'parserror') {
						return reject(new Error('PARSE_ERROR'))
					}
					var isXhr = typeof response.abort === 'function' && typeof response.always === 'function'
					if (!isXhr) {
						resolve(response);
					} else {
						resolve(response.result)
					}
				}
			});
		} catch (err) {
			reject(err)
		}
	});
}