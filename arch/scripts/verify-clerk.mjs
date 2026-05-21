const secret = process.env.CLERK_SECRET_KEY;
if (!secret) {
  console.error("CLERK_SECRET_KEY is not set");
  process.exit(1);
}

const res = await fetch("https://api.clerk.com/v1/users/count", {
  headers: { Authorization: `Bearer ${secret}` },
});

if (!res.ok) {
  console.error("clerk ping failed:", res.status, await res.text());
  process.exit(1);
}

const data = await res.json();
console.log("clerk ok ✓ — current users:", data);
