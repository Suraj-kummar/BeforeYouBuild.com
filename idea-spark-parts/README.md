# BeforeYouBuild — Split Archive (20 Parts)

This folder contains the full **BeforeYouBuild** project split into **20 equal parts** for easy distribution.

## 📦 Files
| Part | File | Size |
|------|------|------|
| 01 | BeforeYouBuild.part01.bin | ~47 KB |
| 02 | BeforeYouBuild.part02.bin | ~47 KB |
| ... | ... | ... |
| 20 | BeforeYouBuild.part20.bin | ~47 KB |

**Total compressed size:** ~951 KB

## 🔧 How to Reassemble

### Windows (PowerShell)
```powershell
$parts = Get-ChildItem -Filter "BeforeYouBuild.part*.bin" | Sort-Object Name
$out = [System.IO.File]::Create("BeforeYouBuild_full.zip")
foreach ($p in $parts) {
    $bytes = [System.IO.File]::ReadAllBytes($p.FullName)
    $out.Write($bytes, 0, $bytes.Length)
}
$out.Close()
Expand-Archive -Path "BeforeYouBuild_full.zip" -DestinationPath "."
Write-Host "Done! Project extracted."
```

### Mac / Linux (bash)
```bash
cat BeforeYouBuild.part*.bin > BeforeYouBuild_full.zip
unzip BeforeYouBuild_full.zip
```

## 🚀 After Extraction

```bash
cd idea-spark
bun install        # Install dependencies
cp .env.example .env.local   # Add your API keys
bun run dev        # Start dev server → http://localhost:8080
```

## 🔑 Required API Keys (add to .env.local)
- `VITE_SUPABASE_URL` — from supabase.com
- `VITE_SUPABASE_ANON_KEY` — from supabase.com  
- `ANTHROPIC_API_KEY` — from console.anthropic.com

---
Built with ❤️ using React + TanStack Router + Claude AI + Supabase
