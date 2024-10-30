import picocolors from "picocolors";

/**
 * Print a plain message using clack's `outro`
 * (including a process exit code)
 */
export function titleMessage(msg: string) {
  console.log(picocolors.inverse(` ${msg} `));
}

/**
 * Display a yellow warning message without exiting the cli
 */
export function warnMessage(msg: string, highlight: boolean = false) {
  console.log(picocolors.yellow(msg));
}

/**
 * Show a cancel outro and exit the cli process
 */
export function cancelMessage(msg: string = "Operation canceled") {
  console.log(msg);
  // cancel(msg);
  process.exit();
}

/**
 * Show a cancel outro and exit the cli process
 */
export function warningOutro(msg: string = "Operation canceled") {
  warnMessage(msg);
  process.exit();
}

/**
 * Print a plain message using clack's `outro`
 * (including a process exit code)
 */
export function cancelOutro(msg: string = "Operation canceled") {
  console.log(picocolors.inverse(` ${msg} `), "\n");
  // outro(picocolors.inverse(` ${msg} `));
  process.exit(0);
}

/**
 * Print a blue notice message using clack's `outro`
 * (including a process exit code)
 */
export function noticeOutro(msg: string) {
  // outro(picocolors.bgBlue(` ${msg} `));
  console.log(picocolors.bgBlue(` ${msg} `), "\n");
  process.exit(0);
}

/**
 * Print a green success message using clack's `outro`
 * (including a process exit code)
 */
export function successOutro(msg: string = "Operation successful") {
  console.log(picocolors.bgGreen(` ${msg} `), "\n");
  // outro(picocolors.bgGreen(` ${msg} `));
  process.exit(0);
}

/**
 * Print a red error message using clack's `outro`
 * (including a process exit code)
 */
export function errorOutro(msg: string, title: string | null = null) {
  if (title) {
    console.log(picocolors.bgRed(` ${title} `));
    console.log(msg, "\n");
  } else console.log(picocolors.bgRed(` ${msg} `), "\n");
  process.exit(1);
}

/**
 * Display a error message with using clack
 * (including a process exit code)
 */
export function errorMessage(err: any, title: string = "An error occurred") {
  let message = "Unknown error";

  if (typeof err == "string") {
    message = err;
  } else if (err instanceof Error) {
    message = err.message;
  }

  errorOutro(message, title);
}