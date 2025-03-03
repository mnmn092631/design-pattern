import { ChromeGrimpan, Grimpan, IEGrimpan } from "./Grimpan.js";
import { SubscriptionManager } from "./Observer.js";

interface Clonable {
  clone(): Clonable;
}

class HistoryStack extends Array implements Clonable {
  clone() {
    return this.slice() as HistoryStack;
  }
  override slice(start?: number, end?: number): HistoryStack {
    return super.slice(start, end) as HistoryStack;
  }
}

export abstract class GrimpanHistory {
  grimpan: Grimpan;
  stack: HistoryStack;
  index = -1;

  protected constructor(grimpan: Grimpan) {
    this.grimpan = grimpan;
    this.stack = new HistoryStack();
    SubscriptionManager.getInstance().subscribe("saveComplete", {
      name: "history",
      publish: this.afterSaveComplete.bind(this),
    });
  }

  // caretaker
  saveHistory() {
    const snapshot = this.grimpan.makeSnapshot();
    if (this.index === this.stack.length - 1) {
      this.stack.push(snapshot);
      this.index++;
    } else {
      this.stack = this.stack.slice(0, this.index + 1);
      this.stack.push(snapshot);
      this.index++;
    }
    (document.querySelector("#back-btn") as HTMLButtonElement).disabled = false;
    (document.querySelector("#forward-btn") as HTMLButtonElement).disabled =
      true;
    console.log("saveHistory", this.index, this.stack);
  }

  undoable() {
    return this.index > 0;
  }
  redoable() {
    return this.index < this.stack.length - 1;
  }

  undo(): void {
    if (this.undoable()) {
      this.index--;
      (document.querySelector("#forward-btn") as HTMLButtonElement).disabled =
        false;
    } else return;
    if (!this.undoable()) {
      (document.querySelector("#back-btn") as HTMLButtonElement).disabled =
        true;
    }
    this.grimpan.restore(this.stack[this.index]);
    console.log("undo", this.index, this.stack);
  }
  redo(): void {
    if (this.redoable()) {
      this.index++;
      (document.querySelector("#back-btn") as HTMLButtonElement).disabled =
        false;
    } else return;
    if (this.redoable()) {
      (document.querySelector("#forward-btn") as HTMLButtonElement).disabled =
        true;
    }
    this.grimpan.restore(this.stack[this.index]);
    console.log("redo", this.index, this.stack);
  }

  afterSaveComplete() {
    console.log("history: save complete");
  }

  cancelSaveCompleteAlarm() {
    SubscriptionManager.getInstance().unsubscribe("saveComplete", "history");
  }

  getStack() {
    return this.stack.clone();
  }
  setStack(stack: HistoryStack) {
    this.stack = stack.clone();
  }

  initialize() {
    (document.querySelector("#back-btn") as HTMLButtonElement).disabled = true;
    (document.querySelector("#forward-btn") as HTMLButtonElement).disabled =
      true;
  }

  static getInstacne(grimpan: Grimpan) {}
}

export class IEGrimpanHistory extends GrimpanHistory {
  private static instance: IEGrimpanHistory;

  static override getInstacne(grimpan: IEGrimpan): IEGrimpanHistory {
    if (!this.instance) {
      this.instance = new IEGrimpanHistory(grimpan);
    }
    return this.instance;
  }
}

export class ChromeGrimpanHistory extends GrimpanHistory {
  private static instance: ChromeGrimpanHistory;

  static override getInstacne(grimpan: ChromeGrimpan): ChromeGrimpanHistory {
    if (!this.instance) {
      this.instance = new ChromeGrimpanHistory(grimpan);
    }
    return this.instance;
  }
}
