// Подключаем спрайт
$(document).ready(function () {
	$.get($('body').data('sprite-path'), (data) => {
		let div = document.createElement('div')
		div.style.width = '0'
		div.style.height = '0'
		div.style.overflow = 'hidden'
		div.innerHTML = new XMLSerializer().serializeToString(data.documentElement)
		document.body.insertBefore(div, document.body.childNodes[0])
	})
})