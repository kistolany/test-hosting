export const mockAuthUsers = [
  {
    username: "admin.main",
    password: "admin123",
    role: "admin",
    displayName: "Admin Main",
  },
  {
    username: "admin.ops",
    password: "admin123",
    role: "admin",
    displayName: "Admin Ops",
  },
  {
    username: "dara.sok",
    password: "staff123",
    role: "staff",
    displayName: "Dara Sok",
  },
  {
    username: "chantrea.meng",
    password: "staff123",
    role: "staff",
    displayName: "Chantrea Meng",
  },
  {
    username: "viewer.demo",
    password: "viewer123",
    role: "staff",
    displayName: "Viewer Demo",
  },
];

export function findMockUser(username, password) {
  const uname = String(username || "").trim().toLowerCase();
  const pass = String(password || "");

  return (
    mockAuthUsers.find(
      (user) => user.username.toLowerCase() === uname && user.password === pass
    ) || null
  );
}
