type imgSizeName<T> = T extends string
  ? `${T}w`
  : 'size has to include strings ending with "w"';
export interface ImageDimensions {
  SIZE: imgSizeName<string>;
  WIDTH: number;
  HEIGHT: number;
}
