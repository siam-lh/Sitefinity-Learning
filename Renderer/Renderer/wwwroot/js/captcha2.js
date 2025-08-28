(function () {
    window.onloadCallback = renderCaptcha;

    document.addEventListener('widgetLoaded', function (args) {
        if (args.detail.model.Name === "Captcha2") {
            renderCaptcha();
        }
    });

    function renderCaptcha() {
        grecaptcha.render('captchav2', {
            'sitekey': "6LfRPLQrAAAAAHeq2iG_nVGzmrZAR80k-8atDI8I"
        });
    }
})();