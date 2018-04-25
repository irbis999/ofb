class Payment {
	constructor(options) {
		this.elem = options.elem
		this.busy = false
		this.activeElem = null
		this.nextElem = null
		this.allElems = this.elem.find('.ct-pc-elem')
	}

	animate(value = null) {
		if(this.busy) return
		this.busy = true

		this.activeElem = this.elem.find('.ct-pc-elem.__active')
		this.nextElem = this.activeElem.next('.ct-pc-elem')
		if(!this.nextElem.length) {
			this.nextElem = this.elem.find('.ct-pc-elem').first()
		}
		if(value) {
			this.nextElem = this.elem.find(`.ct-pc-elem[data-value='${value}']`)
		}

		this.activeElem.css('animation', 'fly-top .5s forwards')
		this.nextElem.css('animation', 'appear-bottom .5s forwards')
		this.elem.on('animationend', () => this.reset())
	}

	reset() {
		this.activeElem.removeClass('__active')
		this.nextElem.addClass('__active')
		this.allElems.css('animation', 'none')
		this.busy = false
	}

	setValue(value) {
		if(this.elem.find('.ct-pc-elem.__active').data('value') === value) {
			return
		}
		this.animate(value)
	}
}

export default Payment

$(document).ready(() => {
	$('.payment-component:not(.__no-init)').each((index, elem) => {
		new Payment({elem: $(elem)})
	})
})