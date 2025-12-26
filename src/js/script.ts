import { ImgLoading } from "@felicetteapp/img-loading";
import "./gifs";
import "./filters";
import Lenis from "lenis";

const lenis = new Lenis();

let selectedTsuruUuid: string | null = null;
let isAnimatingModal = false;

const clearAllSelectedTsuru = () => {
  const tsuruImages = document.querySelectorAll(".tsuru--selected");
  tsuruImages.forEach((tsuruImage) => {
    tsuruImage.classList.remove("tsuru--selected");
  });
};

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

  const imgAnimationDuration = 500;

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
        delay: imgAnimationDuration,
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

  const targetSize = calculateTargetSize(aspectRatio);

  const targetPosition = {
    left: (window.innerWidth - targetSize.width) / 2,
    top: (window.innerHeight - targetSize.height) / 2,
  };

  const originalElementRect = tsuruImageEl.getBoundingClientRect();

  modalImgEl.style.backgroundSize = "cover";

  const modalImgAnimation = modalImgEl.animate(
    [
      {
        left: `${targetPosition.left}px`,
        top: `${targetPosition.top}px`,
        width: `${targetSize.width}px`,
        height: `${targetSize.height}px`,
      },
      {
        left: `${originalElementRect.left}px`,
        top: `${originalElementRect.top}px`,
        width: `${originalElementRect.width}px`,
        height: `${originalElementRect.height}px`,
      },
    ],
    {
      duration: imgAnimationDuration,
      easing: "ease-in-out",
      fill: "forwards",
    }
  );

  modalImgAnimation.finished.then(() => {
    modalImgAnimation.commitStyles();
    modalImgAnimation.cancel();
    modalImgEl.style.backgroundSize = "";
  });
};

const calculateTargetSize = (aspectRatio: number) => {
  const isVertical = window.innerHeight < window.innerWidth;
  const maxHeight = window.innerHeight;
  const maxWidth = window.innerWidth;

  let targetWidth = isVertical ? maxWidth : maxHeight * aspectRatio;
  let targetHeight = isVertical ? maxWidth / aspectRatio : maxHeight;

  if (targetWidth > maxWidth) {
    targetWidth = maxWidth;
    targetHeight = maxWidth / aspectRatio;
  }
  if (targetHeight > maxHeight) {
    targetHeight = maxHeight;
    targetWidth = maxHeight * aspectRatio;
  }
  return {
    width: targetWidth,
    height: targetHeight,
  };
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

  if (widthWithoutModalOpen !== widthWithModalOpen) {
    document.documentElement.style.setProperty(
      "--scroll-width",
      `${scrollBarWidth}px`
    );
  } else {
    document.documentElement.style.setProperty("--scroll-width", "0px");
  }

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

  const targetSize = calculateTargetSize(aspectRatio);

  const targetPosition = {
    left: (window.innerWidth - targetSize.width) / 2,
    top: (window.innerHeight - targetSize.height) / 2,
  };

  const originalElementRect = tsuruImageEl.getBoundingClientRect();
  const modalImgAnimation = modalImgEl.animate(
    [
      {
        height: originalElementRect.height + "px",
        width: originalElementRect.width + "px",
        left: originalElementRect.left + "px",
        top: originalElementRect.top + "px",
      },
      {
        height: targetSize.height + "px",
        left: targetPosition.left + "px",
        top: targetPosition.top + "px",
        width: targetSize.width + "px",
      },
    ],
    {
      duration: 500,
      easing: "ease-in-out",
      fill: "forwards",
    }
  );

  modalImgAnimation.finished.then(() => {
    modalImgAnimation.commitStyles();
    modalImgAnimation.cancel();
    modalImgEl.style.backgroundSize = "contain";
    modalImgEl.style.left = `0px`;
    modalImgEl.style.top = `0px`;
    modalImgEl.style.width = "100dvw";
    modalImgEl.style.height = "100dvh";
    isAnimatingModal = false;
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

  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
};

window.addEventListener("load", onLoad);
