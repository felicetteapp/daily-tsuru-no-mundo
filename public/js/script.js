let selectedTsuruUuid = null;
let isAnimatingModal = false;

const clearAllSelectedTsuru = () => {
  const tsuruImages = document.querySelectorAll(".tsuru--selected");
  tsuruImages.forEach((tsuruImage) => {
    tsuruImage.classList.remove("tsuru--selected");
  });
};


const handleCloseTsuruModal = () => {
  if(isAnimatingModal || selectedTsuruUuid === null){
    return;
  }
  isAnimatingModal = true;
  const tsuruImageEl = document.querySelector(
    `[il-uuid="${selectedTsuruUuid}"]`
  );

  const imgAspectRatio = tsuruImageEl.getAttribute("il-aspect-ratio");
  const imgSrc = tsuruImageEl.getAttribute("il-fullsize");
  const modalImgEl = document.querySelector(".modal__image");

  document.documentElement.style.setProperty(
    "--modal-img-src",
    `url(/${imgSrc})`
  );

  const positionOfTheTsuru = tsuruImageEl.getBoundingClientRect();
  const positionRelativeToViewport = {
    top: positionOfTheTsuru.top,
    left: positionOfTheTsuru.left,
    width: positionOfTheTsuru.width,
    height: positionOfTheTsuru.height,
  };

  const modalEl = document.querySelector(".modal");

  modalEl
    .animate(
      [
        {
          backgroundColor: "rgba(0, 0, 0, 1)",
        },
        {
          backgroundColor: "rgba(0, 0, 0, 0)",
        },
      ],
      {
        duration: 250,
        delay: 500,
        easing: "ease-out",
      }
    )
    .finished.then(() => {
      document.body.classList.remove("modal--open");
      selectedTsuruUuid = null;
      clearAllSelectedTsuru();
      isAnimatingModal = false;
    });

  const parsedAspectRatio = imgAspectRatio.split("/");
  const aspectRatio =
    Number(parsedAspectRatio[0]) / Number(parsedAspectRatio[1]);

  const expectedHeightFromAspectRatio =
    positionRelativeToViewport.width / aspectRatio;

  const heightDifference =
    expectedHeightFromAspectRatio - positionRelativeToViewport.height;

  const modalImgAnimation = modalImgEl.animate(
    [
      {
        top: "0",
        left: "0",
        width: "100dvw",
        height: "100dvh",
      },
      {
        top: `${positionRelativeToViewport.top - heightDifference / 2}px`,
        left: `${positionRelativeToViewport.left}px`,
        width: `${positionRelativeToViewport.width}px`,
        height: `${expectedHeightFromAspectRatio}px`,
      },
    ],
    {
      duration: 500,
      easing: "ease-out",
      fill: "forwards",
    }
  );

  modalImgAnimation.finished.then(() => {
    modalImgEl.style.backgroundSize = "cover";

    const secondModalImgAnimation = modalImgEl.animate(
      [
        {
          top: `${positionRelativeToViewport.top - heightDifference / 2}px`,
          left: `${positionRelativeToViewport.left}px`,
          width: `${positionRelativeToViewport.width}px`,
          height: `${expectedHeightFromAspectRatio}px`,
        },
        {
          top: `${positionRelativeToViewport.top}px`,
          left: `${positionRelativeToViewport.left}px`,
          width: `${positionRelativeToViewport.width}px`,
          height: `${positionRelativeToViewport.height}px`,
        },
      ],
      {
        duration: 500,
        easing: "ease-out",
        fill: "forwards",
      }
    );

    secondModalImgAnimation.finished.then(() => {
      secondModalImgAnimation.commitStyles();
      secondModalImgAnimation.cancel();
    });
  });
};

