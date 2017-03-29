new Clipboard('.color-droplet')

function like() {
  $('.heart').click(function(e) {
    $(this).addClass('is-disabled')
    e.preventDefault()
    $('.count', this).text(parseInt($('.count', this).text()) + 1)
  })
}

function main() {
  like()
}
$(document).ready(main)

