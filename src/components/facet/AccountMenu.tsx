import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/hooks/use-auth';
import { useProfile } from '@/hooks/use-profile';
import GoogleSignInButton from '@/components/facet/GoogleSignInButton';
import ProfileEditor from '@/components/facet/ProfileEditor';

const AccountMenu = () => {
  const { user, logout, loading } = useAuth();
  const { profile } = useProfile();

  if (loading) {
    return <div className="h-11 w-11 animate-pulse rounded-xl bg-white/5" />;
  }

  if (!user) {
    return <GoogleSignInButton />;
  }

  return (
    <div className="flex items-center gap-2">
      {profile && <ProfileEditor profile={profile} />}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="glass h-11 gap-2 rounded-xl border-white/10 px-2 hover:glow-ring">
            <Avatar className="h-7 w-7">
              <AvatarImage src={profile?.avatar_url ?? undefined} />
              <AvatarFallback className="bg-secondary text-xs">
                {(profile?.nickname || user.name || '??').slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span
              className="hidden max-w-[8rem] truncate text-sm sm:inline"
              style={{ color: profile?.nickname_color || undefined }}
            >
              {profile?.nickname || user.name}
            </span>
            <Icon name="ChevronDown" size={14} className="text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="glass min-w-[12rem] border-white/10">
          <DropdownMenuItem disabled className="opacity-100">
            <div className="flex flex-col">
              <span className="text-sm font-medium">{profile?.nickname || user.name}</span>
              <span className="text-xs text-muted-foreground">{user.email}</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout} className="gap-2 text-destructive focus:text-destructive">
            <Icon name="LogOut" size={14} />
            Выйти
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default AccountMenu;
