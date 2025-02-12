const onLoad = () => {
  const imgLoading = new ImgLoadingLibrary.ImgLoading();
  imgLoading.init("[img-loading]", {
    container: document.body,
    intersectionObserverConfig: {
      threshold: 0.5,
    },
  });
};

window.addEventListener("load", onLoad);
