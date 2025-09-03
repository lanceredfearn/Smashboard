import { Link } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useAnnouncements } from '@/state/useAnnouncements';

export default function TournamentSidebar() {
  const announcements = useAnnouncements((s) => s.announcements);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link
              to="/"
              className="flex w-full items-center rounded-md px-2 py-1 hover:bg-accent hover:text-accent-foreground"
            >
              Home
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarGroup>
          <SidebarGroupLabel>Rules</SidebarGroupLabel>
          <SidebarGroupContent>
            <ul className="list-disc pl-4 text-xs space-y-1">
              <li>Games to 11 points.</li>
              <li>Win by 2.</li>
              <li>Switch sides at 6.</li>
            </ul>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Announcements</SidebarGroupLabel>
          <SidebarGroupContent>
            {announcements.length === 0 && (
              <p className="text-xs text-muted-foreground">No announcements yet.</p>
            )}
            {announcements.map((a) => (
              <div key={a.id} className="mb-2">
                <div className="text-xs font-medium">
                  {a.tournament} – {new Date(a.date).toLocaleDateString()}
                </div>
                <ul className="ml-4 list-disc text-xs">
                  {a.winners.map((w) => (
                    <li key={w.name}>
                      {w.name}: {w.score}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
