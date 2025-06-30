import { NavItem } from "@/components/nav-item";
import { UserAccountNav } from "@/components/user-account-nav";
import { getUserRole } from "@/lib/get-user-role";

export async function MainNav() {
  const role = await getUserRole();
  const isAdmin = role === 'admin';

  return (
    <nav className="flex h-16 items-center justify-between border px-4">
      <div className="flex space-x-4">
        <NavItem href="/">Home</NavItem>
        <NavItem href="/itinerary">Create Itinerary</NavItem>
        <NavItem href="/dashboard">Dashboard</NavItem>
        {isAdmin && (
          <>
            <NavItem href="/admin">Admin</NavItem>
            <NavItem href="/client">Client</NavItem>
            <NavItem href="/server">Server</NavItem>
            <NavItem href="/protected">Protected</NavItem>
          </>
        )}
      </div>
      <UserAccountNav />
    </nav>
  );
}
