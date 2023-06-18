import gifsicle from 'https://unpkg.com/gifsicle-wasm-browser@1.5.16/dist/gifsicle.min.js';
// import gifsicle from "gifsicle-wasm-browser";

function InitNormGif() {
  let __file, __image, __url;

  function loadGifFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/gif';

    input.onchange = function (e) {
      __file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = function () {
        __image = new Image();
        __image.src = reader.result;
        document.body.appendChild(__image);

        transformGif(__file);
      };

      reader.readAsDataURL(__file);
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
        command: [
          `-e -U -O2 --use-colormap web --color-method blend-diversity --dither
          input.gif -o /out/frame.gif`,
        ],
      })
      .then(async (outfiles) => {
        let out = document.querySelector('#out');
        out.innerHTML = '';

        const mergeInput = outfiles.map((file, i) => ({ file, name: `${i}.gif` }));
        const mergeCmd = '--merge' + mergeInput.reduce((names, f) => names + ' ' + f.name, '');
        gifsicle
          .run({
            input: mergeInput,
            command: [
              `${mergeCmd}
              -o /out/merged.gif`,
            ],
          })
          .then(async (mergedFile) => {
            __url = URL.createObjectURL(mergedFile[0]);
            out.insertAdjacentHTML('beforeend', `<br/><br/><span><img src="${__url}"></span>`);
          });
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