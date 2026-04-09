(function () {
  var STORAGE_KEY = "intro-played";
  var params = new URLSearchParams(window.location.search);
  if (!params.has("intro")) return;
  if (localStorage.getItem(STORAGE_KEY)) return;

  document.documentElement.classList.add("intro-active");

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    var overlay = document.createElement("div");
    overlay.className = "intro-overlay";
    overlay.innerHTML =
      '<div class="intro-envelope">' +
        '<div class="intro-envelope__body"></div>' +
        '<div class="intro-envelope__flap"></div>' +
        '<button class="intro-seal" aria-label="Open envelope">' +
          '<span class="intro-seal__ring"></span>' +
          '<span class="intro-seal__text">F &amp; F</span>' +
        '</button>' +
      '</div>' +
      '<div class="intro-fade"></div>';

    document.body.appendChild(overlay);

    var seal = overlay.querySelector(".intro-seal");
    var flap = overlay.querySelector(".intro-envelope__flap");
    var envelope = overlay.querySelector(".intro-envelope");
    var fade = overlay.querySelector(".intro-fade");

    function finishIntro() {
      localStorage.setItem(STORAGE_KEY, "true");
      fade.style.position = "fixed";
      document.body.appendChild(fade);
      overlay.remove();
      document.documentElement.classList.remove("intro-active");
      window.scrollTo(0, 0);
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          fade.classList.remove("intro-fade--active");
        });
      });
      var removeFade = function () {
        fade.removeEventListener("transitionend", removeFade);
        if (fade.parentNode) fade.remove();
      };
      fade.addEventListener("transitionend", removeFade);
      setTimeout(function () {
        if (fade.parentNode) fade.remove();
      }, 2000);
    }

    var CIRCLE_R = 40;
    var CIRCUMFERENCE = 2 * Math.PI * CIRCLE_R;

    function buildLoader() {
      var el = document.createElement("div");
      el.className = "intro-loader";
      el.innerHTML =
        '<svg class="intro-loader__svg" viewBox="0 0 100 100">' +
          '<circle class="intro-loader__track" cx="50" cy="50" r="' + CIRCLE_R + '"/>' +
          '<circle class="intro-loader__progress" cx="50" cy="50" r="' + CIRCLE_R + '"' +
            ' stroke-dasharray="' + CIRCUMFERENCE + '"' +
            ' stroke-dashoffset="' + CIRCUMFERENCE + '"/>' +
        '</svg>';
      return el;
    }

    function setLoaderProgress(loader, pct) {
      var circle = loader.querySelector(".intro-loader__progress");
      var offset = CIRCUMFERENCE * (1 - Math.min(pct, 1));
      circle.style.strokeDashoffset = offset;
    }

    seal.addEventListener("click", function () {
      seal.disabled = true;

      var video = document.createElement("video");
      video.className = "intro-video";
      video.src = "assets/images/drone - Trim.mp4";
      video.setAttribute("playsinline", "");
      video.playsInline = true;
      video.preload = "auto";

      var loader = buildLoader();
      var videoBuffered = false;
      var envelopeDone = false;
      var loaderVisible = false;
      var loaderShowTimer = null;

      seal.classList.add("intro-seal--cracked");

      setTimeout(function () {
        flap.classList.add("intro-flap--open");
      }, 400);

      setTimeout(function () {
        fade.classList.add("intro-fade--active");
      }, 1100);

      function updateBufferProgress() {
        if (!video.duration || !video.buffered.length) return;
        var pct = video.buffered.end(video.buffered.length - 1) / video.duration;
        setLoaderProgress(loader, pct);
      }

      video.addEventListener("progress", updateBufferProgress);
      video.addEventListener("loadeddata", updateBufferProgress);

      function startPlayback() {
        overlay.insertBefore(video, fade);

        function revealVideo() {
          setTimeout(function () {
            fade.classList.remove("intro-fade--active");
          }, 300);
        }

        var playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.then(revealVideo).catch(function () {
            video.muted = true;
            var retry = video.play();
            if (retry !== undefined) {
              retry.then(revealVideo).catch(function () {
                finishIntro();
              });
            } else {
              finishIntro();
            }
          });
        } else {
          revealVideo();
        }
      }

      function tryStartVideo() {
        if (!videoBuffered || !envelopeDone) return;

        if (loaderShowTimer) {
          clearTimeout(loaderShowTimer);
          loaderShowTimer = null;
        }

        if (!loaderVisible) {
          if (loader.parentNode) loader.remove();
          startPlayback();
        } else {
          setLoaderProgress(loader, 1);
          setTimeout(function () {
            loader.classList.add("intro-loader--hidden");
            setTimeout(function () {
              loader.remove();
              startPlayback();
            }, 400);
          }, 300);
        }
      }

      video.addEventListener("canplaythrough", function () {
        videoBuffered = true;
        tryStartVideo();
      });

      setTimeout(function () {
        envelope.style.display = "none";
        loader.classList.add("intro-loader--delayed");
        overlay.insertBefore(loader, fade);
        fade.classList.remove("intro-fade--active");
        envelopeDone = true;

        loaderShowTimer = setTimeout(function () {
          loaderVisible = true;
          loader.classList.remove("intro-loader--delayed");
        }, 1000);

        tryStartVideo();
      }, 1900);

      video.addEventListener("ended", function () {
        fade.classList.add("intro-fade--active");
        setTimeout(function () {
          finishIntro();
        }, 800);
      });

      video.addEventListener("error", function () {
        finishIntro();
      });
    });
  });
})();
