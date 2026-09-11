import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

/* Adds the DOM matchers (toBeInTheDocument, toHaveAttribute, …) to `expect`. */
import "@testing-library/jest-dom/vitest";

/*
  Testing Library registers its own cleanup through the global `afterEach`,
  which only exists when Vitest runs with `globals: true`. This project uses
  explicit imports instead, so the unmount has to be wired by hand — without
  it every render stacks in the same document and queries start matching the
  previous test's markup.
*/
afterEach(cleanup);
