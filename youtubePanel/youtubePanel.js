    var YoutubePanel = Backbone.View.extend({
        el: $(document),
        initialize: function () {
            var self = this;
            $(self.el).on('click', '.lite a', function () {
                var $dv = $(this.parentNode.parentNode);
                var playWidth = $dv.data('playwidth'),
                    playHeight = $dv.data('playheight'),
                    minimode = $dv.data('minimode');
                var turnOnControl = (minimode) ? 0 : 1;
                var embedContent =
                    "<embed src=\"https://www.youtube.com/v/" + $dv.attr('id') +
                    "?controls=" + turnOnControl +
                    "&autohide=1&version=3&autoplay=1&theme=light\" type=\"application/x-shockwave-flash\" width=\"" + $dv.data('playwidth') +
                    "\" height=\"" + $dv.data('playheight') +
                    "\" allowscriptaccess=\"always\" allowfullscreen=\"true\"></embed>";
                $dv.html(embedContent);
            });
            //self.render();
        },
        render: function (element, callback) {
            var self = this,
                liteDivs = null;
            if (element) { 
                liteDivs = $(element).find('div.lite');
            }else{
                liteDivs = $('div.lite');
            }
            
            for (var i = 0; i < liteDivs.length; i++) {
                var myDiv = liteDivs[i];
                var $dv = $(myDiv);
                var vid = myDiv.id,
                    w = myDiv.style.width,
                    h = myDiv.style.height,
                    miniMode = $dv.data('minimode');

                if ($dv.data('rendered')) continue;
                var img = $(document.createElement('img'));
                img.attr({ 'class': 'lazy',
                    //'data-original': 'http://img.youtube.com/vi/' + vid + '/0.jpg',
                    'src': 'http://img.youtube.com/vi/' + vid + '/0.jpg'
                });
                if (miniMode) {
                    img.css({
                        'position': 'relative',
                        'top': '0',
                        'left': '0',
                        'border-radius': '0px',
                        '-webkit-border-radius': '0px',
                        'box-shadow': 'none',
                        'width': w,
                        //'height': h,
                        'opacity': .85,
                        'margin-top': '-25px',
                        'margin-bottom': '-30px'
                    });
                } else {
                    img.css({
                        'position': 'relative',
                        'top': '0',
                        'left': '0',
                        'border-radius': '0px',
                        '-webkit-border-radius': '0px',
                        'box-shadow': 'none',
                        'width': w,
                        'height': h
                    });
                }

                var mask = $(document.createElement('p'));
                mask.addClass('lite crop');
                mask.css({
                    'overflow': 'hidden',
                    'margin': '5px 0 0 0'
                });

                var a = $(document.createElement('a'));
                a.css({ 'padding': '0px', 'background-color': '#fff' });
                a.href = '#';
                a.append(img, '<img class="lite" src="http://lh4.googleusercontent.com/-QCeB6REIFlE/TuGUlY3N46I/AAAAAAAAAaI/9-urEUtpKcI/s800/youtube-play-button.png" style="position: absolute; top: 45%; left: 43%;width:40px;" />');

                if (miniMode) {
                    $dv.css('height', '');
                    $dv.append(mask.append(a));
                } else
                    $dv.append(mask.append(a));

                if (!miniMode) {
                    $.ajax({
                        url: 'http://gdata.youtube.com/feeds/api/videos/' + vid + '?v=2&fields=id,title&alt=json',
                        dataType: 'json',
                        success: function (data) {
                            var id = data.entry.id.$t.split(':')[3];
                            var selector = 'div[id=' + id + '][data-minimode=false]';
                            $(selector).append('<div style="position:relative;margin:-' + h + ' 5px;padding:5px;background-color:rgba(0,0,0,0);-moz-border-radius:0px;-webkit-border-radius:0px;border-radius:0px"><span style="line-height:.7em;color:rgb(200,200,200);text-align:left;text-shadow:none">' + data.entry.title.$t + '</span></div>');
                        }
                    });
                }
                $(myDiv).data('rendered', true);
            }
            if (callback) callback();
        }
    });
