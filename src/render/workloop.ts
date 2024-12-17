// const workLoop = (deadline: IdleDeadline) => {
//   let shouldYield = false;

//   while (wipRoot && !shouldYield) {
//     wipRoot = performNextUnit(wipRoot);
//     shouldYield = deadline.timeRemaining() < 1;
//   }
//   requestIdleCallback(workLoop);
// };

// export default workLoop;
