import gifsicle from 'https://unpkg.com/gifsicle-wasm-browser@1.5.16/dist/gifsicle.min.js';

// man page https://www.manpagez.com/man/1/gifsicle/gifsicle-1.52.php

function InitNormGif() {
  let __image, __url;

  function loadGifFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/gif';

    input.onchange = function (e) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = function () {
        __image = new Image();
        __image.src = reader.result;
        document.body.appendChild(__image);

        transformGif(file);
      };

      reader.readAsDataURL(file);
    };

    input.click();
  }

  function transformGif(file) {
    gifsicle
      .run({
        input: [
          {
            file,
            name: 'input.gif',
          },
        ],
        command: [ // -e -U
          `-O2 --use-colormap web --color-method blend-diversity --dither
          input.gif -o /out/frame.gif`,
        ],
      })
      .then(async (outfiles) => {
        const out = document.querySelector('#out');
        out.innerHTML = '';

        __url = URL.createObjectURL(outfiles[0]);
        out.insertAdjacentHTML('beforeend', `<br/><br/><span><img src="${__url}"></span>`);
      });
  }

  function saveGifFile() {
    const link = document.createElement('a');

    link.href = __url;
    link.download = 'output.gif';

    link.click();
  }

  window.loadGifFile = loadGifFile;
  window.saveGifFile = saveGifFile;
  window.transformGif = transformGif;
}

InitNormGif();