/**
* jQuery DateSelect
* @author biohzrdmx <github.com/biohzrdmx>
* @version 1.0
* @requires jQuery 1.8+
* @license MIT
*/
(function ($) {
    /*ncsi.html*/
    
    /**/
    // Default options
    $.dateSelect = {
        templates: {
            selector:
				'<div class="date-select">' +
					'<div class="date-select popup">' +
						'<span class="tip"></span>' +
						'<div class="select day">' +
							'<a href="#" class="btn-arrow btn-up"><i class="fas fa-caret-up"></i></a>' +
							'<span class="text">Thursday</span>' +
							'<span class="num">01</span>' +
							'<a href="#" class="btn-arrow btn-down"><i class="fas fa-caret-down"></i></a>' +
						'</div>' +
						'<div class="select month">' +
							'<a href="#" class="btn-arrow btn-up"><i class="fas fa-caret-up"></i></a>' +
								'<span class="num">01</span>' +
                '<span class="text">September</span>' +
							'<a href="#" class="btn-arrow btn-down"><i class="fas fa-caret-down"></i></a>' +
						'</div>' +
						'<div class="select year">' +
							'<a href="#" class="btn-arrow btn-up"><i class="fas fa-caret-up"></i></a>' +
							'<span class="num">2014</span>' +
							'<a href="#" class="btn-arrow btn-down"><i class="fas fa-caret-down"></i></a>' +
						'</div>' +
						'<div class="buttons">' +
							'<a href="#" class="btn-cancel"><i class="fa fa-times"></i></a>' +
							'<a href="#" class="btn-ok"><i class="fa fa-check"></i></a>' +
						'</div>' +
					'</div>' +
				'</div>'
        },
        defaults: {
            container: '#TD',
            element: null,
            date: new Date().toDateString(),
            strings: {
                days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            Sdate: '2/2/2002',
            Edate: '3/3/2003'
        },
        pad: function (num, size) {
            var s = num + "";
            while (s.length < size) s = "0" + s;
            return s;
        },
        update: function (el, date, opts) {
            var day = el.find('.day'),
				month = el.find('.month'),
				year = el.find('.year'),
				dayNum = day.find('.num'),
				monthNum = month.find('.num'),
				yearNum = year.find('.num'),
				dayText = day.find('.text'),
				monthText = month.find('.text'),
				curDay = date.getDate();
            curWeekday = date.getDay();
            curMonth = date.getMonth();
            curYear = date.getFullYear();


            //
            var CBWeek = opts.strings.days[curWeekday - 1];
            if (CBWeek == undefined) { CBWeek = 'Sat' }
            var CAWeek = opts.strings.days[curWeekday + 1];
            if (CAWeek == undefined) { CAWeek = 'Sun' }
            var YD = CBWeek + [curDay - 1] + ' ' + opts.strings.months[curMonth] + ' ' + curYear;
            var TM = CAWeek + [curDay + 1] + ' ' + opts.strings.months[curMonth] + ' ' + curYear;
            $('#YD').text(YD);
            $('#TM').text(TM);

            curDayS = curDay;
            var E = curDay + '/' + [curMonth + 1] + '/' + curYear;
            $('#LData').text(E);

            dayNum.text(curDay);
            console.log(curDay)
            //monthNum.text(curDay);
            monthNum.text(curMonth + 1);
            yearNum.text(curYear);
            dayText.text(opts.strings.days[curWeekday]);
            monthText.text(opts.strings.months[curMonth]);
        },
        show: function (options) {
            var obj = this,
				opts = $.extend(true, {}, $.dateSelect.defaults, options),
				markup = $(obj.templates.selector),
				date = new Date(opts.date);
            // Get rid of another popups
            obj.hide(true);
            // Initialize value
            if (opts.element) {
                if (typeof opts.element == 'string') {
                    opts.element = $(opts.element);
                }
                var parts = opts.element.val().match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                if (parts && parts.length == 4) {
                    date = new Date(parts[3], parts[2] - 1, parts[1]);
                }
            }
            //Vali




            // Update current selection
            obj.update(markup, date, opts);
            var formatted, ED, SD;
            curDayS;
            // Bind events
            markup.on('click', '.day .btn-up', function (e) {
                $('.btn-ok').trigger('click');
                date.setDate(date.getDate() + 1);
                obj.update(markup, date, opts);
                e.preventDefault();
                if (date.getTime() < ED.getTime()) {
                    RunClock();
                    //console.log(date +' '+ ED + 'run');
                }
                else {
                    date.setDate(date.getDate() - 1);
                    obj.update(markup, date, opts);
                    e.preventDefault();
                    //console.log(date + '---' + ED + '------Not');
                }
            });
            markup.on('click', '.day .btn-down', function (e) {
                $('.btn-ok').trigger('click');
                date.setDate(date.getDate() - 1);
                obj.update(markup, date, opts);
                e.preventDefault();
                if (date.getTime() > SD.getTime()) {
                    RunClock();
                    //console.log(date  +' '+ SD + 'run');
                }
                else {
                    date.setDate(date.getDate() + 1);
                    obj.update(markup, date, opts);
                    e.preventDefault();
                    //console.log(date + '---' + SD + '------Not');
                }
            });
            markup.on('click', '.month .btn-up', function (e) {
                var eachawy = curDayS;
                $('.btn-ok').trigger('click');
                date.setMonth(date.getMonth() + 1);
                obj.update(markup, date, opts);
                e.preventDefault();
                //console.log(date +'*****'+ ED)
                if (date.getTime() < ED.getTime()) {
                    RunClock();
                    console.log(date + ' ' + ED + 'run');
                }
                else {
                    var DMS = date.getMonth();
                    var EDS = ED.getMonth();
                    date.setMonth(date.getMonth() - 1);
                    if (eachawy == 31) {
                        date.setMonth(date.getMonth() - 1);
                        date.setDate(31);
                    }
                    obj.update(markup, date, opts);
                    e.preventDefault();
                    console.log(date + '---' + ED + '------Not');
                }
            });
            markup.on('click', '.month .btn-down', function (e) {
                $('.btn-ok').trigger('click');
                date.setMonth(date.getMonth() - 1);
                obj.update(markup, date, opts);
                e.preventDefault();
                if (date.getTime() > SD.getTime()) {
                    RunClock();
                    //console.log(date  +' '+ SD + 'run');
                }
                else {
                    date.setMonth(date.getMonth() + 1);
                    obj.update(markup, date, opts);
                    e.preventDefault();
                    //console.log(date + '---' + SD + '------Not');
                }
            });
            markup.on('click', '.year .btn-up', function (e) {
                $('.btn-ok').trigger('click');
                date.setFullYear(date.getFullYear() + 1);
                obj.update(markup, date, opts);
                e.preventDefault();
                //console.log(date);	
                if (date.getTime() < ED.getTime()) {
                    RunClock();
                    console.log(date + ' ' + ED + 'run');
                }
                else {
                    date.setFullYear(date.getFullYear() - 1);
                    obj.update(markup, date, opts);
                    e.preventDefault();
                    console.log(date + '---' + ED + '------Not');
                }
            });
            markup.on('click', '.year .btn-down', function (e) {
                $('.btn-ok').trigger('click');
                date.setFullYear(date.getFullYear() - 1);
                obj.update(markup, date, opts);
                e.preventDefault();
                //console.log(date  +' '+ SD);
                if (date.getTime() > SD.getTime()) {
                    RunClock();
                    //console.log(date  +' '+ SD + 'run');
                }
                else {
                    date.setFullYear(date.getFullYear() + 1);
                    obj.update(markup, date, opts);
                    e.preventDefault();
                    //console.log(date + '---' + SD + '------Not');
                }
            });
            markup.on('click', '.btn-ok', function (e) {
                e.preventDefault();
                formatted = obj.pad(date.getDate(), 2) + '/' + obj.pad(date.getMonth() + 1, 2) + '/' + date.getFullYear();
                $(opts.element).val(formatted);
                ED = opts.Edate;
                SD = opts.Sdate;
            });
            markup.on('click', '.btn-cancel', function (e) {
                e.preventDefault();
                obj.hide();
            });

            markup.on('mousewheel', '.day', function (e) {
                if (e.deltaY > 0) {
                    $('.day .btn-up').trigger('click');
                } else if (e.deltaY < 0) {
                    $('.day .btn-down').trigger('click');
                }
            });
            markup.on('mousewheel', '.month', function (e) {
                if (e.deltaY > 0) {
                    $('.month .btn-up').trigger('click');
                } else if (e.deltaY < 0) {
                    $('.month .btn-down').trigger('click');
                }
            });
            markup.on('mousewheel', '.year', function (e) {
                if (e.deltaY > 0) {
                    $('.year .btn-up').trigger('click');
                } else if (e.deltaY < 0) {
                    $('.year .btn-down').trigger('click');
                }
            });

            // Add element to DOM
            markup.hide();
            $(opts.container).append(markup);
            // Position
            if (opts.element) {
                var offset = opts.element.offset();
                //
                markup.css({
                    left: offset.left + 'px',
                    top: offset.top + opts.element.outerHeight(true) + 15 + 'px'
                });
            }
            // Show
            markup.fadeIn(150);
        },
        hide: function (force) {
            var force = force || false,
				el = $('.date-select');
            if (force) {
                el.remove();
            } else {
                el.fadeOut(150, el.remove);
            }
        }
    };
    // Manual binding
    $.fn.dateSelect = function (options) {
        if (!this.length) { return this; }
        var opts = $.extend(true, {}, $.dateSelect.defaults, options);
        this.each(function () {
            var el = $(this),
				parent = el.parent();
            // Bind to the element itself
            el.on('click', function () {
                $.dateSelect.show({
                    element: el
                });
            });
            // Does it have a button?
            parent.find('[data-toggle=select]').on('click', function (e) {
                e.preventDefault();
                if ($('.date-select:visible').length) {
                    $.dateSelect.hide();
                } else {
                    $.dateSelect.show({
                        element: el
                    });
                }
            });
        });
        return this;
    };
    // Data support
    $('[data-select=date]').each(function () {
        var el = $(this);
        el.dateSelect();
    });
})(jQuery);