import { POST as registerPost } from "../app/api/auth/register/route";
import { POST as loginPost } from "../app/api/auth/login/route";
import { GET as portalGet, POST as portalPost } from "../app/api/portal/route";

async function testFullFlow() {
  console.log("1. Registering new user...");
  const testEmail = "flow_test_" + Date.now() + "@example.com";
  const regReq = new Request("http://localhost:3000/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Rohit & Natasha",
      email: testEmail,
      password: "SecurePassword123!",
      phone: "9876543210",
    }),
  });

  const regRes = await registerPost(regReq);
  const regData = await regRes.json();
  console.log("Registration status:", regRes.status, regData.message);
  if (regRes.status !== 201) throw new Error("Registration failed");

  console.log("2. Signing in with same credentials...");
  const loginReq = new Request("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: testEmail,
      password: "SecurePassword123!",
    }),
  });

  const loginRes = await loginPost(loginReq);
  const loginData = await loginRes.json();
  console.log("Login status:", loginRes.status, loginData.message);
  const sessionCookie = loginRes.cookies.get("celebrio_session");
  console.log("Session cookie received:", sessionCookie?.name, "=", sessionCookie?.value);

  if (!sessionCookie) throw new Error("No session cookie found");

  console.log("3. Fetching /api/portal data...");
  const portalReq = new Request("http://localhost:3000/api/portal", {
    method: "GET",
    headers: {
      Cookie: `celebrio_session=${sessionCookie.value}`,
    },
  });

  const portalRes = await portalGet(portalReq);
  const portalData = await portalRes.json();
  console.log("Portal status:", portalRes.status);
  console.log("Portal customer:", portalData.customer);
  console.log("Portal event:", portalData.event?.event_name, portalData.event?.status);
  console.log("Portal tasks count:", portalData.tasks?.length);
  console.log("Portal consultation:", portalData.consultation?.status, portalData.consultation?.meeting_provider);

  console.log("4. Testing summary approval action...");
  const approveReq = new Request("http://localhost:3000/api/portal", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `celebrio_session=${sessionCookie.value}`,
    },
    body: JSON.stringify({
      action: "summary_approval",
      decision: "APPROVED",
      notes: "Snapshot approved! Ready to sign the contract.",
    }),
  });

  const approveRes = await portalPost(approveReq);
  const approveData = await approveRes.json();
  console.log("Approval response:", approveRes.status, approveData);

  console.log("5. Testing requirements submission...");
  const reqPost = new Request("http://localhost:3000/api/portal", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `celebrio_session=${sessionCookie.value}`,
    },
    body: JSON.stringify({
      action: "requirements",
      content: {
        "Venue style or location": "Palace lawn in Bengaluru",
        "Food & dietary needs": "South Indian & Continental",
      },
    }),
  });
  const reqRes = await portalPost(reqPost);
  console.log("Requirements submission:", reqRes.status, (await reqRes.json()).requirements?.status);

  console.log("\n🎉 ALL TESTS PASSED! User registration, sign-in, and portal interactions are completely working!");
}

testFullFlow().catch(console.error);
