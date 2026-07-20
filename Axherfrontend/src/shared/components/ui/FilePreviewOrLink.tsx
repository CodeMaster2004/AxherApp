// src/components/ui/FilePreviewOrLink.tsx
interface FilePreviewOrLinkProps {
  file: File | null;
  url?: string;
  type: "image" | "video";
  label: string;
}

export default function FilePreviewOrLink({ file, url, type, label }: FilePreviewOrLinkProps) {
  if (file) return <p>Archivo seleccionado: {file.name}</p>;
  if (!url) return null;

  if (type === "image") {
    return (
      <div style={{ margin: '10px 0' }}>
        <img src={url} alt={label} style={{ maxWidth: 120, borderRadius: 8 }} />
      </div>
    );
  }
  // Para video, solo muestra el enlace
  return (
    <div style={{ margin: '10px 0' }}>
      <a href={url} target="_blank" rel="noopener noreferrer">{label}</a>
    </div>
  );
}