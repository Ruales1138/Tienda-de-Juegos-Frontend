import { PixelForgeHome } from "@/features/common/components/PixelForgeHome";
import { AuthGuard } from "@/features/auth/components/AuthGuard";

export default function Home() {
  return (
    <AuthGuard>
      <PixelForgeHome />
    </AuthGuard>
  );
}
