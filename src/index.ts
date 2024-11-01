#!/usr/bin/env node

import { assertRuntimeVersion } from "@/lib/node";
import { errorMessage } from "@/lib/logs";
import cliProgramRoot from "@/commands";

import installCommand from "@/commands/install";
import doctorCommand from "@/commands/doctor";
import cloneCommand from "@/commands/clone";
import testValidatorCommand from "@/commands/test-validator";
import buildCommand from "@/commands/build";
import coverageCommand from "@/commands/coverage";

// ensure the user running the cli tool is on a supported javascript runtime version
assertRuntimeVersion();

async function main() {
  try {
    const program = cliProgramRoot();

    program
      .addCommand(installCommand())
      .addCommand(doctorCommand())
      .addCommand(cloneCommand())
      .addCommand(buildCommand())
      .addCommand(coverageCommand())
      .addCommand(testValidatorCommand());

    // set the default action to `help` without an error
    if (process.argv.length === 2) {
      process.argv.push("--help");
    }

    await program.parseAsync();
  } catch (err) {
    errorMessage(err.toString());
  }
}

main();
