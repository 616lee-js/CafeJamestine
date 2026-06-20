"use client";

import { useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const BUCKET = "images";

// Compresses client-side, uploads to the private `images` bucket, stores the object path.
// Replace deletes the previous object first; clear deletes it. No orphaned storage.
export function ImageUpload({
  label = "Image",
  pathPrefix,
  currentPath,
  currentUrl,
  onChange,
}: {
  label?: string;
  pathPrefix: string; // e.g. `<user_id>/coffees/<coffee_id>`
  currentPath: string | null;
  currentUrl: string | null;
  onChange: (path: string | null) => void;
}) {
  const [url, setUrl] = useState<string | null>(currentUrl);
  const [path, setPath] = useState<string | null>(currentPath);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setBusy(true);
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.8,
        maxWidthOrHeight: 1600,
        useWebWorker: true,
      });
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      const newPath = `${pathPrefix}/${crypto.randomUUID()}.${ext}`;
      const supabase = createClient();
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(newPath, compressed, {
          contentType: compressed.type || file.type || "image/jpeg",
        });
      if (error) throw error;
      if (path) await supabase.storage.from(BUCKET).remove([path]);
      const { data: signed } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(newPath, 3600);
      setPath(newPath);
      setUrl(signed?.signedUrl ?? null);
      onChange(newPath);
    } catch (e) {
      toast.error(`Upload failed: ${(e as Error).message}`);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function clear() {
    setBusy(true);
    const supabase = createClient();
    if (path) await supabase.storage.from(BUCKET).remove([path]);
    setPath(null);
    setUrl(null);
    onChange(null);
    setBusy(false);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-sm">{label}</Label>
      <div className="flex items-center gap-3">
        <div className="flex size-20 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="size-full object-cover" />
          ) : (
            <ImagePlus className="size-6 text-muted-foreground" />
          )}
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
          >
            {busy ? <Loader2 className="size-4 animate-spin" /> : null}
            {url ? "Replace" : "Upload"}
          </Button>
          {url && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={busy}
              onClick={clear}
            >
              <Trash2 className="size-4" />
              Remove
            </Button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
      </div>
    </div>
  );
}
