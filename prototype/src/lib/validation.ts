import { OPTIONS } from "./config";
import type { KitchenEnquiry } from "./models";
export function validateStep(e: KitchenEnquiry, step: number): string {
  if (step === 0 && !OPTIONS.projectType.includes(e.projectType))
    return "Choose a project type to continue.";
  if (step === 1 && !OPTIONS.layout.includes(e.layout))
    return "Choose a layout, or select Not sure.";
  if (step === 2) {
    if (Boolean(e.length) !== Boolean(e.width))
      return "Add both dimensions, or leave both blank for now.";
    const max = e.unit === "millimetres" ? 30000 : 30;
    if (
      e.length &&
      (!Number.isFinite(Number(e.length)) ||
        Number(e.length) <= 0 ||
        Number(e.length) > max ||
        !Number.isFinite(Number(e.width)) ||
        Number(e.width) <= 0 ||
        Number(e.width) > max)
    )
      return `Enter positive dimensions up to ${max} ${e.unit}.`;
  }
  if (step === 3 && !OPTIONS.style.includes(e.style))
    return "Choose a style, or select Not sure yet.";
  if (step === 4 && !OPTIONS.budget.includes(e.budget))
    return "Choose a budget category, or select Not sure yet.";
  if (step === 5 && !OPTIONS.timeline.includes(e.timeline))
    return "Choose your preferred timeline.";
  if (step === 7) {
    if (e.customer.name.trim().length < 2)
      return "Add your full name (at least two characters).";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.customer.email))
      return "Enter a valid email address.";
    if (!/^(?:\+61|0)[\d ()-]{8,15}$/.test(e.customer.phone.trim()))
      return "Enter an Australian phone number, such as 0400 000 000.";
    if (e.customer.suburb.trim().length < 2)
      return "Add your suburb or location.";
    if (!e.consent)
      return "Please acknowledge how this demo stores your details.";
  }
  return "";
}
