/* eslint-disable @typescript-eslint/no-explicit-any */

// Found this type file after searching the issues for @sanity/block-content-to-react
// Some nice person already put this together which is a nice starting point until
// Sanity themselves type out this package

// Link to issue
// https://github.com/sanity-io/block-content-to-react/issues/26

// Link to repo where code came from
// https://github.com/nhi/sanity-block-content-to-react-types

// Type info for `Block`, `Span`, `MarkDef` gleaned from
// https://github.com/portabletext/portabletext

declare module '@sanity/block-content-to-react' {
  import * as React from 'react';

  interface Span {
    _type: 'span';
    _key: string;
    text: string;
    marks: string[];
  }

  interface MarkDef {
    _type: string;
    _key: string;
    [key: string]: string;
  }

  type Block = {
    _type: 'block';
    _key: string;
    style?: string;
    listItem?: string;
    level?: string;
    markDefs?: MarkDef[];
    children?: Span[];
  } & {
    _type: string;
    [key: string]: string | Block | Block[];
  };

  export interface BlockContentProps {
    /**
     * Pass in either an array or a single object of [Portable Text](https://github.com/portabletext/portabletext)
     *
     * *This is the only required prop*
     */
    blocks: Block | Block[];
    /**
     * When more than one block is given, a container node has to be created. Passing a className will pass it on to the container.
     * @note see `renderContainerOnSingleChild`
     */
    className?: string;
    /**
     * When a single block is given as input, the default behavior is to not render any container.
     * If you always want to render the container, pass `true`.
     */
    renderContainerOnSingleChild?: boolean;
    /**
     *  Define custom serializers
     *
     */
    serializers?: {
      /**
       * Serializers for block types
       * @example
       * ```jsx
       * const input = [{
       *   _type: 'block',
       *   children: [{
       *     _key: 'a1ph4',
       *     _type: 'span',
       *     marks: ['s0m3k3y'],
       *     text: 'Sanity'
       *   }],
       *   markDefs: [{
       *     _key: 's0m3k3y',
       *     _type: 'highlight',
       *     color: '#E4FC5B'
       *   }]
       * }]
       *
       * const highlight = props => {
       *   return (
       *     <span style={{backgroundColor: props.mark.color}}>
       *       {props.children}
       *     </span>
       *   )
       * }
       *
       * <BlockContent
       *   blocks={input}
       *   serializers={{marks: {highlight}}}
       * />
       * ```
       */
      types?: Record<string, React.ComponentType<any>>;
      /**
       * Serializers for marks - data that annotates a text child of a block.
       * @example
       * ```jsx
       * const input = [{
       *   _type: 'block',
       *   children: [{
       *     _key: 'a1ph4',
       *     _type: 'span',
       *     marks: ['s0m3k3y'],
       *     text: 'Sanity'
       *   }],
       *   markDefs: [{
       *     _key: 's0m3k3y',
       *     _type: 'highlight',
       *     color: '#E4FC5B'
       *   }]
       * }]
       *
       * const highlight = props => {
       *   return (
       *     <span style={{backgroundColor: props.mark.color}}>
       *       {props.children}
       *     </span>
       *   )
       * }
       *
       * <BlockContent
       *   blocks={input}
       *   serializers={{marks: {highlight}}}
       * />
       * ```
       */
      marks?: Record<string, React.ComponentType<any>>;
      /** React component to use when rendering a list node */
      list?: React.ComponentType<any>;

      /** React component to use when rendering a list item node */
      listItem?: React.ComponentType<any>;
      /**
       * React component to use when transforming newline characters
       * to a hard break (<br/> by default, pass false to render newline character)
       */
      hardBreak?: React.ComponentType<any>;
      /** Serializer for the container wrapping the blocks */
      container?: React.ComponentType<any>;
    };
    /**
     * When encountering image blocks,
     * this defines which query parameters to apply in order to control size/crop mode etc.
     */
    imageOptions?: any;
    /** The ID of your Sanity project. */
    projectId?: string;
    /** Name of the Sanity dataset containing the document that is being rendered. */
    dataset?: string;
  }

  /** React component for transforming Sanity block content to React components */
  export default function BlockContent(props: BlockContentProps): JSX.Element;
}
