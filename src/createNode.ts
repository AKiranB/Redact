export const createNode = ({ elementType }: { elementType: string }) => {
  if (elementType === "TEXT_ELEMENT") {
    return document.createTextNode("");
  }
  return document.createElement(elementType);
};
