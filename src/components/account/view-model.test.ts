import { describe, expect, it } from "vitest";

import { toAccountUser } from "@/components/account/view-model";
import type { Customer, CustomerAddress } from "@/lib/magento/types";

const address = (overrides: Partial<CustomerAddress> = {}): CustomerAddress => ({
  company: null,
  default_billing: false,
  ...overrides,
});

const customer = (overrides: Partial<Customer> = {}): Customer => ({
  firstname: "Carlos",
  lastname: "Mendoza",
  email: "carlos@example.com",
  addresses: null,
  ...overrides,
});

describe("toAccountUser", () => {
  it("builds the greeting name and initials from firstname and lastname", () => {
    const user = toAccountUser(customer());

    expect(user.name).toBe("Carlos M.");
    expect(user.initials).toBe("CM");
  });

  it("falls back to just the firstname when lastname is empty", () => {
    const user = toAccountUser(customer({ lastname: "" }));

    expect(user.name).toBe("Carlos");
    expect(user.initials).toBe("C");
  });

  it("takes the company from the default_billing address, not merely the first one", () => {
    const user = toAccountUser(
      customer({
        addresses: [
          address({ company: "Almacenes del Norte", default_billing: false }),
          address({ company: "Comercializadora ABC", default_billing: true }),
        ],
      }),
    );

    expect(user.company).toBe("Comercializadora ABC");
  });

  it("returns null company when addresses is null", () => {
    const user = toAccountUser(customer({ addresses: null }));

    expect(user.company).toBeNull();
  });

  it("returns null company when addresses is empty", () => {
    const user = toAccountUser(customer({ addresses: [] }));

    expect(user.company).toBeNull();
  });

  it("skips an address whose company is null when falling back to the first address with one", () => {
    const user = toAccountUser(
      customer({
        addresses: [
          address({ company: null, default_billing: false }),
          address({ company: "Ferretera del Valle", default_billing: false }),
        ],
      }),
    );

    expect(user.company).toBe("Ferretera del Valle");
  });

  it("trims stray whitespace from the Magento fields", () => {
    const user = toAccountUser(
      customer({
        firstname: "  Carlos  ",
        lastname: " Mendoza ",
        addresses: [address({ company: "  Comercial XYZ  ", default_billing: true })],
      }),
    );

    expect(user.name).toBe("Carlos M.");
    expect(user.initials).toBe("CM");
    expect(user.company).toBe("Comercial XYZ");
  });
});
