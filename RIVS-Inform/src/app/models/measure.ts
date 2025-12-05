import { measElementValue } from "./measElementValue";

export interface Measure {
  productId: number;
  time: Date;
  //tfcc: number | null;
  elementValues: measElementValue[];
}
