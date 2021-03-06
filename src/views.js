import Promise from 'promise';

import routes from './routes';

export default {
    init() {
        this.mobileDetect = new MobileDetect(window.navigator.userAgent);
        let cls = this.mobileDetect.mobile() ? 'endgame-mobile' : 'endgame-nonmobile';
        $(document.body).addClass(cls);
    },

    showWaitScreen(gameId, currentQuality, toggleQualityFn) {
        this.waitScreen = new Vue({
            el: '#waitscreen',
            data: {
                link: routes.genGameUrl(gameId),
                quality: currentQuality
            },
            methods: {
                onClick(e) {
                    let select = window.getSelection();
                    let range = document.createRange();
                    range.selectNodeContents(e.target);
                    select.addRange(range);
                },
                onFullscreen(unused_e) {
                    window.requestFullscreen();
                    window.lockScreenOrientation('landscape-primary');
                },
                toggleQuality() {
                    this.quality = this.quality === 'high' ? 'low' : 'high';
                    toggleQualityFn();
                }
            }
        });

        $('#waitscreen').modal({
            backdrop: false,
            keyboard: false
        });

        return Promise.resolve();
    },

    showMediaScreen() {
        $('#waitscreen').modal('hide');
        $('#footer').hide('slow');

        $('#mediascreen').modal({
            backdrop: false,
            keyboard: false
        });

        return Promise.resolve();
    },

    showStatusScreen(capturedPieces, currentQuality, toggleQualityFn) {
        $('#mediascreen').modal('hide');
        $('#footer').hide('slow');

        this.statusScreen = new Vue({
            el: '#statusscreen',
            data: {
                colors: ['white', 'black'],
                pieces: ['pawn', 'knight', 'bishop', 'rook', 'queen'],
                capturedPieces: capturedPieces,
                quality: currentQuality
            },
            methods: {
                toggleQuality() {
                    this.quality = this.quality === 'high' ? 'low' : 'high';
                    toggleQualityFn();
                },
                fullscreen() {
                    window.requestFullscreen();
                    window.lockScreenOrientation('landscape-primary');
                },
                fullscreenExit() {
                    window.exitFullscreen();
                }
            }
        });
        $('#statusscreen').show('slow');
        $('.help-icon').popover()
            // Add a custom class so that we can mess with the styles. :(
            .data('bs.popover').tip().addClass('help-popover');

        return Promise.resolve();
    },

    showPromotionScreen(color) {
        return new Promise((resolve, unused_reject) => {
            let onClick = (piece, e) => {
                e.preventDefault();
                $('#promotionscreen').modal('hide');
                this.promotionScreen.$destroy();
                // TODO: Move this to config, and use the reverse-mapping in scene.js
                let promotion =
                    ({'queen': 'q', 'rook': 'r', 'bishop': 'b', 'knight': 'n'})[piece];
                resolve(promotion);
            };

            this.promotionScreen = new Vue({
                el: '#promotionscreen',
                data: {
                    color: color,
                    pieces: ['queen', 'rook', 'bishop', 'knight']
                },
                methods: {
                    onClick: onClick
                }
            });

            $('#promotionscreen').modal({
                backdrop: 'static',
                keyboard: false
            });
        });
    },

    showGameEndScreen(reason) {
        this.gameEndScreen = new Vue({
            el: '#gameoverscreen',
            data: {
                reason: reason
            }
        });

        // Delay display of end screen.
        setTimeout(() => {
            $('#gameoverscreen').addClass('transition-in');
            setTimeout(() => $('#gameoverscreen').addClass('transition-out'), 4500);
        }, 1000);
    },

    showMessage(title, msg, type = null) {
        if (this.messageScreen) {
            this.messageScreen.$destroy();
        }

        this.messageScreen = new Vue({
            el: '#messagescreen',
            data: {
                title,
                msg,
                type
            }
        });

        $('#messagescreen').modal({
            backdrop: 'static',
            keyboard: false
        });
    },

    showAlert(msg, title = '', type = 'info', timeout = 5000) {
        toastr[type](msg, title, {timeOut: timeout});
    }
};
