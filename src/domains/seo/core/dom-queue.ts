
type DOMUpdate = () => void;

const updateQueue: DOMUpdate[] = [];
let scheduled = false;

const flush = () => {
  const updates = updateQueue.splice(0, updateQueue.length);
  scheduled = false;

  for (const update of updates) {
    try {
      update();
    } catch (error) {
      console.error("[SEO] DOM update failed:", error);
    }
  }

  if (updateQueue.length > 0) {
    schedule();
  }
};

const schedule = (): void => {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(flush);
};

export const queueDOMUpdate = (update: DOMUpdate): void => {
  updateQueue.push(update);
  schedule();
};
