import galaxy from "./assets/figma/galaxy-a55.png";
import galaxyBack from "./assets/figma/galaxy-a55-back.png";
import tws from "./assets/figma/tws-air.png";
import charger from "./assets/figma/charger-25w.png";
import speaker from "./assets/figma/speaker-beat.png";
import cable from "./assets/figma/cable-usbc.png";
import watch from "./assets/figma/watch-active.png";
import heroPhones from "./assets/figma/hero-phones.png";
import accessories from "./assets/figma/accessories.png";
import antioquia from "./assets/figma/antioquia.png";

const bySku = {
  "CEL-001": [galaxy, galaxyBack],
  "AUD-001": [tws],
  "ACC-025": [charger],
  "AUD-002": [speaker],
  "ACC-CAB01": [cable],
  "REL-001": [watch]
};

export const storeImages = { heroPhones, accessories, antioquia };

export function productImages(product) {
  return bySku[product.sku] || product.images || [galaxy];
}
