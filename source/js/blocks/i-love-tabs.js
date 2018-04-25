class IloveTabs {
	constructor(options) {
		this.elem = options.elem
		this.tabElems = this.elem.find('.ct-tc-tabs a')
		this.contentElems = this.elem.find('.tab-content')
		this.activeTab = this.tabElems.filter('.__active')

		this.elem.click((event) => {
			let tab = $(event.target).closest('.ct-tc-tabs a')
			if (tab.length) {
				this.showTab(tab)
				return false
			}
		})

		//Чтобы не было выделения
		this.elem.mousedown(event => {
			let tab = $(event.target).closest('.ct-tc-tabs a')
			if (tab.length) {
				event.preventDefault()
			}
		})
	}

	showTab(tab) {
		if (!tab.data('target')) return
		if (tab.is(this.activeTab)) return

		let contentElem = this.contentElems.filter(tab.data('target'))
		let oldContentElem = this.contentElems.filter(this.activeTab.data('target'))

		//Добавляем/убираем первым класс задержки и добавляем/убираем классы по отдельности
		//иначе нарушается плавность
		contentElem
			.addClass('__delayed')
			.addClass('__active')
		oldContentElem.not(contentElem)
			.removeClass('__delayed')
			.removeClass('__active')

		tab.addClass('__active')
		this.activeTab = tab
		this.tabElems.not(tab).removeClass('__active')
	}
}

$(document).ready(() => {
	$('section.i-love').each((index, elem) => {
		new IloveTabs({elem: $(elem)})
	})
})
