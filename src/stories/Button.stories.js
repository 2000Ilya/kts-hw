import { Button, ButtonColor } from "../components/Button";

export default {
  title: "Button",
  component: Button,
};

export const Primary = () => (
  <Button color={ButtonColor.primary}>Primary</Button>
);

export const Secondary = () => (
  <Button color={ButtonColor.secondary}>Secondary</Button>
);

export const Loading = () => <Button loading={true}>Loading</Button>;