const handleTsuruOnClick = (event) => {
  const hasATsuruSelected = selectedTsuruUuid !== null;
  if (hasATsuruSelected || isAnimatingModal) {
    return;
  }
  event.preventDefault();
  clearAllSelectedTsuru();

  const modalImgEl = document.querySelector(".modal__image");
  const tsuruEl = event.target;
  const tsuruUuid = tsuruEl.getAttribute("t-uuid");
  selectedTsuruUuid = tsuruUuid;
  const tsuruImageEl = document.querySelector(`[il-uuid="${tsuruUuid}"]`);
  const imgSrc = tsuruImageEl.getAttribute("il-fullsize");
  const imgAspectRatio = tsuruImageEl.getAttribute("il-aspect-ratio");

  if (!imgSrc) {
    selectedTsuruUuid = null;
    return;
  }

  isAnimatingModal = true;

  document.documentElement.style.setProperty(
    "--modal-img-src",
    `url(/${imgSrc})`
  );
  document.documentElement.style.setProperty(
    "--modal-img-aspect-ratio",
    imgAspectRatio
  );

  document.body.classList.add("modal--open");
  tsuruEl.classList.add("tsuru--selected");

  const positionOfTheTsuru = tsuruImageEl.getBoundingClientRect();
  const positionRelativeToViewport = {
    top: positionOfTheTsuru.top,
    left: positionOfTheTsuru.left,
    width: positionOfTheTsuru.width,
    height: positionOfTheTsuru.height,
  };

  const modalEl = document.querySelector(".modal");

  const backgroundAnimation = modalEl.animate(
    [
      {
        backgroundColor: "rgba(0, 0, 0, 0)",
      },
      {
        backgroundColor: "rgba(0, 0, 0, 1)",
      },
    ],
    {
      duration: 250,
      easing: "ease-out",
      fill: "forwards",
    }
  );

  backgroundAnimation.finished.then(() => {
    backgroundAnimation.commitStyles();
    backgroundAnimation.cancel();
  });

  const parsedAspectRatio = imgAspectRatio.split("/");
  const aspectRatio =
    Number(parsedAspectRatio[0]) / Number(parsedAspectRatio[1]);

  const expectedHeightFromAspectRatio =
    positionRelativeToViewport.width / aspectRatio;

  const heightDifference =
    expectedHeightFromAspectRatio - positionRelativeToViewport.height;

  modalImgEl.style.backgroundSize = "cover";

  const animation = modalImgEl.animate(
    [
      {
        top: `${positionRelativeToViewport.top}px`,
        left: `${positionRelativeToViewport.left}px`,
        width: `${positionRelativeToViewport.width}px`,
        height: `${positionRelativeToViewport.height}px`,
      },
      {
        top: `${positionRelativeToViewport.top - heightDifference / 2}px`,
        left: `${positionRelativeToViewport.left}px`,
        width: `${positionRelativeToViewport.width}px`,
        height: `${expectedHeightFromAspectRatio}px`,
      },
    ],
    {
      duration: 250,
      easing: "ease-out",
      fill: "forwards",
    }
  );

  animation.finished.then(() => {
    animation.commitStyles();
    animation.cancel();

    modalImgEl.style.backgroundSize = "";

    const modalImgAnimation = modalImgEl.animate(
      [
        {
          top: `${positionRelativeToViewport.top - heightDifference / 2}px`,
          left: `${positionRelativeToViewport.left}px`,
          width: `${positionRelativeToViewport.width}px`,
          height: `${expectedHeightFromAspectRatio}px`,
        },
        {
          top: "0",
          left: "0",
          width: "100dvw",
          height: "100dvh",
        },
      ],
      {
        duration: 500,
        easing: "ease-out",
        fill: "forwards",
      }
    );

    modalImgAnimation.finished.then(() => {
      animation.commitStyles();
      animation.cancel();
      isAnimatingModal = false;
    });
  });

  // animate to size of 500x500
};


const handleMouseMove = (event) => {
  const x = event.clientX;
  const y = event.clientY;

  document.documentElement.style.setProperty("--mouse-x", `${x}px`);
  document.documentElement.style.setProperty("--mouse-y", `${y}px`);
}

const onLoad = () => {

  document.addEventListener("mousemove", handleMouseMove);


  const imgLoading = new ImgLoadingLibrary.ImgLoading();
  imgLoading.init("[img-loading]", {
    container: document.body,
    intersectionObserverConfig: {
      threshold: 0.5,
    },
  });

  const tsuruImages = document.querySelectorAll("[t-item]");

  const modalEl = document.querySelector(".modal");
  modalEl.addEventListener("click", handleCloseTsuruModal);
  tsuruImages.forEach((tsuruImage) => {
    tsuruImage.addEventListener("click", handleTsuruOnClick);
  });

  const anotherImgLoading = new ImgLoadingLibrary.ImgLoading();
  anotherImgLoading.init("[img-loading-me]", {
    container: document.body,
    intersectionObserverConfig: {
      threshold: 0.5,
    },
  });
};

window.addEventListener("load", onLoad);
