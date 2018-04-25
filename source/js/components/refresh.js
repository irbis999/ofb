import _debounce from 'lodash.debounce'

class Refresh {
	constructor(options) {
		this.elem = options.elem
		this.busy = false
		this.activeElem = null
		this.nextElem = null
		this.allElems = this.elem.find('.refresh')
		this.noEmit = false

		this.elem.click(() => this.animate())
		//У нас 2 анимации срабатывают, обработаем только последнюю
		this.elem.on('animationend', _debounce(this.reset.bind(this), 150))
	}

	animate(value = null) {
		if(this.busy) return
		this.busy = true

		this.activeElem = this.elem.find('.refresh.__active')
		this.nextElem = this.activeElem.next('.refresh')
		if(!this.nextElem.length) {
			this.nextElem = this.elem.find('.refresh').first()
		}
		if(value) {
			this.nextElem = this.elem.find(`.refresh[data-value='${value}']`)
		}

		this.activeElem.css('animation', 'fly-top .5s forwards')
		this.nextElem.css('animation', 'appear-bottom .5s forwards')
	}

	reset() {
		if(!this.noEmit) {
			this.elem.trigger('rc:change', [this.nextElem.data('value')])
		}
		this.noEmit = false
		this.activeElem.removeClass('__active')
		this.nextElem.addClass('__active')
		this.allElems.css('animation', 'none')
		this.busy = false
	}

	setValue(value) {
		if(this.elem.find('.refresh.__active').data('value') === value) {
			return
		}
		this.noEmit = true
		this.animate(value)
	}
}

export default Refresh

$(document).ready(() => {
	$('.refresh-component:not(.__no-init)').each((index, elem) => {
		new Refresh({elem: $(elem)})
	})
})