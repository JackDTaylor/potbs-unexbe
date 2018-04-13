window.fetchPost = function fetchPost(url, data) {
	return new Bluebird(function(resolve, reject, onCancel) {
		let request = $.post(url, data, response => {
			if(response.success) {
				resolve(response);
			} else {
				reject(response.message);
			}
		}, 'json').fail($.ajaxRetryCallback(e => {
			reject((e && e.status && `Ошибка ${e.status}`) || 'net::ERR_INTERNET_DISCONNECTED');
		}));

		onCancel(fn => request.abort());
	});
};

window.fetchRaw = function fetchRaw(url, data) {
	return new Bluebird(function(resolve, reject, onCancel) {
		let request = $.post(url, data, response => {
			if(response) {
				resolve(response);
			} else {
				reject('Не удалось получить данные');
			}
		}, 'json').fail($.ajaxRetryCallback(e => {
			reject((e && e.status && `Ошибка ${e.status}`) || 'net::ERR_INTERNET_DISCONNECTED');
		}));

		onCancel(fn => request.abort());
	});
};

window.jQuery.ajaxRetryCallback = function(callback) {
	return function(state, code) {
		let me = this;

		if(code != 'abort') {
			me.tryCount = me.tryCount || 0;

			if(++me.tryCount < 5) {
				setTimeout(function() {
					jQuery.ajax(me).fail(jQuery.ajaxRetryCallback(callback));
				}, 200);

				return;
			}

			callback.apply(this, arguments);
		}
	};
};
window.jQuery.ajaxRetry = jQuery.ajaxRetryCallback(fn => alert('Произошла ошибка, попробуйте обновить страницу'));
