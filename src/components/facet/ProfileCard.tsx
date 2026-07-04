import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Profile } from '@/hooks/use-profile';
import { RANKS, rankSpriteStyle } from '@/lib/ranks';

interface ProfileCardProps {
  profile: Profile;
  email?: string;
}

const ProfileCard = ({ profile, email }: ProfileCardProps) => {
  const selectedMedals = RANKS.filter((r) => profile.medals?.includes(r.name));

  return (
    <div className="glass overflow-hidden rounded-2xl border border-white/10">
      <div
        className="h-28 w-full bg-cover bg-center"
        style={{
          backgroundImage: profile.banner_url
            ? `url(${profile.banner_url})`
            : 'linear-gradient(120deg, hsl(var(--glow) / 0.35), transparent)',
        }}
      />
      <div className="-mt-10 flex items-end gap-4 px-6">
        <div className="relative h-20 w-20 shrink-0">
          <Avatar className="h-20 w-20 border-4 border-background">
            <AvatarImage src={profile.avatar_url ?? undefined} alt={profile.nickname} />
            <AvatarFallback className="bg-secondary text-lg font-semibold">
              {profile.nickname?.slice(0, 2).toUpperCase() || '??'}
            </AvatarFallback>
          </Avatar>
          {profile.frame_url && (
            <img
              src={profile.frame_url}
              alt=""
              className="pointer-events-none absolute -inset-2 h-24 w-24 select-none object-contain"
            />
          )}
        </div>
        <div className="pb-2">
          <p
            className="font-display text-xl font-bold leading-tight"
            style={{ color: profile.nickname_color }}
          >
            {profile.nickname || 'Игрок'}
          </p>
          {email && <p className="text-xs text-muted-foreground">{email}</p>}
        </div>
      </div>

      {selectedMedals.length > 0 && (
        <div className="flex flex-wrap gap-2 px-6 pb-5 pt-4">
          {selectedMedals.map((m) => (
            <div
              key={m.name}
              title={m.name}
              className="overflow-hidden rounded-lg border border-white/60 bg-white"
              style={rankSpriteStyle(m, 40)}
            />
          ))}
        </div>
      )}
      {selectedMedals.length === 0 && <div className="pb-5" />}
    </div>
  );
};

export default ProfileCard;
