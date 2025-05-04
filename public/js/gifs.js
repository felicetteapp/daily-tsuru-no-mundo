const tsurusGifs = [];
const fetchGifsJsonData = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

fetchGifsJsonData("public/data/tsurusGifs.json").then((data) => {
  data.forEach((color) => {
    tsurusGifs.push(color);
  });
});

const handleBtnClick = (event) => {
  const gifUuid = event.target.getAttribute("t-gif-uuid");

  const tsuruEl = document.querySelector(`[t-uuid="${gifUuid}"]`);

  tsuruEl.classList.toggle("tsuru--overlay-open");

  const tsuruGifEl = tsuruEl.querySelector(
    ".tsuru__overlay > [t-overlay-gif-image]"
  );

  const thisTsuruGifPath = tsurusGifs.find((g) => g.uuid === gifUuid).path;

  tsuruGifEl.src = thisTsuruGifPath;
};

const onLoadGifsScript = () => {
  const gifsBtns = document.querySelectorAll("[t-gif-btn]");

  gifsBtns.forEach((btn) => {
    btn.addEventListener("click", handleBtnClick);
  });
};

window.addEventListener("load", onLoadGifsScript);
