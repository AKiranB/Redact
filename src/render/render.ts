import createElement, { IElement } from "../createElement";
import { createNode } from "../createNode";

type DomNode = Text | HTMLElement;

const assignElementPropsToNode = (
  element: IElement,
  domNode: Text | HTMLElement
) => {
  const isProperty = (key: string) => key !== "children";

  Object.keys(element.props)
    .filter(isProperty)
    .forEach((name) => {
      (domNode as any)[name] = element.props[name];
    });
};

let wipRoot: any;

const workLoop = (deadline: IdleDeadline) => {
  let shouldYield = false;

  while (wipRoot && !shouldYield) {
    wipRoot = performNextUnit(wipRoot);
    shouldYield = deadline.timeRemaining() < 1;
  }
  requestIdleCallback(workLoop);
};

const commitRoot = () => {
  commitWork(wipRoot.child);
  wipRoot = null;
};

const commitWork = (fiber: Fiber) => {
  if (!fiber) {
    return;
  }
  const domParent = fiber.parent.dom;
  domParent.appendChild(fiber.dom);
  commitWork(fiber.child);
  commitWork(fiber.sibling);
};

interface ElementProps {
  [key: string]: any;
  children: Element[];
}

interface Element {
  type: string | Function;
  props: ElementProps;
}

interface Fiber extends Element {
  parent: Fiber;
  sibling?: Fiber;
  child?: Fiber;
  dom: HTMLElement | Text;
  alternate?: Fiber;
  effectTag?: string;
}

const performNextUnit = (fiber: Fiber) => {
  // If the fiber in this given unit has no domNode -> we create one
  if (!fiber.dom) {
    fiber.dom = createNode({ elementType: fiber.type as string });
  }

  // If we have a parent, we append this dom node to the parent

  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom);
  }

  // We check the given fibers children

  reconcileChildren({
    elements: fiber.props.children,
    fiber,
  });

  // For each element/child we create a new fiber
  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber = fiber;

  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
};

const reconcileChildren = ({
  elements,
  fiber,
}: {
  elements: Element[];
  fiber: Fiber;
}) => {
  let i = 0;
  let prevSibling = null;
  // For each element/child we create a new fiber
  while (i < elements.length) {
    const element = elements[i];

    const newFiber: Fiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    };

    // If the element is 0 this is the child
    if (i === 0) {
      fiber.child = newFiber;
    } else {
      // else we are the sibling
      (prevSibling as any).fiber = newFiber;
    }
    prevSibling = newFiber;
    i++;
  }
};

export function render({
  element,
  container,
}: {
  element: ReturnType<typeof createElement>;
  container: Node;
}) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
  };
  // const domNode = createNode({ elementType: element.type });
  // assignElementPropsToNode(element, domNode);
  // container.appendChild(domNode);
}
