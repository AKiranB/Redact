export type IElement = {
  type: string;
  props: {
    children: IElement[] | string[];
    [key: string]: any; // Allows additional properties
  };
};

export default function createElement({
  tagName,
  props,
  children,
}: {
  tagName: string;
  props?: Record<string, any>;
  children: any[];
}): IElement {
  return {
    type: tagName,
    props: {
      ...props,
      children: children.map((child) => {
        if (typeof child === "string") {
          return createTextElement(child);
        }
        return child;
      }),
    },
  };
}

function createTextElement(text: string): {
  type: "TEXT_ELEMENT";
  props: {
    nodeValue: string;
    children: any[];
  };
} {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}
