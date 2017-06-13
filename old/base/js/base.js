var regExtended = /[^A-Za-z0-9ĄĆĘŁŃÓŚŻŹąćęłńóśżź., -]/g;
var checkWhichPage = function () {
    var addr = window.location.href;
    addr = addr.substring(addr.lastIndexOf('/') + 1, addr.length);
    if (addr.length != 0) {
        $('#verticalBar li a').each(function () {
            var a = $(this).attr('href');
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
        var text = $(this).text();
        if (text.length >= 25) {
            var words = text.split(' '), formattedText = '';
            for (var i = 0; i < words.length; i++) {
                if ((formattedText.length + words[i].length >= 25) && i != words.length-1 && i != 0 && words[i].length == 1) {
                    formattedText += words[i] + '&nbsp;';
                } else {
                    formattedText += words[i] + ' ';
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
    $('#searchIcon').on('click', function() {
        $('#verticalBar #inputWrapper input').focus();
    });
    $('#verticalBar #inputWrapper input').on('input', function () {
        $(this).val($(this).val().replace(regExtended, ''));
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
        $('body').addClass('noscroll');
    } else {
        $('#mask').fadeOut('slow');
        $('body').removeClass('noscroll');
    }
}

var flag = 0;

var toggleMenu = function () {
    setHorizontalMenuHeight();
    if (flag == 0) {
        flag = 1;
        $('#moreButton').click(function () {
            $('#verticalBar').toggle("slide", "slow", mask());
        });
        $('#returnArrow').click(function () {
            $('#verticalBar').toggle("slide", "slow", mask());
        });
        Hammer(document.body).on("swiperight", function(e) {
            if ($('.msgDetails').css('display') !== 'block' && $('#moreButton').css('display') === 'block' && !$('#verticalBar').is(':visible')) {
                $('#verticalBar').toggle("slide", "slow", mask());
            }
        });
        Hammer(document.body).on("swipeleft", function() {
            if ($('.msgDetails').css('display') !== 'block' && $('#moreButton').css('display') === 'block' && $('#verticalBar').is(':visible')) {
                $('#verticalBar').toggle("slide", "slow", mask());
            }
        });
    }
};

var detectScroll = function () {
    if ($('#moreButton').css('display') == 'block' && $('#horizontalBar #menu').css('float') !== 'right') {
        $(window).scroll(function () {
            if ($(this).scrollTop() > 0) {
                $('#horizontalBar').css('height', '45px');
                $('#horizontalBar #menu').hide();
                $('#main #content').css('margin-top', '90px');
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
    if ($('#moreButton').css('display') == 'block') {
        $('#verticalBar #sideMenu').css('height', ($(window).outerHeight(true)) - $('#inputWrapper').outerHeight(true));
    } else if ($('#moreButton').css('display') == 'none') {
        $('#verticalBar #sideMenu').css('height', ($(window).outerHeight(true)) - $('#horizontalBar').outerHeight(true) - $('#inputWrapper').outerHeight(true));
    }
    detectScroll();
};

var mobileFeatures = function () {
    if ($('#moreButton').css('display') == 'block') {
        $('#verticalBar').css('display', 'none');
        if ($('#mask').css('display') == 'block') {
            $('#verticalBar').css('display', 'block');
        }
        $('#main #content').css('margin-top', '90px');
        toggleMenu();
        detectScroll();
    } else {
        $(window).unbind('scroll');
        $('#mask').css('display', 'none');
        $('#verticalBar').css('display', 'inline');
        $('#horizontalBar').css('height', '45px');
        $('#horizontalBar #menu').show();
        $('#main #content').css('margin-top', '45px');
    }
    if ($('#horizontalBar #menu').css('float') === 'right') {
        $('#horizontalBar').css('height', '45px');
        $('#main #content').css('margin-top', '45px');
    }
}

$(window).resize(function () {
    mobileFeatures();
});

$(document).ready(function () {
    $('[data-toggle="popover"]').popover();
    setHorizontalMenuHeight();
    checkWhichPage();
    addLineBreaks();
    activeSearch();
    closePopover();
    mobileFeatures();
    var numberOfNotifications = Math.floor((Math.random() * 100));
    /* Liczba powiadomień dla danego użytkownika; na razie to jakaś losowa wartość. */
    if (numberOfNotifications > 0) {
        $('#alertSquare').css('display', 'inline').html(numberOfNotifications);
    }
});