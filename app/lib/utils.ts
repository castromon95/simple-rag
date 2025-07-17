import readline from "readline";

class Utils {
  public static chunkArray = <T>(array: T[], chunkSize = 100): T[][] => {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  };

  public static askForUserInput(question: string = "You: "): Promise<string> {
    return new Promise((resolve) => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      rl.question(question, (input) => {
        rl.close();
        resolve(input);
      });
    });
  }

  public static generateRandomAlphaNumeric(length): string {
    return Math.random()
      .toString(36)
      .substring(2, 2 + length);
  }
}

export { Utils };
