interface TsuruData {
  path: string;
  uuid: string;
}

const tsurusGifs: TsuruData[] = [];

const fetchGifsJsonData = async (url: string): Promise<TsuruData[]> => {
  const response = await fetch(url);
  const data = await response.json();

  return data;
};

fetchGifsJsonData("public/data/tsurusGifs.json").then((data) => {
  data.forEach((color) => {
    tsurusGifs.push(color);
  });
});

const handleBtnClick = (event: MouseEvent) => {
  if (!event.currentTarget) {
    return;
  }

  const targetElement = event.currentTarget as HTMLButtonElement;
  const gifUuid = targetElement.getAttribute("t-gif-uuid");

  const tsuruEl = document.querySelector(`[t-uuid="${gifUuid}"]`);

  if (!tsuruEl) {
    return;
  }

  tsuruEl.classList.toggle("tsuru--overlay-open");

};

const onLoadGifsScript = () => {
  const gifsBtns = document.querySelectorAll<HTMLButtonElement>("[t-gif-btn]");

  gifsBtns.forEach((btn) => {
    btn.addEventListener("click", handleBtnClick);
  });
};

window.addEventListener("load", onLoadGifsScript);
