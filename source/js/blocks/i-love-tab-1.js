import Payment from '@/components/payment'
import Range from '@/components/range'
import Refresh from '@/components/refresh'

class ILoveTab1 {
	constructor(options) {
		this.elem = options.elem
		this.paymentElem = this.elem.find('.payment-component')
		this.payment = new Payment({elem: this.paymentElem})
		this.rangeElem = this.elem.find('.range-component')
		this.range = new Range({elem: this.rangeElem})
		this.refreshElem = this.elem.find('.refresh-component')
		this.refresh = new Refresh({elem: this.refreshElem})
		this.mediaElems = this.elem.find('.media')

		this.rangeElem.on('rc:dragend', (event, value) => {
			let textValue = this.numValToText(value)
			this.payment.setValue(textValue)
			this.refresh.setValue(textValue)
			this.setMedia(textValue)
		})

		this.refreshElem.on('rc:change', (event, value) => {
			this.payment.setValue(value)
			this.range.setValue(this.textValToSum(value))
			this.setMedia(value)
		})
	}

	textValToSum(textValue) {
		if (textValue === 'tai') return 4.0
		if (textValue === 'goa') return 2.8
		if (textValue === 'ams') return 4.8
	}

	numValToText(numVal) {
		if (numVal <= 2.8) return 'goa'
		if (numVal > 2.8 && numVal < 4.8) return 'tai'
		if (numVal >= 4.8) return 'ams'
	}

	setMedia(textValue) {
		let current = this.mediaElems.filter(`[data-value='${textValue}']`)
		this.mediaElems.not(current).removeClass('__active')
		current.addClass('__active')
	}
}

$(document).ready(() => {
	$('section.i-love .tab-content.__1').each((index, elem) => {
		new ILoveTab1({elem: $(elem)})
	})
})