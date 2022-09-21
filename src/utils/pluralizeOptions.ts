import { Option } from "@components/MultiDropdown";

export default (elements: Option[]) =>
  elements.length ? elements.map((el: Option) => el.key).join() : "";
