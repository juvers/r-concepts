export interface MockFluidImage {
  childImageSharp: {
    fluid: {
      aspectRatio: number;
      src: string;
      sizes: string;
      srcSet: string;
    };
  };
}
export interface MockFixedImage {
  childImageSharp: {
    fixed: {
      width: number;
      height: number;
      src: string;
      srcSet: string;
    };
  };
}

export interface MockImageProps {
  width: number;
  height: number;
  usePhoto: boolean;
}

/**
 * Get Mock Fixed Image
 *
 * Since docz doesn't like graphql image queries
 * This function will return dummy image object
 * to allow image to load in docz. its using via.placeholder.com
 * to keep it generic as possible.
 *
 * @param {number} width - width of image
 * @param {number} height - height of image
 * @param {boolean} fixed - is fixed or not
 * @return {MockFixedImage} mock image object
 */
export const getMockFixedImage = ({
  width,
  height,
}: MockImageProps): MockFixedImage => {
  const mockImageSrc = `https://via.placeholder.com/${width}x${height}.png?text=Mock+image`;
  return {
    childImageSharp: {
      fixed: {
        height: height,
        width: width,
        src: mockImageSrc,
        srcSet: `${mockImageSrc} 1x, ${mockImageSrc} 1.5x`,
      },
    },
  };
};

/**
 * Get Mock Fluid Image
 *
 * Since docz doesn't like graphql image queries
 * This function will return dummy image object
 * to allow image to load in docz. its using via.placeholder.com
 * to keep it generic as possible.
 *
 * @param {number} width - width of image
 * @param {number} height - height of image
 * @param {boolean} usePhoto - use an actual picture or just a graphic that says "Mock Image"
 * @return {MockFluidImage} mock image object
 */
export const getMockFluidImage = ({
  width,
  height,
  usePhoto = false,
}: MockImageProps): MockFluidImage => {
  let mockImageSrc;
  if (usePhoto === true) {
    mockImageSrc = `https://picsum.photos/${width}/${height}`;
  } else {
    mockImageSrc = `https://via.placeholder.com/${width}x${height}.png?text=Mock+image`;
  }
  return {
    childImageSharp: {
      fluid: {
        aspectRatio: width / height,
        src: mockImageSrc,
        sizes: `(max-width: ${width}) 100vw, ${width}`,
        srcSet: `${mockImageSrc} 200w, ${mockImageSrc} 400w, ${mockImageSrc} 800w, ${mockImageSrc} 1200w, ${mockImageSrc} 1600w, ${mockImageSrc} 2560w`,
      },
    },
  };
};
