import { Argument, Command } from "@commander-js/extra-typings";
import { cliOutputConfig } from "@/lib/cli";
import { titleMessage, warnMessage } from "@/lib/logs";
import { detectOperatingSystem } from "@/lib/shell";
import type { ToolNames } from "@/types";
import {
  installAnchorVersionManager,
  installRust,
  installSolana,
  installAnchorUsingAvm,
  installYarn,
  installTrident,
  installZest,
  installSolanaVerify,
  installMucho,
} from "@/lib/install";
import { checkInstalledTools, checkShellPathSource } from "@/lib/setup";
import { PathSourceStatus, TOOL_CONFIG } from "@/const/setup";

const toolNames: Array<ToolNames> = [
  "rust",
  "solana",
  "avm",
  "mucho",
  "anchor",
  "trident",
  "zest",
  "yarn",
  "verify",
];

/**
 * Command: `install`
 *
 * Setup your local machine for Solana development
 */
export function installCommand() {
  return (
    new Command("install")
      .configureOutput(cliOutputConfig)
      .description("install Solana development tooling")
      .addArgument(
        new Argument("<tool>", "tool to install (default: all)")
          .choices(toolNames)
          .argOptional(),
      )
      .addArgument(
        new Argument(
          "<version>",
          "desired tool version to install (default: stable)",
        ).argOptional(),
      )
      // .addOption(
      //   new Option(
      //     "--dry-run",
      //     "only check the versions of the installed tools, do not actually install anything",
      //   ).implies({
      //     drink: "small",
      //   }),
      // )
      .action(async (toolName, version, options) => {
        titleMessage("Install Solana development tooling");

        const os = detectOperatingSystem();

        if (os == "windows") {
          warnMessage(
            "Windows is not yet natively supported for the rust based tooling.\n" +
              "We recommend using WSL inside your Windows terminal.",
          );
        }

        const tools = await checkInstalledTools({
          // outputToolStatus: toolName == "all",
          outputToolStatus: false,
        });

        // track which commands may require a path/session refresh
        const pathsToRefresh: string[] = [];

        if (!toolName || toolName == "rust") {
          await installRust({
            os,
            version,
          });

          await checkShellPathSource(
            TOOL_CONFIG.rust.version,
            TOOL_CONFIG.rust.pathSource,
          ).then((status) =>
            status == PathSourceStatus.MISSING_PATH
              ? pathsToRefresh.push(TOOL_CONFIG.rust.pathSource)
              : true,
          );
        }
        if (!toolName || toolName == "solana") {
          const res = await installSolana({
            os,
            version,
          });

          // string response means this was a fresh install
          if (typeof res == "string") {
          }

          await checkShellPathSource(
            TOOL_CONFIG.solana.version,
            TOOL_CONFIG.solana.pathSource,
          ).then((status) =>
            status == PathSourceStatus.MISSING_PATH
              ? pathsToRefresh.push(TOOL_CONFIG.solana.pathSource)
              : true,
          );
        }

        if (!toolName || toolName == "mucho") {
          await installMucho({
            os,
            version,
          });
        }

        if (!toolName || toolName == "avm") {
          // const version = "0.28.0"; //"latest"; // v0.29.0 has the "ahash yanked" issue
          await installAnchorVersionManager({
            os,
            version,
          });
        }
        if (!toolName || toolName == "anchor") {
          await installAnchorUsingAvm({
            os,
            version,
          });
        }
        if (!toolName || toolName == "trident") {
          await installTrident({
            os,
            version,
          });
        }
        if (!toolName || toolName == "zest") {
          await installZest({
            os,
            version,
          });
        }
        if (!toolName || toolName == "verify") {
          await installSolanaVerify({
            os,
            version,
          });
        }
        if (!toolName || toolName == "yarn") {
          await installYarn({
            os,
            version,
          });
        }

        if (pathsToRefresh.length > 0) {
          console.log(
            "\nClose and reopen your terminal to apply the required",
            "PATH changes \nor run the following in your existing shell:",
            "\n",
          );
          console.log(`export PATH="${pathsToRefresh.join(":")}:$PATH"`, "\n");
        }

        // if (tools.allInstalled) {
        //   return successOutro("All tools are installed!");
        // }

        // if (options.drink !== undefined) console.log(`drink: ${options.drink}`);

        // if (tool)
      })
  );

  // .addCommand(setupInstallCommand())
}
