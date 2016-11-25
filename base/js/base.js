var checkWhichPage = function () {
    var addr = window.location.href;
    addr = addr.substring(addr.lastIndexOf('/') + 1, addr.length);
    if (addr.length != 0) {
        $('#verticalBar li a').each(function () {
            var a = $(this)[0].attributes[0].nodeValue;
            if (a == addr) {
                $(this).append('<div class="chosen"></div>');
            } else {
                $(this).children().remove();
            }
        });
    }
};

var addLineBreaks = function () {
    $('#verticalBar li a').each(function () {
        var text = $(this)[0].outerText;
        if (text.length >= 25) {
            var words = text.split(' '), formattedText = '';
            for (var i = 0; i < words.length; i++) {
                formattedText += words[i] + ' ';
                if ((formattedText.length + words[i].length >= 25) && i != words.length - 1) {
                    formattedText += '<br/>';
                }
            }
            if ($(this)[0].lastElementChild != null && $(this)[0].lastChild.className === "chosen") {
                $(this).html(formattedText + $(this)[0].lastElementChild.outerHTML);
            } else {
                $(this).html(formattedText);
            }
        }
    });
};

var activeSearch = function () {
    $('#verticalBar #inputWrapper input').on('input', function () {
        $('#verticalBar li').css({'border-top': '1px solid #6c6a65', 'border-bottom': '0'});
        $('#verticalBar li:last-child').css('border-bottom', '1px solid #6c6a65');
        var content = $(this).val().toLowerCase();
        var i = -1;
        $('#verticalBar li a').each(function () {
            var group = $(this)[0].outerText.toLowerCase();
            if (group.indexOf(content) !== -1) {
                $(this).css('display', 'block');
                i++;
            } else {
                $(this).css('display', 'none').parent().css('border', '0');
            }
        });
        $('#verticalBar li:visible:last').css('border-bottom', '1px solid #6c6a65');
    });
};

var mask = function () {
    if (!$('#mask').is(':visible')) {
        $('#mask').fadeIn('fast');
        $('#content').addClass('noscroll');
    } else {
        $('#mask').fadeOut('slow');
        $('#content').removeClass('noscroll');
    }
}

var swipe = function () {
    
    

}

var toggleMenu = function () {
    swipe();
    $('#returnArrow').css('display', 'inline');
    $('#moreButton').click(function () {
        $('#verticalBar').toggle("slide", mask());
    });
    $('#returnArrow').click(function () {
        $('#verticalBar').toggle("slide", mask());
    });
    var body = document.body;
    Hammer(body).on("swiperight", function() {
        if (!$('#verticalBar').is(':visible')) {
            $('#verticalBar').toggle("slide", mask());
        }
    });
    Hammer(body).on("swipeleft", function() {
        if ($('#verticalBar').is(':visible')) {
            $('#verticalBar').toggle("slide", mask());
        }
    });   
    setHorizontalMenuHeight();
};

var detectScroll = function () {
    if ($('#moreButton').is(':visible')) {
        $(window).scroll(function () {
            if ($(this).scrollTop() > 0) {
                $('#horizontalBar').css('height', '45px');
                $('#horizontalBar #menu').hide();
                $('#main #content').css('margin-top', '83px');
                $('[data-toggle="popover"]').popover('hide').data('bs.popover').inState.click = false;
            } else {
                $('#horizontalBar').css('height', '90px');
                $('#horizontalBar #menu').show();
                $('#main #content').css('margin-top', '90px');
            }
        });
    }
};

var closePopover = function () {
    $(document).click(function (e) {
        $('[data-toggle="popover"]').each(function () {
            if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                $(this).popover('hide').data('bs.popover').inState.click = false;
            }
        });
    });
};

var setHorizontalMenuHeight = function () {
    if ($('#moreButton').is(':visible')) {
        $('#verticalBar #sideMenu').css('height', ($(window).outerHeight(true)) - $('#inputWrapper').outerHeight(true));
    } else {
        $('#verticalBar #sideMenu').css('height', ($(window).outerHeight(true)) - $('#horizontalBar').outerHeight(true) - $('#inputWrapper').outerHeight(true));
    }
};

$(document).ready(function () {
    $('[data-toggle="popover"]').popover();
    setHorizontalMenuHeight();
    checkWhichPage();
    addLineBreaks();
    activeSearch();
    closePopover();
    if ($('#moreButton').is(':visible')) {
        toggleMenu();
        detectScroll();
    }
    var numberOfNotifications = Math.floor((Math.random() * 100));
    /* Liczba powiadomień dla danego użytkownika; na razie to jakaś losowa wartość. */
    if (numberOfNotifications > 0) {
        $('#alertSquare').css('display', 'inline').html(numberOfNotifications);
    }
});