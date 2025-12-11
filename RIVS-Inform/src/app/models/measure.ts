import { measElementValue } from "./measElementValue";

export interface Measure {
  productId: number;
  time: Date;
  elementValues: measElementValue[];
}
