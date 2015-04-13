(function($) {
    var defParams = {
        autoreplay: true,
        container: null,
        sprite: null,
        frameWidth: undefined,
        frameCount: undefined,
        speed: 60,
        autostart: true,
        _timer: undefined,
        _frameCur: 0
        //spriteBuf: null,
        //doubleBuffered: false
    };
    $.fn.animateSprite = function(settings) {
        var params = $.extend({}, defParams, settings);
        if(!params.container)
            params.container = this;
        if(!params.sprite)
            params.sprite = this.children().first();
        var cssDisplay = params.sprite.css('display');
        if(cssDisplay === 'inline' || cssDisplay === 'none')
            params.sprite.css('display', 'inline-block');
        var cssPosition = params.container.css('position');
        if (cssPosition === 'static')
            params.container.css('position', 'relative');
        params.container.css('overflow', 'hidden');
        //Errors
        if(!params.frameWidth) {
            throw new Error('required frameWidth parameter');
        }
        if(!params.frameCount) {
            params.frameCount = Number((params.sprite.width() / params.frameWidth).toFixed());
        }

        var moveToNextFrame = '-=' + params.frameWidth;
        var animate = {};
        params._animate = animate;
        animate.params = params;
        animate.step = function step() {
            params.sprite.css('margin-left', moveToNextFrame);
        };

        animate.reset = function reset() {
            params.sprite.css('margin-left', 0);
            params._frameCur = 0;
        };
        animate.stop = function stop() {
            if (params._timer)
                clearInterval(params._timer);
        };
        animate.restart = function() {
            animate.stop();
            animate.reset();
            animate.start();
        }
        animate.start = function start() {
            stepFn = (function(params) {
                var wasParams = $.extend({}, params);
                return function() {
                    if(wasParams.speed !== params.speed) {
                        params._animate.restart();
                        return;
                    }
                    if(params._frameCur++ < (params.frameCount - 1))
                        params._animate.step();
                    else {
                        params._animate.reset();
                        if (!params.autoreplay) {
                            params._animate.stop();
                        }
                    }
                };
            })(params);
            params._timer = setInterval(stepFn, +(1000 * (params.frameCount / params.speed)).toFixed());
        }
        this.data('animate', animate);
        if(params.autostart)
            animate.start()
    };
})(jQuery);