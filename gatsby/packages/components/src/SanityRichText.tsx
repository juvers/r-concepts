/** @jsx jsx */
import {jsx, Text, Link} from '@tishman/components';
import {ComponentType} from 'react';
import BlockContent, {BlockContentProps} from '@sanity/block-content-to-react';
import {H} from '@hzdg/sectioning';
import type {Block} from '@sanity/block-content-to-react';

type Blocks = BlockContentProps['blocks'];

export interface RichTextProps {
  children: (string | Block)[];
}

interface RichTextLinkProps extends RichTextProps {
  mark: {
    href: string;
  };
}

export interface QuoteProps {
  node: {body: string; author: string};
}

export interface VideoProps {
  node: {url: string};
}

export interface ImageContentsBlockProps {
  node: {
    contents: BlockContentProps['blocks'];
    photo: {
      alt: string;
      align: string;
      caption?: string;
      asset: {
        _ref: string;
      };
    };
  };
}

export interface GalleryProps {
  node: {
    items: {
      alt: string;
      caption?: string;
      asset: {_ref: string};
    }[];
  };
}

export interface SanityRichTextProps {
  /**
   * Any sx overrides will be passed to SanityRichText
   * as a className string.
   */
  className?: string;
  /**
   * Blocks are the sanity serialized rich text
   * field. Sanity provides a package,
   * '@sanity/block-content-to-react'
   * which will render these blocks.
   *
   * '@sanity/block-content-to-react' also provides
   * a serializer prop where we can override the default rendering
   * with our own custom components. Below is serializer I have
   * put together to handle basic rich text fields that we might
   * use. We will likely need to update this when our cms
   * has more custom components.
   */
  blocks: Blocks;

  components?: {
    h1?: ComponentType<RichTextProps>;
    h2?: ComponentType<RichTextProps>;
    h3?: ComponentType<RichTextProps>;
    h4?: ComponentType<RichTextProps>;
    h5?: ComponentType<RichTextProps>;
    p?: ComponentType<RichTextProps>;
    em?: ComponentType<RichTextProps>;
    strong?: ComponentType<RichTextProps>;
    link?: ComponentType<RichTextLinkProps>;
    li?: ComponentType<RichTextProps>;
    ul?: ComponentType<RichTextProps>;
    ol?: ComponentType<RichTextProps>;
    imageContentsBlock?: ComponentType<ImageContentsBlockProps>;
    galleryBlock?: ComponentType<GalleryProps>;
    quoteBlock?: ComponentType<QuoteProps>;
    vimeoBlock?: ComponentType<VideoProps>;
    youtubeBlock?: ComponentType<VideoProps>;
  };
}

const createSerializers = (components: SanityRichTextProps['components']) => {
  return {
    list: function listRenderer({
      type,
      children,
    }: RichTextProps & {type: string}) {
      switch (type) {
        case 'bullet': {
          return components?.ul ? (
            jsx(components.ul, null, children)
          ) : (
            <ul sx={{listStyle: 'disc', pl: 3}}>{children}</ul>
          );
        }
        case 'number': {
          return components?.ol ? (
            jsx(components.ol, null, children)
          ) : (
            <ol sx={{listStyle: 'decimal', pl: 3}}>{children}</ol>
          );
        }
        default:
          return components?.ul ? (
            jsx(components.ul, null, children)
          ) : (
            <ul sx={{listStyle: 'disc', pl: 3}}>{children}</ul>
          );
      }
    },
    listItem: function listItemRenderer({children}: RichTextProps) {
      return components?.li ? (
        jsx(components.li, null, children)
      ) : (
        <li>{children}</li>
      );
    },
    marks: {
      em: function emRenderer({children}: RichTextProps) {
        return components?.em ? (
          jsx(components.em, null, children)
        ) : (
          <Text as="span" sx={{fontStyle: 'italic'}}>
            {children}
          </Text>
        );
      },
      strong: function strongRenderer({children}: RichTextProps) {
        return components?.strong ? (
          jsx(components.strong, null, children)
        ) : (
          <Text as="span" sx={{fontWeight: 'medium'}}>
            {children}
          </Text>
        );
      },
      link: function LinkRenderer({
        mark,
        children,
      }: RichTextLinkProps): JSX.Element {
        return components?.link ? (
          jsx(components.link, null, {mark, children})
        ) : (
          <Link href={mark.href} sx={{fontWeight: 'regular', color: 'text', fontSize:'inherit'}}>
            {children}
          </Link>
        );
      },
      internalLink: function InternalLinkRenderer({
        mark,
        children,
      }: RichTextLinkProps): JSX.Element {
        // TODO: find way to link to internal page
        return components?.link ? (
          jsx(components.link, null, {mark, children})
        ) : (
          <Link href={mark.href} sx={{fontWeight: 'regular', color: 'text', fontSize:'inherit'}}>
            {children}
          </Link>
        );
      },
    },

    types: {
      block({node, children}: RichTextProps & {node: Block}) {
        switch (node.style) {
          case 'h1': {
            return components?.h1 ? (
              jsx(components.h1, null, children)
            ) : (
              <H sx={{variant: 'styles.h1'}}>{children}</H>
            );
          }

          case 'h2': {
            return components?.h2 ? (
              jsx(components.h2, null, children)
            ) : (
              <H sx={{variant: 'styles.h2'}}>{children}</H>
            );
          }
          case 'h3': {
            return components?.h3 ? (
              jsx(components.h3, null, children)
            ) : (
              <H sx={{variant: 'styles.h3'}}>{children}</H>
            );
          }

          case 'h4': {
            return components?.h4 ? (
              jsx(components.h4, null, children)
            ) : (
              <H sx={{variant: 'styles.h4'}}>{children}</H>
            );
          }

          case 'h5': {
            return components?.h5 ? (
              jsx(components.h5, null, children)
            ) : (
              <H sx={{variant: 'styles.h5'}}>{children}</H>
            );
          }

          case 'normal':
            return components?.p ? (
              jsx(components.p, null, children)
            ) : (
              <Text as="p" mb={2}>
                {children}
              </Text>
            );

          default:
            return components?.p ? (
              jsx(components.p, null, children)
            ) : (
              <Text as="p" mb={2}>
                {children}
              </Text>
            );
        }
      },
      vimeo: (props: VideoProps) => {
        if (!components?.vimeoBlock)
          throw new Error('vimeo renderer not provided');
        return jsx(components.vimeoBlock, props, null);
      },

      youtube: (props: VideoProps) => {
        if (!components?.youtubeBlock)
          throw new Error('gallery renderer not provided');
        return jsx(components.youtubeBlock, props, null);
      },

      quote: (props: QuoteProps) => {
        if (!components?.quoteBlock)
          throw new Error('gallery renderer not provided');
        return jsx(components.quoteBlock, props, null);
      },

      gallery: (props: GalleryProps) => {
        if (!components?.galleryBlock)
          throw new Error('gallery renderer not provided');
        return jsx(components.galleryBlock, props, null);
      },
      imageContentsBlock: (props: ImageContentsBlockProps) => {
        if (!components?.imageContentsBlock)
          throw new Error('imageContentsBlock renderer not provided');
        return jsx(components.imageContentsBlock, props);
      },
    },
  };
};

export const SanityRichText = ({
  className,
  blocks,
  components,
}: SanityRichTextProps): JSX.Element => {
  const serializer = createSerializers(components);
  return (
    <BlockContent
      className={className}
      blocks={blocks}
      serializers={(serializer as unknown) as BlockContentProps['serializers']}
      renderContainerOnSingleChild={true}
    />
  );
};
