declare module 'gatsby-theme-docz/src/components/Icons' {
  interface IconProps extends React.ComponentPropsWithoutRef<'svg'> {
    color?: string;
    size?: string | number;
  }
  type SvgRef = React.ComponentProps<'svg'>['ref'];

  export const ChevronDown: React.ForwardRefRenderFunction<SvgRef, IconProps>;
  export const ChevronUp: React.ForwardRefRenderFunction<SvgRef, IconProps>;
  export const Clipboard: React.ForwardRefRenderFunction<SvgRef, IconProps>;
  export const Code: React.ForwardRefRenderFunction<SvgRef, IconProps>;
  export const Edit: React.ForwardRefRenderFunction<SvgRef, IconProps>;
  export const Github: React.ForwardRefRenderFunction<SvgRef, IconProps>;
  export const Menu: React.ForwardRefRenderFunction<SvgRef, IconProps>;
  export const Search: React.ForwardRefRenderFunction<SvgRef, IconProps>;
  export const Sun: React.ForwardRefRenderFunction<SvgRef, IconProps>;
}
