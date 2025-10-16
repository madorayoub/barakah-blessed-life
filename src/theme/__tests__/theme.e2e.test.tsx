/** @vitest-environment jsdom */

import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { ThemeProvider } from "@/components/theme/theme-provider"
import { ThemeToggle } from "@/components/theme/theme-toggle"

describe("theme integration", () => {
  it("mounts ThemeToggle within ThemeProvider", () => {
    if (!window.matchMedia) {
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: (query: string) => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => false,
        }),
      })
    }

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    )

    expect(document.documentElement.getAttribute("class")).not.toBeNull()
    expect(
      screen.getByRole("button", {
        name: /toggle theme/i,
      }),
    ).toBeTruthy()
  })
})
