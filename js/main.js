(function ($) {

    /* Init main variable */
    var gImageList = $('.gallery-image__list');
    var gThumbWrapper = $('.gallery-thumb__wrapper');
    var gThumbList = $('.gallery-thumb__list');
    /*END Init main variable */

    $('body').css('opacity', '0');

    /* Download image from yandex.fotki */
    $.ajax({
        type: "GET",
        url: 'http://api-fotki.yandex.ru/api/users/aig1001/album/63684/photos/?format=json',
        dataType: "jsonp",
        success: function (data) {
            var downloadImage = 25;
            // create dom elements with images
            for (var i = 0; i < downloadImage; i++) {
                gImageList.append('<div class="gallery-image__item"><img class="gallery-image__pic" src="' + data.entries[i].img.L.href + '" alt="' + data.entries[i].title + '" title="' + data.entries[i].title + '"></div>');
                gThumbList.append('<a href="#' + data.entries[i].created + '" class="gallery-thumb__item"><img class="gallery-thumb__pic" src="' + data.entries[i].img.XXS.href + '" alt="' + data.entries[i].title + '" title="' + data.entries[i].title + '"></a>');
            }
            gImageList.width(downloadImage * 100 + '%');
            $('.gallery-image__item').width(100 / downloadImage + '%');
            gThumbList.width(downloadImage * 96);
        },
        complete: function () {

            var glocHash = location.hash;
            if (glocHash) {
                var gLocHashImageFilter = $('.gallery-thumb__item[href="' + glocHash + '"]');
                var gLocHashImage = gLocHashImageFilter.index();
                var gLocHashImagePos = gLocHashImage * 100;
                var gSelected = gLocHashImage + 1;
                gLocHashImageFilter.addClass('selected');
                gImageList.css('left', '-' + gLocHashImagePos + '%');
                scrollThumbs(gSelected);

            } else {
                $('.gallery-thumb__item:first-child').addClass('selected');
            }

            $('.gallery-thumb__item').on('click', function () {
                $('.gallery-thumb__item.selected').removeClass('selected');
                $(this).addClass('selected');
                var gSelected = $(this).index() + 1;
                scrollThumbs(gSelected);
                gImageList.css('left', '-' + (gSelected - 1) * 100 + '%');
                gArrowPrevVer(gSelected);
                gArrowNextVer(gSelected);
            });
        }
    });
    /*END Download image from yandex.fotki */

    /* Change image with arrows */
    $('.gallery-prev').on('click', function (e) {

        var gSelected = $('.gallery-thumb__item.selected').index();
        gArrowPrevVer(gSelected);
        gArrowNextVer(gSelected);
        gImageList.css('left', '-' + (gSelected - 1) * 100 + '%');
        scrollThumbs(gSelected);
        $('.gallery-thumb__item.selected').removeClass('selected');
        $('.gallery-thumb__item:nth-child(' + gSelected + ')').addClass('selected');
        var glocHashPrev = $('.gallery-thumb__item.selected:nth-child(' + gSelected + ')').attr('href');
        $(this).attr('href', glocHashPrev);
    });

    $('.gallery-next').on('click', function (e) {

        var gSelected = $('.gallery-thumb__item.selected').index() + 1; // 2
        if (gSelected <= 0) {
            gSelected = 1;
        }
        var gSelectedNth = gSelected + 1;
        gImageList.css('left', '-' + (gSelected) * 100 + '%');
        $('.gallery-thumb__item.selected').removeClass('selected');
        $('.gallery-thumb__item:nth-child(' + gSelectedNth + ')').addClass('selected');
        scrollThumbs(gSelectedNth);
        gArrowPrevVer(gSelected);
        gArrowNextVer(gSelected + 1);
        var glocHashNext = $('.gallery-thumb__item.selected:nth-child(' + gSelectedNth + ')').attr('href');
        $(this).attr('href', glocHashNext);

    });
    /*END Change image with arrows */

    /* Init mousewheel */
    gThumbWrapper.bind('mousewheel', function (event, delta) {
        scrollThumbs(0, delta);
    });
    /*END Init mousewheel */


    /* Scroll thumbs */
    function scrollThumbs(gSelected, delta) {

        var gThumbWrapperWidth = gThumbWrapper.width(),
            gThumbListWidth = gThumbList.width(),
            gThumbItemWidth = 96,
            gThumbItemLastPos = gThumbWrapperWidth - gThumbListWidth,
            gScrollRate = 4,
            gSelected = gSelected || 0,
            gThumbListPos;
        if (gSelected > 0) {
            gThumbListPos = -((gThumbItemWidth * gSelected - gThumbWrapperWidth / 2) - 30);
        } else {
            gThumbListPos = parseInt(gThumbList.css('left')) + (delta > 0 ? gThumbItemWidth * gScrollRate : -gThumbItemWidth * gScrollRate);
        }

        if (gThumbListPos <= 0 && gThumbListPos > gThumbItemLastPos) {
            gThumbList.css('left', gThumbListPos);
        } else if (gThumbListPos > 0) {
            gThumbList.css('left', '0');
        } else {
            gThumbList.css('left', gThumbItemLastPos);
        }
    }

    /*END Scroll thumbs */

    /* Next, Previous link arrow */
    function gArrowPrevVer(selected) {

        if (selected <= 1) {
            $('.gallery-prev').css({
                'opacity': '0',
                'display': 'none'
            });
        } else {
            $('.gallery-prev').css({
                'opacity': '1',
                'display': 'block'
            });
        }
    }

    function gArrowNextVer(selected) {

        if (selected == $('.gallery-thumb__item').length) {
            $('.gallery-next').css({
                'opacity': '0',
                'display': 'none'
            });
        } else {
            $('.gallery-next').css({
                'opacity': '1',
                'display': 'block'
            });
        }
    }

    /*END Next, Previous link arrow */

    /* Show arrow on hover window browser */
    $('html')
        .mouseenter(function () {
            $('.gallery-prev, .gallery-next').show();
        })
        .mouseleave(function () {
            $('.gallery-prev, .gallery-next').hide();
        });
    /*END Show arrow on hover window browser */

    /* Preloader */
    $(window).load(function () {
        $('body').css({
            'opacity' : '1',
            'backgroundImage' : 'none'
        });

        $('.gallery-image__item').each(function () {
            $('.gallery-image__pic', this).css({
                marginTop: '-' + $('.gallery-image__pic', this).height() / 2 + 'px'
            });
        });

        $('.gallery-image__item').each(function () {
            $('.gallery-image__pic', this).css({
                maxHeight: $('.gallery-image__pic', this).height(),
                maxWidth: $('.gallery-image__pic', this).width(),
                height: '100%'
            });

        });
    });
    /*END Preloader */

    $(window).resize(function () {
        $('.gallery-image__item').each(function () {
            $('.gallery-image__pic', this).css({
                marginTop: '-' + $('.gallery-image__pic', this).height() / 2 + 'px'
            });
        });
    });

})(jQuery);