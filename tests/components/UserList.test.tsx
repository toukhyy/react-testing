import { render, screen } from "@testing-library/react";

import { User } from "../../src/entities";

import UserList from "../../src/components/UserList";

describe("UserList", () => {
  it("should render no users available when an empty array is provided", () => {
    render(<UserList users={[]} />);
    const text = screen.getByText(/no users /i);

    expect(text).toBeInTheDocument();
  });

  it("should render a list of users with links pointing to their profile", () => {
    const users: User[] = [
      { id: 1, name: "John Doe" },
      { id: 2, name: "Jane Doe" },
    ];

    render(<UserList users={users} />);

    users.forEach((user) => {
      const link = screen.getByRole("link", { name: user.name });

      expect(link).toHaveAttribute("href", `/users/${user.id}`);

      expect(link).toBeInTheDocument();
    });
  });
});
