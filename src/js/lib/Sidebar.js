import _ from "lodash";
import $ from "jquery";

const ATTR = "data-active";
const animationend = "animationend webkitAnimationEnd mozAnimationEnd msAnimationEnd oAnimationEnd";

export default class Sidebar {

  constructor(opts = {}){
    this.$root = opts.$root || $(".js-root");
    this.isActive = false;
  }


  open() {
    this.isActive = true;
    this.setAttr();
  }


  close() {
    this.isActive = false;
    this.setAttr();
    // animation用
    this.$root.on(animationend, (evt) => {
      if(evt.target !== this.$root[0]) return;
      this.$root.attr(ATTR, "");
      this.$root.off(animationend);
    });
  }


  toggle() {
    this.isActive = !this.isActive;
    this.setAttr();
  }


  setAttr() {
    this.$root.attr(ATTR, this.isActive);
  }

}
