import _debounce from 'lodash.debounce'

class Video {
	constructor(options) {
		this.elem = options.elem
		this.videoElems = this.elem.find('video')
		this.mup = $('body').data('mup')
		this.inited = false
		//Изначально у видео нет атрибута src, чтобы они не грузились на моб версии
		this.checkVideo()
		$(window).on('resize', _debounce(this.checkVideo.bind(this), 400))
	}

	checkVideo() {
		if(this.inited) return
		if($(window).width() < this.mup) return
		this.videoElems.each((index, elem) => {
			$(elem).attr('src', $(elem).data('src'))
		})
		this.inited = true
	}
}

$(document).ready(() => {
	$(document).each((index, elem) => {
		new Video({elem: $(elem)})
	})
})