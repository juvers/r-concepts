/**@jsx jsx */
import {
  jsx,
  Box,
  Flex,
  Link,
  Grid,
  IntrinsicImage,
  GalleryCarousel,
} from '@tishman/components';
import {FluidObject} from 'gatsby-image';

interface PrivateEventPdfViewerProps {
  pdf: {
    url: string;
    label: string;
  };
  pdfPhotos: {
    fluid: FluidObject;
    alt: string;
  }[];
  gallery?: {
    caption?: string;
    fluid: FluidObject;
    alt: string;
  }[];
}

export const PrivateEventPdfViewer = ({
  pdf,
  pdfPhotos,
  gallery,
}: PrivateEventPdfViewerProps): JSX.Element => {
  return (
    <Flex sx={{flexDirection: 'column', alignItems: 'center'}}>
      <Link href={pdf.url} download="sample-menu" variant="underline">
        {pdf.label}
      </Link>
      <Grid
        gap={[4, 6]}
        sx={{
          mt: 4,
          mb: [5, 7],
          px: 3,
          gridTemplateColumns: '1fr',
          width: '100%',
        }}
      >
        {pdfPhotos.map(({fluid, alt}, index) => (
          <Box
            key={`row-${index}-${alt}`}
            sx={{
              border: '1px solid black',
              maxWidth: 1063,
              width: '100%',
              mx: 'auto',
            }}
          >
            <IntrinsicImage
              ratio={[285 / 369, 1063 / 1375]}
              fluid={fluid}
              alt={alt}
            />
          </Box>
        ))}
      </Grid>
      {gallery?.length ? (
        <GalleryCarousel cards={gallery} sx={{width: '100%', mx: [0, 0]}} />
      ) : null}
    </Flex>
  );
};
