import cronstrue from "cronstrue";

export const parseCronExpression = (
  cronExpression: string
): string | undefined => {
  try {
    return `Run ${cronstrue.toString(cronExpression, { verbose: true })}`;
  } catch (err) {
    console.log(err);
    return;
  }
};
