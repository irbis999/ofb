class Range {
	constructor(options) {
		this.elem = options.elem
		this.thumbContainerElem = this.elem.find('.ct-rc-thumb-container')
		this.thumbElem = this.elem.find('.ct-rc-thumb')
		this.textElem = this.elem.find('.ct-rc-text')
		this.min = +this.elem.data('min')
		this.max = +this.elem.data('max')
		this.sliderCoords = this.thumbCoords = this.shiftX = null
		this.busy = false

		this.thumbContainerElem.on('dragstart', () => false)

		this.thumbContainerElem.on('mousedown touchstart', (event) => {
			if(this.busy) return

			if (event.target.closest('.ct-rc-thumb')) {
				let clientX = event.clientX || event.originalEvent.touches[0].clientX
				this.startDrag(clientX)
				//Чтобы не было выделения
				return false
			}
		})

		this.onDocumentMouseMove = (event) => {
			let clientX = event.clientX || event.originalEvent.touches[0].clientX
			this.moveTo(clientX)
		}

		this.onDocumentMouseUp = () => this.endDrag()
	}

	startDrag(startClientX) {
		this.thumbCoords = this.thumbElem[0].getBoundingClientRect()
		this.shiftX = startClientX - this.thumbCoords.left
		this.sliderCoords = this.thumbContainerElem[0].getBoundingClientRect()

		$(document).on('mousemove touchmove', this.onDocumentMouseMove)
		$(document).on('mouseup touchend touchcancel', this.onDocumentMouseUp)
	}

	moveTo(clientX) {
		// вычесть координату родителя, т.к. position: relative
		let newLeft = clientX - this.shiftX - this.sliderCoords.left
		if (newLeft < 0) {
			newLeft = 0
		}
		let rightEdge = this.thumbContainerElem[0].offsetWidth - this.thumbElem[0].offsetWidth
		if (newLeft > rightEdge) {
			newLeft = rightEdge
		}
		this.thumbElem.css('left', `${newLeft}px`)
		let textValue = this.getValue()

		this.textElem.text(textValue)
		this.thumbContainerElem.trigger('rc:dragmove', [+textValue])
	}

	endDrag() {
		$(document).unbind('mousemove touchmove', this.onDocumentMouseMove)
		$(document).unbind('mouseup touchend touchcancel', this.onDocumentMouseUp)

		this.thumbContainerElem.trigger('rc:dragend', [+this.getValue()])
	}

	getValue() {
		let thumbBox = this.thumbElem[0].getBoundingClientRect()
		let elemBox = this.thumbContainerElem[0].getBoundingClientRect()
		let value = (thumbBox.left - elemBox.left) / (elemBox.right - elemBox.left)
		return (this.min * (1 - value) + this.max * value).toFixed(1)
	}

	setValue(value) {
		if(this.busy) return
		this.busy = true

		//Ставим бегунок
		let percents = (value - this.min) / (this.max - this.min)
		let box = this.thumbContainerElem[0].getBoundingClientRect()
		let left = (box.right - box.left) * percents
		let rightEdge = this.thumbContainerElem[0].offsetWidth - this.thumbElem[0].offsetWidth
		if (left > rightEdge) {
			left = rightEdge
		}

		//Анимируем текст
		let currentValue = +this.textElem.text()
		let delta = .1
		if(value < currentValue) {
			delta = -.1
		}
		let intNum =  Math.abs((value - currentValue) / delta)
		let intTime = 500 / intNum
		let num = 0
		let intervalId = setInterval(() => {
			if(value === currentValue) {
				clearInterval(intervalId)
				return
			}

			currentValue += delta
			this.textElem.text(currentValue.toFixed(1))

			//Дополнительная проверка на всякий случай, чтобы точно в бесконечность не попасть
			num++
			if(num >= intNum) {
				clearInterval(intervalId)
			}
		}, intTime)

		//Анимируем бегунок
		this.elem.addClass('__transition')
		this.thumbElem.css('left', `${left}px`)

		this.thumbElem.on('transitionend', () => {
			this.elem.removeClass('__transition')
			this.busy = false
		})
	}
}

export default Range

$(document).ready(() => {
	$('.range-component:not(.__no-init)').each((index, elem) => {
		new Range({elem: $(elem)})
	})
})
