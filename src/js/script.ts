import { ImgLoading } from "@felicetteapp/img-loading";
import "./gifs";
import "./filters";
let selectedTsuruUuid: string | null = null;
let isAnimatingModal = false;

const clearAllSelectedTsuru = () => {
  const tsuruImages = document.querySelectorAll(".tsuru--selected");
  tsuruImages.forEach((tsuruImage) => {
    tsuruImage.classList.remove("tsuru--selected");
  });
};

const teste: number = 12;

console.log("3");

const handleCloseTsuruModal = () => {
  if (isAnimatingModal || selectedTsuruUuid === null) {
    return;
  }
  isAnimatingModal = true;
  const tsuruImageEl = document.querySelector(
    `[il-uuid="${selectedTsuruUuid}"]`
  );

  if (!tsuruImageEl) {
    return;
  }

  const imgAspectRatio = tsuruImageEl.getAttribute("il-aspect-ratio");
  const imgSrc = tsuruImageEl.getAttribute("il-fullsize");
  const modalImgEl: HTMLDivElement | null =
    document.querySelector(".modal__image");

  if (!imgAspectRatio || !imgSrc || !modalImgEl) {
    return;
  }

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

  if (!modalEl) {
    return;
  }

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
        transform: "translateX(0) translateY(0)",
        width: "100dvw",
        height: "100dvh",
      },
      {
        transform: `translateX(${
          positionRelativeToViewport.left
        }px) translateY(${
          positionRelativeToViewport.top - heightDifference / 2
        }px)`,
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
          transform: `translateX(${
            positionRelativeToViewport.left
          }px) translateY(${
            positionRelativeToViewport.top - heightDifference / 2
          }px)`,
          width: `${positionRelativeToViewport.width}px`,
          height: `${expectedHeightFromAspectRatio}px`,
        },
        {
          transform: `translateX(${positionRelativeToViewport.left}px) translateY(${positionRelativeToViewport.top}px)`,
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

const handleTsuruOnClick = (event: MouseEvent) => {
  if (event.target !== event.currentTarget) {
    return;
  }
  const hasATsuruSelected = selectedTsuruUuid !== null;
  if (hasATsuruSelected || isAnimatingModal) {
    return;
  }
  const widthWithoutModalOpen = document.documentElement.clientWidth;
  const scrollBarWidth =
    window.innerWidth - document.documentElement.clientWidth;

  event.preventDefault();
  clearAllSelectedTsuru();

  const modalImgEl: HTMLDivElement | null =
    document.querySelector(".modal__image");
  const tsuruEl = event.target as HTMLElement | null;
  if (!tsuruEl) {
    return;
  }
  const tsuruUuid: string = tsuruEl.getAttribute("t-uuid") || "";
  selectedTsuruUuid = tsuruUuid;
  const tsuruImageEl = document.querySelector(`[il-uuid="${tsuruUuid}"]`);

  if (!tsuruImageEl || !modalImgEl) {
    return;
  }

  const imgSrc = tsuruImageEl.getAttribute("il-fullsize");
  const imgAspectRatio = tsuruImageEl.getAttribute("il-aspect-ratio");

  if (!imgSrc || !imgAspectRatio) {
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

  const widthWithModalOpen = document.documentElement.clientWidth;

  console.log(widthWithoutModalOpen, widthWithModalOpen);

  if (widthWithoutModalOpen !== widthWithModalOpen) {
    document.documentElement.style.setProperty(
      "--scroll-width",
      `${scrollBarWidth}px`
    );
  } else {
    document.documentElement.style.setProperty("--scroll-width", "0px");
  }

  const positionOfTheTsuru = tsuruImageEl.getBoundingClientRect();
  const positionRelativeToViewport = {
    top: positionOfTheTsuru.top,
    left: positionOfTheTsuru.left,
    width: positionOfTheTsuru.width,
    height: positionOfTheTsuru.height,
  };

  const modalEl = document.querySelector(".modal");

  if (!modalEl) {
    return;
  }

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
        width: `${positionRelativeToViewport.width}px`,
        height: `${positionRelativeToViewport.height}px`,
        transform: `translateX(${positionRelativeToViewport.left}px) translateY(${positionRelativeToViewport.top}px)`,
      },
      {
        transform: `translateX(${
          positionRelativeToViewport.left
        }px) translateY(${
          positionRelativeToViewport.top - heightDifference / 2
        }px)`,
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
          width: `${positionRelativeToViewport.width}px`,
          height: `${expectedHeightFromAspectRatio}px`,
          transform: `translateX(${
            positionRelativeToViewport.left
          }px) translateY(${
            positionRelativeToViewport.top - heightDifference / 2
          }px)`,
        },
        {
          transform: "translateX(0) translateY(0)",
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
};

const handleMouseMove = (event: MouseEvent) => {
  const x = Math.round(event.clientX);
  const y = Math.round(event.clientY);

  document.documentElement.style.setProperty("--mouse-x", `${x}px`);
  document.documentElement.style.setProperty("--mouse-y", `${y}px`);
};

const onLoad = () => {
  document.addEventListener("mousemove", handleMouseMove);

  const imgLoading = new ImgLoading();
  imgLoading.init("[img-loading]", {
    container: document.body,
  });

  const tsuruImages = document.querySelectorAll<HTMLElement>("[t-item]");

  const modalEl = document.querySelector(".modal");

  if (modalEl) {
    modalEl.addEventListener("click", handleCloseTsuruModal);
  }

  tsuruImages.forEach((tsuruImage) => {
    tsuruImage.addEventListener("click", handleTsuruOnClick);
  });

  const anotherImgLoading = new ImgLoading();
  anotherImgLoading.init("[img-loading-me]", {
    container: document.body,
  });
};

window.addEventListener("load", onLoad);
