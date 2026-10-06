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
import iphone16Pro from "./assets/phones/iphone-16-pro.jpg";
import galaxyS25Ultra from "./assets/phones/galaxy-s25-ultra.jpg";
import redmiNote14Pro from "./assets/phones/redmi-note-14-pro.jpg";

const bySku = {
  "CEL-IPH16P": [iphone16Pro],
  "CEL-S25U": [galaxyS25Ultra],
  "CEL-RN14P": [redmiNote14Pro],
  "CEL-001": [galaxy, galaxyBack],
  "AUD-001": [tws],
  "ACC-025": [charger],
  "AUD-002": [speaker],
  "ACC-CAB01": [cable],
  "REL-001": [watch]
};

export const storeImages = { heroPhones, accessories, antioquia };

export function productImages(product) {
  const uploaded = (product.images || []).filter(Boolean);
  if (uploaded.length) return uploaded;
  if (bySku[product.sku]) return bySku[product.sku];
  return [galaxy];
}
