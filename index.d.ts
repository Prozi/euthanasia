declare module "euthanasia" {
  export default function euthanasia(
    memory: number,
    interval: number,
    ready: (usage: number) => Promise<boolean>
  ): void
}
