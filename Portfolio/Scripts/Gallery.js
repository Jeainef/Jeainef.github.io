

var imageThumbs = document.getElementById("image-thumbs");
var currentImage = document.getElementById("current-image");

for (var i = 1; i <= 7; i++) {
    var thumb = document.createElement("img");
    thumb.src = "Images/Gallery/Image_" + i + ".png";
    thumb.alt = "Image " + i;
    thumb.classList.add("thumb");
    imageThumbs.appendChild(thumb);


    thumb.addEventListener(
        "click", function () {
            currentImage.src = this.src;
            currentImage.alt = this.alt;
        }
    );
}

$(document).on('click', 'a[href^="#"]', function (event) {
    event.preventDefault();

    $('html, body').animate({
        scrollTop: $($.attr(this, 'href')).offset().top
    }, 500);
});
