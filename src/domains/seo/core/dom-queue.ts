/**
 * Batched DOM update queue.
 *
 * Coalesces many small SEO mutations into a single requestAnimationFrame
 * pass, preventing layout thrashing and giving us a single try/catch
 * boundary for all queued work.
 */

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
      // Surface the error: silent failure here would leave the DOM
      // silently half-updated and impossible to debug.
      console.error("[SEO] DOM update failed:", error);
    }
  }

  // Re-entries during this flush get rescheduled.
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
