import Grimpan from "./AbstractGrimpan.js";

export default class ChromeGrimpan extends Grimpan {
  private static instance: ChromeGrimpan;

  override initialize() {}

  static override getInstance() {
    if (!this.instance) {
      this.instance = new ChromeGrimpan(document.querySelector("canvas"));
    }
    return this.instance;
  }
}
