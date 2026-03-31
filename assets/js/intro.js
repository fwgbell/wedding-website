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

    seal.addEventListener("click", function () {
      seal.disabled = true;

      var video = document.createElement("video");
      video.className = "intro-video";
      video.src = "assets/images/drone - Trim.mp4";
      video.setAttribute("playsinline", "");
      video.playsInline = true;
      video.preload = "auto";

      seal.classList.add("intro-seal--cracked");

      setTimeout(function () {
        flap.classList.add("intro-flap--open");
      }, 400);

      setTimeout(function () {
        fade.classList.add("intro-fade--active");
      }, 1100);

      setTimeout(function () {
        envelope.style.display = "none";
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
