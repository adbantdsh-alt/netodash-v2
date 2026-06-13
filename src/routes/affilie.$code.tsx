import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/affilie/$code")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/auth",
      search: { mode: "signup", ref: params.code } as any,
    });
  },
  component: () => null,
});
