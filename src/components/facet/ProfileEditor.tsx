import { useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { Profile, useProfile } from '@/hooks/use-profile';
import { RANKS, rankSpriteStyle } from '@/lib/ranks';

interface ImageUploadRowProps {
  label: string;
  value: string | null;
  previewClassName: string;
  onUpload: (file: File) => void;
  uploading: boolean;
}

const ImageUploadRow = ({ label, value, previewClassName, onUpload, uploading }: ImageUploadRowProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-4">
        <div
          className={`shrink-0 overflow-hidden rounded-xl border border-white/10 bg-secondary bg-cover bg-center ${previewClassName}`}
          style={value ? { backgroundImage: `url(${value})` } : undefined}
        >
          {!value && (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <Icon name="ImagePlus" size={20} />
            </div>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          className="glass border-white/10 gap-2"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          <Icon name={uploading ? 'Loader2' : 'Upload'} size={16} className={uploading ? 'animate-spin' : ''} />
          {uploading ? 'Загрузка...' : 'Загрузить файл'}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onUpload(file);
            e.target.value = '';
          }}
        />
      </div>
    </div>
  );
};

const ProfileEditor = ({ profile }: { profile: Profile }) => {
  const { updateProfile, uploadImage } = useProfile();
  const [nickname, setNickname] = useState(profile.nickname);
  const [nicknameColor, setNicknameColor] = useState(profile.nickname_color);
  const [medals, setMedals] = useState<string[]>(profile.medals || []);
  const [uploadingKind, setUploadingKind] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleUpload = async (file: File, kind: 'avatar' | 'banner' | 'frame') => {
    setUploadingKind(kind);
    try {
      const url = await uploadImage(file, kind);
      if (url) {
        const field = `${kind}_url` as const;
        await updateProfile({ [field]: url });
      }
    } finally {
      setUploadingKind(null);
    }
  };

  const toggleMedal = (name: string) => {
    setMedals((prev) =>
      prev.includes(name) ? prev.filter((m) => m !== name) : [...prev, name]
    );
  };

  const saveTextFields = async () => {
    await updateProfile({ nickname, nickname_color: nicknameColor, medals });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="glass gap-2 border-white/10 hover:glow-ring">
          <Icon name="Pencil" size={16} />
          Настроить профиль
        </Button>
      </DialogTrigger>
      <DialogContent className="glass max-h-[85vh] overflow-y-auto border-white/10 sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Профиль игрока</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="appearance" className="mt-2">
          <TabsList className="glass grid w-full grid-cols-2 border border-white/10 bg-transparent">
            <TabsTrigger value="appearance">Оформление</TabsTrigger>
            <TabsTrigger value="medals">Медали</TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label>Никнейм</Label>
              <div className="flex items-center gap-3">
                <Input
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Твой ник"
                  className="bg-secondary/60"
                />
                <label className="relative h-10 w-10 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-white/10">
                  <span className="absolute inset-0" style={{ background: nicknameColor }} />
                  <input
                    type="color"
                    value={nicknameColor}
                    onChange={(e) => setNicknameColor(e.target.value)}
                    className="absolute inset-0 cursor-pointer opacity-0"
                  />
                </label>
              </div>
              <p className="font-display text-lg" style={{ color: nicknameColor }}>
                {nickname || 'Предпросмотр ника'}
              </p>
            </div>

            <ImageUploadRow
              label="Аватар"
              value={profile.avatar_url}
              previewClassName="h-16 w-16 rounded-full"
              uploading={uploadingKind === 'avatar'}
              onUpload={(f) => handleUpload(f, 'avatar')}
            />

            <ImageUploadRow
              label="Баннер профиля"
              value={profile.banner_url}
              previewClassName="h-16 w-28 rounded-xl"
              uploading={uploadingKind === 'banner'}
              onUpload={(f) => handleUpload(f, 'banner')}
            />

            <ImageUploadRow
              label="Рамка аватара (PNG с прозрачностью)"
              value={profile.frame_url}
              previewClassName="h-16 w-16 rounded-full"
              uploading={uploadingKind === 'frame'}
              onUpload={(f) => handleUpload(f, 'frame')}
            />

            <Button onClick={saveTextFields} className="w-full gap-2 glow-ring">
              <Icon name="Check" size={16} />
              Сохранить
            </Button>
          </TabsContent>

          <TabsContent value="medals" className="pt-4">
            <p className="mb-4 text-sm text-muted-foreground">
              Выбери медали, которые будут показаны возле твоего ника
            </p>
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
              {RANKS.map((rank) => {
                const active = medals.includes(rank.name);
                return (
                  <button
                    key={rank.name}
                    onClick={() => toggleMedal(rank.name)}
                    title={rank.name}
                    className={`relative overflow-hidden rounded-xl border-2 bg-white p-1 transition-all ${
                      active ? 'border-white glow-ring scale-105' : 'border-transparent opacity-60 hover:opacity-90'
                    }`}
                  >
                    <div className="mx-auto" style={rankSpriteStyle(rank, 48)} />
                    {active && (
                      <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-black/80 text-white">
                        <Icon name="Check" size={10} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <Button onClick={saveTextFields} className="mt-6 w-full gap-2 glow-ring">
              <Icon name="Check" size={16} />
              Сохранить медали
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditor;
