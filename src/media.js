import Promise from 'promise';
import cfg from './config';

export default {
    init() {
        return new Promise((resolve, reject) => {
            if (!navigator.getUserMedia) {
                return reject();
            }

            navigator.getUserMedia(
                {
                    video: {
                        mandatory: {
                            maxWidth: cfg.mediaWidth,
                            maxHeight: cfg.mediaHeight,
                            minFrameRate: cfg.mediaMinFrameRate
                        }
                    },
                    audio: true
                },
                (localMediaStream) => {
                    // Acquired
                    this.localMediaStream = localMediaStream;
                    resolve(localMediaStream);
                },
                reject);
        });
    },

    hasLocalVideo() {
        return this.localMediaStream.getVideoTracks().length > 0;
    },

    hasLocalAudio() {
        return this.localMediaStream.getAudioTracks().length > 0;
    },

    playLocalStream() {
        let video = $('#localvideo').get(0);
        this.playStream(this.localMediaStream, video);

        let started = false;
        video.addEventListener('canplay', unused_ev => {
            if (!started && (video.videoHeight || video.videoWidth)) {
                started = true;

                video.width = cfg.localMediaWidth;
                video.height = video.videoHeight /
                    (video.videoWidth / cfg.localMediaWidth);

                $('#localvideopanel').show('slow');
            }
        }, false);
    },

    configureRemoteStream(remoteMediaStream) {
        this.remoteMediaStream = remoteMediaStream;

        let video = document.createElement('video');
        this.playStream(remoteMediaStream, video);

        return video;
    },

    playStream(mediaStream, video) {
        video.autoplay = true;

        // Handle older Firefox oddities
        if (navigator.mozGetUserMedia) {
            video.mozSrcObject = mediaStream;
        } else {
            video.srcObject = mediaStream;
        }
    }
};
