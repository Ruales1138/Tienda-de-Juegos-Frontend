import { AuthGuard } from "@/features/auth/components/AuthGuard";
import { PixelForgeHome } from "@/features/common/components/PixelForgeHome";

export default function CatalogPage() {
  return (
    <AuthGuard>
      <PixelForgeHome view="catalog" />
    </AuthGuard>
  );
}
